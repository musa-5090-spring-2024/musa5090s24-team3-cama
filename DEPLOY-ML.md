```shell
gcloud functions deploy model_phl_opa_properties \
--gen2 \
--region=us-east1 \
--runtime=python312 \
--project=musa509s24-team3 \
--source=. \
--entry-point=model_phl_opa_properties \
--service-account=data-pipeline-robot-2024@musa509s24-team3.iam.gserviceaccount.com	 \
--memory=8Gi \
--timeout=600s \
--trigger-http \
--no-allow-unauthenticated  
```
