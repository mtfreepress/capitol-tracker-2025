import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeJson } from '../../process/utils.js';

const BILL_LIST_URL = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/list-bills-2.json';
const GITHUB_API_URL_BILLS = 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/process/cleaned/bills-2';
const GITHUB_API_URL_ACTIONS = 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/process/cleaned/actions-2';
const RAW_URL_BASE_BILLS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/bills-2/';
const RAW_URL_BASE_ACTIONS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/actions-2/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, '../bills');

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
        console.log(`Created folder: ${folderPath}`);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
};

const downloadFile = async (url, fileName, folderPath) => {
    console.log(`Fetching ${url}`);
    const data = await fetchJson(url);
    const outputPath = path.join(folderPath, fileName);
    await writeJson(outputPath, data);
    console.log(`Saved ${fileName} to ${outputPath}`);
};

const main = async () => {
    try {
        console.log(`Fetching bill list from ${BILL_LIST_URL}`);
        const billList = await fetchJson(BILL_LIST_URL);

        console.log(`Fetching bill file list from ${GITHUB_API_URL_BILLS}`);
        const billFiles = await fetchJson(GITHUB_API_URL_BILLS);

        console.log(`Fetching action file list from ${GITHUB_API_URL_ACTIONS}`);
        const actionFiles = await fetchJson(GITHUB_API_URL_ACTIONS);

        const jsonBillFiles = billFiles.filter(file => file.name.endsWith('.json'));
        const jsonActionFiles = actionFiles.filter(file => file.name.endsWith('.json'));

        console.log(`Found bill JSON files:`, jsonBillFiles.map(file => file.name));
        console.log(`Found action JSON files:`, jsonActionFiles.map(file => file.name));

        for (const bill of billList) {
            const billIdentifier = `${bill.billType}${bill.billNumber}`;
            const folderPath = path.join(OUT_DIR, billIdentifier);

            await createFolderIfNotExists(folderPath);

            // Handle Bill Data
            const billFileName = `${billIdentifier}-data.json`;
            const billFileExists = jsonBillFiles.some(file => file.name === billFileName);

            if (billFileExists) {
                const billFileUrl = `${RAW_URL_BASE_BILLS}${billFileName}`;
                await downloadFile(billFileUrl, billFileName, folderPath);
            } else {
                console.warn(`Bill file not found for: ${billIdentifier}`);
            }

            // Handle Action Data
            const actionFileName = `${billIdentifier}-actions.json`;
            const actionFileExists = jsonActionFiles.some(file => file.name === actionFileName);

            if (actionFileExists) {
                const actionFileUrl = `${RAW_URL_BASE_ACTIONS}${actionFileName}`;
                await downloadFile(actionFileUrl, actionFileName, folderPath);
            } else {
                console.warn(`Action file not found for: ${billIdentifier}`);
            }
        }

        console.log('### All bill and action JSON files fetched successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

main();
