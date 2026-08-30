import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const next = typeof window !== "undefined" ? sessionStorage.getItem("femme_next") || "/account" : "/account";

  useEffect(() => {
    if (isPending || !user) return;
    const dest = next.startsWith("/") ? next : "/account";
    void navigate({ to: dest });
  }, [isPending, user, next, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0] || "Guest",
        });
        if (err) throw new Error(err.message || "Could not register");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || "Could not sign in");
      }
      sessionStorage.removeItem("femme_next");
      await navigate({ to: next.startsWith("/") ? next : "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-4xl text-fg">{mode === "in" ? "Sign in" : "Register"}</h1>
      <p className="mt-2 text-sm text-muted">Save orders across devices. Checkout needs an account.</p>

      {authEnabled ? (
        <div className="mt-6 space-y-3">
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => {
                sessionStorage.setItem("femme_next", next);
                void signIn(p.providerId, { callbackURL: next.startsWith("/") ? next : "/account" });
              }}
              className="h-12 w-full rounded-full bg-fg text-xs font-semibold uppercase tracking-widest text-bg"
            >
              Continue with {p.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
      )}

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          className={`h-11 rounded-full px-4 text-xs uppercase tracking-wider ${mode === "in" ? "bg-blush text-fg" : "border border-line text-muted"}`}
          onClick={() => setMode("in")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`h-11 rounded-full px-4 text-xs uppercase tracking-wider ${mode === "up" ? "bg-blush text-fg" : "border border-line text-muted"}`}
          onClick={() => setMode("up")}
        >
          Register
        </button>
      </div>

      <form className="mt-6 space-y-3" onSubmit={(e) => void onSubmit(e)}>
        {mode === "up" && (
          <label className="block text-sm text-accent">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full border border-line bg-elevated px-3 text-fg"
            />
          </label>
        )}
        <label className="block text-sm text-accent">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 h-11 w-full border border-line bg-elevated px-3 text-fg"
          />
        </label>
        <label className="block text-sm text-accent">
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 h-11 w-full border border-line bg-elevated px-3 text-fg"
          />
        </label>
        {error && <p className="text-blush">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-full bg-accent text-xs font-semibold uppercase tracking-widest text-accent-fg"
        >
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create my account"}
        </button>
      </form>
      <Link to="/" className="mt-6 inline-block text-sm text-accent">
        Back to shop
      </Link>
    </main>
  );
}
