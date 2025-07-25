from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import io

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIEnhanceRequest(BaseModel):
    section: str
    content: str

class Resume(BaseModel):
    data: Dict

# In-memory storage for saved resume
saved_resume = {}

@app.post("/ai-enhance")
async def ai_enhance(request: AIEnhanceRequest):
    # Mock AI enhancement by appending " (enhanced)" to content
    enhanced_content = request.content + " (enhanced by AI)"
    return {"enhanced_content": enhanced_content}

@app.post("/save-resume")
async def save_resume(resume: Resume):
    global saved_resume
    saved_resume = resume.data
    return {"message": "Resume saved successfully"}

# Additional imports for parsing
from docx import Document
import PyPDF2

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()

    parsed_data = {
        "name": "",
        "summary": "",
        "experience": [],
        "education": [],
        "skills": []
    }

    try:
        if filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            full_text = []
            for para in doc.paragraphs:
                full_text.append(para.text)
            text = "\n".join(full_text)
            # Simple mock parsing: split text by lines and assign to fields
            lines = text.splitlines()
            if lines:
                parsed_data["name"] = lines[0]
            if len(lines) > 1:
                parsed_data["summary"] = lines[1]
            # Mock experience, education, skills as empty or dummy
            parsed_data["experience"] = [{"company": "Company A", "role": "Developer", "years": "2018-2020"}]
            parsed_data["education"] = [{"school": "University X", "degree": "BSc Computer Science", "year": "2017"}]
            parsed_data["skills"] = ["Python", "FastAPI", "React"]
        elif filename.endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            lines = text.splitlines()
            if lines:
                parsed_data["name"] = lines[0]
            if len(lines) > 1:
                parsed_data["summary"] = lines[1]
            # Mock experience, education, skills as dummy
            parsed_data["experience"] = [{"company": "Company B", "role": "Engineer", "years": "2019-2021"}]
            parsed_data["education"] = [{"school": "Institute Y", "degree": "MSc Engineering", "year": "2018"}]
            parsed_data["skills"] = ["JavaScript", "Node.js", "Docker"]
        else:
            return {"error": "Unsupported file type"}
    except Exception as e:
        return {"error": f"Failed to parse file: {str(e)}"}

    return parsed_data
