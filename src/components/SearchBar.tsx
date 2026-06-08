import { Search } from "lucide-react";
import { FormEvent, useState } from "react";

import { api, getApiError } from "../lib/api";
import { SearchResult } from "../types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const response = await api.get<{ results: SearchResult[] }>("/search", {
        params: { query },
      });
      setResults(response.data.results);
      setSearched(true);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="search" className="soft-panel scroll-mt-20 p-4 sm:scroll-mt-24 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-brand-200 shadow-lg shadow-brand-600/20">
          <Search size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Semantic Search</h2>
          <p className="text-sm text-slate-500">Find memories by meaning</p>
        </div>
      </div>
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search memories, ideas, links, or screenshots..." />
        <button className="button-secondary w-full shrink-0 sm:w-auto" disabled={loading}>
          <Search size={17} />
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {searched && !loading && results.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-brand-200 bg-white/70 p-4 text-sm leading-6 text-slate-500">
          No strongly relevant memories were found. Try a broader phrase or save more context first.
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((result) => (
            <article key={result.chunk_id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-800">{result.title}</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {(result.similarity * 100).toFixed(0)}%
                </span>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-slate-600">{result.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
