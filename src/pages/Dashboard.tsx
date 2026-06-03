import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import ChatWindow from "../components/ChatWindow";
import MemoryCard from "../components/MemoryCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
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
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMemories() {
    setError("");
    setLoading(true);
    try {
      const response = await api.get<{ memories: Memory[] }>("/memories", {
        params: selectedDays ? { days: selectedDays } : undefined,
      });
      setMemories(response.data.memories);
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
    } catch (err) {
      setSummaryError(getApiError(err));
    } finally {
      setSummaryLoading(false);
    }
  }

  useEffect(() => {
    loadMemories();
  }, [selectedDays]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <Sidebar />
        <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-6">
            <UploadBox onUploaded={loadMemories} />
            <SearchBar />
            <section id="memories" className="soft-panel scroll-mt-24 p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Thoughts Summary</h2>
                  <p className="text-sm text-slate-500">Summarize recent uploads and notes</p>
                </div>
                <button className="button-secondary shrink-0" onClick={summarizeThoughts} disabled={summaryLoading}>
                  <Sparkles size={17} />
                  {summaryLoading ? "Summarizing..." : "Summarize"}
                </button>
              </div>
              {summaryError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{summaryError}</p>}
              {summary ? (
                <p className="whitespace-pre-wrap rounded-2xl bg-brand-50 p-4 text-sm leading-6 text-slate-700">{summary}</p>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                  Generate a compact summary of your recent memories, themes, and next actions.
                </div>
              )}
            </section>
            <section className="soft-panel p-5">
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
                        selectedDays === filter.days ? "bg-brand-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="font-medium text-slate-700">No memories yet</p>
                  <p className="mt-1 text-sm text-slate-500">Upload a file or paste a note to begin.</p>
                </div>
              )}
              <div className="grid gap-3">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </section>
          </section>
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
