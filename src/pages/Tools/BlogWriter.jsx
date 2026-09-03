import { useState } from "react";
import toast from "react-hot-toast";

import { generateAIContent } from "../../services/groq";
import { saveToHistory } from "../../utils/storage";

import FavoriteButton from "../../components/common/FavoriteButton";

function BlogWriter() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter your blog topic.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response = await generateAIContent({
        category: "Blog Writer",
        language,
        tone,
        length,
        prompt: `
Write a complete SEO-friendly blog post about:

${topic}

Requirements:
- Create an engaging title.
- Write a strong introduction.
- Use clear headings and subheadings.
- Make the content informative and easy to read.
- Include a conclusion.
- Keep the writing natural and professional.
- Avoid unnecessary repetition.
        `,
      });

      // Save generated blog to Firebase History
      try {
        await saveToHistory({
          category: "Blog Writer",
          title: topic,
          prompt: topic,
          result: response,
        });
      } catch (historyError) {
        console.error(
          "History save error:",
          historyError
        );

        // Blog generation should still succeed
        // even if history saving fails.
        toast.error(
          "Blog generated, but it could not be saved to history."
        );
      }

      setResult(response);

      toast.success("Blog generated successfully!");
    } catch (error) {
      console.error("Blog generation error:", error);

      toast.error(
        error?.message ||
          "Blog generation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        left-3
        right-3
        top-20
        bottom-4
        flex
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-zinc-800
        bg-[#0A0A0D]
        lg:left-[256px]
        lg:right-6
      "
    >
      {/* Header */}
      <div className="flex h-[98px] shrink-0 items-center border-b border-zinc-800 bg-[#0A0A0D] px-4 sm:px-6">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Blog Writer
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Create SEO-friendly blog posts with AI.
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Options */}
          <div className="grid gap-4 pb-8 sm:grid-cols-3">

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            >
              <option>English</option>
              <option>Urdu</option>
              <option>Hindi</option>
              <option>Roman Urdu</option>
            </select>

            <select
              value={tone}
              onChange={(e) =>
                setTone(e.target.value)
              }
              className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Funny</option>
              <option>Formal</option>
            </select>

            <select
              value={length}
              onChange={(e) =>
                setLength(e.target.value)
              }
              className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            >
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>

          </div>

          {/* Topic */}
          <div className="pb-8">

            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              What should the blog be about?
            </label>

            <textarea
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              placeholder="Example: Write a blog about the future of artificial intelligence in education..."
              className="h-44 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-6 outline-none transition focus:border-violet-500 sm:text-base"
            />

          </div>

          {/* Loading */}
          {loading && (
            <div className="pb-8">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">

                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Writing your blog...
                </p>

              </div>

            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="pb-8">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <h2 className="pb-4 text-lg font-semibold text-white">
                  Generated Blog
                </h2>

                <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200 sm:text-base">
                  {result}
                </div>

        <div className="flex items-center gap-3 pt-5">
          <FavoriteButton
             type="Blog Writer"
             title={topic}
             prompt={topic}
            content={result}
          />
        </div>

              </div>

            </div>
          )}

          <div className="h-8" />

        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="shrink-0 border-t border-zinc-800 bg-[#09090C]/95 p-3 backdrop-blur-xl sm:p-4">

        <div className="mx-auto max-w-5xl">

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating..."
              : "✨ Write Blog"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default BlogWriter;