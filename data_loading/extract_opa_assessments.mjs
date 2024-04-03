import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Storage } from '@google-cloud/storage'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'raw_data/');

// Download the OPA Properties data as a csv file
const url = 'https://opendata-downloads.s3.amazonaws.com/assessments.csv';
const filename = path.join(DATA_DIR, 'opa_assessments.csv');

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

await fs.writeFile(filename, await response.text());

console.log(`Downloaded ${filename}`);

// Upload the downloaded file to cloud storage
const BUCKET_NAME = process.env.DATA_LAKE_BUCKET;
const blobname = 'opa_assessments/opa_assessments.csv';

const storageClient = new Storage();
const bucket = storageClient.bucket(BUCKET_NAME);
await bucket.upload(filename, {
  destination: blobname,
});

console.log(`Uploaded ${filename} to ${BUCKET_NAME}`);