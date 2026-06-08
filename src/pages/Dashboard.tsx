import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import ChatWindow from "../components/ChatWindow";
import MemoryCard from "../components/MemoryCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SummaryView from "../components/SummaryView";
import UploadBox from "../components/UploadBox";
import { api, getApiError } from "../lib/api";
import { Memory } from "../types";

const timeFilters = [
  { label: "All", days: undefined },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
];

export default function Dashboard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedDays, setSelectedDays] = useState<number | undefined>();
  const [summary, setSummary] = useState("");
  const [summaryStale, setSummaryStale] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMemories(options: { markSummaryStale?: boolean } = {}) {
    setError("");
    setLoading(true);
    try {
      const response = await api.get<{ memories: Memory[] }>("/memories", {
        params: selectedDays ? { days: selectedDays } : undefined,
      });
      setMemories(response.data.memories);
      if (options.markSummaryStale && summary) {
        setSummaryStale(true);
      }
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function summarizeThoughts() {
    const days = selectedDays ?? 30;
    setSummary("");
    setSummaryError("");
    setSummaryLoading(true);

    try {
      const response = await api.post<{ summary: string; memories_count: number }>("/summary", { days });
      setSummary(response.data.summary);
      setSummaryStale(false);
    } catch (err) {
      setSummaryError(getApiError(err));
    } finally {
      setSummaryLoading(false);
    }
  }

  useEffect(() => {
    if (summary) {
      setSummaryStale(true);
    }
    loadMemories();
  }, [selectedDays]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-glow sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase text-brand-200">Semantic memory workspace</p>
              <h1 className="text-3xl font-black text-white sm:text-4xl">Capture anything. Retrieve it like a thought.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Upload notes, files, and links, then ask Memvora to search, summarize, and connect your saved context.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">{memories.length}</p>
                <p className="text-xs text-slate-300">Memories</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">{selectedDays ?? "All"}</p>
                <p className="text-xs text-slate-300">Days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">AI</p>
                <p className="text-xs text-slate-300">Recall</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_410px]">
          <section className="space-y-6">
            <UploadBox onUploaded={() => loadMemories({ markSummaryStale: true })} />
            <SearchBar />
            <section className="soft-panel p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Thoughts Summary</h2>
                  <p className="text-sm text-slate-500">Summarize recent uploads and notes</p>
                </div>
                <button className="button-secondary shrink-0" onClick={summarizeThoughts} disabled={summaryLoading}>
                  <Sparkles size={17} />
                  {summaryLoading ? "Summarizing..." : summary ? "Re-summarize" : "Summarize"}
                </button>
              </div>
              {summaryError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{summaryError}</p>}
              {summary && summaryStale && (
                <p className="mb-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  New or filtered memories may not be included yet. Re-summarize to refresh this view.
                </p>
              )}
              {summary ? (
                <SummaryView summary={summary} />
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-200 bg-white/70 p-5 text-sm text-slate-500">
                  Generate a compact summary of your recent memories, themes, and next actions.
                </div>
              )}
            </section>
            <section id="memories" className="soft-panel scroll-mt-24 p-6">
              <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">My Uploads</h2>
                  <p className="text-sm text-slate-500">Browse memories by recency</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter.label}
                      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        selectedDays === filter.days ? "bg-slate-950 text-white shadow-lg shadow-brand-700/20" : "border border-slate-200 bg-white/80 text-slate-600 hover:bg-brand-50"
                      }`}
                      onClick={() => setSelectedDays(filter.days)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              {loading && <p className="text-sm text-slate-500">Loading memories...</p>}
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              {!loading && !error && memories.length === 0 && (
                <div className="rounded-3xl border border-dashed border-brand-200 bg-white/70 p-8 text-center">
                  <p className="font-medium text-slate-700">No memories yet</p>
                  <p className="mt-1 text-sm text-slate-500">Upload a file or paste a note to begin.</p>
                </div>
              )}
              <div className="grid gap-3">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} onChanged={() => loadMemories({ markSummaryStale: true })} />
                ))}
              </div>
            </section>
          </section>
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}
