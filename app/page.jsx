"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Calendar, Trophy, Users, Filter, ArrowRight, Plus, LogIn, User as UserIcon, Clock, Menu, X, Star, Layout } from "lucide-react";
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

export default function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-[#7c5cff] flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SPORTSHUB</span>
            </Link>

            {/* Desktop Search */}
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
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-3 p-1 rounded-full transition-all hover:bg-white/5"
                    >
                      <span className="text-sm font-medium">Hi, {user.name.split(' ')[0]}</span>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#00e0b8] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {user.name[0]}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl bg-[#111520]/90"
                          style={{ borderColor: palette.stroke }}
                        >
                          <Link href="/dashboard" className="flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-white/5">
                            <Layout className="h-4 w-4" style={{ color: palette.primary }} />
                            <span className="text-sm font-medium">Dashboard</span>
                          </Link>
                          <Link href="/profile" className="flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-white/5">
                            <UserIcon className="h-4 w-4" style={{ color: palette.accent }} />
                            <span className="text-sm font-medium">Profile</span>
                          </Link>
                          <div className="my-1 border-t" style={{ borderColor: palette.stroke }}></div>
                          <button 
                            onClick={async () => {
                              // Handle logout - since the app uses custom auth me endpoint, we might need to clear it
                              // But usually signOut() from next-auth/react handles it if using next-auth
                              // For now, let's just redirect to a logout route if it exists or clear user
                              setUser(null);
                              setIsProfileDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 p-3 rounded-xl transition-all hover:bg-red-500/10 text-red-400"
                          >
                            <LogIn className="rotate-180 h-4 w-4" />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#00e0b8] flex items-center justify-center text-sm font-bold text-white shadow-lg">
                          {user.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-xs text-gray-400">{user.email}</span>
                        </div>
                      </div>
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5">
                          <Layout className="h-5 w-5" style={{ color: palette.primary }} />
                          <span>Dashboard</span>
                        </div>
                      </Link>
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5">
                          <UserIcon className="h-5 w-5" style={{ color: palette.accent }} />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <button 
                        onClick={() => {
                          setUser(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-red-500/10 text-red-400"
                      >
                        <LogIn className="rotate-180 h-5 w-5" />
                        <span>Logout</span>
                      </button>
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

        {/* How it Works */}
        <section className="py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">How SportsHub Works</h2>
                <p style={{ color: palette.textMuted }}>Simple steps to start your sports journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Find Event", desc: "Search for your favorite sports tournaments in your city.", icon: <Search className="h-6 w-6" /> },
                    { title: "Register", desc: "Quick and easy registration process for teams and individuals.", icon: <UserIcon className="h-6 w-6" /> },
                    { title: "Compete", desc: "Show up, play your best, and win exciting prizes and glory.", icon: <Trophy className="h-6 w-6" /> }
                ].map((step, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="p-8 rounded-3xl border text-center group hover:border-[#7c5cff]/50 transition-colors"
                        style={{ background: palette.surface, borderColor: palette.stroke }}
                    >
                        <div className="h-16 w-16 rounded-2xl bg-[#7c5cff]/10 flex items-center justify-center mx-auto mb-6 text-[#7c5cff] group-hover:scale-110 transition-transform">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: palette.textMuted }}>{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 bg-gradient-to-b from-transparent to-[#7c5cff]/5 rounded-[3rem] px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What Athletes Say</h2>
                <p style={{ color: palette.textMuted }}>Trusted by thousands of players and organizers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Rahul Sharma", role: "Footballer", text: "SportsHub made it so easy to find local tournaments. The registration was seamless!" },
                    { name: "Ananya Iyer", role: "Badminton Player", text: "I love the clean interface. Finding events by sport and city is a breeze." },
                    { name: "Vikram Singh", role: "Event Organizer", text: "Hosting my cricket league on SportsHub increased our registrations by 40%." }
                ].map((t, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl border"
                        style={{ background: palette.surface, borderColor: palette.stroke }}
                    >
                        <div className="flex gap-1 mb-4 text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-sm italic mb-6 leading-relaxed" style={{ color: palette.text }}>"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#00e0b8] flex items-center justify-center font-bold text-xs">
                                {t.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t.name}</p>
                                <p className="text-xs" style={{ color: palette.textMuted }}>{t.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto p-12 rounded-[3rem] border border-[#7c5cff]/20 bg-gradient-to-br from-[#111520] to-[#0b0e14]"
            >
                <h2 className="text-4xl font-bold mb-6">Ready to Play?</h2>
                <p className="text-lg mb-8" style={{ color: palette.textMuted }}>Join the SportsHub community today and never miss a game.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/login">
                        <button className="px-10 py-4 rounded-full font-bold text-white shadow-xl shadow-[#7c5cff]/20 hover:scale-105 transition-all" style={{ background: palette.primary }}>
                            Get Started Now
                        </button>
                    </Link>
                </div>
            </motion.div>
        </section>

      </main>
    </div>
  );
}
