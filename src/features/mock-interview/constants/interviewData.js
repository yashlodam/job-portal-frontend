/**
 * src/features/mock-interview/constants/interviewData.js
 * Definitions for tracks, experience difficulty levels, and interview formats.
 * 100% of questions, session data, evaluations, and history are fetched dynamically from Spring Boot REST endpoints.
 */

export const INTERVIEW_TRACKS = [
  {
    id: "java-fullstack",
    title: "Java Full Stack Developer",
    icon: "Code2",
    description: "Spring Boot, Microservices, Hibernate, REST APIs, PostgreSQL, and React.js frontend architecture.",
    popularity: "Most Popular",
    questionsCount: 45,
    tags: ["Java 21", "Spring Boot 3", "React 19", "PostgreSQL", "Kafka"],
  },
  {
    id: "react-frontend",
    title: "React Frontend Architect",
    icon: "Layout",
    description: "React 19, Redux Toolkit, State Management, Performance Optimization, Hooks, & Web Vitals.",
    popularity: "High Demand",
    questionsCount: 38,
    tags: ["React 19", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Vite"],
  },
  {
    id: "python-backend",
    title: "Python Backend & Microservices",
    icon: "Terminal",
    description: "FastAPI, Django, AsyncIO, Distributed Caching, Redis, Celery, and System Design.",
    popularity: "Trending",
    questionsCount: 40,
    tags: ["Python 3.12", "FastAPI", "Docker", "Redis", "SQLAlchemy"],
  },
  {
    id: "ai-llm-engineer",
    title: "AI / LLM Integration Engineer",
    icon: "Cpu",
    description: "LangChain, RAG Systems, Vector DBs (Pinecone/Chroma), Embeddings, & Fine-Tuning.",
    popularity: "Hot Track 🚀",
    questionsCount: 30,
    tags: ["Spring AI", "Python", "RAG", "Vector Search", "Prompt Engineering"],
  },
  {
    id: "system-design",
    title: "System Design & Architecture",
    icon: "Network",
    description: "High Availability, Load Balancing, Microservices, Database Sharding, Caching, & Event-Driven Systems.",
    popularity: "Senior Level",
    questionsCount: 25,
    tags: ["Scalability", "Microservices", "Kafka", "Cassandra", "CDN"],
  },
  {
    id: "behavioral-hr",
    title: "HR & Behavioral Leadership",
    icon: "UserCheck",
    description: "STAR Method, Conflict Resolution, Team Leadership, Project Management, & Situational Judgment.",
    popularity: "Essential",
    questionsCount: 50,
    tags: ["STAR Method", "Leadership", "Agile", "Communication", "Conflict Mgmt"],
  },
];

export const DIFFICULTY_LEVELS = [
  { id: "BEGINNER", label: "Entry Level / Junior", exp: "0 - 2 Years", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { id: "INTERMEDIATE", label: "Mid-Level Professional", exp: "2 - 5 Years", color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  { id: "ADVANCED", label: "Senior Engineer", exp: "5 - 8 Years", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { id: "EXPERT", label: "Staff / Lead Architect", exp: "8+ Years", color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
];

export const INTERVIEW_TYPES = [
  { id: "TECHNICAL", label: "Technical Coding & Architecture", desc: "Core concepts, live coding, and algorithm implementation." },
  { id: "BEHAVIORAL", label: "Behavioral & STAR Method", desc: "Past experience, leadership, teamwork, and problem solving." },
  { id: "SYSTEM_DESIGN", label: "System Design & Scalability", desc: "Designing large-scale distributed systems and DB schemas." },
  { id: "HR", label: "HR & Culture Fit", desc: "Career goals, motivation, salary expectations, and soft skills." },
];
