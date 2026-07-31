/**
 * All site copy lives here so the components stay purely presentational.
 * Sourced from Shivam's resume (July 2026).
 */

export const PROFILE = {
  name: "Shivam Sheth",
  handle: "shivam.dev",
  role: "Agentic AI / AI Infrastructure",
  tagline:
    "M.S. Computer Science at Northwestern. I build agentic AI systems and the infrastructure they run on - voice agents, payment rails, NLP screening pipelines, and the systems behind them.",
  email: "shivamsheth2027@u.northwestern.edu",
  phone: "+1 (773) 541-1355",
  linkedin: "https://linkedin.com/in/shivamsheth",
  github: "https://github.com/shivam-sheth",
  location: "Evanston, IL",
};

export const NAV = [
  { id: "now", label: "Now" },
  { id: "quests", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "scores", label: "Scores" },
  { id: "research", label: "Research" },
  { id: "loadout", label: "Skills" },
  { id: "player", label: "Player" },
  { id: "contact", label: "Contact" },
];

/** Hero strip: facts about Shivam, not project metrics (those live on the cards). */
export const STATS = [
  { value: "Evanston, IL", label: "Based in" },
  { value: "Agentic AI + AI Infra", label: "Focus" },
  { value: "M.S. CS '26 - 3.83 GPA", label: "Northwestern" },
  { value: "Guitar / Gym / Football", label: "Off the clock" },
];

/* ------------------------------------------------------------------ */
/* NOW — active roles                                                  */
/* ------------------------------------------------------------------ */

export const ACTIVE_ROLES = [
  {
    org: "Xpnse AI",
    badge: "XA",
    role: "Software Engineering Intern",
    period: "Jul 2026 - Sep 2026",
    meta: "Evanston, IL - Startup",
    accent: "cyan" as const,
    live: true,
    body: "Owning backend architecture and billing for an expense platform built for volunteer and nonprofit organizations.",
    bullets: [
      "Architected a Supabase backend with row-level security and multi-org RBAC (admin, treasurer, member), plus SSO/OAuth 2.0 flows hardening authentication, session handling, and data protection across the codebase.",
      "Integrated the Stripe API end-to-end for subscription billing - webhooks, idempotency, and failure recovery - owned the CI/CD deployment pipeline, and rebuilt the React frontend for improved UX and accessibility.",
    ],
    tags: ["Supabase", "Stripe", "OAuth 2.0", "RBAC", "React", "CI/CD"],
    href: "https://www.xpnse.ai/",
  },
  {
    org: "Northwestern University — FORGE",
    badge: "NF",
    role: "AI Research Engineer",
    period: "Jun 2026 - Aug 2026",
    meta: "Network for Collaborative Intelligence - Evanston, IL",
    accent: "magenta" as const,
    live: true,
    body: "Sole technical SPOC for Northwestern Medicine ophthalmology, building an AI applicant screening system.",
    bullets: [
      "Selected for FORGE, a competitive experiential AI program; serve as sole technical SPOC for the Northwestern Medicine ophthalmology department, driving requirements, deliverables, and stakeholder communication.",
      "Building an AI-powered application screening system that automates triage and ranking of ophthalmology-department applicants; designed NLP evaluation pipelines and scoring logic to surface strong candidates and cut manual review time.",
    ],
    tags: [
      "NLP",
      "Application Screening",
      "Scoring Pipelines",
      "Healthcare AI",
      "Stakeholder Management",
    ],
    href: "https://nnci.northwestern.edu/major-initiatives/forge.html",
  },
];

/* ------------------------------------------------------------------ */
/* EDUCATION                                                           */
/* ------------------------------------------------------------------ */

export const EDUCATION = [
  {
    school: "Northwestern University",
    badge: "NU",
    degree: "M.S. Computer Science - GPA 3.83/4.0",
    period: "Expected Dec 2026",
    location: "Evanston, IL",
    accent: "violet" as const,
    courses:
      "Distributed Systems, Data Science, Algorithms for Collective Decision Making, Practicum in Intelligent Systems, AI for Business & Science, HCI.",
  },
  {
    school: "D. J. Sanghvi College of Engineering",
    badge: "DJ",
    degree: "B.Tech Computer Science and Engineering",
    period: "Dec 2021 - May 2025",
    location: "Mumbai, India",
    accent: "amber" as const,
    courses:
      "Algorithms, Distributed Systems, Operating Systems, Computer Architecture, Software Engineering, Databases, Cloud Computing, Machine Learning.",
  },
];

/* ------------------------------------------------------------------ */
/* EXPERIENCE                                                          */
/* ------------------------------------------------------------------ */

export const EXPERIENCE = [
  {
    company: "Northwestern University",
    role: "Peer Mentor - CS 110, Intro to Computer Programming",
    location: "Evanston, IL",
    period: "Apr 2026 - Jun 2026",
    bullets: [
      "Mentored 20+ undergraduates through Python fundamentals, debugging, and algorithmic problem-solving.",
      "Aligned sessions with instructor learning goals across a wide range of student backgrounds and prior experience.",
    ],
    tags: ["Teaching", "Python", "Mentorship"],
  },
  {
    company: "Dell Technologies",
    role: "Software Development Engineer Intern",
    location: "Bangalore, India",
    period: "Jun 2024 - Aug 2024",
    bullets: [
      "Fine-tuned and deployed LLaMA and Mistral 7B generative models via REST APIs into CI/CD pipelines, optimising inference throughput and cutting token overhead ~30% across 500+ internal users at sub-second latency.",
      "Engineered Python and C++ automation pipelines across 12+ business processes using modular design, Git-based code review, and Agile/Scrum workflows, saving 200+ engineer-hours per month.",
      "Integrated JIRA with Power BI via REST APIs for real-time operational dashboards and authored troubleshooting scripts.",
    ],
    tags: ["LLaMA", "Mistral 7B", "Python", "C++", "CI/CD", "Power BI"],
  },
  {
    company: "Jai Bhuvan Developers",
    role: "AI Developer (Part-time)",
    location: "Mumbai, India",
    period: "May 2023 - May 2024",
    bullets: [
      "Architected a full-stack AI analytics platform in Node.js, Express, and PostgreSQL with RESTful microservice APIs deployed on GCP, boosting demand-forecasting accuracy 15% via time-series ML models.",
      "Co-built OpenCV and PyTorch vision pipelines analysing 5,000+ site images, automating defect detection at 87% precision.",
      "Built an NLP pipeline processing 200+ contracts, cutting legal review time 40%.",
    ],
    tags: ["Node.js", "PostgreSQL", "GCP", "OpenCV", "PyTorch", "NLP"],
  },
];

/* ------------------------------------------------------------------ */
/* PROJECTS                                                            */
/* ------------------------------------------------------------------ */

export type Project = {
  name: string;
  status: "NEW" | "LIVE" | "SHIPPED";
  stack: string;
  summary: string;
  bullets: string[];
  links: { label: string; href: string }[];
  accent: string;
  /** Preview screenshot shown on the card. */
  image?: string;
  /** If set, the preview can swap to a live embedded iframe of the real site. */
  demo?: string;
  /** Featured projects span the full grid width. */
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    name: "AiDHD - AI Group-Planning Concierge",
    status: "NEW",
    stack: "Next.js - Gemini - ElevenLabs - Webhooks - Supabase - Vercel",
    summary:
      "A live end-to-end trip and nightlife planner that runs the whole loop: search, cards, pay, confirm.",
    bullets: [
      "Preferences arrive via WhatsApp and iMessage webhooks; planning runs on Gemini with a live ElevenLabs voice agent painting result cards as tools return.",
      "Wired real inventory from Duffel and Ticketmaster with secure Prava checkout - no card numbers ever reach the LLM - behind a Supabase AES-GCM PII vault.",
      "Added a reel-to-plan path that OCR-decodes an Instagram reel into a fully costed itinerary.",
    ],
    links: [
      { label: "Live agent", href: "https://aidhd-omega.vercel.app/agent" },
    ],
    accent: "#ff3d8b",
    image: "/assets/preview-aidhd.png",
    demo: "https://aidhd-omega.vercel.app/agent",
    featured: true,
  },
  {
    name: "LeanPrompt",
    status: "LIVE",
    stack: "TypeScript - NLP - Chrome Extension - Next.js",
    summary:
      "Grammarly for AI prompts. A Chrome extension that rewrites your prompt before you hit send, into a shorter version that means the same thing.",
    bullets: [
      "Generative AI prompt compression engine cutting token usage 40-75% via semantic pattern matching that preserves intent.",
      "Trained on 30,000+ examples across 25 categories, directly reducing LLM inference costs at scale.",
      "Surfaces the token, cost, and CO2 saving on every rewrite so the impact is visible in-line.",
    ],
    links: [
      { label: "Live site", href: "https://lean-prompt.vercel.app/" },
      { label: "Try the demo", href: "https://lean-prompt.vercel.app/#demo" },
    ],
    accent: "#35f2d4",
    image: "/assets/preview-leanprompt.png",
    demo: "https://lean-prompt.vercel.app/",
  },
  {
    name: "TrendThread - AI Merch Generator",
    status: "LIVE",
    stack: "Python - Flask - LLM APIs - Printify API - Docker",
    summary:
      "An AI merch generator that takes a trending topic all the way to a published Etsy listing, with a human in the loop.",
    bullets: [
      "End-to-end pipeline ingesting trending topics, generating designs via LLM and image APIs, and auto-publishing to a live Etsy storefront via Printify.",
      "Trend detection to design generation to product publishing, gated by swipe-based human approval.",
      "Deployed in a Dockerized cloud environment with CI/CD.",
    ],
    links: [
      { label: "Storefront", href: "https://www.etsy.com/shop/TrendThread338" },
      { label: "Website", href: "https://about-trend-thread.vercel.app/" },
      {
        label: "Repo",
        href: "https://github.com/AndresArencibia2027/TrendThread",
      },
    ],
    accent: "#ffc53d",
    image: "/assets/preview-trendthread.png",
    demo: "https://about-trend-thread.vercel.app/",
  },
  {
    name: "Amazon Data Scraper: Power BI Pipeline",
    status: "SHIPPED",
    stack: "Python - SQL - ETL - Power BI - AWS - pytest",
    summary:
      "An automated ETL pipeline turning scraped Amazon product data into real-time Power BI dashboards.",
    bullets: [
      "Ingests 100K+ Amazon product records with pytest-validated transformation logic.",
      "Integrated with Power BI for real-time dashboards, reducing manual processing time ~70% end to end.",
    ],
    links: [
      {
        label: "Repo",
        href: "https://github.com/Shivam-Sheth/Scrapper-DataVisualization",
      },
    ],
    accent: "#8b6bff",
    image: "/assets/image-d08b70a0-5b50-4ac2-ac9e-3bcef998e890.png",
  },
];

/* ------------------------------------------------------------------ */
/* HIGH SCORES — hackathons                                            */
/* ------------------------------------------------------------------ */

export const HIGH_SCORES = [
  {
    rank: "1ST",
    event: "DATAHACK 1.0",
    detail: "Enterprise AI/ML system design and innovation",
    accent: "#ffc53d",
  },
  {
    rank: "1ST",
    event: "GDSC Winter of Code",
    detail: "Google Developer Student Clubs build sprint",
    accent: "#ffc53d",
  },
  {
    rank: "2ND RU",
    event: "National Hackathon",
    detail: "AI surveillance and patrol optimisation",
    accent: "#e8ecff",
  },
  {
    rank: "2ND RU",
    event: "Rajasthan Police Hackathon",
    detail: "AI-driven surveillance and patrol optimisation",
    accent: "#e8ecff",
  },
  {
    rank: "3RD",
    event: "TECHNOVATE",
    detail: "Systems-oriented ML prototype built under a tight timeline",
    accent: "#ff9d4d",
  },
  {
    rank: "3RD",
    event: "Data2Knowledge",
    detail: "Data-to-insight pipeline design and presentation",
    accent: "#ff9d4d",
  },
  {
    rank: "48TH",
    event: "Amazon ML Challenge 2023",
    detail: "Top 0.5% globally out of 10,000+ participants",
    accent: "#35f2d4",
  },
];

/* ------------------------------------------------------------------ */
/* LEADERSHIP                                                          */
/* ------------------------------------------------------------------ */

export const LEADERSHIP = [
  {
    role: "VP & Co-Founder",
    org: "DJS ISACA Cybersecurity Chapter",
    detail:
      "Scaled the chapter to 100+ members and ran 8+ security and systems workshops.",
    accent: "#8b6bff",
  },
  {
    role: "Volunteer Teacher",
    org: "Teach for India",
    detail:
      "Taught IoT and robotics to underprivileged students.",
    accent: "#35f2d4",
  },
];

/* ------------------------------------------------------------------ */
/* RESEARCH — publications                                             */
/* ------------------------------------------------------------------ */

export type Paper = {
  title: string;
  venue?: string;
  year: string;
  status: "PUBLISHED" | "PREPRINT" | "IN REVIEW";
  authors?: string;
  abstract?: string;
  featured?: boolean;
  links: { label: string; href: string }[];
};

export const RESEARCH: Paper[] = [
  {
    title: "IoT, AI-Enabled Partograph System",
    venue: "IEEE International Conference",
    year: "2023",
    status: "PUBLISHED",
    featured: true,
    abstract:
      "Real-time maternal monitoring combining IoT sensors with predictive ML, delivering an 18% improvement in complication detection.",
    links: [],
  },
  {
    title: "Multi-Modal GNNs for Fake News Detection",
    year: "2023",
    status: "PUBLISHED",
    abstract:
      "A graph neural network architecture fusing textual, visual, and temporal-spatial signals, achieving a 12.4% F1 improvement over state of the art.",
    links: [],
  },
];

/* ------------------------------------------------------------------ */
/* LOADOUT — skills                                                    */
/* ------------------------------------------------------------------ */

export const LOADOUT = [
  {
    slot: "Languages",
    items: ["Python", "Go", "Java", "C++", "JavaScript", "TypeScript"],
    accent: "#35f2d4",
  },
  {
    slot: "AI + Automation",
    items: [
      "LLaMA",
      "Mistral 7B",
      "Gemini",
      "ElevenLabs",
      "Prompt Engineering",
      "Token Optimization",
      "Selenium",
    ],
    accent: "#ff3d8b",
  },
  {
    slot: "Cloud + Systems",
    items: [
      "AWS",
      "GCP",
      "Vercel",
      "Docker",
      "Kubernetes",
      "Hadoop",
      "Spark",
      "Microservices",
    ],
    accent: "#8b6bff",
  },
  {
    slot: "Databases",
    items: ["PostgreSQL", "Supabase", "MongoDB", "SQL", "NoSQL"],
    accent: "#ffc53d",
  },
  {
    slot: "Backend + Security",
    items: [
      "Node.js",
      "Next.js",
      "Webhooks",
      "Stripe",
      "OAuth 2.0",
      "SSO",
      "IAM",
      "AES-GCM",
    ],
    accent: "#9dff4d",
  },
  {
    slot: "DevOps + Testing",
    items: [
      "GitHub Actions",
      "pytest",
      "unittest",
      "Jest",
      "Power BI",
      "Agile/Scrum",
      "JIRA",
    ],
    accent: "#35f2d4",
  },
];

/* ------------------------------------------------------------------ */
/* Roles sought                                                        */
/* ------------------------------------------------------------------ */

export const OPEN_TO = [
  "Software Engineer",
  "Agentic AI Engineer",
  "AI Infrastructure",
  "ML Engineer",
  "Backend Engineer",
];

export const MARQUEE = [
  "AGENTIC AI",
  "AI INFRASTRUCTURE",
  "LLM SYSTEMS",
  "DISTRIBUTED SYSTEMS",
  "FULL-STACK",
  "DEEP LEARNING",
];
