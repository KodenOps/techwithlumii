'use client';

import { type SyntheticEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  DollarSign,
  Mail,
  Moon,
  Sun,
  Users,
  X,
} from 'lucide-react';
import courseDetails from '@/app/data/courseDetails';
import Image from 'next/image';

const BRASS = '#B78A46';

interface CoursePageProps {
  params: { slug: string };
}

export default function CoursePage({ params }: CoursePageProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

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

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('loading');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course: course?.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your message right now.');
      }

      setSubmitState('success');
      setSubmitMessage('Thanks! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitState('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Unable to send your message right now.');
    }
  };

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
  const displayFont = { fontFamily: "'Fraunces', Georgia, serif" };
  const labelFont = { fontFamily: "'IBM Plex Mono', monospace" };

  return (
    <main className="relative min-h-screen transition-colors duration-500" style={{ background: bg, color: text }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* HEADER */}
      <header
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
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
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

        {/* PRICING */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl p-8 sm:p-12"
          style={{ background: cardBgSoft, border: `1px solid ${line}` }}
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-wide" style={{ color: mutedSoft, ...labelFont }}>
                Original Price
              </p>
              <p className="mt-2 text-3xl line-through" style={{ color: mutedSoft }}>
                NGN {course.originalPrice.toLocaleString('en-NG')}
              </p>
              
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide" style={{ color: BRASS, ...labelFont }}>
                You Save
              </p>
              <p className="mt-2 text-3xl font-bold" style={{ color: BRASS }}>
                {course.discount}%
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide" style={{ color: mutedSoft, ...labelFont }}>
                Today's Price
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold"> NGN {course.price.toLocaleString('en-NG')}</span>
                <span style={{ color: mutedSoft }}>{course.currency}</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm" style={{ color: muted }}>
            {course.paymentOptions.join(' • ')}
          </p>
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

        {/* ENROLL SECTION */}
        <motion.section
          id="enroll"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-3xl p-8 sm:p-12 lg:p-16"
          style={{ background: cardBgSoft, border: `1px solid ${line}` }}
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl p-7" style={{ background: cardBg, border: `1px solid ${line}` }}>
              <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted }}>
                Full Name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((curr) => ({ ...curr, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm outline-none transition"
                  style={{ border: `1px solid ${line}`, color: text }}
                  required
                />
              </label>
              <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted }}>
                Email
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((curr) => ({ ...curr, email: e.target.value }))}
                  placeholder="hello@example.com"
                  className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm outline-none transition"
                  style={{ border: `1px solid ${line}`, color: text }}
                  required
                />
              </label>
              <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: muted }}>
                Message
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData((curr) => ({ ...curr, message: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm outline-none transition"
                  style={{ border: `1px solid ${line}`, color: text }}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: text, color: bg }}
              >
                {submitState === 'loading' ? 'Sending...' : 'Enroll Now'}
                <Mail className="h-4 w-4" />
              </button>
              {submitMessage && (
                <p className="text-sm" style={{ color: submitState === 'error' ? '#F5A3A3' : '#CDECCB' }}>
                  {submitMessage}
                </p>
              )}
            </form>
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
