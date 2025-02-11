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
    pipelineResults = sentiment_pipeline(request.text)

    #grab top 3 emotions
    if len(pipelineResults) >= 3:
        finalResults = pipelineResults[:3]
    #if less than 3 emotions
    else:
        finalResults = pipelineResults

    #add final results to list
    emotion_list = []
    for emotion in finalResults:
        emotion_list.append( {"emotion": emotion["label"], "score": emotion["score"]} )

    return {"emotion_list": emotion_list}

#test with uvicorn sentiment_api:app --reload