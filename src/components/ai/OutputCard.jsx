import { useState } from "react";
import { HiClipboardDocument, HiArrowDownTray } from "react-icons/hi2";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";


function OutputCard({ text }) {
  const [copied, setCopied] = useState(false);

  const [copiedCode, setCopiedCode] = useState("");

  const copyContent = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied Successfully!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();

    const lines = pdf.splitTextToSize(text, 180);

    pdf.text(lines, 15, 20);

    pdf.save("ContentForge-AI.pdf");

    toast.success("PDF Downloaded!");
  };

  return (
    <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-lg">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-zinc-800 p-6">

        <h2 className="text-2xl font-bold">
          Generated Content
        </h2>

        <div className="flex gap-3">

          <button
            onClick={copyContent}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 transition hover:bg-violet-500"
          >
            <HiClipboardDocument />

            {copied ? "Copied" : "Copy"}
          </button>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 transition hover:bg-zinc-700"
          >
            <HiArrowDownTray />

            PDF
          </button>

        </div>

      </div>

      {/* Markdown */}

      <div className="prose prose-invert max-w-none p-8
      prose-h1:mb-6
      prose-h2:mt-10 prose-h2:mb-4
      prose-h3:mt-8 prose-h3:mb-3
      prose-p:mb-4
      prose-pre:my-6
      prose-ul:my-4
      prose-li:my-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children }) {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");

  if (!inline) {
    return (
      <div className="py-4">
      <div className="overflow-hidden rounded-2xl border border-zinc-700">

        <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-3">

          <span className="text-sm font-medium text-zinc-400">
            {match ? match[1].toUpperCase() : "CODE"}
          </span>

          <CopyToClipboard
            text={code}
            onCopy={() => {
              setCopiedCode(code);

              toast.success("Code Copied!");

              setTimeout(() => {
                setCopiedCode("");
              }, 2000);
            }}
          >
            <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm hover:bg-violet-500">

              {copiedCode === code ? (
                <>
                  <HiCheck />
                  Copied
                </>
              ) : (
                <>
                  <HiClipboardDocument />
                  Copy Code
                </>
              )}

            </button>
          </CopyToClipboard>

        </div>

        <SyntaxHighlighter
          language={match ? match[1] : "javascript"}
          style={oneDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: 0,
            padding: "20px",
            background: "#0f172a",
          }}
        >
          {code}
        </SyntaxHighlighter>

      </div>
      </div>
    );
  }

  return (
    <code className="rounded bg-zinc-800 px-1 py-0.5">
      {children}
    </code>
  );
}
          }}
        >
          {text}
        </ReactMarkdown>

      </div>

    </div>
  );
}

export default OutputCard;