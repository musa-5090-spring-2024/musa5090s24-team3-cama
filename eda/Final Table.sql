-- Create the derived table with tax year, lower bound, upper bound, and property count columns
CREATE TABLE derived.tax_year_assessment_bins AS
WITH bin_edges AS (
  SELECT
    year,
    MIN(market_value) AS min_value,
    MAX(market_value) AS max_value,
    10000 AS bin_width -- Define the bin width, adjust as needed
  FROM
    `core.opa_assessments`
  GROUP BY
    year
)

SELECT
  year,
  lower_bound,
  upper_bound,
  COUNT(*) AS property_count
FROM (
  SELECT
    bin_edges.year AS year,
    IFNULL(CAST(FLOOR(market_value / bin_edges.bin_width) * bin_edges.bin_width AS INT64), 0) AS lower_bound,
    IFNULL(CAST(FLOOR(market_value / bin_edges.bin_width) * bin_edges.bin_width + bin_edges.bin_width AS INT64), bin_edges.max_value) AS upper_bound
  FROM
    `core.opa_assessments`,
    bin_edges
  WHERE
    market_value >= bin_edges.min_value
    AND market_value <= bin_edges.max_value
)
GROUP BY
  year,
  lower_bound,
  upper_bound
ORDER BY
  year,
  lower_bound;