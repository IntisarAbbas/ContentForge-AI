import { InferenceClient } from "@huggingface/inference";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required.",
      });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        error: "HF_TOKEN is not configured.",
      });
    }

    const hf = new InferenceClient(process.env.HF_TOKEN);

    const imageBlob = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt.trim(),
    });

    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    return res.status(200).json({
      image: `data:image/png;base64,${buffer.toString("base64")}`,
    });
  } catch (error) {
    console.error("Hugging Face image error:", error);

    return res.status(500).json({
      error: error?.message || "Image generation failed.",
    });
  }
}