import sys
import warnings
warnings.filterwarnings("ignore")

import json
import os
import PyPDF2
import traceback
from googletrans import Translator
from aksharamukha import transliterate
from unidecode import unidecode
from pdf2image import convert_from_path
from PIL import Image
import pytesseract

# Supported languages and scripts
LANG_NAME_to_CODE_AND_SCRIPT = {
    "hindi": {"code": "hi", "script": "Devanagari"},
    "english": {"code": "en", "script": "Latin"},
    "tamil": {"code": "ta", "script": "Tamil"},
    "bengali": {"code": "bn", "script": "Bengali"},
    "punjabi": {"code": "pa", "script": "Gurmukhi"},
    "malayalam": {"code": "ml", "script": "Malayalam"},
}

# -------------------- File Extraction --------------------
def extract_text_from_file(file_path):
    text = ""
    try:
        if file_path.lower().endswith(".pdf"):
            try:
                reader = PyPDF2.PdfReader(file_path)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            except Exception:
                text = ""
            # If PyPDF2 extraction failed, use OCR
            if not text.strip():
                pages = convert_from_path(file_path)
                for page_image in pages:
                    text += pytesseract.image_to_string(page_image, lang='eng') + "\n"
        elif file_path.lower().endswith((".png", ".jpg", ".jpeg")):
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img, lang='eng')
        elif file_path.lower().endswith((".txt", ".csv", ".md")):
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            return None, "Unsupported file type."

        if not text.strip():
            return None, "No extractable text was found in the file."
        return text, None

    except pytesseract.TesseractNotFoundError:
        return None, "Tesseract OCR engine not installed or not in PATH."
    except Exception as e:
        return None, f"Error during file processing/OCR: {str(e)}"

# -------------------- Translation --------------------
def translate_text(text, target_code):
    translator = Translator()
    translated_text = ""

    # Split into chunks to avoid googletrans errors
    chunk_size = 4000
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i+chunk_size]
        translated_chunk = translator.translate(chunk, src="auto", dest=target_code)
        translated_text += translated_chunk.text + " "
    return translated_text.strip()

# -------------------- Romanization --------------------
def romanize_text(text, target_script):
    return transliterate.process(target_script, "ISO", text)

# -------------------- Main --------------------
def main():
    if len(sys.argv) < 3:
        usage = "Usage: python3 your_script.py <\"text\" | filepath | -> <language>"
        print(json.dumps({"error": usage}))
        sys.exit(1)

    input_source = sys.argv[1]
    target_language = sys.argv[2].lower()

    if target_language not in LANG_NAME_to_CODE_AND_SCRIPT:
        print(json.dumps({"error": f"Language '{target_language}' not supported"}))
        sys.exit(1)

    input_text = ""
    error = None

    # Read input
    if os.path.exists(input_source):
        input_text, error = extract_text_from_file(input_source)
    elif input_source == "-":
        input_text = sys.stdin.read().strip()
        if not input_text:
            error = "No text provided via stdin."
    else:
        input_text = input_source

    if error:
        print(json.dumps({"error": error}))
        sys.exit(1)

    try:
        target_code = LANG_NAME_to_CODE_AND_SCRIPT[target_language]["code"]
        target_script = LANG_NAME_to_CODE_AND_SCRIPT[target_language]["script"]

        translated = translate_text(input_text, target_code)
        romanized = romanize_text(translated, target_script)
        plain_romanized = unidecode(romanized)

        result = {
            "original": input_text[:500],
            "translated": translated,
            "romanized": romanized,
            "plain_romanized": plain_romanized,
            "target_lang": target_language
        }
        print(json.dumps(result, ensure_ascii=False, indent=4))

    except Exception as e:
        error_report = {
            "error": "An unexpected error occurred. See details below.",
            "exception_type": str(type(e)),
            "exception_details": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_report, indent=4))
        sys.exit(1)

if __name__ == "__main__":
    main()