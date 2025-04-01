import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const GITHUB_API_URLS = {
    legalNotes: 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/interface/downloads/legal-note-pdfs-2',
    fiscalNotes: 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/interface/downloads/fiscal-note-pdfs-2',
    amendments: 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/interface/downloads/amendment-pdfs-2'
};

const RAW_URL_BASES = {
    legalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/legal-note-pdfs-2/',
    fiscalNotes: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/fiscal-note-pdfs-2/',
    amendments: 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/amendment-pdfs-2/'
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIRS = {
    legalNotes: path.join(__dirname, '../../public/legal-notes'),
    fiscalNotes: path.join(__dirname, '../../public/fiscal-notes'),
    amendments: path.join(__dirname, '../../public/amendments')
};

const processBatch = async (items, batchSize, processFn) => {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        // console.log(`Processing batch ${Math.ceil((i+1)/batchSize)}/${Math.ceil(items.length/batchSize)} (${batch.length} items)`);
        const batchResults = await Promise.all(batch.map(processFn));
        results.push(...batchResults);
    }
    return results;
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

const downloadFile = async (url, fileName, folderPath) => {
    // console.log(`Fetching ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
    }
    
    const data = await response.buffer();
    const outputPath = path.join(folderPath, fileName);
    await fs.writeFile(outputPath, data);
    // console.log(`Saved ${fileName} to ${outputPath}`);
};
const fetchAllFiles = async (type) => {
    // console.log(`Fetching all ${type}...`);
    
    // get the list of all directories (bill folders)
    const directories = await fetchJson(GITHUB_API_URLS[type]);
    const dirList = directories.filter(dir => dir.type === 'dir');
    
    // batch size of 10 to avoid making GH angry
    await processBatch(dirList, 10, async (dir) => {
        try {
            const billContents = await fetchJson(dir.url);
            const pdfFiles = billContents.filter(file => file.name.endsWith('.pdf'));
            
            if (pdfFiles.length === 0) return;
            
            const folderPath = path.join(OUT_DIRS[type], dir.name);
            await createFolderIfNotExists(folderPath);
            
            // clear directory once per bill
            await clearDirectory(folderPath);
            
            // download all PDF files in parallel
            await Promise.all(pdfFiles.map(pdf => {
                const fileUrl = `${RAW_URL_BASES[type]}${dir.name}/${pdf.name}`;
                return downloadFile(fileUrl, pdf.name, folderPath);
            }));
            
            console.log(`Completed ${dir.name} (${pdfFiles.length} files)`);
        } catch (error) {
            console.error(`Error processing ${dir.name}: ${error.message}`);
        }
    });
};

const main = async () => {
    try {
        console.log('Starting full download of all bill notes...');
        await fetchAllFiles('legalNotes');
        await fetchAllFiles('fiscalNotes');
        await fetchAllFiles('amendments');
        console.log('Successfully downloaded all bill notes!');
    } catch (error) {
        console.error(`Error downloading all bill notes: ${error.message}`);
        process.exit(1);
    }
};

main();