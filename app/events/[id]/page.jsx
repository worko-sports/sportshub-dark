"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Trophy, Users, DollarSign, Clock, Share2, CheckCircle, Info } from "lucide-react";
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

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: palette.bg, color: palette.text }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: palette.primary }}></div>
      </div>
    );
  }

  if (!event) return null;

  const tabs = [
    { id: "about", label: "All Details" },
    { id: "dates", label: "Dates & Deadlines" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen font-sans pb-20" style={{ background: palette.bg, color: palette.text }}>
      {/* Navbar Placeholder - Keeping consistent navigation */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-[#0b0e14]/80" style={{ borderColor: palette.stroke }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                 <Link href="/" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
                    <ArrowLeft className="h-4 w-4" /> Back to Events
                 </Link>
                 <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="SportsHub Logo" width={32} height={32} className="object-contain" />
                    <span className="font-semibold text-lg tracking-tight">SPORTSHUB</span>
                 </div>
                 <div className="w-20"></div> {/* Spacer */}
            </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden relative h-[300px] md:h-[400px] mb-8"
        >
            <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${event.banner || 'https://images.unsplash.com/photo-1517649763962-0c623066013b'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/50 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-white/10 backdrop-blur-md border border-white/10">
                             <Trophy className="h-3 w-3 text-[#00e0b8]" />
                             <span>{event.sport}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white shadow-lg">{event.title}</h1>
                        <p className="flex items-center gap-2 text-gray-300">
                             <MapPin className="h-4 w-4" /> {event.city} • <Building2 className="h-4 w-4" /> {event.org}
                        </p>
                    </div>
                    <div className="hidden md:block">
                        {/* Desktop Share/Action buttons could go here */}
                    </div>
                </div>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Tabs */}
                <div className="border-b" style={{ borderColor: palette.stroke }}>
                    <div className="flex gap-8 overflow-x-auto pb-1 no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-[#7c5cff]' : 'text-gray-400 hover:text-white'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c5cff]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {activeTab === 'about' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <Section title="Event Description">
                                <p style={{ color: palette.textMuted }} className="leading-relaxed">
                                    Join us for {event.title}, a premier {event.sport} tournament in {event.city}. 
                                    Compete with the best and showcase your skills. This event is organized by {event.org}.
                                </p>
                            </Section>
                            
                            <Section title="Requirements & Rules">
                                <div className="p-4 rounded-xl border border-dashed" style={{ borderColor: palette.stroke, background: palette.surface }}>
                                    <p style={{ color: palette.textMuted }} className="whitespace-pre-wrap">
                                        {event.requirements || "No specific requirements listed. Please contact the organizer for details."}
                                    </p>
                                </div>
                            </Section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard icon={<Trophy className="text-[#ffd700]" />} label="Prize Pool" value={event.prize} />
                                <InfoCard icon={<Users className="text-[#00e0b8]" />} label="Team Size" value={event.type} />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'dates' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: palette.stroke, background: palette.surface }}>
                                <div className="h-10 w-10 rounded-full bg-[#7c5cff]/10 flex items-center justify-center text-[#7c5cff]">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Event Date</p>
                                    <p className="font-medium text-lg">{new Date(event.start).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                         </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <p style={{ color: palette.textMuted }}>
                                For any queries, please contact the organizer directly.
                            </p>
                            <div className="p-4 rounded-xl border" style={{ borderColor: palette.stroke, background: palette.surface }}>
                                <p className="font-medium">{event.org}</p>
                                <p className="text-sm text-gray-400 mt-1">Organizer</p>
                            </div>

                            {event.whatsappLink && (
                                <a 
                                    href={event.whatsappLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full p-4 rounded-xl font-medium text-white transition-all hover:opacity-90"
                                    style={{ background: "#25D366" }}
                                >
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                    Join WhatsApp Group
                                </a>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <div className="rounded-2xl border p-6 space-y-6" style={{ background: palette.surface, borderColor: palette.stroke }}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Registration Fee</span>
                            <span className="text-2xl font-bold">{event.fee > 0 ? `₹${event.fee}` : 'Free'}</span>
                        </div>
                        
                        <Link href={`/events/${id}/register`} className="block">
                            <button className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#7c5cff]/20 hover:shadow-[#7c5cff]/40 transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: palette.primary }}>
                                Register Now
                            </button>
                        </Link>

                        <div className="space-y-3 pt-4 border-t" style={{ borderColor: palette.stroke }}>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-2"><Users className="h-4 w-4" /> Registered</span>
                                <span className="font-medium">--</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 flex items-center gap-2"><Clock className="h-4 w-4" /> Deadline</span>
                                <span className="font-medium text-[#00e0b8]">Open</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border p-6" style={{ background: palette.surface, borderColor: palette.stroke }}>
                         <h3 className="font-medium mb-4 flex items-center gap-2"><Share2 className="h-4 w-4" /> Share this event</h3>
                         <div className="flex gap-2">
                            {/* Social Share Buttons */}
                            <button 
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-center transition-colors"
                                title="Share on X"
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                            </button>
                            <button 
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="h-10 w-10 rounded-full bg-white/5 hover:bg-[#0077b5]/20 hover:text-[#0077b5] cursor-pointer flex items-center justify-center transition-colors"
                                title="Share on LinkedIn"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </button>
                            <button 
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                className="h-10 w-10 rounded-full bg-white/5 hover:bg-[#1877f2]/20 hover:text-[#1877f2] cursor-pointer flex items-center justify-center transition-colors"
                                title="Share on Facebook"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </button>
                            <button 
                                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${event.title} - Check it out here: ${window.location.href}`)}`, '_blank')}
                                className="h-10 w-10 rounded-full bg-white/5 hover:bg-[#25D366]/20 hover:text-[#25D366] cursor-pointer flex items-center justify-center transition-colors"
                                title="Share on WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <div className="h-6 w-1 rounded-full bg-[#7c5cff]"></div>
                {title}
            </h2>
            {children}
        </div>
    );
}

function InfoCard({ icon, label, value }) {
    return (
        <div className="p-4 rounded-xl border flex items-center gap-4" style={{ borderColor: palette.stroke, background: palette.surface }}>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}

function Building2({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
    )
}
