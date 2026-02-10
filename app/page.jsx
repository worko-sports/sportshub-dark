"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Calendar, Trophy, Users, Filter, ArrowRight, Plus, LogIn, User as UserIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));

    const init = async () => {
      try {
        // Try seeding first (idempotent)
        try {
          await fetch("/api/seed");
        } catch (err) {
          console.warn("Seeding failed", err);
        }
        
        // Then fetch events
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (Array.isArray(data)) {
           const formatted = data.map(e => ({
            ...e,
            id: e._id,
            start: new Date(e.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            // Ensure banner exists or use default
            banner: e.banner || "https://images.unsplash.com/photo-1517649763962-0c623066013b"
          }));
          setEvents(formatted);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.sport.toLowerCase().includes(search.toLowerCase()) ||
                          e.city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || e.sport === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen font-sans" style={{ background: palette.bg, color: palette.text }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-[#0b0e14]/80" style={{ borderColor: palette.stroke }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#00e0b8]">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SPORTSHUB</span>
            </div>

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
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm hidden sm:block">Hi, {user.name}</span>
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
          </div>
        </div>
      </nav>

      {/* Hero Section - Unstop Style */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: palette.stroke, background: palette.surface }}>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10"
         >
             <div className="max-w-3xl">
                 <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                 >
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c5cff] to-[#00e0b8]">Unlock Your Potential</span>
                     <br />
                     in Sports Tournaments
                 </motion.h1>
                 <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl mb-8 leading-relaxed" 
                    style={{ color: palette.textMuted }}
                 >
                     Discover, Register, and Compete in the best sports events across the country. From local matches to national leagues.
                 </motion.p>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-wrap gap-4"
                 >
                     <Link 
                        href="#explore"
                        className="block"
                     >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full font-semibold text-white shadow-lg shadow-[#7c5cff]/25" 
                            style={{ background: palette.primary }}
                        >
                            Explore Events
                        </motion.button>
                     </Link>
                     <Link href="/host">
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full font-semibold border" 
                            style={{ borderColor: palette.stroke }}
                        >
                            Host a Tournament
                        </motion.button>
                     </Link>
                 </motion.div>
             </div>
         </motion.div>
         {/* Abstract shapes/glow */}
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7c5cff]/10 to-transparent pointer-events-none blur-3xl"
         ></motion.div>
      </div>

      <main id="explore" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Categories Section */}
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Explore Opportunities</h2>
                <Link href="/events" className="text-sm font-medium hover:underline" style={{ color: palette.primarySoft }}>View all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Esports"].map((sport, idx) => (
                    <motion.button 
                        key={sport}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, borderColor: "#7c5cff", backgroundColor: "rgba(124, 92, 255, 0.05)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSearch(sport); setFilter(sport); }}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border transition-colors group"
                        style={{ borderColor: palette.stroke, background: palette.surface }}
                    >
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3 transition-transform">
                             {/* Placeholder icons based on sport name would be ideal, using generic for now */}
                             <Trophy className="h-6 w-6 text-[#00e0b8]" />
                        </div>
                        <span className="font-medium text-sm">{sport}</span>
                    </motion.button>
                ))}
            </div>
        </section>

        {/* Featured Events */}
        <section>
            <h2 className="text-2xl font-bold mb-8">Trending Events</h2>
            
            {loading ? (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: palette.primary }}></div>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                    <motion.div 
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
                ))}
            </div>
            )}
        </section>

      </main>
    </div>
  );
}
