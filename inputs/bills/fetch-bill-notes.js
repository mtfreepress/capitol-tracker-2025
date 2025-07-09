import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const UPDATE_URLS = {
    legalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/interface/legal-note-updates.json',
    fiscalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/interface/fiscal-note-updates.json',
    amendments: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/interface/amendment-updates.json',
    vetoLetters: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/interface/veto_letter_updates.json',
    billText: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/interface/bill_pdf_updates.json'
};

const RAW_URL_BASES = {
    legalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/legal-note-pdfs-2/',
    fiscalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/fiscal-note-pdfs-2/',
    amendments: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/amendment-pdfs-2/',
    vetoLetters: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/veto-letter-pdfs-2/',
    billText: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/bill-text-pdfs-2/',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIRS = {
    legalNotes: path.join(__dirname, '../../public/legal-notes'),
    fiscalNotes: path.join(__dirname, '../../public/fiscal-notes'),
    amendments: path.join(__dirname, '../../public/amendments'),
    vetoLetters: path.join(__dirname, '../../public/veto-letters'),
    billText: path.join(__dirname, '../../public/bill-texts')
};

const fetchJson = async (url) => {
    const headers = process.env.GITHUB_TOKEN ? {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    } : {};

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch JSON from ${url}, status: ${response.status}`);
    }
    return await response.json();
};

const createFolderIfNotExists = async folderPath => {
    try {
        await fs.mkdir(folderPath, { recursive: true });
        // console.log(`Created folder: ${folderPath}`);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
};

const clearDirectory = async (dirPath) => {
    try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
            await fs.unlink(path.join(dirPath, file));
            // console.log(`Deleted old file: ${file}`);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

// Fixed version that uses arrayBuffer instead of buffer
const downloadFile = async (url, fileName, folderPath, clearBefore = true) => {
    // console.log(`Fetching ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
    }
    
    // Clear any existing files before downloading new one, only if flag is set
    if (clearBefore) {
        await clearDirectory(folderPath);
    }
    
    // Fix: use arrayBuffer instead of buffer
    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer);
    const outputPath = path.join(folderPath, fileName);
    await fs.writeFile(outputPath, data);
    // console.log(`Saved ${fileName} to ${outputPath}`);
};

// const downloadTextFile = async (url, outputPath) => {
//     console.log(`Downloading text file from ${url}`);
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch text file: ${url}, status: ${response.status}`);
//     }
    
//     const text = await response.text();
//     await fs.writeFile(outputPath, text);
//     console.log(`Saved text file to ${outputPath}`);
// };

const processNotes = async (type) => {
    console.log(`Processing ${type} updates...`);
    
    // Fetch the updates list
    const updates = await fetchJson(UPDATE_URLS[type]);
    
    for (const update of updates) {
        const billFolder = `${update.billType}-${update.billNumber}`;
        const folderPath = path.join(OUT_DIRS[type], billFolder);
        await createFolderIfNotExists(folderPath);

        const fileUrl = `${RAW_URL_BASES[type]}${billFolder}/${update.fileName}`;
        // For notes, we only keep the latest version
        await downloadFile(fileUrl, update.fileName, folderPath, true);
    }
};

const processAmendments = async () => {
    console.log('Processing amendments updates...');
    
    // Fetch the updates list
    const updates = await fetchJson(UPDATE_URLS.amendments);
    
    // Group amendments by bill for easier processing
    const billAmendments = {};
    
    for (const amendment of updates) {
        const billKey = `${amendment.billType}-${amendment.billNumber}`;
        if (!billAmendments[billKey]) {
            billAmendments[billKey] = [];
        }
        billAmendments[billKey].push(amendment);
    }
    
    // Process each bill's amendments
    for (const [billKey, amendments] of Object.entries(billAmendments)) {
        console.log(`Processing amendments for ${billKey}...`);
        const folderPath = path.join(OUT_DIRS.amendments, billKey);
        await createFolderIfNotExists(folderPath);
        
        // Check what files already exist to avoid re-downloading
        let existingFiles = [];
        try {
            existingFiles = await fs.readdir(folderPath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        
        // Download each amendment
        for (const amendment of amendments) {
            const fileUrl = `${RAW_URL_BASES.amendments}${billKey}/${amendment.fileName}`;
            
            // Skip if file already exists
            if (existingFiles.includes(amendment.fileName)) {
                console.log(`File already exists, skipping: ${amendment.fileName}`);
                continue;
            }
            
            // Download without clearing directory (to keep all versions)
            await downloadFile(fileUrl, amendment.fileName, folderPath, false);
        }
    }
};

const main = async () => {
    try {
        // Create the output directories if they don't exist
        for (const dir of Object.values(OUT_DIRS)) {
            await createFolderIfNotExists(dir);
        }
        
        // Process legal and fiscal notes (keeping only latest)
        await processNotes('legalNotes');
        await processNotes('fiscalNotes');
        await processNotes('vetoLetters');
        
        // Process amendments (keeping all versions)
        await processAmendments();
        
        // Download the bills-with-amendments.txt file
        // await downloadTextFile(BILLS_WITH_AMENDMENTS_URL, BILLS_WITH_AMENDMENTS_OUTPUT);
        
        console.log("All downloads completed successfully");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

main();