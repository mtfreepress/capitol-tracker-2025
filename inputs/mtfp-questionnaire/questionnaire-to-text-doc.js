const fs = require('fs')
const csv = require('async-csv')
const yaml = require('js-yaml')


const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

const writeYaml = (path, data) => {
    const yamlData = yaml.dump(data, {
        lineWidth: -1,
        quotingType: '"',
    });
    fs.writeFileSync(path, yamlData, 'utf8')
    console.log('YAML written to', path)
}

const getCsv = async (path) => {
    const string = fs.readFileSync(path, 'utf-8')
    return csv.parse(string, {
        bom: true,
        columns: true,
        relax_column_count: true,
    })
}

const SURVEY_KEYS = [
    'us-senate',
    'us-house',
    'governor',
    'secretary-of-state',
    'attorney-general',
    'superintendent',
    'state-auditor',
    'supco',
    'supco-clerk',
    'psc',
]

const EXCLUDE_Qs = [
    ['4/29/2024 14:11:21', 'Jon Tester'], // Duplicate response
    ['2024/04/24 2:21:34 PM CST', 'Ben Alke'] // Troll response
]

const STANDARD_Qs = [
    'Timestamp',
    'Email Address',
    'Candidate name',
    'Campaign press contact',
    'How does your professional and life experience qualify you for the position you’re seeking?',
    'Where do you live currently? Where were you born? How long have you lived in Montana?',
    'What other biographical information do you want potential voters to know about you?',
    'What age will you be as of Election Day, Nov. 5, 2024?',
    "In a single sentence, how would you summarize why you're running for this office this year?",
    // Remaining Qs are tailored to specific race
]

function extractPressContacts(row) {
    return {
        candidate: row['Candidate name'],
        press_contact: row['Campaign press contact'],
    }
}

function processResponse(row) {
    const bioQs = STANDARD_Qs.slice(4,)
    const candidateName = row['Candidate name']
    const bioMaterial = bioQs.map(q => ({ question: q, response: row[q] + '\n\n' }))
    const questionnaireKeys = Object.keys(row).slice(STANDARD_Qs.length,)
    const questionnaireMaterial = questionnaireKeys.map(q => ({ question: q, response: row[q] + '\n\n' }))

    const output = {
        candidateName,
        nameSlug: 'tk-eric-will-fill-out',
        bioMaterial,
        mtfpTitle: 'TK here',
        mtfpWrittenBio: 'TK MTFP-written bio\n\n',
        questionnaireMaterial,
    }
    return output
}

async function main() {

    const raw = await (await Promise.all(SURVEY_KEYS.map(race => getCsv(`./inputs/mtfp-questionnaire/raw/questionnaire-2024-${race}.csv`)))).flat()
    const filtered = raw.filter(row => !EXCLUDE_Qs.find(d => ((d[0] === row['Timestamp']) && (d[1] === row['Candidate name']))))

    // const pressContacts = filtered.map(extractPressContacts)
    // writeJson('./inputs/mtfp-questionnaire/press-contacts.json', pressContacts)
    // Leaving the resulting file out of source control to avoid putting stuff we said we'd keep internal on GitHub

    const responses = filtered.map(processResponse)
    writeYaml('./inputs/mtfp-questionnaire/copy-for-edit.yaml', responses)






    // processResponse(raw[0])
    // console.log(Object.keys(raw[0]))
}



main()