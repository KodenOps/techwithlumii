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
    bullets: ['One-on-One Sessions', 'Team Workshops', 'Bootcamp Programs', 'Portfolio Reviews'],
    icon: Sparkles,
  },
      {
    title: 'Bespoke Business Solutions',
    description: 'We provide tailored solutions to meet the unique needs of businesses, helping them streamline operations, enhance productivity, and achieve their goals.',
    image: createIllustration('Bootcamp', '#20232B', '#2e4642'),
    bullets: ['Workflow Automations', 'Website Development', 'Inventory Management Solutions', 'Business Process Optimization'],
    icon: Sparkles,
  },
      {
    title: 'Branding & Souvenir',
    description: 'We handles all your Business Branding and Souvenir life-cycle needs, from design to production, ensuring your brand is represented with quality and consistency.',
    image: createIllustration('Bootcamp', '#20232B', '#2e4642'),
    bullets: ['International & Local Branding', 'Souvenir Design & Production', 'Marketing Materials', "Logo & Identity Design"],
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
    title: 'Business & Documentations',
    description: 'Guidance for teams and individuals to navigate the tech landscape, improve workflows, and achieve their objectives.',
    image: createIllustration('Bootcamp', '#20232B', '#3a2035'),
    bullets: ['CAC Registrations', 'Rotary Public Declarations', 'Surveys & Researchs', 'Business Plans & Proposals'],
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