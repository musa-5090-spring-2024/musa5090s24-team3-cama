CREATE OR REPLACE VIEW core.opa_assessments AS
SELECT
    parcel_number AS property_id,
    *
FROM source.opa_assessments;