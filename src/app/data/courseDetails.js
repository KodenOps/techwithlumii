import createIllustration from "@/components/createIllustration"
import { Code, Database, Cloud, Zap, Users, Award, Briefcase, TrendingUp } from 'lucide-react';
import devops from "@/assets/devopss.png"
import webdev from "@/assets/webdevs.png"
import excel from "@/assets/excelss.png"
const courseDetails = [
  {
    id: 'web-dev-bootcamp',
    slug: 'website-development-bootcamp',
    title: 'Website Development Bootcamp',
    subtitle: 'HTML, CSS, JavaScript, AI',
    description: 'Learn to build modern, responsive web applications that leverage AI technologies. Gain hands-on experience with HTML, CSS, JavaScript, and making use of AI to create stunning websites and web apps.',
    // heroImage: createIllustration('Web Development', '#181B22', '#2C2417'),
    heroImage: webdev,
    shortImage: createIllustration('Web Dev', '#1B1E27', '#33384A'),
    
    duration: '8 weeks',
    pace: 'Weekends | 3 hours daily',
    level: 'Beginner to Intermediate',
    
    price: 45000,
    originalPrice: 95000,
    discount: 53,
    currency: 'NGN',
    paymentOptions: ['Full payment'],
    
    keyFeatures: [
      'Live cohort-based learning',
      'Hands-on projects & labs',
      'Expert mentorship',
      'Career guidance included',
      'Lifetime access to materials',
      'After-Training support',
    ],
    
    keySellingPoints: [
      {
        title: 'Industry-Ready Skills',
        description: 'Learn technologies actually used by top companies',
        icon: Briefcase,
      },
      {
        title: 'Portfolio Projects',
        description: '6 production-quality projects you can showcase',
        icon: Award,
      },
      {
        title: 'Live Mentorship',
        description: 'Direct access to experienced developers',
        icon: Users,
      },
      {
        title: 'Job Support',
        description: 'Career coaching & interview preparation included',
        icon: TrendingUp,
      },
    ],
    
projects: [
  {
    name: 'Personal Portfolio Website',
    description: 'Responsive single-page portfolio showcasing your projects and skills',
    technologies: 'HTML, CSS, JavaScript',
    duration: 'Week 1-2',
  },
  {
    name: 'Interactive Quiz App',
    description: 'Multiple-choice quiz with score tracking, timer, and instant feedback',
    technologies: 'HTML, CSS, JavaScript',
    duration: 'Week 2',
  },
  {
    name: 'To-Do List App',
    description: 'Add, edit, delete, and mark tasks complete, saved with LocalStorage',
    technologies: 'HTML, CSS, JavaScript, LocalStorage',
    duration: 'Week 3',
  },
  {
    name: 'Weather App',
    description: 'Search a city and display live weather using a public API',
    technologies: 'HTML, CSS, JavaScript, Fetch API',
    duration: 'Week 3-4',
  },
  {
    name: 'Recipe/Movie Search App',
    description: 'Search and display results from a public API with loading and error states',
    technologies: 'HTML, CSS, JavaScript, Fetch API',
    duration: 'Week 4',
  },
  {
    name: 'E-Commerce Product Page',
    description: 'Interactive product page with filters, cart, and checkout UI (no real payments)',
    technologies: 'HTML, CSS, JavaScript, LocalStorage',
    duration: 'Week 5',
  },
  {
    name: 'Expense Tracker',
    description: 'Add/remove transactions, running balance, category filtering, saved locally',
    technologies: 'HTML, CSS, JavaScript, LocalStorage',
    duration: 'Week 5-6',
  },
{
    name: 'Local Business Website',
    description: 'Multi-section site for a real business type (e.g. salon, cafe, gym) with services, testimonials, gallery, and a contact form',
    technologies: 'HTML, CSS, JavaScript',
    duration: 'Week 6',
  },
  {
    name: 'SaaS Landing Page',
    description: 'Polished, conversion-optimized landing page with scroll animations and a signup form',
    technologies: 'HTML, CSS, JavaScript',
    duration: 'Week 7',
  },
  {
    name: 'Final Capstone Project',
    description: 'Build a complete website for a real business or startup, integrating all learned skills and deploying it online for public access',
    technologies: 'HTML, CSS, JavaScript, Deployment (Netlify/GitHub Pages)',
    duration: 'Project Week',
  },
],
    
   curriculum: [
  {
    week: 'Week 1',
    title: 'HTML & CSS Foundations',
    topics: ['HTML5 semantics', 'CSS box model & flexbox', 'CSS Grid', 'Responsive design (mobile-first)', 'Git & GitHub basics'],
    project: 'Build and deploy a personal landing page (responsive, semantic HTML)',
  },
  {
    week: 'Week 2',
    title: 'Advanced CSS & Design Systems',
    topics: ['CSS variables & custom properties', 'Animations & transitions', 'CSS frameworks (Tailwind)', 'Accessibility (a11y) basics', 'Reading/adapting design mockups'],
    project: 'Clone a real-world website UI (e.g. a product page) pixel-for-pixel',
  },
  {
    week: 'Week 3',
    title: 'JavaScript Fundamentals',
    topics: ['ES6+ syntax', 'Variables, functions, arrays/objects', 'Control flow & loops', 'DOM selection & manipulation', 'Event listeners'],
    project: 'Interactive to-do list app with localStorage persistence',
  },
  {
    week: 'Week 4',
    title: 'JavaScript in Depth',
    topics: ['Async JS (promises, async/await)', 'Fetch API & working with REST APIs', 'Error handling', 'Reading & debugging unfamiliar code', 'DevTools mastery'],
    project: 'Weather app or movie search app consuming a public API',
  },
  {
    week: 'Week 5',
    title: 'Vibecoding Fundamentals',
    topics: [
      'What vibecoding is & when it works vs when it doesn\'t',
      'Writing effective prompts for AI coding tools (Claude, Cursor, v0, Bolt, Lovable)',
      'Reading AI-generated code you didn\'t write',
      'Iterative prompting: refining, fixing, and redirecting output',
      'Why fundamentals (Weeks 1-4) matter even when AI writes the code',
    ],
    project: 'Vibecode a small app from a one-paragraph prompt, then manually debug 3 issues in the generated code',
  },
  {
    week: 'Week 6',
    title: 'Vibecoding Real Projects',
    topics: [
      'Breaking a bigger idea into prompt-sized chunks',
      'Working across multiple files/components with an AI tool',
      'Spotting AI mistakes: broken logic, security issues, bad practices',
      'Version control discipline when vibecoding (commit often, diff review)',
      'Blending hand-written code with AI-generated code',
    ],
    project: 'Vibecode a multi-page app (e.g. a booking site or dashboard), with at least one feature built by hand',
  },
  {
    week: 'Week 7',
    title: 'Polish, Performance & Deployment',
    topics: ['Code organization & best practices', 'Performance optimization', 'SEO fundamentals', 'Testing your UI manually', 'Deploying (Netlify/Vercel/GitHub Pages)'],
    project: 'Refactor and deploy your strongest project from Weeks 1-6',
  },
  {
    week: 'Week 8',
    title: 'Capstone & Career Prep',
    topics: ['Capstone project build (vibecoded + hand-coded)', 'Portfolio site assembly', 'Resume & LinkedIn review', 'Mock interviews', 'Client/job search strategy'],
    project: 'Capstone: a full app built using both vibecoding and manual coding, presented in a demo day',
  },
],

learningOutcomes: [
  'Build responsive, accessible websites with HTML5 & modern CSS',
  'Write clean, modern JavaScript for interactive web apps',
  'Vibecode functional apps using AI coding tools',
  'Read, debug, and improve AI-generated code confidently',
  'Know when to vibecode vs when to hand-write code',
  'Optimize performance & SEO',
  'Version control with Git and collaborate on GitHub',
  'Deploy websites and apps live for public access',
  'Assemble a portfolio and get interview/client-ready',
],
    
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Junior Web Developer',
        quote: 'This bootcamp transformed my career. Within 3 months of completing it, I landed a junior developer role at a startup.',
        image: createIllustration('Avatar 1', '#20232B', '#3a2035'),
      },
      {
        name: 'Michael Chen',
        role: 'Freelance Developer',
        quote: 'The project-based approach made learning stick. I immediately started freelancing with the skills I learned.',
        image: createIllustration('Avatar 2', '#1A1D24', '#2E2A22'),
      },
    ],
    
    faq: [
      {
        question: 'Do I need prior programming experience?',
        answer: 'No! This bootcamp starts from the basics and builds up. We only ask that you have the commitment to learn.',
      },
      {
        question: 'What happens after the bootcamp?',
        answer: 'You get lifetime access to course materials, job placement support, and priority access to mentorship during your job search.',
      },
      {
        question: 'Can I work while attending?',
        answer: 'Yes. The bootcamp is flexible with asynchronous content and recorded sessions. However, we recommend dedicating 20+ hours weekly.',
      },
      {
        question: 'What\'s the refund policy?',
        answer: 'We offer a 14-day money-back guarantee if you\'re not satisfied. No questions asked.',
      },
      {
        question: 'Will I get a certificate?',
        answer: 'Yes, you receive a completion certificate and a portfolio link showcasing your 6 projects.',
      },
    ],
  },
  
  {
    id: 'devops-bootcamp',
    slug: 'devops-beginner-bootcamp',
    title: 'DevOps Beginner Bootcamp',
    subtitle: 'CI/CD, Cloud, Docker & Linux',
    description: 'Master the fundamentals of DevOps. Learn to deploy, manage, and scale applications with modern infrastructure tools.',
    // heroImage: createIllustration('DevOps', '#161A21', '#252B36'),
    heroImage: devops,
    shortImage: createIllustration('Cloud', '#1B1E27', '#33384A'),
    
    duration: '8 weeks',
    pace: 'Weekends | 3 hours daily',
    level: 'Beginner to Intermediate',
    
    price: 40000,
    originalPrice: 75000,
    discount: 27,
    currency: 'NGN',
    paymentOptions: ['Full payment'],
    
    keyFeatures: [
      'Hands-on lab environment',
      'Cloud platform experience (AWS)',
      'Real CI/CD pipeline setup',
      'Container orchestration',
      'Live mentorship sessions',
      'After-Training support',
    ],
    
    learningOutcomes: [
      'Master Linux command line',
      'Set up CI/CD pipelines with GitHub Actions',
      'Containerize applications with Docker',
      'Deploy to cloud platforms',
      'Monitor and scale applications',
      'Implement infrastructure as code',
      'Secure applications and infrastructure',
      'Troubleshoot production issues',
    ],
    
    keySellingPoints: [
      {
        title: 'High Demand Skills',
        description: 'DevOps engineers are in high demand with premium salaries',
        icon: TrendingUp,
      },
      {
        title: 'Hands-On Labs',
        description: 'Real infrastructure, not simulations',
        icon: Code,
      },
      {
        title: 'Cloud Certified',
        description: 'Preparation for AWS and cloud certifications',
        icon: Award,
      },
      {
        title: 'Production Ready',
        description: 'Skills you can apply immediately to real projects',
        icon: Zap,
      },
    ],
    
    projects: [
      {
        name: 'Linux Server Setup',
        description: 'Configure a secure Linux server from scratch',
        technologies: 'Linux, SSH, Security',
        duration: 'Week 1-2',
      },
      {
        name: 'Containerized Application',
        description: 'Build and deploy a Docker container to production',
        technologies: 'Docker, Docker Compose',
        duration: 'Week 2-3',
      },
      {
        name: 'CI/CD Pipeline',
        description: 'Automate testing and deployment with GitHub Actions',
        technologies: 'GitHub Actions, Automation',
        duration: 'Week 3-4',
      },
      {
        name: 'AWS Deployment',
        description: 'Deploy a full application stack to AWS',
        technologies: 'AWS, EC2, RDS, S3',
        duration: 'Week 4-6',
      },
      {
        name: 'Monitoring Dashboard',
        description: 'Set up monitoring and alerting for applications',
        technologies: 'Prometheus, Grafana, Logs',
        duration: 'Week 6-7',
      },
      {
        name: 'Infrastructure as Code',
        description: 'Manage infrastructure with Terraform or CloudFormation',
        technologies: 'Terraform, IaC',
        duration: 'Week 7-8',
      },
    ],
    
    curriculum: [
      {
        week: 'Week 1-2',
        title: 'Linux Fundamentals',
        topics: ['Linux basics', 'Command line mastery', 'File systems', 'User management'],
      },
      {
        week: 'Week 2-3',
        title: 'Containerization',
        topics: ['Docker concepts', 'Building images', 'Docker networking', 'Container management'],
      },
      {
        week: 'Week 3-4',
        title: 'Automation & CI/CD',
        topics: ['GitHub Actions', 'Pipeline automation', 'Testing automation', 'Deployment'],
      },
      {
        week: 'Week 4-6',
        title: 'Cloud Infrastructure',
        topics: ['AWS fundamentals', 'EC2 & networking', 'Databases', 'Storage solutions'],
      },
      {
        week: 'Week 6-7',
        title: 'Monitoring & Security',
        topics: ['Logging & monitoring', 'Security best practices', 'Troubleshooting', 'Performance tuning'],
      },
      {
        week: 'Week 7-8',
        title: 'Advanced Topics',
        topics: ['Infrastructure as Code', 'Kubernetes intro', 'Career prep', 'Capstone project'],
      },
    ],
    
    testimonials: [
      {
        name: 'David Kumar',
        role: 'DevOps Engineer',
        quote: 'This bootcamp gave me the confidence to handle production deployments. I got hired within 2 months.',
        image: createIllustration('Avatar 3', '#1F1E27', '#2C3A22'),
      },
      {
        name: 'Emma Wilson',
        role: 'Infrastructure Specialist',
        quote: 'The hands-on approach with real AWS accounts was invaluable. Now I manage infrastructure for a 50-person team.',
        image: createIllustration('Avatar 4', '#2B1A2B', '#3a2035'),
      },
    ],
    
    faq: [
      {
        question: 'Do I need Linux experience?',
        answer: 'No! We start from absolute beginner level. All you need is a computer and willingness to learn.',
      },
      {
        question: 'Is there an AWS cost?',
        answer: 'We provide AWS free tier credits to all students. Some advanced labs may cost $5-10 out of pocket.',
      },
      {
        question: 'What jobs can I get after?',
        answer: 'DevOps Engineer, Site Reliability Engineer (SRE), Infrastructure Engineer, Cloud Engineer roles.',
      },
      {
        question: 'How long until I\'m job-ready?',
        answer: 'Most students can land interviews within 4-6 weeks of completion with proper networking.',
      },
      {
        question: 'Is it only for tech backgrounds?',
        answer: 'Not at all. We have students from non-tech backgrounds who became successful DevOps engineers.',
      },
    ],
  },
  
  {
    id: 'data-analysis-bootcamp',
    slug: 'excel-data-analysis-bootcamp',
    title: 'Excel & Data Analysis Bootcamp',
    subtitle: 'Excel, SQL, Power BI & Analytics',
    description: 'Transform raw data into actionable insights. Master Excel, SQL queries, and create stunning dashboards with Power BI.',
    // heroImage: createIllustration('Data Analysis', '#1A1D24', '#2E2A22'),
    heroImage: excel,
    shortImage: createIllustration('Analytics', '#1B1E27', '#33384A'),
    
    duration: '5 weeks',
    pace: 'Weekends | 3 hours daily',
    level: 'Beginner to Intermediate',
    
    price: 30000,
    originalPrice: 80000,
    discount: 63,
    currency: 'NGN',
    paymentOptions: ['Full payment', 'Installment (3x)'],
    
    keyFeatures: [
      'Master Excel advanced functions',
      'Write SQL queries confidently',
      'Create interactive dashboards',
      'Real datasets & business cases',
      'Career in data analytics',
      'Lifetime resource access',
    ],
    
    learningOutcomes: [
      'Advanced Excel formulas & pivot tables',
      'Clean and prepare data for analysis',
      'Write SQL queries to extract insights',
      'Create dashboards with Power BI',
      'Statistical analysis fundamentals',
      'Present data-driven recommendations',
      'Automate reporting workflows',
      'Work with real business datasets',
    ],
    
    keySellingPoints: [
      {
        title: 'In-Demand Career',
        description: 'Data analysts are one of the most sought-after professionals',
        icon: TrendingUp,
      },
      {
        title: 'Real Data',
        description: 'Work with actual business datasets from multiple industries',
        icon: Database,
      },
      {
        title: 'Multiple Tools',
        description: 'Master Excel, SQL, and Power BI - the industry standard stack',
        icon: Zap,
      },
      {
        title: 'Flexible Pace',
        description: 'Shortest bootcamp at 3 hours daily, perfect for working professionals',
        icon: Users,
      },
    ],
    
    projects: [
      {
        name: 'Sales Data Analysis',
        description: 'Analyze sales trends and create performance reports',
        technologies: 'Excel, Pivot Tables, Charts',
        duration: 'Week 1-2',
      },
      {
        name: 'SQL Data Extraction',
        description: 'Query databases to extract and combine datasets',
        technologies: 'SQL, Joins, Aggregations',
        duration: 'Week 2-4',
      },
      {
        name: 'Customer Analytics Dashboard',
        description: 'Interactive Power BI dashboard showing customer insights',
        technologies: 'Power BI, Visualizations',
        duration: 'Week 4-5',
      },
      {
        name: 'Financial Performance Report',
        description: 'Build automated monthly performance reports',
        technologies: 'Excel, Power Query, VBA',
        duration: 'Week 5-6',
      },
      {
        name: 'Marketing Campaign Analysis',
        description: 'Analyze campaign effectiveness and ROI metrics',
        technologies: 'SQL, Excel, Power BI',
        duration: 'Week 6-7',
      },
      {
        name: 'Comprehensive Business Dashboard',
        description: 'Complete BI solution combining all learned skills',
        technologies: 'Excel, SQL, Power BI',
        duration: 'Week 7-8',
      },
    ],
    
    curriculum: [
      {
        week: 'Week 1',
        title: 'Excel Mastery',
        topics: ['Advanced formulas', 'Pivot tables', 'Data visualization', 'Dashboard basics'],
      },
      {
        week: 'Week 2-4',
        title: 'SQL Essentials',
        topics: ['SELECT & WHERE', 'JOINs & aggregations', 'Subqueries', 'Database design'],
      },
      {
        week: 'Week 4-5',
        title: 'Power BI Introduction',
        topics: ['Data import', 'Visualizations', 'Interactivity', 'Publishing reports'],
      },
      {
        week: 'Week 5-6',
        title: 'Advanced Analytics',
        topics: ['Statistical analysis', 'Forecasting', 'Data modeling', 'Performance tips'],
      },
      {
        week: 'Week 6-7',
        title: 'Real-World Projects',
        topics: ['Business case studies', 'Presentations', 'Storytelling with data'],
      },
      {
        week: 'Week 7-8',
        title: 'Career & Capstone',
        topics: ['Resume building', 'Portfolio projects', 'Interview preparation', 'Final project'],
      },
    ],
    
    testimonials: [
      {
        name: 'Lisa Anderson',
        role: 'Data Analyst',
        quote: 'I switched careers from HR to data analytics with this bootcamp. Now I make better decisions using data every day!',
        image: createIllustration('Avatar 5', '#2A1D2B', '#3a3035'),
      },
      {
        name: 'James Rodriguez',
        role: 'Business Analyst',
        quote: 'The SQL and Power BI skills boosted my value at work immediately. I got a 25% raise within 6 months.',
        image: createIllustration('Avatar 6', '#1D2B2A', '#2a3a35'),
      },
    ],
    
    faq: [
      {
        question: 'Do I need any technical background?',
        answer: 'No. We teach everything from the ground up. Basic computer skills are all you need.',
      },
      {
        question: 'Can I still work while doing this bootcamp?',
        answer: 'Absolutely! At just 3 hours daily, many students complete this while working full-time.',
      },
      {
        question: 'What jobs can I pursue after?',
        answer: 'Data Analyst, Business Analyst, Analytics Engineer, BI Developer, or transitions into data science.',
      },
      {
        question: 'Do I need to buy Power BI?',
        answer: 'No, Power BI has a free version. We cover both free and pro features.',
      },
      {
        question: 'Will Excel skills become obsolete?',
        answer: 'Excel is used in 90% of companies. Combined with SQL and Power BI, you\'re highly marketable.',
      },
    ],
  },
];

export default courseDetails;
