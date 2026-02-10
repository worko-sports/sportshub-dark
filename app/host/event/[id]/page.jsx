"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users, DollarSign, Calendar, MapPin, Search, Download, ExternalLink, Share2, Copy } from "lucide-react";
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

export default function EventDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Event Details
        const eventRes = await fetch(`/api/events/${id}`);
        if (!eventRes.ok) throw new Error("Event not found");
        const eventData = await eventRes.json();
        setEvent(eventData);

        // Fetch Registrations
        const regRes = await fetch(`/api/events/${id}/registrations`);
        if (regRes.ok) {
          const regData = await regRes.json();
          setRegistrations(regData);
        } else {
             // If 403, maybe redirect or show error
             if (regRes.status === 403) {
                 alert("You are not authorized to view this dashboard.");
                 router.push("/host");
             }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, router]);

  const copyLink = () => {
    const url = `${window.location.origin}/events/${id}`;
    navigator.clipboard.writeText(url);
    alert("Event link copied to clipboard!");
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(search.toLowerCase()) || 
    reg.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalEarnings = registrations.length * (event?.fee || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: palette.bg, color: palette.text }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: palette.primary }}></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen font-sans p-4 md:p-8" style={{ background: palette.bg, color: palette.text }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
                <Link href="/host" className="inline-flex items-center text-sm mb-4 hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
                </Link>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="flex items-center gap-4 mt-2" style={{ color: palette.textMuted }}>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(event.start).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {event.city}</span>
                </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={copyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors hover:bg-white/5"
                    style={{ borderColor: palette.stroke, color: palette.text }}
                >
                    <Copy className="h-4 w-4" /> Copy Link
                </button>
                <Link href={`/events/${id}`} target="_blank">
                    <button 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                        style={{ background: palette.primary }}
                    >
                        <ExternalLink className="h-4 w-4" /> View Public Page
                    </button>
                </Link>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
                label="Total Registrations" 
                value={registrations.length} 
                icon={<Users className="h-5 w-5 text-[#7c5cff]" />} 
            />
            <StatCard 
                label="Total Earnings" 
                value={`₹${totalEarnings}`} 
                icon={<DollarSign className="h-5 w-5 text-[#00e0b8]" />} 
            />
            <StatCard 
                label="WhatsApp Link" 
                value={event.whatsappLink ? "Active" : "Not Set"} 
                sub={event.whatsappLink || "Add a link in settings"}
                icon={<Share2 className="h-5 w-5 text-green-500" />} 
            />
        </div>

        {/* Registrations Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: palette.surface, borderColor: palette.stroke }}>
            <div className="p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: palette.stroke }}>
                <h2 className="text-xl font-bold">Participants</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: palette.textMuted }} />
                    <input 
                        type="text" 
                        placeholder="Search participants..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border pl-9 pr-4 py-2 text-sm outline-none bg-transparent"
                        style={{ borderColor: palette.stroke }}
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b" style={{ borderColor: palette.stroke, background: "#0b0e14" }}>
                        <tr>
                            <th className="px-6 py-4 font-medium" style={{ color: palette.textMuted }}>Name</th>
                            <th className="px-6 py-4 font-medium" style={{ color: palette.textMuted }}>Email</th>
                            <th className="px-6 py-4 font-medium" style={{ color: palette.textMuted }}>Phone</th>
                            <th className="px-6 py-4 font-medium" style={{ color: palette.textMuted }}>Date</th>
                            <th className="px-6 py-4 font-medium" style={{ color: palette.textMuted }}>Payment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ divideColor: palette.stroke }}>
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium">{reg.name}</td>
                                <td className="px-6 py-4">{reg.email}</td>
                                <td className="px-6 py-4">{reg.phone || "-"}</td>
                                <td className="px-6 py-4" style={{ color: palette.textMuted }}>{new Date(reg.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                        Paid
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredRegistrations.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center" style={{ color: palette.textMuted }}>
                                    No registrations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon }) {
    return (
        <div className="rounded-2xl border p-6 flex items-start justify-between" style={{ background: palette.surface, borderColor: palette.stroke }}>
            <div>
                <p className="text-sm font-medium mb-1" style={{ color: palette.textMuted }}>{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
                {sub && <p className="text-xs mt-1 truncate max-w-[200px]" style={{ color: palette.textMuted }}>{sub}</p>}
            </div>
            <div className="p-3 rounded-xl bg-white/5">
                {icon}
            </div>
        </div>
    );
}
