import { useState } from "react";
import { generateContent } from "../services/gemini";

export default function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generate = async (prompt) => {
    try {
      setLoading(true);

      const data = await generateContent(prompt);

      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    generate,
  };
}