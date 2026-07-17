import {
  Code2,
  Briefcase,
  Megaphone,
  BarChart3,
  HeartPulse,
  Palette,
  ShieldCheck,
  GraduationCap,
  Laptop,
  Home,
  Building2,
  Globe,
  FileText,
  MessageSquare,
  Mic,
  Bot,
  Sparkles,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Star,
} from "lucide-react";

/* ===========================
    Category Gradients
=========================== */

const categoryGradients = [
  { from: "#6366F1", to: "#818CF8" },  // Indigo
  { from: "#EC4899", to: "#F472B6" },  // Pink
  { from: "#06B6D4", to: "#22D3EE" },  // Cyan
  { from: "#F59E0B", to: "#FBBF24" },  // Amber
  { from: "#10B981", to: "#34D399" },  // Emerald
  { from: "#8B5CF6", to: "#A78BFA" },  // Violet
  { from: "#EF4444", to: "#F87171" },  // Red
  { from: "#3B82F6", to: "#60A5FA" },  // Blue
];

export const categories = [
  { title: "IT & Software", jobs: "2,450 Jobs", icon: Code2, gradient: categoryGradients[0] },
  { title: "Marketing", jobs: "980 Jobs", icon: Megaphone, gradient: categoryGradients[1] },
  { title: "Sales", jobs: "1,250 Jobs", icon: BarChart3, gradient: categoryGradients[2] },
  { title: "Finance", jobs: "720 Jobs", icon: Briefcase, gradient: categoryGradients[3] },
  { title: "Healthcare", jobs: "860 Jobs", icon: HeartPulse, gradient: categoryGradients[4] },
  { title: "Design", jobs: "540 Jobs", icon: Palette, gradient: categoryGradients[5] },
  { title: "Cyber Security", jobs: "430 Jobs", icon: ShieldCheck, gradient: categoryGradients[6] },
  { title: "Education", jobs: "610 Jobs", icon: GraduationCap, gradient: categoryGradients[7] },
];

export const workModes = [
  { title: "Remote", jobs: "3,450 Jobs", icon: Home, gradient: categoryGradients[4] },
  { title: "Hybrid", jobs: "1,820 Jobs", icon: Building2, gradient: categoryGradients[0] },
  { title: "On Site", jobs: "2,940 Jobs", icon: Laptop, gradient: categoryGradients[2] },
  { title: "Contract", jobs: "920 Jobs", icon: Briefcase, gradient: categoryGradients[3] },
  { title: "Internship", jobs: "1,100 Jobs", icon: GraduationCap, gradient: categoryGradients[5] },
  { title: "Full Time", jobs: "4,800 Jobs", icon: Globe, gradient: categoryGradients[7] },
  { title: "Part Time", jobs: "760 Jobs", icon: BarChart3, gradient: categoryGradients[1] },
  { title: "Freelance", jobs: "540 Jobs", icon: Code2, gradient: categoryGradients[6] },
];

/* ===========================
    Testimonials
=========================== */

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Frontend Developer at Google",
    avatar: "/avatars/priya.jpg",
    quote:
      "This platform helped me land my dream job in just two weeks. The AI resume builder made my profile stand out instantly!",
    rating: 5,
  },
  {
    id: 2,
    name: "Alex Chen",
    role: "Hiring Manager at Spotify",
    avatar: "/avatars/alex.jpg",
    quote:
      "We've hired three senior developers through Velora. The quality of candidates is consistently excellent.",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria Gomez",
    role: "UX Designer at Airbnb",
    avatar: "/avatars/maria.jpg",
    quote:
      "The skill matching is eerily accurate. I only applied to 4 jobs and got 3 interviews. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "Raj Patel",
    role: "Backend Engineer at Amazon",
    avatar: "/avatars/raj.jpg",
    quote:
      "Transitioning from a non‑tech background was tough, but the guided resume builder and mock interviews gave me the confidence I needed.",
    rating: 4,
  },
  {
    id: 5,
    name: "Sophie Laurent",
    role: "Data Scientist at Meta",
    avatar: "/avatars/sophie.jpg",
    quote:
      "The AI‑driven job recommendations save hours every week. It's like having a personal career assistant.",
    rating: 5,
  },
  {
    id: 6,
    name: "James Rivera",
    role: "Engineering Lead at Netflix",
    avatar: "/avatars/james.jpg",
    quote:
      "From the AI interview prep to the smart job matching, everything about Velora feels thoughtfully designed for modern professionals.",
    rating: 5,
  },
];

/* ===========================
    Featured Jobs
=========================== */

export const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Google",
    companyLogo: "/Companies/google.svg",
    location: "Mountain View, CA",
    salary: "$180K – $250K",
    type: "Full Time",
    mode: "Hybrid",
    tags: ["React", "TypeScript", "GraphQL"],
    posted: "2 days ago",
    featured: true,
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Airbnb",
    companyLogo: "/Companies/airbnb.svg",
    location: "San Francisco, CA",
    salary: "$150K – $200K",
    type: "Full Time",
    mode: "Remote",
    tags: ["Figma", "Design Systems", "Prototyping"],
    posted: "1 day ago",
    featured: true,
  },
  {
    id: 3,
    title: "ML Engineer",
    company: "Meta",
    companyLogo: "/Companies/meta.svg",
    location: "New York, NY",
    salary: "$200K – $300K",
    type: "Full Time",
    mode: "Hybrid",
    tags: ["Python", "PyTorch", "LLMs"],
    posted: "3 days ago",
    featured: false,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "Amazon",
    companyLogo: "/Companies/amazon.svg",
    location: "Seattle, WA",
    salary: "$160K – $220K",
    type: "Full Time",
    mode: "On Site",
    tags: ["AWS", "Kubernetes", "Terraform"],
    posted: "5 hours ago",
    featured: true,
  },
  {
    id: 5,
    title: "iOS Developer",
    company: "Apple",
    companyLogo: "/Companies/apple.svg",
    location: "Cupertino, CA",
    salary: "$175K – $240K",
    type: "Full Time",
    mode: "On Site",
    tags: ["Swift", "SwiftUI", "Objective-C"],
    posted: "4 days ago",
    featured: false,
  },
  {
    id: 6,
    title: "Data Engineer",
    company: "Spotify",
    companyLogo: "/Companies/spotify.svg",
    location: "Stockholm, Sweden",
    salary: "$140K – $190K",
    type: "Full Time",
    mode: "Remote",
    tags: ["Spark", "Python", "dbt"],
    posted: "1 day ago",
    featured: true,
  },
];

/* ===========================
    AI Tools
=========================== */

export const aiTools = [
  {
    id: 1,
    title: "AI Resume Builder",
    description: "Craft ATS-optimized resumes in minutes with AI-powered suggestions, formatting, and keyword optimization.",
    icon: FileText,
    gradient: { from: "#6366F1", to: "#8B5CF6" },
    stats: "50K+ resumes created",
    tag: "Most Popular",
  },
  {
    id: 2,
    title: "AI Cover Letter Generator",
    description: "Generate personalized, compelling cover letters tailored to specific job descriptions instantly.",
    icon: MessageSquare,
    gradient: { from: "#06B6D4", to: "#22D3EE" },
    stats: "30K+ letters generated",
    tag: "New",
  },
  {
    id: 3,
    title: "AI Interview Preparation",
    description: "Practice with AI-powered mock interviews. Get real-time feedback on your answers, tone, and confidence.",
    icon: Mic,
    gradient: { from: "#EC4899", to: "#F472B6" },
    stats: "25K+ interviews practiced",
    tag: "Trending",
  },
  {
    id: 4,
    title: "AI Career Assistant",
    description: "Your 24/7 career advisor. Get personalized job recommendations, career path insights, and salary benchmarks.",
    icon: Bot,
    gradient: { from: "#10B981", to: "#34D399" },
    stats: "100K+ conversations",
    tag: "AI Powered",
  },
];