import { useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";

export default function HistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/history")
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
      const response = await fetch(`http://localhost:8081/api/history/${id}`, {
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
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
          <History className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Translation History</h2>
          <p className="text-xs text-gray-400">Last 10 translations</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">

          {/* Head */}
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Original</th>
              <th className="p-3">Translated</th>
              <th className="p-3">Romanized</th>
              <th className="p-3">Plain</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-700 hover:bg-gray-900 transition"
              >
                <td className="p-3 text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 text-white max-w-xs truncate">
                  {item.originalText}
                </td>

                <td className="p-3 text-green-400 max-w-xs truncate">
                  {item.translatedText || "—"}
                </td>

                <td className="p-3 text-blue-400 max-w-xs truncate">
                  {item.romanizedText || "—"}
                </td>

                <td className="p-3 text-purple-400 max-w-xs truncate">
                  {item.plainRomanizedText || "—"}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}