'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useSiteTheme } from '@/lib/useSiteTheme';

const links = [
  { label: 'Services', href: '/#services' },
  { label: 'Bootcamp', href: '/bootcamp' },
  { label: 'Courses', href: '/#courses' },
  { label: 'Books', href: '/books' },
  { label: 'Company', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
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
            <nav className="border-t border-[var(--line)] px-3 pb-3 pt-2 lg:hidden" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/bootcamp#register"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2 w-full"
              >
                Enrol now
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
