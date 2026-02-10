"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Calendar, MapPin, Trophy, Users, DollarSign, Layout, Building2, Trash2, Plus, Eye, BarChart3 } from "lucide-react";
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

export default function HostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    sport: "Football",
    city: "",
    start: "",
    type: "Team",
    fee: "",
    prize: "",
    banner: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1000",
    org: "",
    requirements: "",
    qrCode: "",
    whatsappLink: "",
    customQuestions: []
  });
  
  // Check auth
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login');
        } else {
          setUser(data.user);
          setFormData(prev => ({ ...prev, org: data.user.name }));
          
          // Fetch user events
          fetch('/api/events/user')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMyEvents(data);
            })
            .catch(err => console.error("Failed to fetch my events", err));
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseInt(formData.fee) < 0) {
        alert("Entry fee cannot be negative");
        return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            fee: parseInt(formData.fee) || 0
        }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!user) {
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
          <h1 className="text-3xl font-semibold mb-2">Host an Event</h1>
          <p style={{ color: palette.textMuted }}>Create and manage your sports event.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border p-6 space-y-4" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
            <h2 className="text-lg font-medium mb-4">Event Details</h2>
            
            <Field 
              label="Event Title" 
              icon={<Layout className="h-4 w-4" />}
              placeholder="e.g. Inter-College Football Cup" 
              value={formData.title} 
              onChange={v => handleChange("title", v)} 
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Sport</label>
                <select
                  value={formData.sport}
                  onChange={e => handleChange("sport", e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent"
                  style={{ borderColor: palette.stroke, color: palette.text }}
                >
                  {[
                    "Football", "Cricket", "Basketball", "Badminton", "Volleyball", 
                    "Table Tennis", "Tennis", "Squash", "Hockey", "Swimming", 
                    "Athletics", "100m Sprint", "Relay Race", "Marathon", "Long Jump", "High Jump", "Shot Put", "Javelin Throw",
                    "Chess", "Kabaddi", "Boxing", "Wrestling", "Archery", "Shooting"
                  ].map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
              </div>
              <Field 
                label="City" 
                icon={<MapPin className="h-4 w-4" />}
                placeholder="e.g. Delhi" 
                value={formData.city} 
                onChange={v => handleChange("city", v)} 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field 
                label="Date" 
                icon={<Calendar className="h-4 w-4" />}
                type="date"
                value={formData.start} 
                onChange={v => handleChange("start", v)} 
                required
              />
              <div>
                <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Type</label>
                <select
                  value={formData.type}
                  onChange={e => handleChange("type", e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent"
                  style={{ borderColor: palette.stroke, color: palette.text }}
                >
                  <option value="Team" className="bg-slate-900">Team</option>
                  <option value="Solo" className="bg-slate-900">Solo</option>
                  <option value="Doubles" className="bg-slate-900">Doubles</option>
                </select>
              </div>
            </div>

            <Field 
                label="Organizer Name" 
                icon={<Building2 className="h-4 w-4" />}
                placeholder="Your Organization / Club" 
                value={formData.org} 
                onChange={v => handleChange("org", v)} 
                required
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border p-6 space-y-4" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
            <h2 className="text-lg font-medium mb-4">Prizes & Fees</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                label="Entry Fee (₹)" 
                icon={<DollarSign className="h-4 w-4" />}
                type="number"
                placeholder="0" 
                value={formData.fee} 
                onChange={v => handleChange("fee", v)} 
                required
              />
              <Field 
                label="Prize Pool" 
                icon={<Trophy className="h-4 w-4" />}
                placeholder="e.g. ₹50,000" 
                value={formData.prize} 
                onChange={v => handleChange("prize", v)} 
                required
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border p-6 space-y-4" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Custom Questions</h2>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, customQuestions: [...prev.customQuestions, ""] }))}
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: palette.primarySoft }}
              >
                <Plus className="h-3 w-3" /> Add Question
              </button>
            </div>
            
            {formData.customQuestions.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: palette.textMuted }}>
                No custom questions added.
              </p>
            )}

            <div className="space-y-3">
              {formData.customQuestions.map((q, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Question ${idx + 1}`}
                    value={q}
                    onChange={e => {
                      const newQuestions = [...formData.customQuestions];
                      newQuestions[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, customQuestions: newQuestions }));
                    }}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff]"
                    style={{ borderColor: palette.stroke, color: palette.text }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestions = formData.customQuestions.filter((_, i) => i !== idx);
                      setFormData(prev => ({ ...prev, customQuestions: newQuestions }));
                    }}
                    className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    style={{ color: palette.textMuted }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border p-6 space-y-4" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
            <h2 className="text-lg font-medium mb-4">Requirements & Payment</h2>
            
            <div>
              <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Event Requirements</label>
              <textarea
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff] min-h-[100px]"
                style={{ borderColor: palette.stroke, color: palette.text }}
                placeholder="List any requirements for participants (e.g., Age limit, equipment needed...)"
                value={formData.requirements}
                onChange={e => handleChange("requirements", e.target.value)}
              />
            </div>

            <Field 
              label="WhatsApp Group Link (Optional)" 
              icon={<Users className="h-4 w-4" />}
              type="url"
              placeholder="https://chat.whatsapp.com/..." 
              value={formData.whatsappLink} 
              onChange={v => handleChange("whatsappLink", v)} 
            />

            <div>
               <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Payment QR Code</label>
               <div className="relative">
                 <input
                   type="file"
                   accept="image/*"
                   onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleChange("qrCode", reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                   }}
                   className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#7c5cff] file:text-white hover:file:opacity-90"
                   style={{ borderColor: palette.stroke, color: palette.text }}
                 />
               </div>
               <p className="text-xs mt-1" style={{ color: palette.textMuted }}>Upload a QR code for entry fee payments.</p>
               {formData.qrCode && (
                  <div className="mt-2">
                    <img src={formData.qrCode} alt="QR Preview" className="h-32 w-32 object-contain rounded-lg border" style={{ borderColor: palette.stroke }} />
                  </div>
               )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border p-6 space-y-4" 
            style={{ background: palette.surface, borderColor: palette.stroke }}
          >
             <h2 className="text-lg font-medium mb-4">Banner Image</h2>
             <Field 
                label="Banner URL" 
                icon={<Upload className="h-4 w-4" />}
                placeholder="https://..." 
                value={formData.banner} 
                onChange={v => handleChange("banner", v)} 
             />
             <p className="text-xs" style={{ color: palette.textMuted }}>Using a default Unsplash image if left unchanged.</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: palette.primary, color: "white" }}
          >
            {loading ? "Creating Event..." : "Publish Event"}
          </motion.button>
        </form>

        {/* My Events Section */}
        <div className="mt-16 border-t pt-12" style={{ borderColor: palette.stroke }}>
          <h2 className="text-2xl font-semibold mb-6">Your Events Dashboard</h2>
          <div className="grid gap-4">
            {myEvents.map(event => (
              <motion.div 
                key={event._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#7c5cff] transition-colors"
                style={{ background: palette.surface, borderColor: palette.stroke }}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-16 w-16 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${event.banner || 'https://images.unsplash.com/photo-1517649763962-0c623066013b'})` }}></div>
                    <div>
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        <p className="text-sm flex items-center gap-3 mt-1" style={{ color: palette.textMuted }}>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.start).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.city}</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link href={`/host/event/${event._id}`} className="flex-1 sm:flex-none">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90" style={{ background: palette.primary, color: "white" }}>
                            <BarChart3 className="h-4 w-4" /> Manage
                        </button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                      title="Delete Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                </div>
              </motion.div>
            ))}
            {myEvents.length === 0 && (
               <div className="text-center py-12 rounded-2xl border border-dashed" style={{ borderColor: palette.stroke }}>
                   <p style={{ color: palette.textMuted }}>You haven't hosted any events yet.</p>
               </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", value, onChange, icon, required }) {
  return (
    <div>
      <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>{label}</label>
      <div className="relative">
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 pl-9 text-sm outline-none bg-transparent transition-colors focus:border-[#7c5cff]"
          style={{ borderColor: palette.stroke, color: palette.text }}
        />
        <div className="absolute left-3 top-2.5" style={{ color: palette.textMuted }}>
            {icon}
        </div>
      </div>
    </div>
  );
}
