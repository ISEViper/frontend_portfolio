"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import Link from 'next/link';

export default function SsukSsuk_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'ssukssuk');

  const cursorRef = useRef<HTMLDivElement>(null);
  
  const [theme, setTheme] = useState('dark');
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        if ((window as any).gsap) {
           (window as any).gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        } else {
           cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        }
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    if ((window as any).gsap) {
      const gsap = (window as any).gsap;
      gsap.fromTo('.detail-fade-up', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [selectedProject]);

  if (!selectedProject) return null;

  const handleMouseEnter = () => cursorRef.current?.classList.add('hover');
  const handleMouseLeave = () => cursorRef.current?.classList.remove('hover');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>

      <nav>
        <Link href="/" className="logo" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          HKS.DEV
        </Link>
        <div className="links">
          <button className="theme-toggle" onClick={toggleTheme} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>

      <div className="project-detail-view">
        <div className="detail-header" style={{ backgroundImage: `url(${selectedProject.image})` }}>
          <div className="detail-title-area detail-fade-up">
            <button className="btn-back" onClick={() => router.push('/')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              ← Back to Archive
            </button>
            <h1 className="detail-title">{selectedProject.title}</h1>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-sidebar detail-fade-up">
            <h3>Project Info</h3>
            <div className="info-group">
              <span className="info-label">Role</span>
              <span className="info-value">{selectedProject.role}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Timeline</span>
              <span className="info-value">{selectedProject.year}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Tech Stack</span>
              <div className="tech-tags">
                {selectedProject.tech.map((t: string, idx: number) => (
                  <span key={idx} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-main detail-fade-up">
            <h3>Frontend Highlights</h3>
            <p className="overview-text">{selectedProject.overview}</p>
            <ul className="highlight-list">
              {selectedProject.highlights.map((highlight: string, idx: number) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>

            <div className="detail-preview"
              onMouseEnter={() => {
                if (cursorRef.current) cursorRef.current.style.display = 'none';
                document.body.style.cursor = 'auto';
              }}
              onMouseLeave={() => {
                if (cursorRef.current) cursorRef.current.style.display = 'block';
                document.body.style.cursor = 'none';
              }}
            >
              <h3>Interactive Preview</h3>
              <div className="demo-mobile-frame">
                <div className="demo-header" style={{ backgroundColor: '#2ed573' }}>Smart Farm</div>
                <div className="demo-content" style={{ justifyContent: 'flex-start', padding: '20px' }}>
                  <div className="demo-sensor-card">
                    <span>Temperature</span>
                    <h3>24.5°C</h3>
                  </div>
                  <div className="demo-sensor-card">
                    <span>Humidity</span>
                    <h3>60%</h3>
                  </div>
                  {!demoActive ? (
                    <button className="demo-btn" onClick={() => setDemoActive(true)}>Load Chart</button>
                  ) : (
                    <div className="demo-chart-bar-wrap">
                      <div className="demo-chart-bar" style={{ height: '40%' }}></div>
                      <div className="demo-chart-bar" style={{ height: '70%' }}></div>
                      <div className="demo-chart-bar" style={{ height: '50%' }}></div>
                      <div className="demo-chart-bar" style={{ height: '90%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
