'use client';

import { type SyntheticEvent, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clock, Mail, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import courseDetails from '@/app/data/courseDetails';
import TopNav from '@/components/TopNav';
import SiteFooter from '@/components/SiteFooter';
import RegistrationTicket from '@/components/RegistrationTicket';

interface CoursePageProps {
  params: { slug: string };
}

// ─── Shared with /bootcamp — keep these two in sync if either changes ───
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT Abuja',
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
  expectations: '',
};
// ─────────────────────────────────────────────────────────────────────

export default function CoursePage({ params }: CoursePageProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({ code: false, all: false });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notifyFailed, setNotifyFailed] = useState<boolean>(false);

  const course = courseDetails.find((c) => c.slug === params.slug);

  if (!course) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <main className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <p className="badge">404</p>
          <h1 className="h2 mt-5">Course not found</h1>
          <p className="lead mt-3 max-w-sm text-base">
            That pathway may have been renamed or retired. Browse the current bootcamp instead.
          </p>
          <Link href="/bootcamp" className="btn btn-primary mt-7">
            See the bootcamp
            <ArrowRight className="h-4 w-4" />
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  function updateField<K extends keyof RegistrationForm>(field: K, value: RegistrationForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(data: RegistrationForm): boolean {
    const next: FormErrors = {};
    if (!data.fullName || data.fullName.trim().length < 3) next.fullName = 'Enter your full name.';
    if (!EMAIL_RE.test(data.email)) next.email = 'Enter a valid email address.';
    if (!PHONE_RE.test(data.phone.replace(/\s+/g, ''))) next.phone = 'Enter a valid Nigerian phone number.';
    if (!data.state) next.state = 'Select your state.';
    if (!data.expectations || data.expectations.trim().length < 5) next.expectations = 'Tell us briefly what you expect.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate(form)) return;

    const newCode = generateRegistrationCode();
    const submission = {
      ...form,
      pathway: course?.title ?? params.slug,
      code: newCode,
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
  };

  function copyText(text: string, key: keyof CopyStatus) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: false })), 1800);
    });
  }

  const amountLabel = `${course.currency} ${course.price.toLocaleString('en-NG')}`;

  return (
    <div className="min-h-screen">
      <TopNav />

      <main>
        {/* HERO */}
        <section className="shell pt-6 sm:pt-8">
          <div className="panel overflow-hidden">
            <nav className="flex items-center gap-2 px-6 py-5 text-xs text-[var(--faint)] sm:px-9" aria-label="Breadcrumb">
              <Link href="/bootcamp" className="transition-colors hover:text-[var(--brand)]">
                Bootcamp
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--muted)]">{course.title}</span>
            </nav>

            <div className="grid gap-12 px-6 pb-10 sm:px-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:pb-12">
              <div>
                <p className="badge">Bootcamp course</p>
                <h1 className="display mt-5 max-w-2xl text-[clamp(2.15rem,4.2vw,3.4rem)]">
                  {course.title}
                </h1>
                <p className="mt-4 text-lg font-medium text-[var(--brand)]">{course.subtitle}</p>
                <p className="lead mt-4 max-w-xl">{course.description}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#enroll" className="btn btn-primary">
                    Enroll now
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#curriculum" className="btn btn-outline">
                    See the curriculum
                  </a>
                </div>

                <dl className="mt-10 grid gap-6 border-t border-[var(--line)] pt-7 sm:grid-cols-3">
                  <div>
                    <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
                      <Clock className="h-3.5 w-3.5" /> Duration
                    </dt>
                    <dd className="mt-2 font-display text-lg font-semibold">{course.duration}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
                      <Users className="h-3.5 w-3.5" /> Cohort
                    </dt>
                    <dd className="mt-2 font-display text-lg font-semibold">500+ trained</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--faint)]">
                      Level
                    </dt>
                    <dd className="mt-2 font-display text-lg font-semibold">{course.level}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <div className="overflow-hidden rounded-[1.25rem] border border-[var(--line)]">
                  <Image
                    src={course.heroImage}
                    alt={course.title}
                    priority
                    className="photo h-[19rem] w-full object-cover lg:h-[23rem]"
                  />
                </div>

                <div className="card mt-5 overflow-hidden">
                  <div className="band flex items-end justify-between gap-4 rounded-none px-6 py-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        Cohort fee
                      </p>
                      <p className="mt-1.5 font-display text-2xl font-bold text-white">{amountLabel}</p>
                    </div>
                    <span className="rounded-[0.3rem] bg-[#9dc0ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0a1c36]">
                      {course.discount}% off
                    </span>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-sm text-[var(--muted)]">
                      Regular fare{' '}
                      <span className="line-through">
                        {course.currency} {course.originalPrice.toLocaleString('en-NG')}
                      </span>{' '}
                      — one payment covers all eight weeks.
                    </p>
                    <a href="#enroll" className="btn btn-primary mt-4 w-full">
                      Reserve this seat
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <p className="mt-3 text-center text-[11px] text-[var(--faint)]">
                      Only a successful payment confirms a seat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="section">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">What you&apos;ll learn</p>
              <h2 className="h2 mt-5">Outcomes you can take to an interview.</h2>
              <p className="lead mt-4 text-base">
                Each module ends in something built, reviewed and ready to show.
              </p>
            </div>

            <div className="grid border-t border-[var(--line)] sm:grid-cols-2">
              {course.learningOutcomes.map((outcome: string, index: number) => (
                <div
                  key={index}
                  className={`flex gap-3 border-b border-[var(--line)] py-5 pr-6 text-sm leading-6 ${
                    index % 2 === 1 ? 'sm:pl-6' : ''
                  }`}
                >
                  <span className="tick">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {outcome}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SELLING POINTS */}
        <section className="shell">
          <div className="panel px-6 py-10 sm:px-10 sm:py-12">
            <div className="max-w-xl">
              <p className="eyebrow">Why this course</p>
              <h2 className="h2 mt-5">What makes this cohort different.</h2>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {course.keySellingPoints.map((point: any, index: number) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="card p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[0.4rem] bg-[var(--brand-soft)] text-[var(--brand)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold">{point.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="section">
          <div className="shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Portfolio work</p>
                <h2 className="h2 mt-5">Projects you&apos;ll build.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
                Every project is scoped like real client work, reviewed by your instructor and added
                to your portfolio.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[var(--line)] lg:grid-cols-2">
              {course.projects.map((project: any, index: number) => (
                <article key={index} className="flex flex-col bg-[var(--surface)] p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{project.name}</h3>
                    <span className="rounded-full border border-[var(--line-strong)] px-2.5 py-1 text-[11px] text-[var(--muted)]">
                      {project.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--brand)]">
                    {project.technologies}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{project.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CURRICULUM */}
        <section id="curriculum" className="shell">
          <div className="panel px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Curriculum</p>
                <h2 className="h2 mt-5">Eight weeks, mapped out.</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">
                {course.pace}
              </p>
            </div>

            <div className="mt-12 border-t border-[var(--line)]">
              {course.curriculum.map((module: any, index: number) => (
                <div
                  key={index}
                  className="grid gap-2 border-b border-[var(--line)] py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                    {module.week}
                  </p>
                  <div>
                    <h3 className="text-base font-semibold">{module.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {module.topics.join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="shell py-16 lg:py-20">
          <div className="band grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div>
              <p className="eyebrow eyebrow-invert">Cohort fee</p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <span className="font-display text-4xl font-bold text-white sm:text-5xl">{amountLabel}</span>
                <span className="text-sm text-white/50">
                  <span className="line-through">
                    {course.currency} {course.originalPrice.toLocaleString('en-NG')}
                  </span>{' '}
                  regular fare
                </span>
              </div>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">
                One payment covers the full eight weeks: live classes, project reviews, mentorship
                and your certificate.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#enroll" className="btn btn-invert">
                  Reserve this seat
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/bootcamp" className="btn btn-on-navy">
                  Compare all pathways
                </Link>
              </div>
            </div>

            <div className="rounded-[1.1rem] border border-white/15 bg-white/[0.06] p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Early bird
              </p>
              <p className="mt-2 font-display text-6xl font-bold leading-none text-white">
                {course.discount}%
              </p>
              <p className="mt-2 text-sm font-medium text-[#9dc0ff]">off this cohort</p>
              <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-sm text-white/65">
                {course.paymentOptions.map((option: string) => (
                  <li key={option} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#9dc0ff]" />
                    {option}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#9dc0ff]" />
                  Lifetime access to materials
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="h2 mt-5">Questions we get a lot.</h2>
            </div>

            <div className="border-t border-[var(--line)]">
              {course.faq.map((item: any, index: number) => (
                <div key={index} className="border-b border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    aria-expanded={expandedFAQ === index}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-sm font-semibold transition-colors hover:text-[var(--brand)]"
                  >
                    {item.question}
                    <ChevronDown
                      className={`h-4 w-4 flex-none text-[var(--brand)] transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === index && (
                    <p className="pb-5 text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ENROLL */}
        <section id="enroll" className="shell pb-16 lg:pb-20">
          <div className="panel grid gap-12 px-6 py-10 sm:px-9 sm:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="eyebrow">Enrolment</p>
              <h2 className="h2 mt-5">Ready to change what you&apos;re hired for?</h2>
              <p className="lead mt-4">
                Join {course.title} and gain industry-ready skills in {course.duration.toLowerCase()}.
                Limited seats available for this cohort.
              </p>

              <ul className="mt-8 grid gap-3 border-t border-[var(--line)] pt-7">
                {course.keyFeatures.map((feature: string, index: number) => (
                  <li key={index} className="flex gap-3 text-sm leading-6">
                    <span className="tick">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[0.5rem] border border-[var(--line)] bg-[var(--brand-soft)] p-4 text-sm leading-6">
                <span className="font-semibold">Early cohort seats are limited.</span>{' '}
                <span className="text-[var(--muted)]">
                  Only a successful payment counts as a seat reservation.
                </span>
              </div>
            </div>

            {!submitted ? (
              <div className="card p-7 sm:p-9">
                <h3 className="h3">Registration form</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Takes less than 2 minutes. You&apos;ll get your payment instructions immediately
                  after.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                  <div>
                    <label htmlFor="fullName" className="label">Full name</label>
                    <input
                      id="fullName"
                      type="text"
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
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="hello@example.com"
                      className="field mt-2"
                      required
                    />
                    {errors.email && <p className="mt-1.5 text-xs" style={{ color: 'var(--danger)' }}>{errors.email}</p>}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="label">Phone number</label>
                      <input
                        id="phone"
                        type="tel"
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

                  <div className="flex items-center justify-between rounded-[0.5rem] border border-[var(--line)] bg-[var(--brand-soft)] px-4 py-3 text-sm">
                    <span className="text-[var(--muted)]">Fee for this course</span>
                    <span className="font-semibold text-[var(--brand)]">{amountLabel}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Reserving your seat…' : 'Generate my registration code'}
                    <Mail className="h-4 w-4" />
                  </button>
                  <p className="text-center text-xs text-[var(--faint)]">
                    Your details are used only for bootcamp registration and communication. No spam.
                  </p>
                </form>
              </div>
            ) : (
              <RegistrationTicket
                name={form.fullName}
                pathway={course.title}
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
