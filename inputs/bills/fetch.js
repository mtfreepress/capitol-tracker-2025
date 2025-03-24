import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeJson } from '../../process/utils.js';

// TODO: NEED TO ADD VOTES ONCE THEY START HAPPENING

const BILL_LIST_URL = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/list-bills-2.json';
const RAW_URL_BASE_BILLS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/bills-2/';
const RAW_URL_BASE_ACTIONS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/actions-2/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = __dirname;


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

const downloadFile = async (url, fileName, folderPath) => {
    try {
        const response = await fetch(url);
        if (response.status === 404) {
            console.warn(`File not found at ${url}`);
            return false;
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
        }
        const data = await response.json();
        const outputPath = path.join(folderPath, fileName);
        await writeJson(outputPath, data);
        return true;
    } catch (error) {
        console.error(`Error downloading ${fileName}:`, error.message);
        return false;
    }
};

const main = async () => {
    try {
        const billList = await fetchJson(BILL_LIST_URL);

        const downloadPromises = billList.map(async (bill) => {
            const billIdentifier = `${bill.billType}-${bill.billNumber}`;
            const folderPath = path.join(OUT_DIR, billIdentifier);

            await createFolderIfNotExists(folderPath);

            // Try direct downloads instead of checking API first
            const billFileName = `${billIdentifier}-data.json`;
            const actionFileName = `${billIdentifier}-actions.json`;

            const billFileUrl = `${RAW_URL_BASE_BILLS}${billFileName}`;
            const actionFileUrl = `${RAW_URL_BASE_ACTIONS}${actionFileName}`;

            const billDownloaded = downloadFile(billFileUrl, billFileName, folderPath);

            // console.time(`Download ${actionFileName}`);
            const actionDownloaded = downloadFile(actionFileUrl, actionFileName, folderPath);

            return Promise.all([billDownloaded, actionDownloaded]);
        });

        await Promise.all(downloadPromises);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

main();

// Leaving for when we migrate to a actions from interface:

// import fetch from 'node-fetch';
// import fs from 'fs/promises';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import { writeJson } from '../../process/utils.js';

// // TODO: Get rid of separate actions and votes once combined data is working

// const BILL_LIST_URL = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/list-bills-2.json';
// const GITHUB_API_URL_BILLS = 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/process/cleaned/bills-2';
// const RAW_URL_BASE_BILLS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/bills-2/';
// const GITHUB_API_URL_ACTIONS = 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/process/cleaned/actions-2';
// const RAW_URL_BASE_ACTIONS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/actions-2/';
// // const GITHUB_API_URL_MERGED_ACTIONS = 'https://api.github.com/repos/mtfreepress/legislative-interface/contents/process/cleaned/merged-actions-2';
// // const RAW_URL_BASE_MERGED_ACTIONS = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/main/process/cleaned/merged-actions-2/';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const OUT_DIR = __dirname;
// const DATA_DIR = path.join(__dirname, '../../src/data');

// const fetchJson = async url => {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch URL: ${url}, status: ${response.status}`);
//     }
//     return await response.json();
// };

// const createFolderIfNotExists = async folderPath => {
//     try {
//         await fs.mkdir(folderPath, { recursive: true });
//         console.log(`Created folder: ${folderPath}`);
//     } catch (error) {
//         if (error.code !== 'EEXIST') {
//             throw error;
//         }
//     }
// };

// const downloadFile = async (url, fileName, folderPath) => {
//     console.log(`Fetching ${url}`);
//     const data = await fetchJson(url);
//     const outputPath = path.join(folderPath, fileName);
//     await writeJson(outputPath, data);
//     console.log(`Saved ${fileName} to ${outputPath}`);
// };

// const main = async () => {
//     try {
//         console.log(`Fetching bill list from ${BILL_LIST_URL}`);
//         const billList = await fetchJson(BILL_LIST_URL);

//         console.log(`Fetching bill file list from ${GITHUB_API_URL_BILLS}`);
//         const billFiles = await fetchJson(GITHUB_API_URL_BILLS);

//         console.log(`Fetching action file list from ${GITHUB_API_URL_ACTIONS}`);
//         const actionFiles = await fetchJson(GITHUB_API_URL_ACTIONS);

//         // console.log(`Fetching merged action file list from ${GITHUB_API_URL_MERGED_ACTIONS}`);
//         // const mergedActionFiles = await fetchJson(GITHUB_API_URL_MERGED_ACTIONS);

//         const jsonBillFiles = billFiles.filter(file => file.name.endsWith('.json'));
//         const jsonActionFiles = actionFiles.filter(file => file.name.endsWith('.json'));
//         // const jsonMergedActionFiles = mergedActionFiles.filter(file => file.name.endsWith('.json'));

//         console.log(`Found bill JSON files:`, jsonBillFiles.map(file => file.name));
//         console.log(`Found action JSON files:`, jsonActionFiles.map(file => file.name));
//         // console.log(`Found merged action JSON files:`, jsonMergedActionFiles.map(file => file.name));

//         for (const bill of billList) {
//             const billIdentifier = `${bill.billType}-${bill.billNumber}`;
//             const folderPath = path.join(OUT_DIR, billIdentifier);

//             await createFolderIfNotExists(folderPath);

//             // Handle Bill Data
//             const billFileName = `${billIdentifier}-data.json`;
//             const billFileExists = jsonBillFiles.some(file => file.name === billFileName);

//             if (billFileExists) {
//                 const billFileUrl = `${RAW_URL_BASE_BILLS}${billFileName}`;
//                 await downloadFile(billFileUrl, billFileName, folderPath);
//             } else {
//                 console.warn(`Bill file not found for: ${billIdentifier}`);
//             }

//             // Handle Action Data
//             const actionFileName = `${billIdentifier}-actions.json`;
//             const actionFileExists = jsonActionFiles.some(file => file.name === actionFileName);

//             if (actionFileExists) {
//                 const actionFileUrl = `${RAW_URL_BASE_ACTIONS}${actionFileName}`;
//                 await downloadFile(actionFileUrl, actionFileName, folderPath);
//             } else {
//                 console.warn(`Action file not found for: ${billIdentifier}`);
//             }

//             // might need this later?
//             // Commented out fetching of matched actions
//             const matchedActionFileName = `${billIdentifier}-matched-actions.json`;
//             const matchedActionFileExists = jsonMatchedActionFiles.some(file => file.name === matchedActionFileName);

//             if (matchedActionFileExists) {
//                 const matchedActionFileUrl = `${RAW_URL_BASE_MATCHED_ACTIONS}${matchedActionFileName}`;
//                 await createFolderIfNotExists(MATCHED_ACTIONS_DIR);
//                 await downloadFile(matchedActionFileUrl, matchedActionFileName, MATCHED_ACTIONS_DIR);
//             } else {
//                 console.warn(`Matched action file not found for: ${billIdentifier}`);
//             }
//         }

//         // might need this later?
//         await createFolderIfNotExists(DATA_DIR);
//         await downloadFile(RAW_URL_BILL_LIST, 'bills-list.json', DATA_DIR);

//         // Fetch and save merged action files
//         // await createFolderIfNotExists(DATA_DIR);
//         // for (const file of jsonMergedActionFiles) {
//         //     const fileUrl = `${RAW_URL_BASE_MERGED_ACTIONS}${file.name}`;
//         //     await downloadFile(fileUrl, file.name, DATA_DIR);
//         // }

//         // console.log('### All bill, action, and merged action JSON files fetched successfully!');
//         console.log('### All bill and action JSON files fetched successfully!');
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// };

// main();