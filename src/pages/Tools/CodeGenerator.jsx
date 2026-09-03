import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  HiCodeBracket,
  HiClipboard,
  HiCheck,
} from "react-icons/hi2";

import { generateAIContent } from "../../services/groq";
import { saveToHistory } from "../../utils/storage";

import FavoriteButton from "../../components/common/FavoriteButton";

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);
      toast.success("Code copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Could not copy code.");
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-zinc-700 bg-[#09090C]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <span className="text-xs font-medium text-zinc-400">
          {language || "code"}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          {copied ? (
            <>
              <HiCheck size={15} />
              Copied
            </>
          ) : (
            <>
              <HiClipboard size={15} />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language || "text"}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "18px",
            background: "#09090C",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
          wrapLongLines
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function GeneratedCode({ content }) {
  return (
    <div className="max-w-none text-sm leading-7 text-zinc-200 sm:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="pb-4 text-2xl font-bold text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="pb-3 pt-5 text-xl font-bold text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="pb-2 pt-4 text-lg font-semibold text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="pb-4 leading-7 text-zinc-300">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pb-4 pl-6 text-zinc-300">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pb-4 pl-6 text-zinc-300">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),

          code({
            inline,
            className,
            children,
            ...props
          }) {
            const match =
              /language-([\w-]+)/.exec(
                className || ""
              );

            const codeValue =
              String(children).replace(
                /\n$/,
                ""
              );

            if (!inline) {
              return (
                <CodeBlock
                  language={
                    match?.[1] || "code"
                  }
                  value={codeValue}
                />
              );
            }

            return (
              <code
                className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-sm text-violet-300"
                {...props}
              >
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <>{children}</>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeGenerator() {
  const [language, setLanguage] =
    useState("React");

  const [styling, setStyling] =
    useState("Tailwind CSS");

  const [prompt, setPrompt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState("");

  const [allCopied, setAllCopied] =
    useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(
        "Please describe the code you want."
      );
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response =
        await generateAIContent({
          category: "Code Generator",
          language: "",
          tone: "Professional",
          length: "Long",
          prompt: `
Generate clean, correct, production-ready code.

Programming / Framework:
${language}

Styling / UI:
${styling}

User request:
${prompt}

Requirements:
- Return complete working code.
- If multiple files are needed, show the folder structure first.
- Give every file its own heading.
- Give every file its own fenced code block.
- Use the correct code language.
- Include all imports and exports.
- Never use placeholder code.
- Do not invent unnecessary dependencies.
- Explain briefly how the files work together.
          `,
        });

      // Save to Firebase History
      try {
        await saveToHistory({
          category: "Code Generator",
          title: `${language} Project`,
          prompt,
          result: response,
        });
      } catch (historyError) {
        console.error(
          "History save error:",
          historyError
        );

        toast.error(
          "Code generated, but it could not be saved to history."
        );
      }

      setResult(response);

      toast.success(
        "Code generated successfully!"
      );
    } catch (error) {
      console.error(
        "Code generation error:",
        error
      );

      toast.error(
        error?.message ||
          "Code generation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        result
      );

      setAllCopied(true);
      toast.success(
        "Complete response copied!"
      );

      setTimeout(() => {
        setAllCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Could not copy response.");
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
      <div className="flex h-[98px] shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0A0A0D] px-4 sm:px-6">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Code Generator
          </h1>

          <p className="pt-2 text-xs text-zinc-500">
            AI Coding Assistant
          </p>
        </div>

        {result && (
          <button
            onClick={copyAll}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            {allCopied ? (
              <>
                <HiCheck size={17} />
                <span className="hidden sm:block">
                  Copied
                </span>
              </>
            ) : (
              <>
                <HiClipboard size={17} />
                <span className="hidden sm:block">
                  Copy All
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">

          <div className="pb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Build something amazing
            </h2>

            <p className="pt-2 text-sm leading-6 text-zinc-400 sm:text-base">
              Choose your technology and describe what you want to build.
            </p>
          </div>

          {/* Programming */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Programming / Framework
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none transition focus:border-violet-500 sm:text-base"
            >
              <option>React</option>
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Python</option>
              <option>Next.js</option>
              <option>Node.js</option>
              <option>PHP</option>
              <option>Java</option>
              <option>C++</option>
            </select>
          </div>

          {/* Styling */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Styling / UI
            </label>

            <select
              value={styling}
              onChange={(e) =>
                setStyling(e.target.value)
              }
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none transition focus:border-violet-500 sm:text-base"
            >
              <option>Tailwind CSS</option>
              <option>CSS</option>
              <option>Bootstrap</option>
              <option>SCSS</option>
              <option>Material UI</option>
              <option>Chakra UI</option>
              <option>None</option>
            </select>
          </div>

          {/* Prompt */}
          <div className="pb-8">
            <label className="block pb-3 text-sm font-semibold text-zinc-300">
              Describe what you want to build
            </label>

            <textarea
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              placeholder="Example: Create a responsive React navbar with Tailwind CSS, mobile menu and dark mode."
              className="h-44 w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-sm leading-6 outline-none transition focus:border-violet-500 sm:text-base"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="pb-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">

                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />

                <p className="pt-5 text-zinc-400">
                  Writing your code...
                </p>

              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="pb-8">

              <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">

                <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Generated Solution
                    </h3>

                    <p className="pt-1 text-xs text-zinc-500">
                      {language}
                      {" • "}
                      {styling}
                    </p>
                  </div>

                  <button
                    onClick={copyAll}
                    className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  >
                    {allCopied ? (
                      <>
                        <HiCheck size={15} />
                        Copied
                      </>
                    ) : (
                      <>
                        <HiClipboard size={15} />
                        Copy All
                      </>
                    )}
                  </button>

                </div>

                <div className="px-4 py-5 sm:px-6">
                  <GeneratedCode
                    content={result}
                  />
                </div>
               
               // Code
         <FavoriteButton
          type="Code"
          title={`${language} Project`}
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiCodeBracket size={20} />

            {loading
              ? "Generating Code..."
              : "Generate Code"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default CodeGenerator;