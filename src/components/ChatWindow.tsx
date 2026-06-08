import { Bot, Send, UserRound, X } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

import { api, getApiError } from "../lib/api";
import { ChatMessage } from "../types";
import { FormattedText } from "./SummaryView";

export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me what you saved recently, which ideas kept coming back, or what themes showed up in your memories.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: question }]);

    try {
      const response = await api.post("/chat", { message: question });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources,
        },
      ]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 20);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: getApiError(err),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-brand-900/25 transition hover:-translate-y-0.5 hover:bg-brand-700"
        onClick={() => setOpen(true)}
      >
        <Bot size={19} />
        AI Chat
      </button>
    );
  }

  return (
    <section id="ai-chat" className="fixed bottom-5 right-5 z-40 flex h-[min(680px,calc(100vh-2.5rem))] w-[min(430px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-brand-900/20">
      <div className="border-b border-white/70 bg-white/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-brand-200 shadow-lg shadow-brand-600/20">
              <Bot size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">AI Chat</h2>
              <p className="text-sm text-slate-500">Grounded in your memories</p>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50" onClick={() => setOpen(false)} title="Collapse chat">
            <X size={17} />
          </button>
        </div>
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
          Answers may use Gemini/OpenRouter with redacted memory context.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-brand-50/60 to-slate-50 p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                <Bot size={17} />
              </div>
            )}
            <div className={`min-w-0 max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-slate-950 text-white shadow-lg shadow-brand-700/20" : "bg-white text-slate-700 shadow-sm"}`}>
              {message.role === "assistant" ? <FormattedText text={message.content} variant="chat" /> : <p className="whitespace-pre-wrap">{message.content}</p>}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Sources</p>
                  <div className="space-y-2">
                    {message.sources.slice(0, 3).map((source) => (
                      <div key={source.chunk_id} className="rounded-xl bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-semibold text-slate-600">{source.title}</p>
                          <span className="shrink-0 text-[11px] font-medium text-brand-700">{Math.round(source.similarity * 100)}%</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{source.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {message.role === "user" && (
              <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-700">
                <UserRound size={17} />
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-slate-500">Thinking with your memories...</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-white/70 bg-white/90 p-4">
        <input className="input min-w-0" value={input} onChange={(event) => setInput(event.target.value)} placeholder="What did I save in the last 30 days?" />
        <button className="button-primary shrink-0" disabled={loading}>
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}
