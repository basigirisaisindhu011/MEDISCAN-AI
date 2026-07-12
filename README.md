# MediScan AI – AI Prescription Reader

MediScan AI is a full-stack application that helps users upload prescription images, process them with OCR and AI, and view structured medicine details. The platform includes authentication, prescription history, exportable reports, and an admin panel.

## Architecture

```text
React Frontend -> Spring Boot Backend -> Python OCR Service -> Gemini API
                                      |
                                      v
                                   MySQL Database
```

## Features

- JWT authentication with role-based access
- Prescription upload and OCR processing
- AI parsing into structured medicine data
- Dashboard and history view
- PDF export and profile management
- Admin dashboard for user and prescription management

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Java 21 + Spring Boot 3 + Spring Security + JPA
- OCR Service: Python + FastAPI + OpenCV + PaddleOCR
- Database: MySQL

## Quick Start

### 1. Clone and enter the project

```bash
git clone <repo-url>
cd MediScan-AI
```

### 2. Start MySQL and the services

```bash
docker compose up --build
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Backend

```bash
cd backend
mvn spring-boot:run
```

### 5. OCR Service

```bash
cd ocr-service
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Backend configuration can be set in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties).

## API Documentation

Once the backend is running, visit:

- Swagger UI: http://localhost:8080/swagger-ui/index.html

## Screenshots

Placeholder for screenshots.

## Future Enhancements

- Mobile app version
- Medicine reminder notifications
- Multi-language OCR support
- Pharmacy integration
