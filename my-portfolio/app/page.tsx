"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { projectData } from '../lib/data';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaFigma, FaGitAlt, FaGithub } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiVuedotjs, SiTailwindcss, SiBootstrap, SiFlutter, SiDjango, SiVite, SiWebpack, SiThreedotjs } from 'react-icons/si';

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState('dark');

  const heroTitleRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadDependencies = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
        await loadScript('https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js');
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load scripts:", error);
      }
    };

    loadDependencies();
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !(window as any).gsap || !(window as any).Lenis) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    const Lenis = (window as any).Lenis;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      lenis.destroy();
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !(window as any).gsap) return;
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    ScrollTrigger.getAll().forEach((t: any) => t.kill());

    // Set initial state for slide reveal entryway animation
    gsap.set(['.hero-title', '.hero-subtitle'], { yPercent: 125, opacity: 0 });

    const tlLoader = gsap.timeline();
    tlLoader
      .to('.loader-bar', { width: '100%', duration: 1, ease: 'power2.inOut' })
      .to('.loader', { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', duration: 1, ease: 'power4.inOut', delay: 0.2 })
      .to(['.hero-title', '.hero-subtitle'], {
        yPercent: 0,
        opacity: 1,
        stagger: 0.04,
        duration: 0.75,
        ease: 'power4.out'
      });

    const scrollGroup = document.querySelectorAll('.hero-title-wrap, .reveal-marquee');
    if (scrollGroup.length > 0) {
      gsap.to(scrollGroup, {
        yPercent: -35, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    }
    revealRefs.current.forEach((line) => {
      if (!line) return;
      gsap.to(line, {
        y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: line.parentElement, start: 'top 85%' },
      });
    });
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.projects-grid', start: 'top 75%' }
        }
      );
    }

    setTimeout(() => { ScrollTrigger.refresh(); }, 100);

  }, [isLoaded]);

  // Interactive Canvas Plexus Particle Effect inside the Hero Reveal Mask
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Base is dark -> Reveal is light (use blue/dark particles)
        // Base is light -> Reveal is dark (use cyan/glowing particles)
        ctx.fillStyle = currentTheme === 'dark' ? 'rgba(0, 51, 204, 0.85)' : 'rgba(0, 210, 255, 0.85)';
        ctx.fill();
      }
    }

    const particlesCount = 65;
    const particles: Particle[] = [];
    for (let i = 0; i < particlesCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    const mouseMoveHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovering = true;
    };

    const mouseLeaveHandler = () => {
      isHovering = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', mouseMoveHandler);
      parent.addEventListener('mouseleave', mouseLeaveHandler);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

      // Update and draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw lines between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = currentTheme === 'dark'
              ? `rgba(0, 51, 204, ${0.18 * (1 - dist / 110)})`
              : `rgba(0, 210, 255, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw line from particle to mouse if hovering
        if (isHovering) {
          const dx = particles[i].x - mouseX;
          const dy = particles[i].y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = currentTheme === 'dark'
              ? `rgba(0, 51, 204, ${0.35 * (1 - dist / 160)})`
              : `rgba(0, 210, 255, ${0.4 * (1 - dist / 160)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', mouseMoveHandler);
        parent.removeEventListener('mouseleave', mouseLeaveHandler);
      }
    };
  }, [isLoaded]);

  // CSS variables updates on MouseMove inside the Hero Section for the Reveal Mask
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseEnterHero = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--mask-size', `180px`);
  };

  const handleMouseLeaveHero = () => {
    if (!heroRef.current) return;
    heroRef.current.style.setProperty('--mask-size', `0px`);
  };

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!ScrollTrigger) return;
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  interface SkillItem {
    name: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    highlight?: boolean;
  }

  const skillsRow1: SkillItem[] = [
    { name: "HTML5", icon: FaHtml5 },
    { name: "CSS3", icon: FaCss3Alt },
    { name: "JavaScript", icon: FaJs },
    { name: "TypeScript", icon: SiTypescript, highlight: true },
    { name: "React", icon: FaReact, highlight: true },
    { name: "Next.js", icon: SiNextdotjs, highlight: true },
    { name: "Vue.js", icon: SiVuedotjs },
    { name: "Tailwind CSS", icon: SiTailwindcss, highlight: true },
    { name: "Bootstrap", icon: SiBootstrap },
  ];

  const skillsRow2: SkillItem[] = [
    { name: "Flutter", icon: SiFlutter, highlight: true },
    { name: "React Native", icon: FaReact, highlight: true },
    { name: "Node.js", icon: FaNodeJs, highlight: true },
    { name: "Django", icon: SiDjango },
    { name: "Vite", icon: SiVite },
    { name: "Webpack", icon: SiWebpack },
    { name: "Three.js", icon: SiThreedotjs, highlight: true },
    { name: "Figma", icon: FaFigma },
    { name: "Git", icon: FaGitAlt, highlight: true },
    { name: "GitHub", icon: FaGithub },
  ];

  const handleMouseEnter = () => cursorRef.current?.classList.add('hover');
  const handleMouseLeave = () => cursorRef.current?.classList.remove('hover');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const addToRevealRefs = (el: HTMLDivElement | null) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>

      {!isLoaded && (
        <div className="loader">
          <div className="loader-text">Loading</div>
          <div className="loader-bar-wrap"><div className="loader-bar"></div></div>
        </div>
      )}

      <nav>
        <Link href="/" className="logo-nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <span className="logo-k">K</span><span className="logo-dot">.</span><span className="logo-hyun">HYUN</span>
        </Link>
        <div className="links">
          <a href="#projects" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Archive</a>
          <a href="#skills" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Skills</a>
          <a href="#contact" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Contact</a>
          <button className="theme-toggle" onClick={toggleTheme} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>

      <section
        className="hero"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnterHero}
        onMouseLeave={handleMouseLeaveHero}
      >
        {/* Base Layer (Minimal outline typography) */}
        <div className="hero-layer base">
          <div className="hero-title-wrap" ref={heroTitleRef}>
            <div className="title-overflow"><h1 className="hero-title main">KWANGSU</h1></div>
            <div className="title-overflow"><h1 className="hero-title outline">HYUN</h1></div>
            <div className="title-overflow"><div className="hero-subtitle">FRONTEND DEVELOPER</div></div>
          </div>
        </div>

        {/* Reveal Layer (High-tech plexus + neon highlighted typography) */}
        <div className="hero-layer reveal">
          <canvas ref={canvasRef} className="hero-canvas" />
          <div className="hero-grid-overlay" />
          {/* Top Marquee */}
          <div className="marquee-container reveal-marquee top" ref={marqueeRef}>
            <div className="marquee-content">
              STATE MANAGEMENT • COMPONENT MODULARIZATION • PERFORMANCE TUNING • BROWSER RENDERING • CLEAN CODE • WEB ACCESS STANDARDS • API INTEGRATION • STATE MANAGEMENT • COMPONENT MODULARIZATION • PERFORMANCE TUNING • BROWSER RENDERING • CLEAN CODE • WEB ACCESS STANDARDS • API INTEGRATION •
            </div>
            <div className="marquee-content" aria-hidden="true">
              STATE MANAGEMENT • COMPONENT MODULARIZATION • PERFORMANCE TUNING • BROWSER RENDERING • CLEAN CODE • WEB ACCESS STANDARDS • API INTEGRATION • STATE MANAGEMENT • COMPONENT MODULARIZATION • PERFORMANCE TUNING • BROWSER RENDERING • CLEAN CODE • WEB ACCESS STANDARDS • API INTEGRATION •
            </div>
          </div>

          <div className="hero-title-wrap">
            <div className="title-overflow"><h1 className="hero-title main highlighted">KWANGSU</h1></div>
            <div className="title-overflow"><h1 className="hero-title outline highlighted">HYUN</h1></div>
            <div className="title-overflow"><div className="hero-subtitle highlighted">CREATIVE DEVELOPER</div></div>
          </div>

          {/* Bottom Marquee */}
          <div className="marquee-container reveal-marquee bottom" ref={marqueeRef2}>
            <div className="marquee-content">
              USER EXPERIENCE • INTERACTION DESIGN • MICRO-ANIMATIONS • PIXEL PERFECT • FIGMA WORKFLOW • DESIGN SYSTEMS • VISUAL HIERARCHY • USER EXPERIENCE • INTERACTION DESIGN • MICRO-ANIMATIONS • PIXEL PERFECT • FIGMA WORKFLOW • DESIGN SYSTEMS • VISUAL HIERARCHY •
            </div>
            <div className="marquee-content" aria-hidden="true">
              USER EXPERIENCE • INTERACTION DESIGN • MICRO-ANIMATIONS • PIXEL PERFECT • FIGMA WORKFLOW • DESIGN SYSTEMS • VISUAL HIERARCHY • USER EXPERIENCE • INTERACTION DESIGN • MICRO-ANIMATIONS • PIXEL PERFECT • FIGMA WORKFLOW • DESIGN SYSTEMS • VISUAL HIERARCHY •
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="reveal-line"><div className="reveal-inner" ref={addToRevealRefs}>백엔드 아키텍처에 대한 이해로</div></div>
        <div className="reveal-line"><div className="reveal-inner highlight" ref={addToRevealRefs}>데이터의 흐름을 통제하고,</div></div>
        <div className="reveal-line"><div className="reveal-inner" ref={addToRevealRefs}>안정적인 API 통신을 통해</div></div>
        <div className="reveal-line"><div className="reveal-inner highlight" ref={addToRevealRefs}>최적의 UI/UX를 렌더링합니다.</div></div>
      </section>

      <section id="projects" className="projects">
        <h2 className="section-header">Project Archive</h2>
        <div className="projects-grid">
          {projectData.map((project, index) => (
            <div className="project-card-wrapper" key={project.id}>
              <Link
                href={`/project/${project.slug}`}
                className="project-card"
                ref={(el) => { cardsRef.current[index] = el; }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="project-logo-container">
                  <div className="project-logo-text">{project.logo}</div>
                  <div className="project-logo-sub">{project.logoDesc}</div>
                </div>
                <div className="project-label">
                  <span className="label-title">{project.title}</span>
                  <span className="label-year">{project.year}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="skills" className="skills">
        <div className="skills-inner">
          <div className="tech-row left">
            <div className="marquee-track">
              {skillsRow1.map((skill, idx) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={`r1-${idx}`}
                    className={`tech-marquee-item ${skill.highlight ? 'highlight' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <IconComponent className="tech-marquee-icon" />
                    <span className="tech-marquee-text">{skill.name}</span>
                  </div>
                );
              })}
              {/* Duplicate for seamless infinite marquee scroll */}
              {skillsRow1.map((skill, idx) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={`r1-dup-${idx}`}
                    className={`tech-marquee-item ${skill.highlight ? 'highlight' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <IconComponent className="tech-marquee-icon" />
                    <span className="tech-marquee-text">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="tech-row right">
            <div className="marquee-track">
              {skillsRow2.map((skill, idx) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={`r2-${idx}`}
                    className={`tech-marquee-item ${skill.highlight ? 'highlight' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <IconComponent className="tech-marquee-icon" />
                    <span className="tech-marquee-text">{skill.name}</span>
                  </div>
                );
              })}
              {/* Duplicate for seamless infinite marquee scroll */}
              {skillsRow2.map((skill, idx) => {
                const IconComponent = skill.icon;
                return (
                  <div
                    key={`r2-dup-${idx}`}
                    className={`tech-marquee-item ${skill.highlight ? 'highlight' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <IconComponent className="tech-marquee-icon" />
                    <span className="tech-marquee-text">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <h2 className="footer-title">Let's Work</h2>
        <h2 className="footer-title outline" style={{ fontStyle: 'italic' }}>Together</h2>
        <div className="footer-links">
          <a href="mailto:jklas187@naver.com" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Email</a>
          <a href="https://github.com/ISEViper" target="_blank" rel="noopener noreferrer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>GitHub</a>
        </div>
      </footer>
    </div>
  );
}