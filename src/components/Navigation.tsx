"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// Main navigation links - Cases→Case Studies, Stats→Evidence per critique
const MAIN_LINKS = [
  { href: "/tldr", label: "TL;DR" },
  { href: "/future", label: "The Future" },
  { href: "/framework", label: "Framework" },
  { href: "/cases", label: "Case Studies" },
  { href: "/news", label: "News" }, // Current events through mismatch lens
  { href: "/blog", label: "Blog" }, // Medium RSS feed
  { href: "/stats", label: "Evidence" },
  { href: "/library", label: "Library" },
  { href: "/projects", label: "Projects" },
  { href: "/faq", label: "FAQ" }, // Moved from dropdown per critique
  { href: "/glossary", label: "Glossary" },
  { href: "/sources", label: "Sources" }, // Moved from dropdown per critique
  { href: "/research", label: "Research" }, // Methodology page
  { href: "/about", label: "About" }, // New page per critique
];

// Audience-specific pages (dropdown)
const AUDIENCE_LINKS = [
  { href: "/systems", label: "Systems Changers" },
  { href: "/practitioners", label: "Practitioners" },
  { href: "/foryou", label: "You" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isAudiencePage = AUDIENCE_LINKS.some(link => pathname === link.href);

  return (
    <>
      <nav className="fixed top-[54px] left-0 right-0 z-50 nav-glass border-b border-[#E5E0D8]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-[0.15em] text-[#1A1A1A] hover:text-[#C75B39] transition-colors group"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <img
              src="/logo.svg"
              alt=""
              className="w-7 h-7 group-hover:scale-110 transition-transform"
            />
            DEMISMATCH
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Main links with animated underlines */}
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors nav-link-animated ${
                  pathname === link.href
                    ? "text-[#C75B39]"
                    : "text-[#4A4A4A] hover:text-[#1A1A1A]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Who It's For dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                  isAudiencePage
                    ? "text-[#C75B39]"
                    : "text-[#4A4A4A] hover:text-[#1A1A1A]"
                }`}
              >
                Who It's For
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#FAF9F6] shadow-lg border border-[#E5E0D8] py-2 z-50">
                  {AUDIENCE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname === link.href
                          ? "text-[#C75B39] bg-[#F0EDE6]"
                          : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F0EDE6]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
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
      </nav>

      {/* Mobile nav - OUTSIDE nav element to avoid backdrop-blur containing block issue */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu panel */}
          <div className="md:hidden fixed top-[127px] left-0 right-0 bottom-0 bg-[#FAF9F6] border-t border-[#E5E0D8] z-50 overflow-y-auto">
            <div className="px-6 py-4">
              {/* Main links */}
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-4 text-base font-medium transition-colors border-b border-[#E5E0D8] ${
                    pathname === link.href
                      ? "text-[#C75B39]"
                      : "text-[#4A4A4A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Who It's For section */}
              <div className="py-4 border-b border-[#E5E0D8]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8B8B8B] mb-3">Who It's For</p>
                <div className="space-y-3">
                  {AUDIENCE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block text-base font-medium transition-colors ${
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

            </div>
          </div>
        </>
      )}
    </>
  );
}
