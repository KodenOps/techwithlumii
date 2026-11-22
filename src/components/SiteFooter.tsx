import Link from 'next/link';

const programLinks = [
  { label: 'Website Development', href: '/courses/website-development-bootcamp' },
  { label: 'DevOps Beginner', href: '/courses/devops-beginner-bootcamp' },
  { label: 'Excel & Data Analysis', href: '/courses/excel-data-analysis-bootcamp' },
  { label: 'All pathways', href: '/bootcamp' },
];

const companyLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'About us', href: '/#about' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Books', href: '/books' },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="shell pb-4 pt-6 sm:pb-6">
      <div className="band overflow-hidden">
        <div className="grid gap-12 px-7 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-white font-display text-[15px] font-bold text-[#0a1830]">
                R
              </span>
              <span className="font-display text-[1.05rem] font-bold tracking-[-0.03em] text-white">
                RubyTech
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              Rubytech Consulting &amp; Outsourcing Enterprise — capability, delivery and support
              for ambitious people and growing businesses.
            </p>
            <span className="mt-6 inline-flex rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/45">
              RC-9666355
            </span>
          </div>

          <nav aria-label="Programmes" className="text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Programmes
            </p>
            <ul className="mt-5 space-y-3">
              {programLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/65 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Company
            </p>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/65 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Contact
            </p>
            <ul className="mt-5 space-y-3 text-white/65">
              <li>
                <a
                  href="mailto:rubytechconsulting@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  rubytechconsulting@gmail.com
                </a>
              </li>
              <li>Lagos, Nigeria</li>
              <li>Working worldwide</li>
            </ul>
            <Link
              href="/#contact"
              className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0a1830] transition-colors hover:bg-[#d9e3ff]"
            >
              Start a conversation
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 px-7 py-5 sm:px-10">
          <div className="flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} RubyTech Consult. All rights reserved.</p>
            <p>Training · Consulting · Outsourcing</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
