from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os


# Create application instance 
app = FastAPI() 

