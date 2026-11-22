'use client';

import Image from 'next/image';
import books, { type Book } from '@/app/data/books';
import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import TopNav from '@/components/TopNav';
import SiteFooter from '@/components/SiteFooter';

export default function BooksPage() {
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!activeBook) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveBook(null);
    };

    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeBook]);

  const openSelar = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="pt-6 sm:pt-8">
        {/* HERO */}
        <section className="shell">
          <div className="panel grid gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow">Digital books · instant download</p>
              <h1 className="display mt-7 max-w-2xl">
                Practical books for where you are{' '}
                <span className="text-[var(--brand)]">right now.</span>
              </h1>
            </div>
            <div>
              <p className="lead max-w-md text-[0.95rem]">
                No fluff, no theory for theory&apos;s sake — just clear, actionable guides you can
                start using today. Delivered instantly through Selar.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['2 titles', 'PDF & mobile friendly', 'Secure checkout'].map((item) => (
                  <span key={item} className="badge">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LIBRARY */}
        <section className="shell section">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">The library</p>
              <h2 className="h2 mt-6">Pick a book to see more.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">
              Tap any title for a full summary, then buy securely on Selar.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {books.map((book) => (
              <button
                type="button"
                key={book.id}
                onClick={() => setActiveBook(book)}
                className="card card-hover group flex flex-col overflow-hidden text-left"
              >
                <div className="relative flex justify-center bg-[var(--surface-2)] px-6 pb-4 pt-8">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    className="h-[15rem] w-auto rounded-[0.5rem] object-cover shadow-[0_24px_40px_-26px_rgba(8,20,44,0.55)] transition-transform duration-700 group-hover:-translate-y-1"
                  />
                  <span className="absolute right-5 top-5 badge badge-brand">{book.tag}</span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    {book.badge && <span className="badge">{book.badge}</span>}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold uppercase leading-tight tracking-[-0.03em]">
                    {book.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                    {book.shortDescription}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-5">
                    <span className="font-display text-xl font-bold tracking-[-0.03em]">
                      {book.price}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--brand)]">
                      View book
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2 text-xs text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between">
            <p>Written and published by RubyTech Consult.</p>
            <p>Checkout and delivery handled securely by Selar.</p>
          </div>
        </section>
      </main>

      <SiteFooter />

      {activeBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050d1c]/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setActiveBook(null)}
        >
          <div
            className="relative grid max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] md:grid-cols-[250px_1fr]"
            role="dialog"
            aria-modal="true"
            aria-label={activeBook.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveBook(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative flex items-center justify-center bg-[var(--surface-2)] p-6 md:min-h-[360px]">
              <Image
                src={activeBook.cover}
                alt={`${activeBook.title} cover`}
                className="h-[17rem] w-auto rounded-[0.5rem] object-cover shadow-[0_24px_40px_-26px_rgba(8,20,44,0.55)]"
              />
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <span className="badge badge-brand w-fit">{activeBook.tag}</span>
              <h3 className="mt-4 font-display text-xl font-bold uppercase leading-tight tracking-[-0.03em]">
                {activeBook.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-[var(--brand)]">{activeBook.subtitle}</p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{activeBook.fullDescription}</p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
                    Price
                  </p>
                  <p className="mt-1 font-display text-xl font-bold">{activeBook.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openSelar(activeBook.selarUrl)}
                  className="btn btn-primary"
                >
                  Buy now on Selar
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-[var(--faint)]">
                Opens Selar in a new tab to complete your secure purchase.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
