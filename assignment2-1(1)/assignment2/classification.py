import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

# file path is sett
file_path = r'data.csv'

data = pd.read_csv(file_path)

# remove outliers before the data is processed by teh model
Q1 = data['Price'].quantile(0.25)
Q3 = data['Price'].quantile(0.75)
IQR = Q3 - Q1
low = Q1 - 1.5 * IQR
high = Q3 + 1.5 * IQR

# save the initial dimensions of our data before outlier removal to see how many rows are removed
initial_dimensions = data.shape

# removing the outliars
data = data[(data['Price'] >= low) & (data['Price'] <= high)]

# print out the dimentions of our dataset after removing outleirs 
print(f"Initial data dimentions: {initial_dimensions}")
print(f"Data dimentions after removing outliers: {data.shape}")
print(f"Datasets removed: {initial_dimensions[0] - data.shape[0]}")

# creating price categories for the model to classify price ranges
price_ranges = [0, 700000, 1400000, float('inf')]
price_categories = ['Low', 'Medium', 'High']
data['Price_Category'] = pd.cut(data['Price'], bins=price_ranges, labels=price_categories)

# the (type) feature is better to be converted into a numerical form eg h = 0, townhouse = 1 
EncodeLabel = LabelEncoder()
data['Type_Encoded'] = EncodeLabel.fit_transform(data['Type'])

# setting target vairable to price_category
features = data[['Rooms', 'Type_Encoded', 'Postcode', 'Distance']]
target = data['Price_Category']

# our data into training and testing sets with the test set being 20%
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# we standardize the features as it prevents features like distance dominating during k-nn
Standardize = StandardScaler()
X_train_scaled = Standardize.fit_transform(X_train)
X_test_scaled = Standardize.transform(X_test)

#   using kNrighboursClassfier library we imported we set number of neighbors k=5 (you can tune this)
Knn = KNeighborsClassifier(n_neighbors=5)

# begin to trian our k-NN model
Knn.fit(X_train_scaled, y_train)

# create  predictions using 20% test set
y_pred = Knn.predict(X_test_scaled)

# calcaulte accuracy and create a classification report using inbuilt functions from scikit-learn we imported
accuracy = accuracy_score(y_test, y_pred)
classification_rep = classification_report(y_test, y_pred)

# print the accuracy and classificaiton  report
print(f'accuracy: {accuracy}')
print(f'classification report:\n{classification_rep}') #includes metrics like precision, recall, f1-score and how many points of data are in each class 'support' 
#also incldues macro avergae, and weighted average 

#  display our results in a confusion matrix using the seaborn lirbary 
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8,6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Low', 'Medium', 'High'], yticklabels=['Low', 'Medium', 'High'])
plt.ylabel('Actual values')
plt.xlabel('Predicted values')
plt.title('Confusion Matrix')
plt.show()

# to look at our results in a little more detail we have to convert back to original test dataframe that isnt scaled so we can print results below 
X_test_original = pd.DataFrame(X_test, columns=features.columns)
X_test_original['Actual_Price_Category'] = y_test
X_test_original['Predicted_Price_Category'] = y_pred

# results for each house classified into low, med and high are printed to ensure the model is indeed attempting to classify
print("\nHouses in Low category:")
print(X_test_original[X_test_original['Predicted_Price_Category'] == 'Low'])

print("\nHouses in Medium category:")
print(X_test_original[X_test_original['Predicted_Price_Category'] == 'Medium'])

print("\nHouses in the High category:")
print(X_test_original[X_test_original['Predicted_Price_Category'] == 'High'])
