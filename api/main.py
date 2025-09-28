from dotenv import load_dotenv
from fastapi import FastAPI
import os
from database import init_db
from routers import auth_router as auth
from fastapi.middleware.cors import CORSMiddleware
from routers import technician_router as technician
from routers import task_router as task
from routers import medicine_router as medicine
from models import user_models, medicine_models
from fastapi.staticfiles import StaticFiles
from routers import shopping_cart as shopping_cart
import logging
from routers import temperature_humidity as temp_humidity
from routers import lookup as lookup
from enum import Enum
import os
from typing import List, Dict
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set.")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()


@app.on_event("startup")
async def on_startup():
    await init_db()

origins = [
    "http://localhost:3000",   
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/uploaded_images", StaticFiles(directory="uploaded_images"), name="uploaded_images")






client = Groq(api_key=GROQ_API_KEY)
class UserInput(BaseModel):
    message: str
    role: str = "user"
    conversation_id: str 

class Conversation:
    def __init__(self):
        self.messages: List[Dict[str, str]] = [
            {
                "role": "system",
                "content": (
                    "You are a helpful AI assistant specialized in pharmaceutical management. "
                    "Always respond in English. Provide accurate information about medications, "
                    "dosages, inventory management, prescriptions, and general pharmacy best practices. "
                    "Keep answers clear, concise, and professional."
                )
            }
        ]
        self.active: bool = True


conversations: Dict[str, Conversation] = {}


def query_groq_api(conversation: Conversation) -> str:
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=conversation.messages,
            temperature=1,
            max_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )
        
        response = ""
        for chunk in completion:
            response += chunk.choices[0].delta.content or ""
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with Groq API: {str(e)}")


def get_or_create_conversation(conversation_id: str) -> Conversation:
    if conversation_id not in conversations:
        conversations[conversation_id] = Conversation()
    return conversations[conversation_id]




@app.post("/chat/")
async def chat(input: UserInput):
    conversation = get_or_create_conversation(input.conversation_id)

    if not conversation.active:
        raise HTTPException(
            status_code=400, 
            detail="The chat session has ended. Please start a new session."
        )
        
    try:
        # Append the user's message to the conversation
        conversation.messages.append({
            "role": input.role,
            "content": input.message
        })
        
        response = query_groq_api(conversation)
        
        conversation.messages.append({
            "role": "assistant",
            "content": response
        })
        
        return {
            "response": response,
            "conversation_id": input.conversation_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Include routers
app.include_router(auth.router)
app.include_router(technician.router)
app.include_router(task.router)
app.include_router(medicine.router)
app.include_router(shopping_cart.router)
app.include_router(temp_humidity.router)
app.include_router(lookup.router)


@app.get("/")
async def root():
    return {"message": "PharmaAssist API"}

