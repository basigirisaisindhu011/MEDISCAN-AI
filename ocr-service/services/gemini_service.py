import os
import re
import json


def _fallback_parse(text: str) -> dict:
    """Regex-based parse used when no Gemini API key is configured."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    medicines = []
    # naive: lines that contain a dosage like "500mg" are treated as medicines
    for line in lines:
        if re.search(r"\d+\s?(mg|ml|g|mcg)", line, re.IGNORECASE):
            medicines.append({
                "medicineName": line.split()[0],
                "strength": (re.search(r"\d+\s?(mg|ml|g|mcg)", line, re.IGNORECASE) or [""])[0],
                "frequency": "",
                "duration": "",
                "instructions": line,
            })
    return {
        "doctorName": lines[0] if lines else "",
        "hospital": lines[1] if len(lines) > 1 else "",
        "date": "",
        "medicines": medicines,
    }


def parse_prescription(text: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or not text:
        return _fallback_parse(text)

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "Extract prescription data from the text below and return ONLY valid JSON "
            'with keys: doctorName, hospital, date, and medicines (a list of objects with '
            "medicineName, strength, frequency, duration, instructions).\n\n"
            f"Text:\n{text}"
        )
        resp = model.generate_content(prompt)
        raw = resp.text.strip()
        # strip ```json fences if present
        raw = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
        return json.loads(raw)
    except Exception as e:
        print(f"Gemini parse failed, using fallback: {e}")
        return _fallback_parse(text)
