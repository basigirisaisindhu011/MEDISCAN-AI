from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import UnidentifiedImageError
from services.ocr_service import preprocess_image, extract_text
from services.gemini_service import parse_prescription
import uvicorn

app = FastAPI(title="MediScan OCR Service")

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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
