"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/framework", label: "Framework" },
  { href: "/builders", label: "For Builders" },
  { href: "/foryou", label: "For You" },
  { href: "/projects", label: "Projects" },
  { href: "/sources", label: "Sources" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.15em] text-[#1A1A1A] hover:text-[#C75B39] transition-colors"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          DEMISMATCH
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#C75B39]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#4A4A4A] hover:text-[#1A1A1A] p-2"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FAF9F6] border-t border-[#E5E0D8] px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#C75B39]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
