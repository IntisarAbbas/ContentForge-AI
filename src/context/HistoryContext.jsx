import { createContext, useContext, useEffect, useState } from "react";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("contentforge-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "contentforge-history",
      JSON.stringify(history)
    );
  }, [history]);

  const addHistory = (item) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        date: new Date().toLocaleString(),
        ...item,
      },
      ...prev,
    ]);
  };

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistory,
        deleteHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}