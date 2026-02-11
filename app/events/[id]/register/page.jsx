"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Trophy, DollarSign, User, Mail, CheckCircle, AlertCircle, Upload } from "lucide-react";

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

export default function RegisterPage({ params }) {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionId: "",
    paymentScreenshot: "",
    answers: []
  });

  useEffect(() => {
    // Fetch user if logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setFormData(prev => ({ 
            ...prev, 
            name: data.user.name, 
            email: data.user.email 
          }));
        }
      })
      .catch(() => {});

    // Fetch event details
    fetch(`/api/events/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          router.push("/");
        } else {
          setEvent(data);
        }
      })
      .catch(() => {
        alert("Failed to load event");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    let newErrors = {};
    if (!tcAccepted) newErrors.tc = "Please accept the Terms & Conditions";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (event.qrCode && !formData.transactionId) newErrors.transactionId = "Transaction ID is required";
    if (event.qrCode && !formData.paymentScreenshot) newErrors.paymentScreenshot = "Payment screenshot is required";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/events/${params.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        router.push("/");
      } else {
        console.error("Registration error:", data);
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration exception:", err);
      alert("Something went wrong. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: palette.bg, color: palette.text }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: palette.primary }}></div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: palette.bg, color: palette.text }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <Link href="/" className="inline-flex items-center text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: palette.textMuted }}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Event Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:col-span-1 space-y-6"
          >
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: palette.stroke }}>
              <img src={event.banner} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-6 space-y-4" style={{ background: palette.surface }}>
                <h1 className="text-xl font-bold leading-tight">{event.title}</h1>
                
                <div className="space-y-3 text-sm" style={{ color: palette.textMuted }}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#7c5cff]" />
                    <span>{new Date(event.start).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00e0b8]" />
                    <span>{event.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span>Prize: {event.prize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span>Entry Fee: ₹{event.fee}</span>
                  </div>
                </div>
              </div>
            </div>

            {event.requirements && (
              <div className="rounded-2xl border p-6" style={{ background: palette.surface, borderColor: palette.stroke }}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  Requirements
                </h3>
                <p className="text-sm whitespace-pre-wrap" style={{ color: palette.textMuted }}>
                  {event.requirements}
                </p>
              </div>
            )}
            
            {event.qrCode && (
               <div className="rounded-2xl border p-6" style={{ background: palette.surface, borderColor: palette.stroke }}>
                 <h3 className="font-semibold mb-3 flex items-center gap-2">
                   <DollarSign className="h-4 w-4 text-green-400" />
                   Scan to Pay
                 </h3>
                 <div className="bg-white p-2 rounded-xl inline-block">
                    <img src={event.qrCode} alt="Payment QR" className="w-full h-auto rounded-lg" />
                 </div>
                 <p className="text-xs mt-3 text-center" style={{ color: palette.textMuted }}>
                   Scan this QR code to pay the entry fee of ₹{event.fee}
                 </p>
               </div>
            )}
          </motion.div>

          {/* Right Column: Registration Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-2"
          >
            <div className="rounded-2xl border p-8" style={{ background: palette.surface, borderColor: palette.stroke }}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Register for Event</h2>
                <p style={{ color: palette.textMuted }}>Fill in your details to participate.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full rounded-xl border px-3 py-2 pl-9 text-sm outline-none bg-transparent transition-all focus:border-[#7c5cff]"
                        style={{ borderColor: palette.stroke, color: palette.text }}
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4" style={{ color: palette.textMuted }} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full rounded-xl border px-3 py-2 pl-9 text-sm outline-none bg-transparent transition-all focus:border-[#7c5cff]"
                        style={{ borderColor: palette.stroke, color: palette.text }}
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4" style={{ color: palette.textMuted }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-all focus:border-[#7c5cff] ${errors.phone ? 'border-red-500 bg-red-500/5' : ''}`}
                    style={{ borderColor: errors.phone ? undefined : palette.stroke, color: palette.text }}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone}</p>}
                </div>

                {event.customQuestions && event.customQuestions.length > 0 && (
                  <div className="pt-4 border-t space-y-4" style={{ borderColor: palette.stroke }}>
                    <h3 className="font-medium text-sm">Additional Questions</h3>
                    {event.customQuestions.map((q, idx) => (
                      <div key={idx}>
                        <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>{q}</label>
                        <input
                          type="text"
                          required
                          placeholder="Your answer"
                          value={formData.answers.find(a => a.question === q)?.answer || ""}
                          onChange={e => {
                            const newAnswers = [...formData.answers];
                            const existingIdx = newAnswers.findIndex(a => a.question === q);
                            if (existingIdx >= 0) {
                              newAnswers[existingIdx].answer = e.target.value;
                            } else {
                              newAnswers.push({ question: q, answer: e.target.value });
                            }
                            setFormData(prev => ({ ...prev, answers: newAnswers }));
                          }}
                          className="w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-all focus:border-[#7c5cff]"
                          style={{ borderColor: palette.stroke, color: palette.text }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {event.qrCode && (
                  <div className="pt-4 border-t space-y-4" style={{ borderColor: palette.stroke }}>
                    <h3 className="font-medium text-sm">Payment Verification</h3>
                    
                    <div>
                      <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Transaction ID / UPI Reference</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter the transaction ID after payment"
                        value={formData.transactionId}
                        onChange={e => setFormData({...formData, transactionId: e.target.value})}
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-all focus:border-[#7c5cff] ${errors.transactionId ? 'border-red-500 bg-red-500/5' : ''}`}
                        style={{ borderColor: errors.transactionId ? undefined : palette.stroke, color: palette.text }}
                      />
                      {errors.transactionId && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.transactionId}</p>}
                    </div>

                    <div>
                       <label className="text-xs block mb-1.5" style={{ color: palette.textMuted }}>Payment Screenshot</label>
                       <div className="relative">
                         <input
                           type="file"
                           accept="image/*"
                           required
                           onChange={(e) => {
                             const file = e.target.files[0];
                             if (file) {
                               if (file.size > 2 * 1024 * 1024) {
                                 alert("File size must be less than 2MB");
                                 e.target.value = "";
                                 return;
                               }
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setFormData(prev => ({ ...prev, paymentScreenshot: reader.result }));
                               };
                               reader.readAsDataURL(file);
                             }
                           }}
                           className={`w-full rounded-xl border px-3 py-2 text-sm outline-none bg-transparent transition-all focus:border-[#7c5cff] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#7c5cff] file:text-white hover:file:opacity-90 ${errors.paymentScreenshot ? 'border-red-500 bg-red-500/5' : ''}`}
                           style={{ borderColor: errors.paymentScreenshot ? undefined : palette.stroke, color: palette.text }}
                         />
                       </div>
                       {errors.paymentScreenshot && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.paymentScreenshot}</p>}
                       {formData.paymentScreenshot && (
                          <div className="mt-2">
                            <img src={formData.paymentScreenshot} alt="Payment Screenshot" className="h-32 w-auto object-contain rounded-lg border" style={{ borderColor: palette.stroke }} />
                          </div>
                       )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t" style={{ borderColor: palette.stroke }}>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm" style={{ color: palette.textMuted }}>
                        <span>Entry Fee</span>
                        <span>₹{event.fee}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm" style={{ color: palette.textMuted }}>
                        <span>Platform Fee (5%)</span>
                        <span>₹{Math.round(event.fee * 0.05)}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: palette.stroke }}>
                        <span>Total Payable</span>
                        <span className="text-[#7c5cff]">₹{event.fee + Math.round(event.fee * 0.05)}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${errors.tc ? 'border-red-500 bg-red-500/5' : 'border-slate-800 bg-black/20'}`}>
                      <input 
                          type="checkbox" 
                          id="tc" 
                          checked={tcAccepted}
                          onChange={(e) => setTcAccepted(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-gray-600 bg-transparent text-[#7c5cff] focus:ring-[#7c5cff]"
                      />
                      <label htmlFor="tc" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                          I agree to the <span className="text-[#7c5cff] hover:underline">Terms & Conditions</span>. 
                          I understand that the platform fee is non-refundable and I agree to the fair play policy of SportsHub.
                      </label>
                    </div>
                    {errors.tc && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.tc}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: palette.primary, color: "white" }}
                  >
                    {submitting ? "Processing..." : "Confirm Registration"}
                    <CheckCircle className="h-4 w-4" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
