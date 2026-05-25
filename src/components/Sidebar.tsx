import { MessageSquareText, Search, UploadCloud, Vault } from "lucide-react";

const items = [
  { label: "Upload", icon: UploadCloud },
  { label: "AI Chat", icon: MessageSquareText },
  { label: "Search", icon: Search },
  { label: "Memories", icon: Vault },
];

export default function Sidebar() {
  return (
    <aside className="soft-panel hidden h-fit p-3 lg:block">
      <nav className="space-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600">
            <item.icon size={18} className="text-brand-600" />
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}

