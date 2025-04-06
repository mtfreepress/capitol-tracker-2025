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

// fetch with rate limit handling
const fetchWithRateLimitHandling = async (url, options = {}, retries = 3) => {
    let lastError;
    let waitTime = 1000; // start with 1 second backoff

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);

            // check if rate limited
            if (response.status === 403 || response.status === 429) {
                const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
                const rateLimitReset = response.headers.get('x-ratelimit-reset');
                const retryAfter = response.headers.get('retry-after');

                if (rateLimitRemaining === '0' && rateLimitReset) {
                    // Primary rate limit hit - wait until reset time
                    const resetTime = new Date(parseInt(rateLimitReset) * 1000);
                    const waitMs = resetTime - new Date() + 1000; // Add 1 second buffer

                    console.warn(`🛑 Rate limit exceeded! Waiting until ${resetTime.toLocaleTimeString()}...`);

                    if (waitMs > 0) {
                        await new Promise(resolve => setTimeout(resolve, waitMs));
                        continue; // retry after waiting
                    }
                } else if (retryAfter) {
                    // secondary rate limit with retry-after header
                    const waitSeconds = parseInt(retryAfter);
                    console.warn(`⚠️ Secondary rate limit hit. Waiting ${waitSeconds} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
                    continue; // Retry after waiting
                } else {
                    // secondary rate limit without guidance, use exponential backoff
                    console.warn(`⚠️ Rate limit hit. Using exponential backoff: ${waitTime}ms`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    waitTime *= 2; // exponential backoff
                    continue; // retry after waiting
                }
            }

            // check for other errors
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }

            return response;

        } catch (error) {
            lastError = error;

            if (attempt < retries) {
                console.warn(`Attempt ${attempt + 1}/${retries + 1} failed: ${error.message}. Retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                waitTime *= 2; // exponential backoff
            }
        }
    }

    throw lastError || new Error(`Failed after ${retries + 1} attempts`);
};

const fetchJson = async (url) => {
    const headers = process.env.GITHUB_TOKEN ? {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    } : {};

    const response = await fetchWithRateLimitHandling(url, { headers });
    return await response.json();
};

const createFolderIfNotExists = async folderPath => {
    try {
        await fs.mkdir(folderPath, { recursive: true });
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
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};

const downloadFile = async (url, fileName, tempFolderPath) => {
    try {
        const response = await fetchWithRateLimitHandling(url);

        const filePath = path.join(tempFolderPath, fileName);
        const data = await response.buffer();
        await fs.writeFile(filePath, data);
        return true;
    } catch (error) {
        console.error(`Failed to download ${fileName}: ${error.message}`);
        return false;
    }
};

const processBatch = async (items, batchSize, processFn) => {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} (${batch.length} items)`);
        const batchResults = await Promise.all(batch.map(processFn));
        results.push(...batchResults);
    }
    return results;
};

const fetchAllFiles = async (type) => {
    console.log(`Fetching all ${type}...`);
    
    // get the list of all directories (bill folders)
    const directories = await fetchJson(GITHUB_API_URLS[type]);
    const dirList = directories.filter(dir => dir.type === 'dir');
    console.log(`Found ${dirList.length} bill folders for ${type}`);
    
    // create temp directory
    const tempBaseDir = path.join(OUT_DIRS[type], '_temp');
    await createFolderIfNotExists(tempBaseDir);
    
    // process bills in batches
    await processBatch(dirList, 6, async (dir) => {
        try {
            const billContents = await fetchJson(dir.url);
            const pdfFiles = billContents.filter(file => file.name.endsWith('.pdf'));
            
            if (pdfFiles.length === 0) {
                console.log(`No PDF files found for ${dir.name}`);
                return;
            }
            
            // create a temp folder for this bill
            const tempFolderPath = path.join(tempBaseDir, dir.name);
            await createFolderIfNotExists(tempFolderPath);
            
            // download all PDF files to temp folder
            const downloadResults = await Promise.all(pdfFiles.map(pdf => {
                const fileUrl = `${RAW_URL_BASES[type]}${dir.name}/${pdf.name}`;
                return downloadFile(fileUrl, pdf.name, tempFolderPath);
            }));
            
            // check if all downloads were successful
            const allSuccessful = downloadResults.every(result => result);
            
            if (allSuccessful) {
                // all downloads succeeded, now we can safely replace the original files
                const finalFolderPath = path.join(OUT_DIRS[type], dir.name);
                await createFolderIfNotExists(finalFolderPath);
                
                // clear target directory
                await clearDirectory(finalFolderPath);
                
                // move all files from temp to final location
                const tempFiles = await fs.readdir(tempFolderPath);
                for (const file of tempFiles) {
                    const tempFilePath = path.join(tempFolderPath, file);
                    const finalFilePath = path.join(finalFolderPath, file);
                    await fs.rename(tempFilePath, finalFilePath);
                }
                
                console.log(`✓ Completed ${dir.name} (${pdfFiles.length} files)`);
            } else {
                console.error(`❌ Failed to download all files for ${dir.name}, keeping existing files`);
            }
            
            // clean up temp folder for this bill
            await clearDirectory(tempFolderPath);
            try {
                await fs.rmdir(tempFolderPath);
            } catch (e) {
                // ignore errors on temp directory removal
            }
            
        } catch (error) {
            console.error(`Error processing ${dir.name}: ${error.message}`);
        }
    });
    
    // clean temp directory at the end
    try {
        await clearDirectory(tempBaseDir);
        await fs.rmdir(tempBaseDir);
        console.log(`Cleaned up temporary files for ${type}`);
    } catch (e) {
        console.warn(`Warning: Could not remove temp directory: ${e.message}`);
    }
};

const main = async () => {
    try {
        console.log('Starting full download of all bill notes...');

        if (process.env.GITHUB_TOKEN) {
            console.log('✓ Using authenticated GitHub API requests (higher rate limits: 5000 requests/hour)');
        } else {
            console.warn('⚠️ No GITHUB_TOKEN found. Using unauthenticated requests (60 requests/hour limit).');
        }

        await fetchAllFiles('legalNotes');
        await fetchAllFiles('fiscalNotes');
        await fetchAllFiles('amendments');

        console.log('✅ Successfully downloaded all bill notes!');
    } catch (error) {
        console.error(`❌ Error downloading bill notes: ${error.message}`);
        process.exit(1);
    }
};

main();