import PyPDF2
from googletrans import Translator
from aksharamukha import transliterate
from unidecode import unidecode

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

from urllib3.exceptions import NotOpenSSLWarning
warnings.simplefilter("ignore", NotOpenSSLWarning)

translator = Translator()

LANG_NAME_TO_CODE_AND_SCRIPT = {
    "hindi": {"code": "hi", "script": "Devanagari"},
    "english": {"code": "en", "script": "Latin"},
#     "french": {"code": "fr", "script": "Latin"},
#     "russian": {"code": "ru", "script": "Cyrillic"},
#     "arabic": {"code": "ar", "script": "Arabic"},
    "tamil": {"code": "ta", "script": "Tamil"},
    "bengali": {"code": "bn", "script": "Bengali"},
    "punjabi": {"code": "pa", "script": "Gurmukhi"},
    "malayalam": {"code": "ml", "script": "Malayalam"},
}

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
    return text.strip()

def translate_text(text: str, target_code: str = "hi") -> str:
    result = translator.translate(text, src="auto", dest=target_code)
    return result.text

def romanize_text(text: str, target_script: str) -> str:
    return transliterate.process(target_script, "ISO", text)

if __name__ == "__main__":
    pdf_path = "pythonModules/sample.pdf"
    user_input = input("Enter target language: ").lower()

    if user_input in LANG_NAME_TO_CODE_AND_SCRIPT:
        target_code = LANG_NAME_TO_CODE_AND_SCRIPT[user_input]["code"]   # for googletrans
        target_script = LANG_NAME_TO_CODE_AND_SCRIPT[user_input]["script"]  # for Aksharamukha
    else:
        raise ValueError(f"Language '{user_input}' not supported yet")

    extracted_text = extract_text_from_pdf(pdf_path)
    print("Extracted:", extracted_text)

    translated_text = translate_text(extracted_text, target_code)
    print("Translated:", translated_text)

    romanized_text = romanize_text(translated_text, target_script)
    plain_romanized = unidecode(romanized_text)
    print("Plain Romanized:", plain_romanized)
#     print("Romanized:", romanized_text)