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

function renderInlineText(text: string, strongClassName = "font-semibold text-slate-900") {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={`${part}-${index}`} className={strongClassName}>
          {boldMatch[1]}
        </strong>
      );
    }
    return part;
  });
}

type FormattedTextProps = {
  text: string;
  variant?: "summary" | "chat";
};

export function FormattedText({ text, variant = "summary" }: FormattedTextProps) {
  const blocks = parseSummary(text);
  const renderedBlocks: ReactNode[] = [];
  let bulletGroup: SummaryBlock[] = [];
  const isChat = variant === "chat";
  const strongClassName = isChat ? "font-semibold text-slate-950" : "font-semibold text-slate-900";
  const paragraphClassName = isChat ? "mb-3 text-sm leading-6 text-slate-700 last:mb-0" : "mb-4 text-sm leading-6 text-slate-700";
  const bulletClassName = isChat ? "mb-3 space-y-2 pl-5 text-sm leading-6 text-slate-700 last:mb-0" : "mb-5 space-y-2 pl-5 text-sm leading-6 text-slate-700";
  const headingClassName = isChat
    ? "mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-slate-950 first:mt-0"
    : "mb-3 mt-5 text-sm font-bold uppercase tracking-wide text-slate-950 first:mt-0";

  function flushBullets() {
    if (!bulletGroup.length) return;
    renderedBlocks.push(
      <ul key={`bullets-${renderedBlocks.length}`} className={bulletClassName}>
        {bulletGroup.map((block, index) => (
          <li key={`${block.text}-${index}`} className="list-disc marker:text-brand-500">
            {renderInlineText(block.text, strongClassName)}
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
        <h3 key={`${block.text}-${index}`} className={headingClassName}>
          {block.text}
        </h3>,
      );
      return;
    }

    renderedBlocks.push(
      <p key={`${block.text}-${index}`} className={paragraphClassName}>
        {renderInlineText(block.text, strongClassName)}
      </p>,
    );
  });
  flushBullets();

  if (isChat) {
    return <div>{renderedBlocks}</div>;
  }

  return <div className="rounded-2xl border border-brand-100 bg-brand-50/80 p-5">{renderedBlocks}</div>;
}

export default function SummaryView({ summary }: { summary: string }) {
  return <FormattedText text={summary} />;
}
