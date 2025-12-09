"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/framework", label: "Framework" },
  { href: "/faq", label: "FAQ" },
  { href: "/systems", label: "For Systems" },
  { href: "/practitioners", label: "For Practitioners" },
  { href: "/foryou", label: "For You" },
  { href: "/app", label: "Analyzer" },
  { href: "/library", label: "Library" },
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

        {/* Mobile menu button - always visible on mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#4A4A4A] hover:text-[#1A1A1A] p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
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

      {/* Mobile nav - full screen overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu panel */}
          <div className="md:hidden fixed top-[73px] left-0 right-0 bottom-0 bg-[#FAF9F6] border-t border-[#E5E0D8] z-50 overflow-y-auto">
            <div className="px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-4 text-base font-medium transition-colors border-b border-[#E5E0D8] last:border-b-0 ${
                    pathname === link.href
                      ? "text-[#C75B39]"
                      : "text-[#4A4A4A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
