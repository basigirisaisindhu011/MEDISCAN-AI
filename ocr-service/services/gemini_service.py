import io
import cv2
import numpy as np
import pytesseract
from PIL import Image, ImageOps, ImageFilter


def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = ImageOps.exif_transpose(image)

    # Scale up proportionally (don't distort) — helps OCR on small images.
    max_side = 1600
    w, h = image.size
    if max(w, h) < max_side:
        scale = max_side / max(w, h)
        image = image.resize((int(w * scale), int(h * scale)))

    image = image.filter(ImageFilter.SHARPEN)
    arr = np.array(image)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    gray = cv2.fastNlMeansDenoising(gray)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return Image.fromarray(thresh)


def extract_text(image) -> str:
    """Real OCR using Tesseract. Returns the raw text found in the image."""
    text = pytesseract.image_to_string(image)
    return text.strip()
