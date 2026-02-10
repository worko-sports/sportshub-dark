"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

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

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Signup failed");
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
            <h1 className="text-2xl font-semibold mb-2">Create Account</h1>
            <p className="text-sm" style={{ color: palette.textMuted }}>Join SPORTSHUB to host and participate in events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Full Name</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff]"
                style={{ borderColor: palette.stroke, color: palette.text }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs" style={{ color: palette.textMuted }}>
            Already have an account?{" "}
            <Link href="/login" className="hover:underline" style={{ color: palette.accent }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
