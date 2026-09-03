export async function generateImage(prompt) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const raw = await response.text();

  let data = {};

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(
      `Image API returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    const message =
      typeof data.error === "string"
        ? data.error
        : JSON.stringify(data.error || data);

    throw new Error(message);
  }

  if (!data.image) {
    throw new Error("No image was returned by the image API.");
  }

  return data.image;
}