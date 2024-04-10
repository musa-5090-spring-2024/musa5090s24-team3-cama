from dotenv import load_dotenv
load_dotenv()

import csv
import json
import os
import pathlib

import pyproj
from shapely import wkt
import functions_framework
from google.cloud import storage

DIRNAME = pathlib.Path(__file__).parent


@functions_framework.http
def model_phl_opa_properties(request):
    print('Building a model here...')

    prepared_filename = DIRNAME / 'phl_opa_properties.jsonl'
    modeled_filename = DIRNAME / 'phl_opa_properties.csv'

    bucket_name = os.getenv('musa5090s24_team3_prepared_data')
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Download the data from the bucket
    prepared_blobname = 'opa_properties/opa_properties.jsonl'
    blob = bucket.blob(prepared_blobname)
    blob.download_to_filename(prepared_filename)
    print(f'Downloaded to {prepared_filename}')

    # Load the jsonl file
    with open(prepared_filename, 'r') as f:
        reader = csv.DictReader(f)
        data = list(reader)
