import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const GITHUB_API_URLS = {
    legalNotes: 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/interface/downloads/legal-note-pdfs-2',
    fiscalNotes: 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/interface/downloads/fiscal-note-pdfs-2'
};

const RAW_URL_BASES = {
    legalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/legal-note-pdfs-2/',
    fiscalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/fiscal-note-pdfs-2/'
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIRS = {
    legalNotes: path.join(__dirname, '../../public/legal-notes'),
    fiscalNotes: path.join(__dirname, '../../public/fiscal-notes')
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
        console.log(`Created folder: ${folderPath}`);
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
            console.log(`Deleted old file: ${file}`);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

const downloadFile = async (url, fileName, folderPath) => {
    console.log(`Fetching ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
    }
    
    // Clear any existing files before downloading new one
    await clearDirectory(folderPath);
    
    const data = await response.buffer();
    const outputPath = path.join(folderPath, fileName);
    await fs.writeFile(outputPath, data);
    console.log(`Saved ${fileName} to ${outputPath}`);
};

const fetchAllFiles = async (type) => {
    console.log(`Fetching all ${type}...`);
    
    // Get the list of all directories (bill folders)
    const directories = await fetchJson(GITHUB_API_URLS[type]);
    
    for (const dir of directories) {
        if (dir.type !== 'dir') continue;
        
        // Get contents of each bill directory
        const billContents = await fetchJson(dir.url);
        const pdfFiles = billContents.filter(file => file.name.endsWith('.pdf'));
        
        if (pdfFiles.length === 0) continue;
        
        // Create local folder for this bill
        const folderPath = path.join(OUT_DIRS[type], dir.name);
        await createFolderIfNotExists(folderPath);
        
        // Download all PDFs for this bill
        for (const pdf of pdfFiles) {
            const fileUrl = `${RAW_URL_BASES[type]}${dir.name}/${pdf.name}`;
            await downloadFile(fileUrl, pdf.name, folderPath);
        }
    }
};

const main = async () => {
    try {
        console.log('Starting full download of all bill notes...');
        await fetchAllFiles('legalNotes');
        await fetchAllFiles('fiscalNotes');
        console.log('Successfully downloaded all bill notes!');
    } catch (error) {
        console.error(`Error downloading all bill notes: ${error.message}`);
        process.exit(1);
    }
};

main();