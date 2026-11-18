import os
import joblib
import pandas as pd

from typing import Optional
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field




BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Mental_Health_Model.pkl")

model = joblib.load(MODEL_PATH)




app = FastAPI(
    title="Student Stress Prediction API",
    description="API for predicting student stress level using ML",
    version="1.0.0"
)




@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    print("=== Validation Error on /predict ===")
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        print(f"  Field '{loc}': {err.get('msg')} (input: {err.get('input')})")
    return JSONResponse(
        status_code=422,
        content={"detail": errors},
    )




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class StudentData(BaseModel):

    age: int = Field(..., ge=10, le=100)

    gender: str

    country: str

    academic_level: str

    most_used_platform: str

    primary_purpose: Optional[str] = None

    daily_screen_time: float = Field(..., ge=0, le=24)

    daily_phone_usage: float = Field(..., ge=0, le=24)

    news_platform: str

    entertainment_platform: str

    daily_study_hours: float = Field(..., ge=0, le=24)

    daily_physical_activity: float = Field(..., ge=0, le=24)

    sleep_hours: float = Field(..., ge=0, le=24)

    sleep_time: str

    thoughts: Optional[str] = None




@app.get("/")
def home():

    return {
        "message": "Student Stress Prediction API is running",
        "status": "success"
    }



@app.post("/predict")
def predict_stress(data: StudentData):

   
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

   
    prediction = model.predict(input_data)[0]

   
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