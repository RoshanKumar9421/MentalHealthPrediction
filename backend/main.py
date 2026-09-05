import os
import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# --------------------------------------------------
# Load trained model
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Mental_Health_Model.pkl")

model = joblib.load(MODEL_PATH)


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Student Stress Prediction API",
    description="API for predicting student stress level using ML",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Input schema
# --------------------------------------------------

class StudentData(BaseModel):

    age: int = Field(..., ge=13, le=100)

    gender: str

    country: str

    academic_level: str

    most_used_platform: str

    daily_screen_time: float = Field(..., ge=0, le=24)

    daily_phone_usage: float = Field(..., ge=0, le=24)

    news_platform: str

    entertainment_platform: str

    daily_study_hours: float = Field(..., ge=0, le=24)

    daily_physical_activity: float = Field(..., ge=0, le=24)

    sleep_hours: float = Field(..., ge=0, le=24)

    sleep_time: str


# --------------------------------------------------
# Home route
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Student Stress Prediction API is running",
        "status": "success"
    }


# --------------------------------------------------
# Prediction route
# --------------------------------------------------

@app.post("/predict")
def predict_stress(data: StudentData):

    # Convert input into DataFrame
    input_data = pd.DataFrame([{
        "age": data.age,
        "gender": data.gender,
        "country": data.country,
        "academic_level": data.academic_level,
        "most_used_platform": data.most_used_platform,
        "daily_screen_time": data.daily_screen_time,
        "daily_phone_usage": data.daily_phone_usage,
        "news_platform": data.news_platform,
        "entertainment_platform": data.entertainment_platform,
        "daily_study_hours": data.daily_study_hours,
        "daily_physical_activity": data.daily_physical_activity,
        "sleep_hours": data.sleep_hours,
        "sleep_time": data.sleep_time
    }])

    # Prediction
    prediction = model.predict(input_data)[0]

    # Prediction probability
    probabilities = model.predict_proba(input_data)[0]

    classes = model.classes_

    probability_dict = {
        str(cls): round(float(prob) * 100, 2)
        for cls, prob in zip(classes, probabilities)
    }

    confidence = round(float(max(probabilities)) * 100, 2)

    return {
        "stress_level": str(prediction),
        "confidence": confidence,
        "probabilities": probability_dict
    }