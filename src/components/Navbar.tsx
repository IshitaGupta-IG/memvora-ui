import { Brain, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { signOut, user } = useAuth();
  const displayName = user?.email || "Guest session";

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-brand-200 shadow-lg shadow-brand-600/20">
            <Brain size={21} />
          </div>
          <div>
            <p className="text-xl font-black text-slate-950">Memvora</p>
            <p className="text-xs font-medium text-brand-700">Your AI Memory Vault</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 sm:inline">{displayName}</span>
          <button className="button-secondary py-2" onClick={signOut} title="Sign out">
            <LogOut size={17} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
