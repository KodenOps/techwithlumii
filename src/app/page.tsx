'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import statss from '@/app/data/stats';
import services from '@/app/data/services';
import coursePreviews from '@/app/data/coursePreviews';
import testimonials from '@/app/data/testimonials';
import TrustedByStrip from '@/components/TrustedByStrip';
import TopNav from '@/components/TopNav';
import SiteFooter from '@/components/SiteFooter';
import cover2 from '@/assets/cover2.png';
import image1 from '@/assets/image1.png';

const aboutPoints = [
  ['Built for ambition', 'Tailored pathways for individuals and teams who want to move quickly.'],
  ['Outcome oriented', 'Practical coaching that keeps progress visible and measurable.'],
  ['Always current', 'Training shaped around the tools teams actually use today.'],
  ['Community powered', 'Support that stays with you long after the cohort ends.'],
];

const contactReasons = [
  'Website Development',
  'Corporate Training',
  'Tech Bootcamp',
  'Outsourcing',
  'IT Consulting',
  'Technical Support',
  'Partnership',
  'General Inquiry',
];

function CountUp({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        let start: number | null = null;
        const duration = 1200;

        const step = (timestamp: number) => {
          if (start === null) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);
          if (progress < 1) frame = window.requestAnimationFrame(step);
        };

        frame = window.requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', reason: '', message: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState('loading');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send your message right now.');
      }

      setSubmitState('success');
      setSubmitMessage('Thanks — your message is on its way. We reply within one business day.');
      setFormData({ name: '', email: '', reason: '', message: '' });
    } catch (error) {
      setSubmitState('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Unable to send your message right now.');
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />

      <main className="pt-6 sm:pt-8">
        {/* HERO — one framed sheet */}
        <section className="shell">
          <div className="panel overflow-hidden">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
              <div className="px-6 pb-10 pt-9 sm:px-10 sm:pt-12 lg:pb-12">
                <p className="eyebrow">Training · Consulting · Outsourcing</p>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="display mt-7 max-w-xl"
                >
                  Technology that
                  <br />
                  pays you <span className="text-[var(--brand)]">back.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="lead mt-6 max-w-lg"
                >
                  RubyTech trains individuals and teams, builds the systems they work in, and
                  delivers the projects that matter — with senior attention from start to finish.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16 }}
                  className="mt-9 flex flex-wrap items-center gap-3"
                >
                  <Link href="/bootcamp#register" className="btn btn-primary">
                    Reserve a seat
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="#services" className="btn btn-outline">
                    Explore our services
                  </a>
                </motion.div>

                <div className="mt-10 grid gap-px overflow-hidden rounded-[1.15rem] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
                  {[
                    ['Industry-led', 'Practitioners teaching'],
                    ['8 weeks', 'Per cohort'],
                    ['Lagos', 'Working worldwide'],
                  ].map(([value, label]) => (
                    <div key={value} className="bg-[var(--surface)] px-4 py-4">
                      <p className="font-display text-sm font-bold tracking-[-0.02em]">{value}</p>
                      <p className="mt-1 text-[11px] text-[var(--faint)]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative bg-[var(--surface-2)] p-5 sm:p-7 lg:p-8">
                <div className="relative overflow-hidden rounded-[1.25rem] border border-[var(--line)]">
                  <Image
                    src={cover2}
                    alt="Students collaborating during a RubyTech bootcamp session"
                    priority
                    className="photo h-[20rem] w-full object-cover sm:h-[24rem] lg:h-[26rem]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0a1830]">
                    Cohort 2026 · open
                  </span>
                </div>

                <div className="relative z-10 -mt-12 ml-2 mr-6 rounded-[1.15rem] bg-[var(--navy)] p-5 shadow-lg sm:-mt-14 sm:ml-4 sm:mr-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c7d6ff]">
                    Next intake
                  </p>
                  <p className="mt-1.5 font-display text-base font-semibold leading-snug text-white">
                    Breaking Into Tech Bootcamp
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    Web, DevOps and data — eight weeks, live mentorship.
                  </p>
                  <Link
                    href="/bootcamp"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#c7d6ff] hover:text-white"
                  >
                    View the programme
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NUMBERS — four tiles, no band */}
        <section aria-label="RubyTech in numbers" className="shell pt-4 sm:pt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statss.map((stat) => (
              <div key={stat.label} className="panel-flat px-6 py-6">
                <p className="font-display text-[2rem] font-bold leading-none tracking-[-0.04em]">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--faint)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4 sm:pt-5">
          <TrustedByStrip />
        </div>

        {/* SERVICES — cards, two per row */}
        <section id="services" className="shell section">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className="h2 mt-6 max-w-xl">Six disciplines. One standard of delivery.</h2>
            </div>
            <p className="lead max-w-sm text-[0.95rem]">
              Clear scope, senior attention and work you can point to. Pick the engagement that
              fits where you are today.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.title} className="card card-hover flex flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="index rounded-full bg-[var(--brand-soft)] px-2.5 py-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--faint)]" />
                </div>
                <h3 className="h3 mt-5">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                  {service.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-5">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] text-[var(--muted)]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ABOUT — split sheet */}
        <section id="about" className="shell">
          <div className="panel grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-[20rem] bg-[var(--surface-2)]">
              <Image
                src={image1}
                alt="The RubyTech team working together"
                className="photo h-full min-h-[20rem] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-[1rem] bg-[var(--navy)]/95 p-5 backdrop-blur-sm">
                <p className="font-display text-3xl font-bold leading-none text-white">
                  1.4k<span className="text-[#9cb4ff]">+</span>
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/60">
                  learners trained across Nigeria
                </p>
              </div>
            </div>

            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <p className="eyebrow">About RubyTech</p>
              <h2 className="h2 mt-6 max-w-xl">
                An agency built on one idea: capability should pay off.
              </h2>
              <p className="lead mt-5 max-w-xl text-[0.95rem]">
                Our instructors and consultants are passionate about helping people and teams
                succeed in a fast-moving industry. Every service — from bootcamps to workshops to
                consulting — is designed to produce practical skills and real-world results.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {aboutPoints.map(([title, description]) => (
                  <div key={title} className="tile p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <span className="tick">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAMMES */}
        <section id="courses" className="shell section">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Bootcamp V2</p>
              <h2 className="h2 mt-6 max-w-xl">
                Three pathways. Eight weeks. A portfolio that works.
              </h2>
            </div>
            <Link href="/bootcamp" className="btn btn-outline self-start">
              Compare pathways
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {coursePreviews.map((course) => (
              <Link
                key={course.title}
                href={course.url}
                className="card card-hover group flex flex-col overflow-hidden"
              >
                <div className="relative overflow-hidden p-3">
                  <Image
                    src={course.image}
                    alt=""
                    className="photo h-40 w-full rounded-[0.9rem] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <span className="absolute left-6 top-6 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0a1830]">
                    {course.duration}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-3">
                  <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em]">
                    {course.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                    {course.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
                    <span className="text-[11px] font-medium text-[var(--faint)]">
                      {course.outcome}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand)]">
                      View
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="shell">
          <div className="band px-6 py-10 sm:px-10 sm:py-12">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="eyebrow eyebrow-invert">Client &amp; learner voices</p>
                <h2 className="h2 mt-6 text-white">The work speaks for itself.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/60">
                Feedback from the people who sat in the room, shipped the projects and went on to
                earn from what they learned.
              </p>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-2">
              {testimonials.map((item) => (
                <figure
                  key={item.name}
                  className="flex flex-col justify-between rounded-[1.15rem] border border-white/10 bg-white/[0.05] p-6"
                >
                  <blockquote className="text-[0.95rem] leading-7 text-white/85">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] text-white/45">{item.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="shell section">
          <div className="panel grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
            <form onSubmit={handleSubmit} className="order-2 p-6 sm:p-10 lg:order-1">
              <h2 className="h3">Tell us what you&apos;re building.</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                One form, a real reply from a person — usually within a business day.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="label">Full name</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Jane Doe"
                    className="field mt-2"
                    required
                  />
                </label>
                <label className="block">
                  <span className="label">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    placeholder="hello@company.com"
                    className="field mt-2"
                    required
                  />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="label">Reason for contact</span>
                <select
                  value={formData.reason}
                  onChange={(event) => setFormData((current) => ({ ...current, reason: event.target.value }))}
                  className="field mt-2"
                  required
                >
                  <option value="" disabled>Select a reason</option>
                  {contactReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block">
                <span className="label">What are you looking for?</span>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Bootcamp, corporate training, project support..."
                  className="field mt-2"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitState === 'loading' ? 'Sending…' : 'Send inquiry'}
                <Mail className="h-4 w-4" />
              </button>

              {submitMessage ? (
                <p
                  className="mt-4 text-sm"
                  style={{ color: submitState === 'error' ? 'var(--danger)' : 'var(--muted)' }}
                >
                  {submitMessage}
                </p>
              ) : null}
            </form>

            <div className="band order-1 flex flex-col justify-between rounded-none p-6 sm:p-10 lg:order-2">
              <div>
                <p className="eyebrow eyebrow-invert">Contact</p>
                <h2 className="h2 mt-6 max-w-sm text-white">
                  We&apos;ll tell you how we can help.
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
                  Training for a team, a system that needs building, or a career that needs a
                  runway — start the conversation here.
                </p>
              </div>

              <dl className="mt-10 space-y-5 text-sm">
                <div className="rounded-[1rem] border border-white/10 bg-white/[0.04] p-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    Email
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href="mailto:rubytechconsulting@gmail.com"
                      className="text-white transition-colors hover:text-[#9cb4ff]"
                    >
                      rubytechconsulting@gmail.com
                    </a>
                  </dd>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Response
                    </dt>
                    <dd className="mt-1 text-white/70">Within a business day</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Based in
                    </dt>
                    <dd className="mt-1 text-white/70">Lagos — worldwide</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
