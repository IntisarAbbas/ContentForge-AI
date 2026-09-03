import { useState } from "react";
import toast from "react-hot-toast";
import { HiArrowDownTray } from "react-icons/hi2";

import { generateImage } from "../../services/imageGenerator";
import { saveToHistory } from "../../utils/storage";

import FavoriteButton from "../../components/common/FavoriteButton";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        "Please describe the image you want."
      );
      return;
    }

    try {
      setLoading(true);
      setImage("");

      const result = await generateImage(prompt);

      // Save image generation to Firebase History
      try {
        await saveToHistory({
        category: "Image Generator",
        title: "AI Generated Image",
        prompt,
        result: "Image generated successfully.",
    });
      } catch (historyError) {
        console.error(
          "History save error:",
          historyError
        );

        toast.error(
          "Image generated, but it could not be saved to history."
        );
      }

      setImage(result);

      toast.success(
        "Image generated successfully!"
      );
    } catch (error) {
      console.error(
        "Image generation error:",
        error
      );

      toast.error(
        error?.message ||
          "Image generation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;

    const link =
      document.createElement("a");

    link.href = image;
    link.download =
      "ContentForge-AI.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            AI Image Generator
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Turn your ideas into stunning images with AI.
          </p>
        </div>
      </div>

      {/* Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Prompt */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Describe your image
            </label>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Example: A futuristic purple AI workspace with neon lights..."
              className="h-44 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500 sm:h-48 lg:p-5 lg:text-base"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="pb-8">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center">

                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Creating your image...
                </p>

                <p className="pt-2 text-xs text-zinc-600">
                  This may take a few moments.
                </p>

              </div>
            </div>
          )}

          {/* Image */}
          {image && !loading && (
            <div className="pb-8">

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 lg:p-6">

                <h2 className="text-xl font-bold">
                  Generated Image
                </h2>

                <p className="pt-2 text-sm text-zinc-500">
                  Your AI-generated result.
                </p>

                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black pt-5">
                  <img
                    src={image}
                    alt="AI generated"
                    className="block h-auto w-full object-cover"
                  />
                </div>

                 <div className="flex justify-end pt-5 gap-2">

                  <FavoriteButton
                   type="Image"
                   title="AI Generated Image"
                   prompt={prompt}
                   image={image}
                  />

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-xl bg-zinc-800 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700"
                  >
                    <HiArrowDownTray
                      size={20}
                    />

                    Download
                  </button>

                </div>

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
              ? "Generating Image..."
              : "Generate Image"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;