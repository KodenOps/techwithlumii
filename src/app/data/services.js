import createIllustration from "@/components/createIllustration"
import {
  Cpu,
  Rocket,
  Sparkles,
} from 'lucide-react';
const services = [
  {
    title: 'Training & Workshops',
    description: 'Hands-on sessions that turn teams into confident builders, with practical skills and future-focused strategies.',
    image: createIllustration('Design', '#1B1E27', '#33384A'),
    bullets: ['One-on-One Sessions', 'Team Workshops', 'Virtual & In-Person'],
    icon: Sparkles,
  },
  {
    title: 'Web Development',
    description: 'We help Small and Medium Businesses build robust web applications with modern technologies to reach their business goals.',
    image: createIllustration('Web Dev', '#171B22', '#28303C'),
    bullets: ['Landing Pages', 'Web Applications', 'E-commerce Solutions'],
    icon: Cpu,
  },
  {
    title: 'Consulting & Mentorship',
    description: 'Guidance for teams and individuals to navigate the tech landscape, improve workflows, and achieve their objectives.',
    image: createIllustration('Bootcamp', '#20232B', '#3A3220'),
    bullets: ['Technical Mentorship', 'Portfolio Reviews', 'Career Guidance'],
    icon: Rocket,
  },
];

export default services;