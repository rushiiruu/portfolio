"use client";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

// ── CONFIG ──────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_rfedngz";
const EMAILJS_TEMPLATE_ID = "template_p5s33jk";
const EMAILJS_PUBLIC_KEY  = "ESO4gIi74dsmAIyQ5";
// ────────────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openDemo, setOpenDemo] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setFormStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      alert(JSON.stringify(err));
      setFormStatus("error");
    }
  };

  const navLinks = ["home", "about", "skills", "projects", "awards", "contact"];

  const skills = {
    "{ Frontend }": ["HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "React", "React Native", "JavaScript"],
    "{ Backend }": ["PHP", "Python", "C", "R", "Node.js"],
    "{ Database & Tools }": ["MySQL", "T-SQL", "Git", "Tableau", "Roboflow"],
    "{ ML & AI }": ["NLP", "Computer Vision", "CNN"],
  };

  const projects = [
    {
      num: "01",
      title: "CNN-Based Philippine Road Sign Detection",
      type: "Undergraduate Thesis",
      desc: "A deep learning model for detecting and recognizing Philippine road signs under varied environmental conditions — sunny, nighttime, and rainy. Built a comprehensive dataset across Dumaguete City, performed data augmentation, and annotated images in Roboflow.",
      tech: ["Python", "CNN", "Google Colab", "Roboflow"],
      period: "June 2025 – March 2026",
      article: "https://docs.google.com/document/d/16jluXD31vHWNfXK4IkQZwlGCtszBLkxfwaWfDaYIbDQ/edit?usp=sharing",
    },
    {
      num: "02",
      title: "NLP Research – Figurative Language in Cebuano & Tagalog",
      type: "Research Internship · National University, Manila",
      desc: "Co-authored a research paper on figurative language understanding using multitask NLP. Built a corpus of 1,500+ expressions through web scraping and evaluated using XLM-RoBERTa-base.",
      tech: ["Python", "XLM-RoBERTa", "NLP", "NER", "JSON"],
      period: "May – July 2025",
      article: "https://docs.google.com/document/d/1MIjF-vfmUDEfWZkSratbl7uesSYD3J7x/edit?usp=sharing&ouid=113843473622081898564&rtpof=true&sd=true",
    },
    {
      num: "03",
      title: "La Ginta Real – Hotel Reservation System",
      type: "Web Application",
      desc: "Developed responsive UI for room browsing, booking, and reservation management. Designed the payment and receipt interface and integrated with PHP/MySQL backend.",
      tech: ["PHP", "MySQL", "JavaScript", "HTML", "CSS", "Bootstrap"],
      period: "Jan – May 2025",
      video: "https://youtu.be/0aa8zfnsHV0",
    },
    {
      num: "04",
      title: "Cura – Medication Information Mobile App",
      type: "Mobile Application",
      desc: "Led development of a mobile app that helps users identify and access detailed medicine information using OCR-based scanning. Integrated Firebase for real-time data and authentication, with a Python backend hosted on AWS.",
      tech: ["React Native", "Firebase", "Python", "OCR", "AWS", "Android Studio"],
      period: "Aug – Dec 2024",
      video: "https://youtu.be/EnxgWy3kylk",
    },
    {
      num: "05",
      title: "Aphrodite – Luxury E-Commerce Web App",
      type: "Web Application",
      desc: "Led UI/UX design for a visually appealing and intuitive jewelry shopping experience. Collaborated with the team to ensure seamless integration of frontend functionality.",
      tech: ["React", "Tailwind CSS"],
      period: "Jan – May 2024",
      link: "https://aphrodite-orpin.vercel.app/",
    },
  ];

  const awards = [
    {
      icon: "bi-award",
      title: "5th Placer – Ai.Deas for Impact 2025 (Region VII)",
      org: "DICT · Tagbilaran City, Bohol",
      date: "Sept 16–17, 2025",
      desc: "Collaborated in developing Axolert, an AI-driven public health monitoring system.",
      link: "https://su.edu.ph/su-team-places-5th-in-regl-ai-hackathon-with-public-health-solution-axolert/",
    },
    {
      icon: "bi-lightbulb",
      title: "Participant – Innovathon for Universities",
      org: "Philtech Inc. · BGC, Taguig City",
      date: "Jan 22–23, 2026",
      desc: "Co-developed Nudge, an AI mental health concept for youth.",
    },
    {
      icon: "bi-file-earmark-text",
      title: "AI – NLP Workshop Certificate",
      org: "National University × Silliman University",
      date: "Aug 21–22, 2024",
      desc: "Completed intensive NLP workshop on ML applications in text processing.",
    },
    {
      icon: "bi-mortarboard",
      title: "Academic Scholarship Recipient",
      org: "Silliman University",
      date: "Selected Semesters, 2022–2026",
      desc: "Awarded scholarship for sustained academic performance.",
    },
  ];

  const fadeClass = (id: string) =>
    `transition-all duration-700 ${
      visibleSections.has(id)
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`;

  const staggerStyle = (idx: number): React.CSSProperties => ({
    transitionDelay: `${idx * 80}ms`,
  });

  return (
    <div className={`${dark ? "dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --pink: #f36b8d;
          --pink-light: #fde8ee;
          --pink-dark: #d94f71;
          --pink-muted: #f9a8bf;
          --bg: #fff9fb;
          --bg2: #ffffff;
          --fg: #1a1018;
          --fg2: #5a4a52;
          --border: #f0d6df;
          --card: #ffffff;
          --nav-bg: rgba(255,249,251,0.88);
          --shadow: 0 1px 3px rgba(243,107,141,0.08), 0 8px 24px rgba(243,107,141,0.06);
        }

        .dark {
          --bg: #120d10;
          --bg2: #1c1318;
          --fg: #f5eef1;
          --fg2: #c4a8b3;
          --border: #3a2530;
          --card: #1f1519;
          --nav-bg: rgba(18,13,16,0.88);
          --shadow: 0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--fg);
          transition: background 0.3s, color 0.3s;
          overflow-x: hidden;
        }

        h1, h2, h3 { font-family: 'DM Serif Display', serif; }

        /* ── NAV ─────────────────────────────────── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2rem;
          transition: background 0.3s, box-shadow 0.3s;
        }

        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem; color: var(--pink);
          text-decoration: none; letter-spacing: -0.02em;
          transition: opacity 0.2s;
        }
        .nav-logo:hover { opacity: 0.8; }

        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a {
          text-decoration: none; font-size: 0.8rem; font-weight: 500;
          color: var(--fg2); transition: color 0.2s;
          letter-spacing: 0.06em; text-transform: uppercase;
          position: relative; padding-bottom: 2px;
        }
        .nav-links a::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 2px; background: var(--pink); border-radius: 999px;
          transform: scaleX(0); transition: transform 0.25s;
        }
        .nav-links a:hover::after, .nav-links a.active::after { transform: scaleX(1); }
        .nav-links a:hover, .nav-links a.active { color: var(--pink); }

        .nav-right { display: flex; align-items: center; gap: 1rem; }

        .theme-btn {
          background: none; border: 1px solid var(--border); border-radius: 999px;
          padding: 0.35rem 0.75rem; cursor: pointer; font-size: 1rem;
          color: var(--fg); transition: border-color 0.2s, transform 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .theme-btn:hover { border-color: var(--pink); transform: rotate(15deg); }

        .hamburger {
          display: none; flex-direction: column; gap: 5px; cursor: pointer;
          background: none; border: none; padding: 4px;
        }
        .hamburger span {
          width: 22px; height: 2px; background: var(--fg);
          display: block; transition: 0.3s; transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          display: none; position: fixed; top: 64px; left: 0; right: 0;
          background: var(--bg2); border-bottom: 1px solid var(--border);
          padding: 1.5rem 2rem; z-index: 99;
          flex-direction: column; gap: 1rem;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          text-decoration: none; font-size: 1rem; color: var(--fg2);
          text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;
          transition: color 0.2s;
        }
        .mobile-menu a:hover { color: var(--pink); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }

        /* ── SECTIONS ─────────────────────────────── */
        section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }

        /* ── HERO ─────────────────────────────────── */
        #home {
          min-height: 100vh; display: flex; align-items: center;
          padding-top: 8rem; max-width: none; margin: 0;
          padding-left: max(2rem, calc((100vw - 1100px) / 2));
          padding-right: max(2rem, calc((100vw - 1100px) / 2));
        }

        .hero-inner {
          display: grid; grid-template-columns: 1fr auto;
          gap: 3rem; align-items: center; width: 100%;
          animation: heroIn 0.8s ease both;
        }
        @keyframes heroIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

        .hero-greeting {
          font-size: 0.85rem; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--pink); margin-bottom: 1rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .hero-greeting::before {
          content: ''; display: inline-block; width: 2rem; height: 1px; background: var(--pink);
        }

        h1.hero-name {
          font-size: clamp(2.8rem, 6vw, 5rem);
          line-height: 1.05; letter-spacing: -0.03em;
          color: var(--fg); margin-bottom: 0.5rem;
        }
        h1.hero-name em { color: var(--pink); font-style: italic; }

        .hero-tagline {
          font-size: clamp(0.95rem, 1.8vw, 1.15rem);
          color: var(--fg2); margin-bottom: 2rem; font-weight: 300; line-height: 1.7;
          max-width: 520px;
        }

        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }

        .btn-primary {
          background: var(--pink); color: white; border: none;
          padding: 0.75rem 1.75rem; border-radius: 999px; font-size: 0.9rem;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, transform 0.25s, box-shadow 0.25s;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 14px rgba(243,107,141,0.3);
        }
        .btn-primary:hover { background: var(--pink-dark); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(243,107,141,0.4); }
        .btn-primary:active { transform: translateY(-1px); }

        .btn-ghost {
          background: none; border: 1.5px solid var(--border); color: var(--fg2);
          padding: 0.75rem 1.75rem; border-radius: 999px; font-size: 0.9rem;
          font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, color 0.2s, transform 0.25s;
        }
        .btn-ghost:hover { border-color: var(--pink); color: var(--pink); transform: translateY(-3px); }

        /* PHOTO */
        .hero-photo-wrap { position: relative; width: 260px; height: 320px; flex-shrink: 0; }

        .hero-photo-blob {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--pink-light), #ffe0eb);
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          animation: blobMorph 8s ease-in-out infinite;
        }
        .dark .hero-photo-blob { background: linear-gradient(135deg, #3d1a26, #2a1020); }

        @keyframes blobMorph {
          0%, 100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          33%       { border-radius: 45% 55% 40% 60% / 60% 45% 55% 40%; }
          66%       { border-radius: 55% 45% 60% 40% / 40% 55% 45% 60%; }
        }

        .hero-photo-inner {
          position: absolute; inset: 12px;
          border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
          overflow: hidden;
          animation: blobMorph 8s ease-in-out infinite;
          border: 3px solid rgba(243,107,141,0.3);
        }

        .hero-photo-inner img { width: 100%; height: 100%; object-fit: cover; }

        .hero-photo-tag {
          position: absolute; bottom: -10px; right: -10px;
          background: var(--pink); color: white;
          padding: 0.4rem 0.9rem; border-radius: 999px;
          font-size: 0.75rem; font-weight: 600; white-space: nowrap;
          box-shadow: 0 4px 16px rgba(243,107,141,0.35);
          animation: floatTag 3s ease-in-out infinite;
          display: flex; align-items: center; gap: 0.35rem;
        }
        @keyframes floatTag {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .hero-scroll-hint {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: var(--fg2); font-size: 0.72rem; letter-spacing: 0.08em;
          text-transform: uppercase; opacity: 0.6;
          animation: fadeInDelay 1.5s ease both;
        }
        @keyframes fadeInDelay { from { opacity: 0; } to { opacity: 0.6; } }

        .scroll-mouse {
          width: 20px; height: 32px; border: 1.5px solid var(--border);
          border-radius: 999px; display: flex; justify-content: center; padding-top: 5px;
        }
        .scroll-mouse::before {
          content: ''; width: 3px; height: 6px; background: var(--pink);
          border-radius: 999px; animation: scrollDot 1.6s ease infinite;
        }
        @keyframes scrollDot {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }

        @media (max-width: 640px) {
          .hero-inner { grid-template-columns: 1fr; justify-items: center; text-align: center; }
          .hero-greeting { justify-content: center; }
          .hero-tagline { max-width: none; }
          .hero-btns { justify-content: center; }
          .hero-photo-wrap { width: 200px; height: 240px; }
          .hero-scroll-hint { display: none; }
        }

        /* ── SECTION HEADING ─────────────────────── */
        .section-label {
          font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.16em; color: var(--pink); margin-bottom: 0.4rem;
        }
        .section-title {
          font-size: clamp(2rem, 4vw, 2.8rem); letter-spacing: -0.02em;
          color: var(--fg); margin-bottom: 0.5rem;
        }
        .section-line {
          width: 3rem; height: 3px; background: linear-gradient(90deg, var(--pink), var(--pink-muted));
          border-radius: 999px; margin-bottom: 3rem;
        }

        /* ── ABOUT ───────────────────────────────── */
        .about-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;
        }

        .about-text p {
          color: var(--fg2); line-height: 1.85; font-size: 1rem; margin-bottom: 1rem;
        }

        .about-highlights { display: flex; flex-direction: column; gap: 1rem; }

        .about-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 14px; padding: 1.25rem 1.5rem;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          cursor: default;
        }
        .about-card:hover { border-color: var(--pink); transform: translateX(5px); box-shadow: var(--shadow); }

        .about-card-label {
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--pink); font-weight: 700; margin-bottom: 0.25rem;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .about-card-title { font-size: 0.95rem; font-weight: 600; color: var(--fg); margin-bottom: 0.1rem; }
        .about-card-sub { font-size: 0.8rem; color: var(--fg2); }

        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 2.5rem; } }

        /* ── SKILLS ─────────────────────────────── */
        #skills {
          background: var(--bg2); max-width: none;
          padding-left: max(2rem, calc((100vw - 1100px) / 2));
          padding-right: max(2rem, calc((100vw - 1100px) / 2));
        }
        #skills > div { max-width: 1100px; margin: 0 auto; }

        .skills-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .skill-group {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 16px; padding: 1.5rem;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .skill-group:hover { border-color: var(--pink); transform: translateY(-4px); box-shadow: var(--shadow); }

        .skill-group-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem; color: var(--pink); margin-bottom: 1rem; font-style: italic;
        }

        .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-tag {
          background: var(--pink-light); color: var(--pink-dark);
          padding: 0.25rem 0.75rem; border-radius: 999px;
          font-size: 0.78rem; font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .skill-tag:hover { transform: translateY(-2px); box-shadow: 0 3px 8px rgba(243,107,141,0.25); }
        .dark .skill-tag { background: #3d1a26; color: var(--pink-muted); }

        /* ── PROJECTS ───────────────────────────── */
        .projects-list { display: flex; flex-direction: column; gap: 1.25rem; }

        .project-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 18px; padding: 2rem;
          display: grid; grid-template-columns: auto 1fr; gap: 1.5rem;
          transition: border-color 0.25s, transform 0.3s, box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .project-card::before {
          content: ''; position: absolute; inset: 0; left: auto; width: 0;
          background: linear-gradient(135deg, rgba(243,107,141,0.04), transparent);
          transition: width 0.4s ease;
          pointer-events: none;
        }
        .project-card:hover::before { width: 100%; }
        .project-card:hover { border-color: var(--pink); transform: translateX(6px); box-shadow: var(--shadow); }

        .project-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2.5rem; color: var(--border); line-height: 1;
          font-style: italic; user-select: none; transition: color 0.3s;
        }
        .project-card:hover .project-num { color: var(--pink); }

        .project-type { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--pink); font-weight: 700; margin-bottom: 0.25rem; }
        .project-title { font-size: 1.1rem; font-weight: 600; color: var(--fg); margin-bottom: 0.5rem; }
        .project-desc { font-size: 0.875rem; color: var(--fg2); line-height: 1.75; margin-bottom: 1rem; }

        .project-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .project-tech { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tech-badge {
          background: var(--bg); border: 1px solid var(--border);
          padding: 0.2rem 0.6rem; border-radius: 6px;
          font-size: 0.72rem; font-weight: 500; color: var(--fg2);
          transition: border-color 0.2s, color 0.2s;
        }
        .project-card:hover .tech-badge { border-color: rgba(243,107,141,0.3); color: var(--fg); }

        .project-link {
          font-size: 0.78rem; font-weight: 600;
          color: var(--pink); text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.3rem;
          transition: gap 0.2s, color 0.2s;
        }
        .project-link:hover { gap: 0.5rem; color: var(--pink-dark); }

        .project-period { font-size: 0.75rem; color: var(--fg2); white-space: nowrap; }

        @media (max-width: 640px) {
          .project-card { grid-template-columns: 1fr; gap: 0.5rem; }
          .project-num { font-size: 1.5rem; }
        }

        /* ── AWARDS ─────────────────────────────── */
        #awards {
          background: var(--bg2); max-width: none;
          padding-left: max(2rem, calc((100vw - 1100px) / 2));
          padding-right: max(2rem, calc((100vw - 1100px) / 2));
        }
        #awards > div { max-width: 1100px; margin: 0 auto; }

        .awards-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
          gap: 1.25rem;
        }

        .award-card {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 16px; padding: 1.5rem;
          transition: border-color 0.25s, transform 0.3s, box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .award-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--pink), var(--pink-muted));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s ease;
        }
        .award-card:hover::after { transform: scaleX(1); }
        .award-card:hover { border-color: var(--pink); transform: translateY(-5px); box-shadow: var(--shadow); }

        .award-icon-wrap {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--pink-light);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 0.75rem;
          transition: background 0.2s;
        }
        .dark .award-icon-wrap { background: #3d1a26; }
        .award-card:hover .award-icon-wrap { background: var(--pink); }
        .award-icon-wrap i {
          font-size: 1.1rem; color: var(--pink);
          transition: color 0.2s;
        }
        .award-card:hover .award-icon-wrap i { color: white; }

        .award-date { font-size: 0.72rem; color: var(--pink); font-weight: 700; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
        .award-title { font-size: 0.95rem; font-weight: 600; color: var(--fg); margin-bottom: 0.2rem; line-height: 1.4; }
        .award-org { font-size: 0.78rem; color: var(--fg2); margin-bottom: 0.5rem; }
        .award-desc { font-size: 0.8rem; color: var(--fg2); line-height: 1.65; }
        .award-link {
          display: inline-flex; align-items: center; gap: 0.3rem;
          margin-top: 0.75rem; font-size: 0.78rem; font-weight: 600;
          color: var(--pink); text-decoration: none;
          transition: gap 0.2s;
        }
        .award-link:hover { gap: 0.5rem; }

        /* ── CONTACT ─────────────────────────────── */
        #contact {
          background: var(--bg2); max-width: none;
          padding-left: max(2rem, calc((100vw - 1100px) / 2));
          padding-right: max(2rem, calc((100vw - 1100px) / 2));
        }
        #contact > div { max-width: 1100px; margin: 0 auto; }

        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }

        .contact-info p { color: var(--fg2); font-size: 1rem; line-height: 1.85; margin-bottom: 2rem; }

        .contact-links { display: flex; flex-direction: column; gap: 0.75rem; }
        .contact-link {
          display: flex; align-items: center; gap: 0.75rem;
          text-decoration: none; color: var(--fg2); font-size: 0.875rem;
          transition: color 0.2s, transform 0.2s;
        }
        .contact-link:hover { color: var(--pink); transform: translateX(4px); }
        .contact-link-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: var(--pink-light); display: flex; align-items: center;
          justify-content: center; font-size: 1.1rem; flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
          color: var(--pink);
        }
        .dark .contact-link-icon { background: #3d1a26; }
        .contact-link:hover .contact-link-icon { background: var(--pink); color: white; transform: scale(1.08); }

        /* FORM */
        .contact-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-label { font-size: 0.78rem; font-weight: 700; color: var(--fg2); letter-spacing: 0.06em; text-transform: uppercase; }

        .form-input, .form-textarea {
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 11px; padding: 0.8rem 1rem;
          font-size: 0.9rem; color: var(--fg); font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none; resize: none; width: 100%;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--fg2); opacity: 0.5; }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--pink);
          box-shadow: 0 0 0 3px rgba(243,107,141,0.12);
        }
        .form-textarea { min-height: 140px; }

        .form-submit {
          background: var(--pink); color: white; border: none;
          padding: 0.875rem 2rem; border-radius: 999px; font-size: 0.9rem;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, transform 0.25s, box-shadow 0.25s;
          align-self: flex-start;
          box-shadow: 0 4px 14px rgba(243,107,141,0.3);
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .form-submit:hover:not(:disabled) { background: var(--pink-dark); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(243,107,141,0.4); }
        .form-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .form-success {
          background: #d1fae5; border: 1px solid #6ee7b7;
          border-radius: 12px; padding: 1rem 1.25rem;
          color: #065f46; font-size: 0.9rem; font-weight: 500;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
          display: flex; align-items: center; gap: 0.6rem;
        }
        .form-error {
          background: #fee2e2; border: 1px solid #fca5a5;
          border-radius: 12px; padding: 1rem 1.25rem;
          color: #991b1b; font-size: 0.9rem; font-weight: 500;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
          display: flex; align-items: center; gap: 0.6rem;
        }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; } }

        /* ── FOOTER ─────────────────────────────── */
        footer {
          text-align: center; padding: 2rem; border-top: 1px solid var(--border);
          color: var(--fg2); font-size: 0.8rem;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        }
        footer i { color: var(--pink); }

        /* ── BACK TO TOP ─────────────────────────── */
        .back-top {
          position: fixed; bottom: 2rem; right: 2rem;
          background: var(--pink); color: white; border: none;
          width: 44px; height: 44px; border-radius: 50%; font-size: 1.1rem;
          cursor: pointer; box-shadow: 0 4px 16px rgba(243,107,141,0.4);
          transition: transform 0.25s, box-shadow 0.25s;
          display: flex; align-items: center; justify-content: center;
        }
        .back-top:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(243,107,141,0.5); }
      `}</style>

      <ScrollProgress />

      {/* ── NAV ── */}
      <nav>
        <a className="nav-logo" href="#home">rae.</a>
        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l}>
              <a
                href={`#${l}`}
                className={activeSection === l ? "active" : ""}
                onClick={(e) => { e.preventDefault(); scrollTo(l); }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button className="theme-btn" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
            <i className={`bi ${dark ? "bi-sun" : "bi-moon"}`} />
          </button>
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((l) => (
          <a key={l} href={`#${l}`} onClick={(e) => { e.preventDefault(); scrollTo(l); }}>{l}</a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section id="home" style={{ position: "relative" }}>
        <div className="hero-inner">
          <div>
            <div className="hero-greeting">
              <i className="bi bi-hand-wave" /> hello there
            </div>
            <h1 className="hero-name">
              I'm <em>Rusyl Anne</em><br />Espiña.
            </h1>
            <p className="hero-tagline">
              I enjoy solving problems and building practical applications. As I explore full-stack development, I approach each project as a student for life, always learning and improving.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => scrollTo("projects")}>View My Work</button>
              <button className="btn-ghost" onClick={() => scrollTo("contact")}>Get In Touch</button>
            </div>
          </div>

          <div className="hero-photo-wrap">
            <div className="hero-photo-blob" />
            <div className="hero-photo-inner">
              <img src="/rusyl.png" alt="Rusyl Anne Espiña" />
            </div>
            <div className="hero-photo-tag">
              <i className="bi bi-stars" /> Open to opportunities
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-mouse" />
          <span>scroll</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <div className={fadeClass("about")}>
          <div className="section-label">get to know me</div>
          <h2 className="section-title">About Me</h2>
          <div className="section-line" />

          <div className="about-grid">
            <div className="about-text">
              <p>
                Hi, I'm <span style={{ color: "#f36b8d", fontWeight: "600" }}>Rusyl Anne</span> — a Computer Science graduate from Silliman University. I enjoy building things that are both practical and human-centered, whether it's a mobile app or a web platform (but I mostly prefer web haha!). I try to bring careful problem-solving and thoughtful design to every project.
              </p>
              <p>
                So far, I've had the chance to explore full-stack web and mobile development, NLP research, and computer vision. I've also had opportunities to join hackathons, where I was introduced to real-world problems that can be addressed with technology, which has been a valuable learning experience.
              </p>
              <p>
                Right now, I'm looking for opportunities to grow and contribute to meaningful projects, and I'm eager to learn from experienced teams. Outside of coding, I enjoy leading design initiatives and finding ways to make technology more useful for real people.
              </p>
            </div>

            <div className="about-highlights">
              {[
                { icon: "bi-mortarboard", label: "Education", title: "BS Computer Science", sub: ["Silliman University, Dumaguete City · 2022–2026", "GWA: 3.42"] },
                { icon: "bi-trophy", label: "Academic Honors", title: "University Class Honors", sub: ["2022–2023 & 2024–2025 · Academic Scholarship Recipient"] },
                { icon: "bi-journal-text", label: "Research", title: "Intern – National University, Manila", sub: ["NLP Research · May–July 2025"] },
                { icon: "bi-people", label: "Leadership", title: "Infomedia Committee Head", sub: ["CCS Dept. Student Council · SU · 2022–2024"] },
              ].map((c, i) => (
                <div className="about-card" key={i} style={staggerStyle(i)}>
                  <div className="about-card-label">
                    <i className={`bi ${c.icon}`} /> {c.label}
                  </div>
                  <div className="about-card-title">{c.title}</div>
                  {c.sub.map((s, j) => (
                    <div className="about-card-sub" key={j}>
                      {s.includes("GWA") ? (
                        <>
                          <strong>GWA:</strong> {s.split("GWA: ")[1]}
                        </>
                      ) : (
                        s
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills">
        <div className={fadeClass("skills")}>
          <div className="section-label">what I work with</div>
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="section-line" />
          <div className="skills-grid">
            {Object.entries(skills).map(([group, tags], i) => (
              <div className="skill-group" key={group} style={staggerStyle(i)}>
                <div className="skill-group-title">{group}</div>
                <div className="skill-tags">
                  {tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className={fadeClass("projects")}>
          <div className="section-label">things I've built</div>
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-line" />
          <div className="projects-list">
            {projects.map((p, i) => (
              <div className="project-card" key={p.num} style={staggerStyle(i)}>
                <div className="project-num">{p.num}</div>
                <div style={{ width: "100%" }}>
                  <div className="project-type">{p.type}</div>
                  <div className="project-title">{p.title}</div>
                  <div className="project-desc">{p.desc}</div>
                  <div className="project-footer">
                    <div className="project-tech">
                      {p.tech.map((t) => <span className="tech-badge" key={t}>{t}</span>)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                          <i className="bi bi-box-arrow-up-right" /> View Live
                        </a>
                      )}
                      {p.article && (
                        <a href={p.article} target="_blank" rel="noopener noreferrer" className="project-link">
                          <i className="bi bi-file-earmark-text" /> View Article
                        </a>
                      )}
                      {p.video && (
                        <button
                          className="project-link"
                          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
                          onClick={() => setOpenDemo(openDemo === p.num ? null : p.num)}
                        >
                          {openDemo === p.num
                            ? <><i className="bi bi-chevron-up" /> Hide Demo</>
                            : <><i className="bi bi-play-circle" /> View Demo</>
                          }
                        </button>
                      )}
                      <span className="project-period">
                        <i className="bi bi-calendar3" style={{ marginRight: "0.25rem", opacity: 0.6 }} />
                        {p.period}
                      </span>
                    </div>
                  </div>

                  {p.video && openDemo === p.num && (
                    <div style={{ marginTop: "1.25rem" }}>
                      <iframe
                        width="100%"
                        height="360"
                        src={p.video.replace("youtu.be/", "www.youtube.com/embed/")}
                        title={p.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section id="awards">
        <div className={fadeClass("awards")}>
          <div className="section-label">recognition & certificates</div>
          <h2 className="section-title">Awards & Achievements</h2>
          <div className="section-line" />
          <div className="awards-grid">
            {awards.map((award, i) => (
              <div className="award-card" key={i} style={staggerStyle(i)}>
                <div className="award-icon-wrap">
                  <i className={`bi ${award.icon}`} />
                </div>
                <div className="award-date">
                  <i className="bi bi-calendar3" style={{ marginRight: "0.25rem" }} />
                  {award.date}
                </div>
                <div className="award-title">{award.title}</div>
                <div className="award-org">
                  <i className="bi bi-building" style={{ marginRight: "0.3rem", opacity: 0.7 }} />
                  {award.org}
                </div>
                <div className="award-desc">{award.desc}</div>
                {award.link && (
                  <a href={award.link} target="_blank" rel="noopener noreferrer" className="award-link">
                    <i className="bi bi-arrow-right" /> Read article
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className={fadeClass("contact")}>
          <div className="section-label">let's connect</div>
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-line" />

          <div className="contact-grid">
            <div className="contact-info">
              <p>
                I'm currently open to entry-level opportunities. Whether you have a project idea, a question, or just want to say hi — I'd love to hear from you!
              </p>
              <div className="contact-links">
                <a href="mailto:espinarusyl@gmail.com" className="contact-link">
                  <span className="contact-link-icon"><i className="bi bi-envelope" /></span>
                  espinarusyl@gmail.com
                </a>
                <a href="https://linkedin.com/in/rusylanneespiña" target="_blank" rel="noreferrer" className="contact-link">
                  <span className="contact-link-icon"><i className="bi bi-linkedin" /></span>
                  linkedin.com/in/rusylanneespiña
                </a>
                <a href="tel:+639760156425" className="contact-link">
                  <span className="contact-link-icon"><i className="bi bi-phone" /></span>
                  +63 976 015 6425
                </a>
                <span className="contact-link">
                  <span className="contact-link-icon"><i className="bi bi-geo-alt" /></span>
                  Cebu City, Philippines
                </span>
              </div>
            </div>

            <div>
              {formStatus === "sent" ? (
                <div className="form-success">
                  <i className="bi bi-check-circle-fill" style={{ fontSize: "1.2rem", flexShrink: 0 }} />
                  Thank you! Your message has been sent. I'll get back to you soon!
                </div>
              ) : (
                <>
                  {formStatus === "error" && (
                    <div className="form-error" style={{ marginBottom: "1rem" }}>
                      <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "1.2rem", flexShrink: 0 }} />
                      Oops! Something went wrong. Please try emailing me directly at espinarusyl@gmail.com
                    </div>
                  )}
                  <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        className="form-input"
                        type="text"
                        name="from_name"
                        placeholder="Your name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        className="form-input"
                        type="email"
                        name="from_email"
                        placeholder="your@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-textarea"
                        name="message"
                        placeholder="What's on your mind?"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <button className="form-submit" type="submit" disabled={formStatus === "sending"}>
                      {formStatus === "sending"
                        ? <><i className="bi bi-arrow-repeat" /> Sending…</>
                        : <><i className="bi bi-send" /> Send Message</>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <span>Built with</span>
        <i className="bi bi-heart-fill" />
        <span>by Rusyl Anne Espiña · © {new Date().getFullYear()}</span>
      </footer>

      <button className="back-top" onClick={() => scrollTo("home")} aria-label="Back to top">
        <i className="bi bi-arrow-up" />
      </button>
    </div>
  );
}

function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setWidth(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: 3,
      width: `${width}%`,
      background: "linear-gradient(90deg, #f36b8d, #f9a8bf)",
      zIndex: 200, transition: "width 0.1s",
    }} />
  );
}