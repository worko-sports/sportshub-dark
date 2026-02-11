"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Shield, Calendar, Camera } from "lucide-react";
import Link from "next/link";

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: palette.bg, color: palette.text }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: palette.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: palette.bg, color: palette.text }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <Link href="/" className="inline-flex items-center text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">My Profile</h1>
          <p style={{ color: palette.textMuted }}>Manage your account information.</p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border p-8 flex flex-col items-center text-center space-y-4 shadow-xl" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#00e0b8] flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                {user.name[0]}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1e2433] border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm" style={{ color: palette.textMuted }}>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#7c5cff]/20 text-[#9b86ff] border border-[#7c5cff]/30">
                {user.provider === 'google' ? 'Google Account' : 'Verified User'}
              </span>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border p-6 space-y-6 shadow-lg" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 rounded-xl bg-[#7c5cff]/10 flex items-center justify-center">
                <User className="h-5 w-5" style={{ color: palette.primary }} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: palette.textMuted }}>Full Name</label>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 rounded-xl bg-[#00e0b8]/10 flex items-center justify-center">
                <Mail className="h-5 w-5" style={{ color: palette.accent }} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: palette.textMuted }}>Email Address</label>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: palette.textMuted }}>Account Security</label>
                <p className="font-medium">Standard Protection</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard" className="w-full">
              <button className="w-full py-3 rounded-2xl text-sm font-medium transition-all hover:bg-white/5 border" style={{ borderColor: palette.stroke }}>
                View Dashboard
              </button>
            </Link>
            <button 
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-2xl text-sm font-medium transition-all hover:opacity-90"
              style={{ background: palette.primary, color: "white" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
