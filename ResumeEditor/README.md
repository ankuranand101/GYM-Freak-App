# Resume Editor Project

## Project Structure

```
ResumeEditor/
├── backend/
│   └── main.py
├── frontend/
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── App.js
│       └── ResumeEditor.js
└── README.md
```

## Backend (FastAPI)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment and activate it (optional but recommended):
   - On Windows:
     ```
     python -m venv venv
     venv\\Scripts\\activate
     ```
   - On macOS/Linux:
     ```
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependencies:
   ```
   pip install fastapi uvicorn
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the frontend development server:
   ```
   npm start
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Usage

- Upload a .pdf or .docx file (mock parsing with dummy content)
- Edit resume fields: name, summary, experience, education, skills
- Click "Enhance with AI" next to each section to get enhanced content from backend
- Save the resume to backend using "Save Resume" button
- Download the resume JSON using "Download Resume JSON" button

## Notes

- The backend stores the resume in memory only.
- The AI enhancement is mocked and appends " (enhanced by AI)" to the content.
   http://localhost:3000
   npm start
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   pip install fastapi uvicorn
     source venv/bin/activate
