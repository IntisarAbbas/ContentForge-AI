import { useState } from "react";
import toast from "react-hot-toast";

import { generateAIContent } from "../../services/groq";
import { saveToHistory } from "../../utils/storage";

import FavoriteButton from "../../components/common/FavoriteButton";

function WebsiteDesign() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("Landing Page");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Describe your website.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response = await generateAIContent({
        category: "Website Design",
        language: "",
        tone: "Professional",
        length: "Long",
        prompt: `
Create a professional ${type} website design concept for:

${prompt}

Include:
- Website structure
- Main sections
- Layout
- Color palette
- Typography
- UI/UX ideas
- Responsive design suggestions
- Important features

Make the result practical and detailed.
        `,
      });

      // Save to Firebase History
      try {
        await saveToHistory({
          category: "Website Design",
          title: `${type} Design`,
          prompt,
          result: response,
        });
      } catch (historyError) {
        console.error(
          "History save error:",
          historyError
        );

        toast.error(
          "Design generated, but it could not be saved to history."
        );
      }

      setResult(response);

      toast.success(
        "Website design generated!"
      );
    } catch (error) {
      console.error(
        "Website design error:",
        error
      );

      toast.error(
        error?.message ||
          "Website design generation failed."
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
            Website Design
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Generate modern website and UI/UX concepts.
          </p>
        </div>
      </div>

      {/* Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Type */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Website Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            >
              <option>Landing Page</option>
              <option>SaaS Website</option>
              <option>Portfolio</option>
              <option>E-commerce</option>
              <option>Dashboard</option>
              <option>Agency Website</option>
              <option>Blog Website</option>
              <option>AI Product Website</option>
            </select>
          </div>

          {/* Prompt */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Describe your website
            </label>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Example: Create a modern AI SaaS website with a dark theme, pricing section, features, testimonials and a premium landing page."
              className="h-44 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-6 outline-none transition focus:border-violet-500 sm:text-base"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Designing your website...
                </p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="pb-8">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">

                <h2 className="text-lg font-semibold text-white">
                  Generated Design
                </h2>

                <p className="pt-2 text-xs text-zinc-500">
                  {type}
                </p>

                <div className="pt-5 whitespace-pre-wrap text-sm leading-7 text-zinc-200 sm:text-base">
                  {result}
                </div>

          <FavoriteButton
            type="Website Design"
            title={`${type} Design`}
            prompt={prompt}
            content={result}
          />

              </div>
            </div>
          )}

          <div className="h-8" />
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="shrink-0 border-t border-zinc-800 bg-[#09090C]/95 p-3 backdrop-blur-xl sm:p-4">
        <div className="mx-auto max-w-5xl">

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating Design..."
              : "✨ Generate Design"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default WebsiteDesign;