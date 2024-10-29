import pandas as pd
import os
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestRegressor #random forest regressor not used from OLD regressor model
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error, median_absolute_error
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# set your file path 
file_path = r'data.csv'


# we had isues with the file path so we addded error detection ensure everything was laoding prperlyusing os.path.exists function
if os.path.exists(file_path):
    print(f"File path is: {file_path} data is readable")
    try:
        data = pd.read_csv(file_path)
        print("File is loaded")
    except Exception as e:
        print(f"file cannot be read {e}")
        exit()
    
    # dipslay the first few rows of the dataset to verify the data is infact being read
    print(data.head())

    # removing outliers using iqr before it is loaded into the model 

    Q1 = data['Price'].quantile(0.25)
    Q3 = data['Price'].quantile(0.75)
    IQR = Q3 - Q1
    low = Q1 - 1.5 * IQR  
    high = Q3 + 1.5 * IQR  
    data = data[(data['Price'] >= low) & (data['Price'] <= high)]
    print(f"data structure after outliers were removed: {data.shape}")
    # Assign features and target
    X = data.drop('Price', axis=1)  # Drop the target variable
    y = data['Price']  # Set the target variable

    # # log transofrmation will be done ONLy for numerical features like room, distance and postcode
    #the for loop will iterate over each feature in teh dataframe (x) will help transform the data if it is skewed 
    #this aided with performance metrics
    numerical_features = ['Rooms', 'Distance', 'Postcode']
    for feature in numerical_features:
        X[feature] = np.log1p(X[feature])

    #apply the same log transfoormation but for the target variable.
    y = np.log1p(y)  

    # siilar to our neural.py we have utlised pandaas to convert catagorical vairables into be replaced by dummy varibles to make data more readable, instnace binary number for each cartegory
    X = pd.get_dummies(X, drop_first=True)

    # stadardize the numerical features specifcially, attempts to make each feature with a std of 1
    scaler = StandardScaler()
    X[numerical_features] = scaler.fit_transform(X[numerical_features])

    # create and split data into training and testing sets, testing size is at 20%
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # hyperperameters are set uses the gridsearchcv lirbary 
    hyper_params = {
        'n_estimators': [100, 200], #num of trees 100-200 trees
        'max_depth': [3, 5, 7], #depth of trees of 3,5,7 prevents genraelisation
        'learning_rate': [0.01, 0.05, 0.1], #reduce learning rate improve accruacy of estimation
        'subsample': [0.7, 0.8, 1.0], #introducing sub samples had improved perfomance as it introduces randomness to the training process
        'colsample_bytree': [0.7, 0.8, 1.0] #simialr to above it will cause the model to learn from a subset of features my reduce overfitting
    }
#initilise teh xgb model 'reg:squarederror' specifies the learning task is regression in effrot to minimize the MSE
    xgb_model = XGBRegressor(random_state=42, objective='reg:squarederror')
#initlises the 'gridsearchcv' from the lirbary and intilises teh hyperpermeters that are tested. cv= 5 indicating the dataset will be split into 5 parts and the model will be validated 5 times. 
    grid_search = GridSearchCV(estimator=xgb_model, param_grid=hyper_params, cv=5, n_jobs=-1, scoring='neg_mean_squared_error') #n_jobs use max perfromance of cpu cores, target metric used is MSE 
    grid_search.fit(X_train, y_train) #evaluates all the combinations of the hyperpermeters using cross validation, 

    # training the model thoguh selecting the best hyper permameters 
    best_params = grid_search.best_params_
    print(f'the best hyperpermeters are: {best_params}')

    # initlize the model again but with the best hyperparameters
    model = XGBRegressor(**best_params, random_state=42, objective='reg:squarederror')

    # model is now trainied 
    model.fit(X_train, y_train)

    # make predictions based on input features in X_test
    y_pred = model.predict(X_test)
    y_test_exp = np.expm1(y_test)  # inverse log as it was previously log transformed earlier 
    y_pred_exp = np.expm1(y_pred)

    # calcualte the metrics
    mse = mean_squared_error(y_test_exp, y_pred_exp)
    rmse = np.sqrt(mse)  # add RMSE
    r2 = r2_score(y_test_exp, y_pred_exp)
    mae = mean_absolute_error(y_test_exp, y_pred_exp)
    
    mean_price = y_test_exp.mean()
    predicted_mean_price = y_pred_exp.mean()

    # print the results
    print(f'Mean Squared Error: {mse}')
    print(f'Root Mean Squared Error (RMSE): {rmse}')
    print(f'R^2 Score: {r2}')
    print(f'Mean Absolute Error: {mae}')

    print(f'Mean Actual Price: {mean_price}')
    print(f'Mean Predicted Price: {predicted_mean_price}')

    # [removed] out of curiousity implmented feature importances to see how signficant each feature is 
    

    # plotting actual and predicted prices in 
    def plot_results(y_test_exp, y_pred_exp):
        # scatter plot of actual vs predicted prices
        plt.figure(figsize=(10, 6))
        plt.scatter(y_test_exp, y_pred_exp, edgecolor='k', alpha=0.7)
        plt.plot([y_test_exp.min(), y_test_exp.max()], [y_test_exp.min(), y_test_exp.max()], 'r--', lw=2) #make the red lien more thicker with lw = 2 
        plt.title('Actual and predicted prices')
        plt.xlabel('Actual Prices')
        plt.ylabel('Predicted Prices')
        plt.grid(True)
        plt.show()

    
    # immediately graph the results
    plot_results(y_test_exp, y_pred_exp)
#again part of file checking as we had issues with file path.
else:
    print(f"the path is not found: {file_path}.")
