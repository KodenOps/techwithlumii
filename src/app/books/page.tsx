'use client';


import Link from 'next/link';
import Image from 'next/image';
import books, { type Book } from '@/app/data/books';
import { useEffect, useState } from 'react';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import TopNav from '@/components/TopNav';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
});

const BRASS = '#B78A46';

export default function BooksPage() {
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const year = new Date().getFullYear();

  // Close on Escape, lock body scroll while modal is open
  useEffect(() => {
    if (!activeBook) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveBook(null);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeBook]);

  function openSelar(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const isDark = theme === 'dark';

    const bg = isDark ? '#0B0D12' : '#FAF9F6';
  const text = isDark ? '#F5F3EE' : '#14171F';
  const muted = isDark ? 'rgba(245,243,238,0.62)' : 'rgba(20,23,31,0.60)';
  const mutedSoft = isDark ? 'rgba(245,243,238,0.42)' : 'rgba(20,23,31,0.42)';
  const line = isDark ? 'rgba(245,243,238,0.10)' : 'rgba(20,23,31,0.10)';
  const cardBg = isDark ? '#15181F' : '#FFFFFF';
  const cardBgSoft = isDark ? '#191C24' : '#F1EFE9';

  const displayFont = { fontFamily: "'Fraunces', Georgia, serif" };
  const labelFont = { fontFamily: "'IBM Plex Mono', monospace" };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`page ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {/* NAV */}
                       <div className="relative z-10 mx-auto flex  max-w-7xl flex-col   ">
      
                   <TopNav
              isDark={isDark}
              theme={theme}
              setTheme={setTheme}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              line={line}
              text={text}
              muted={muted}
              mutedSoft={mutedSoft}
              displayFont={displayFont}
              labelFont={labelFont}
            />
      </div>

      <header className="hero">
        <div className="wrap hero-inner">
          <span className="eyebrow"><span className="dot" /> DIGITAL BOOKS · INSTANT DOWNLOAD</span>
          <h1>Practical books, <em>written for where you are right now.</em></h1>
          <p className="lede">
            No fluff, no theory for theory&apos;s sake — just clear, actionable guides you can start using today.
          </p>
        </div>
      </header>

      <section id="books flex justify center w-full bg-red-300">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">THE LIBRARY</span>
            <h2>Pick a book to see more.</h2>
            <p>Tap any cover for a quick summary, then buy securely on Selar.</p>
          </div>

          <div className="book-grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
            {books.map((book) => (
              <button
                type="button"
                key={book.id}
                className="book-card"
                onClick={() => setActiveBook(book)}
              >
                <div className="cover-wrap">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    fill
                    sizes="(max-width: 700px) 90vw, 260px"
                    className="cover-img"
                  />
                  {book.badge && <span className="badge">{book.badge}</span>}
                </div>
                <div className="book-info">
                  <span className="book-tag">{book.tag}</span>
                  <h3>{book.title}</h3>
                  <p className="book-blurb">{book.shortDescription}</p>
                  <div className="book-footer">
                    <span className="price">{book.price}</span>
                    <span className="view-link">View book →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>© {year} RubyTech Consult. All rights reserved.</p>
          <a href="/">rubytech.com.ng</a>
        </div>
      </footer>

      {activeBook && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveBook(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={activeBook.title}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setActiveBook(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="modal-cover">
              <Image
                src={activeBook.cover}
                alt={`${activeBook.title} cover`}
                fill
                sizes="320px"
                className="cover-img"
              />
            </div>

            <div className="modal-body">
              <span className="book-tag">{activeBook.tag}</span>
              <h3>{activeBook.title}</h3>
              <p className="modal-subtitle">{activeBook.subtitle}</p>
              <p className="modal-desc">{activeBook.fullDescription}</p>

              <div className="modal-buy-row">
                <span className="price big">{activeBook.price}</span>
                <button
                  type="button"
                  className="buy-btn"
                  onClick={() => openSelar(activeBook.selarUrl)}
                >
                  Buy now on Selar →
                </button>
              </div>
              <p className="modal-note">Opens Selar in a new tab to complete your secure purchase.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page {
          --ink: #10141a;
          --ink-soft: #1a2029;
          --ink-line: #2a323e;
          --cloud: #f1f1ec;
          --cloud-dim: #c9cbc2;
          --data: #e8a33d;
          --data-dim: #3a2a12;
          --radius: 14px;
          --display: var(--font-display), sans-serif;
          --body: var(--font-body), sans-serif;
          --mono: var(--font-mono), monospace;

          background: var(--ink);
          color: var(--cloud);
          font-family: var(--body);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        .page :global(*) { box-sizing: border-box; }
        .page :global(img) { display: block; max-width: 100%; }
        .page :global(a) { color: inherit; }
        .page :global(h1),
        .page :global(h2),
        .page :global(h3) {
          font-family: var(--display);
          margin: 0;
          letter-spacing: -0.01em;
        }
        .page :global(p) { margin: 0; }
        .page :global(button) {
          font-family: var(--body);
          cursor: pointer;
        }

        .wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .eyebrow {
          font-family: var(--mono);
          font-size: 12.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--cloud-dim);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .eyebrow .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--data);
          display: inline-block;
        }

        /* ===== NAV ===== */
        .nav {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(16, 20, 26, 0.86);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--ink-line);
        }
        .nav .wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .brand {
          font-family: var(--display);
          font-weight: 700;
          font-size: 19px;
          letter-spacing: -0.02em;
        }
        .brand span { color: var(--data); }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
          font-size: 14px;
          color: var(--cloud-dim);
        }
        .nav-links :global(a) { text-decoration: none; }
        .nav-links :global(a:hover) { color: var(--cloud); }
        .nav-cta {
          padding: 9px 18px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13.5px;
          text-decoration: none;
        }

        /* ===== HERO ===== */
        .hero {
          padding: 76px 0 40px;
          position: relative;
          overflow: hidden;
        }
        .hero-inner { max-width: 720px; }
        .hero h1 {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700;
          line-height: 1.08;
          margin: 18px 0 16px;
        }
        .hero h1 em {
          font-style: normal;
          color: var(--data);
        }
        .hero .lede {
          font-size: 17px;
          color: var(--cloud-dim);
        }

        section { padding: 60px 0 80px; }
        .sec-head { max-width: 640px; margin-bottom: 40px; }
        .sec-head h2 {
          font-size: clamp(24px, 3.2vw, 34px);
          margin: 14px 0 10px;
        }
        .sec-head p { color: var(--cloud-dim); font-size: 15.5px; }

        /* ===== BOOK GRID / CARD ===== */
        .book-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 24px;
        }
        .book-card {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          overflow: hidden;
          text-align: left;
          border-width: 1px;
          transition: border-color 0.15s ease, transform 0.15s ease;
          display: flex;
          flex-direction: column;
        }
        .book-card:hover {
          border-color: var(--data);
          transform: translateY(-3px);
        }
        .cover-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background: var(--ink);
        }
        .cover-img { object-fit: cover; }
        .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--data);
          color: var(--ink);
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 999px;
        }
        .book-info {
          padding: 18px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .book-tag {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--data);
        }
        .book-info h3 {
          font-size: 17px;
          line-height: 1.3;
        }
        .book-blurb {
          font-size: 13.5px;
          color: var(--cloud-dim);
          flex: 1;
        }
        .book-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          border-top: 1px dashed var(--ink-line);
          padding-top: 12px;
        }
        .price {
          font-family: var(--mono);
          font-weight: 700;
          font-size: 14px;
          color: var(--cloud);
        }
        .view-link {
          font-family: var(--mono);
          font-size: 12.5px;
          color: var(--cloud-dim);
        }
        .book-card:hover .view-link { color: var(--data); }

        /* ===== FOOTER ===== */
        footer {
          padding: 44px 0;
          border-top: 1px solid var(--ink-line);
        }
        footer .wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        footer p { color: var(--cloud-dim); font-size: 13px; }
        footer :global(a) {
          text-decoration: none;
          color: var(--cloud-dim);
          font-size: 13px;
        }
        footer :global(a:hover) { color: var(--cloud); }

        /* ===== MODAL ===== */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 10, 14, 0.72);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 100;
        }
        .modal {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          max-width: 640px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 0;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--ink);
          border: 1px solid var(--ink-line);
          color: var(--cloud-dim);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .modal-close:hover { color: var(--cloud); border-color: var(--data); }
        .modal-cover {
          position: relative;
          background: var(--ink);
          min-height: 260px;
        }
        .modal-body {
          padding: 26px 26px 26px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .modal-body h3 {
          font-size: 21px;
          line-height: 1.28;
        }
        .modal-subtitle {
          font-size: 13.5px;
          color: var(--cloud-dim);
          font-style: italic;
        }
        .modal-desc {
          font-size: 14px;
          color: var(--cloud-dim);
          line-height: 1.6;
        }
        .modal-buy-row {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .price.big { font-size: 20px; }
        .buy-btn {
          background: var(--data);
          color: var(--ink);
          font-weight: 700;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 9px;
          border: none;
          white-space: nowrap;
        }
        .buy-btn:hover { transform: translateY(-1px); }
        .modal-note {
          font-size: 11.5px;
          color: var(--cloud-dim);
          opacity: 0.8;
        }

        @media (max-width: 560px) {
          .modal {
            grid-template-columns: 1fr;
          }
          .modal-cover { min-height: 220px; }
        }
      `}</style>
    </div>
  );
}