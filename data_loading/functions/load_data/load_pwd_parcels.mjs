import dotenv from 'dotenv';
dotenv.config();

import process from 'process';
import { BigQuery } from '@google-cloud/bigquery'

const Prepared_Bucket_Name = process.env.PREPARED_DATA_BUCKET;
const datasetName = process.env.INTERNAL_DATASET;

// Load the data into BigQuery as an external table
const preparedBlobname = 'pwd_parcels/pwd_parcels.jsonl';
const tableName = 'pwd_parcels';
const tableUri = `gs://${Prepared_Bucket_Name}/${preparedBlobname}`;

const createTableQuery = `
CREATE OR REPLACE EXTERNAL TABLE ${datasetName}.${tableName} (
  \`OBJECTID\` STRING,
  \`PARCELID\` STRING,
  \`TENCODE\` STRING,
  \`ADDRESS\` STRING,
  \`OWNER1\` STRING,
  \`OWNER2\` STRING,
  \`BLDG_CODE\` STRING,
  \`BLDG_DESC\` STRING,
  \`BRT_ID\` STRING,
  \`NUM_BRT\` INT64,
  \`NUM_ACCOUNTS\` INT64,
  \`GROSS_AREA\` FLOAT64,
  \`PIN\` STRING,
  \`SHAPE__AREA\` FLOAT64,
  \`SHAPE__LENGTH\` FLOAT64,
  \`geog\` STRING
)
OPTIONS (
  format = 'JSON',
  uris = ['${tableUri}']
)
`;

const bigqueryClient = new BigQuery();
await bigqueryClient.query(createTableQuery);
console.log(`Loaded ${tableUri} into ${datasetName}.${tableName}`);
