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
    image: createIllustration('Design', '#4a6799', '#41421f'),
    bullets: ['Landing Pages', 'Web Applications', 'E-commerce Solutions'],
    icon: Sparkles,
  },
  {
    title: 'Consulting & Mentorship',
    description: 'Guidance for teams and individuals to navigate the tech landscape, improve workflows, and achieve their objectives.',
    image: createIllustration('Bootcamp', '#20232B', '#3a2035'),
    bullets: ['Technical Mentorship', 'Portfolio Reviews', 'Career Guidance'],
    icon: Sparkles,
  },
    {
    title: 'Human Resourcing & Outsourcing',
    description: 'We provide expert HR solutions and outsourcing services especially in the tech industry to help businesses manage their workforce effectively and efficiently.',
    image: createIllustration('Bootcamp', '#20232B', '#2e4642'),
    bullets: ['International & Local Recruitment', 'Employee Management', 'Outsourcing Solutions', "CV Screening & Interviewing"],
    icon: Sparkles,
  },
];

export default services;