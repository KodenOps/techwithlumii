import webdevs from '@/assets/webdevs.png';
import devopss from '@/assets/devopss.png';
import excelss from '@/assets/excelss.png';

const coursePreviews = [
  {
    title: 'Website Development Bootcamp',
    description:
      'Learn to build modern web applications with HTML, CSS, JavaScript and AI-assisted workflows, with polished UI systems that impress recruiters and clients.',
    duration: '8 weeks',
    outcome: '4 portfolio-ready projects',
    image: webdevs,
    url: '/courses/website-development-bootcamp',
  },
  {
    title: 'DevOps Beginner Bootcamp',
    description:
      'Master the fundamentals of DevOps — CI/CD pipelines, cloud infrastructure, Docker containerisation and Linux administration.',
    duration: '8 weeks',
    outcome: 'Deploy, monitor, scale',
    image: devopss,
    url: '/courses/devops-beginner-bootcamp',
  },
  {
    title: 'Excel & Data Analysis Bootcamp',
    description:
      'Gain practical skills in Excel, SQL and Power BI to make data-driven decisions and build visualisations that hold attention.',
    duration: '8 weeks',
    outcome: 'Use data to drive decisions',
    image: excelss,
    url: '/courses/excel-data-analysis-bootcamp',
  },
];

export default coursePreviews;
