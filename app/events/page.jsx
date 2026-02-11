"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Trophy, Plus, LogIn, Clock, ArrowLeft, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));

    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (Array.isArray(data)) {
           const formatted = data.map(e => {
             let startStr = "Date TBA";
             try {
                 if (e.start) {
                     const date = new Date(e.start);
                     if (!isNaN(date.getTime())) {
                         startStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                     }
                 }
             } catch (err) {
                 console.warn("Date parsing error for event", e.id, err);
             }

             return {
                ...e,
                id: e._id,
                start: startStr,
                // Ensure banner exists or use default
                banner: e.banner || "https://images.unsplash.com/photo-1517649763962-0c623066013b"
             };
          });
          setEvents(formatted);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.sport.toLowerCase().includes(search.toLowerCase()) ||
                          e.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || e.sport === filter;
    return matchesSearch && matchesFilter;
  });

  const sports = ["All", "Cricket", "Football", "Badminton", "Basketball", "Tennis", "Esports"];

  return (
    <div className="min-h-screen font-sans" style={{ background: palette.bg, color: palette.text }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-[#0b0e14]/80" style={{ borderColor: palette.stroke }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-[#7c5cff] flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SPORTSHUB</span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-md items-center rounded-full border px-4 py-2" style={{ background: palette.surface, borderColor: palette.stroke }}>
              <Search className="h-4 w-4" style={{ color: palette.textMuted }} />
              <input 
                type="text" 
                placeholder="Search events, sports, or cities..." 
                className="ml-3 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Link href="/host">
                <button className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:opacity-90" style={{ background: palette.surface, border: `1px solid ${palette.stroke}` }}>
                  <Plus className="h-4 w-4" /> Host Event
                </button>
              </Link>
              
              <div className="hidden sm:block">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Hi, {user.name}</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#00e0b8] flex items-center justify-center text-xs font-bold text-white">
                      {user.name[0]}
                    </div>
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-90" style={{ background: palette.primary, color: "white" }}>
                      <LogIn className="h-4 w-4" /> Login
                    </button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg sm:hidden"
                style={{ background: palette.surface, color: palette.text }}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t overflow-hidden"
              style={{ background: palette.surface, borderColor: palette.stroke }}
            >
              <div className="px-4 py-6 space-y-4">
                <div className="flex items-center rounded-full border px-4 py-2" style={{ borderColor: palette.stroke }}>
                  <Search className="h-4 w-4" style={{ color: palette.textMuted }} />
                  <input 
                    type="text" 
                    placeholder="Search events..." 
                    className="ml-3 flex-1 bg-transparent text-sm outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/host" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Plus className="h-5 w-5" />
                      <span>Host Event</span>
                    </div>
                  </Link>
                  {user ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#00e0b8] flex items-center justify-center text-xs font-bold text-white">
                        {user.name[0]}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#7c5cff]">
                        <LogIn className="h-5 w-5" />
                        <span>Login / Register</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-6">All Events</h1>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {sports.map(sport => (
                    <button
                        key={sport}
                        onClick={() => setFilter(sport)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === sport ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{ 
                            background: filter === sport ? palette.primary : palette.surface,
                            border: `1px solid ${filter === sport ? palette.primary : palette.stroke}`
                        }}
                    >
                        {sport}
                    </button>
                ))}
            </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border overflow-hidden h-full flex flex-col" style={{ background: palette.surface, borderColor: palette.stroke }}>
                    <div className="h-48 bg-white/5 animate-pulse" />
                    <div className="p-5 space-y-3">
                        <div className="h-6 bg-white/5 animate-pulse rounded-lg w-3/4" />
                        <div className="h-4 bg-white/5 animate-pulse rounded-lg w-1/2" />
                        <div className="pt-4 border-t flex justify-between" style={{ borderColor: palette.stroke }}>
                            <div className="h-8 bg-white/5 animate-pulse rounded-lg w-1/3" />
                            <div className="h-8 bg-white/5 animate-pulse rounded-lg w-1/3" />
                        </div>
                    </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border overflow-hidden transition-all hover:shadow-xl hover:shadow-[#7c5cff]/10 h-full flex flex-col group"
                        style={{ background: palette.surface, borderColor: palette.stroke }}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <Image 
                                src={event.banner} 
                                alt={event.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-black backdrop-blur-sm shadow-sm">
                                    {event.sport}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs font-medium flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-[#00e0b8]" /> {event.start}
                                </p>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#7c5cff] transition-colors">{event.title}</h3>
                            <p className="text-sm mb-4 line-clamp-1 flex items-center gap-1" style={{ color: palette.textMuted }}>
                                <MapPin className="h-3 w-3" /> {event.city} • {event.org}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: palette.stroke }}>
                                <div>
                                    <p className="text-xs text-gray-400">Prize Pool</p>
                                    <p className="font-bold text-[#00e0b8]">{event.prize}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Entry Fee</p>
                                    <p className="font-bold">{event.fee > 0 ? `₹${event.fee}` : 'Free'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
                ))
            ) : (
                <div className="col-span-full py-12 text-center rounded-2xl border border-dashed" style={{ borderColor: palette.stroke }}>
                    <p style={{ color: palette.textMuted }}>No events found matching your criteria.</p>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
