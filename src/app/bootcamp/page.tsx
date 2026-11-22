'use client';

import { useState, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import courseDetails from '@/app/data/courseDetails';
import testimonials from '../data/testimonials';
import TopNav from '@/components/TopNav';
import SiteFooter from '@/components/SiteFooter';
import RegistrationTicket from '@/components/RegistrationTicket';

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
    outcome: '+4 projects',
    value: 'Web Development (Designing Websites That Sell)',
    url: '/courses/website-development-bootcamp',
    slug: 'website-development-bootcamp',
  },
  {
    id: 'devops',
    tag: 'DevOps',
    title: 'Beginner to Mastery DevOps — CI/CD, Cloud, Docker, Linux',
    desc: 'Master the fundamentals of DevOps, including CI/CD pipelines, cloud infrastructure, Docker containerisation, and Linux administration.',
    duration: '8 weeks',
    outcome: 'Deploy · Monitor · Scale',
    value: 'DevOps (Beginner to Mastery)',
    url: '/courses/devops-beginner-bootcamp',
    slug: 'devops-beginner-bootcamp',
  },
  {
    id: 'data',
    tag: 'Data Analysis',
    title: 'Data Analysis With Excel & Power BI — Excel, SQL, Power BI',
    desc: 'Gain practical skills in data analysis using Excel, SQL, and Power BI to make data-driven decisions and create impactful visualisations.',
    duration: '8 weeks',
    outcome: 'Data-driven decisions',
    value: 'Data Analysis (Excel & Power BI)',
    url: '/courses/excel-data-analysis-bootcamp',
    slug: 'excel-data-analysis-bootcamp',
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+234|0)[789][01]\d{8}$/;

function generateRegistrationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = 'RBY';
  const randomLength = 9;
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

const cohortPlan = [
  ['Week 1', 'Foundations', 'Tooling, core concepts and your first build.'],
  ['Weeks 2–6', 'Build', 'Weekly projects, code reviews and portfolio work.'],
  ['Weeks 7–8', 'Launch', 'CV, interview prep and a final showcase.'],
];

const whyPoints = [
  ['Project-based', 'You leave with real, working projects — not just slides and theory.'],
  ['Live mentorship', 'Direct access to instructors for feedback, code reviews and career guidance.'],
  ['Small cohorts', 'Seats are capped so every student actually gets seen and supported.'],
  ['Career-ready', 'CV, portfolio and interview prep built into your final two weeks.'],
];

const includedItems = [
  'Live cohort-based learning',
  'Hands-on projects & labs',
  'Expert mentorship',
  'Career guidance included',
];

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

  const selectedPathwayOption = PATHWAYS.find((p) => p.value === form.pathway);
  const selectedCourse = selectedPathwayOption
    ? courseDetails.find((c) => c.slug === selectedPathwayOption.slug)
    : undefined;

  const amountLabel = selectedCourse
    ? `${selectedCourse.currency} ${selectedCourse.price.toLocaleString('en-NG')}`
    : 'Contact us for pricing';

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

  function copyText(text: string, key: keyof CopyStatus) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: false })), 1800);
    });
  }

  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="pt-6 sm:pt-8">
        {/* HERO */}
        <section className="shell">
          <div className="band overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
            <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
              <div>
                <p className="eyebrow eyebrow-invert">Cohort enrolment open · limited seats</p>
                <h1 className="display mt-7 max-w-2xl text-white">
                  Pick your runway. Launch in{' '}
                  <span className="text-[#9cb4ff]">eight weeks.</span>
                </h1>
                <p className="mt-6 max-w-xl text-[1.0625rem] leading-7 text-white/65">
                  RubyTech&apos;s hands-on bootcamp takes you from zero to job-ready across three
                  in-demand pathways — web development, DevOps or data analysis. Real projects, real
                  mentorship, real results.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a href="#register" className="btn btn-invert">
                    Reserve my seat
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#pathways" className="btn btn-on-navy">
                    See the three pathways
                  </a>
                </div>

                <dl className="mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['8', 'Weeks'],
                    ['3', 'Pathways'],
                    ['4+', 'Projects'],
                    ['1:1', 'Mentoring'],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-[1rem] border border-white/10 bg-white/[0.05] px-4 py-4">
                      <dd className="font-display text-2xl font-bold leading-none text-white">{value}</dd>
                      <dt className="mt-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/45">
                        {label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-[1.25rem] border border-white/12 bg-white/[0.05] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
                    Cohort flight plan
                  </p>
                  <span className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9cb4ff]">
                    8 weeks
                  </span>
                </div>
                <ol className="mt-7 space-y-6">
                  {cohortPlan.map(([when, title, description], index) => (
                    <li key={when} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#9cb4ff] font-display text-xs font-bold text-[#0a1830]">
                          {index + 1}
                        </span>
                        {index < cohortPlan.length - 1 && (
                          <span className="mt-2 w-px flex-1 bg-white/15" />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9cb4ff]">
                          {when}
                        </p>
                        <p className="mt-1.5 font-semibold text-white">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 border-t border-white/12 pt-5 text-sm leading-6 text-white/55">
                  <span className="font-semibold text-white">Every seat includes</span> live classes,
                  a private cohort community, project reviews and a certificate of completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PATHWAYS */}
        <section id="pathways" className="shell section">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="eyebrow">Three pathways · one departure gate</p>
              <h2 className="h2 mt-6 max-w-xl">
                The runway that fits where you&apos;re headed.
              </h2>
            </div>
            <p className="lead max-w-md text-[0.95rem]">
              Every pathway runs for eight weeks and ends with a portfolio you can show a
              recruiter — not just a certificate.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {PATHWAYS.map((pathway, index) => {
              const pathwayCourse = courseDetails.find((c) => c.slug === pathway.slug);
              return (
                <article key={pathway.id} className="card card-hover flex flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="index rounded-full bg-[var(--brand-soft)] px-2.5 py-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
                      {pathway.duration}
                    </span>
                  </div>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--brand)]">
                    {pathway.tag}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.02em]">
                    {pathway.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{pathway.desc}</p>

                  <dl className="mt-6 space-y-2.5 border-t border-[var(--line)] pt-5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[var(--faint)]">Outcome</dt>
                      <dd className="text-right font-medium">{pathway.outcome}</dd>
                    </div>
                    {pathwayCourse && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-[var(--faint)]">Fee</dt>
                        <dd className="font-semibold">
                          {pathwayCourse.currency} {pathwayCourse.price.toLocaleString('en-NG')}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <button
                    type="button"
                    onClick={() => selectPathway(pathway.value)}
                    className="btn btn-primary mt-6 w-full"
                  >
                    Select this pathway
                  </button>
                  <Link
                    href={pathway.url}
                    className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--brand)]"
                  >
                    Course details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* WHY */}
        <section id="why" className="shell">
          <div className="panel grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[18rem] bg-[var(--surface-2)]">
              <Image
                src={courseDetails[0].heroImage}
                alt="Learners working through a RubyTech bootcamp project"
                className="photo h-full min-h-[18rem] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-x-4 gap-y-1.5 rounded-[1rem] bg-[var(--surface)]/95 p-4 text-[11px] text-[var(--muted)] backdrop-blur-sm">
                {includedItems.map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[var(--brand)]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <p className="eyebrow">Why RubyTech</p>
              <h2 className="h2 mt-6 max-w-sm">
                Built for people who want proof, not promises.
              </h2>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {whyPoints.map(([title, description], index) => (
                  <div key={title} className="tile p-5">
                    <span className="index">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-2 text-sm font-semibold">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section id="proof" className="shell section">
          <div className="max-w-xl">
            <p className="eyebrow">From past cohorts</p>
            <h2 className="h2 mt-6">Past cohort members say it better than we can.</h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <figure key={item.name} className="card flex flex-col p-6">
                <div className="flex gap-0.5 text-[var(--brand)]" aria-label="5 out of 5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} aria-hidden="true">★</span>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-5">
                  <Image src={item.image} alt={item.name} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-[11px] text-[var(--faint)]">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* REGISTER */}
        <section id="register" ref={registerRef} className="shell pb-16 lg:pb-20">
          <div className="panel grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[var(--surface-2)] px-6 py-10 sm:px-9">
              <p className="eyebrow">Reserve your seat</p>
              <h2 className="h2 mt-6">Your seat is one form away.</h2>
              <p className="lead mt-4 text-[0.95rem]">
                Fill this in, get your unique registration code, then complete payment to lock in
                your spot.
              </p>

              <ol className="mt-8 space-y-5 border-t border-[var(--line)] pt-7">
                {[
                  ['Submit your details', 'Tell us who you are and which pathway you want.'],
                  ['Receive your code', 'A unique registration code is generated instantly.'],
                  ['Pay and confirm', 'Transfer the cohort fee using the code as your narration.'],
                ].map(([title, description], index) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface)] font-display text-xs font-bold text-[var(--brand)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex items-center gap-2.5 rounded-[1rem] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)]">
                <Check className="h-4 w-4 flex-none text-[var(--brand)]" />
                <span>
                  <span className="font-semibold text-[var(--ink)]">Seats are limited.</span>{' '}
                  Applications are reviewed in the order received.
                </span>
              </div>
            </div>

            <div className="px-6 py-10 sm:px-9">
              {!submitted ? (
                <>
                  <h3 className="h3">Registration form</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Takes less than 2 minutes. You&apos;ll get your payment instructions immediately
                    after.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className="label">Full name</label>
                        <input
                          type="text"
                          id="fullName"
                          value={form.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          placeholder="e.g. Chidinma Okafor"
                          className="field mt-2"
                          required
                        />
                        {errors.fullName && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.fullName}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="label">Email address</label>
                        <input
                          type="email"
                          id="email"
                          value={form.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="you@example.com"
                          className="field mt-2"
                          required
                        />
                        {errors.email && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="label">Phone number</label>
                        <input
                          type="tel"
                          id="phone"
                          value={form.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="080X XXX XXXX"
                          className="field mt-2"
                          required
                        />
                        {errors.phone && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.phone}</p>}
                      </div>
                      <div>
                        <label htmlFor="state" className="label">State (Nigeria)</label>
                        <select
                          id="state"
                          value={form.state}
                          onChange={(e) => updateField('state', e.target.value)}
                          className="field mt-2"
                          required
                        >
                          <option value="" disabled>Select your state</option>
                          {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.state}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pathway" className="label">Pathway selection</label>
                      <select
                        id="pathway"
                        value={form.pathway}
                        onChange={(e) => updateField('pathway', e.target.value)}
                        className="field mt-2"
                        required
                      >
                        <option value="" disabled>Select a pathway</option>
                        {PATHWAYS.map((pathway) => (
                          <option key={pathway.id} value={pathway.value}>
                            {pathway.tag} — {pathway.title.split(' — ')[0]}
                          </option>
                        ))}
                      </select>
                      {errors.pathway && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.pathway}</p>}
                      {selectedCourse && (
                        <div className="mt-3 flex items-center justify-between rounded-[0.9rem] border border-[var(--line)] bg-[var(--brand-soft)] px-4 py-3 text-sm">
                          <span className="text-[var(--muted)]">Fee for this pathway</span>
                          <span className="font-semibold text-[var(--brand)]">{amountLabel}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="expectations" className="label">
                        What do you hope to get out of this bootcamp?
                      </label>
                      <textarea
                        id="expectations"
                        rows={4}
                        value={form.expectations}
                        onChange={(e) => updateField('expectations', e.target.value)}
                        placeholder="Tell us briefly what you're hoping to achieve..."
                        className="field mt-2"
                        required
                      />
                      {errors.expectations && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.expectations}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70" disabled={isSubmitting}>
                      {isSubmitting ? 'Reserving your seat…' : 'Generate my registration code'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="text-center text-xs text-[var(--faint)]">
                      Your details are used only for bootcamp registration and communication.
                      No spam.
                    </p>
                  </form>
                </>
              ) : (
                <RegistrationTicket
                  name={form.fullName}
                  pathway={form.pathway}
                  amountLabel={amountLabel}
                  code={code}
                  copiedCode={copyStatus.code}
                  copiedAll={copyStatus.all}
                  notifyFailed={notifyFailed}
                  onCopy={copyText}
                  onEdit={() => setSubmitted(false)}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
