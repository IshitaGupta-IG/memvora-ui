import { FileText, Image, Link, UploadCloud } from "lucide-react";
import { ClipboardEvent, FormEvent, useState } from "react";

import { api, getApiError } from "../lib/api";

export default function UploadBox({ onUploaded }: { onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function useSelectedFile(nextFile: File | null) {
    setFile(nextFile);
    if (nextFile && !title.trim()) {
      setTitle(nextFile.type.startsWith("image/") ? "Pasted screenshot" : nextFile.name.replace(/\.[^.]+$/, ""));
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>) {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith("image/"));
    if (!imageItem) return;

    const pastedFile = imageItem.getAsFile();
    if (!pastedFile) return;

    event.preventDefault();
    const extension = pastedFile.type.split("/")[1] || "png";
    const screenshot = new File([pastedFile], `pasted-screenshot.${extension}`, { type: pastedFile.type });
    useSelectedFile(screenshot);
    setMessage("Screenshot attached. Add a title or note, then save it.");
    setError("");
  }

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
      useSelectedFile(null);
      onUploaded();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="upload" className="soft-panel scroll-mt-24 p-6" onPaste={handlePaste}>
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-brand-200 shadow-lg shadow-brand-600/20">
          <UploadCloud size={21} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Add Memory</h2>
          <p className="text-sm text-slate-500">Upload a file, paste a note, save a link, or paste a screenshot</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" placeholder="Title, like AWS deployment notes" value={title} onChange={(event) => setTitle(event.target.value)} />
        <div className="relative">
          <Link className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-3 pl-16 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
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
        <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-dashed border-brand-200 bg-white/70 px-4 py-4 transition hover:border-brand-500 hover:bg-brand-50">
          <div className="flex items-center gap-3">
            <FileText className="text-brand-600" size={22} />
            <div>
              <p className="text-sm font-medium text-slate-700">{file ? file.name : "Choose PDF, TXT, Markdown, or image"}</p>
              <p className="text-xs text-slate-500">Paste a screenshot into this panel or choose PNG, JPG, or WebP</p>
            </div>
          </div>
          {file?.type.startsWith("image/") && <Image className="shrink-0 text-brand-600" size={20} />}
          <input
            className="hidden"
            type="file"
            accept=".pdf,.txt,.md,.markdown,.png,.jpg,.jpeg,.webp,text/plain,application/pdf,image/png,image/jpeg,image/webp"
            onChange={(event) => useSelectedFile(event.target.files?.[0] ?? null)}
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
