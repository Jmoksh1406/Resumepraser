# 📄 AI Resume Parser (Stateless Edition)

A minimalist, high-precision Resume Parser that converts PDF resumes into structured JSON data using **Google Gemini 1.5 Flash**.

This project is designed as a **stateless microservice**: it accepts a file, processes it via AI with a strict schema, and returns the data immediately without storing it in a database.

## ✨ Features

* **Contextual Extraction:** Uses LLM (Gemini) instead of Regex for higher accuracy on complex layouts.
* **Zero-Storage:** Privacy-first design; no data is persisted to a database.
* **Strict Schema:** Outputs standardized JSON (ISO 8601 dates, categorized skills).
* **Minimalist UI:** Clean, single-page React interface with drag-and-drop.
* **Fast:** Optimized for speed using Gemini 1.5 Flash (~3s processing time).

## 🛠️ Tech Stack

* **Backend:** Python, FastAPI, PyMuPDF (PDF extraction), Google Generative AI SDK.
* **Frontend:** React, Tailwind CSS, Lucide React (Icons).
* **AI Model:** Google Gemini 1.5 Flash.

---

## 🚀 Getting Started

### Prerequisites

* Python 3.9+
* Node.js & npm
* A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Backend Setup (Python)

Navigate to the backend directory (or root, depending on your structure).

```bash
# 1. Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install fastapi uvicorn google-generativeai pymupdf python-multipart

# 3. Configure API Key
# Open main.py and replace "YOUR_GEMINI_API_KEY" 
# OR set it as an environment variable (Recommended):
export GEMINI_API_KEY="your_actual_key_here"

```

**Run the Server:**

```bash
uvicorn main:app --reload

```

*The API will start at `http://127.0.0.1:8000*`

### 2. Frontend Setup (React)

Open a new terminal.

```bash
# 1. Create a new React app (if you haven't already)
npx create-react-app resume-parser-ui
cd resume-parser-ui

# 2. Install Tailwind CSS & Icons
npm install lucide-react
# Follow Tailwind install guide if starting from scratch, or ensure CSS is set up.

# 3. Add the Component
# Copy the provided ResumeParser.jsx into your src/ folder and import it in App.js

# 4. Start the UI
npm start

```

*The frontend will start at `http://localhost:3000*`

---

## 📂 Project Structure

```
resume-parser/
├── backend/
│   ├── main.py              # FastAPI server & Gemini logic
│   ├── requirements.txt     # Python dependencies
│   └── venv/                # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ResumeParser.jsx  # Main UI logic
│   │   ├── App.js
│   │   └── index.css        # Tailwind imports
│   └── package.json
└── README.md

```

## 🔌 API Usage

You can use the backend without the frontend via cURL or Postman.

**Endpoint:** `POST /parse`

```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/parse' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/resume.pdf'

```

**Response:**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "skills": {
    "technical": ["Python", "React"],
    "soft_skills": ["Leadership"]
  },
  "confidence_score": 0.95
  ...
}

```

## 🔮 Future Improvements

* [ ] Add support for .DOCX files.
* [ ] Implement Batch Processing (process a folder of 100 PDFs).
* [ ] Add an "Export to Excel/CSV" button.
* [ ] Dockerize the application for easy deployment.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
