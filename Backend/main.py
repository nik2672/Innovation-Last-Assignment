# main.py
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from neural import predict_price, load_or_train_model

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_or_train_model()

class PredictionRequest(BaseModel):
    Rooms: int
    Type: str  # "h" for house, "t" for townhouse, "u" for unit
    Postcode: int
    Distance: float

@app.post("/predict")
async def predict(data: PredictionRequest):
    predicted_price = predict_price(data.Rooms, data.Type, data.Postcode, data.Distance)
    return {"predicted_price": float(predicted_price)}

@app.get("/data")
async def get_data():
    data = pd.read_csv("data.csv")
    return data.to_dict(orient="records")
