import createIllustration from "@/components/createIllustration"
const coursePreviews = [
  {
    title: 'Website Development Bootcamp - HTML, CSS, JS, AI',
    description: 'Learn to build modern web applications with React, Next.js, and polished UI systems that impress recruiters and clients.',
    duration: '8 weeks',
    outcome: '+4 portfolio-ready Projects',
    image: createIllustration('Launchpad', '#161A21', '#252B36'),
    url: "/courses/website-development-bootcamp"
  },
  {
    title: 'DevOps Beginner Bootcamp - CI/CD, Cloud, Docker, Linux',
    description: 'Master the fundamentals of DevOps, including CI/CD pipelines, cloud infrastructure, Docker containerization, and Linux administration.',
    duration: '8 weeks',
    outcome: 'Deploy, monitor, Scale',
    image: createIllustration('Launchpad', '#679875', '#252B36'),
    url: "/courses/devops-beginner-bootcamp"
  },
  {
    title: 'Excel and Data Analysis Bootcamp - Excel, SQL, Power BI',
    description: 'Gain practical skills in data analysis using Excel, SQL, and Power BI to make data-driven decisions and create impactful visualizations.',
    duration: '8 weeks',
    outcome: 'Use data to drive decisions',
    image: createIllustration('Accelerator', '#1A1D24', '#2E2A22'),
    url: "/courses/excel-data-analysis-bootcamp"
  },
  
];

export default coursePreviews