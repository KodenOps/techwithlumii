
import cover_A from "@/assets/cover4.png"
import cover2 from "@/assets/cover3.png"
import type { StaticImageData } from "next/image";

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  cover: StaticImageData;
  shortDescription: string;
  fullDescription: string;
  price: string;
  selarUrl: string;
  badge?: string;
}

const books: Book[] = [
  {
    id: 'never-make-money',
    slug: 'you-will-never-make-money-with-that-skill-until',
    title: 'YOU WILL NEVER MAKE MONEY WITH THAT SKILL... UNTIL',
    subtitle:
      'A Practical Guide for Nigerian Youths to Turn Skill Into Income',
    tag: 'Personal growth & Career',
    cover: cover_A,
    shortDescription:
      'Two people can have the same skill but end up with completely different lives. This book reveals the hidden principles that determine who earns from their skill—and who stays stuck learning forever.',
    fullDescription:
      "Learning a skill is only the beginning. Whether you're a developer, designer, writer, photographer, video editor, freelancer, or aspiring entrepreneur, this book shows why skill alone rarely leads to financial success. Discover the mindset shifts, character traits, visibility strategies, networking habits, and practical actions that transform ordinary skills into consistent income. If you've ever wondered why less talented people seem to get better opportunities, this book will change the way you think about success forever.",
    price: '₦3,000',
    selarUrl: 'https://selar.com/0772660l83',
    badge: 'Bestseller',
  },
  {
    id: 'first-100k',
    slug: 'the-first-100000',
    title: 'THE FIRST ₦100,000',
    subtitle:
      'How Nigerians Turn Skills, Knowledge, and Everyday Opportunities Into Their First Real Income',
    tag: 'Career & Income',
    cover: cover2,
    shortDescription:
      'A practical, no-fluff guide to earning your first ₦100,000 from a skill you already have—or one you can learn in weeks.',
    fullDescription:
      "Getting your first paying client is the hardest milestone in any career. This practical playbook walks you through choosing a profitable skill, finding your first clients, pricing your services, communicating like a professional, getting referrals, and following a proven 30-day action plan to earn your first ₦100,000. Written specifically for Nigerians, it's packed with relatable examples, templates, and actionable strategies you can start using immediately.",
    price: '₦5,000',
    selarUrl: 'https://selar.com/46ck142i46',
    badge: 'New Release',
  },
];

export default books;