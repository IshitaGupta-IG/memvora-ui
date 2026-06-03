import { Brain } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage("Check your email for a Memvora password reset link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md soft-panel p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Reset password</h1>
            <p className="text-sm text-slate-500">Recover your Memvora account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-brand-700">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

