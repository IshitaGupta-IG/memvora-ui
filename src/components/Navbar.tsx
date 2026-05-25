import { Brain, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { signOut, user } = useAuth();
  const displayName = user?.email || "Guest session";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white">
            <Brain size={21} />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">Memvora</p>
            <p className="text-xs text-slate-500">Your AI Memory Vault</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:inline">{displayName}</span>
          <button className="button-secondary py-2" onClick={signOut} title="Sign out">
            <LogOut size={17} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
