import { useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";

export default function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://multi-language-romanized-text-converter.onrender.com/api/history")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched History Data:", data);
        // Get only the last 10 items, sorted by most recent first
        const last10 = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setHistory(last10);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });
  }, []);

  const deleteItem = async (id) => {
    try {
      // Add your delete API call here
      const response = await fetch(`http://localhost:8080/api/history/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHistory(history.filter(item => item.id !== id));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No translation history yet</p>
        <p className="text-gray-400 text-sm mt-2">Your translations will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
          <History className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Translation History</h2>
          <p className="text-xs text-gray-500 mt-1">Showing last 10 translations</p>
        </div>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {item.sourceLang} → {item.targetLang}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-gray-600">Original:</span> <span className="text-gray-800">{item.originalText}</span></p>
              <p><span className="font-semibold text-gray-600">Translated:</span> <span className="text-gray-800">{item.translatedText || "—"}</span></p>
              <p><span className="font-semibold text-gray-600">Romanized:</span> <span className="text-gray-800">{item.romanizedText || "—"}</span></p>
              <p><span className="font-semibold text-gray-600">Plain Text:</span> <span className="text-gray-800">{item.plainRomanizedText || "—"}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}