import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Studio / Name" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24 md:py-32">
      <Link to="/" className="text-xs uppercase tracking-widest text-ink-soft link-underline">← Home</Link>
      <h1 className="mt-8 font-display text-5xl uppercase">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        {mode === "signup"
          ? "First account created becomes the admin."
          : "Admin access to manage your portfolio."}
      </p>

      <form onSubmit={submit} className="mt-10 space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-soft">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full border-b border-ink bg-transparent py-2 outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-ink-soft">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full border-b border-ink bg-transparent py-2 outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper disabled:opacity-50"
        >
          {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-6 text-xs uppercase tracking-widest text-ink-soft link-underline"
      >
        {mode === "signin" ? "No account? Create one →" : "Already have one? Sign in →"}
      </button>
    </div>
  );
}
