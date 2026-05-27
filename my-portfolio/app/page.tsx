"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { projectData } from '../lib/data';

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState('dark');

  const heroTitleRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

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

    const tlLoader = gsap.timeline();
    tlLoader
      .to('.loader-bar', { width: '100%', duration: 1, ease: 'power2.inOut' })
      .to('.loader', { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', duration: 1, ease: 'power4.inOut', delay: 0.2 });

    if (heroTitleRef.current) {
      gsap.to(heroTitleRef.current, {
        yPercent: 50, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      });
    }
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        yPercent: -50, ease: 'none',
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
        <Link href="/" className="logo" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          HKS.DEV
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

      <section className="hero">
        <div className="hero-title-wrap" ref={heroTitleRef}>
          <h1 className="hero-title main">KWANGSU</h1>
          <h1 className="hero-title outline">HYUN</h1>
          <div className="hero-subtitle">FRONTEND DEVELOPER</div>
        </div>
        <div className="marquee-container" ref={marqueeRef}>
          <div className="marquee-content">
            DATA FLOW • USER EXPERIENCE • OPTIMIZATION • DATA FLOW • USER EXPERIENCE • OPTIMIZATION •
          </div>
          <div className="marquee-content" aria-hidden="true">
            DATA FLOW • USER EXPERIENCE • OPTIMIZATION • DATA FLOW • USER EXPERIENCE • OPTIMIZATION •
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
            <div className="tech-text">FRONTEND <span>FLUTTER</span> REACT NATIVE <span>NEXT.JS</span> VUE FRONTEND <span>FLUTTER</span> REACT NATIVE <span>NEXT.JS</span> VUE</div>
          </div>
          <div className="tech-row right">
            <div className="tech-text">BACKEND <span>JAVA</span> SPRING BOOT <span>PYTHON</span> 3DGS BACKEND <span>JAVA</span> SPRING BOOT <span>PYTHON</span> 3DGS</div>
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