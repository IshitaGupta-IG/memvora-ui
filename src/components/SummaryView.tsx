import { ReactNode } from "react";

type SummaryBlock =
  | { type: "heading"; text: string }
  | { type: "bullet"; text: string }
  | { type: "paragraph"; text: string };

function cleanMarkdown(text: string) {
  return text
    .replace(/^#{1,6}\s*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();
}

function parseSummary(summary: string): SummaryBlock[] {
  return summary
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^#{1,6}\s+/.test(line)) {
        return { type: "heading", text: cleanMarkdown(line) };
      }
      if (/^[-*]\s+/.test(line)) {
        return { type: "bullet", text: cleanMarkdown(line.replace(/^[-*]\s+/, "")) };
      }
      return { type: "paragraph", text: cleanMarkdown(line) };
    });
}

function renderInlineText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-slate-900">
          {boldMatch[1]}
        </strong>
      );
    }
    return part;
  });
}

export default function SummaryView({ summary }: { summary: string }) {
  const blocks = parseSummary(summary);
  const renderedBlocks: ReactNode[] = [];
  let bulletGroup: SummaryBlock[] = [];

  function flushBullets() {
    if (!bulletGroup.length) return;
    renderedBlocks.push(
      <ul key={`bullets-${renderedBlocks.length}`} className="mb-5 space-y-2 pl-5 text-sm leading-6 text-slate-700">
        {bulletGroup.map((block, index) => (
          <li key={`${block.text}-${index}`} className="list-disc marker:text-brand-500">
            {renderInlineText(block.text)}
          </li>
        ))}
      </ul>,
    );
    bulletGroup = [];
  }

  blocks.forEach((block, index) => {
    if (block.type === "bullet") {
      bulletGroup.push(block);
      return;
    }

    flushBullets();
    if (block.type === "heading") {
      renderedBlocks.push(
        <h3 key={`${block.text}-${index}`} className="mb-3 mt-5 text-sm font-bold uppercase tracking-wide text-slate-950 first:mt-0">
          {block.text}
        </h3>,
      );
      return;
    }

    renderedBlocks.push(
      <p key={`${block.text}-${index}`} className="mb-4 text-sm leading-6 text-slate-700">
        {renderInlineText(block.text)}
      </p>,
    );
  });
  flushBullets();

  return <div className="rounded-2xl border border-brand-100 bg-brand-50/80 p-5">{renderedBlocks}</div>;
}
