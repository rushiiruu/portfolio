"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "service_rfedngz";
const EMAILJS_TEMPLATE_ID = "template_p5s33jk";
const EMAILJS_PUBLIC_KEY  = "ESO4gIi74dsmAIyQ5";

export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openDemo, setOpenDemo] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for section animations
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
      { threshold: 0.08, rootMargin: "-50px 0px" }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Particle canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 1.4, vy: (Math.random() - 0.5) * 1.4,
        r: Math.random() * 2 + 0.5, a: Math.random()
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? "243,107,141" : "243,107,141";

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${isDark ? 0.25 : 0.15})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color},${(1 - dist / 120) * (isDark ? 0.15 : 0.08)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current!, EMAILJS_PUBLIC_KEY);
      setFormStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setFormStatus("error");
    }
  };

  const navLinks = ["home", "about", "skills", "projects", "awards", "contact"];

  const skills = {
    "{ Frontend }": ["HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "React", "React Native", "JavaScript", "TypeScript"],
    "{ Backend }": ["PHP", "Python", "C", "R", "Node.js"],
    "{ Database & Tools }": ["MySQL", "T-SQL", "Git", "Tableau", "Roboflow", "Microsoft Excel"],
    "{ ML & AI }": ["NLP", "CNN"],
  };

  const projects = [
    {
      num: "01",
      title: "A CNN-Based Model for Detection and Recognition of Philippine Road Signs Under Varied Environmental Conditions",
      type: "Undergraduate Thesis",
      desc: "Developed a deep learning model for detecting and recognizing Philippine road signs across diverse environmental conditions, including sunny, nighttime, and rainy scenarios. Leveraged YOLOv12 to enable efficient real-time object detection. Built a comprehensive dataset from Dumaguete City, applied data augmentation techniques, and performed detailed image annotation using Roboflow.",
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
      desc: "Developed a responsive frontend for a hotel reservation system enabling seamless room browsing, availability checking, and booking workflows. Collaborated on integrating the frontend with a PHP/MySQL backend to support booking logic, data persistence, and reservation management.",
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
      desc: "Co-developed Axolert, enabling real-time outbreak detection and predictive resource planning for faster public health response.",
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

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className={dark ? "dark" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --pink: #e8587a;
          --pink-light: #fce8ef;
          --pink-dark: #c03d5e;
          --pink-mid: #f0859f;
          --pink-glow: rgba(232,88,122,0.18);
          --pink-glow-strong: rgba(232,88,122,0.28);
          --bg: #fdf8f9;
          --bg2: #ffffff;
          --fg: #180d12;
          --fg2: #6b4e58;
          --border: #ecd8de;
          --card: #ffffff;
          --nav-bg: rgba(253,248,249,0.82);
          --shadow-sm: 0 2px 8px rgba(232,88,122,0.07);
          --shadow: 0 8px 32px rgba(232,88,122,0.1), 0 2px 8px rgba(232,88,122,0.06);
          --shadow-lg: 0 20px 60px rgba(232,88,122,0.15), 0 4px 16px rgba(232,88,122,0.08);
        }
        .dark {
          --bg: #0e080b;
          --bg2: #160c10;
          --fg: #f5eaee;
          --fg2: #b08898;
          --border: #2e1820;
          --card: #180d12;
          --nav-bg: rgba(14,8,11,0.85);
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
          --shadow: 0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(232,88,122,0.08);
          --shadow-lg: 0 20px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(232,88,122,0.1);
          --pink-light: rgba(232,88,122,0.12);
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'Outfit', sans-serif;
          background: var(--bg);
          color: var(--fg);
          transition: background 0.4s, color 0.4s;
          overflow-x: hidden;
        }

        h1, h2, h3 { font-family: 'Cormorant Garamond', serif; }

        /* ── SCROLL PROGRESS ──────────────────── */
        .scroll-progress {
          position: fixed; top: 0; left: 0; height: 2px;
          background: linear-gradient(90deg, var(--pink-dark), var(--pink), var(--pink-mid));
          z-index: 200; transition: width 0.05s linear;
          box-shadow: 0 0 8px var(--pink-glow);
        }

        /* ── NAV ─────────────────────────────────── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2.5rem;
          transition: background 0.3s, box-shadow 0.3s, padding 0.3s;
        }
        nav.scrolled {
          box-shadow: var(--shadow-sm);
          padding: 0.75rem 2.5rem;
        }

        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 300; color: var(--pink);
          text-decoration: none; letter-spacing: 0.05em;
          font-style: italic;
          transition: opacity 0.2s, letter-spacing 0.3s;
        }
        .nav-logo:hover { opacity: 0.8; letter-spacing: 0.1em; }

        .nav-links { display: flex; gap: 2.5rem; list-style: none; }
        .nav-links a {
          text-decoration: none; font-size: 0.72rem; font-weight: 500;
          color: var(--fg2); transition: color 0.2s;
          letter-spacing: 0.12em; text-transform: uppercase;
          position: relative; padding-bottom: 3px;
        }
        .nav-links a::before {
          content: '';
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1px; background: var(--pink);
          transform: scaleX(0); transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.76,0,0.24,1);
        }
        .nav-links a:hover::before, .nav-links a.active::before {
          transform: scaleX(1); transform-origin: left;
        }
        .nav-links a:hover, .nav-links a.active { color: var(--pink); }

        .nav-right { display: flex; align-items: center; gap: 1rem; }
        .theme-btn {
          background: none; border: 1px solid var(--border); border-radius: 999px;
          padding: 0.4rem 0.85rem; cursor: pointer; font-size: 0.95rem;
          color: var(--fg); transition: border-color 0.2s, transform 0.3s, background 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .theme-btn:hover { border-color: var(--pink); transform: rotate(20deg); background: var(--pink-light); }

        .hamburger {
          display: none; flex-direction: column; gap: 5px; cursor: pointer;
          background: none; border: none; padding: 4px;
        }
        .hamburger span {
          width: 22px; height: 1.5px; background: var(--fg);
          display: block; transition: 0.35s cubic-bezier(0.76,0,0.24,1);
        }
        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .mobile-menu {
          display: none; position: fixed; top: 60px; left: 0; right: 0;
          background: var(--bg2); border-bottom: 1px solid var(--border);
          padding: 2rem; z-index: 99;
          flex-direction: column; gap: 1.25rem;
          animation: menuSlide 0.3s cubic-bezier(0.76,0,0.24,1);
        }
        @keyframes menuSlide {
          from { opacity: 0; transform: translateY(-12px); clip-path: inset(0 0 100% 0); }
          to { opacity: 1; transform: none; clip-path: inset(0 0 0% 0); }
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          text-decoration: none; font-size: 1.1rem; color: var(--fg2);
          text-transform: uppercase; letter-spacing: 0.1em; font-weight: 400;
          transition: color 0.2s, transform 0.2s;
          font-family: 'Cormorant Garamond', serif; font-style: italic;
        }
        .mobile-menu a:hover { color: var(--pink); transform: translateX(6px); }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          nav { padding: 1rem 1.5rem; }
        }

        /* ── HERO ─────────────────────────────────── */
        #home {
          min-height: 100vh; display: flex; align-items: center;
          padding-top: 6rem; max-width: none; margin: 0;
          padding-left: max(2rem, calc((100vw - 1140px) / 2));
          padding-right: max(2rem, calc((100vw - 1140px) / 2));
          position: relative; overflow: hidden;
        }

        .hero-bg-canvas {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
        }

        .hero-bg-orb {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
          filter: blur(80px);
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(232,88,122,0.12) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: orbDrift1 12s ease-in-out infinite;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(232,88,122,0.08) 0%, transparent 70%);
          bottom: 100px; left: -80px;
          animation: orbDrift2 16s ease-in-out infinite;
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.08); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.12); }
        }

        .hero-inner {
          display: grid; grid-template-columns: 1fr auto;
          gap: 4rem; align-items: center; width: 100%;
          position: relative; z-index: 1;
        }

        .hero-greeting {
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--pink); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 0.75rem;
          opacity: 0; animation: revealFade 0.8s 0.2s ease forwards;
        }
        .hero-greeting-line {
          display: inline-block; width: 2.5rem; height: 1px;
          background: linear-gradient(90deg, var(--pink), transparent);
        }

        h1.hero-name {
          font-size: clamp(3.5rem, 7.5vw, 6.2rem);
          line-height: 1.0; letter-spacing: -0.02em;
          color: var(--fg); margin-bottom: 0.5rem; font-weight: 300;
          opacity: 0; animation: revealUp 0.9s 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        h1.hero-name em {
          color: var(--pink); font-style: italic; font-weight: 300;
          position: relative;
        }
        h1.hero-name em::after {
          content: '';
          position: absolute; bottom: 4px; left: 0; right: 0;
          height: 2px; background: linear-gradient(90deg, var(--pink), transparent);
          opacity: 0.4;
        }
        h1.hero-name .last-name {
          display: block;
          font-style: italic; color: var(--fg2); font-size: 0.72em;
          letter-spacing: 0.02em;
        }

        .hero-tagline {
          font-size: clamp(0.95rem, 1.6vw, 1.05rem);
          color: var(--fg2); margin-bottom: 2.5rem; font-weight: 300;
          line-height: 1.85; max-width: 480px;
          opacity: 0; animation: revealFade 0.8s 0.55s ease forwards;
        }

        .hero-btns {
          display: flex; gap: 0.875rem; flex-wrap: wrap;
          opacity: 0; animation: revealFade 0.8s 0.7s ease forwards;
        }

        @keyframes revealFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: none; }
        }

        /* BUTTONS */
        .btn-primary {
          background: var(--pink); color: white; border: none;
          padding: 0.8rem 2rem; border-radius: 999px; font-size: 0.82rem;
          font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif;
          transition: background 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          letter-spacing: 0.06em; text-transform: uppercase;
          box-shadow: 0 4px 20px var(--pink-glow-strong), inset 0 1px 0 rgba(255,255,255,0.15);
          position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .btn-primary:hover {
          background: var(--pink-dark);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 28px var(--pink-glow-strong);
        }
        .btn-primary:active { transform: translateY(-1px) scale(0.99); }

        .btn-ghost {
          background: none; border: 1px solid var(--border); color: var(--fg2);
          padding: 0.8rem 2rem; border-radius: 999px; font-size: 0.82rem;
          font-weight: 500; cursor: pointer; font-family: 'Outfit', sans-serif;
          transition: border-color 0.2s, color 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .btn-ghost:hover {
          border-color: var(--pink); color: var(--pink);
          transform: translateY(-3px) scale(1.02);
          background: var(--pink-light);
        }

        /* PHOTO */
        .hero-photo-wrap {
          position: relative; width: 290px; height: 350px; flex-shrink: 0;
          opacity: 0; animation: revealUp 1s 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .hero-photo-aura {
          position: absolute; inset: -20px;
          background: conic-gradient(from 0deg, var(--pink-glow), transparent 30%, var(--pink-glow) 60%, transparent 80%, var(--pink-glow));
          border-radius: 50%;
          animation: rotateAura 8s linear infinite;
          opacity: 0.7;
          filter: blur(20px);
        }
        @keyframes rotateAura { to { transform: rotate(360deg); } }

        .hero-photo-frame {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--pink-light) 0%, rgba(248,200,212,0.4) 100%);
          border-radius: 38% 62% 47% 53% / 44% 48% 52% 56%;
          animation: frameShift 10s ease-in-out infinite;
        }
        .dark .hero-photo-frame { background: linear-gradient(135deg, rgba(232,88,122,0.15) 0%, rgba(100,30,50,0.2) 100%); }

        @keyframes frameShift {
          0%, 100% { border-radius: 38% 62% 47% 53% / 44% 48% 52% 56%; }
          25% { border-radius: 56% 44% 60% 40% / 52% 56% 44% 48%; }
          50% { border-radius: 44% 56% 38% 62% / 56% 44% 60% 40%; }
          75% { border-radius: 62% 38% 50% 50% / 40% 60% 38% 62%; }
        }

        .hero-photo-inner {
          position: absolute; inset: 10px;
          border-radius: 38% 62% 47% 53% / 44% 48% 52% 56%;
          overflow: hidden;
          animation: frameShift 10s ease-in-out infinite;
          border: 2px solid rgba(232,88,122,0.25);
        }
        .hero-photo-inner img { width: 100%; height: 100%; object-fit: cover; }

        .hero-photo-tag {
          position: absolute; bottom: -16px; right: -16px;
          background: var(--card); border: 1px solid var(--border);
          color: var(--fg); padding: 0.6rem 1rem; border-radius: 14px;
          font-size: 0.72rem; font-weight: 500; white-space: nowrap;
          box-shadow: var(--shadow);
          animation: floatTag 4s ease-in-out infinite;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .hero-photo-tag .tag-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.5);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes floatTag {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }



        .hero-scroll {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--fg2); font-size: 0.65rem; letter-spacing: 0.14em;
          text-transform: uppercase; opacity: 0;
          animation: revealFade 1s 1.2s ease forwards;
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--pink), transparent);
          animation: scrollLineDrop 1.8s ease-in-out infinite;
        }
        @keyframes scrollLineDrop {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          60% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }

        @media (max-width: 640px) {
          .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 2.5rem; }
          .hero-greeting, .hero-tagline { text-align: center; }
          .hero-tagline { max-width: none; }
          .hero-btns { justify-content: center; }
          .hero-photo-wrap { width: 220px; height: 260px; margin: 0 auto; }
          .hero-stats { display: none; }
          .hero-scroll { display: none; }
        }

        /* ── SECTION HEADINGS ─────────────────── */
        .section-label {
          font-size: 0.68rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.22em; color: var(--pink); margin-bottom: 0.5rem;
          display: flex; align-items: center; gap: 0.6rem;
        }
        .section-label::before {
          content: ''; display: inline-block; width: 20px; height: 1px; background: var(--pink);
        }
        .section-title {
          font-size: clamp(2.5rem, 5vw, 3.8rem); letter-spacing: -0.02em;
          color: var(--fg); margin-bottom: 0.75rem; font-weight: 300;
          line-height: 1.1;
        }
        .section-title em { color: var(--pink); font-style: italic; }
        .section-divider {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 3.5rem;
        }
        .section-divider-line {
          width: 3rem; height: 1px;
          background: linear-gradient(90deg, var(--pink), transparent);
        }
        .section-divider-dot {
          width: 5px; height: 5px; border-radius: 50%; background: var(--pink);
        }

        /* ── REVEAL ANIMATIONS ────────────────── */
        .reveal {
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.visible { opacity: 1; transform: none; }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
        .reveal-delay-5 { transition-delay: 0.5s; }

        /* ── ABOUT ───────────────────────────────── */
        section#about { padding: 7rem 2rem; max-width: 1140px; margin: 0 auto; }

        .about-grid {
          display: grid; grid-template-columns: 1fr 1.1fr; gap: 5rem; align-items: start;
        }
        .about-text p {
          color: var(--fg2); line-height: 2; font-size: 0.975rem;
          margin-bottom: 1.25rem; font-weight: 300;
        }
        .about-text p strong { color: var(--pink); font-weight: 600; }

        .about-highlights { display: flex; flex-direction: column; gap: 0.875rem; }
        .about-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 1.25rem 1.5rem;
          transition: border-color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .about-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--pink); transform: scaleY(0);
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .about-card:hover::before { transform: scaleY(1); }
        .about-card:hover { border-color: var(--pink); transform: translateX(6px); box-shadow: var(--shadow); }
        .about-card-label {
          font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.14em;
          color: var(--pink); font-weight: 700; margin-bottom: 0.3rem;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .about-card-title { font-size: 0.9rem; font-weight: 600; color: var(--fg); margin-bottom: 0.1rem; }
        .about-card-sub { font-size: 0.78rem; color: var(--fg2); line-height: 1.6; }

        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 2.5rem; } }

        /* ── SKILLS ─────────────────────────────── */
        #skills {
          background: var(--bg2); max-width: none;
          padding: 7rem max(2rem, calc((100vw - 1140px) / 2));
          position: relative; overflow: hidden;
        }
        #skills::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        #skills::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        #skills > .inner { max-width: 1140px; margin: 0 auto; }

        .skills-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
          gap: 1.25rem;
        }
        .skill-group {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 20px; padding: 1.75rem;
          transition: border-color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          position: relative; overflow: hidden;
        }
        .skill-group::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 80% 20%, var(--pink-glow), transparent 60%);
          opacity: 0; transition: opacity 0.4s;
          pointer-events: none;
        }
        .skill-group:hover::after { opacity: 1; }
        .skill-group:hover { border-color: var(--pink); transform: translateY(-6px); box-shadow: var(--shadow); }

        .skill-group-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; color: var(--pink); margin-bottom: 1.1rem;
          font-style: italic; font-weight: 400;
        }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-tag {
          background: var(--pink-light); color: var(--pink-dark);
          padding: 0.3rem 0.85rem; border-radius: 999px;
          font-size: 0.74rem; font-weight: 500;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background 0.2s;
          cursor: default;
        }
        .skill-tag:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 4px 12px var(--pink-glow-strong);
          background: var(--pink); color: white;
        }
        .dark .skill-tag { background: rgba(232,88,122,0.12); color: var(--pink-mid); }
        .dark .skill-tag:hover { background: var(--pink); color: white; }

        /* ── PROJECTS ───────────────────────────── */
        section#projects { padding: 7rem 2rem; max-width: 1140px; margin: 0 auto; }

        .projects-list { display: flex; flex-direction: column; gap: 1.25rem; }
        .project-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 22px; padding: 2.25rem;
          display: grid; grid-template-columns: 80px 1fr; gap: 2rem;
          transition: border-color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s;
          position: relative; overflow: hidden;
        }
        .project-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(232,88,122,0.05) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.4s;
          pointer-events: none;
        }
        .project-card:hover::before { opacity: 1; }
        .project-card:hover {
          border-color: rgba(232,88,122,0.4);
          transform: translateX(8px);
          box-shadow: var(--shadow-lg), -4px 0 0 var(--pink);
        }

        .project-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem; color: var(--border); line-height: 1;
          font-style: italic; font-weight: 300; user-select: none;
          transition: color 0.4s, transform 0.4s;
          align-self: start;
        }
        .project-card:hover .project-num {
          color: var(--pink); transform: scale(1.1) rotate(-5deg);
        }
        .project-type { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--pink); font-weight: 600; margin-bottom: 0.3rem; }
        .project-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--fg); margin-bottom: 0.6rem; line-height: 1.3; }
        .project-desc { font-size: 0.855rem; color: var(--fg2); line-height: 1.85; margin-bottom: 1.25rem; font-weight: 300; }
        .project-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .project-tech { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tech-badge {
          background: var(--bg); border: 1px solid var(--border);
          padding: 0.22rem 0.7rem; border-radius: 7px;
          font-size: 0.7rem; font-weight: 500; color: var(--fg2);
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s;
          letter-spacing: 0.02em;
        }
        .project-card:hover .tech-badge { border-color: rgba(232,88,122,0.3); color: var(--fg); }
        .tech-badge:hover { background: var(--pink-light); border-color: var(--pink); color: var(--pink-dark); transform: translateY(-1px); }

        .project-actions { display: flex; align-items: center; gap: 0.75rem; }
        .project-link {
          font-size: 0.74rem; font-weight: 600;
          color: var(--pink); text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.35rem 0.85rem; border: 1px solid rgba(232,88,122,0.3);
          border-radius: 999px; background: var(--pink-light);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
        }
        .dark .project-link { background: rgba(232,88,122,0.08); }
        .project-link:hover { background: var(--pink); color: white; border-color: var(--pink); transform: translateY(-2px); box-shadow: 0 4px 12px var(--pink-glow-strong); }
        .project-period { font-size: 0.7rem; color: var(--fg2); white-space: nowrap; display: flex; align-items: center; gap: 0.3rem; }

        .demo-embed { margin-top: 1.5rem; border-radius: 14px; overflow: hidden; border: 1px solid var(--border); }

        @media (max-width: 640px) {
          .project-card { grid-template-columns: 1fr; gap: 0.5rem; }
          .project-num { font-size: 2rem; }
        }

        /* ── AWARDS ─────────────────────────────── */
        #awards {
          background: var(--bg2); max-width: none;
          padding: 7rem max(2rem, calc((100vw - 1140px) / 2));
          position: relative; overflow: hidden;
        }
        #awards > .inner { max-width: 1140px; margin: 0 auto; }

        .awards-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
          gap: 1.25rem;
        }
        .award-card {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 22px; padding: 1.75rem;
          transition: border-color 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s;
          position: relative; overflow: hidden;
        }
        .award-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--pink), var(--pink-mid), var(--pink));
          background-size: 200% 100%;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .award-card:hover::before { transform: scaleX(1); }
        .award-card:hover {
          border-color: rgba(232,88,122,0.4);
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .award-icon-wrap {
          width: 44px; height: 44px; border-radius: 13px;
          background: var(--pink-light);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1rem;
          transition: background 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .dark .award-icon-wrap { background: rgba(232,88,122,0.12); }
        .award-card:hover .award-icon-wrap { background: var(--pink); transform: scale(1.1) rotate(-8deg); }
        .award-icon-wrap i { font-size: 1.1rem; color: var(--pink); transition: color 0.3s; }
        .award-card:hover .award-icon-wrap i { color: white; }

        .award-date { font-size: 0.68rem; color: var(--pink); font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; text-transform: uppercase; }
        .award-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 600; color: var(--fg); margin-bottom: 0.3rem; line-height: 1.4; }
        .award-org { font-size: 0.74rem; color: var(--fg2); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.3rem; }
        .award-desc { font-size: 0.78rem; color: var(--fg2); line-height: 1.75; font-weight: 300; }
        .award-link {
          display: inline-flex; align-items: center; gap: 0.35rem;
          margin-top: 1rem; font-size: 0.74rem; font-weight: 600;
          color: var(--pink); text-decoration: none;
          padding: 0.3rem 0.8rem; border: 1px solid rgba(232,88,122,0.25);
          border-radius: 999px; background: var(--pink-light);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .dark .award-link { background: rgba(232,88,122,0.08); }
        .award-link:hover { background: var(--pink); color: white; border-color: var(--pink); transform: translateY(-1px); }

        /* ── CONTACT ─────────────────────────────── */
        #contact {
          max-width: none;
          padding: 7rem max(2rem, calc((100vw - 1140px) / 2));
          position: relative; overflow: hidden;
        }
        #contact > .inner { max-width: 1140px; margin: 0 auto; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; }
        .contact-info p { color: var(--fg2); font-size: 1rem; line-height: 1.9; margin-bottom: 2.5rem; font-weight: 300; }
        .contact-links { display: flex; flex-direction: column; gap: 0.875rem; }
        .contact-link {
          display: flex; align-items: center; gap: 1rem;
          text-decoration: none; color: var(--fg2); font-size: 0.875rem;
          transition: color 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .contact-link:hover { color: var(--pink); transform: translateX(5px); }
        .contact-link-icon {
          width: 42px; height: 42px; border-radius: 13px;
          background: var(--pink-light); display: flex; align-items: center;
          justify-content: center; font-size: 1.05rem; flex-shrink: 0;
          transition: background 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          color: var(--pink); border: 1px solid var(--border);
        }
        .dark .contact-link-icon { background: rgba(232,88,122,0.1); }
        .contact-link:hover .contact-link-icon {
          background: var(--pink); color: white;
          transform: scale(1.08) rotate(-5deg);
          border-color: var(--pink);
        }

        /* FORM */
        .contact-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.45rem; }
        .form-label { font-size: 0.7rem; font-weight: 700; color: var(--fg2); letter-spacing: 0.12em; text-transform: uppercase; }
        .form-input, .form-textarea {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 13px; padding: 0.875rem 1.1rem;
          font-size: 0.9rem; color: var(--fg); font-family: 'Outfit', sans-serif;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.2s;
          outline: none; resize: none; width: 100%; font-weight: 300;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--fg2); opacity: 0.4; }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--pink);
          box-shadow: 0 0 0 4px var(--pink-glow);
          background: var(--card);
        }
        .form-textarea { min-height: 150px; }
        .form-submit {
          background: var(--pink); color: white; border: none;
          padding: 0.9rem 2.25rem; border-radius: 999px; font-size: 0.82rem;
          font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif;
          transition: background 0.2s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          align-self: flex-start; letter-spacing: 0.06em; text-transform: uppercase;
          box-shadow: 0 4px 20px var(--pink-glow-strong);
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .form-submit:hover:not(:disabled) {
          background: var(--pink-dark);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 28px var(--pink-glow-strong);
        }
        .form-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .form-success {
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 14px; padding: 1.1rem 1.25rem;
          color: #16a34a; font-size: 0.875rem; font-weight: 500;
          animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .form-error {
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
          border-radius: 14px; padding: 1.1rem 1.25rem;
          color: #dc2626; font-size: 0.875rem; font-weight: 500;
          animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .dark .form-success { color: #4ade80; }
        .dark .form-error { color: #f87171; }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; gap: 3rem; } }

        /* ── FOOTER ─────────────────────────────── */
        footer {
          text-align: center; padding: 2.5rem;
          border-top: 1px solid var(--border);
          color: var(--fg2); font-size: 0.78rem;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          letter-spacing: 0.04em;
        }
        footer i { color: var(--pink); animation: heartbeat 1.5s ease infinite; }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }

        /* ── BACK TO TOP ─────────────────────────── */
        .back-top {
          position: fixed; bottom: 2rem; right: 2rem;
          background: var(--pink); color: white; border: none;
          width: 46px; height: 46px; border-radius: 50%; font-size: 1rem;
          cursor: pointer; box-shadow: 0 4px 20px var(--pink-glow-strong);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, opacity 0.3s;
          display: flex; align-items: center; justify-content: center;
        }
        .back-top:hover { transform: translateY(-5px) scale(1.08); box-shadow: 0 10px 30px var(--pink-glow-strong); }

        /* ── MAGNETIC WRAPPER ─────────────────── */
        .magnetic { display: inline-block; }
      `}</style>

      {/* Scroll progress */}
      <ScrollProgress />

      {/* NAV */}
      <nav className={scrollY > 40 ? "scrolled" : ""}>
        <a className="nav-logo" href="#home" >rae.</a>
        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l}>
              <a
                href={`#${l}`}
                className={activeSection === l ? "active" : ""}
                onClick={(e) => { e.preventDefault(); scrollTo(l); }}
                
                
                
              >{l}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <button
            className="theme-btn"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            
            
          >
            <i className={`bi ${dark ? "bi-sun" : "bi-moon-stars"}`} />
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

      {/* HERO */}
      <section id="home" ref={heroRef} style={{ position: "relative" }}>
        <canvas className="hero-bg-canvas" ref={canvasRef} />
        <div className="hero-bg-orb orb-1" />
        <div className="hero-bg-orb orb-2" />

        <div className="hero-inner">
          <div>
            <div className="hero-greeting">
              <span className="hero-greeting-line" />
              <strong>hello there</strong>
            </div>
            <h1 className="hero-name">
              I'm <strong><em>Rusyl Anne</em></strong>
              <span className="last-name"><strong>Espiña.</strong></span>
            </h1>
            <p className="hero-tagline">
              I enjoy solving problems and building practical applications. As I explore full-stack development, I approach each project as a student for life — always learning and improving.
            </p>
            <div className="hero-btns">
              <button
                className="btn-primary"
                onClick={() => scrollTo("projects")}
                
                
              >
                View My Work
              </button>
              <button
                className="btn-ghost"
                onClick={() => scrollTo("contact")}
                
                
              >
                Get In Touch
              </button>
            </div>
          </div>

          <div className="hero-photo-wrap">
            <div className="hero-photo-aura" />
            <div className="hero-photo-frame" />
            <div className="hero-photo-inner">
              <img src="/rusyl.png" alt="Rusyl Anne Espiña" />
            </div>
            <div className="hero-photo-tag">
              <span className="tag-dot" />
              Open to opportunities
            </div>

          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>scroll</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className={`reveal ${isVisible("about") ? "visible" : ""}`}>
          <div className="section-label">get to know me</div>
          <h2 className="section-title">About <em>Me</em></h2>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                Hi, I'm <span style={{ color: "#f36b8d", fontWeight: "600" }}>Rusyl Anne</span> — a Computer Science graduate from <strong style={{ color: "#f36b8d" }}>Silliman University</strong>. I enjoy building things that are both practical and human-centered, whether it's a mobile app or a web platform (but I mostly prefer web haha!). I try to bring careful problem-solving and thoughtful design to every project.
              </p>
              <p>
                So far, I've had the chance to explore <strong style={{ color: "#f36b8d" }}>full-stack development</strong>, <strong style={{ color: "#f36b8d" }}>NLP research</strong>, <strong style={{ color: "#f36b8d" }}>data analytics</strong>, and <strong style={{ color: "#f36b8d" }}>computer vision</strong>. I've also joined hackathons, which exposed me to real-world problems solved with technology.
              </p>
              <p>
                Right now, I'm looking for opportunities to <strong style={{ color: "#f36b8d" }}>grow and contribute to meaningful projects</strong>, and I'm eager to learn from experienced teams. Outside of coding, I enjoy <strong style={{ color: "#f36b8d" }}>leading design initiatives</strong> and finding ways to make technology more useful for real people.
              </p>
            </div>
            <div className="about-highlights">
              {[
                { icon: "bi-mortarboard", label: "Education", title: "BS Computer Science", subs: ["Silliman University, Dumaguete City · 2022–2026", "GWA: 3.42"] },
                { icon: "bi-trophy", label: "Academic Honors", title: "University Class Honors", subs: ["2022–2023 & 2024–2025 · Scholarship Recipient"] },
                { icon: "bi-journal-text", label: "Research", title: "Research Intern – National University, Manila", subs: ["NLP Research · May–July 2025"] },
                { icon: "bi-people", label: "Leadership", title: "Infomedia Committee Head", subs: ["CCS Dept. Student Council · SU · 2022–2024"] },
              ].map((c, i) => (
                <div
                  className={`about-card reveal reveal-delay-${i + 1} ${isVisible("about") ? "visible" : ""}`}
                  key={i}
                >
                  <div className="about-card-label"><i className={`bi ${c.icon}`} />{c.label}</div>
                  <div className="about-card-title">{c.title}</div>
                  {c.subs.map((s, j) => <div className="about-card-sub" key={j}>{s}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="inner">
          <div className={`reveal ${isVisible("skills") ? "visible" : ""}`}>
            <div className="section-label">what I work with</div>
            <h2 className="section-title">Skills & <em>Technologies</em></h2>
            <div className="section-divider">
              <div className="section-divider-line" />
              <div className="section-divider-dot" />
            </div>
            <div className="skills-grid">
              {Object.entries(skills).map(([group, tags], i) => (
                <div
                  className={`skill-group reveal reveal-delay-${i + 1} ${isVisible("skills") ? "visible" : ""}`}
                  key={group}
                >
                  <div className="skill-group-title">{group}</div>
                  <div className="skill-tags">
                    {tags.map((t) => <span className="skill-tag" key={t}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className={`reveal ${isVisible("projects") ? "visible" : ""}`}>
          <div className="section-label">things I've built</div>
          <h2 className="section-title">Featured <em>Projects</em></h2>
          <div className="section-divider">
            <div className="section-divider-line" />
            <div className="section-divider-dot" />
          </div>
          <div className="projects-list">
            {projects.map((p, i) => (
              <div
                className={`project-card reveal reveal-delay-${Math.min(i + 1, 5)} ${isVisible("projects") ? "visible" : ""}`}
                key={p.num}
              >
                <div className="project-num">{p.num}</div>
                <div>
                  <div className="project-type">{p.type}</div>
                  <div className="project-title">{p.title}</div>
                  <div className="project-desc">{p.desc}</div>
                  <div className="project-footer">
                    <div className="project-tech">
                      {p.tech.map((t) => <span className="tech-badge" key={t}>{t}</span>)}
                    </div>
                    <div className="project-actions">
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link"
                          
                          >
                          <i className="bi bi-box-arrow-up-right" /> Live
                        </a>
                      )}
                      {p.article && (
                        <a href={p.article} target="_blank" rel="noopener noreferrer" className="project-link"
                          
                          >
                          <i className="bi bi-file-earmark-text" /> Article
                        </a>
                      )}
                      {p.video && (
                        <button
                          className="project-link"
                          style={{ background: "none", cursor: "pointer", fontFamily: "inherit" }}
                          onClick={() => setOpenDemo(openDemo === p.num ? null : p.num)}
                          
                          
                        >
                          <i className={`bi ${openDemo === p.num ? "bi-chevron-up" : "bi-play-circle"}`} />
                          {openDemo === p.num ? "Hide" : "Demo"}
                        </button>
                      )}
                      <span className="project-period">
                        <i className="bi bi-calendar3" style={{ opacity: 0.5 }} />
                        {p.period}
                      </span>
                    </div>
                  </div>
                  {p.video && openDemo === p.num && (
                    <div className="demo-embed">
                      <iframe
                        width="100%" height="360"
                        src={p.video.replace("youtu.be/", "www.youtube.com/embed/")}
                        title={p.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ display: "block" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section id="awards">
        <div className="inner">
          <div className={`reveal ${isVisible("awards") ? "visible" : ""}`}>
            <div className="section-label">recognition & certificates</div>
            <h2 className="section-title">Awards & <em>Achievements</em></h2>
            <div className="section-divider">
              <div className="section-divider-line" />
              <div className="section-divider-dot" />
            </div>
            <div className="awards-grid">
              {awards.map((award, i) => (
                <div
                  className={`award-card reveal reveal-delay-${i + 1} ${isVisible("awards") ? "visible" : ""}`}
                  key={i}
                >
                  <div className="award-icon-wrap">
                    <i className={`bi ${award.icon}`} />
                  </div>
                  <div className="award-date">
                    <i className="bi bi-calendar3" style={{ marginRight: "0.3rem" }} />
                    {award.date}
                  </div>
                  <div className="award-title">{award.title}</div>
                  <div className="award-org">
                    <i className="bi bi-building" style={{ opacity: 0.6 }} />
                    {award.org}
                  </div>
                  <div className="award-desc">{award.desc}</div>
                  {award.link && (
                    <a href={award.link} target="_blank" rel="noopener noreferrer" className="award-link"
                      
                      >
                      <i className="bi bi-arrow-right" /> Read article
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="inner">
          <div className={`reveal ${isVisible("contact") ? "visible" : ""}`}>
            <div className="section-label">let's connect</div>
            <h2 className="section-title">Get In <em>Touch</em></h2>
            <div className="section-divider">
              <div className="section-divider-line" />
              <div className="section-divider-dot" />
            </div>
            <div className="contact-grid">
              <div className="contact-info">
                <p>I'm currently open to entry-level opportunities. Whether you have a project idea, a question, or just want to say hi — I'd love to hear from you!</p>
                <div className="contact-links">
                  {[
                    { href: "mailto:espinarusyl@gmail.com", icon: "bi-envelope", label: "espinarusyl@gmail.com" },
                    { href: "https://linkedin.com/in/rusylanneespiña", icon: "bi-linkedin", label: "linkedin.com/in/rusylanneespiña", external: true },
                    { href: "tel:+639760156425", icon: "bi-phone", label: "+63 976 015 6425" },
                    { href: null, icon: "bi-geo-alt", label: "Cebu City, Philippines" },
                  ].map((link, i) => (
                    link.href ? (
                      <a
                        key={i}
                        href={link.href}
                        className="contact-link"
                        {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        
                        
                        
                      >
                        <span className="contact-link-icon"><i className={`bi ${link.icon}`} /></span>
                        {link.label}
                      </a>
                    ) : (
                      <span key={i} className="contact-link">
                        <span className="contact-link-icon"><i className={`bi ${link.icon}`} /></span>
                        {link.label}
                      </span>
                    )
                  ))}
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
                        Oops! Something went wrong. Please email me directly at espinarusyl@gmail.com
                      </div>
                    )}
                    <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input className="form-input" type="text" name="from_name" placeholder="Your name" required
                          value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" name="from_email" placeholder="your@email.com" required
                          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea className="form-textarea" name="message" placeholder="What's on your mind?" required
                          value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                      </div>
                      <button
                        className="form-submit" type="submit" disabled={formStatus === "sending"}
                        
                        
                      >
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
        </div>
      </section>

      <footer>
        <span>Built with</span>
        <i className="bi bi-heart-fill" />
        <span>by Rusyl Anne Espiña · © {new Date().getFullYear()}</span>
      </footer>

      <button
        className="back-top"
        onClick={() => scrollTo("home")}
        aria-label="Back to top"
        
        
      >
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
    <div className="scroll-progress" style={{ width: `${width}%` }} />
  );
}