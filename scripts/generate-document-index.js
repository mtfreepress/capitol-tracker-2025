const fs = require('fs');
const path = require('path');

// setting up generation for fiscal-notes and legal-notes just in case™
const documentTypes = ['amendments', 'fiscal-notes', 'legal-notes'];
const baseDir = path.join(process.cwd(), 'public');
const outputPath = path.join(baseDir, 'document-index.json');

console.log('Generating document index...');
const documentIndex = {};

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
                        // make the document name more human-readable?
                        let name = file.replace(/\.pdf$/i, '');
                        const matches = file.match(/([A-Z]+\d+)\.(\d+)\.(\d+)_(.+)\.pdf/i);
                        if (matches) {
                            const [_, billCode, major, minor, description] = matches;
                            name = `Version ${major}.${minor}: ${description.replace(/-/g, ' ')}`;
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

// write to index file
fs.writeFileSync(outputPath, JSON.stringify(documentIndex, null, 2));
console.log(`Document index created at ${outputPath}`);