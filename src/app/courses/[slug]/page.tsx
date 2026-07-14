'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Mail,
  Moon,
  Sun,
  Users,
} from 'lucide-react';
import courseDetails from '@/app/data/courseDetails';
import Image from 'next/image';
import TopNav from '@/components/TopNav';

const BRASS = '#B78A46';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({ code: false, all: false });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notifyFailed, setNotifyFailed] = useState<boolean>(false);
  const enrollRef = useRef<HTMLElement>(null);

  const course = courseDetails.find((c) => c.slug === params.slug);

  useEffect(() => {
    const savedTheme = (window.localStorage.getItem('techwithlumi-theme') as 'dark' | 'light' | null) || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('techwithlumi-theme', theme);
  }, [theme]);

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

  function handleEdit() {
    setSubmitted(false);
  }

  function copyText(text: string, key: keyof CopyStatus) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: false })), 1800);
    });
  }

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: theme === 'dark' ? '#0B0D12' : '#FAF9F6' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#F5F3EE' : '#14171F' }}>
            Course not found
          </h1>
          <a href="/" className="mt-4 inline-block underline" style={{ color: BRASS }}>
            Back to home
          </a>
        </div>
      </main>
    );
  }

  const isDark = theme === 'dark';
  const bg = isDark ? '#0B0D12' : '#FAF9F6';
  const text = isDark ? '#F5F3EE' : '#14171F';
  const muted = isDark ? 'rgba(245,243,238,0.62)' : 'rgba(20,23,31,0.60)';
  const mutedSoft = isDark ? 'rgba(245,243,238,0.42)' : 'rgba(20,23,31,0.42)';
  const line = isDark ? 'rgba(245,243,238,0.10)' : 'rgba(20,23,31,0.10)';
  const cardBg = isDark ? '#15181F' : '#FFFFFF';
  const cardBgSoft = isDark ? '#191C24' : '#F1EFE9';
  const danger = isDark ? '#F5A3A3' : '#C0392B';
  const displayFont = { fontFamily: "'Fraunces', Georgia, serif" };
  const labelFont = { fontFamily: "'IBM Plex Mono', monospace" };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const inputStyle: React.CSSProperties = {
    border: `1px solid ${line}`,
    color: text,
    background: 'transparent',
  };

  return (
    <main className="relative min-h-screen transition-colors duration-500" style={{ background: bg, color: text }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* HEADER */}
      {/* <header
        className="sticky top-0 z-50 flex items-center justify-between border-b px-6 py-5 backdrop-blur-md lg:px-8"
        style={{ borderColor: line, background: isDark ? 'rgba(11,13,18,0.82)' : 'rgba(250,249,246,0.86)' }}
      >
        <a href="/" className="text-xl" style={{ ...displayFont, fontStyle: 'italic', color: text }}>
          RubyTech
        </a>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="rounded-full p-2 transition hover:opacity-70"
          style={{ border: `1px solid ${line}`, color: text }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header> */}
           {/* NAV */}
                 <div className="relative z-10 mx-auto flex  max-w-7xl flex-col px-6 py-6 lg:px-8">

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
      <div className="mx-auto md:max-w-6xl w-full px-4 md:px-6 py-8 lg:px-8 lg:py-12">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: BRASS, ...labelFont }}>
                Bootcamp Course
              </p>
              <h1 className="text-4xl leading-tight sm:text-5xl" style={{ ...displayFont, fontWeight: 500 }}>
                {course.title}
              </h1>
              <p className="text-lg" style={{ color: muted }}>
                {course.subtitle}
              </p>
              <p className="text-base leading-7" style={{ color: muted }}>
                {course.description}
              </p>
            </div>

            {/* KEY STATS */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg p-4" style={{ background: cardBgSoft, border: `1px solid ${line}` }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: mutedSoft, ...labelFont }}>
                  Duration
                </p>
                <p className="mt-2 text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: BRASS }} />
                  {course.duration}
                </p>
              </div>
              <div className="rounded-lg p-4" style={{ background: cardBgSoft, border: `1px solid ${line}` }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: mutedSoft, ...labelFont }}>
                  Students
                </p>
                <p className="mt-2 text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: BRASS }} />
                  500+
                </p>
              </div>
              <div className="rounded-lg p-4" style={{ background: cardBgSoft, border: `1px solid ${line}` }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: mutedSoft, ...labelFont }}>
                  Level
                </p>
                <p className="mt-2 text-sm font-semibold">{course.level}</p>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#enroll"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition hover:opacity-90"
                style={{ background: text, color: bg }}
              >
                Enroll Now
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-sm font-semibold underline-offset-4 transition hover:underline"
                style={{ color: text }}
              >
                Learn More
              </a>
            </div>
          </div>

          {/* HERO IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl"
            style={{ border: `1px solid ${line}` }}
          >
            <Image
              src={course.heroImage}
              alt={course.title}
              className="h-96 w-full object-fit"
            />
          </motion.div>
        </motion.section>


        {/* LEARNING OUTCOMES */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-8 text-3xl font-semibold" style={{ ...displayFont, fontWeight: 500 }}>
            What You'll Learn
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {course.learningOutcomes.map((outcome, i) => (
              <div key={i} className="flex gap-4 rounded-lg p-4" style={{ background: cardBgSoft, border: `1px solid ${line}` }}>
                <Check className="mt-1 h-5 w-5 flex-shrink-0" style={{ color: BRASS }} />
                <p className="text-sm">{outcome}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* KEY SELLING POINTS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-8 text-3xl font-semibold" style={{ ...displayFont, fontWeight: 500 }}>
            Why Choose This Course?
          </h2>
          <div className="grid gap-6 lg:grid-cols-4">
            {course.keySellingPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4 rounded-xl p-6"
                  style={{ background: cardBgSoft, border: `1px solid ${line}` }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ background: isDark ? 'rgba(183,138,70,0.1)' : 'rgba(183,138,70,0.15)' }}
                  >
                    <Icon className="h-6 w-6" style={{ color: BRASS }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{point.title}</h3>
                    <p className="mt-2 text-sm" style={{ color: muted }}>
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* PROJECTS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-8 text-3xl font-semibold" style={{ ...displayFont, fontWeight: 500 }}>
            Projects You'll Build
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {course.projects.map((project, i) => (
              <div key={i} className="space-y-4 rounded-xl p-6" style={{ background: cardBgSoft, border: `1px solid ${line}` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: BRASS, ...labelFont }}>
                      {project.technologies}
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium" style={{ background: isDark ? 'rgba(183,138,70,0.15)' : 'rgba(183,138,70,0.2)', color: BRASS }}>
                    {project.duration}
                  </span>
                </div>
                <p className="text-sm" style={{ color: muted }}>
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CURRICULUM */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-8 text-3xl font-semibold" style={{ ...displayFont, fontWeight: 500 }}>
            Course Curriculum
          </h2>
          <div className="space-y-3">
            {course.curriculum.map((module, i) => (
              <div key={i} className="rounded-lg p-6" style={{ background: cardBgSoft, border: `1px solid ${line}` }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: BRASS, ...labelFont }}>
                      {module.week}
                    </p>
                    <h3 className="mt-2 font-semibold">{module.title}</h3>
                    <p className="mt-2 text-sm" style={{ color: muted }}>
                      {module.topics.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
        {/* PRICING — boarding pass variation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-16 overflow-hidden rounded-2xl"
          style={{ border: `1px solid ${line}` }}
        >
          <div className="flex flex-col sm:flex-row">
            {/* MAIN FARE PANEL */}
            <div className="flex-1 p-8 sm:p-10" style={{ background: cardBg }}>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em]" style={{ color: mutedSoft, ...labelFont }}>
                  Cohort Fare
                </p>
               
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-5xl font-bold" style={displayFont}>
                  {course.currency} {course.price.toLocaleString('en-NG')}
                </span>
              </div>
              <p className="mt-2 text-sm" style={{ color: mutedSoft }}>
                <span className="line-through">{course.currency} {course.originalPrice.toLocaleString('en-NG')}</span>
                {' '}regular fare
              </p>

              <div className="mt-8 space-y-2.5 border-t pt-6" style={{ borderColor: line }}>
                
              </div>
            </div>

            {/* PERFORATION */}
            <div className="relative hidden w-0 sm:block">
              <div className="absolute inset-y-6 left-0 border-l border-dashed" style={{ borderColor: isDark ? 'rgba(11,13,18,0.35)' : 'rgba(255,255,255,0.5)' }} />
              <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full" style={{ background: bg }} />
              <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full" style={{ background: bg }} />
            </div>
            <div className="block h-0 border-t border-dashed sm:hidden" style={{ borderColor: isDark ? 'rgba(11,13,18,0.35)' : 'rgba(255,255,255,0.5)' }} />

            {/* DISCOUNT STUB */}
            <div
              className="flex flex-col items-center justify-center gap-1 p-8 text-center sm:w-56 sm:p-10"
              style={{ background: BRASS, color: bg }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={labelFont}>
                Fare Class
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide" style={labelFont}>
                Early Bird
              </span>
              <span className="mt-4 text-5xl font-bold leading-none" style={displayFont}>
                {course.discount}%
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em]" style={labelFont}>
                Off this cohort
              </span>
              <div
                className="mt-6 h-6 w-full"
                style={{
                  background: 'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px)',
                  opacity: 0.55,
                }}
              />
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="mb-8 text-3xl font-semibold" style={{ ...displayFont, fontWeight: 500 }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {course.faq.map((item, i) => (
              <div key={i} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${line}` }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full px-6 py-4 text-left font-semibold transition hover:opacity-70 flex items-center justify-between"
                  style={{ background: cardBgSoft }}
                >
                  {item.question}
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedFAQ === i ? 'rotate-180' : ''}`}
                    style={{ color: BRASS }}
                  />
                </button>
                {expandedFAQ === i && (
                  <div className="border-t px-6 py-4" style={{ borderColor: line, color: muted }}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ENROLL / REGISTRATION SECTION */}
      <motion.section
          id="enroll"
          ref={enrollRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-3xl p-0 sm:p-12 lg:p-16 border-0 lg:border"
          style={{
            background: cardBgSoft,
            borderColor: line,
          }}>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="p-8 space-y-6">
              <h2 className="text-3xl font-semibold sm:text-4xl" style={{ ...displayFont, fontWeight: 500 }}>
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg" style={{ color: muted }}>
                Join {course.title} and gain industry-ready skills in just {course.duration.toLowerCase()}. Limited seats available for this cohort.
              </p>
              <div className="space-y-3 pt-4">
                {course.keyFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-3">
                    <Check className="h-5 w-5 flex-shrink-0" style={{ color: BRASS }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-4 text-sm"
                style={{ background: isDark ? 'rgba(183,138,70,0.1)' : 'rgba(183,138,70,0.15)', color: text }}
              >
                🔥 <span style={{ fontWeight: 600 }}>Early cohort seats are limited.</span> Only a successful payment Counts as a seat reservation
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl p-7" style={{ background: cardBg, border: `1px solid ${line}` }}>
                <div>
                  <h3 className="text-lg font-semibold" style={{ ...displayFont }}>Registration form</h3>
                  <p className="mt-1 text-xs" style={{ color: mutedSoft }}>
                    Takes less than 2 minutes. You'll get your payment instructions immediately after.
                  </p>
                </div>

                <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted, ...labelFont }}>
                  Full Name
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g. Chidinma Okafor"
                    className="mt-2.5 w-full rounded-lg px-3.5 py-3 text-sm outline-none transition"
                    style={inputStyle}
                    required
                  />
                  {errors.fullName && <span className="mt-1 block text-xs" style={{ color: danger, ...labelFont }}>{errors.fullName}</span>}
                </label>

                <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted, ...labelFont }}>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="hello@example.com"
                    className="mt-2.5 w-full rounded-lg px-3.5 py-3 text-sm outline-none transition"
                    style={inputStyle}
                    required
                  />
                  {errors.email && <span className="mt-1 block text-xs" style={{ color: danger, ...labelFont }}>{errors.email}</span>}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted, ...labelFont }}>
                    Phone Number
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="080X XXX XXXX"
                      className="mt-2.5 w-full rounded-lg px-3.5 py-3 text-sm outline-none transition"
                      style={inputStyle}
                      required
                    />
                    {errors.phone && <span className="mt-1 block text-xs" style={{ color: danger, ...labelFont }}>{errors.phone}</span>}
                  </label>

                  <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted, ...labelFont }}>
                    State (Nigeria)
                    <select
                      value={form.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="mt-2.5 w-full rounded-lg px-3.5 py-3 text-sm outline-none transition"
                      style={inputStyle}
                      required
                    >
                      <option value="" disabled>Select your state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s} style={{ color: '#14171F' }}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <span className="mt-1 block text-xs" style={{ color: danger, ...labelFont }}>{errors.state}</span>}
                  </label>
                </div>

                <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted, ...labelFont }}>
                  What do you hope to get out of this bootcamp?
                  <textarea
                    rows={3}
                    value={form.expectations}
                    onChange={(e) => updateField('expectations', e.target.value)}
                    placeholder="Tell us briefly what you're hoping to achieve..."
                    className="mt-2.5 w-full rounded-lg px-3.5 py-3 text-sm outline-none transition"
                    style={inputStyle}
                    required
                  />
                  {errors.expectations && <span className="mt-1 block text-xs" style={{ color: danger, ...labelFont }}>{errors.expectations}</span>}
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ background: text, color: bg }}
                >
                  {isSubmitting ? 'Reserving your seat…' : 'Generate My Registration Code'}
                  <Mail className="h-4 w-4" />
                </button>
                <p className="text-center text-xs" style={{ color: mutedSoft }}>
                  Your details are used only for bootcamp registration and communication. No spam.
                </p>
              </form>
            ) : (
              <div className="rounded-2xl  overflow-hidden" style={{ background: cardBg, border: `1px solid ${line}` }}>
                <div
                  className="flex flex-wrap bg-red-100 items-center justify-between gap-3 px-7 py-5"
                  style={{ background: isDark ? 'rgba(183,138,70,0.14)' : 'rgba(183,138,70,0.18)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: BRASS, color: bg }}
                    >
                      ✓
                    </div>
                    <h3 className="text-base font-semibold">Seat reserved — complete payment to confirm</h3>
                  </div>
                  <span className="text-xs" style={{ color: BRASS, ...labelFont }}>{course.title}</span>
                </div>

                <div className="space-y-1 px-7 py-6 ">
                  <div className="flex md:flex-row flex-col justify-between border-b py-3 text-sm" style={{ borderColor: line }}>
                    <span style={{ color: muted }}>Registered name</span>
                    <span className="font-semibold">{form.fullName}</span>
                  </div>
                  <div className="flex md:flex-row flex-col justify-between border-b py-3 text-sm" style={{ borderColor: line }}>
                    <span style={{ color: muted }}>Pathway</span>
                    <span className="font-semibold">{course.title}</span>
                  </div>
                  <div className="flex md:flex-row flex-col justify-between border-b py-3 text-sm" style={{ borderColor: line }}>
                    <span style={{ color: muted }}>Bank name</span>
                    <span className="font-semibold" style={labelFont}>Moniepoint</span>
                  </div>
                  <div className="flex md:flex-row flex-col justify-between border-b py-3 text-sm" style={{ borderColor: line }}>
                    <span style={{ color: muted }}>Account number</span>
                    <span className="font-semibold" style={labelFont}>6817531903</span>
                  </div>
                  <div className="flex md:flex-row flex-col justify-between border-b py-3 text-sm" style={{ borderColor: line }}>
                    <span style={{ color: muted }}>Account name</span>
                    <span className="font-semibold" style={labelFont}>Rubytech Consult</span>
                  </div>
                  <div className="flex md:flex-row flex-col justify-between py-3 text-sm">
                    <span style={{ color: muted }}>Amount to pay</span>
                    <span className="text-base font-bold" style={{ color: BRASS, ...labelFont }}>
                      {course.currency} {course.price.toLocaleString('en-NG')}
                    </span>
                  </div>

                  <div
                    className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg p-4"
                    style={{ background: isDark ? 'rgba(183,138,70,0.12)' : 'rgba(183,138,70,0.16)', border: `1px dashed ${BRASS}` }}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wide" style={{ color: BRASS, ...labelFont }}>
                        Use this code as your payment narration
                      </p>
                      <p className="mt-1 text-xl font-bold tracking-wide" style={labelFont}>{code}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(code, 'code')}
                      className="rounded-lg px-3.5 py-2 text-xs font-semibold transition hover:opacity-80"
                      style={{ border: `1px solid ${line}`, color: text }}
                    >
                      {copyStatus.code ? 'Copied!' : 'Copy code'}
                    </button>
                  </div>

                  <p className="mt-4 rounded-lg p-3.5 text-xs leading-5" style={{ background: cardBgSoft, color: muted }}>
                    <span style={{ color: text, fontWeight: 600 }}>Important:</span> when making your transfer, enter the code above in the narration/description field — this is how we match your payment to your registration. Keep a screenshot of your payment and this code.
                  </p>

                  {notifyFailed && (
                    <p
                      className="mt-3 rounded-lg p-3.5 text-xs leading-5"
                      style={{ background: isDark ? 'rgba(183,138,70,0.12)' : 'rgba(183,138,70,0.16)', border: `1px solid ${BRASS}`, color: text }}
                    >
                      <span style={{ fontWeight: 600 }}>Heads up:</span> we couldn't automatically notify our team about your registration. Your details and code are still valid — please also send a screenshot of this page to be safe.
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `Bank: Moniepoint\nAccount Number: 6817531903\nAccount Name: Rubytech Consult\nAmount to Pay: ${course.currency} ${course.price.toLocaleString('en-NG')}\nNarration/Description: ${code}`,
                          'all'
                        )
                      }
                      className="rounded-lg px-4 py-2.5 text-xs font-semibold transition hover:opacity-80"
                      style={{ border: `1px solid ${line}`, color: text }}
                    >
                      {copyStatus.all ? 'Copied!' : 'Copy account details'}
                    </button>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="rounded-lg px-4 py-2.5 text-xs font-semibold transition hover:opacity-80"
                      style={{ color: mutedSoft }}
                    >
                      Edit my details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* FOOTER */}
      <footer
        className="border-t py-8 px-6 lg:px-8"
        style={{ borderColor: line, color: mutedSoft }}
      >
        <div className="mx-auto max-w-6xl text-center text-sm">
          <p>© 2026 RubyTech. All courses designed for ambitious builders.</p>
        </div>
      </footer>
    </main>
  );
}
