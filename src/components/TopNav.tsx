'use client';

import Link from 'next/link';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Dispatch, SetStateAction, CSSProperties } from 'react';

const navItems = [
  'Home',
  'About',
  'Courses',
  'Services',
  'Testimonials',
  'Contact',
];
interface TopNavProps {
  isDark: boolean;
  theme: 'light' | 'dark';
  setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  line: string;
  text: string;
  muted: string;
  mutedSoft: string;
  displayFont: CSSProperties;
  labelFont: CSSProperties;
}
const BRASS = '#B78A46';

export default function TopNav({
  isDark,
  theme,
  setTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
  line,
  text,
  muted,
  mutedSoft,
  displayFont,
  labelFont,
}: TopNavProps) {
  return (
    <div className="">
      <header
        className="sticky top-0 z-50 mb-2 px-2 flex items-center justify-between border-b py-5 backdrop-blur-md"
        style={{
          borderColor: line,
          background: isDark
            ? 'rgba(11,13,18,0.82)'
            : 'rgba(250,249,246,0.86)',
        }}
      >
        {/* Logo */}
        <div className="flex items-baseline gap-2">
          <Link href="/" className="text-xl" style={{ ...displayFont, fontStyle: 'italic' }}>
            RubyTech
          </Link>

          <span
            className="hidden text-[11px] uppercase tracking-[0.24em] sm:inline"
            style={{ color: mutedSoft, ...labelFont }}
          >
            RC-9666355
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-6">
          <nav className="hidden items-center gap-8 text-[13px] font-medium md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="group relative py-1 transition-opacity hover:opacity-80"
                style={{ color: muted }}
              >
                {item}

                <span
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  style={{ background: BRASS }}
                />
              </a>
            ))}

            <Link
              href="/bootcamp"
              className="group relative py-1 transition-opacity hover:opacity-80"
              style={{ color: muted }}
            >
              Bootcamp

              <span
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ background: BRASS }}
              />
            </Link>

            <Link
              href="/books"
              className="group relative py-1 transition-opacity hover:opacity-80"
              style={{ color: muted }}
            >
              Books

              <span
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ background: BRASS }}
              />
            </Link>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 transition hover:opacity-70"
            style={{
              border: `1px solid ${line}`,
              color: text,
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="rounded-full p-2 md:hidden"
            style={{
              border: `1px solid ${line}`,
              color: text,
            }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          className="mb-4 border-b py-4 md:hidden"
          style={{ borderColor: line }}
        >
          <div className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-lg px-2 py-2.5 transition hover:opacity-70"
                style={{ color: muted }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}

            <Link
              href="/bootcamp"
              className="rounded-lg px-2 py-2.5 transition hover:opacity-70"
              style={{ color: muted }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Bootcamp
            </Link>

            <Link
              href="/books"
              className="rounded-lg px-2 py-2.5 transition hover:opacity-70"
              style={{ color: muted }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Books
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}