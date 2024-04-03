import dotenv from 'dotenv';
dotenv.config();

import process from 'process';
import { BigQuery } from '@google-cloud/bigquery'

const Prepared_Bucket_Name = process.env.PREPARED_DATA_BUCKET;
const datasetName = process.env.INTERNAL_DATASET;

// Load the data into BigQuery as an external table
const preparedBlobname = 'opa_assessments/opa_assessments.jsonl';
const tableName = 'opa_assessments';
const tableUri = `gs://${Prepared_Bucket_Name}/${preparedBlobname}`;

const createTableQuery = `
CREATE OR REPLACE EXTERNAL TABLE ${datasetName}.${tableName} (
  \`parcel_number\` STRING,
  \`year\` STRING,
  \`market_value\` FLOAT64,
  \`taxable_land\` FLOAT64,
  \`taxable_building\` FLOAT64,
  \`exempt_land\` FLOAT64,
  \`exempt_building\` FLOAT64,
  \`objectid\` STRING
)
OPTIONS (
  format = 'JSON',
  uris = ['${tableUri}']
)
`;

const bigqueryClient = new BigQuery();
await bigqueryClient.query(createTableQuery);
console.log(`Loaded ${tableUri} into ${datasetName}.${tableName}`);
