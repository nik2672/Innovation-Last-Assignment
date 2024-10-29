import pandas as pd

# setting our file path 
file_path = r'C:\swinburne\year 2\semester 2\innovation\data\data1\dataless\datalessF.csv'  
data = pd.read_csv(file_path)

# finds and cecks for missing values in the 'price' column 
print("Missing values in 'Price' column before imputation:")
print(data['Price'].isnull().sum())

# impuation is used to replace the missing values with median values 
data['Price'] = data['Price'].fillna(data['Price'].median())

# check  for missing values in the "Price" column after imputation is finidshed 
print("\nMissing values in 'Price' column after imputation:")
print(data['Price'].isnull().sum())

#  the cleaned dataset is saved a new file in the same directory ensuring it is renamed as 'cleaned_datalessF.csv'
cleaned_file_path = r'C:\swinburne\year 2\semester 2\innovation\data\data1\dataless\cleaned_datalessF.csv'  # Save the cleaned file
data.to_csv(cleaned_file_path, index=False)

print("\nData cleaning complete. The cleaned file has been saved as:", cleaned_file_path)
