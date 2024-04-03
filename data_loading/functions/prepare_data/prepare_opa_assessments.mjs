import dotenv from 'dotenv';
dotenv.config();

import * as csv from 'csv/sync';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAW_DATA_DIR = path.join(__dirname, 'raw_data/');
const PREPARED_DATA_DIR = path.join(__dirname, 'prepared_data/');

const rawFilename = path.join(RAW_DATA_DIR, 'opa_assessments.csv');
const preparedFilename = path.join(PREPARED_DATA_DIR, 'opa_assessments.jsonl');

const bucketName = process.env.DATA_LAKE_BUCKET;
const storageClient = new Storage();
const bucket = storageClient.bucket(bucketName);

// Download the raw data from cloud storage
const rawBlobname = 'opa_assessments/opa_assessments.csv';
await bucket.file(rawBlobname).download({ destination: rawFilename });
console.log(`Downloaded to ${rawFilename}`);

// Load the data from the CSV file
const data = csv.parse(
  await fs.readFile(rawFilename),
  { columns: true },
);

// Write the data to a JSONL file
const f = await fs.open(preparedFilename, 'w');
for (const row of data) {
  await f.write(JSON.stringify(row) + '\n');
}

console.log(`Processed data into ${preparedFilename}`);

// Upload the prepared data to cloud storage
const Prepared_Bucket_Name = process.env.PREPARED_DATA_BUCKET;
const prepared_bucket = storageClient.bucket(Prepared_Bucket_Name);
const preparedBlobname = 'opa_assessments/opa_assessments.jsonl';
await prepared_bucket.upload(preparedFilename, { destination: preparedBlobname });
console.log(`Uploaded to ${preparedBlobname}`);

// Load the data into BigQuery as an external table
const datasetName = process.env.DATA_LAKE_DATASET;
const tableName = 'opa_assessments';
const tableUri = `gs://${bucketName}/${preparedBlobname}`;

const createTableQuery = `
CREATE OR REPLACE EXTERNAL TABLE ${datasetName}.${tableName}
OPTIONS (
  format = 'JSON',
  uris = ['${tableUri}']
)
`;

const bigqueryClient = new BigQuery();
await bigqueryClient.query(createTableQuery);
console.log(`Loaded ${tableUri} into ${datasetName}.${tableName}`);