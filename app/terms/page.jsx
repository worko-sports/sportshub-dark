"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, ShieldCheck, Scale, FileText } from "lucide-react";

const palette = {
  bg: "#0b0e14",
  surface: "#111520",
  primary: "#7c5cff",
  text: "#e8ecf2",
  textMuted: "#a9b0c0",
  stroke: "#1e2433",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: palette.bg, color: palette.text }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-[#0b0e14]/80" style={{ borderColor: palette.stroke }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#00e0b8]">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </Link>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">SPORTSHUB</span>
              </div>
            </div>
            
            <Link href="/">
                <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:opacity-90" style={{ background: palette.surface, border: `1px solid ${palette.stroke}` }}>
                  <ArrowLeft className="h-4 w-4" style={{ color: palette.textMuted }} />
                  Back to Home
                </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-400">
            Please read these terms and conditions carefully before using our platform.
          </p>
        </div>

        <div className="space-y-8">
          <section className="p-6 rounded-2xl border" style={{ background: palette.surface, borderColor: palette.stroke }}>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-[#7c5cff]" />
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using SportsHub, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="p-6 rounded-2xl border" style={{ background: palette.surface, borderColor: palette.stroke }}>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-[#00e0b8]" />
              <h2 className="text-xl font-semibold">2. User Conduct</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              All users are expected to conduct themselves in a respectful manner. Harassment, hate speech, and inappropriate behavior will not be tolerated and may result in the termination of your account.
            </p>
          </section>

          <section className="p-6 rounded-2xl border" style={{ background: palette.surface, borderColor: palette.stroke }}>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-yellow-400" />
              <h2 className="text-xl font-semibold">3. Event Participation</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Participation in events is subject to the rules and regulations set forth by the event organizers. SportsHub is not responsible for any injuries or disputes that may occur during the events.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
