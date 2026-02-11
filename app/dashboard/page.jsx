"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Trophy, Trash2, Plus, BarChart3, Search, Filter } from "lucide-react";
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
          // Fetch user events
          fetch('/api/events/user')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMyEvents(data);
            })
            .catch(err => console.error("Failed to fetch my events", err))
            .finally(() => setLoading(false));
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleDeleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMyEvents(prev => prev.filter(e => e._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete event");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  const filteredEvents = myEvents.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.sport.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase())
  );

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
        className="mx-auto max-w-5xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center text-sm mb-4 hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Events Dashboard</h1>
            <p className="mt-2" style={{ color: palette.textMuted }}>Manage and track all your hosted sports events.</p>
          </div>
          
          <Link href="/host">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#7c5cff]/20" style={{ background: palette.primary, color: "white" }}>
              <Plus className="h-5 w-5" /> Host New Event
            </button>
          </Link>
        </div>

        {/* Search & Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: palette.textMuted }} />
                <input 
                    type="text" 
                    placeholder="Search your events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all focus:border-[#7c5cff]"
                    style={{ background: palette.surface, borderColor: palette.stroke }}
                />
            </div>
            <div className="flex items-center justify-between px-6 py-4 rounded-2xl border" style={{ background: palette.surface, borderColor: palette.stroke }}>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: palette.textMuted }}>Total Events</span>
                    <span className="text-2xl font-bold">{myEvents.length}</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-[#7c5cff]/10 flex items-center justify-center">
                    <Trophy className="h-5 w-5" style={{ color: palette.primary }} />
                </div>
            </div>
        </div>

        {/* Events List */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, idx) => (
              <motion.div 
                key={event._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-3xl border p-5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-[#7c5cff]/50 transition-all hover:shadow-2xl hover:shadow-[#7c5cff]/5"
                style={{ background: palette.surface, borderColor: palette.stroke }}
              >
                <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="h-20 w-20 rounded-2xl bg-cover bg-center shrink-0 shadow-lg" style={{ backgroundImage: `url(${event.banner || 'https://images.unsplash.com/photo-1517649763962-0c623066013b'})` }}></div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#7c5cff]/10 text-[#9b86ff] border border-[#7c5cff]/20">{event.sport}</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#00e0b8]/10 text-[#00e0b8] border border-[#00e0b8]/20">{event.type}</span>
                        </div>
                        <h3 className="font-bold text-xl group-hover:text-[#7c5cff] transition-colors">{event.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                            <span className="text-xs flex items-center gap-1.5 font-medium" style={{ color: palette.textMuted }}>
                                <Calendar className="h-3.5 w-3.5" /> {new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-xs flex items-center gap-1.5 font-medium" style={{ color: palette.textMuted }}>
                                <MapPin className="h-3.5 w-3.5" /> {event.city}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link href={`/host/event/${event._id}`} className="flex-1 md:flex-none">
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-[#7c5cff]/10" style={{ background: palette.primary, color: "white" }}>
                            <BarChart3 className="h-4 w-4" /> Manage Event
                        </button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-3.5 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all border border-transparent hover:border-red-500/20 active:scale-90"
                      title="Delete Event"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-24 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center space-y-4" 
               style={{ borderColor: palette.stroke }}
             >
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Trophy className="h-8 w-8 opacity-20" />
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-lg" style={{ color: palette.textMuted }}>No events found</p>
                    <p className="text-sm opacity-50">Try searching for something else or host a new event.</p>
                </div>
                <Link href="/host">
                    <button className="mt-4 px-6 py-2 rounded-xl text-sm font-bold border hover:bg-white/5 transition-colors" style={{ borderColor: palette.stroke }}>
                        Host Your First Event
                    </button>
                </Link>
             </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
