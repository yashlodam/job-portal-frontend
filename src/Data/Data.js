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
} from "lucide-react";

export const categories = [
  { title: "IT & Software", jobs: "2,450 Jobs", icon: Code2 },
  { title: "Marketing", jobs: "980 Jobs", icon: Megaphone },
  { title: "Sales", jobs: "1,250 Jobs", icon: BarChart3 },
  { title: "Finance", jobs: "720 Jobs", icon: Briefcase },
  { title: "Healthcare", jobs: "860 Jobs", icon: HeartPulse },
  { title: "Design", jobs: "540 Jobs", icon: Palette },
  { title: "Cyber Security", jobs: "430 Jobs", icon: ShieldCheck },
  { title: "Education", jobs: "610 Jobs", icon: GraduationCap },
];

export const workModes = [
  { title: "Remote", jobs: "3,450 Jobs", icon: Home },
  { title: "Hybrid", jobs: "1,820 Jobs", icon: Building2 },
  { title: "On Site", jobs: "2,940 Jobs", icon: Laptop },
  { title: "Contract", jobs: "920 Jobs", icon: Briefcase },
  { title: "Internship", jobs: "1,100 Jobs", icon: GraduationCap },
  { title: "Full Time", jobs: "4,800 Jobs", icon: Globe },
  { title: "Part Time", jobs: "760 Jobs", icon: BarChart3 },
  { title: "Freelance", jobs: "540 Jobs", icon: Code2 },
];

const testimonials = [
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
      "We’ve hired three senior developers through JobPortal. The quality of candidates is consistently excellent.",
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
      "The AI‑driven job recommendations save hours every week. It’s like having a personal career assistant.",
    rating: 5,
  },
];