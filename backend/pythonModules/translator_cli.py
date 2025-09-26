import sys
import warnings
import os
warnings.filterwarnings("ignore")  # suppress all warnings

import json
from googletrans import Translator
from aksharamukha import transliterate
from unidecode import unidecode
import PyPDF2

translator = Translator()

LANG_NAME_TO_CODE_AND_SCRIPT = {
    "hindi": {"code": "hi", "script": "Devanagari"},
    "english": {"code": "en", "script": "Latin"},
    "tamil": {"code": "ta", "script": "Tamil"},
    "bengali": {"code": "bn", "script": "Bengali"},
    "punjabi": {"code": "pa", "script": "Gurmukhi"},
    "malayalam": {"code": "ml", "script": "Malayalam"},
}

def translate_text(text, target_code):
    return translator.translate(text, src="auto", dest=target_code).text

def romanize_text(text, target_script):
    return transliterate.process(target_script, "ISO", text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Target language argument missing"}))
        sys.exit(1)

    target_language = sys.argv[1].lower()

    if target_language not in LANG_NAME_TO_CODE_AND_SCRIPT:
        print(json.dumps({"error": f"Language '{target_language}' not supported"}))
        sys.exit(1)

    target_code = LANG_NAME_TO_CODE_AND_SCRIPT[target_language]["code"]
    target_script = LANG_NAME_TO_CODE_AND_SCRIPT[target_language]["script"]

    # Read text from stdin (sent by Java)
    input_text = sys.stdin.read().strip()

    if not input_text:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)

    try:
        translated = translate_text(input_text, target_code)
        romanized = romanize_text(translated, target_script)
        plain_romanized = unidecode(romanized)

        result = {
            "translated": translated,
            "romanized": romanized,
            "plain_romanized": plain_romanized
        }

        print(json.dumps(result, ensure_ascii=False))  # preserve non-English characters

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)