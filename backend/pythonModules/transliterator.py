# transliterator.py
from langdetect import detect
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

# Mapping of language codes to Indic scripts
LANGUAGE_MAP = {
    "hi": sanscript.DEVANAGARI,   # Hindi
    "mr": sanscript.DEVANAGARI,   # Marathi
    "sa": sanscript.DEVANAGARI,   # Sanskrit
    "bn": sanscript.BENGALI,      # Bengali
    "gu": sanscript.GUJARATI,     # Gujarati
    "kn": sanscript.KANNADA,      # Kannada
    "ml": sanscript.MALAYALAM,    # Malayalam
    "or": sanscript.ORIYA,        # Odia
    "pa": sanscript.GURMUKHI,     # Punjabi
    "ta": sanscript.TAMIL,        # Tamil
    "te": sanscript.TELUGU,       # Telugu
}

def transliterate_text(text: str, source_lang: str = None, target_script=sanscript.ITRANS) -> str:
    """
    Transliterate text from source_lang (auto-detect if None) to target_script.
    Default: ITRANS (Latin Romanized).
    """
    if not source_lang:
        source_lang = detect(text)  # auto detect lang code

    source_script = LANGUAGE_MAP.get(source_lang)
    if not source_script:
        raise ValueError(f"Language '{source_lang}' not supported for transliteration")

    return transliterate(text, source_script, target_script)

if __name__ == "__main__":
    text = input("Enter text: ")
    source_lang = input("Enter source language code (or leave blank for auto): ").strip() or None
    result = transliterate_text(text, source_lang)
    print("Transliterated Text:", result)