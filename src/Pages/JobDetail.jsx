import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  CheckCircle2,
  Circle,
  Heart,
  Shield,
  Wifi,
  Plane,
  GraduationCap,
  Coffee,
  Baby,
  DollarSign,
  Globe,
  Users,
  Building2,
  CalendarDays,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  X,
} from "lucide-react";

/* ===========================
    Animation Variants
=========================== */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const cardHover = {
  y: -6,
  scale: 1.01,
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

/* ===========================
    Inline Mock Job Data
=========================== */

const jobDetailData = {
  1: {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Google",
    companyLogo: "/Companies/google.svg",
    location: "Mountain View, CA",
    salary: "$180K – $250K",
    salaryPeriod: "per year",
    type: "Full Time",
    mode: "Hybrid",
    posted: "2 days ago",
    applicants: 142,
    closingDays: 12,
    tags: ["React", "TypeScript", "GraphQL"],
    featured: true,
    industry: "Technology",
    companySize: "10,000+",
    founded: "1998",
    website: "google.com",
    description: [
      "Google is seeking a Senior Frontend Engineer to join our Cloud Platform team. You'll work on building the next generation of developer tools and infrastructure used by millions of developers worldwide.",
      "In this role, you'll collaborate with cross-functional teams of designers, product managers, and engineers to deliver beautiful, performant user interfaces that make complex cloud technologies accessible to everyone.",
      "You'll have the opportunity to shape the frontend architecture of our products, mentor junior engineers, and drive best practices across the organization. This is a high-impact role where your work will directly influence how developers interact with Google Cloud.",
    ],
    responsibilities: [
      "Design and implement complex, high-performance user interfaces using React and TypeScript",
      "Lead frontend architecture decisions and establish best practices across the team",
      "Collaborate with UX designers to translate wireframes and mockups into pixel-perfect implementations",
      "Mentor junior engineers through code reviews, pair programming, and technical guidance",
      "Optimize application performance, accessibility, and cross-browser compatibility",
      "Drive the adoption of modern frontend technologies and development workflows",
    ],
    requirements: [
      "7+ years of professional experience in frontend development",
      "Expert-level proficiency in React, TypeScript, and modern JavaScript (ES2020+)",
      "Strong understanding of web fundamentals: HTML5, CSS3, browser APIs",
      "Experience with GraphQL, REST APIs, and state management solutions (Redux, Zustand, or similar)",
      "Proven track record of delivering large-scale, production-grade web applications",
      "Excellent communication and collaboration skills in a cross-functional environment",
    ],
    niceToHave: [
      "Experience with Web Components, Lit, or similar frameworks",
      "Contributions to open-source projects or technical publications",
      "Familiarity with Google Cloud Platform or similar cloud services",
      "Experience with design systems and component library development",
    ],
    benefits: [
      { icon: Heart, label: "Health Insurance", desc: "Premium medical, dental & vision" },
      { icon: DollarSign, label: "401(k) Match", desc: "Up to 6% employer match" },
      { icon: Wifi, label: "Remote Flexibility", desc: "3 days in-office, 2 remote" },
      { icon: Plane, label: "Unlimited PTO", desc: "Flexible vacation policy" },
      { icon: GraduationCap, label: "Learning Budget", desc: "$5,000 annual stipend" },
      { icon: Coffee, label: "Free Meals", desc: "On-campus dining & snacks" },
      { icon: Baby, label: "Parental Leave", desc: "24 weeks paid leave" },
      { icon: Shield, label: "Life Insurance", desc: "2x salary coverage" },
    ],
    skills: ["React", "TypeScript", "GraphQL", "Next.js", "Tailwind CSS", "Jest"],
  },
  2: {
    id: 2,
    title: "Product Designer",
    company: "Airbnb",
    companyLogo: "/Companies/airbnb.svg",
    location: "San Francisco, CA",
    salary: "$150K – $200K",
    salaryPeriod: "per year",
    type: "Full Time",
    mode: "Remote",
    posted: "1 day ago",
    applicants: 89,
    closingDays: 18,
    tags: ["Figma", "Design Systems", "Prototyping"],
    featured: true,
    industry: "Travel & Hospitality",
    companySize: "5,000+",
    founded: "2008",
    website: "airbnb.com",
    description: [
      "Airbnb is looking for a talented Product Designer to help shape the future of travel. You'll work on our core booking experience, designing intuitive interfaces that connect millions of guests with unique stays around the world.",
      "You'll be part of a world-class design team that values craft, empathy, and bold thinking. Your designs will be seen and used by hundreds of millions of people across every continent.",
      "This is a fully remote position where you'll collaborate with product managers, engineers, and researchers to deliver exceptional user experiences that embody the Airbnb brand.",
    ],
    responsibilities: [
      "Lead end-to-end design for key product features across web and mobile platforms",
      "Create wireframes, prototypes, and high-fidelity mockups using Figma and other design tools",
      "Conduct user research and usability testing to inform design decisions",
      "Contribute to and evolve the Airbnb design system for consistency at scale",
      "Present design concepts and rationale to stakeholders and leadership",
      "Collaborate closely with engineers to ensure pixel-perfect implementation",
    ],
    requirements: [
      "5+ years of product design experience, ideally in consumer-facing applications",
      "Expert-level proficiency in Figma and modern design tools",
      "Strong portfolio demonstrating end-to-end design processes and shipped products",
      "Deep understanding of interaction design, visual design, and design systems",
      "Experience with user research methodologies and data-driven design",
      "Excellent communication and storytelling skills",
    ],
    niceToHave: [
      "Experience designing for marketplace or travel products",
      "Familiarity with motion design and micro-interactions (After Effects, Principle)",
      "Background in front-end development (HTML, CSS, React)",
    ],
    benefits: [
      { icon: Heart, label: "Health Insurance", desc: "Full family coverage" },
      { icon: DollarSign, label: "Equity Package", desc: "Competitive RSU grants" },
      { icon: Wifi, label: "Fully Remote", desc: "Work from anywhere" },
      { icon: Plane, label: "Travel Credit", desc: "$2,000 annual Airbnb credit" },
      { icon: GraduationCap, label: "Growth Fund", desc: "$3,000 learning budget" },
      { icon: Coffee, label: "Home Office", desc: "$1,500 setup stipend" },
      { icon: Baby, label: "Parental Leave", desc: "22 weeks paid leave" },
      { icon: Shield, label: "Wellness", desc: "Mental health support" },
    ],
    skills: ["Figma", "Prototyping", "Design Systems", "User Research"],
  },
  3: {
    id: 3,
    title: "ML Engineer",
    company: "Meta",
    companyLogo: "/Companies/meta.svg",
    location: "New York, NY",
    salary: "$200K – $300K",
    salaryPeriod: "per year",
    type: "Full Time",
    mode: "Hybrid",
    posted: "3 days ago",
    applicants: 203,
    closingDays: 8,
    tags: ["Python", "PyTorch", "LLMs"],
    featured: false,
    industry: "Technology",
    companySize: "50,000+",
    founded: "2004",
    website: "meta.com",
    description: [
      "Meta is searching for a Machine Learning Engineer to work on cutting-edge AI systems that power our family of products used by billions of people. You'll push the boundaries of what's possible with large language models and generative AI.",
      "You'll join a team of world-class researchers and engineers building the next generation of AI infrastructure. Your work will directly impact products like Instagram, WhatsApp, and the Metaverse.",
      "This is an opportunity to work at the forefront of AI research and deploy models at unprecedented scale, shaping the future of human-computer interaction.",
    ],
    responsibilities: [
      "Design, train, and optimize large-scale machine learning models for production use",
      "Develop novel architectures for LLMs and generative AI systems",
      "Build robust ML pipelines for data processing, training, and inference",
      "Collaborate with research scientists to translate papers into production-ready systems",
      "Optimize model performance for latency, throughput, and cost efficiency",
      "Mentor team members and contribute to Meta's internal ML platform",
    ],
    requirements: [
      "5+ years of experience in machine learning engineering",
      "Expert-level proficiency in Python and deep learning frameworks (PyTorch preferred)",
      "Strong foundation in mathematics: linear algebra, calculus, probability, and statistics",
      "Experience training and deploying models at scale (billions of parameters)",
      "Published research in top ML conferences (NeurIPS, ICML, ICLR) is a plus",
      "MS or PhD in Computer Science, Machine Learning, or related field",
    ],
    niceToHave: [
      "Experience with transformer architectures and attention mechanisms",
      "Familiarity with distributed training frameworks (FSDP, DeepSpeed)",
      "Background in NLP, computer vision, or recommendation systems",
      "Contributions to open-source ML frameworks",
    ],
    benefits: [
      { icon: Heart, label: "Health & Wellness", desc: "Comprehensive medical coverage" },
      { icon: DollarSign, label: "RSU Package", desc: "Generous equity compensation" },
      { icon: Wifi, label: "Hybrid Work", desc: "Flexible in-office schedule" },
      { icon: Plane, label: "Unlimited PTO", desc: "Flexible vacation policy" },
      { icon: GraduationCap, label: "Conference Budget", desc: "Attend top AI conferences" },
      { icon: Coffee, label: "Campus Perks", desc: "Free meals & amenities" },
      { icon: Baby, label: "Family Leave", desc: "20 weeks paid leave" },
      { icon: Shield, label: "Life & Disability", desc: "Comprehensive coverage" },
    ],
    skills: ["Python", "PyTorch", "TensorFlow", "LLMs", "CUDA", "MLOps"],
  },
  4: {
    id: 4,
    title: "DevOps Engineer",
    company: "Amazon",
    companyLogo: "/Companies/amazon.svg",
    location: "Seattle, WA",
    salary: "$160K – $220K",
    salaryPeriod: "per year",
    type: "Full Time",
    mode: "On Site",
    posted: "5 hours ago",
    applicants: 67,
    closingDays: 21,
    tags: ["AWS", "Kubernetes", "Terraform"],
    featured: true,
    industry: "E-Commerce & Cloud",
    companySize: "100,000+",
    founded: "1994",
    website: "amazon.com",
    description: [
      "Amazon Web Services is hiring a DevOps Engineer to help build and maintain the infrastructure that powers the world's largest cloud platform. You'll work on systems that serve millions of requests per second.",
      "In this role, you'll design and implement CI/CD pipelines, manage container orchestration at massive scale, and ensure the reliability of services that businesses worldwide depend on.",
      "You'll be part of a team that sets the standard for operational excellence, working with cutting-edge cloud technologies and pioneering best practices in infrastructure as code.",
    ],
    responsibilities: [
      "Design, build, and maintain scalable CI/CD pipelines for microservices architectures",
      "Manage and optimize Kubernetes clusters serving production workloads at scale",
      "Implement infrastructure as code using Terraform, CloudFormation, and CDK",
      "Monitor system health and implement automated incident response procedures",
      "Drive improvements in deployment frequency, lead time, and mean time to recovery",
      "Collaborate with development teams to improve developer experience and productivity",
    ],
    requirements: [
      "5+ years of experience in DevOps, SRE, or infrastructure engineering",
      "Expert-level knowledge of AWS services (EC2, ECS, EKS, Lambda, S3, RDS, etc.)",
      "Strong experience with Kubernetes, Docker, and container orchestration",
      "Proficiency in Infrastructure as Code (Terraform, CloudFormation)",
      "Experience with monitoring and observability tools (Prometheus, Grafana, Datadog)",
      "Strong scripting skills in Python, Bash, or Go",
    ],
    niceToHave: [
      "AWS Solutions Architect or DevOps Engineer certification",
      "Experience with service mesh technologies (Istio, Envoy)",
      "Familiarity with chaos engineering principles and tools",
      "Background in security engineering and compliance automation",
    ],
    benefits: [
      { icon: Heart, label: "Health Coverage", desc: "Day-one medical benefits" },
      { icon: DollarSign, label: "RSU Vesting", desc: "4-year vesting schedule" },
      { icon: Wifi, label: "On-Site Perks", desc: "Modern campus facilities" },
      { icon: Plane, label: "Paid Time Off", desc: "Competitive vacation policy" },
      { icon: GraduationCap, label: "Career Choice", desc: "Tuition reimbursement program" },
      { icon: Coffee, label: "Employee Discount", desc: "10% off Amazon purchases" },
    ],
    skills: ["AWS", "Kubernetes", "Terraform", "Docker", "Python", "CI/CD"],
  },
  5: {
    id: 5,
    title: "iOS Developer",
    company: "Apple",
    companyLogo: "/Companies/apple.svg",
    location: "Cupertino, CA",
    salary: "$175K – $240K",
    salaryPeriod: "per year",
    type: "Full Time",
    mode: "On Site",
    posted: "4 days ago",
    applicants: 156,
    closingDays: 10,
    tags: ["Swift", "SwiftUI", "Objective-C"],
    featured: false,
    industry: "Consumer Electronics",
    companySize: "100,000+",
    founded: "1976",
    website: "apple.com",
    description: [
      "Apple is looking for a passionate iOS Developer to join the team building the apps that define the iPhone experience. You'll work on features used by over a billion people worldwide.",
      "You'll collaborate with world-class designers and engineers to create intuitive, delightful experiences that set the standard for mobile development. Your code will ship on every iPhone, iPad, and Mac.",
      "This is a rare opportunity to work on Apple's first-party applications, leveraging the latest iOS frameworks and hardware capabilities before they're available to the public.",
    ],
    responsibilities: [
      "Design and develop new features for Apple's flagship iOS applications using Swift and SwiftUI",
      "Write clean, testable, and well-documented code following Apple's engineering standards",
      "Optimize app performance, memory usage, and battery consumption",
      "Collaborate with the Human Interface Design team on new interaction paradigms",
      "Implement accessibility features to ensure inclusive user experiences",
      "Debug and resolve complex issues across iOS, iPadOS, and macOS platforms",
    ],
    requirements: [
      "5+ years of professional iOS development experience",
      "Expert proficiency in Swift and deep knowledge of the iOS SDK",
      "Strong experience with SwiftUI, UIKit, and Apple's modern concurrency model",
      "Understanding of Apple's Human Interface Guidelines and design principles",
      "Experience with Core Data, Core Animation, and other Apple frameworks",
      "BS/MS in Computer Science or equivalent practical experience",
    ],
    niceToHave: [
      "Experience with Objective-C and legacy codebase migration",
      "Familiarity with Metal, ARKit, or Core ML frameworks",
      "Published apps on the App Store with significant user base",
      "Contributions to the Swift or iOS open-source community",
    ],
    benefits: [
      { icon: Heart, label: "Health & Dental", desc: "Comprehensive family coverage" },
      { icon: DollarSign, label: "RSU Grants", desc: "Competitive equity package" },
      { icon: Wifi, label: "Campus Life", desc: "Apple Park amenities" },
      { icon: Plane, label: "PTO & Holidays", desc: "Generous time off policy" },
      { icon: GraduationCap, label: "Education", desc: "Tuition assistance program" },
      { icon: Coffee, label: "Fitness Center", desc: "State-of-the-art gym" },
      { icon: Baby, label: "Family Support", desc: "18 weeks parental leave" },
      { icon: Shield, label: "Product Discount", desc: "25% off Apple products" },
    ],
    skills: ["Swift", "SwiftUI", "UIKit", "Xcode", "Core Data"],
  },
  6: {
    id: 6,
    title: "Data Engineer",
    company: "Spotify",
    companyLogo: "/Companies/spotify.svg",
    location: "Stockholm, Sweden",
    salary: "$140K – $190K",
    salaryPeriod: "per year",
    type: "Full Time",
    mode: "Remote",
    posted: "1 day ago",
    applicants: 98,
    closingDays: 15,
    tags: ["Spark", "Python", "dbt"],
    featured: true,
    industry: "Music & Entertainment",
    companySize: "8,000+",
    founded: "2006",
    website: "spotify.com",
    description: [
      "Spotify is hiring a Data Engineer to build the data infrastructure that powers personalization for 600+ million listeners. You'll work on the pipelines behind Discover Weekly, Release Radar, and Spotify Wrapped.",
      "You'll join a team obsessed with data quality, scalability, and developer experience. Your work will enable data scientists and analysts across the company to make data-driven decisions at scale.",
      "This is a fully remote role offering the flexibility to work from anywhere while being part of one of the most innovative engineering cultures in the world.",
    ],
    responsibilities: [
      "Design and build scalable data pipelines processing petabytes of streaming data daily",
      "Develop and maintain data models using dbt for analytics and ML feature stores",
      "Optimize Apache Spark jobs for performance and cost efficiency on cloud infrastructure",
      "Implement data quality monitoring and alerting systems",
      "Collaborate with data scientists to productionize ML models and experiments",
      "Contribute to Spotify's open-source data tools and internal platform",
    ],
    requirements: [
      "4+ years of experience as a Data Engineer or similar role",
      "Strong proficiency in Python and SQL for data processing and transformation",
      "Experience with Apache Spark, Apache Beam, or similar distributed processing frameworks",
      "Knowledge of data warehousing concepts and tools (BigQuery, Snowflake, Redshift)",
      "Experience with workflow orchestration tools (Airflow, Luigi, Prefect)",
      "Understanding of data modeling, ETL best practices, and data governance",
    ],
    niceToHave: [
      "Experience with real-time streaming technologies (Kafka, Flink, Pub/Sub)",
      "Familiarity with dbt for data transformation and testing",
      "Background in music tech, recommendation systems, or media analytics",
    ],
    benefits: [
      { icon: Heart, label: "Health Insurance", desc: "Comprehensive global coverage" },
      { icon: DollarSign, label: "Equity", desc: "RSU grants with annual refresh" },
      { icon: Wifi, label: "Work From Anywhere", desc: "Fully distributed team" },
      { icon: Plane, label: "Flexible PTO", desc: "Generous vacation policy" },
      { icon: GraduationCap, label: "Learning", desc: "Annual development budget" },
      { icon: Coffee, label: "Premium Spotify", desc: "Free family plan forever" },
      { icon: Baby, label: "Parental Leave", desc: "26 weeks paid leave" },
      { icon: Shield, label: "Pension", desc: "Employer pension contribution" },
    ],
    skills: ["Python", "Apache Spark", "dbt", "SQL", "Airflow", "GCP"],
  },
};

/* ===========================
    Similar Jobs Data
=========================== */

const getSimilarJobs = (currentId) => {
  const allJobs = Object.values(jobDetailData);
  return allJobs.filter((job) => job.id !== currentId).slice(0, 3);
};

/* ===========================
    Share Modal Component
=========================== */

function ShareModal({ isOpen, onClose, jobTitle }) {
  const [copied, setCopied] = useState(false);
  const modalRef = React.useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Focus trap: keep focus inside modal while open
  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

    const focusableEls = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };

    firstEl?.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Share ${jobTitle}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-border bg-surface-elevated p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-heading font-satoshi">Share This Job</h3>
              <button onClick={onClose} className="text-muted hover:text-heading transition-colors cursor-pointer" aria-label="Close share dialog">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-body mb-4">Share &ldquo;{jobTitle}&rdquo; with your network</p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-3">
              <span className="flex-1 truncate text-sm text-muted">{typeof window !== "undefined" ? window.location.href : ""}</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary-light hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ===========================
    Section Divider Component
=========================== */

function SectionDivider() {
  return <div className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />;
}

/* ===========================
    Similar Job Card
=========================== */

function SimilarJobCard({ job }) {
  return (
    <motion.div variants={listItem} whileHover={cardHover}>
      <Link
        to={`/jobs/${job.id}`}
        className="group block rounded-[20px] border border-border bg-surface p-5 sm:p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-glow-primary"
      >
        {/* Top: logo + company */}
        <div className="flex items-center gap-3">
          <img
            src={job.companyLogo}
            alt={`${job.company} logo`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl bg-surface-elevated p-1.5 object-contain"
          />
          <span className="text-sm text-muted">{job.company}</span>
          {job.featured && (
            <span className="ml-auto rounded-full bg-accent-warm/10 px-2.5 py-0.5 text-xs font-medium text-accent-warm">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold text-heading group-hover:text-primary-light transition-colors">
          {job.title}
        </h3>

        {/* Location + Mode */}
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-muted" />
            <span className="text-sm text-muted">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-muted" />
            <span className="text-sm text-muted">{job.mode}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom: salary + apply */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-heading">{job.salary}</span>
            <span className="text-xs text-muted">{job.type}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full gradient-bg-signature px-5 py-2 text-sm font-semibold text-white">
            View Job
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ===========================
    Job Not Found
=========================== */

function JobNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden bg-background font-inter text-body"
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 mesh-gradient" />
      <div className="pointer-events-none fixed -top-20 right-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[160px]" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="mb-6 rounded-full bg-danger/10 p-5">
          <Briefcase size={48} className="text-danger" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading font-satoshi">Job Not Found</h1>
        <p className="mt-4 max-w-md text-body text-base md:text-lg">
          The job listing you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/find-jobs"
          className="mt-8 inline-flex items-center gap-2 rounded-full gradient-bg-signature px-8 py-3 text-sm font-semibold text-white hover:shadow-button transition-all"
        >
          <ArrowLeft size={16} />
          Browse All Jobs
        </Link>
      </div>
    </motion.div>
  );
}

/* ===========================
    Main JobDetail Component
=========================== */

function JobDetail() {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const job = jobDetailData[parseInt(id)];

  // Scroll to top on ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!job) return <JobNotFound />;

  const similarJobs = getSimilarJobs(job.id);

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen overflow-hidden bg-background font-inter text-body"
    >
      {/* ===== Background Effects ===== */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 mesh-gradient" />
      <div aria-hidden="true" className="pointer-events-none fixed -top-20 right-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[160px]" />
      <div aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet/4 blur-[200px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #94A3B8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ===== Content ===== */}
      <div className="relative z-10">
        <div className="section-container pt-8 pb-32 sm:pt-10 lg:pb-20">

          {/* ===== Breadcrumb ===== */}
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-muted mb-8"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">Home</Link>
            <ChevronRight size={14} className="text-muted/50" />
            <Link to="/find-jobs" className="hover:text-primary-light transition-colors">Find Jobs</Link>
            <ChevronRight size={14} className="text-muted/50" />
            <span className="text-body truncate max-w-[200px] sm:max-w-none">{job.title}</span>
          </motion.nav>

          {/* ===== Job Header ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-[20px] border border-border bg-surface p-6 sm:p-8 mb-8"
          >
            {/* Company + Logo */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-elevated p-2">
                  <img src={job.companyLogo} alt={`${job.company} logo`} width={40} height={40} className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="text-sm font-medium text-muted">{job.company}</span>
                  {job.featured && (
                    <span className="ml-2 rounded-full bg-accent-warm/10 px-2.5 py-0.5 text-xs font-medium text-accent-warm">
                      Featured
                    </span>
                  )}
                  <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-heading font-satoshi leading-tight">
                    {job.title}
                  </h1>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => setShareOpen(true)}
                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-primary-light hover:border-primary/30 transition-all cursor-pointer"
                  aria-label="Share job"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                    saved
                      ? "border-primary/30 bg-primary/10 text-primary-light"
                      : "border-border bg-surface hover:bg-surface-elevated text-muted hover:text-heading hover:border-primary/20"
                  }`}
                >
                  {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                onClick={()=> navigate("/apply-jobs")}
                 className="inline-flex items-center gap-2 rounded-xl gradient-bg-signature h-11 px-8 text-sm font-semibold text-white shadow-button transition-all cursor-pointer">
                  <Sparkles size={16} />
                  Apply Now
                </button>
              </div>
            </div>

            {/* Tags Row */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-body">
                <MapPin size={13} className="text-primary-light" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-body">
                <Wifi size={13} className="text-accent" />
                {job.mode}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-body">
                <Briefcase size={13} className="text-violet" />
                {job.type}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-body">
                <Calendar size={13} className="text-accent-warm" />
                Posted {job.posted}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-body">
                <Users size={13} className="text-success" />
                {job.applicants} applicants
              </span>
            </div>
          </motion.div>

          {/* ===== Two Column Layout ===== */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ===== Left Column: Main Content ===== */}
            <div className="flex-1 min-w-0">

              {/* — About This Role — */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-heading font-satoshi flex items-center gap-3">
                  <span className="inline-flex h-8 w-1 rounded-full gradient-bg-signature" />
                  About This Role
                </h2>
                <div className="mt-5 space-y-4">
                  {job.description.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      variants={fadeInUp}
                      custom={i}
                      className="text-body text-sm sm:text-base leading-7"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.section>

              <SectionDivider />

              {/* — Key Responsibilities — */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-heading font-satoshi flex items-center gap-3">
                  <span className="inline-flex h-8 w-1 rounded-full gradient-bg-signature" />
                  Key Responsibilities
                </h2>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="mt-5 space-y-3"
                >
                  {job.responsibilities.map((item, i) => (
                    <motion.li key={i} variants={listItem} className="flex items-start gap-3 group/item">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                      <span className="text-body text-sm sm:text-base leading-7 group-hover/item:text-heading transition-colors">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.section>

              <SectionDivider />

              {/* — Requirements — */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-heading font-satoshi flex items-center gap-3">
                  <span className="inline-flex h-8 w-1 rounded-full gradient-bg-signature" />
                  Requirements
                </h2>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="mt-5 space-y-3"
                >
                  {job.requirements.map((item, i) => (
                    <motion.li key={i} variants={listItem} className="flex items-start gap-3 group/item">
                      <div className="mt-1.5 shrink-0 h-2 w-2 rounded-full bg-primary" />
                      <span className="text-body text-sm sm:text-base leading-7 group-hover/item:text-heading transition-colors">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.section>

              <SectionDivider />

              {/* — Nice to Have — */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-heading font-satoshi flex items-center gap-3">
                  <span className="inline-flex h-8 w-1 rounded-full bg-accent/60" />
                  Nice to Have
                </h2>
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="mt-5 space-y-3"
                >
                  {job.niceToHave.map((item, i) => (
                    <motion.li key={i} variants={listItem} className="flex items-start gap-3 group/item">
                      <Circle size={14} className="mt-1 shrink-0 text-muted" />
                      <span className="text-muted text-sm sm:text-base leading-7 group-hover/item:text-body transition-colors">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.section>

              <SectionDivider />

              {/* — Benefits & Perks — */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-heading font-satoshi flex items-center gap-3">
                  <span className="inline-flex h-8 w-1 rounded-full gradient-bg-signature" />
                  Benefits &amp; Perks
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {job.benefits.map((benefit, i) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={i}
                        variants={listItem}
                        className="group/perk flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-glow-primary"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-light group-hover/perk:bg-primary/15 transition-colors">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-heading">{benefit.label}</p>
                          <p className="mt-0.5 text-xs text-muted">{benefit.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.section>

              <SectionDivider />

              {/* — Required Skills — */}
              <motion.section
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-[20px] border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-heading font-satoshi flex items-center gap-3">
                  <span className="inline-flex h-8 w-1 rounded-full gradient-bg-signature" />
                  Required Skills
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="mt-5 flex flex-wrap gap-3"
                >
                  {job.skills.map((skill, i) => (
                    <motion.span
                      key={skill}
                      variants={listItem}
                      className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary-light hover:bg-primary/15 hover:border-primary/30 transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.section>
            </div>

            {/* ===== Right Column: Sidebar ===== */}
            <div className="w-full lg:w-[340px] shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">

                {/* — Apply Card — */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-[20px] glass-strong gradient-border p-6"
                >
                  {/* Salary */}
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Annual Salary</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-heading font-satoshi gradient-text">
                      {job.salary}
                    </p>
                    <p className="mt-1 text-xs text-muted">{job.salaryPeriod}</p>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-border" />

                  {/* Apply Button */}
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg-signature h-11 sm:h-12 px-8 text-sm font-semibold text-white shadow-button transition-all cursor-pointer">
                    <Sparkles size={16} />
                    Apply Now
                  </button>

                  {/* Save Button */}
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all cursor-pointer ${
                      saved
                        ? "border-primary/30 bg-primary/10 text-primary-light"
                        : "border-border text-muted hover:border-primary/20 hover:text-heading"
                    }`}
                  >
                    {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    {saved ? "Job Saved" : "Save Job"}
                  </button>

                  {/* Closing */}
                  <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent-warm/5 border border-accent-warm/10 px-4 py-2.5">
                    <CalendarDays size={14} className="text-accent-warm" />
                    <span className="text-xs font-medium text-accent-warm">
                      Applications close in {job.closingDays} days
                    </span>
                  </div>
                </motion.div>

                {/* — Company Info Card — */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="rounded-[20px] border border-border bg-surface p-5 sm:p-6"
                >
                  {/* Logo + Name */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated p-2">
                      <img src={job.companyLogo} alt={`${job.company} logo`} width={32} height={32} className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-heading font-satoshi">{job.company}</h3>
                      <span className="text-xs text-muted">{job.industry}</span>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-muted" />
                      <div>
                        <p className="text-xs text-muted">Company Size</p>
                        <p className="text-sm font-medium text-body">{job.companySize} employees</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays size={16} className="text-muted" />
                      <div>
                        <p className="text-xs text-muted">Founded</p>
                        <p className="text-sm font-medium text-body">{job.founded}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-muted" />
                      <div>
                        <p className="text-xs text-muted">Website</p>
                        <a
                          href={`https://${job.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-primary-light hover:text-primary transition-colors"
                        >
                          {job.website}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-border" />

                  {/* View All Jobs */}
                  <Link
                    to="/company"
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated py-2.5 text-sm font-semibold text-muted hover:text-primary-light hover:border-primary/20 transition-all"
                  >
                    View all jobs from {job.company}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ===== Similar Jobs Section ===== */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mt-16 lg:mt-24"
          >
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-6 py-2">
                <span className="h-px w-6 bg-primary/40" />
                <span className="text-sm font-semibold uppercase tracking-wider text-primary-light">
                  You Might Also Like
                </span>
                <span className="h-px w-6 bg-primary/40" />
              </div>

              {/* Title */}
              <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading font-satoshi leading-tight">
                Similar <span className="gradient-text">Jobs</span>
              </h2>

              {/* Description */}
              <p className="mx-auto mt-4 max-w-xl text-body text-sm sm:text-base md:text-lg leading-8">
                Explore more opportunities that match your profile and interests.
              </p>
            </motion.div>

            {/* Similar Job Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {similarJobs.map((sJob) => (
                <SimilarJobCard key={sJob.id} job={sJob} />
              ))}
            </motion.div>
          </motion.section>
        </div>
      </div>

      {/* ===== Mobile Sticky Apply Bar ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="glass-strong border-t border-border px-4 py-3">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => setSaved(!saved)}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                saved
                  ? "border-primary/30 bg-primary/10 text-primary-light"
                  : "border-border bg-surface hover:bg-surface-elevated text-muted"
              }`}
              aria-label={saved ? "Unsave job" : "Save job"}
            >
              {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-elevated text-muted hover:text-heading transition-colors cursor-pointer"
              aria-label="Share job"
            >
              <Share2 size={20} />
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl gradient-bg-signature h-12 px-8 text-sm font-semibold text-white shadow-button transition-all cursor-pointer">
              <Sparkles size={16} />
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* ===== Share Modal ===== */}
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} jobTitle={job.title} />
    </motion.div>
  );
}

export default JobDetail;
