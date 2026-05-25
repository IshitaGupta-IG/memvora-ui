import { useEffect, useState } from "react";

import ChatWindow from "../components/ChatWindow";
import MemoryCard from "../components/MemoryCard";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import { api, getApiError } from "../lib/api";
import { Memory } from "../types";

export default function Dashboard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMemories() {
    setError("");
    try {
      const response = await api.get<{ memories: Memory[] }>("/memories");
      setMemories(response.data.memories);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <Sidebar />
        <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="space-y-6">
            <UploadBox onUploaded={loadMemories} />
            <SearchBar />
            <section className="soft-panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Recent Memories</h2>
                  <p className="text-sm text-slate-500">Your latest saved knowledge</p>
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

