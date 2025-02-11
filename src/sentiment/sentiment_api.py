from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

#initialize FastAPI instance
app = FastAPI()

#load DistilRoBERTa
sentiment_pipeline = pipeline("text-classification", model = "j-hartmann/emotion-english-distilroberta-base")

#define structure of incoming data (string)
class PoemRequest(BaseModel):
    text: str

#post for requests
@app.post("/analyze/")
#input: poem
#pass poem to pipeline for processing
#output: emotion label and score
async def analyze_sentiment(request: PoemRequest):
    result = sentiment_pipeline(request.text)
    return {"emotion": result[0]["label"], "score": result[0]["score"]}
    #currently only returns highest scoring emotion, will have it return 2? more

#test with uvicorn sentiment_api:app --reload