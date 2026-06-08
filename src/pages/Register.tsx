import { Brain } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function isEmailRateLimitError(err: unknown) {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  return message.includes("email rate limit") || message.includes("rate limit exceeded") || message.includes("too many");
}

export default function Register() {
  const navigate = useNavigate();
  const { signInAsGuest, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailRateLimited, setEmailRateLimited] = useState(false);
  const [loading, setLoading] = useState(false);

  async function startGuestSession() {
    await signInAsGuest();
    navigate("/");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setEmailRateLimited(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(email, password);
      if (result.needsEmailConfirmation) {
        setMessage("Check your email for the Memvora confirmation link, then sign in.");
      } else {
        setMessage("Account created. You can sign in now.");
        setTimeout(() => navigate("/login"), 900);
      }
    } catch (err) {
      if (isEmailRateLimitError(err)) {
        setEmailRateLimited(true);
        setError("");
      } else {
        setError(err instanceof Error ? err.message : "Could not create account.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestSignIn() {
    setError("");
    setMessage("");
    setEmailRateLimited(false);
    setLoading(true);

    try {
      await startGuestSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start a guest session.");
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
            <h1 className="text-2xl font-bold text-slate-950">Create Memvora</h1>
            <p className="text-sm text-slate-500">Start building your memory vault</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              className="input"
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
            <input
              className="input"
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {emailRateLimited && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-sm font-semibold text-amber-900">Email confirmation is temporarily limited</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Supabase is pausing new confirmation emails for a bit. You can keep exploring Memvora as a guest and create your account later.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button className="button-primary flex-1 px-4 py-2 text-sm" type="button" onClick={handleGuestSignIn} disabled={loading}>
                  {loading ? "Starting..." : "Continue as guest"}
                </button>
                <button className="button-secondary flex-1 px-4 py-2 text-sm" type="submit" disabled={loading}>
                  Try email again
                </button>
              </div>
            </div>
          )}
          {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          <button className="button-primary w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button className="button-secondary w-full" onClick={handleGuestSignIn} disabled={loading}>
          {loading ? "Starting guest session..." : "Continue as guest"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
