import createIllustration from "@/components/createIllustration"

const coursePreviews = [
  {
    title: 'AI for Creators',
    description: 'Master AI tools, automate workflows, and build standout content systems in a practical 4-week sprint.',
    duration: '4 weeks',
    outcome: 'Launch AI-assisted projects',
    image: createIllustration('AI for Creators', '#181B22', '#2C2417'),
  },
  {
    title: 'Frontend Launchpad',
    description: 'Build modern web interfaces with React, Next.js, and polished UI systems that impress recruiters and clients.',
    duration: '6 weeks',
    outcome: 'Ship a portfolio-ready app',
    image: createIllustration('Launchpad', '#161A21', '#252B36'),
  },
  {
    title: 'Tech Team Accelerator',
    description: 'Fast-track your team with hands-on training, live mentoring, and product-focused delivery practices.',
    duration: 'Custom',
    outcome: 'Upgrade team capability fast',
    image: createIllustration('Accelerator', '#1A1D24', '#2E2A22'),
  },
];

export default coursePreviews