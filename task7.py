# The python code for cloud function (Task 07)

import os
from google.cloud import bigquery

def generate_derived_table(request):
    project_id = os.environ['GCP_PROJECT']
    
    # Read the SQL query from the file
    with open('create_derived_tax_year_assessment_bins.sql', 'r') as sql_file:
        sql_query = sql_file.read()
    
    # Run the SQL query
    client = bigquery.Client(project=project_id)
    query_job = client.query(sql_query)
    query_job.result()
    
    return 'Table generated successfully', 200