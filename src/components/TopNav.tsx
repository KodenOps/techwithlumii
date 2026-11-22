'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  GraduationCap,
  LayoutGrid,
  Library,
  Mail,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { useSiteTheme } from '@/lib/useSiteTheme';

const links = [
  { label: 'Services', href: '/#services', icon: LayoutGrid },
  { label: 'Bootcamp', href: '/bootcamp', icon: GraduationCap },
  { label: 'Courses', href: '/#courses', icon: BookOpen },
  { label: 'Books', href: '/books', icon: Library },
  { label: 'Company', href: '/#about', icon: Building2 },
  { label: 'Contact', href: '/#contact', icon: Mail },
];

export default function TopNav() {
  const { isDark, toggle } = useSiteTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="shell pt-3 sm:pt-4">
        <div className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)]/90 shadow-[0_18px_40px_-34px_rgba(8,20,44,0.8)] backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-3 sm:px-4">
            <Link href="/" className="flex items-center gap-2.5 pl-1" aria-label="RubyTech home">
              <span className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-[var(--brand)] font-display text-[15px] font-bold text-[var(--on-brand)]">
                R
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[1.05rem] font-bold tracking-[-0.03em]">
                  RubyTech
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--faint)]">
                  Consult &amp; Outsourcing
                </span>
              </span>
            </Link>

            <nav
              className="hidden items-center gap-1 rounded-full bg-[var(--surface-2)] p-1 lg:flex"
              aria-label="Main"
            >
              {links.map((link) => {
                const active = link.href === pathname;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors ${
                      active
                        ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm'
                        : 'text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <Link
                href="/bootcamp#register"
                className="btn btn-primary hidden h-9 px-4 text-[13px] sm:inline-flex"
              >
                Enrol now
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--line-strong)] lg:hidden"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {open && (
            <div className="px-3 pb-3 lg:hidden">
              <nav
                className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--surface)] p-2 shadow-[0_26px_50px_-30px_rgba(8,20,44,0.85)]"
                aria-label="Mobile"
              >
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-[0.9rem] px-2.5 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-[var(--brand-soft)] text-[var(--brand)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/bootcamp#register"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary mt-2 w-full"
                >
                  Enrol now
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
