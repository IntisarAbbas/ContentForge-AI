import { useState } from "react";
import toast from "react-hot-toast";

import { generateAIContent } from "../../services/groq";
import { saveToHistory } from "../../utils/storage";

import FavoriteButton from "../../components/common/FavoriteButton";

function SocialMedia() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Professional");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter your content idea.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response = await generateAIContent({
        category: "Social Media",
        language: "",
        tone,
        length: "Medium",
        prompt: `
Create an engaging ${platform} social media post about:

${prompt}

Requirements:
- Make it natural and engaging.
- Match the selected tone.
- Include a strong hook.
- Keep it suitable for ${platform}.
- Add hashtags when appropriate.
        `,
      });

      // Save to Firebase History
      try {
        await saveToHistory({
          category: "Social Media",
          title: `${platform} Post`,
          prompt,
          result: response,
        });
      } catch (historyError) {
        console.error(
          "History save error:",
          historyError
        );

        toast.error(
          "Post generated, but it could not be saved to history."
        );
      }

      setResult(response);

      toast.success(
        "Social media content generated!"
      );
    } catch (error) {
      console.error(
        "Social media generation error:",
        error
      );

      toast.error(
        error?.message ||
          "Social media generation failed."
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
            Social Media Writer
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Create engaging social media content instantly.
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Options */}
          <div className="grid gap-4 pb-8 sm:grid-cols-2">
            <select
              value={platform}
              onChange={(e) =>
                setPlatform(e.target.value)
              }
              className="rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            >
              <option>Instagram</option>
              <option>Facebook</option>
              <option>TikTok</option>
              <option>LinkedIn</option>
              <option>X</option>
              <option>YouTube</option>
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
              <option>Inspirational</option>
              <option>Persuasive</option>
            </select>
          </div>

          {/* Prompt */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              What do you want to post about?
            </label>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Example: Create an Instagram post for my new clothing brand..."
              className="h-40 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Creating your social media content...
                </p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

                <h2 className="pb-4 text-lg font-semibold text-white">
                  Generated Content
                </h2>

                <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200 sm:text-base">
                  {result}
                </div>

          // Social Media
          <FavoriteButton
              type="Social Media"
              title={`${platform} Post`}
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
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating..."
              : "✨ Generate Post"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default SocialMedia;