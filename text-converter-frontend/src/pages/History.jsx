import HistoryList from "../components/HistoryList";

export default function History() {
  return (
    <div style={{ padding: "2px",
      alignItems: "left"
    }}>
      <h1>Translation History Page</h1>
      <HistoryList />
    </div>
  );
}