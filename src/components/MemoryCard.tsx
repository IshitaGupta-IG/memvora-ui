import { Calendar, FileText, Link } from "lucide-react";

import { Memory } from "../types";

export default function MemoryCard({ memory }: { memory: Memory }) {
  const Icon = memory.source_type === "link" ? Link : FileText;
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(memory.created_at));

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600">
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900">{memory.title}</h3>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{memory.source_type}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{memory.original_content}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Calendar size={14} />
            {date}
          </div>
        </div>
      </div>
    </article>
  );
}
