import { useState } from "react";
import TranslateForm from "../components/TranslateForm";
import ResultsDisplay from "../components/ResultsDisplay";
import HistoryList from "../components/HistoryList";

export default function Home() {
  const [newTranslation, setNewTranslation] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Multi-Language Translator
          </h1>
          <p className="text-gray-400 text-lg">
            Translate and romanize text across multiple languages
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <TranslateForm onTranslation={setNewTranslation} />
        </div>

        {/* Result Section */}
        {newTranslation && (
          <div className="mb-8 animate-fadeIn">
            <ResultsDisplay
              translation={newTranslation}
              title="Latest Translation"
            />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* History Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">
            Translation History
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Showing last 10 translations
          </p>
        </div>

        <HistoryList key={newTranslation?.id || Date.now()} />
      </div>
    </div>
  );
}