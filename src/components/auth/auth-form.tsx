"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

type AuthMode = "login" | "register" | "forgot";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const t = useTranslations("login");
  const { user } = useAuth();

  // If already logged in, redirect
  if (user) {
    router.push("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError(t("passwordMin"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
      },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setMessage(t("checkEmail"));
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/login`,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setMessage(t("resetSent"));
    setLoading(false);
  };

  const onSubmit =
    mode === "login"
      ? handleLogin
      : mode === "register"
        ? handleRegister
        : handleForgotPassword;

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">
          LEG<span className="text-red-500">T</span>
        </h1>
        <p className="text-sm text-zinc-400">
          {mode === "login"
            ? t("loginSubtitle")
            : mode === "register"
              ? t("registerSubtitle")
              : t("forgotSubtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
              {t("displayName")}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              placeholder={t("displayNamePlaceholder")}
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
            placeholder="player@example.com"
          />
        </div>

        {mode !== "forgot" && (
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 font-medium">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {message && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading
            ? t("loading")
            : mode === "login"
              ? t("loginButton")
              : mode === "register"
                ? t("registerButton")
                : t("resetButton")}
        </button>
      </form>

      {/* Mode switch links */}
      <div className="text-center space-y-2 text-xs">
        {mode === "login" && (
          <>
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {t("forgotPassword")}
            </button>
            <div className="text-zinc-600">
              {t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); setMessage(""); }}
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                {t("registerLink")}
              </button>
            </div>
          </>
        )}
        {mode === "register" && (
          <div className="text-zinc-600">
            {t("hasAccount")}{" "}
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
              className="text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              {t("loginLink")}
            </button>
          </div>
        )}
        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setMessage(""); }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {t("backToLogin")}
          </button>
        )}
      </div>
    </div>
  );
}
