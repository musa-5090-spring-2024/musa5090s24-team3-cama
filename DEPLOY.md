```shell
gcloud functions deploy model_phl_opa_properties \
--gen2 \
--region=us-central1 \
--runtime=python312 \
--project=musa509s24-team3 \
--source=. \
--entry-point=model_phl_opa_properties \
--service-account=data-pipeline-robot-2024@musa509s24-team3.iam.gserviceaccount.com	 \
--memory=4Gi \
--timeout=240s \
--trigger-http \
--no-allow-unauthenticated  
```
