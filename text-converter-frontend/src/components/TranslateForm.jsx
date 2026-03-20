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
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Text or Upload File</h2>

    <textarea
      rows="4"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Type something like: Hello, how are you?"
      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
    />

    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="file"
        accept=".txt,.pdf,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
      >
        <option value="hindi">Hindi</option>
        <option value="bengali">Bengali</option>
        <option value="tamil">Tamil</option>
        <option value="telugu">Telugu</option>
        <option value="kannada">Kannada</option>
      </select>
    </div>

    {file && (
      <p className="text-sm text-gray-500 mb-3">
        📄 Selected: <span className="font-medium">{file.name}</span>
      </p>
    )}

    <button
      onClick={handleTranslate}
      disabled={loading}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-md"
    >
      {loading ? "Translating..." : "🚀 Translate"}
    </button>
  </div>
);

}