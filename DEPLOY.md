gcloud functions deploy extract_opa_assessments \
--gen2 \
--region=us-us-east1 \
--runtime=nodejs20 \
--source=. \
--entry-point=extract_opa_assessments \
--service-account=514019878127-compute@developer.gserviceaccount.com \
--memory=4Gi \
--timeout=240s \
--trigger-http \
--no-allow-unauthenticated \ 
--set-env-vars=DATA_LAKE_BUCKET=musa509s24-team3,DATA_LAKE_DATASET=core.opa_assessments \

Powershell
$gcloud functions deploy extract_opa_assessments `
--gen2 `
--region=us-us-east1 `
--runtime=nodejs20 `
--source=. `
--entry-point=extract_opa_assessments `
--service-account=514019878127-compute@developer.gserviceaccount.com `
--memory=8Gi `
--timeout=480s `
--trigger-http `
--set-env-vars=DATA_LAKE_BUCKET=musa509s24-team3,DATA_LAKE_DATASET=core.opa_assessments `
--no-allow-unauthenticated