import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const translateText = async (text, language, file) => {
  try {
    const formData = new FormData();
    if (file) formData.append("file", file);
    else formData.append("text", text);
    formData.append("language", language);

    const response = await axios.post(`${API_BASE}/translate`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (err) {
    console.error("API Error:", err);
    return { error: "Failed to connect to translation service" };
  }
};

export const fetchHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE}/history`);
    return response.data; // ✅ Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};