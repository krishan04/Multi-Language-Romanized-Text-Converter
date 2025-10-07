import { useState } from "react";
import { translateText } from "../api";

export default function TranslateForm({ onTranslation }) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hindi");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text && !file) {
      alert("Please provide text or upload a file.");
      return;
    }

    setLoading(true);
    try {
      const result = await translateText(text, language, file);
      console.log("Backend result:", result);

      // Use backend property names directly
      const formatted = {
        originalText: result.originalText,
        translatedText: result.translatedText,
        romanizedText: result.romanizedText,
        plainRomanizedText: result.plainRomanizedText,
        targetLang: result.targetLang || language,
      };

      onTranslation(formatted);

      // Clear inputs after translation
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Translation error:", err);
      alert("Translation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <br />

      <input
        type="file"
        accept=".txt,.pdf,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files[0])}
      />
      {file && <p>Selected file: {file.name}</p>}
      <br />

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="hindi">Hindi</option>
        <option value="bengali">Bengali</option>
        <option value="tamil">Tamil</option>
        <option value="telugu">Telugu</option>
        <option value="kannada">Kannada</option>
      </select>
      <br />

      <button onClick={handleTranslate} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>
    </div>
  );
}