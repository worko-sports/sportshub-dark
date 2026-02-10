"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const palette = {
  bg: "#0b0e14",
  surface: "#111520",
  primary: "#7c5cff",
  primarySoft: "#9b86ff",
  accent: "#00e0b8",
  text: "#e8ecf2",
  textMuted: "#a9b0c0",
  stroke: "#1e2433",
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: palette.bg, color: palette.text }}>
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm mb-8 hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
        
        <div className="rounded-2xl border p-8" style={{ background: palette.surface, borderColor: palette.stroke }}>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
            <p className="text-sm" style={{ color: palette.textMuted }}>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Email</label>
              <input
                type="email"
                required
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff]"
                style={{ borderColor: palette.stroke, color: palette.text }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Password</label>
              <input
                type="password"
                required
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff]"
                style={{ borderColor: palette.stroke, color: palette.text }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              style={{ background: palette.primary, color: "white" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: palette.stroke }}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2" style={{ background: palette.surface, color: palette.textMuted }}>Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5 flex items-center justify-center border"
              style={{ borderColor: palette.stroke, color: palette.text }}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </button>
          </form>

          <div className="mt-6 text-center text-xs" style={{ color: palette.textMuted }}>
            Don't have an account?{" "}
            <Link href="/signup" className="hover:underline" style={{ color: palette.accent }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
