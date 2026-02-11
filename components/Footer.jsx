"use client";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  const palette = {
    bg: "#0b0e14",
    surface: "#111520",
    text: "#e8ecf2",
    textMuted: "#a9b0c0",
    stroke: "#1e2433",
    primary: "#7c5cff",
  };

  const footerSections = [
    {
      title: "Explore",
      links: [
        { label: "Find Events", href: "/events" },
        { label: "Host Event", href: "/host" },
        { label: "Sports Categories", href: "/#explore" },
        { label: "Featured Tournaments", href: "/#explore" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/" },
        { label: "Contact Us", href: "/" },
        { label: "Careers", href: "/" },
        { label: "Partner with Us", href: "/" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/" },
        { label: "Refund Policy", href: "/terms" },
      ]
    }
  ];

  return (
    <footer className="border-t pt-16 pb-8" style={{ background: palette.bg, borderColor: palette.stroke }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-[#7c5cff] flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white uppercase">SPORTSHUB</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: palette.textMuted }}>
              The ultimate destination for sports enthusiasts. Discover local tournaments, register teams, and compete for glory.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 rounded-full border hover:border-[#7c5cff] hover:text-[#7c5cff] transition-all" style={{ borderColor: palette.stroke, color: palette.textMuted }}>
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-[#7c5cff] transition-colors" style={{ color: palette.textMuted }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm" style={{ color: palette.textMuted }}>
                <Mail className="h-5 w-5 shrink-0 text-[#7c5cff]" />
                <span>support@sportshub.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: palette.textMuted }}>
                <Phone className="h-5 w-5 shrink-0 text-[#7c5cff]" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: palette.textMuted }}>
                <MapPin className="h-5 w-5 shrink-0 text-[#7c5cff]" />
                <span>Chandigarh, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: palette.stroke }}>
          <p className="text-xs" style={{ color: palette.textMuted }}>
            © {new Date().getFullYear()} SPORTSHUB. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: palette.textMuted }}>
            Made with ❤️ by <span className="text-white font-medium">Anshpreet Singh Bindra</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
