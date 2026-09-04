import {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  HiPaperAirplane,
  HiSparkles,
  HiTrash,
  HiClipboard,
  HiCheck,
  HiPlus,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";

import toast from "react-hot-toast";

import { generateAIContent } from "../../services/groq";

import {
  createChat,
  getChats,
  addMessage,
  getChatMessages,
  deleteChat,
} from "../../utils/chatStorage";

import { useAuth } from "../../context/AuthContext";


function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
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
    <div className="my-5 overflow-hidden rounded-2xl border border-zinc-700 bg-[#0B0B0F]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2.5 sm:px-4">
        <span className="text-xs font-medium text-zinc-400">
          {language || "code"}
        </span>

        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
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
            padding: "16px",
            background: "#0B0B0F",
            fontSize: "13px",
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


function MessageContent({ content }) {
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

          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-4 border-violet-500 bg-violet-500/5 px-4 py-3 text-zinc-300">
              {children}
            </blockquote>
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

            const codeValue = String(children).replace(
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

          a: ({
            children,
            href,
            ...props
          }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}


function AIGenerator() {
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);


  /* ================================
     LOAD CHATS
  ================================= */

  useEffect(() => {
    if (!user) {
      setChats([]);
      setMessages([]);
      setCurrentChatId(null);
      setLoadingChats(false);
      return;
    }

    const loadChats = async () => {
      try {
        setLoadingChats(true);

        const data = await getChats();

        setChats(data);

        /*
         * Automatically reopen the most recent chat.
         */
        if (data.length > 0) {
          const latestChat = data[0];

          setCurrentChatId(latestChat.id);

          const chatMessages =
            await getChatMessages(
              latestChat.id
            );

          setMessages(
            chatMessages.map((message) => ({
              role: message.role,
              content: message.content,
            }))
          );
        } else {
          setCurrentChatId(null);
          setMessages([]);
        }
      } catch (error) {
        console.error(
          "Load chats error:",
          error
        );

        toast.error(
          error?.message ||
            "Could not load chats."
        );
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, [user]);


  /* ================================
     AUTO SCROLL
  ================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);


  /* ================================
     NEW CHAT
  ================================= */

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInput("");
    setSidebarOpen(false);

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }
  };


  /* ================================
     OPEN CHAT
  ================================= */

  const openChat = async (chatId) => {
    if (!chatId || loading) return;

    try {
      setLoading(true);

      const chatMessages =
        await getChatMessages(chatId);

      setCurrentChatId(chatId);

      setMessages(
        chatMessages.map((message) => ({
          role: message.role,
          content: message.content,
        }))
      );

      setInput("");
      setSidebarOpen(false);
    } catch (error) {
      console.error(
        "Open chat error:",
        error
      );

      toast.error(
        error?.message ||
          "Could not open this chat."
      );
    } finally {
      setLoading(false);
    }
  };


  /* ================================
     DELETE CHAT
  ================================= */

  const handleDeleteChat = async (
    event,
    chatId
  ) => {
    event.stopPropagation();

    try {
      await deleteChat(chatId);

      setChats((prev) =>
        prev.filter(
          (chat) => chat.id !== chatId
        )
      );

      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }

      toast.success("Chat deleted");
    } catch (error) {
      console.error(
        "Delete chat error:",
        error
      );

      toast.error(
        error?.message ||
          "Could not delete chat."
      );
    }
  };


  /* ================================
     SEND MESSAGE
  ================================= */

  const handleSend = async () => {
    const text = input.trim();

    if (!text || loading) return;

    try {
      setLoading(true);

      let chatId = currentChatId;

      /*
       * Create chat only when the first
       * message is sent.
       */
      if (!chatId) {
        chatId = await createChat(text);

        setCurrentChatId(chatId);

        /*
         * Add the newly created chat locally.
         * No immediate getChats() request required.
         */
        setChats((prev) => [
          {
            id: chatId,
            title:
              text.length > 45
                ? `${text.slice(0, 45)}...`
                : text,
            lastMessage: text,
          },
          ...prev,
        ]);
      }

      /*
       * Keep recent context only.
       */
      const conversation =
        messages.slice(-6);

      /*
       * Show user message immediately.
       */
      const userMessage = {
        role: "user",
        content: text,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      setInput("");

      if (textareaRef.current) {
        textareaRef.current.style.height =
          "auto";
      }

      /*
       * SAVE USER MESSAGE IN BACKGROUND
       *
       * We intentionally do not await this.
       * Groq request can start immediately.
       */
      addMessage(
        chatId,
        "user",
        text
      ).catch((error) => {
        console.error(
          "User message save error:",
          error
        );
      });


      /*
       * AI REQUEST
       *
       * This is now the important part.
       * Firebase is not blocking it.
       */
      const response =
        await generateAIContent({
          prompt: text,
          conversation,
        });


      /*
       * Show AI message immediately.
       */
      const assistantMessage = {
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);


      /*
       * SAVE AI RESPONSE IN BACKGROUND
       *
       * Again, the UI does not wait.
       */
      addMessage(
        chatId,
        "assistant",
        response
      ).catch((error) => {
        console.error(
          "Assistant message save error:",
          error
        );
      });


      /*
       * Update current chat preview locally.
       * No Firebase getChats() request here.
       */
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage:
                  response.slice(0, 120),
              }
            : chat
        )
      );
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      toast.error(
        error?.message ||
          "AI response failed. Please try again."
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };


  /* ================================
     KEYBOARD
  ================================= */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  };


  /* ================================
     TEXTAREA
  ================================= */

  const handleInput = (event) => {
    setInput(event.target.value);

    const textarea = event.target;

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      180
    )}px`;
  };


  return (
    <div
      className="
        fixed
        inset-x-2
        bottom-2
        top-16
        flex
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-[#0A0A0D]
        sm:inset-x-3
        sm:bottom-4
        sm:top-20
        sm:rounded-3xl
        lg:left-[256px]
        lg:right-6
      "
    >

      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {sidebarOpen && (
        <button
          aria-label="Close chat menu"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="absolute inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}


      {/* ================================
          CHAT SIDEBAR
      ================================= */}

      <aside
        className={`absolute bottom-0 left-0 top-0 z-40 flex w-[280px] flex-col border-r border-zinc-800 bg-[#09090C] transition-transform duration-300 lg:relative lg:z-auto lg:flex lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Sidebar Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 p-4">

          <span className="text-sm font-semibold text-white">
            Your Chats
          </span>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white lg:hidden"
          >
            <HiXMark size={20} />
          </button>

        </div>


        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <HiPlus size={18} />
            New Chat
          </button>
        </div>


        {/* Chat List */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">

          {loadingChats ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-600">
              Loading chats...
            </div>
          ) : chats.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs leading-5 text-zinc-600">
              No conversations yet.
            </div>
          ) : (
            <div className="space-y-1">

              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() =>
                    openChat(chat.id)
                  }
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                    currentChatId === chat.id
                      ? "bg-violet-500/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >

                  <span className="min-w-0 flex-1 truncate pr-2 text-sm">
                    {chat.title ||
                      "New Chat"}
                  </span>

                  <span
                    onClick={(event) =>
                      handleDeleteChat(
                        event,
                        chat.id
                      )
                    }
                    className="rounded-lg p-1.5 text-zinc-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    <HiTrash size={15} />
                  </span>

                </button>
              ))}

            </div>
          )}

        </div>
      </aside>


      {/* ================================
          MAIN
      ================================= */}

      <div className="flex min-w-0 flex-1 flex-col">


        {/* ================================
            HEADER
        ================================= */}

        <div className="flex min-h-[72px] shrink-0 items-center justify-between border-b border-zinc-800 px-3 sm:px-5">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            {/* Mobile Sidebar */}
            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white lg:hidden"
            >
              <HiBars3 size={21} />
            </button>


            {/* Desktop Sidebar */}
            <button
              onClick={() =>
                setSidebarOpen(
                  (prev) => !prev
                )
              }
              className="hidden rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white lg:flex"
            >
              <HiBars3 size={20} />
            </button>


            {/* Logo */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-500">
              <HiSparkles size={18} />
            </div>


            <div className="min-w-0">

              <h1 className="truncate text-sm font-bold text-white sm:text-base">
                ContentForge AI
              </h1>

              <p className="truncate text-[10px] text-zinc-500 sm:text-xs">
                Your AI Assistant
              </p>

            </div>

          </div>


          {currentChatId && (
            <span className="hidden text-xs text-zinc-600 sm:block">
              Saved automatically
            </span>
          )}

        </div>


        {/* ================================
            MESSAGES
        ================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4 sm:px-4 sm:py-5 lg:px-8">

          {messages.length === 0 ? (

            <div className="flex min-h-[55vh] items-center justify-center px-3">

              <div className="w-full max-w-2xl text-center">

                <h2 className="text-2xl font-black text-white sm:text-4xl">
                  How can I help you today?
                </h2>

                <p className="mx-auto max-w-xl pt-3 text-xs leading-6 text-zinc-400 sm:pt-4 sm:text-base sm:leading-7">
                  Ask anything about coding,
                  content, AI, ideas, or your
                  project.
                </p>

              </div>

            </div>

          ) : (

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 sm:gap-7">

              {messages.map(
                (message, index) => {
                  const isUser =
                    message.role ===
                    "user";

                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {isUser ? (

                        <div className="max-w-[92%] rounded-3xl rounded-br-md bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm leading-6 text-white shadow-lg sm:max-w-[75%] sm:px-5 sm:py-3.5 sm:text-base sm:leading-7">

                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>

                        </div>

                      ) : (

                        <div className="w-full max-w-full sm:max-w-[94%]">

                          <div className="mb-2 flex items-center gap-2">

                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-fuchsia-500">
                              <HiSparkles size={14} />
                            </div>

                            <span className="text-xs font-semibold text-zinc-500">
                              ContentForge AI
                            </span>

                          </div>


                          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 px-4 py-4 text-base leading-7 text-zinc-200 shadow-lg sm:px-6 sm:py-5 sm:text-base">
                            <MessageContent
                              content={
                                message.content
                              }
                            />

                          </div>

                        </div>

                      )}

                    </div>
                  );
                }
              )}


              {/* Typing */}
              {loading && (
                <div className="flex justify-start">

                  <div className="flex items-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 sm:px-5 sm:py-4">

                    <div className="flex gap-1.5">

                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-500" />

                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-fuchsia-500 [animation-delay:150ms]" />

                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />

                    </div>

                    <span className="text-sm text-zinc-500">
                      Thinking...
                    </span>

                  </div>

                </div>
              )}

              <div ref={bottomRef} />

            </div>
          )}

        </div>


        {/* ================================
            INPUT
        ================================= */}

        <div className="shrink-0 border-t border-zinc-800 bg-[#09090C] p-2.5 sm:p-4">

          <div className="mx-auto flex w-full max-w-5xl items-end gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 p-1.5 sm:p-2">

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message ContentForge AI..."
              className="max-h-[150px] min-h-[44px] flex-1 resize-none overflow-y-auto bg-transparent px-2.5 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-zinc-500 sm:min-h-[46px] sm:px-3 sm:text-base"
            />

            <button
              onClick={handleSend}
              disabled={
                loading ||
                !input.trim()
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-600 text-white transition hover:scale-105 hover:shadow-lg hover:shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-40 sm:h-11 sm:w-11"
            >
              <HiPaperAirplane size={18} />
            </button>

          </div>

          <p className="pt-2 text-center text-[10px] text-zinc-600 sm:text-[11px]">
            Enter to send • Shift + Enter for new line
          </p>

        </div>

      </div>
    </div>
  );
}

export default AIGenerator;