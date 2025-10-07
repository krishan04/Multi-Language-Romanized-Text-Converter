import { useState } from "react";
import TranslateForm from "../components/TranslateForm"; // Your existing component
import ResultsDisplay from "../components/ResultsDisplay";
import HistoryList from "../components/HistoryList";

export default function Home() {
  const [newTranslation, setNewTranslation] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Multi-Language Translator
          </h1>
          <p className="text-gray-600 text-lg">Translate and romanize text across multiple languages</p>
        </div>

        <TranslateForm onTranslation={setNewTranslation} />

        {newTranslation && (
          <ResultsDisplay translation={newTranslation} title="Latest Translation" />
        )}

        <HistoryList key={newTranslation?.id || Date.now()} />
      </div>
    </div>
  );
}