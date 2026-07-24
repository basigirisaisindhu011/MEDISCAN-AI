import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import UnidentifiedImageError
from services.ocr_service import preprocess_image, extract_text
from services.gemini_service import parse_prescription
import uvicorn

app = FastAPI(title="MediScan OCR Service")

# ✅ Health Check Route (fixes the 404 logs on Render)
@app.get("/")
async def root():
    return {"status": "ok", "service": "MediScan OCR Service"}

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        processed = preprocess_image(image_bytes)
        text = extract_text(processed)
        parsed = parse_prescription(text)
        return JSONResponse({
            "text": text,
            "parsed": parsed
        })
    except UnidentifiedImageError:
        return JSONResponse(status_code=400, content={
            "error": "Uploaded file is not a valid image",
            "text": "",
            "parsed": {}
        })
    except Exception as e:
        # ✅ Catch any other unexpected exceptions (API issues, processing errors)
        return JSONResponse(status_code=500, content={
            "error": str(e),
            "text": "",
            "parsed": {}
        })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
