import { useState } from "react";
import { Languages, Copy, Check } from "lucide-react";

export default function ResultsDisplay({ translation, title }) {
  const [copied, setCopied] = useState(null);

  if (!translation) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const ResultField = ({ label, value, field }) => (
    <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <button
          onClick={() => copyToClipboard(value, field)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white rounded"
        >
          {copied === field ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <p className="text-gray-800 leading-relaxed">{value}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Languages className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">Target: {translation.targetLang}</p>
        </div>
      </div>

      <div className="space-y-4">
        <ResultField label="Original Text" value={translation.originalText} field="original" />
        <ResultField label="Translated" value={translation.translatedText} field="translated" />
        <ResultField label="Romanized" value={translation.romanizedText} field="romanized" />
        <ResultField label="Plain Romanized" value={translation.plainRomanizedText} field="plain" />
      </div>
    </div>
  );
}