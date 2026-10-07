/**
 * Initial content for the CMS. Everything here is editable from /admin after seeding.
 * Names, numbers, testimonials and team members are PLACEHOLDERS — replace them with real data.
 */

export const services = [
  {
    slug: "software-development",
    title: "Software Development",
    icon: "code",
    shortDesc: "Custom, scalable and secure software engineered around the way your business actually works.",
    description:
      "From internal tools to enterprise platforms, we design and build custom software that removes bottlenecks and grows with you. Our engineers work in short, transparent sprints so you see real progress every week, and every line of code is reviewed, tested and documented.",
    features: [
      "Custom enterprise applications & ERPs",
      "API design, integrations & microservices",
      "Legacy system modernization",
      "Clean architecture with full documentation",
      "Code ownership transferred to you",
      "Long-term maintenance & SLA support",
    ],
    process: [
      { title: "Requirement Analysis", desc: "Workshops to map your workflows, users and success metrics." },
      { title: "Architecture", desc: "We choose the right stack and design for scale, security and cost." },
      { title: "Agile Sprints", desc: "Two-week sprints with demos, so you steer the product continuously." },
      { title: "Release & Handover", desc: "Production launch, documentation, training and ongoing support." },
    ],
    bn: { title: "সফটওয়্যার ডেভেলপমেন্ট", shortDesc: "আপনার ব্যবসার কাজের ধরন অনুযায়ী তৈরি কাস্টম, স্কেলেবল ও নিরাপদ সফটওয়্যার।" },
  },
  {
    slug: "resource-augmentation",
    title: "Resource Augmentation",
    icon: "users",
    shortDesc: "Pre-vetted engineers who plug into your team within days, not months.",
    description:
      "Scale your engineering capacity on demand. We provide senior developers, QA engineers, designers and DevOps specialists who work in your tools, your time zone overlap and your processes, with JarvX IT handling hiring, HR and retention.",
    features: [
      "Dedicated developers & full squads",
      "Onboarding in 5–10 business days",
      "Flexible monthly contracts",
      "Time-zone overlap with EU, UK, US & AU",
      "Replacement guarantee",
      "Transparent timesheets & reporting",
    ],
    process: [
      { title: "Skill Mapping", desc: "We understand the role, stack, seniority and team culture you need." },
      { title: "Shortlist", desc: "You interview pre-vetted candidates within 72 hours." },
      { title: "Onboarding", desc: "Engineers join your stand-ups, repos and tools." },
      { title: "Scale", desc: "Add or reduce capacity month to month as your roadmap changes." },
    ],
    bn: { title: "রিসোর্স অগমেন্টেশন", shortDesc: "যাচাই করা দক্ষ ইঞ্জিনিয়ার, যারা কয়েক দিনের মধ্যেই আপনার টিমে যোগ দেয়।" },
  },
  {
    slug: "qa-testing",
    title: "QA & Testing",
    icon: "shield",
    shortDesc: "Manual and automated testing that ships confident, bug-free releases.",
    description:
      "Quality is engineered, not inspected. Our QA team builds test strategies, automation suites and performance tests that catch regressions early and keep your release cadence fast.",
    features: [
      "Test strategy & test case design",
      "Web & mobile test automation (Playwright, Cypress, Appium)",
      "API & contract testing",
      "Performance & load testing",
      "Security & accessibility audits",
      "CI-integrated regression suites",
    ],
    process: [
      { title: "Audit", desc: "We assess current quality, coverage and risk areas." },
      { title: "Strategy", desc: "A test plan balancing manual exploration and automation." },
      { title: "Automate", desc: "Reliable suites wired into your CI/CD pipeline." },
      { title: "Report", desc: "Clear dashboards on defects, coverage and release readiness." },
    ],
    bn: { title: "কিউএ ও টেস্টিং", shortDesc: "ম্যানুয়াল ও অটোমেটেড টেস্টিংয়ের মাধ্যমে আত্মবিশ্বাসী, বাগ-মুক্ত রিলিজ।" },
  },
  {
    slug: "web-mobile-apps",
    title: "Web & Mobile Apps",
    icon: "devices",
    shortDesc: "Fast, beautiful web and mobile apps your users will love to use.",
    description:
      "We craft high-performance web apps with Next.js and React, and native-quality mobile apps with React Native and Flutter. Every product is designed mobile-first, accessible and optimised for Core Web Vitals.",
    features: [
      "Progressive web apps & SaaS dashboards",
      "iOS & Android with React Native / Flutter",
      "UI/UX design & interactive prototypes",
      "Payment gateway integration (bKash, Nagad, SSLCommerz, Stripe)",
      "Offline-first & real-time features",
      "App Store & Play Store launch",
    ],
    process: [
      { title: "UX Research", desc: "User journeys, wireframes and clickable prototypes." },
      { title: "UI Design", desc: "A design system that matches your brand." },
      { title: "Build", desc: "Shared code, native performance, weekly builds to test." },
      { title: "Launch", desc: "Store submission, analytics and growth iterations." },
    ],
    bn: { title: "ওয়েব ও মোবাইল অ্যাপ", shortDesc: "দ্রুত, সুন্দর এবং ব্যবহারবান্ধব ওয়েব ও মোবাইল অ্যাপ্লিকেশন।" },
  },
  {
    slug: "devops-cloud",
    title: "DevOps & Cloud",
    icon: "cloud",
    shortDesc: "Automated pipelines and resilient cloud infrastructure on AWS and GCP.",
    description:
      "We design cloud architectures that are secure, observable and cost-efficient. From containerisation and Kubernetes to CI/CD and infrastructure as code, we make deployments boring and uptime high.",
    features: [
      "AWS & GCP architecture and migration",
      "Docker & Kubernetes orchestration",
      "CI/CD with GitHub Actions & GitLab",
      "Infrastructure as Code (Terraform)",
      "Monitoring, logging & alerting",
      "Cloud cost optimisation",
    ],
    process: [
      { title: "Assess", desc: "Review current infrastructure, costs and risks." },
      { title: "Design", desc: "Target architecture with security and scaling built in." },
      { title: "Automate", desc: "Pipelines and IaC for repeatable, safe deploys." },
      { title: "Operate", desc: "24/7 monitoring, incident response and optimisation." },
    ],
    bn: { title: "ডেভঅপস ও ক্লাউড", shortDesc: "AWS ও GCP-তে স্বয়ংক্রিয় ডেপ্লয়মেন্ট এবং নির্ভরযোগ্য ক্লাউড অবকাঠামো।" },
  },
  {
    slug: "ai-solutions",
    title: "Prompt Engineering & AI Solutions",
    icon: "brain",
    shortDesc: "AI assistants, automation and LLM integrations that create measurable value.",
    description:
      "We help businesses put large language models to work safely: AI chat assistants trained on your knowledge, document processing, workflow automation and carefully engineered prompts with evaluation and guardrails.",
    features: [
      "Custom AI assistants & chatbots",
      "Retrieval-augmented generation (RAG) on your data",
      "Prompt engineering & evaluation",
      "Document extraction & classification",
      "AI workflow automation",
      "Responsible AI, privacy & guardrails",
    ],
    process: [
      { title: "Use-case Discovery", desc: "Find the workflows where AI creates real ROI." },
      { title: "Prototype", desc: "A working proof of concept in 2–3 weeks." },
      { title: "Evaluate", desc: "Measure accuracy, cost and latency against benchmarks." },
      { title: "Productionise", desc: "Secure deployment, monitoring and continuous tuning." },
    ],
    bn: { title: "প্রম্পট ইঞ্জিনিয়ারিং ও এআই সলিউশন", shortDesc: "এআই অ্যাসিস্ট্যান্ট, অটোমেশন ও এলএলএম ইন্টিগ্রেশন যা বাস্তব ফলাফল আনে।" },
  },
];

export const products = [
  {
    slug: "jarvx-commerce",
    name: "JarvX Commerce",
    category: "Ecommerce",
    tagline: "Launch a complete online store with local payments in a day.",
    description:
      "A ready-made ecommerce platform with storefront, admin dashboard, inventory, courier integration and bKash/Nagad/SSLCommerz payments. Built on the same engine that powers the Aporajita platform.",
    features: [
      "Responsive storefront with SEO",
      "bKash, Nagad, SSLCommerz & COD",
      "Inventory & multi-warehouse",
      "Pathao, RedX & Steadfast courier integration",
      "Coupons, flash sales & loyalty",
      "Sales analytics dashboard",
    ],
    monthlyPrice: 49,
    yearlyPrice: 490,
    videoUrl: "", // set a YouTube embed URL from the admin panel
    plans: [
      { name: "Starter", monthly: 49, yearly: 490, features: ["Up to 500 products", "1 admin user", "Standard theme", "Email support"] },
      { name: "Business", monthly: 99, yearly: 990, features: ["Unlimited products", "5 admin users", "Custom theme", "Courier integration", "Priority support"] },
      { name: "Enterprise", monthly: 249, yearly: 2490, features: ["Multi-vendor marketplace", "Unlimited users", "Dedicated server", "SLA & account manager"] },
    ],
  },
  {
    slug: "medicore-hms",
    name: "MediCore HMS",
    category: "Healthcare",
    tagline: "Hospital & clinic management, from appointment to invoice.",
    description:
      "An all-in-one hospital management system covering patient registration, appointments, EMR, pharmacy, lab and billing — with role-based access and a patient mobile app.",
    features: [
      "Patient registration & EMR",
      "Doctor scheduling & appointments",
      "Pharmacy & lab modules",
      "Billing, insurance & invoicing",
      "Patient mobile app",
      "Role-based access & audit logs",
    ],
    monthlyPrice: 79,
    yearlyPrice: 790,
    videoUrl: "", // set a YouTube embed URL from the admin panel
    plans: [
      { name: "Clinic", monthly: 79, yearly: 790, features: ["Up to 5 doctors", "Appointments & EMR", "Billing", "Email support"] },
      { name: "Hospital", monthly: 199, yearly: 1990, features: ["Unlimited doctors", "Pharmacy & lab", "Patient app", "Priority support"] },
      { name: "Network", monthly: 449, yearly: 4490, features: ["Multi-branch", "Custom integrations", "On-premise option", "Dedicated SLA"] },
    ],
  },
  {
    slug: "payflow-hr",
    name: "PayFlow HR",
    category: "SaaS",
    tagline: "HR, attendance and payroll built for Bangladeshi labour law.",
    description:
      "Automate attendance, leave, payroll, tax and provident fund with a modern HR suite. Integrates with biometric devices and generates bank-ready salary sheets.",
    features: [
      "Employee database & self-service",
      "Biometric & mobile attendance",
      "Leave & shift management",
      "Payroll, tax & PF automation",
      "Bank salary advice export",
      "Performance reviews",
    ],
    monthlyPrice: 39,
    yearlyPrice: 390,
    videoUrl: "", // set a YouTube embed URL from the admin panel
    plans: [
      { name: "Team", monthly: 39, yearly: 390, features: ["Up to 50 employees", "Attendance & leave", "Payroll", "Email support"] },
      { name: "Growth", monthly: 89, yearly: 890, features: ["Up to 300 employees", "Biometric integration", "Performance module", "Priority support"] },
      { name: "Enterprise", monthly: 199, yearly: 1990, features: ["Unlimited employees", "Multi-company", "Custom reports", "Dedicated SLA"] },
    ],
  },
  {
    slug: "fleettrack",
    name: "FleetTrack",
    category: "Transportation",
    tagline: "Real-time fleet tracking, dispatch and trip analytics.",
    description:
      "Track vehicles live, dispatch trips, manage drivers and fuel costs from one dashboard. Includes a driver mobile app and customer tracking links.",
    features: [
      "Live GPS tracking",
      "Trip dispatch & route optimisation",
      "Driver mobile app",
      "Fuel & maintenance logs",
      "Customer tracking links",
      "Trip & cost analytics",
    ],
    monthlyPrice: 59,
    yearlyPrice: 590,
    videoUrl: "", // set a YouTube embed URL from the admin panel
    plans: [
      { name: "Starter", monthly: 59, yearly: 590, features: ["Up to 20 vehicles", "Live tracking", "Driver app", "Email support"] },
      { name: "Fleet", monthly: 149, yearly: 1490, features: ["Up to 200 vehicles", "Dispatch & routing", "Analytics", "Priority support"] },
      { name: "Enterprise", monthly: 349, yearly: 3490, features: ["Unlimited vehicles", "API access", "Custom integrations", "Dedicated SLA"] },
    ],
  },
];

export const projects = [
  {
    slug: "aporajita-ecommerce-platform",
    title: "Aporajita Ecommerce Platform",
    client: "Aporajita",
    category: "Ecommerce",
    summary: "A multi-vendor marketplace empowering women entrepreneurs across Bangladesh.",
    problem:
      "Aporajita needed a marketplace where hundreds of small, women-led businesses could sell online without technical knowledge, with local payment methods and nationwide delivery.",
    solution:
      "We built a multi-vendor platform with a simple seller onboarding flow in Bangla, integrated bKash, Nagad and SSLCommerz, automated courier booking and commission settlement, and a blazing-fast Next.js storefront.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "AWS", "Docker"],
    results: [
      { label: "Active sellers", value: "1,200+" },
      { label: "Faster page loads", value: "3.4x" },
      { label: "Monthly orders", value: "45k" },
      { label: "Conversion uplift", value: "+38%" },
    ],
    serviceSlugs: ["software-development", "web-mobile-apps", "devops-cloud"],
    featured: true,
    year: 2025,
  },
  {
    slug: "health-app",
    title: "Health App",
    client: "NovaCare",
    category: "Mobile",
    summary: "A telemedicine app connecting patients with doctors over video in minutes.",
    problem: "Patients in district towns had to travel hours to see specialists, and clinics had no way to run remote consultations.",
    solution:
      "A cross-platform React Native app with appointment booking, secure video calls, e-prescriptions, health records and in-app payments, backed by a HIPAA-style audit trail.",
    tech: ["React Native", "Node.js", "Express", "MongoDB", "WebRTC", "GCP"],
    results: [
      { label: "Consultations", value: "120k+" },
      { label: "Avg. wait time", value: "6 min" },
      { label: "App rating", value: "4.8★" },
      { label: "Districts served", value: "52" },
    ],
    serviceSlugs: ["web-mobile-apps", "qa-testing"],
    featured: true,
    year: 2025,
  },
  {
    slug: "ott-streaming-service",
    title: "OTT Streaming Service",
    client: "Streamly",
    category: "SaaS",
    summary: "A Netflix-style video platform with adaptive streaming and subscriptions.",
    problem: "The client needed to launch a subscription streaming service that worked smoothly on low-bandwidth mobile networks.",
    solution:
      "We built an HLS adaptive-bitrate pipeline with CDN delivery, DRM, multi-profile accounts, subscription billing and apps for web, Android and smart TVs.",
    tech: ["Next.js", "Python", "Django", "PostgreSQL", "AWS", "Kubernetes"],
    results: [
      { label: "Subscribers", value: "250k" },
      { label: "Stream start", value: "<1.5s" },
      { label: "Uptime", value: "99.98%" },
      { label: "Buffering reduced", value: "-62%" },
    ],
    serviceSlugs: ["software-development", "devops-cloud"],
    featured: true,
    year: 2024,
  },
  {
    slug: "transportation-application",
    title: "Transportation Application",
    client: "TransitGo",
    category: "Mobile",
    summary: "Ride and parcel booking with live tracking for a growing logistics company.",
    problem: "Manual dispatch over phone calls caused delays, lost parcels and no visibility for customers.",
    solution:
      "Customer, driver and admin apps with live GPS tracking, automatic dispatch, route optimisation, digital proof of delivery and cashless payments.",
    tech: ["Flutter", "Node.js", "PostgreSQL", "Redis", "Google Maps", "Docker"],
    results: [
      { label: "Daily trips", value: "8,000+" },
      { label: "Dispatch time", value: "-70%" },
      { label: "On-time delivery", value: "96%" },
      { label: "Drivers onboarded", value: "1,500" },
    ],
    serviceSlugs: ["web-mobile-apps", "software-development"],
    featured: true,
    year: 2024,
  },
  {
    slug: "healthcare-dashboard",
    title: "Healthcare Dashboard",
    client: "MedAxis Hospitals",
    category: "Healthcare",
    summary: "Real-time operational analytics for a multi-branch hospital network.",
    problem: "Hospital management relied on weekly spreadsheets and had no real-time view of beds, staff or revenue.",
    solution:
      "A secure analytics dashboard aggregating data from HMS, lab and pharmacy systems with live bed occupancy, patient flow, revenue and staff metrics.",
    tech: ["React", "TypeScript", "Python", "PostgreSQL", "Docker", "AWS"],
    results: [
      { label: "Reporting time", value: "-90%" },
      { label: "Bed utilisation", value: "+22%" },
      { label: "Branches connected", value: "14" },
      { label: "Data refresh", value: "30s" },
    ],
    serviceSlugs: ["software-development", "ai-solutions"],
    featured: true,
    year: 2025,
  },
  {
    slug: "ecommerce-website",
    title: "Ecommerce Website",
    client: "Bengal Craft House",
    category: "Ecommerce",
    summary: "A premium lifestyle store with headless commerce and lightning-fast pages.",
    problem: "The brand's old store was slow on mobile and lost customers at checkout.",
    solution:
      "A headless Next.js storefront with a streamlined one-page checkout, local and international payments and a content-driven lookbook.",
    tech: ["Next.js", "Tailwind", "Laravel", "MySQL", "AWS"],
    results: [
      { label: "Lighthouse score", value: "98" },
      { label: "Checkout completion", value: "+44%" },
      { label: "Mobile revenue", value: "+71%" },
      { label: "Bounce rate", value: "-35%" },
    ],
    serviceSlugs: ["web-mobile-apps"],
    featured: true,
    year: 2024,
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    client: "Studio Nokshi",
    category: "Web",
    summary: "An award-style animated portfolio for a creative architecture studio.",
    problem: "The studio's work was beautiful but their website didn't reflect it or bring in enquiries.",
    solution:
      "An immersive WebGL portfolio with smooth scrolling, project storytelling and a CMS so the team can publish new work in minutes.",
    tech: ["Next.js", "Three.js", "GSAP", "TypeScript", "Vercel"],
    results: [
      { label: "Enquiries", value: "+3x" },
      { label: "Avg. session", value: "4m 20s" },
      { label: "Design awards", value: "2" },
      { label: "Performance", value: "60fps" },
    ],
    serviceSlugs: ["web-mobile-apps"],
    featured: true,
    year: 2025,
  },
];

export const clients = [
  "Aporajita", "NovaCare", "Streamly", "TransitGo", "MedAxis", "Bengal Craft", "Studio Nokshi", "Meghna Foods", "Padma Logistics", "Kotha Labs",
];

export const stats = [
  { key: "years", label: "Years Experience", value: 7, suffix: "+", bn: { label: "বছরের অভিজ্ঞতা" } },
  { key: "projects", label: "Projects Completed", value: 150, suffix: "+", bn: { label: "সম্পন্ন প্রজেক্ট" } },
  { key: "team", label: "Team Members", value: 45, suffix: "+", bn: { label: "টিম মেম্বার" } },
  { key: "clients", label: "Global Clients", value: 80, suffix: "+", bn: { label: "বিশ্বব্যাপী ক্লায়েন্ট" } },
];

export const testimonials = [
  { name: "Nusrat Jahan", role: "Founder", company: "Aporajita", rating: 5, quote: "JarvX IT understood our mission from day one. The platform they built lets thousands of women sell online with zero technical knowledge — and it has never gone down during a sale." },
  { name: "Daniel Brooks", role: "CTO", company: "Streamly", rating: 5, quote: "Their engineers felt like part of our core team. They solved video delivery problems that two previous vendors couldn't, and they did it ahead of schedule." },
  { name: "Dr. Farhan Ahmed", role: "Director of Operations", company: "MedAxis", rating: 5, quote: "The dashboard changed how we run our hospitals. Decisions that used to take a week now take a morning meeting." },
  { name: "Sofia Martins", role: "Product Lead", company: "TransitGo", rating: 5, quote: "Clear communication, honest estimates and a genuinely talented team. Our dispatch time dropped by 70% within two months of launch." },
  { name: "Tanvir Hasan", role: "Managing Director", company: "Bengal Craft", rating: 4, quote: "Our new store is unbelievably fast. Mobile revenue nearly doubled and the team still helps us every month with improvements." },
];

export const team = [
  { name: "Arif Rahman", role: "Founder & CEO" },
  { name: "Sadia Islam", role: "Head of Engineering" },
  { name: "Mahmud Hossain", role: "Lead Solutions Architect" },
  { name: "Tasnim Akter", role: "Head of Design" },
  { name: "Rafiul Karim", role: "DevOps Lead" },
  { name: "Nabila Chowdhury", role: "QA Manager" },
  { name: "Imran Kabir", role: "AI Engineer" },
  { name: "Farzana Yasmin", role: "Project Manager" },
];

export const faqs = [
  {
    question: "How much does a custom software project cost?",
    answer: "Most projects range from $3,000 for a focused MVP to $60,000+ for enterprise platforms. Use our project cost estimator for an instant range, then we'll send a detailed, fixed-scope proposal after a free discovery call.",
    bn: { question: "একটি কাস্টম সফটওয়্যার প্রজেক্টের খরচ কত?", answer: "ছোট MVP-র জন্য সাধারণত $৩,০০০ থেকে শুরু করে বড় এন্টারপ্রাইজ প্ল্যাটফর্মের জন্য $৬০,০০০+ পর্যন্ত হতে পারে। তাৎক্ষণিক ধারণার জন্য আমাদের কস্ট এস্টিমেটর ব্যবহার করুন।" },
  },
  {
    question: "How long does it take to build an app?",
    answer: "A typical MVP takes 6–10 weeks. Larger platforms are delivered in phases, with a usable release every few weeks so you can get feedback from real users early.",
    bn: { question: "একটি অ্যাপ তৈরি করতে কত সময় লাগে?", answer: "সাধারণত একটি MVP তৈরি করতে ৬–১০ সপ্তাহ লাগে। বড় প্ল্যাটফর্ম কয়েকটি ধাপে ডেলিভার করা হয়।" },
  },
  {
    question: "Do I own the source code?",
    answer: "Yes. Once the project is paid for, you own 100% of the source code, designs and documentation. We hand over repositories, credentials and deployment guides.",
    bn: { question: "সোর্স কোডের মালিকানা কি আমার থাকবে?", answer: "হ্যাঁ। পেমেন্ট সম্পন্ন হলে সোর্স কোড, ডিজাইন ও ডকুমেন্টেশনের ১০০% মালিকানা আপনার।" },
  },
  {
    question: "Do you work with international clients?",
    answer: "Absolutely. More than half of our clients are in the UK, EU, US, Middle East and Australia. We guarantee daily working-hour overlap and communicate over Slack, Teams or email.",
    bn: { question: "আপনারা কি আন্তর্জাতিক ক্লায়েন্টদের সাথে কাজ করেন?", answer: "অবশ্যই। আমাদের অর্ধেকেরও বেশি ক্লায়েন্ট যুক্তরাজ্য, ইউরোপ, যুক্তরাষ্ট্র, মধ্যপ্রাচ্য ও অস্ট্রেলিয়ার।" },
  },
  {
    question: "What happens after launch?",
    answer: "Every project includes a free support period (30–90 days). After that you can choose a monthly maintenance plan covering updates, monitoring, security patches and new features.",
    bn: { question: "লঞ্চের পর কী হয়?", answer: "প্রতিটি প্রজেক্টে ৩০–৯০ দিনের ফ্রি সাপোর্ট থাকে। এরপর মাসিক মেইনটেন্যান্স প্ল্যান নিতে পারেন।" },
  },
  {
    question: "Can you join our existing team instead of building from scratch?",
    answer: "Yes — through Resource Augmentation we provide dedicated engineers who work inside your team and processes, typically onboarded within 5–10 business days.",
    bn: { question: "আপনারা কি আমাদের বিদ্যমান টিমে যোগ দিতে পারেন?", answer: "হ্যাঁ। রিসোর্স অগমেন্টেশনের মাধ্যমে আমাদের ডেডিকেটেড ইঞ্জিনিয়াররা আপনার টিমে যুক্ত হতে পারে।" },
  },
];

export const jobs = [
  {
    slug: "integration-expert",
    title: "Integration Expert",
    department: "Engineering",
    type: "Full-time",
    experience: "4+ years",
    salary: "Competitive",
    summary: "Connect payment gateways, ERPs, CRMs and third-party APIs into reliable, observable integrations.",
    description:
      "You'll own the integration layer across our client projects — designing robust connectors between our platforms and payment providers, logistics partners, ERPs and CRMs. You care about idempotency, retries, observability and clear documentation.",
    responsibilities: [
      "Design and build integrations with REST, GraphQL, SOAP and webhook-based APIs",
      "Integrate local and global payment gateways (bKash, Nagad, SSLCommerz, Stripe)",
      "Build event-driven pipelines with queues and retries",
      "Write integration tests and monitoring",
      "Document APIs and mentor other engineers",
    ],
    requirements: [
      "4+ years of backend development experience",
      "Strong knowledge of HTTP, OAuth2 and webhooks",
      "Experience with Node.js or PHP/Laravel",
      "Familiarity with message queues (RabbitMQ, SQS, Redis)",
      "Excellent written English",
    ],
  },
  {
    slug: "senior-backend-developer-nodejs",
    title: "Senior Backend Developer (Node.js)",
    department: "Engineering",
    type: "Full-time",
    experience: "5+ years",
    salary: "Competitive",
    summary: "Architect and scale high-traffic Node.js services for ecommerce, healthcare and streaming products.",
    description:
      "Join our backend guild to design APIs and services that serve millions of requests. You'll make architecture decisions, review code, improve performance and help shape our engineering culture.",
    responsibilities: [
      "Design scalable services with Node.js, TypeScript and PostgreSQL",
      "Own performance, caching and database optimisation",
      "Lead code reviews and technical design discussions",
      "Collaborate with DevOps on CI/CD and observability",
      "Mentor mid-level engineers",
    ],
    requirements: [
      "5+ years with Node.js in production",
      "Deep knowledge of TypeScript, Express/NestJS",
      "SQL and NoSQL database design",
      "Experience with Docker and AWS/GCP",
      "Strong problem-solving and communication",
    ],
  },
  {
    slug: "full-stack-engineer-react-node",
    title: "Full Stack Engineer (React & Node)",
    department: "Engineering",
    type: "Full-time",
    experience: "3+ years",
    salary: "Competitive",
    summary: "Build beautiful interfaces and solid APIs end-to-end with React, Next.js and Node.js.",
    description:
      "You'll ship features across the stack — from pixel-perfect, animated React interfaces to the APIs and databases behind them — working closely with designers and product managers.",
    responsibilities: [
      "Build responsive UIs with React, Next.js and Tailwind",
      "Develop REST/GraphQL APIs with Node.js",
      "Write unit, integration and end-to-end tests",
      "Optimise Core Web Vitals and accessibility",
      "Take features from idea to production",
    ],
    requirements: [
      "3+ years of full stack experience",
      "Strong React and TypeScript skills",
      "Node.js and SQL experience",
      "Eye for design and detail",
      "Git and agile workflow experience",
    ],
  },
];

export const posts = [
  {
    slug: "choosing-the-right-tech-stack-2026",
    title: "Choosing the Right Tech Stack for Your Startup in 2026",
    category: "Engineering",
    tags: ["Next.js", "Architecture", "Startups"],
    featured: true,
    excerpt: "Your stack decides how fast you can ship, hire and scale. Here's the framework we use with every client.",
    content: `Picking a tech stack is one of the earliest — and most expensive to reverse — decisions a startup makes.

## Start from constraints, not trends

Before comparing frameworks, write down your real constraints: time to market, the team you can hire, expected traffic, compliance and budget.

## Our default stack

For most web products we recommend:

- **Next.js + TypeScript** for the frontend and server rendering
- **Node.js or Django** for APIs, depending on the team's strengths
- **PostgreSQL** as the primary database
- **Docker** and a managed cloud (AWS or GCP) for deployment

## When to break the defaults

Real-time collaboration, heavy data processing and ML workloads each change the picture. The key is to keep the core boring and invest complexity only where it creates competitive advantage.

## Conclusion

A good stack is one your team can move fast with for the next three years. If you'd like a second opinion, book a free architecture call with us.`,
  },
  {
    slug: "practical-guide-to-ai-assistants",
    title: "A Practical Guide to Building AI Assistants for Your Business",
    category: "AI",
    tags: ["AI", "LLM", "RAG"],
    featured: false,
    excerpt: "From prompt engineering to retrieval and evaluation — what it actually takes to ship a reliable AI assistant.",
    content: `AI assistants are easy to demo and hard to get right in production.

## 1. Pick a narrow, valuable job

The best assistants do one thing well: answer product questions, triage support tickets or extract data from documents.

## 2. Ground it in your data

Retrieval-augmented generation (RAG) lets the model answer from your own documents instead of guessing.

## 3. Engineer the prompt

Clear instructions, examples and output formats matter more than clever tricks.

## 4. Evaluate continuously

Build a test set of real questions and measure accuracy every time you change the prompt or model.

## 5. Add guardrails

Limit scope, handle sensitive data carefully and always give users a path to a human.`,
  },
  {
    slug: "ecommerce-conversion-bangladesh",
    title: "7 Ways to Increase Ecommerce Conversions in Bangladesh",
    category: "Business",
    tags: ["Ecommerce", "Conversion", "Payments"],
    featured: false,
    excerpt: "Local payment methods, trust signals and speed — lessons from building Aporajita and other stores.",
    content: `Selling online in Bangladesh has unique challenges. Here's what moved the needle for our clients.

1. **Offer bKash, Nagad and COD** — payment choice is the biggest conversion lever.
2. **Make pages fast on 4G** — every second of load time costs sales.
3. **Show delivery time and cost upfront.**
4. **Use Bangla where it helps** — especially for product details and support.
5. **Add social proof** — reviews and real photos build trust.
6. **Simplify checkout** — one page, phone-number first.
7. **Follow up** — SMS and WhatsApp order updates reduce cancellations.`,
  },
  {
    slug: "design-systems-that-scale",
    title: "Design Systems That Scale With Your Product",
    category: "Design",
    tags: ["Design", "UI", "Tailwind"],
    featured: false,
    excerpt: "How a small set of tokens and components keeps products consistent as teams grow.",
    content: `A design system is a shared language between design and engineering.

## Start with tokens

Colours, spacing, typography and radii defined once and used everywhere.

## Build components, not pages

Buttons, inputs and cards with clear variants make new pages fast to assemble.

## Document as you go

A living component library prevents drift and speeds up onboarding.`,
  },
];
