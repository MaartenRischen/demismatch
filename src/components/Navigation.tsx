"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// Primary navigation links (standalone)
const PRIMARY_LINKS = [
  { href: "/tldr", label: "TL;DR" },
  { href: "/framework", label: "Framework" },
  { href: "/future", label: "The Future" },
  { href: "/library", label: "Library" },
  { href: "/faq", label: "FAQ" },
  { href: "/projects", label: "Projects" },
];

// Evidence dropdown
const EVIDENCE_LINKS = [
  { href: "/cases", label: "Case Studies" },
  { href: "/stats", label: "Stats" },
  { href: "/research", label: "Research" },
  { href: "/sources", label: "Sources" },
  { href: "/news", label: "News" },
];

// About dropdown
const ABOUT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
];

// Who It's For (sub-section in About dropdown)
const AUDIENCE_LINKS = [
  { href: "/systems", label: "Systems Changers" },
  { href: "/practitioners", label: "Practitioners" },
  { href: "/foryou", label: "You" },
];

type DropdownId = "evidence" | "about" | null;

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
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

  const isEvidencePage = EVIDENCE_LINKS.some(link => pathname === link.href);
  const isAboutPage = [...ABOUT_LINKS, ...AUDIENCE_LINKS].some(link => pathname === link.href);

  const toggleDropdown = (id: DropdownId) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const DropdownButton = ({ id, label, isActive }: { id: DropdownId; label: string; isActive: boolean }) => (
    <button
      onClick={() => toggleDropdown(id)}
      className={`text-sm font-medium transition-colors flex items-center gap-1 ${
        isActive
          ? "text-[#C75B39]"
          : "text-[#4A4A4A] hover:text-[#1A1A1A]"
      }`}
    >
      {label}
      <svg
        className={`w-4 h-4 transition-transform ${openDropdown === id ? "rotate-180" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const DropdownMenu = ({ links, subsection }: { links: typeof EVIDENCE_LINKS; subsection?: { title: string; links: typeof AUDIENCE_LINKS } }) => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-[#FAF9F6] shadow-lg border border-[#E5E0D8] py-2 z-50">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpenDropdown(null)}
          className={`block px-4 py-2 text-sm transition-colors ${
            pathname === link.href
              ? "text-[#C75B39] bg-[#F0EDE6]"
              : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F0EDE6]"
          }`}
        >
          {link.label}
        </Link>
      ))}
      {subsection && (
        <>
          <div className="border-t border-[#E5E0D8] my-2" />
          <p className="px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#8B8B8B]">
            {subsection.title}
          </p>
          {subsection.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpenDropdown(null)}
              className={`block px-4 py-2 text-sm transition-colors ${
                pathname === link.href
                  ? "text-[#C75B39] bg-[#F0EDE6]"
                  : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#F0EDE6]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </>
      )}
    </div>
  );

  return (
    <>
      <nav className="fixed top-[54px] left-0 right-0 z-50 nav-glass border-b border-[#E5E0D8]/50">
        <div ref={navRef} className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="hover:scale-110 transition-transform"
          >
            <img
              src="/logo.svg"
              alt="DEMISMATCH"
              className="w-8 h-8"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Primary links */}
            {PRIMARY_LINKS.map((link) => (
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

            {/* Evidence dropdown */}
            <div className="relative">
              <DropdownButton id="evidence" label="Evidence" isActive={isEvidencePage} />
              {openDropdown === "evidence" && <DropdownMenu links={EVIDENCE_LINKS} />}
            </div>

            {/* About dropdown */}
            <div className="relative">
              <DropdownButton id="about" label="About" isActive={isAboutPage} />
              {openDropdown === "about" && (
                <DropdownMenu
                  links={ABOUT_LINKS}
                  subsection={{ title: "Who It's For", links: AUDIENCE_LINKS }}
                />
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

      {/* Mobile nav */}
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
              {/* Primary links */}
              {PRIMARY_LINKS.map((link) => (
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

              {/* Evidence section */}
              <div className="py-4 border-b border-[#E5E0D8]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8B8B8B] mb-3">Evidence</p>
                <div className="space-y-3">
                  {EVIDENCE_LINKS.map((link) => (
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

              {/* About section */}
              <div className="py-4 border-b border-[#E5E0D8]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8B8B8B] mb-3">About</p>
                <div className="space-y-3">
                  {ABOUT_LINKS.map((link) => (
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
