'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Check,
  Cpu,
  Mail,
  Menu,
  Moon,
  Rocket,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import statss from "@/app/data/stats"
import services from "@/app/data/services"
import coursePreviews from "@/app/data/coursePreviews"
import testimonials from "@/app/data/testimonials"
import createIllustration from "@/components/createIllustration"
import createAvatar from "@/components/createAvater"
import {createTexture} from "@/components/createTexture"
import TrustedByStrip from "@/components/TrustedByStrip"
import SectionMark from '@/components/SectionMark';
import LineIllustration from '@/components/LineIllustration';
import Image1 from '@/assets/image1.png'
import Image from 'next/image';
/**
 * ---------------------------------------------------------------
 * DESIGN SYSTEM — "Quiet Signal" (v2: imagery + motion pass)
 * Same restrained editorial-tech identity as before, extended with:
 *   - a fixed scroll-progress hairline
 *   - a slow grayscale "trusted by" wordmark strip
 *   - a layered image collage in About (with gentle float)
 *   - count-up stats, staggered grid reveals, image hover-zoom
 *   - a subtle parallax on the hero image
 *   - a faint grain texture over the whole page for depth
 * Motion stays slow, small-amplitude, and purposeful — no bounce,
 * no rotation, nothing that reads as playful.
 * ---------------------------------------------------------------
 */

const BRASS = '#B78A46';
// Navigation Links - 
const navItems = ['Home', 'About', 'Courses', 'Services', 'Testimonials', 'Contact'];

// Faint noise texture laid over the whole page for print-like depth
const grainOverlay = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}`;

const aboutImages = {
  main: createIllustration('The Studio', '#181B22', '#28303C'),
  accentA: createIllustration('Team Culture', '#20232B', '#2E2A22'),
  accentB: createIllustration('Workshop', '#171B22', '#243044'),
};
const heroDetailImage = createIllustration('Mentorship', '#20232B', '#2E2A22');
const fallbackImage = createIllustration('TechWithLumi', '#1B1E27', '#2C2417');
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};



function CountUp({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        let start: number | null = null;
        const duration = 1200;
        let frame: number;

        const step = (ts: number) => {
          if (start === null) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);

          if (progress < 1) {
            frame = window.requestAnimationFrame(step);
          }
        };

        frame = window.requestAnimationFrame(step);
        observer.disconnect();

        return () => window.cancelAnimationFrame(frame);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}




export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', reason: "", message: '' });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    window.requestAnimationFrame(resetScroll);
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('techwithlumi-theme') as 'dark' | 'light' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ?? (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('techwithlumi-theme', theme);
  }, [theme]);

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start end', 'end start'] });
  const heroImageY = useTransform(heroProgress, [0, 1], [-24, 24]);

  const isDark = theme === 'dark';
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = fallbackImage;
  };

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
      setSubmitMessage('Thanks! Your message has been sent.');
      setFormData({ name: '', email: '', reason: "", message: '' });
    } catch (error) {
      setSubmitState('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Unable to send your message right now.');
    }
  };

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
    <main
      className="relative min-h-screen transition-colors duration-500"
      style={{ background: bg, color: text, fontFamily: "'Inter', sans-serif" }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        html { scroll-behavior: smooth; }

        @keyframes trusted-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .trusted-track {
          animation: trusted-scroll 32s linear infinite;
        }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .gentle-float {
          animation: gentle-float 5.5s ease-in-out infinite;
        }
      `}</style>

      {/* faint grain texture over the whole page */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("${grainOverlay}")`,
          backgroundSize: '180px 180px',
          opacity: isDark ? 0.05 : 0.035,
          mixBlendMode: isDark ? 'overlay' : 'multiply',
        }}
        aria-hidden="true"
      />

      {/* scroll progress hairline */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
        style={{ scaleX: scrollYProgress, background: BRASS }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-8">
        {/* HEADER */}
        <header
          className="sticky top-0 z-50 mb-2 flex items-center justify-between border-b py-5 backdrop-blur-md"
          style={{ borderColor: line, background: isDark ? 'rgba(11,13,18,0.82)' : 'rgba(250,249,246,0.86)' }}
        >
          <div className="flex items-baseline gap-2">
            {/* LOGO */}
            <h1 className="text-xl" style={{ ...displayFont, fontStyle: 'italic' }}>RubyTech</h1>
            <span className="hidden text-[11px] uppercase tracking-[0.24em] sm:inline" style={{ color: mutedSoft, ...labelFont }}>
              RC-9666355
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="hidden items-center gap-8 text-[13px] font-medium md:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="group relative py-1 transition-opacity hover:opacity-80"
                  style={{ color: muted }}
                >
                  {item}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                    style={{ background: BRASS }}
                  />
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="rounded-full p-2 transition hover:opacity-70"
              style={{ border: `1px solid ${line}`, color: text }}
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-full p-2 md:hidden"
              style={{ border: `1px solid ${line}`, color: text }}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {mobileMenuOpen ? (
          <div className="mb-4 border-b py-4 md:hidden" style={{ borderColor: line }}>
            <div className="flex flex-col gap-1 text-sm">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="rounded-lg px-2 py-2.5 transition hover:opacity-70"
                  style={{ color: muted }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {/* HERO */}
        <section id="home" ref={heroRef} className="grid gap-14 pt-4 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="space-y-9">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.28em]"
              style={{ color: BRASS, ...labelFont }}
            >
              <span className="h-px w-8" style={{ background: BRASS }} />
              Value driven Services, Everyday
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-xl space-y-6"
            >
              <h2 className="text-[2.6rem] leading-[1.08] tracking-tight sm:text-6xl" style={{ ...displayFont, fontWeight: 500 }}>
                Agency solely built For <em style={{ color: BRASS, fontStyle: 'italic' }}>Empowering</em> And Delivering Value.
              </h2>
              <p className="text-lg leading-8" style={{ color: muted }}>
                We help ambitious individuals and teams build skills, ship projects, and grow confidence to earn in a saturated market. Our services are designed to provide practical skills and real-world experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition hover:opacity-90"
                style={{ background: text, color: bg }}
              >
                Start your journey
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-sm font-semibold underline-offset-4 transition hover:underline"
                style={{ color: text }}
              >
                Explore services
              </a>
            </motion.div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-6 pt-4">
              {statss.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl tabular-nums" style={{ ...displayFont, fontWeight: 500 }}>
                      <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em]" style={{ color: mutedSoft, ...labelFont }}>{stat.label}</p>
                  </div>
                  {i < statss.length - 1 ? <span className="hidden h-10 w-px sm:block" style={{ background: line }} /> : null}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl"
            style={{ border: `1px solid ${line}`, boxShadow: isDark ? '0 30px 60px -30px rgba(0,0,0,0.6)' : '0 30px 60px -30px rgba(20,23,31,0.25)' }}
          >
            <Image
              // style={{ y: heroImageY }}
              src={Image1}
              // src={createIllustration('Live Cohort', '#1B1E27', '#2E2A22')}
              alt="Students collaborating in a tech training workshop"
              onError={handleImageError}
              className="h-96 w-full scale-110 object-cover"
            />
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="absolute left-4 top-4 hidden w-40 rounded-xl p-3 sm:block"
              style={{ background: isDark ? 'rgba(11,13,18,0.76)' : 'rgba(255,255,255,0.9)', border: `1px solid ${line}` }}
            >
              <LineIllustration className="h-24 w-full text-[color:var(--accent)]" accent={BRASS} />
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em]" style={{ color: mutedSoft, ...labelFont }}>Learning flow</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="absolute bottom-4 right-4 w-36 overflow-hidden rounded-xl"
              style={{ border: `1px solid ${line}`, background: cardBg }}
            >
              <img src={heroDetailImage} alt="Mentorship illustration" onError={handleImageError} className="h-24 w-full object-cover" />
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: mutedSoft, ...labelFont }}>Mentored</p>
                <p className="mt-1 text-sm font-medium" style={{ color: text }}>Small-group guidance</p>
              </div>
            </motion.div>
            <div
              className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl px-4 py-3.5 backdrop-blur-md"
              style={{ background: isDark ? 'rgba(11,13,18,0.68)' : 'rgba(255,255,255,0.82)', border: `1px solid ${line}` }}
            >
              <div className="flex h-10 w-14 hidden md:block items-center justify-center rounded-full" style={{ border: `1px solid ${BRASS}` }}>
                <Users className="h-4 w-4" style={{ color: BRASS }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: mutedSoft, ...labelFont }}>Featured program</p>
                <p className="text-sm font-medium" style={{ color: text }}>Breaking Into Tech Bootcamp V2 (Website Development, Devops and Data Analysis cohorts)</p>
              </div>
            </div>
          </motion.div>
        </section>

        <TrustedByStrip line={line} mutedSoft={mutedSoft} labelFont={labelFont} />

        {/* ABOUT */}
        <section id="about" className="grid gap-16 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl"
              style={{ border: `1px solid ${line}` }}
            >
              <Image
                // src={aboutImages.main}
                src={Image1}
                alt="A collaborative team working around a laptop"
                onError={handleImageError}
                className="h-80 w-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="gentle-float absolute -bottom-8 -left-6 hidden h-32 w-44 overflow-hidden rounded-xl sm:block"
              style={{ border: `1px solid ${line}`, boxShadow: isDark ? '0 20px 40px -20px rgba(0,0,0,0.6)' : '0 20px 40px -20px rgba(20,23,31,0.3)' }}
            >
              <img src={aboutImages.accentB} alt="Team culture moment" onError={handleImageError} className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="gentle-float absolute -top-6 -right-6 hidden h-28 w-40 overflow-hidden rounded-xl sm:block"
              style={{ border: `1px solid ${line}`, boxShadow: isDark ? '0 20px 40px -20px rgba(0,0,0,0.6)' : '0 20px 40px -20px rgba(20,23,31,0.3)', animationDelay: '1.2s' }}
            >
              <img src={aboutImages.accentB} alt="Workshop session" onError={handleImageError} className="h-full w-full object-cover" />
            </motion.div>
          </div>

          <div className="space-y-7">
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: BRASS, ...labelFont }}>About us</p>
            <h3 className="max-w-lg text-3xl leading-tight sm:text-4xl" style={{ ...displayFont, fontWeight: 500 }}>
            We help you build skills, ship projects, and grow confidence to earn in a saturated market.
            </h3>
            <p className="max-w-lg text-lg leading-8" style={{ color: muted }}>
              Our team of experienced instructors and mentors are passionate about helping individuals and teams succeed in the fast-paced world of technology. We offer a range of services, from bootcamps to workshops, designed to provide practical skills and real-world experience.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4 rounded-2xl p-5 sm:flex-row"
              style={{ border: `1px solid ${line}`, background: cardBgSoft }}
            >
              <div className="min-w-[120px] overflow-hidden rounded-xl" style={{ border: `1px solid ${line}` }}>
                <img src={aboutImages.accentB} alt="Workshop illustration" onError={handleImageError} className="h-24 w-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: mutedSoft, ...labelFont }}>Studio rhythm</p>
                <p className="mt-2 text-sm leading-6" style={{ color: muted }}>We pair practical instruction with thoughtful follow-through, so the experience feels grounded, calm, and highly effective.</p>
              </div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid gap-x-8 gap-y-5 pt-2 sm:grid-cols-2"
            >
              {[
                ['Built for ambition', 'Tailored learning pathways for individuals and teams.'],
                ['Outcome oriented', 'Practical coaching that keeps progress visible.'],
                ['Always current', 'Training shaped around the latest tools and workflows.'],
                ['Community powered', 'Support that stays with you after the course.'],
              ].map(([title, description]) => (
                <motion.div key={title} variants={itemVariants} className="flex gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full" style={{ border: `1px solid ${BRASS}` }}>
                    <Check className="h-3 w-3" style={{ color: BRASS }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{title}</h4>
                    <p className="mt-1 text-sm" style={{ color: mutedSoft }}>{description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <SectionMark color={line} />

        {/* SERVICES */}
        <section id="services" className="space-y-12 py-16 lg:py-20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: BRASS, ...labelFont }}>What we do</p>
              <h3 className="mt-4 text-3xl sm:text-4xl" style={{ ...displayFont, fontWeight: 500 }}>Services with real-world energy and clear outcomes.</h3>
            </div>
            <p className="max-w-md text-base leading-7" style={{ color: muted }}>
              We help you achieve your goals with a range of services designed to provide practical skills and real-world experience. From bootcamps to workshops, we offer tailored learning pathways for individuals and teams.
            </p>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-3"
            // style={{  }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.title}
                  variants={itemVariants}
                  className="group flex flex-col"
                  style={{ background: cardBg }}
                >
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      onError={handleImageError}
                      className="h-36 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full" style={{ border: `1px solid ${BRASS}` }}>
                      <Icon className="h-4.5 w-4.5" style={{ color: BRASS }} />
                    </div>
                    <h4 className="text-lg font-semibold">{service.title}</h4>
                    <p className="mt-3 flex-1 text-sm leading-6" style={{ color: muted }}>{service.description}</p>
                    <ul className="mt-6 space-y-2.5 border-t pt-5 text-sm" style={{ borderColor: line, color: mutedSoft }}>
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-center gap-2.5">
                          <span className="h-1 w-1 rounded-full" style={{ background: BRASS }} />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <SectionMark color={line} />

        {/* COURSES */}
        <section id="courses" className="space-y-12 py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: BRASS, ...labelFont }}>Break Into Tech Bootcamp v2</p>
            <h3 className="mt-4 text-3xl sm:text-4xl" style={{ ...displayFont, fontWeight: 500 }}>High-impact programs built for fast-moving learners.</h3>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {coursePreviews.map((course) => (
              <motion.article
                key={course.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl transition-shadow"
                style={{ border: `1px solid ${line}`, background: cardBg }}
              >
                <div className="overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    onError={handleImageError}
                    className="h-40 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
                      style={{ border: `1px solid ${BRASS}`, color: BRASS }}
                    >
                      Popular
                    </span>
                    <BookOpen className="h-4 w-4" style={{ color: mutedSoft }} />
                  </div>
                  <h4 className="text-lg font-semibold">{course.title}</h4>
                  <p className="mt-3 text-sm leading-6" style={{ color: muted }}>{course.description}</p>
                  <div className="mt-6 space-y-2.5 border-t pt-5 text-sm" style={{ borderColor: line }}>
                    <div className="flex items-center justify-between">
                      <span style={{ color: mutedSoft }}>Duration</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: mutedSoft }}>Outcome</span>
                      <span className="font-medium">{course.outcome}</span>
                    </div>
                  </div>
                  <a href={course.url} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3" style={{ color: BRASS }}>
                    Preview course
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <SectionMark color={line} />

        {/* TESTIMONIALS */}
        <section id="testimonials" className="space-y-12 py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: BRASS, ...labelFont }}>Testimonials</p>
            <h3 className="mt-4 text-3xl sm:text-4xl" style={{ ...displayFont, fontWeight: 500 }}>Our Work speaks for itself.</h3>
          </div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 lg:grid-cols-2 "
          >
            {testimonials.map((item) => (
              <motion.article
                key={item.name}
                variants={itemVariants}
                className="flex flex-col rounded-2xl border-l-2 p-8"
                style={{ borderColor: BRASS, background: cardBgSoft }}
              >
                <p className="flex-1 text-lg leading-8" style={{ ...displayFont, fontStyle: 'italic', fontWeight: 400 }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-3.5">
                  <Image src={item.image} alt={item.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs uppercase tracking-wide" style={{ color: mutedSoft, ...labelFont }}>{item.role}</p>
                  </div>
                  <TrendingUp className="ml-auto h-4 w-4" style={{ color: BRASS }} />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="relative overflow-hidden rounded-3xl px-8 py-14 sm:px-12 lg:px-16 lg:py-20"
          style={{ background: '#0B0D12', border: `1px solid rgba(245,243,238,0.08)` }}
        >
          <img
            src={createTexture('#12141A', '#0B0D12')}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.28em]" style={{ color: BRASS, ...labelFont }}>Contact us</p>
              <h3 className="max-w-md text-3xl leading-tight text-white sm:text-4xl" style={{ ...displayFont, fontWeight: 500 }}>
                Let's build something great together and make an impact.
              </h3>
              <p className="max-w-md text-base leading-7" style={{ color: 'rgba(245,243,238,0.62)' }}>
               You are one step away from getting in touch with us. Fill out the form and we will get back to you as soon as possible.
              </p>
            </div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl p-7"
              style={{ background: '#15181F', border: '1px solid rgba(245,243,238,0.08)' }}
            >
              <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: 'rgba(245,243,238,0.7)' }}>
                Full name
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Jane Doe"
                  className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#B78A46]"
                  style={{ border: '1px solid rgba(245,243,238,0.14)' }}
                  required
                />
              </label>
              <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: 'rgba(245,243,238,0.7)' }}>
                Email address
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  placeholder="hello@company.com"
                  className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#B78A46]"
                  style={{ border: '1px solid rgba(245,243,238,0.14)' }}
                  required
                />
              </label>
                  <label
      className="block text-xs font-medium uppercase tracking-wide"
      style={{ color: "rgba(245,243,238,0.7)" }}
    >
      Reason for Contact
      <select
        value={formData.reason}
        onChange={(event) =>
          setFormData((current) => ({
            ...current,
            reason: event.target.value,
          }))
        }
        className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#B78A46]"
        style={{
          border: "1px solid rgba(245,243,238,0.14)",
          background: "#15181F",
        }}
        required
      >
        <option value="" disabled>
          Select a reason
        </option>
        <option value="Website Development">Website Development</option>
        <option value="Corporate Training">Corporate Training</option>
        <option value="Tech Bootcamp">Tech Bootcamp</option>
        <option value="Outsourcing">Outsourcing</option>
        <option value="IT Consulting">IT Consulting</option>
        <option value="Technical Support">Technical Support</option>
        <option value="Partnership">Partnership</option>
        <option value="General Inquiry">General Inquiry</option>
      </select>
    </label>
              <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: 'rgba(245,243,238,0.7)' }}>
                What are you looking for?
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Bootcamp, corporate training, project support..."
                  className="mt-2.5 w-full rounded-lg bg-transparent px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#B78A46]"
                  style={{ border: '1px solid rgba(245,243,238,0.14)' }}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: '#FAF9F6', color: '#0B0D12' }}
              >
                {submitState === 'loading' ? 'Sending...' : 'Send inquiry'}
                <Mail className="h-4 w-4" />
              </button>
              {submitMessage ? (
                <p
                  className="text-sm"
                  style={{ color: submitState === 'error' ? '#F5A3A3' : '#CDECCB' }}
                >
                  {submitMessage}
                </p>
              ) : null}
            </motion.form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-4 border-t py-8" style={{ borderColor: line, color: mutedSoft }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base" style={{ ...displayFont, fontStyle: 'italic' }}>Rubytech Consulting And Outsourcing Enterprise.</p>
              <p className="mt-1 text-sm">A value driven agency built on innovation and excellence.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-medium">
              <a href="#home" className="transition hover:opacity-70">Home</a>
              <a href="#services" className="transition hover:opacity-70">Services</a>
              <a href="#contact" className="transition hover:opacity-70">Contact</a>
            </div>
          </div>
          <p className="mt-6 text-xs uppercase tracking-wide" style={{ ...labelFont }}>© 2026 Crafted for SMEs, startups, and future-focused learners.</p>
        </footer>
      </div>
    </main>
  );
}
