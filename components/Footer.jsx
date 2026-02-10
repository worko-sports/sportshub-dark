"use client";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function Footer() {
  const palette = {
    surface: "#111520",
    textMuted: "#a9b0c0",
    stroke: "#1e2433",
  };

  return (
    <footer className="border-t py-12" style={{ background: palette.surface, borderColor: palette.stroke }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#00e0b8]">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SPORTSHUB</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm hover:text-white transition-colors" style={{ color: palette.textMuted }}>
              Terms & Conditions
            </Link>
            <Link href="/" className="text-sm hover:text-white transition-colors" style={{ color: palette.textMuted }}>
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: palette.stroke }}>
          <p className="text-sm" style={{ color: palette.textMuted }}>
            Made by <span className="text-[#7c5cff] font-medium">Anshpreet Singh Bindra</span>
          </p>
          <p className="text-xs mt-2 text-gray-600">
            © {new Date().getFullYear()} SPORTSHUB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
