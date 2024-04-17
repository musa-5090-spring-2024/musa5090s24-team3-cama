from dotenv import load_dotenv
import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.model_selection import train_test_split
import pandas_gbq
import functions_framework
from google.cloud import bigquery
load_dotenv()


@functions_framework.http
def model_phl_opa_properties(request):
    client = bigquery.Client()
    query = """
        SELECT
            *
        FROM `musa509s24-team3.core.opa_properties`
    """
    properties = client.query_and_wait(query).to_dataframe()
    properties.replace('', np.nan, inplace=True)
    properties['year_built'] = properties['year_built'].astype(np.float64)
    properties['zip_code'] = properties['zip_code'].astype(np.float64)
    properties['total_livable_area'] = properties['total_livable_area'].astype(float)
    properties['total_area'] = properties['total_area'].astype(float)
    properties['sale_price'] = properties['sale_price'].astype(float)
    properties['number_stories'] = properties['number_stories'].astype(float)
    properties['number_of_bathrooms'] = properties['number_of_bathrooms'].astype(float)
    properties['number_of_bedrooms'] = properties['number_of_bedrooms'].astype(float)
    properties['garage_type'] = properties['garage_type'].astype(float)
    properties['fireplaces'] = properties['fireplaces'].astype(float)
    properties['category_code'] = properties['category_code'].astype(int)

    properties_mdl = properties[
        ['property_id',
         'basements',
         'category_code',
         'census_tract',
         'central_air',
         'fireplaces',
         'garage_type',
         'market_value',
         'number_of_bedrooms',
         'number_of_bathrooms',
         'number_of_rooms',
         'number_stories',
         'parcel_number',
         'quality_grade',
         'sale_price',
         'type_heater',
         'total_area',
         'total_livable_area',
         'view_type',
         'building_code_description_new',
         'zip_code',
         'year_built',
         'parcel_number']]
    properties_mdl['Age'] = 2024 - properties_mdl['year_built']
    properties_mdl['numRooms'] = np.select([(properties_mdl['number_of_bedrooms'].isna()) & (~properties_mdl['number_of_bathrooms'].isna()),
                                            (properties_mdl['number_of_bathrooms'].isna()) & (~properties_mdl['number_of_bedrooms'].isna()),
                                            (properties_mdl['number_of_bathrooms'].isna()) & (properties_mdl['number_of_bedrooms'].isna())],
                                           [properties_mdl['number_of_bathrooms'], properties_mdl['number_of_bedrooms'], 0], default=properties_mdl['number_of_bedrooms'] + properties_mdl['number_of_bathrooms'])
    properties_mdl['view'] = np.select([properties_mdl['view_type'].isin(['I', '0']) | properties_mdl['view_type'].isna(),
                                        properties_mdl['view_type'].isin(['A', 'B', 'C'])], ['Typical', 'Scenic'], default='Urban')
    properties_mdl['hasAC'] = np.where(properties_mdl['central_air'].isin(['1', 'Y']), 'Y', 'N')
    properties_mdl['hasBasement'] = np.where(properties_mdl['basements'].isin(['1', '4', 'A', 'B', 'C', 'D', 'E', 'F']), 'Y', 'N')
    properties_mdl['hasFireplace'] = np.where((properties_mdl['fireplaces'] == 0) | (properties_mdl['fireplaces'].isna()), 'N', 'Y')
    properties_mdl['hasGarage'] = np.where((properties_mdl['garage_type'] == 0) | (properties_mdl['garage_type'].isna()), 'N', 'Y')
    properties_mdl['stories'] = np.where(properties_mdl['number_stories'] == 1, 'single', np.where(properties_mdl['number_stories'] == 2, 'double', 'multiple'))
    properties_mdl['area'] = np.where(properties_mdl['total_livable_area'] > properties_mdl['total_area'], properties_mdl['total_livable_area'], properties_mdl['total_area'])
    properties_mdl['hasHeater'] = np.where((properties_mdl['type_heater'] == 0) | (properties_mdl['type_heater'].isna()), 'N', 'Y')
    properties_mdl['quality'] = np.where(properties_mdl['quality_grade'].isin(['4', '5', '6', 'A', 'A+', 'A-', 'B', 'B+', 'B-', 'S', 'S+', 'X-']), 'Good', 'Bad')
    properties_mdl['logarea'] = np.log(properties_mdl['area'])
    condition1 = properties_mdl['building_code_description_new'].str.contains('ROW', case=False).fillna(False).values
    condition2 = properties_mdl['building_code_description_new'].str.contains('TWIN', case=False).fillna(False).values
    properties_mdl['buildingdis'] = np.select([condition1, condition2], ['Row', 'TWIN'], default='Other')
    properties_mdl = properties_mdl[
        (properties_mdl['Age'] < 500) &
        (properties_mdl['sale_price'] < 2000000) &
        (properties_mdl['sale_price'] > 10000) &  # Include the condition for sale_price
        (properties_mdl['numRooms'] < 30) &
        (properties_mdl['total_livable_area'] != 0) &
        (~properties_mdl['total_area'].isna()) &
        (properties_mdl['area'] < 50000)]
    X = properties_mdl[['Age', 'numRooms', 'hasBasement', 'hasAC', 'quality', 'buildingdis', 'hasFireplace', 'hasGarage', 'stories', 'logarea', 'view', 'zip_code', 'parcel_number']]
    y = properties_mdl['sale_price']
    X['zip_code'] = X['zip_code'].astype(str)
    X = X.dropna(subset=['zip_code'])
    X_encoded = pd.get_dummies(X, columns=['zip_code', 'hasAC', 'hasBasement', 'quality', 'buildingdis', 'hasFireplace', 'hasGarage', 'stories', 'view'], drop_first=True)
    X_encoded = X_encoded.astype(float)
    # fit the regression here
    X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.7, random_state=42)
    reg = sm.OLS(y_train, X_train).fit()
    y_pred = reg.predict(X_encoded)  # X_test
    # results = pd.DataFrame({'Predicted_Sale_Price': y_pred})
    results = pd.DataFrame({'Property': properties_mdl['property_id'], 'Predicted_Sale_Price': y_pred})
    pandas_gbq.to_gbq(results, 'derived.opa_properties_model', project_id="musa509s24-team3", if_exists='replace')
    print('Processed data into derived.opa_properties_model')
    return 'Success'
