import os
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import google.generativeai as genai
import fitz  # PyMuPDF

app = FastAPI(title="Gemini Resume Parser [Stateless]")

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key="YOUR_GEMINI_API_KEY") 

# --- JSON Response Schema (Strictly Typed) ---
class WorkExperience(BaseModel):
    company: str
    role: str
    start_date: Optional[str]
    end_date: Optional[str]
    is_current: bool
    responsibilities: List[str]

class Education(BaseModel):
    institution: str
    degree: str
    graduation_year: Optional[str]

class Skills(BaseModel):
    technical: List[str]
    tools: List[str]
    soft_skills: List[str]

class CandidateProfile(BaseModel):
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    work_experience: List[WorkExperience]
    education: List[Education]
    skills: Skills
    confidence_score: float

# --- Core Logic ---
@app.post("/parse", response_model=CandidateProfile)
async def parse_resume(file: UploadFile = File(...)):
    # 1. Extraction (PDF -> Text)
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported in this version.")
    
    content = await file.read()
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        text_stream = chr(12).join([page.get_text() for page in doc])
    except Exception:
        raise HTTPException(400, "Corrupt or unreadable PDF file.")

    # 2. Intelligence (Gemini 1.5 Flash)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    Act as a Resume Parser API. Extract data from the text below into strict JSON.
    
    CRITICAL RULES:
    - Return ONLY JSON. No markdown formatting.
    - If a field is missing, use null.
    - Normalize dates to YYYY-MM-DD.
    - Deduplicate skills.
    
    RESUME TEXT:
    {text_stream}
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(500, f"AI Processing Error: {str(e)}")

# Run: uvicorn main:app --reload