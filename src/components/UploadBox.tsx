import { FileText, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";

import { api, getApiError } from "../lib/api";

export default function UploadBox({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("note", note);
    if (file) formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);
      setMessage(`Saved "${response.data.title}" with ${response.data.chunks_created} chunk(s).`);
      setTitle("");
      setNote("");
      setFile(null);
      onUploaded();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="soft-panel p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-700">
          <UploadCloud size={21} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Add Memory</h2>
          <p className="text-sm text-slate-500">Upload a file or paste a note</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" placeholder="Title, like AWS deployment notes" value={title} onChange={(event) => setTitle(event.target.value)} />
        <textarea
          className="input min-h-32 resize-y"
          placeholder="Paste a note, idea, meeting summary, or memory..."
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-brand-500 hover:bg-brand-50">
          <div className="flex items-center gap-3">
            <FileText className="text-brand-600" size={22} />
            <div>
              <p className="text-sm font-medium text-slate-700">{file ? file.name : "Choose PDF, TXT, or Markdown"}</p>
              <p className="text-xs text-slate-500">Text-based PDFs work best</p>
            </div>
          </div>
          <input
            className="hidden"
            type="file"
            accept=".pdf,.txt,.md,.markdown,text/plain,application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        <button className="button-primary" disabled={loading}>
          {loading ? "Saving memory..." : "Save memory"}
        </button>
      </form>
    </section>
  );
}

