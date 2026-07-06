import createIllustration from "@/components/createIllustration"
import {
  Cpu,
  Rocket,
  Sparkles,
} from 'lucide-react';
const services = [
  {
    title: 'Product Design Sprints',
    description: 'Rapid coaching for founders and teams shipping polished digital experiences.',
    image: createIllustration('Design', '#1B1E27', '#33384A'),
    bullets: ['UI systems', 'Figma workflows', 'Launch-ready prototypes'],
    icon: Sparkles,
  },
  {
    title: 'AI & Automation Labs',
    description: 'Hands-on sessions that turn AI tools into everyday workflows and superpowers.',
    image: createIllustration('AI Labs', '#171B22', '#28303C'),
    bullets: ['Prompt design', 'Automation playbooks', 'Real-world demos'],
    icon: Cpu,
  },
  {
    title: 'Founder Bootcamps',
    description: 'Mentor-led, practical training for ambitious builders who want momentum fast.',
    image: createIllustration('Bootcamp', '#20232B', '#3A3220'),
    bullets: ['Portfolio projects', 'Career coaching', 'Community support'],
    icon: Rocket,
  },
];

export default services;