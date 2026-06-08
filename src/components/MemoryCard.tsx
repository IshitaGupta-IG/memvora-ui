import { Calendar, Check, ChevronDown, FileText, Image, Link, Maximize2, Pencil, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { api, getApiError } from "../lib/api";
import { Memory } from "../types";

export default function MemoryCard({ memory, onChanged }: { memory: Memory; onChanged: () => void }) {
  const Icon = memory.source_type === "link" ? Link : memory.source_type === "screenshot" ? Image : FileText;
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(memory.created_at));
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(memory.title);
  const [content, setContent] = useState(memory.original_content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);

  function cancelEdit() {
    setTitle(memory.title);
    setContent(memory.original_content);
    setError("");
    setIsEditing(false);
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.put(`/memories/${memory.id}`, {
        title,
        original_content: content,
      });
      setIsEditing(false);
      onChanged();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function deleteMemory() {
    setError("");
    setLoading(true);
    try {
      await api.delete(`/memories/${memory.id}`);
      onChanged();
    } catch (err) {
      setError(getApiError(err));
      setLoading(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600">
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form onSubmit={saveEdit} className="space-y-3">
              <input className="input py-2" value={title} onChange={(event) => setTitle(event.target.value)} required />
              <textarea className="input min-h-28 resize-y" value={content} onChange={(event) => setContent(event.target.value)} required />
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="flex flex-wrap items-center gap-2">
                <button className="button-primary px-4 py-2 text-sm" disabled={loading} title="Save changes">
                  <Check size={16} />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button className="button-secondary px-4 py-2 text-sm" type="button" onClick={cancelEdit} disabled={loading} title="Cancel editing">
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                <button className="min-w-0 flex-1 text-left" type="button" onClick={() => setExpanded((current) => !current)}>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">{memory.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={14} />
                      {date}
                    </div>
                  </div>
                </button>
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{memory.source_type}</span>
                  <button
                    className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    type="button"
                    onClick={() => setIsEditing(true)}
                    title="Edit memory"
                    disabled={loading}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    title="Delete memory"
                    disabled={loading}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    title={expanded ? "Collapse memory" : "Expand memory"}
                  >
                    <ChevronDown className={`transition ${expanded ? "rotate-180" : ""}`} size={17} />
                  </button>
                </div>
              </div>
              {expanded && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {memory.source_type === "screenshot" && (
                    <div className="mb-3">
                      {memory.image_data_url ? (
                        <button
                          className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-left"
                          type="button"
                          onClick={() => setShowImageViewer(true)}
                          title="Open screenshot"
                        >
                          <img className="max-h-64 w-full object-contain" src={memory.image_data_url} alt={memory.title} loading="lazy" />
                          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-lg transition group-hover:bg-brand-600 group-hover:text-white">
                            <Maximize2 size={17} />
                          </span>
                        </button>
                      ) : (
                        <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
                          Screenshot preview is unavailable for this memory. OCR text is shown below.
                        </p>
                      )}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{memory.original_content}</p>
                  {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-950">Delete memory?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will remove "{memory.title}" and its search chunks from Memvora.
            </p>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <div className="mt-5 flex gap-3">
              <button className="button-secondary flex-1 px-4 py-2" type="button" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                Cancel
              </button>
              <button className="button-primary flex-1 bg-red-600 px-4 py-2 hover:bg-red-700" type="button" onClick={deleteMemory} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showImageViewer && memory.image_data_url && (
        <div className="fixed inset-0 z-[60] bg-slate-950/95 p-4 backdrop-blur-sm sm:p-6">
          <button
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white text-slate-800 shadow-2xl transition hover:bg-brand-50 hover:text-brand-700"
            type="button"
            onClick={() => setShowImageViewer(false)}
            title="Close screenshot"
          >
            <X size={22} />
          </button>
          <div className="flex h-full w-full items-center justify-center pt-12">
            <img className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl" src={memory.image_data_url} alt={memory.title} />
          </div>
        </div>
      )}
    </article>
  );
}
