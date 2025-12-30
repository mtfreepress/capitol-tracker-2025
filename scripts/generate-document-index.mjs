import fs from 'fs';
import path from 'path';

// setting up generation for fiscal-notes and legal-notes just in case™
const documentTypes = ['amendments', 'fiscal-notes', 'legal-notes'];
const baseDir = path.join(process.cwd(), 'public');
const outputPath = path.join(baseDir, 'document-index.json');

console.log('Generating document index...');
const documentIndex = {};
const billsWithAmendments = [];

// iterate through each document type
documentTypes.forEach(type => {
    const typeDir = path.join(baseDir, type);
    if (!fs.existsSync(typeDir)) {
        console.log(`Directory doesn't exist: ${typeDir}`);
        documentIndex[type] = {};
        return;
    }

    documentIndex[type] = {};
    console.log(`Scanning ${type} directory...`);

    // get all bill folders
    try {
        const billDirs = fs.readdirSync(typeDir);

        billDirs.forEach(billDir => {
            const billPath = path.join(typeDir, billDir);
            if (fs.statSync(billPath).isDirectory()) {
                // read all docs
                const files = fs.readdirSync(billPath)
                    .filter(file => file.toLowerCase().endsWith('.pdf'))
                    .map(file => {
                        // format filename for display
                        let name = file.replace(/\.pdf$/i, '');

                        // extract any parenthetical suffixes like (1), (2) etc.
                        const suffixMatch = file.match(/\((\d+)\)\.pdf$/i);
                        const suffix = suffixMatch ? `(${suffixMatch[1]})` : '';

                        // special handling for HB-2 with section letters
                        if (billDir === 'HB-2') {
                            // pattern to match HB-2 amendment files with section codes
                            const sectionPattern = /([A-Z]{2})0*(\d+)\.(\d+)\.(\d+)\.([A-Z])\.(\d+)_[^_]+_(final-\w+)(?:\.pdf)?/i;
                            const sectionMatch = file.match(sectionPattern);

                            if (sectionMatch) {
                                const [_, prefix, billNum, major, minor, sectionLetter, amendNum, finalType] = sectionMatch;

                                // map section letters to names
                                const sectionMap = {
                                    'A': 'general-government',
                                    'B': 'health',
                                    'C': 'nat-resource-transportation',
                                    'D': 'public-safety',
                                    'E': 'k-12-education',
                                    'F': 'long-range',
                                    'O': 'global-amendment'
                                    // Might be `Office of Budget and Program Planning`? 
                                    // TODO: Find out what this is
                                };

                                const sectionName = sectionMap[sectionLetter.toUpperCase()] || sectionLetter;

                                // Add suffix to name if it exists
                                name = `${prefix}-${billNum}.${major}.${minor}.${sectionLetter}.${amendNum}.${sectionName}.${finalType}${suffix}`;

                                return {
                                    name: name,
                                    url: `/capitol-tracker-2025/${type}/${billDir}/${encodeURIComponent(file)}`
                                };
                            }
                        }

                        // Standard processing for all other bills
                        const matches = file.match(/([A-Z]{2})0*(\d+)((?:\.\d+)+(?:\.[A-Z]\.\d+)*)_[^_]+_(final-\w+)(?:\.pdf)?/i);
                        if (matches) {
                            const [_, prefix, billNum, versionInfo, finalType] = matches;
                            // Add suffix to the name
                            name = `${prefix}-${billNum}${versionInfo}.${finalType}${suffix}`;
                        }

                        return {
                            name: name,
                            url: `/capitol-tracker-2025/${type}/${billDir}/${encodeURIComponent(file)}`
                        };
                    })
                    .sort((a, b) => a.name.localeCompare(b.name));
                documentIndex[type][billDir] = files;
            }
        });
    } catch (error) {
        console.error(`Error processing ${type} directory:`, error);
        documentIndex[type] = {};
    }
});

if (documentIndex.amendments) {
    Object.keys(documentIndex.amendments).forEach(billId => {
        if (documentIndex.amendments[billId].length > 0) {
            // Convert from "HB-123" format to "HB 123" format for frontend use
            billsWithAmendments.push(billId.replace('-', ' '));
        }
    });
}

billsWithAmendments.sort((a, b) => {
    // extract bill type and number (ie "HB 123" -> ["HB", "123"])
    const [aType, aNumStr] = a.split(' ');
    const [bType, bNumStr] = b.split(' ');

    // alphabetical sort by bill type
    if (aType !== bType) {
        return aType.localeCompare(bType);
    }
    // sort by bill number
    return parseInt(aNumStr, 10) - parseInt(bNumStr, 10);
});

// save simple text file to generate amendments to speed things up
const billsWithAmendmentsPath = path.join(baseDir, 'bills-with-amendments.txt');
fs.writeFileSync(
    billsWithAmendmentsPath,
    billsWithAmendments.join('\n'),
    'utf8'
);

console.log(`Generated bills-with-amendments list with ${billsWithAmendments.length} bills`);

// write to index file
fs.writeFileSync(outputPath, JSON.stringify(documentIndex, null, 2));
console.log(`Document index created at ${outputPath}`);