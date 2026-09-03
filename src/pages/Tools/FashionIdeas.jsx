import { useState } from "react";
import toast from "react-hot-toast";

import { generateAIContent } from "../../services/groq";
import { generateImage } from "../../services/imageGenerator";
import { saveToHistory } from "../../utils/storage";

import FavoriteButton from "../../components/common/FavoriteButton";

function FashionIdeas() {
  const [person, setPerson] = useState("Men");
  const [occasion, setOccasion] = useState("Casual");
  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] =
    useState(false);

  const [result, setResult] = useState("");
  const [image, setImage] = useState("");

  const shouldGenerateImage = (text) => {
    const keywords = [
      "image",
      "photo",
      "picture",
      "pic",
      "outfit image",
      "fashion image",
      "show me",
      "visual",
      "visualize",
      "generate image",
      "make an image",
      "create image",
    ];

    const lowerText = text.toLowerCase();

    return keywords.some((keyword) =>
      lowerText.includes(keyword)
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        "Please describe the fashion style you want."
      );
      return;
    }

    const needsImage =
      shouldGenerateImage(prompt);

    try {
      setLoading(true);
      setResult("");
      setImage("");

      const fashionPrompt = `
Create detailed fashion styling ideas.

Person:
${person}

Occasion:
${occasion}

User request:
${prompt}

Give practical recommendations including:
- Complete outfit
- Top
- Bottom
- Shoes
- Accessories
- Colors
- Styling tips
- Suitable occasion
- Overall look

Be specific and useful.
      `;

      const response = await generateAIContent({
        category: "Fashion Ideas",
        language: "",
        tone: "Professional",
        length: "Medium",
        prompt: fashionPrompt,
      });

      // Save text result to Firebase
      try {
        await saveToHistory({
          category: "Fashion Ideas",
          title: `${person} - ${occasion}`,
          prompt,
          result: response,
        });
      } catch (historyError) {
        console.error(
          "History save error:",
          historyError
        );

        toast.error(
          "Fashion ideas generated, but history could not be saved."
        );
      }

      setResult(response);
      setLoading(false);

      // Image generation
      if (needsImage) {
        try {
          setImageLoading(true);

          const imagePrompt = `
Create a realistic high-quality fashion editorial image.

Subject:
${person}

Occasion:
${occasion}

Fashion request:
${prompt}

Show a complete, stylish, age-appropriate outfit matching the request.
Professional fashion photography.
Realistic clothing textures.
Natural proportions.
Clean background.
High-quality lighting.
Modern fashion catalog aesthetic.
          `;

          const generatedImage =
            await generateImage(imagePrompt);

          setImage(generatedImage);

          toast.success(
            "Fashion ideas and image generated!"
          );
        } catch (imageError) {
          console.error(
            "Fashion image error:",
            imageError
          );

          toast.error(
            "Fashion ideas generated, but image generation failed."
          );
        } finally {
          setImageLoading(false);
        }
      } else {
        toast.success(
          "Fashion ideas generated!"
        );
      }
    } catch (error) {
      console.error(
        "Fashion generation error:",
        error
      );

      toast.error(
        error?.message ||
          "Fashion generation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement("a");

    link.href = image;
    link.download =
      "ContentForge-Fashion.png";

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
            Fashion Ideas
          </h1>

          <p className="pt-2 text-sm text-zinc-500">
            Create personalized outfit and styling ideas.
          </p>
        </div>
      </div>

      {/* Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          {/* Person */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Who is the outfit for?
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[
                "Men",
                "Women",
                "Boys",
                "Girls",
                "Baby Boy",
                "Baby Girl",
                "Unisex",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setPerson(item)
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    person === item
                      ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-violet-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Occasion
            </label>

            <select
              value={occasion}
              onChange={(e) =>
                setOccasion(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            >
              <option>Casual</option>
              <option>Wedding</option>
              <option>Party</option>
              <option>Office</option>
              <option>Streetwear</option>
              <option>College</option>
              <option>Winter</option>
              <option>Summer</option>
              <option>Date Night</option>
              <option>Formal</option>
            </select>
          </div>

          {/* Prompt */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Describe your fashion idea
            </label>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Example: Give me a black streetwear outfit with white sneakers. Also show me an image."
              className="h-40 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 outline-none transition focus:border-violet-500"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Creating your fashion ideas...
                </p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="pb-4 text-lg font-semibold text-white">
                  Fashion Recommendations
                </h2>

                <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200 sm:text-base">
                  {result}
                </div>

                // Fashion
          <FavoriteButton
            type="Fashion Ideas"
            title={`${person} - ${occasion}`}
            prompt={prompt}
            content={result}
          />

              </div>
            </div>
          )}

          {/* Image Loading */}
          {imageLoading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Creating your outfit image...
                </p>
              </div>
            </div>
          )}

          {/* Image */}
          {image && !imageLoading && (
            <div className="pb-8">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5 lg:p-6">

                <h2 className="text-xl font-bold">
                  Outfit Preview
                </h2>

                <p className="pt-2 text-sm text-zinc-500">
                  AI-generated fashion visualization
                </p>

                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black pt-5">
                  <img
                    src={image}
                    alt={`${person} fashion outfit`}
                    className="block h-auto w-full object-cover"
                  />
                </div>

                <div className="flex justify-end pt-5">
                  <button
                    onClick={handleDownload}
                    className="rounded-xl bg-zinc-800 px-5 py-3 font-semibold transition hover:bg-zinc-700"
                  >
                    Download Image
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
            disabled={
              loading || imageLoading
            }
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Generating Fashion Ideas..."
              : imageLoading
              ? "Generating Outfit Image..."
              : "Generate Fashion Ideas"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default FashionIdeas;