'use client';

import { useState, useRef, type FormEvent } from 'react';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import courseDetails from '@/app/data/courseDetails';
import testimonials from '../data/testimonials';
import Image from 'next/image';

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

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT Abuja',
];

interface PathwayOption {
  id: 'web' | 'devops' | 'data';
  tag: string;
  title: string;
  desc: string;
  duration: string;
  outcome: string;
  value: string;
  url: string;
  slug: string;
}

const PATHWAYS: PathwayOption[] = [
  {
    id: 'web',
    tag: 'Web Development',
    title: 'Designing Websites That Sell — HTML, CSS, JS, AI',
    desc: 'Learn to build modern web applications with React, Next.js, and polished UI systems that impress recruiters and clients.',
    duration: '8 weeks',
    outcome: '+4 Projects',
    value: 'Web Development (Designing Websites That Sell)',
    url: "/courses/website-development-bootcamp",
    slug: 'website-development-bootcamp',
  },
  {
    id: 'devops',
    tag: 'DevOps',
    title: 'Beginner to Mastery DevOps — CI/CD, Cloud, Docker, Linux',
    desc: 'Master the fundamentals of DevOps, including CI/CD pipelines, cloud infrastructure, Docker containerization, and Linux administration.',
    duration: '8 weeks',
    outcome: 'Deploy · Monitor · Scale',
    value: 'DevOps (Beginner to Mastery)',
    url: "/courses/devops-beginner-bootcamp",
    slug: 'devops-beginner-bootcamp',
  },
  {
    id: 'data',
    tag: 'Data Analysis',
    title: 'Data Analysis With Excel & Power BI — Excel, SQL, Power BI',
    desc: 'Gain practical skills in data analysis using Excel, SQL, and Power BI to make data-driven decisions and create impactful visualizations.',
    duration: '8 weeks',
    outcome: 'Data-driven decisions',
    value: 'Data Analysis (Excel & Power BI)',
    url: "/courses/excel-data-analysis-bootcamp",
    slug: 'excel-data-analysis-bootcamp',
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+234|0)[789][01]\d{8}$/;

function generateRegistrationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'RBY'; // brand prefix, still fully alphanumeric
  const randomLength = 9; // total length = 3 (prefix) + 9 = 12, safely over the 10-char minimum
  let random = '';
  const values = new Uint32Array(randomLength);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < randomLength; i++) {
    random += chars[values[i] % chars.length];
  }
  return prefix + random;
}

interface RegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  pathway: string;
  expectations: string;
}

type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

interface CopyStatus {
  code: boolean;
  all: boolean;
}

const initialForm: RegistrationForm = {
  fullName: '',
  email: '',
  phone: '',
  state: '',
  pathway: '',
  expectations: '',
};

export default function BootcampPage() {
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({ code: false, all: false });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notifyFailed, setNotifyFailed] = useState<boolean>(false);
  const registerRef = useRef<HTMLElement>(null);

  function updateField<K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function selectPathway(value: string) {
    setForm((prev) => ({ ...prev, pathway: value }));
    registerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function validate(data: RegistrationForm): boolean {
    const next: FormErrors = {};
    if (!data.fullName || data.fullName.trim().length < 3) next.fullName = 'Enter your full name.';
    if (!EMAIL_RE.test(data.email)) next.email = 'Enter a valid email address.';
    if (!PHONE_RE.test(data.phone.replace(/\s+/g, ''))) next.phone = 'Enter a valid Nigerian phone number.';
    if (!data.state) next.state = 'Select your state.';
    if (!data.pathway) next.pathway = 'Select a pathway.';
    if (!data.expectations || data.expectations.trim().length < 5) next.expectations = 'Tell us briefly what you expect.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // The pathway picker only stores a display value (e.g. "Web Development (…)"),
  // so resolve back to the matching pathway definition, then to its full record
  // in the shared course data — this is what makes the amount unique per course.
  const selectedPathwayOption = PATHWAYS.find((p) => p.value === form.pathway);
  const selectedCourse = selectedPathwayOption
    ? courseDetails.find((c) => c.slug === selectedPathwayOption.slug)
    : undefined;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate(form)) return;

    const newCode = generateRegistrationCode();
    const submission = {
      ...form,
      code: newCode,
      amount: selectedCourse?.price ?? null,
      currency: selectedCourse?.currency ?? null,
      submittedAt: new Date().toISOString(),
    };

    // Local backup copy in the browser, in case the network request below fails.
    try {
      const existing = JSON.parse(localStorage.getItem('rubytech_bootcamp_leads') || '[]');
      existing.push(submission);
      localStorage.setItem('rubytech_bootcamp_leads', JSON.stringify(existing));
    } catch (err) {
      // localStorage unavailable — safe to ignore
    }

    setIsSubmitting(true);
    setNotifyFailed(false);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (!res.ok) setNotifyFailed(true);
    } catch (err) {
      setNotifyFailed(true);
    } finally {
      setIsSubmitting(false);
      setCode(newCode);
      setSubmitted(true);
    }
  }

  function handleEdit() {
    setSubmitted(false);
  }

  function copyText(text: string, key: keyof CopyStatus) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: false })), 1800);
    });
  }

  const year = new Date().getFullYear();
  const amountLabel = selectedCourse
    ? `${selectedCourse.currency} ${selectedCourse.price.toLocaleString('en-NG')}`
    : 'Contact us for pricing';

  return (
    <div className={`page ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <nav className="nav">
        <div className="wrap">
          <div className="brand">Ruby<span>Tech</span></div>
          <div className="nav-links">
            <a href="#pathways">Pathways</a>
            <a href="#why">Why RubyTech</a>
            <a href="#proof">Reviews</a>
            <a href="/">Company site</a>
          </div>
          <a className="nav-cta" href="#register">Reserve a seat</a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow"><span className="dot" /> COHORT ENROLLMENT NOW OPEN · LIMITED SEATS</span>
            <h1>Pick your runway.<br />Launch your tech career <em>in 8 weeks.</em></h1>
            <p className="lede">RubyTech&apos;s hands-on bootcamp gets you from zero to job-ready across three in-demand pathways — Web Development, DevOps, or Data Analysis. Real projects, real mentorship, real results.</p>
            <div className="hero-ctas">
              <a href="#register" className="btn-primary">Reserve My Seat →</a>
              <a href="#pathways" className="btn-ghost">See the 3 pathways</a>
            </div>
            <div className="stat-row">
              <div className="stat"><b>8</b><span>WEEKS TO LAUNCH</span></div>
              <div className="stat"><b>3</b><span>CAREER PATHWAYS</span></div>
              <div className="stat"><b>4+</b><span>PORTFOLIO PROJECTS</span></div>
              <div className="stat"><b>1:1</b><span>MENTOR SUPPORT</span></div>
            </div>
          </div>

          <div className="runway-card">
            <h4>Cohort flight path</h4>
            <div className="runway-line">
              <div className="mark" style={{ left: '2%' }} />
              <div className="mark" style={{ left: '50%' }} />
              <div className="mark" style={{ left: '98%' }} />
              <svg className="plane" width="26" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 16l19-6-9-3-3-9-2 6-6 2 4 2z" fill="#E8A33D" />
              </svg>
            </div>
            <div className="runway-labels"><span>WEEK 1 · TAKEOFF</span><span>WEEK 4 · BUILD</span><span>WEEK 8 · LAUNCH</span></div>
            <p className="runway-note"><b>Every seat includes:</b> live classes, a private cohort community, project reviews, and a certificate of completion.</p>
          </div>
        </div>
      </header>

      <section id="pathways">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">THREE PATHWAYS · ONE DEPARTURE GATE</span>
            <h2>Choose the runway that fits where you&apos;re headed.</h2>
            <p>Every pathway runs for 8 weeks and ends with a portfolio you can show a recruiter — not just a certificate.</p>
          </div>

          <div className="pathways">
            {PATHWAYS.map((p) => {
              const pCourse = courseDetails.find((c) => c.slug === p.slug);
              return (
                <article className="pass" data-track={p.id} key={p.id}>
                  <div className="pass-top">
                    <span className="pass-tag">{p.tag}</span>
                    <h3>{p.title}</h3>
                    <p className="desc">{p.desc}</p>
                  </div>
                  <div className="pass-perf" />
                  <div className="pass-bottom">
                    <button type="button" className="pass-select" onClick={() => selectPathway(p.value)}>
                      Select this pathway →
                    </button>
                  </div>
                  <div className="pass-meta" style={{ margin: '0 22px 20px' }}>
                    <div><strong>{p.duration}</strong>DURATION</div>
                    <div><strong>{p.outcome}</strong>OUTCOME</div>
                    {pCourse && (
                      <div>
                        <strong>{pCourse.currency} {pCourse.price.toLocaleString('en-NG')}</strong>
                        PRICE
                      </div>
                    )}
                    <Link href={p.url} target="_blank" rel="noopener noreferrer">
                      Learn more
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          
        </div>
      </section>

      <section id="why">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">WHY RUBYTECH</span>
            <h2>Built for people who want proof, not promises.</h2>
          </div>
          <div className="why-grid">
            <div className="why-card"><div className="n">01</div><h4>Project-based</h4><p>You leave with real, working projects — not just slides and theory.</p></div>
            <div className="why-card"><div className="n">02</div><h4>Live mentorship</h4><p>Direct access to instructors for feedback, code reviews, and career guidance.</p></div>
            <div className="why-card"><div className="n">03</div><h4>Small cohorts</h4><p>Seats are capped so every student actually gets seen and supported.</p></div>
            <div className="why-card"><div className="n">04</div><h4>Career-ready</h4><p>CV, portfolio, and interview prep built into your final two weeks.</p></div>
          </div>
        </div>
      </section>

      <section id="proof" className="proof">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">FROM PAST COHORTS</span>
            <h2>Quality speaks a lot and we have past cohort members who speaks highly of us.</h2>
          </div>
          <div className="proof-grid">
            {testimonials.slice(0,3).map((i) => (
              <div className="quote flex flex-col justify-between bg-red-200 h-full" key={i.name} >
                <div className="stars">★★★★★</div>
                <p>&quot; {i.quote}&quot;</p>
            <div className="who  bottom-4  w-full flex items-center justify-start gap-2">
                    <Image src={i.image} alt='avatar' className='rounded-full w-10 h-10'/>
                    <p className='w-full'>{i.name}
                <span>{i.role}</span>
                </p>
            
                
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="register" className="form-section" ref={registerRef}>
        <div className="wrap">
          <div className="sec-head" style={{ margin: '0 auto 40px', textAlign: 'center', maxWidth: 640 }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>RESERVE YOUR SEAT</span>
            <h2>Your seat is one form away.</h2>
            <p>Fill this in, get your unique registration code, then complete payment to lock in your spot.</p>
          </div>

          <div className="urgency" style={{ maxWidth: 760, margin: '0 auto 28px' }}>
            <p>🔥 <b>Early cohort seats are limited.</b> Applications are reviewed in the order received.</p>
          </div>

          {!submitted ? (
            <div className="form-shell">
              <h3>Registration form</h3>
              <p className="sub">Takes less than 2 minutes. You&apos;ll get your payment instructions immediately after.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="fullName">Full name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="e.g. Chidinma Okafor"
                      required
                    />
                    <div className="err">{errors.fullName}</div>
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                    <div className="err">{errors.email}</div>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="phone">Phone number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="080X XXX XXXX"
                      required
                    />
                    <div className="err">{errors.phone}</div>
                  </div>
                  <div className="field">
                    <label htmlFor="state">State (Nigeria)</label>
                    <select
                      id="state"
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      required
                    >
                      <option value="" disabled>Select your state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <div className="err">{errors.state}</div>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field full">
                    <label htmlFor="pathway">Pathway selection</label>
                    <select
                      id="pathway"
                      value={form.pathway}
                      onChange={(e) => updateField('pathway', e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a pathway</option>
                      {PATHWAYS.map((p) => (
                        <option key={p.id} value={p.value}>{p.tag} — {p.title.split(' — ')[0]}</option>
                      ))}
                    </select>
                    {selectedCourse && (
                        <>
                     <label htmlFor="phone" className='mt-4'>Fee</label>
                    <input
                      type="tel"
                      id="phone"
                      value={ amountLabel}
                      required
                      disabled
                    />
                    </>
                    )}
                    <div className="err">{errors.pathway}</div>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field full">
                    <label htmlFor="expectations">What do you hope to get out of this bootcamp?</label>
                    <textarea
                      id="expectations"
                      value={form.expectations}
                      onChange={(e) => updateField('expectations', e.target.value)}
                      placeholder="Tell us briefly what you're hoping to achieve..."
                      required
                    />
                    <div className="err">{errors.expectations}</div>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Reserving your seat…' : 'Generate My Registration Code →'}
                </button>
                <p className="privacy-note">Your details are used only for bootcamp registration and communication. No spam.</p>
              </form>
            </div>
          ) : (
            <div className="ticket">
              <div className="ticket-head">
                <div className="ok"><div className="circle">✓</div><h3>Seat reserved — complete payment to confirm</h3></div>
                <span>{form.pathway.toUpperCase()}</span>
              </div>
              <div className="ticket-body">
                <div className="row"><span className="k">Registered name</span><span className="v">{form.fullName}</span></div>
                <div className="row"><span className="k">Pathway</span><span className="v">{form.pathway}</span></div>
                <div className="row"><span className="k">Bank name</span><span className="v">Moniepoint</span></div>
                <div className="row"><span className="k">Account number</span><span className="v">2345678902</span></div>
                <div className="row"><span className="k">Account name</span><span className="v">Rubytech Consult</span></div>
                <div className="row"><span className="k">Amount to pay</span><span className="v" style={{ color: '#E8A33D' }}>{amountLabel}</span></div>

                <div className="code-box">
                  <div>
                    <div className="label">Use this code as your payment narration / description</div>
                    <div className="code">{code}</div>
                  </div>
                  <button type="button" className="copy-btn" onClick={() => copyText(code, 'code')}>
                    {copyStatus.code ? 'Copied!' : 'Copy code'}
                  </button>
                </div>

                <div className="ticket-warn">
                  <b>Important:</b> When making your transfer, enter the code above in the narration/description field. This is how we match your payment to your registration. Keep a screenshot of your payment and this code — you&apos;ll need both for confirmation.
                </div>

                {notifyFailed && (
                  <div className="ticket-warn notify-warn">
                    <b>Heads up:</b> we couldn&apos;t automatically notify our team about your registration. Your details and code are still valid — please also send a screenshot of this page to us to be safe.
                  </div>
                )}

                <div className="ticket-actions">
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() =>
                      copyText(
                        `Bank: Moniepoint\nAccount Number: 2345678902\nAccount Name: Rubytech Consult\nAmount to Pay: ${amountLabel}\nNarration/Description: ${code}`,
                        'all'
                      )
                    }
                  >
                    {copyStatus.all ? 'Copied!' : 'Copy account details'}
                  </button>
                  <button type="button" className="edit" onClick={handleEdit}>Edit my details</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p>© {year} RubyTech Consult. All rights reserved.</p>
          <a href="/">rubytech.com.ng</a>
        </div>
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <style jsx>{`
        .page {
          --ink: #10141a;
          --ink-soft: #1a2029;
          --ink-line: #2a323e;
          --cloud: #f1f1ec;
          --cloud-dim: #c9cbc2;
          --web: #4c6fff;
          --web-dim: #1e2a66;
          --devops: #679875;
          --devops-dim: #233329;
          --data: #e8a33d;
          --data-dim: #3a2a12;
          --danger: #e85d5d;
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
        .page :global(*) {
          box-sizing: border-box;
        }
        .page :global(img),
        .page :global(svg) {
          display: block;
          max-width: 100%;
        }
        .page :global(a) {
          color: inherit;
        }
        .page :global(h1),
        .page :global(h2),
        .page :global(h3),
        .page :global(h4) {
          font-family: var(--display);
          margin: 0;
          letter-spacing: -0.01em;
        }
        .page :global(p) {
          margin: 0;
        }
        .page :global(button) {
          font-family: var(--body);
          cursor: pointer;
          border: none;
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

        /* ============ NAV ============ */
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
        .brand span {
          color: var(--data);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
          font-size: 14px;
          color: var(--cloud-dim);
        }
        .nav-links a {
          text-decoration: none;
        }
        .nav-links a:hover {
          color: var(--cloud);
        }
        .nav-cta {
          background: var(--cloud);
          color: var(--ink);
          padding: 9px 18px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13.5px;
          text-decoration: none;
        }

        /* ============ HERO ============ */
        .hero {
          padding: 76px 0 40px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -140px;
          right: -160px;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(76, 111, 255, 0.2), transparent 70%);
          pointer-events: none;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }
        .hero h1 {
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 700;
          line-height: 1.06;
          margin: 18px 0 20px;
        }
        .hero h1 em {
          font-style: normal;
          color: var(--data);
        }
        .hero p.lede {
          font-size: 17.5px;
          color: var(--cloud-dim);
          max-width: 520px;
          margin-bottom: 30px;
        }
        .hero-ctas {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .btn-primary {
          background: var(--data);
          color: var(--ink);
          padding: 15px 26px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 24px -8px rgba(232, 163, 61, 0.5);
          transition: transform 0.15s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
        }
        .btn-ghost {
          border: 1px solid var(--ink-line);
          color: var(--cloud);
          padding: 15px 22px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
        }
        .stat-row {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        .stat b {
          font-family: var(--display);
          font-size: 22px;
          display: block;
        }
        .stat span {
          font-size: 12.5px;
          color: var(--cloud-dim);
          font-family: var(--mono);
          letter-spacing: 0.04em;
        }

        .runway-card {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          padding: 22px;
        }
        .runway-card h4 {
          font-size: 13px;
          font-family: var(--mono);
          letter-spacing: 0.08em;
          color: var(--cloud-dim);
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .runway-line {
          position: relative;
          height: 2px;
          background: var(--ink-line);
          margin: 34px 6px 10px;
        }
        .runway-line .mark {
          position: absolute;
          top: -5px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--ink);
          border: 2px solid var(--data);
          transform: translateX(-50%);
        }
        .runway-line .plane {
          position: absolute;
          top: -15px;
          left: 2%;
          animation: fly 6s ease-in-out infinite;
        }
        @keyframes fly {
          0%,
          100% {
            left: 2%;
          }
          50% {
            left: 92%;
          }
        }
        .runway-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--cloud-dim);
          margin-top: 2px;
        }
        .runway-note {
          margin-top: 18px;
          font-size: 13.5px;
          color: var(--cloud-dim);
        }
        .runway-note b {
          color: var(--cloud);
        }
        @media (prefers-reduced-motion: reduce) {
          .runway-line .plane {
            animation: none;
            left: 50%;
          }
        }

        section {
          padding: 76px 0;
        }
        .sec-head {
          max-width: 640px;
          margin-bottom: 46px;
        }
        .sec-head h2 {
          font-size: clamp(26px, 3.4vw, 38px);
          margin: 14px 0 12px;
        }
        .sec-head p {
          color: var(--cloud-dim);
          font-size: 16px;
        }

        /* ============ PATHWAYS ============ */
        .pathways {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px;
        }
        .pass {
          background: var(--ink-soft);
          border-radius: var(--radius);
          border: 1px solid var(--ink-line);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .pass-top {
          padding: 24px 22px 20px;
          flex: 1;
        }
        .pass-tag {
          font-family: var(--mono);
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          display: inline-block;
          margin-bottom: 16px;
        }
        .pass[data-track='web'] .pass-tag {
          background: var(--web-dim);
          color: #afc0ff;
        }
        .pass[data-track='devops'] .pass-tag {
          background: var(--devops-dim);
          color: #b9d8c1;
        }
        .pass[data-track='data'] .pass-tag {
          background: var(--data-dim);
          color: #f4cd8e;
        }
        .pass h3 {
          font-size: 20px;
          line-height: 1.25;
          margin-bottom: 10px;
        }
        .pass p.desc {
          font-size: 14.5px;
          color: var(--cloud-dim);
          margin-bottom: 18px;
        }
        .pass-meta {
          display: flex;
          gap: 18px;
          font-family: var(--mono);
          font-size: 12px;
          color: var(--cloud-dim);
          border-top: 1px dashed var(--ink-line);
          padding-top: 14px;
        }
        .pass-meta strong {
          display: block;
          color: var(--cloud);
          font-size: 13.5px;
          font-family: var(--body);
          font-weight: 600;
        }
        .pass-perf {
          position: relative;
          height: 0;
          border-top: 1px dashed var(--ink-line);
          margin: 0 22px;
        }
        .pass-perf::before,
        .pass-perf::after {
          content: '';
          position: absolute;
          top: -9px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--ink);
        }
        .pass-perf::before {
          left: -31px;
        }
        .pass-perf::after {
          right: -31px;
        }
        .pass-bottom {
          padding: 16px 22px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .pass-select {
          font-family: var(--mono);
          font-weight: 700;
          font-size: 13px;
          background: none;
          border: 1px solid var(--ink-line);
          color: var(--cloud);
          padding: 10px 16px;
          border-radius: 8px;
          width: 100%;
          text-align: center;
          transition: background 0.15s, border-color 0.15s;
        }
        .pass[data-track='web'] .pass-select:hover {
          border-color: var(--web);
          color: #afc0ff;
        }
        .pass[data-track='devops'] .pass-select:hover {
          border-color: var(--devops);
          color: #b9d8c1;
        }
        .pass[data-track='data'] .pass-select:hover {
          border-color: var(--data);
          color: #f4cd8e;
        }

        /* ============ WHY ============ */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .why-card {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          padding: 22px;
        }
        .why-card .n {
          font-family: var(--mono);
          color: var(--data);
          font-size: 13px;
          margin-bottom: 12px;
        }
        .why-card h4 {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .why-card p {
          font-size: 13.5px;
          color: var(--cloud-dim);
        }

        /* ============ PROOF ============ */
        .proof {
          background: var(--ink-soft);
          border-top: 1px solid var(--ink-line);
          border-bottom: 1px solid var(--ink-line);
        }
        .proof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .quote {
          background: var(--ink);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          padding: 22px;
          font-size: 14.5px;
          color: var(--cloud-dim);
        }
        .quote .stars {
          color: var(--data);
          font-size: 13px;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        .quote .who {
          margin-top: 14px;
          font-size: 13px;
          color: var(--cloud);
          font-weight: 600;
          font-family: var(--body);
        }
        .quote .who span {
          display: block;
          color: var(--cloud-dim);
          font-weight: 400;
          font-size: 12px;
        }

        /* ============ URGENCY ============ */
        .urgency {
          background: linear-gradient(90deg, var(--data-dim), var(--ink-soft));
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .urgency p {
          font-size: 14.5px;
        }
        .urgency b {
          color: var(--data);
        }

        /* ============ FORM ============ */
        .form-section {
          background: var(--ink-soft);
          border-top: 1px solid var(--ink-line);
        }
        .form-shell {
          background: var(--ink);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius);
          padding: 36px;
          max-width: 760px;
          margin: 0 auto;
        }
        .form-shell h3 {
          font-size: 24px;
          margin-bottom: 6px;
        }
        .form-shell .sub {
          color: var(--cloud-dim);
          font-size: 14.5px;
          margin-bottom: 28px;
        }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field.full {
          grid-column: 1 / -1;
        }
        .field label {
          font-size: 12.5px;
          font-family: var(--mono);
          letter-spacing: 0.04em;
          color: var(--cloud-dim);
          text-transform: uppercase;
        }
        .field :global(input),
        .field :global(select),
        .field :global(textarea) {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          color: var(--cloud);
          padding: 12px 14px;
          border-radius: 8px;
          font-family: var(--body);
          font-size: 14.5px;
          width: 100%;
        }
        .field :global(input:focus),
        .field :global(select:focus),
        .field :global(textarea:focus) {
          outline: 2px solid var(--data);
          outline-offset: 1px;
          border-color: var(--data);
        }
        .field :global(textarea) {
          resize: vertical;
          min-height: 88px;
        }
        .err {
          font-size: 12px;
          color: var(--danger);
          min-height: 14px;
          font-family: var(--mono);
        }
        .submit-btn {
          width: 100%;
          background: var(--data);
          color: var(--ink);
          padding: 16px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
          margin-top: 8px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .privacy-note {
          font-size: 12px;
          color: var(--cloud-dim);
          margin-top: 14px;
          text-align: center;
        }

        /* ============ TICKET / PAYMENT ============ */
        .ticket {
          background: var(--ink);
          border-top: 1px solid var(--ink-line);
          border-bottom: 1px solid var(--ink-line);
        }
        .ticket-head {
          background: var(--devops-dim);
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .ticket-head .ok {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ticket-head .ok .circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--devops);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .ticket-head h3 {
          font-size: 18px;
        }
        .ticket-head span {
          font-family: var(--mono);
          font-size: 12px;
          color: #b9d8c1;
        }
        .ticket-body {
          padding: 28px;
        }
        .ticket-body .row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px dashed var(--ink-line);
          font-size: 14.5px;
        }
        .ticket-body .row:last-child {
          border-bottom: none;
        }
        .ticket-body .row .k {
          color: var(--cloud-dim);
          flex-shrink: 0;
        }
        .ticket-body .row .v {
          font-weight: 600;
          font-family: var(--mono);
          text-align: right;
        }
        @media (max-width: 560px) {
          .ticket-head,
          .ticket-body {
            padding-left: 20px;
            padding-right: 20px;
          }
          .ticket-body .row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 12px 0;
          }
          .ticket-body .row .v {
            text-align: left;
          }
        }
        .code-box {
          margin-top: 22px;
          background: var(--data-dim);
          border: 1px dashed var(--data);
          border-radius: 10px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .code-box .label {
          font-family: var(--mono);
          font-size: 12px;
          color: #f4cd8e;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .code-box .code {
          font-family: var(--mono);
          font-size: 22px;
          font-weight: 700;
          color: var(--cloud);
          letter-spacing: 0.06em;
        }
        .copy-btn {
          background: none;
          border: 1px solid var(--ink-line);
          color: var(--cloud);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-family: var(--mono);
        }
        .copy-btn:hover {
          border-color: var(--data);
          color: var(--data);
        }
        .ticket-warn {
          margin-top: 18px;
          font-size: 13.5px;
          color: var(--cloud-dim);
          background: var(--ink-soft);
          border-radius: 8px;
          padding: 14px 16px;
        }
        .ticket-warn b {
          color: var(--cloud);
        }
        .notify-warn {
          border: 1px solid var(--data);
          background: var(--data-dim);
        }
        .ticket-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .ticket-actions .edit {
          background: none;
          border: 1px solid var(--ink-line);
          color: var(--cloud-dim);
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 13.5px;
        }

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
        footer p {
          color: var(--cloud-dim);
          font-size: 13px;
        }
        footer a {
          text-decoration: none;
          color: var(--cloud-dim);
          font-size: 13px;
        }
        footer a:hover {
          color: var(--cloud);
        }

        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .pathways {
            grid-template-columns: 1fr;
          }
          .why-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .proof-grid {
            grid-template-columns: 1fr;
          }
          .field-row {
            grid-template-columns: 1fr;
          }
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}