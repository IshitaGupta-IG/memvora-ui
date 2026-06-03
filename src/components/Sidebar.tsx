import { MessageSquareText, Search, UploadCloud, Vault } from "lucide-react";

const items = [
  { label: "Upload", icon: UploadCloud, href: "#upload" },
  { label: "AI Chat", icon: MessageSquareText, href: "#ai-chat" },
  { label: "Search", icon: Search, href: "#search" },
  { label: "Memories", icon: Vault, href: "#memories" },
];

export default function Sidebar() {
  return (
    <aside className="soft-panel hidden h-fit p-3 lg:block">
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
          >
            <item.icon size={18} className="text-brand-600" />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
