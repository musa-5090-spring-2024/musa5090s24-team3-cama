import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Storage } from '@google-cloud/storage'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'raw_data/');

// Download the OPA Properties data as a geojson file
const url = 'https://opendata.arcgis.com/datasets/84baed491de44f539889f2af178ad85c_0.geojson';
const filename = path.join(DATA_DIR, 'pwd_parcels.geojson');

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

await fs.writeFile(filename, await response.text());

console.log(`Downloaded ${filename}`);

// Upload the downloaded file to cloud storage
const BUCKET_NAME = process.env.DATA_LAKE_BUCKET;
const blobname = 'pwd_parcels/pwd_parcels.geojson';

const storageClient = new Storage();
const bucket = storageClient.bucket(BUCKET_NAME);
await bucket.upload(filename, {
  destination: blobname,
});

console.log(`Uploaded ${filename} to ${BUCKET_NAME}`);