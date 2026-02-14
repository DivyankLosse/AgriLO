import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Paths
# Paths
DATA_PATH = "d:/Projects/Agri-Lo/Datasets/Crop_recommendation.csv"
# Use absolute path relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../models")
MODEL_PATH = os.path.join(MODEL_DIR, "soil_model.pkl")
LE_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

def train_soil_model():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        return

    # Create model directory if it doesn't exist
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    print("Loading Soil Dataset...")
    df = pd.read_csv(DATA_PATH)

    # Features and Target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    # Encode labels
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # Train
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Score
    score = model.score(X_test, y_test)
    print(f"Model Accuracy: {score * 100:.2f}%")

    # Save
    # Directory creation moved to start of function

    joblib.dump(model, MODEL_PATH)
    joblib.dump(le, LE_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_soil_model()
