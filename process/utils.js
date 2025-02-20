import fs from 'fs'
import { sync as globSync } from 'glob'
import csv from 'async-csv'
import YAML from 'yaml'

export const getJson = (path) => JSON.parse(fs.readFileSync(path))

export const collectJsons = (glob_path) => {
    const files = globSync(glob_path)
    return files.map(getJson)
}

export const getYaml = (path) => YAML.parse(fs.readFileSync(path, 'utf8'))

export const collectYamls = (glob_path) => {
    const files = globSync(glob_path)
    return files.map(getYaml)
}

export const getText = (path) => fs.readFileSync(path, 'utf8')

export const getCsv = async (path) => {
    const string = fs.readFileSync(path, 'utf-8')
    return csv.parse(string, {
        bom: true,
        columns: true,
        relax_column_count: true,
    })
}

export const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 4), function (err) {
        if (err) throw err;
    // Too verbose for prod. Ends up spitting out thousands of lines in GHA
        // console.log('    JSON written to', path);
    });
}

export const writeCsv = (path, array) => {
    const headers = Object.keys(array[0])
    const output = [headers.join(',')] // first row
    array.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || ""
            return `"${String(value).replace(/"/g, '""')}"`
        }) 
        output.push(values.join(','))
    })
    fs.writeFile(path, output.join('\n'), function (err) {
        if (err) throw err;
        // console.log('    CSV written to', path);
    });
}