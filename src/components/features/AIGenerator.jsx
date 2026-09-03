import { useEffect, useState } from "react";
import { categories } from "../../data/categories";
import { templates } from "../../data/templates";
import { generateAIContent } from "../../services/groq";
import OutputCard from "../ai/OutputCard";
import toast from "react-hot-toast";
import { saveToHistory } from "../../utils/storage";

import { useSearchParams } from "react-router-dom";

function AIGenerator() {
  const [searchParams] = useSearchParams();

  const selectedTool = searchParams.get("tool");

  const [category, setCategory] = useState(
    selectedTool || "Social Media"
  );

  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [prompt, setPrompt] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedTool) {
      setCategory(selectedTool);
      setPrompt("");
      setSearch("");
      setResult("");
      setError("");
    }
  }, [selectedTool]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setError("");

      const response = await generateAIContent({
        category,
        language,
        tone,
        length,
        prompt,
      });

      setResult(response);

      saveToHistory({
        category,
        prompt,
        language,
        tone,
        length,
        result: response,
      });

      toast.success("Content generated successfully!");
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to generate content.");
      toast.error("Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 lg:p-10">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
          AI Content Generator
        </h2>

        <p className="pt-2 text-sm text-zinc-400 sm:text-base lg:text-lg">
          Generate high-quality AI content in English, Urdu and Hindi.
        </p>
      </div>

      {/* Categories */}
      <div className="pt-6 flex flex-wrap gap-2 sm:gap-3">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition sm:px-5 sm:py-3 lg:text-base ${
              category === item
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Template Search */}
      <div className="pt-6">
        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none transition focus:border-violet-500"
        />
      </div>

      {/* Quick Templates */}
      <div className="pt-6">
        <h3 className="pb-2 text-lg font-semibold">
          Quick Templates
        </h3>

        <div className="flex flex-wrap gap-3">
          {(templates[category] || [])
            .filter((item) =>
              item.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <button
                key={item}
                onClick={() => setPrompt(item)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-violet-500 hover:bg-zinc-800 hover:text-white"
              >
                {item}
              </button>
            ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="pt-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="h-32 w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none transition focus:border-violet-500 sm:h-40 lg:h-48 lg:p-5 lg:text-base"
          placeholder="Describe what you want AI to create..."
        />
      </div>

      {/* Options */}
      <div className="pt-2 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none focus:border-violet-500 lg:p-4 lg:text-base"
        >
          <option>English</option>
          <option>Urdu</option>
          <option>Hindi</option>
          <option>Roman Urdu</option>
        </select>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none focus:border-violet-500 lg:p-4 lg:text-base"
        >
          <option>Professional</option>
          <option>Friendly</option>
          <option>Funny</option>
          <option>Formal</option>
        </select>

        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none focus:border-violet-500 lg:p-4 lg:text-base"
        >
          <option>Short</option>
          <option>Medium</option>
          <option>Long</option>
        </select>

      </div>

      {/* Generate Button */}
      <div className="py-6 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 px-12 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-50 lg:w-120"
        >
          {loading ? "Generating..." : "✨ Generate Content"}
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="mt-6 rounded-2xl border border-red-800 bg-red-950/30 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

          <p className="mt-5 text-zinc-400">
            AI is generating your content...
          </p>
        </div>
      )}

      {/* Output */}
      {result && !loading && (
        <div className="mt-8">
          <OutputCard
            text={result}
            onRegenerate={handleGenerate}
          />
        </div>
      )}

    </div>
  );
}

export default AIGenerator;