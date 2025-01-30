import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const GITHUB_API_URL = 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/interface/downloads/legal-note-pdfs-2';
const RAW_URL_BASE = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/interface/downloads/legal-note-pdfs-2/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, '../../public/legal-notes');

const fetchJson = async url => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
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

const downloadFile = async (url, fileName, folderPath) => {
    console.log(`Fetching ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
    }
    const data = await response.buffer();
    const outputPath = path.join(folderPath, fileName);
    await fs.writeFile(outputPath, data);
    // console.log(`Saved ${fileName} to ${outputPath}`);
};

const main = async () => {
    try {
        // console.log(`Fetching directory list from ${GITHUB_API_URL}`);
        const directories = await fetchJson(GITHUB_API_URL);

        for (const dir of directories) {
            if (dir.type === 'dir') {
                const folderName = dir.name;
                const folderPath = path.join(OUT_DIR, folderName);
                await createFolderIfNotExists(folderPath);

                const files = await fetchJson(dir.url);
                for (const file of files) {
                    if (file.name.endsWith('.pdf')) {
                        const fileUrl = `${RAW_URL_BASE}${folderName}/${file.name}`;
                        await downloadFile(fileUrl, file.name, folderPath);
                    }
                }
            }
        }

        console.log('### All legal note PDFs fetched successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

main();