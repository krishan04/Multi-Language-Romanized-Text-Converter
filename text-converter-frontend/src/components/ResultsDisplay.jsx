import { useState } from "react";
import { Languages, Copy, Check } from "lucide-react";

export default function ResultsDisplay({ translation, title }) {
  const [copied, setCopied] = useState(null);

  if (!translation) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const CopyButton = ({ value, field }) => (
    <button
      onClick={() => copyToClipboard(value, field)}
      className="ml-2"
    >
      {copied === field ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
      )}
    </button>
  );

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-700 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Languages className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-xs text-gray-400">
            Target: {translation.targetLang}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">

          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-3">Field</th>
              <th className="p-3">Value</th>
              <th className="p-3 text-center">Copy</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-gray-700 hover:bg-gray-900">
              <td className="p-3 text-gray-400">Original</td>
              <td className="p-3 text-white">{translation.originalText}</td>
              <td className="p-3 text-center">
                <CopyButton value={translation.originalText} field="original" />
              </td>
            </tr>

            <tr className="border-b border-gray-700 hover:bg-gray-900">
              <td className="p-3 text-gray-400">Translated</td>
              <td className="p-3 text-green-400">{translation.translatedText}</td>
              <td className="p-3 text-center">
                <CopyButton value={translation.translatedText} field="translated" />
              </td>
            </tr>

            <tr className="border-b border-gray-700 hover:bg-gray-900">
              <td className="p-3 text-gray-400">Romanized</td>
              <td className="p-3 text-blue-400">{translation.romanizedText}</td>
              <td className="p-3 text-center">
                <CopyButton value={translation.romanizedText} field="romanized" />
              </td>
            </tr>

            <tr className="hover:bg-gray-900">
              <td className="p-3 text-gray-400">Plain</td>
              <td className="p-3 text-purple-400">{translation.plainRomanizedText}</td>
              <td className="p-3 text-center">
                <CopyButton value={translation.plainRomanizedText} field="plain" />
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  );
}