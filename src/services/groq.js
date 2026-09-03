function getErrorMessage(error) {
  if (!error) {
    return "AI response failed. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  if (error.error) {
    if (typeof error.error === "string") {
      return error.error;
    }

    if (
      typeof error.error === "object" &&
      typeof error.error.message === "string"
    ) {
      return error.error.message;
    }
  }

  if (typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return "AI response failed. Please try again.";
    }
  }

  return String(error);
}

export async function generateAIContent({
  prompt,
  conversation = [],
  category = "",
  language = "",
  tone = "",
  length = "",
}) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        prompt,
        conversation,
        category,
        language,
        tone,
        length,
      }),
    });

    const raw = await response.text();

    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(
        `AI API returned invalid JSON (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data?.error || data) ||
          `AI request failed (${response.status}).`
      );
    }

    if (!data.content) {
      throw new Error("AI API returned an empty response.");
    }

    return data.content;
  } catch (error) {
    console.error("AI service error:", error);

    throw new Error(getErrorMessage(error));
  }
}