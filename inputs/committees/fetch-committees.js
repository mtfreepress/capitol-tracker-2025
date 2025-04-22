import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { writeJson } from '../../process/utils.js';

const COMMITTEES_URL = 'https://raw.githubusercontent.com/mtfreepress/legislative-interface/refs/heads/main/process/cleaned/committees/committees.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TARGET_PATH = path.join(__dirname, '../../src/data/committees.json');

async function fetchCommittees() {
  try {
    // Fetch the committee data
    console.log(`Fetching committee data from ${COMMITTEES_URL}...`);
    
    const headers = process.env.GITHUB_TOKEN ? {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    } : {};
    
    const response = await fetch(COMMITTEES_URL, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch committees: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${data.length} committees.`);
    
    // Ensure the target directory exists
    const targetDir = path.dirname(TARGET_PATH);
    await fs.mkdir(targetDir, { recursive: true });
    
    // Write the data to the target file
    await writeJson(TARGET_PATH, data);
    console.log(`Committee data saved to ${TARGET_PATH}`);
    
  } catch (error) {
    console.error('Error fetching committee data:', error.message);
    process.exit(1);
  }
}

fetchCommittees();