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

const downloadFile = async (url, fileName, folderPath) => {
    console.log(`Fetching ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
    }
    const data = await response.buffer();
    const outputPath = path.join(folderPath, fileName);
    await fs.writeFile(outputPath, data);
    console.log(`Saved ${fileName} to ${outputPath}`);
};

const processDirectory = async (apiUrl, rawUrlBase, outDir) => {
    console.log(`Fetching directory list from ${apiUrl}`);
    const directories = await fetchJson(apiUrl);

    for (const dir of directories) {
        if (dir.type === 'dir') {
            const folderName = dir.name;
            const folderPath = path.join(outDir, folderName);
            await createFolderIfNotExists(folderPath);

            const files = await fetchJson(dir.url);
            for (const file of files) {
                if (file.name.endsWith('.pdf')) {
                    const fileUrl = `${rawUrlBase}${folderName}/${file.name}`;
                    await downloadFile(fileUrl, file.name, folderPath);
                }
            }
        }
    }
};

const main = async () => {
    try {
        await processDirectory(GITHUB_API_URLS.legalNotes, RAW_URL_BASES.legalNotes, OUT_DIRS.legalNotes);
        await processDirectory(GITHUB_API_URLS.fiscalNotes, RAW_URL_BASES.fiscalNotes, OUT_DIRS.fiscalNotes);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

main();