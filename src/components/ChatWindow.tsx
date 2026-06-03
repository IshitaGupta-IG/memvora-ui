import { Bot, Send, UserRound } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

import { api, getApiError } from "../lib/api";
import { ChatMessage } from "../types";

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ask me what you remember about React, deployments, AI notes, or anything you have saved.",
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

  return (
    <section id="ai-chat" className="soft-panel flex h-[720px] scroll-mt-24 flex-col overflow-hidden">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white">
            <Bot size={21} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">AI Chat</h2>
            <p className="text-sm text-slate-500">Grounded in your memories</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                <Bot size={17} />
              </div>
            )}
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-brand-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Sources</p>
                  <div className="space-y-2">
                    {message.sources.slice(0, 3).map((source) => (
                      <p key={source.chunk_id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        {source.title}
                      </p>
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

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-slate-200 bg-white p-4">
        <input className="input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="What did I upload about React?" />
        <button className="button-primary shrink-0" disabled={loading}>
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}
