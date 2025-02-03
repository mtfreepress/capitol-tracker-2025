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
    const apiUrl = new URL(url);
    apiUrl.searchParams.set('ref', 'main');

    const response = await fetch(apiUrl.toString(), {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch JSON from ${url}, status: ${response.status}`);
    }
    return response.json();
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

const downloadFile = async (url, fileName, folderPath, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url);
            if (response.status === 403) {
                console.warn(`Rate limit hit for ${fileName}, waiting before retry...`);
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                continue;
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
            }
            const data = await response.buffer();
            const outputPath = path.join(folderPath, fileName);
            await fs.writeFile(outputPath, data);
            console.log(`Saved ${fileName} to ${outputPath}`);
            return;
        } catch (error) {
            if (attempt === retries) {
                console.error(`Failed to download ${fileName} after ${retries} attempts: ${error.message}`);
                // Continue with next file instead of throwing
                return;
            }
        }
    }
};

const processDirectory = async (apiUrl, rawUrlBase, outDir) => {
    console.log(`Fetching directory list from ${apiUrl}`);
    try {
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
    } catch (error) {
        console.error(`Error processing directory ${apiUrl}: ${error.message}`);
        // Continue with next directory instead of failing completely
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