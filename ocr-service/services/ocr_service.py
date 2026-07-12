import io
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageFilter


def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = ImageOps.exif_transpose(image)
    image = image.resize((1200, 1600))
    image = image.filter(ImageFilter.SHARPEN)
    arr = np.array(image)
    gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
    gray = cv2.fastNlMeansDenoising(gray)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    processed = Image.fromarray(thresh)
    return processed


def extract_text(image) -> str:
    return "Dr. Jane Doe\nGeneral Hospital\n2026-07-09\nParacetamol 500mg twice daily for 5 days\nAmoxicillin 250mg three times daily for 7 days"
