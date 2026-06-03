import { FileText, Link, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";

import { api, getApiError } from "../lib/api";

export default function UploadBox({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
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
    formData.append("link_url", linkUrl);
    if (file) formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);
      setMessage(`Saved "${response.data.title}" with ${response.data.chunks_created} chunk(s).`);
      setTitle("");
      setNote("");
      setLinkUrl("");
      setFile(null);
      onUploaded();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="upload" className="soft-panel scroll-mt-24 p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-700">
          <UploadCloud size={21} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Add Memory</h2>
          <p className="text-sm text-slate-500">Upload a file, paste a note, or save a link</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" placeholder="Title, like AWS deployment notes" value={title} onChange={(event) => setTitle(event.target.value)} />
        <div className="relative">
          <Link className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="input pl-11"
            placeholder="Paste a LinkedIn, Facebook, article, or blog link"
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
          />
        </div>
        <textarea
          className="input min-h-32 resize-y"
          placeholder="Paste a note, idea, meeting summary, excerpt, or context for a link..."
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-brand-500 hover:bg-brand-50">
          <div className="flex items-center gap-3">
            <FileText className="text-brand-600" size={22} />
            <div>
              <p className="text-sm font-medium text-slate-700">{file ? file.name : "Choose PDF, TXT, or Markdown"}</p>
              <p className="text-xs text-slate-500">Text-based PDFs work best; links may require public access</p>
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
