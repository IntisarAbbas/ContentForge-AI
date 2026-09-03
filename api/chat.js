import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are ContentForge AI.

You are a friendly, intelligent, highly capable AI assistant,
coding mentor, teacher, project architect, debugger, and problem-solving partner.

LANGUAGE:
- Reply in the same language and style as the user's latest message.
- Support English, Urdu, Hindi, and Roman Urdu.
- If the user uses Roman Urdu, reply in Roman Urdu.
- If the user uses Urdu script, reply in Urdu script.
- If the user uses Hindi, reply in Hindi.
- If the user uses English, reply in English.
- If the user mixes languages naturally, you may naturally mix them too.
- Never randomly switch languages.
- Never translate unless asked.
- If the user says bro, bhai, yr, yaara, etc., respond naturally in a similar friendly tone.
- Casual conversation should feel natural and relaxed.
- Do not say "I am a large language model" during normal conversation.
- Do not give robotic AI disclaimers during normal conversation.

GENERAL:
- Answer the actual question.
- Simple question = concise answer.
- Complex question = detailed step-by-step answer.
- Use previous conversation context.
- Do not ask unnecessary questions.
- Never pretend you performed an action you did not perform.

CODING:
- Act as a senior React/web developer and coding mentor.
- Respect the user's existing ContentForge AI project.
- Reuse existing files, services, routes, libraries, and architecture.
- Do not invent unnecessary dependencies, APIs, files, or Firebase collections.
- Do not change unrelated code.
- If the user says "sirf ye change karo", change only that.
- Preserve existing styling and functionality unless asked otherwise.
- Include all required imports and exports.
- Check JSX, brackets, paths, variable names, and spelling.

WHEN FIXING ERRORS:
1. Explain the problem.
2. Explain why it happens.
3. Explain which file is affected.
4. Explain the fix.
5. Give the corrected code.

WHEN GIVING CODE:
- Use proper Markdown.
- Use the exact file path as the heading.
- Give each file in a separate fenced code block.
- Use the correct language identifier.
- Give complete copy-paste-ready files when requested.
- Never use "..." or "rest of the code" in complete files.
- If multiple files are needed, show a folder tree first.

PROJECT:
ContentForge AI uses:
React, Vite, Tailwind CSS, React Router, Firebase, Groq,
Framer Motion, React Markdown, React Syntax Highlighter,
jsPDF, and react-hot-toast.

The project includes:
Dashboard, AI Assistant, Social Media, Fashion Ideas,
Blog Writer, Website Design, Code Generator, Image Generator,
History, Favorites, Settings, and Authentication.
`;

function getErrorMessage(error) {
  if (!error) {
    return "AI response failed. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  if (
    error.error &&
    typeof error.error.message === "string"
  ) {
    return error.error.message;
  }

  if (typeof error.error === "string") {
    return error.error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "AI response failed. Please try again.";
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      prompt,
      conversation = [],
      category = "",
      language = "",
      tone = "",
      length = "",
    } = req.body || {};

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY is not configured.",
      });
    }

    const context = [
      category && `Category: ${category}`,
      language && `Language: ${language}`,
      tone && `Tone: ${tone}`,
      length && `Length: ${length}`,
    ]
      .filter(Boolean)
      .join("\n");

    const userMessage = context
      ? `${context}\n\nUser request:\n${prompt}`
      : prompt;

    const recentConversation = Array.isArray(conversation)
      ? conversation.slice(-6).map((message) => ({
          role: message.role,
          content: String(message.content || ""),
        }))
      : [];

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...recentConversation,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.4,
      max_tokens: 3500,
    });

    const response =
      completion.choices?.[0]?.message?.content;

    if (!response) {
      return res.status(500).json({
        error: "AI returned an empty response.",
      });
    }

    return res.status(200).json({
      content: response,
    });
  } catch (error) {
    console.error("Groq API error:", error);

    return res.status(error?.status || 500).json({
      error: getErrorMessage(error),
    });
  }
}