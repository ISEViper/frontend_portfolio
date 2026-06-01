"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import {
  Menu, ArrowRight, Train, Lightbulb, Sparkles, X, Info, ChevronLeft, Newspaper, Search, PlaySquare
} from 'lucide-react';
import Link from 'next/link';
import './didim.css';

export default function Didim_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'didim');
  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');
  const [emailCopied, setEmailCopied] = useState(false);
  const [modalTarget, setModalTarget] = useState<'mobile' | 'web' | null>(null);
  const [clickedFeature, setClickedFeature] = useState('');
  
  const [currentView, setCurrentView] = useState<'report' | 'stockDetail'>('report');

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
      (window as any).gsap.fromTo('.detail-fade-up',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [selectedProject]);

  if (!selectedProject) return null;

  const handleMouseEnter = () => cursorRef.current?.classList.add('hover');
  const handleMouseLeave = () => cursorRef.current?.classList.remove('hover');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleFeatureClick = (feature: string) => {
    if (feature === '스페이스홀딩스') {
      setCurrentView('stockDetail');
    } else {
      setClickedFeature(feature);
      setModalTarget('web');
    }
  };

  const engineeringItems = [
    {
      title: 'AI 모델 호출 비용 및 렌더링 지연 최적화',
      problem: '주식 코멘트 및 추천 리포트 생성 시 다수의 AI 모델 호출로 인한 지연 시간 발생과 프론트엔드 화면의 멈춤 현상 우려',
      solution: '목적에 따라 AI 모델을 이원화(2.0 Flash / 2.5 Pro)하고, 백엔드(Django)에서 캐싱된 데이터를 프론트엔드(Vue.js)로 즉시 전달하도록 비동기 처리(Axios) 아키텍처를 설계하여 응답 속도와 렌더링 효율을 극대화했습니다.',
    },
    {
      title: '비정형 AI 응답 데이터의 UI 컴포넌트 바인딩',
      problem: 'LLM(Gemini)의 텍스트 위주 자연어 응답을 구조화된 웹 화면(UI) 요소에 일관성 있고 안정적으로 렌더링하기 어려운 문제',
      solution: '시스템 프롬프트에 JSON Output Schema를 강제하여 응답받고, 생성된 텍스트를 Regex와 JSON Parser를 통해 파싱하여 Vue.js의 상태(State)에 주입함으로써, 리포트 카드 및 뱃지 UI에 즉시 바인딩 가능한 정형 데이터 파이프라인을 구축했습니다.',
    },
    {
      title: '대규모 금융 데이터 필터링 UI 및 상태 관리',
      problem: '전국 은행의 예적금 상품을 금리, 기간, 우대 조건 등 복잡한 조건으로 필터링할 때 발생하는 상태 관리의 복잡성과 UI 버벅임',
      solution: 'Vue.js 컴포넌트 단에서 사용자의 검색 조건 상태를 중앙 집중식으로 관리하고, 변경된 필터 상태만 Django REST Framework의 QuerySet 체이닝 엔드포인트로 전송하여 다중 조건 검색을 단일 쿼리로 처리, 화면의 끊김 없는 탐색 경험을 제공했습니다.',
    },
  ];

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>
      <style>{`
        @keyframes svgEdgeMove {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes bounceFloat {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
        .speech-bubble {
          position: absolute;
          top: -36px;
          left: 50%;
          transform: translateX(-50%);
          background: #818cf8;
          color: #fff;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          animation: bounceFloat 1.5s ease-in-out infinite;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(129, 140, 248, 0.4);
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px 6px 0;
          border-style: solid;
          border-color: #818cf8 transparent transparent transparent;
        }
      `}</style>

      {/* ── NAV ── */}
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="logo-nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span className="logo-k">K</span><span className="logo-dot">.</span><span className="logo-hyun">HYUN</span>
          </Link>
          <div className="nav-social-links">
            <button className="nav-social-btn" onClick={() => { navigator.clipboard.writeText('jklas187@naver.com'); setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000); }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} aria-label="Copy Email">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <span>Email</span>
            </button>
            <a href="https://github.com/ISEViper" target="_blank" rel="noopener noreferrer" className="nav-social-btn" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div className="links">
          <button className="theme-toggle" onClick={toggleTheme} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="project-detail-view">

        {/* Header */}
        <div className="detail-header" style={{ backgroundImage: "url('/projects/didim/didim_background.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
          <div className="detail-title-area detail-fade-up">
            <button className="btn-back" onClick={() => router.push('/')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>&larr; Back to Archive</button>
            <h1 className="detail-title">{selectedProject.title}</h1>
            <h2 className="detail-subtitle" style={{ color: 'white', marginTop: '10px', fontWeight: 600 }}>사용자 맞춤형 금융상품 검색 및 AI 포트폴리오</h2>
          </div>
        </div>

        {/* ════════════════════════════════════════
            BODY — 2행 레이아웃
            행 1: [Project Info | Frontend Engineering]
            행 2: [Interactive Preview (웹 플로우)]
            ════════════════════════════════════════ */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 5vw' }}>

          {/* === Row 1: Project Info + Frontend Engineering === */}
          <div className="detail-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'start', marginBottom: '60px' }}>

            {/* PROJECT INFO */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
                Project Info
              </h3>
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

              {/* Service Overview */}
              <div className="info-group" style={{ marginTop: '24px' }}>
                <span className="info-label info-label-blue">Service Overview</span>
                <ul className="sidebar-overview-list">
                  <li>AI 기반 사용자 맞춤형 금융 상품 및 자산 분배 추천 플랫폼</li>
                  <li>Gemini API를 활용한 실시간 주식/ETF 심층 분석 및 투자 코멘트 제공</li>
                  <li>금융감독원 Open API 기반 전국 은행 예적금 데이터 실시간 통합 검색</li>
                </ul>
              </div>

              {/* Key Features */}
              <div className="info-group" style={{ marginTop: '24px' }}>
                <span className="info-label info-label-blue">Key Features</span>
                <table className="sidebar-features-table">
                  <tbody>
                    <tr><td>AI 리포트</td><td>현재 보유 자산과 투자 성향을 교차 분석하여 초개인화된 예적금/주식 포트폴리오 제안</td></tr>
                    <tr><td>실시간 코멘트</td><td>자산 유형(Stock/ETF)에 따른 AI 페르소나 이원화 및 최신 정보 연동을 통한 투자 의견 제공</td></tr>
                    <tr><td>다중 조건 검색</td><td>금리, 가입 기간 등 다중 조건 동적 필터링 및 카카오맵 기반 주변 은행 지점 검색</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FRONTEND ENGINEERING */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
                Frontend Engineering (기술적 기여 및 의사결정)
              </h3>
              <div className="lineup-highlights-container" style={{ marginTop: '0' }}>
                {engineeringItems.map((h, i) => (
                  <div key={i} className="lineup-highlight-card">
                    <div className="lineup-highlight-header">
                      <span className="lineup-highlight-num">0{i + 1}</span>
                      <h4>{h.title}</h4>
                    </div>
                    <div className="lineup-highlights-container" style={{ gap: '12px', marginTop: '0', marginBottom: '0' }}>
                      <div className="lineup-problem">
                        <span className="badge">Problem</span>
                        <p>{h.problem}</p>
                      </div>
                      <div className="lineup-solution">
                        <span className="badge">Solution</span>
                        <p>{h.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── 행 2: Interactive Preview ─── */}
          <div className="detail-fade-up"
            onMouseEnter={() => { if (cursorRef.current) cursorRef.current.style.display = 'none'; document.body.style.cursor = 'auto'; }}
            onMouseLeave={() => { if (cursorRef.current) cursorRef.current.style.display = 'block'; document.body.style.cursor = 'none'; }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '30px' }}>
              Interactive Preview
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '24px', lineHeight: '1.6' }}>
              DIDIM 웹 플랫폼의 AI 포트폴리오 분석 리포트 화면을 체험해보세요. 각 컴포넌트를 클릭하면 작동 방식에 대한 안내가 제공됩니다. 주식 종목 중 하나를 눌러 상세 페이지 디자인도 확인해보세요.
            </p>

            {/* === 웹 인터페이스 표시 === */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
              
              <div className="lineup-web-frame" style={{ aspectRatio: '16/9', width: '100%', maxWidth: '1000px', backgroundColor: '#1a1b36', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: 'Pretendard, sans-serif', position: 'relative' }}>
                
                {/* ─── REPORT VIEW ─── */}
                {currentView === 'report' && (
                  <>
                    {/* Header */}
                    <div style={{ padding: '20px 32px', borderBottom: '1px solid #2a2c5a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Menu size={24} color="#fff" style={{ cursor: 'pointer' }} onClick={() => handleFeatureClick('메뉴')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                        <span style={{ fontSize: '15px', fontWeight: '700' }}>현광수님, 안녕하세요.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: '600' }}>
                        <span style={{ cursor: 'pointer', color: '#a5a6cc' }} onClick={() => handleFeatureClick('로그아웃')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>로그아웃</span>
                        <span style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => handleFeatureClick('메인 페이지')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>DIDIM</span>
                      </div>
                    </div>

                    <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
                      {/* Title */}
                      <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                          <span>🚆</span> 디딤 AI 금융 추천 리포트
                        </h2>
                        <p style={{ fontSize: '14px', color: '#a5a6cc', margin: 0 }}>고객님의 금융 성향에 따른 자산 관리 방향과 상품들을 추천해드립니다.</p>
                      </div>

                      {/* 새로운 AI 추천 생성하기 */}
                      <div style={{ border: '1px solid #2a2c5a', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>새로운 AI 추천 생성하기</div>
                          <div style={{ fontSize: '13px', color: '#a5a6cc' }}>고객님의 금융 성향에 따른 자산 관리 방향과 상품들을 추천해드립니다.</div>
                        </div>
                        <button onClick={() => handleFeatureClick('새로운 AI 추천 생성')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#3b3d8c', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#2f3170'} onMouseOut={e => e.currentTarget.style.background='#3b3d8c'}>
                          다시 생성하기 <ArrowRight size={16} />
                        </button>
                      </div>

                      {/* 현광수님 자산 정보 */}
                      <div style={{ border: '1px solid #2a2c5a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>현광수님 자산 정보</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                          <div onClick={() => handleFeatureClick('입출금/저축 내역')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#242544', padding: '24px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#2c2d52'} onMouseOut={e => e.currentTarget.style.background='#242544'}>
                            <div style={{ fontSize: '13px', color: '#a5a6cc', marginBottom: '8px' }}>입출금/저축</div>
                            <div style={{ fontSize: '22px', fontWeight: '800' }}>300,000,000원</div>
                          </div>
                          <div onClick={() => handleFeatureClick('투자 내역')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#242544', padding: '24px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#2c2d52'} onMouseOut={e => e.currentTarget.style.background='#242544'}>
                            <div style={{ fontSize: '13px', color: '#a5a6cc', marginBottom: '8px' }}>투자</div>
                            <div style={{ fontSize: '22px', fontWeight: '800' }}>3,000,000원</div>
                          </div>
                          <div onClick={() => handleFeatureClick('연봉 정보 수정')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#242544', padding: '24px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#2c2d52'} onMouseOut={e => e.currentTarget.style.background='#242544'}>
                            <div style={{ fontSize: '13px', color: '#a5a6cc', marginBottom: '8px' }}>연봉</div>
                            <div style={{ fontSize: '22px', fontWeight: '800' }}>30,000,000원</div>
                          </div>
                        </div>
                      </div>

                      {/* 현광수님의 투자 성향 */}
                      <div style={{ border: '1px solid #2a2c5a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>현광수님의 투자 성향</div>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                          <div onClick={() => handleFeatureClick('투자 성향 재분석')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#00b493', color: '#fff', fontSize: '20px', fontWeight: '800', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', flexShrink: 0, boxShadow: '0 10px 20px rgba(0, 180, 147, 0.2)', cursor: 'pointer' }}>
                            안정추구형
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>안정 속에서 꾸준한 성장을 추구하는 현명한 투자자</div>
                            <div style={{ fontSize: '13px', color: '#a5a6cc', lineHeight: '1.6' }}>원금 손실 위험은 최소화하면서도, 물가상승률 이상의 수익을 기대하는 신중한 성향을 가지고 계세요. 안정적인 예적금을 선호하시지만, 자산 증식을 위해 소폭의 위험을 감수할 의사도 있으신 편이에요.</div>
                          </div>
                        </div>
                      </div>

                      {/* 현광수님 추천 자산 분배 */}
                      <div style={{ border: '1px solid #2a2c5a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px' }}>현광수님 추천 자산 분배</div>
                        
                        <div style={{ marginBottom: '32px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>현재 자산 분배</div>
                          <div style={{ height: '16px', display: 'flex', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ width: '90%', background: '#00dc82', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#000' }}>90%</div>
                            <div style={{ width: '10%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff' }}>10%</div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#a5a6cc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00dc82' }}></div> 입출금/예적금</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> 국내 주식</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>디딤 AI 추천 자산 분배 구성</div>
                          <div style={{ height: '16px', display: 'flex', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                            <div style={{ width: '40%', background: '#00dc82', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#000' }}>40%</div>
                            <div style={{ width: '20%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff' }}>20%</div>
                            <div style={{ width: '15%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff' }}>15%</div>
                            <div style={{ width: '15%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff' }}>15%</div>
                            <div style={{ width: '10%', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#fff' }}>10%</div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#a5a6cc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00dc82' }}></div> 입출금/예적금</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> 국내 주식</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></div> 해외 주식</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div> ETF/펀드</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></div> 금/부동산리츠</div>
                          </div>
                        </div>

                        <div style={{ background: '#242544', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#a5a6cc' }}>
                          현재 자산은 안정성에 크게 치우쳐 있어, 5-10년의 투자 기간 동안 목표하시는 자산 증식을 이루기에는 다소 아쉬울 수 있습니다.
                        </div>
                      </div>

                      {/* 디딤 AI의 조언 */}
                      <div style={{ border: '1px solid #2a2c5a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>💡</span> 디딤 AI의 조언
                        </div>
                        <div style={{ fontSize: '13px', color: '#a5a6cc', lineHeight: '1.6', marginBottom: '24px' }}>
                          안정적인 자산의 비중을 유지하면서, 매월 저축 가능한 금액을 활용해 투자 비중을 점진적으로 늘려나가는 전략이 필요해요. 이를 통해 안정성과 수익성을 동시에 추구할 수 있습니다.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {[
                            "매월 저축 여력(30~50만원)을 활용해 추천 투자자산에 꾸준히 투자하여 '코스트 에버리징' 효과를 누리세요.",
                            "총자산의 80%에 해당하는 핵심 자금은 금리가 높은 우량 예적금 상품에 분산 예치하여 안정적인 이자 수익을 확보하세요.",
                            "투자자산(20%)은 한 종목에 집중하기보다, 안정적인 배당주나 ETF 등으로 분산하여 변동성 위험을 관리하세요."
                          ].map((advice, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#242544', padding: '16px 20px', borderRadius: '8px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#3b3d8c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>{i + 1}</div>
                              <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.5' }}>{advice}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 현광수님 성향에 맞는 금융상품 추천 */}
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>현광수님 성향에 맞는 금융상품 추천</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          
                          {/* 금융상품 */}
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>금융상품</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                              {[
                                { name: '디딤 시그니처 적금', bank: '디딤뱅크', type: '적금', rate: '최고 6%' },
                                { name: '퓨처 스마트 적금', bank: '미래상호은행', type: '적금', rate: '최고 6.7%' },
                                { name: '메타 챌린지 적금', bank: '메타파이낸스', type: '적금', rate: '최고 6%' }
                              ].map((prod, i) => (
                                <div key={i} onClick={() => handleFeatureClick(prod.name)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ border: '1px solid #2a2c5a', borderRadius: '8px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }} onMouseOver={e => e.currentTarget.style.background='#242544'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                                  <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>{prod.name}</div>
                                  <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '16px' }}>{prod.bank}</div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ background: '#242544', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#818cf8', fontWeight: '600' }}>{prod.type}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#818cf8' }}>{prod.rate}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: '12px', color: '#a5a6cc', lineHeight: '1.6' }}>현재 제공된 목록에서 가장 높은 수준의 금리를 제공하는 상품들입니다. 안정적인 자산에서 최대의 이자 수익을 확보하기에 적합합니다.</div>
                          </div>

                          {/* 주식 종목 */}
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>주식 종목</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                              {[
                                { name: '스페이스홀딩스', code: '448290', isTarget: true },
                                { name: '네오금융지주', code: '502910' },
                                { name: '아크글로벌리츠', code: '918230' }
                              ].map((stock, i) => stock.isTarget ? (
                                <div key={i} onClick={() => handleFeatureClick(stock.name)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                style={{
                                  position: 'relative', border: '1px solid #2a2c5a', borderRadius: '8px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s',
                                  background: 'rgba(129, 140, 248, 0.1)'
                                }}
                                onMouseOver={e => e.currentTarget.style.background='#242544'}
                                onMouseOut={e => e.currentTarget.style.background='rgba(129, 140, 248, 0.1)'}>
                                  
                                  <svg style={{ position: 'absolute', top: '-1px', left: '-1px', width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}>
                                    <defs>
                                      <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%" spreadMethod="repeat">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="25%" stopColor="#a78bfa" />
                                        <stop offset="50%" stopColor="#ffffff" />
                                        <stop offset="75%" stopColor="#a78bfa" />
                                        <stop offset="100%" stopColor="#818cf8" />
                                        <animate attributeName="x1" values="0%;100%" dur="4s" repeatCount="indefinite" />
                                        <animate attributeName="y1" values="0%;100%" dur="4s" repeatCount="indefinite" />
                                        <animate attributeName="x2" values="100%;200%" dur="4s" repeatCount="indefinite" />
                                        <animate attributeName="y2" values="100%;200%" dur="4s" repeatCount="indefinite" />
                                      </linearGradient>
                                    </defs>
                                    <rect x="0" y="0" width="100%" height="100%" rx="8" fill="none" stroke="url(#edgeGradient)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.8))' }} />
                                  </svg>

                                  <div className="speech-bubble">여기를 눌러보세요!</div>
                                  <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>{stock.name}</div>
                                    <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '16px' }}>{stock.code}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ background: '#242544', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#818cf8', fontWeight: '600', display: 'inline-block' }}>STOCK</div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div key={i} onClick={() => handleFeatureClick(stock.name)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} 
                                style={{ 
                                  border: '1px solid #2a2c5a', 
                                  borderRadius: '8px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', 
                                  background: 'transparent'
                                }} 
                                onMouseOver={e => e.currentTarget.style.background='#242544'} 
                                onMouseOut={e => e.currentTarget.style.background='transparent'}>
                                  <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>{stock.name}</div>
                                  <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '16px' }}>{stock.code}</div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ background: '#242544', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#818cf8', fontWeight: '600', display: 'inline-block' }}>STOCK</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ fontSize: '12px', color: '#a5a6cc', lineHeight: '1.6' }}>우주 산업 테마주, 안정적인 사업 구조를 가진 금융지주, 꾸준한 배당 수익을 기대할 수 있는 리츠 등 분산 투자를 위한 종목입니다.</div>
                          </div>

                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center', marginTop: '60px', fontSize: '12px', color: '#64748b' }}>
                        마지막 업데이트: 2025년 12월 23일
                      </div>
                    </div>
                  </>
                )}

                {/* ─── STOCK DETAIL VIEW ─── */}
                {currentView === 'stockDetail' && (
                  <>
                    <div style={{ padding: '20px 32px', borderBottom: '1px solid #2a2c5a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentView('report')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <ChevronLeft size={20} color="#a5a6cc" />
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#a5a6cc' }}>돌아가기</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: '600' }}>
                        <span style={{ cursor: 'pointer', color: '#a5a6cc' }} onClick={() => handleFeatureClick('로그아웃')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>로그아웃</span>
                        <span style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', cursor: 'pointer' }} onClick={() => handleFeatureClick('메인 페이지')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>DIDIM</span>
                      </div>
                    </div>

                    <div style={{ padding: '20px 60px 60px', overflowY: 'auto' }}>
                      {/* Title & Price */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                          <div style={{ background: '#3b3d8c', color: '#a5b4fc', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', display: 'inline-block', marginBottom: '8px' }}>KOSPI</div>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>스페이스홀딩스</h1>
                            <span style={{ fontSize: '16px', color: '#a5a6cc', marginBottom: '4px' }}>448290</span>
                            <span style={{ color: '#ef4444', fontSize: '20px', marginLeft: '4px' }}>♥</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '36px', fontWeight: '900', color: '#ef4444' }}>279,500<span style={{ fontSize: '20px', fontWeight: '700' }}>원</span></div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <span>▲</span> 2,500 (0.90%)
                          </div>
                        </div>
                      </div>

                      {/* Chart Mockup */}
                      <div style={{ background: '#242544', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                          {['1주', '1달', '6개월', '1년', '3년', '5년'].map(period => (
                            <div key={period} style={{ fontSize: '13px', fontWeight: '700', color: period === '1년' ? '#fff' : '#a5a6cc', background: period === '1년' ? '#6366f1' : 'transparent', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                              {period}
                            </div>
                          ))}
                        </div>
                        {/* Fake chart SVG line */}
                        <div style={{ height: '240px', width: '100%', position: 'relative', borderBottom: '1px solid #3b3c66' }}>
                          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <polyline points="0,80 10,75 20,85 30,70 40,80 50,60 60,65 70,50 80,55 90,30 100,40" fill="none" stroke="#22c55e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <polygon points="0,100 0,80 10,75 20,85 30,70 40,80 50,60 60,65 70,50 80,55 90,30 100,40 100,100" fill="url(#grad)" opacity="0.2" />
                            <defs>
                              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>

                      {/* Info Section 1 (2 columns) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        {/* 주요 지표 */}
                        <div style={{ background: '#242544', borderRadius: '12px', padding: '24px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>주요 지표</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                              <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '8px' }}>시가</div>
                              <div style={{ fontSize: '18px', fontWeight: '800' }}>280,000원</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '8px' }}>고가</div>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444' }}>280,000원</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '8px' }}>저가</div>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#3b82f6' }}>267,500원</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#a5a6cc', marginBottom: '8px' }}>거래량</div>
                              <div style={{ fontSize: '18px', fontWeight: '800' }}>691,283주</div>
                            </div>
                          </div>
                        </div>

                        {/* 디딤 Comment */}
                        <div style={{ background: '#242544', borderRadius: '12px', padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '16px', fontWeight: '800' }}>디딤 Comment</div>
                            <div style={{ background: '#059669', color: '#fff', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '50px' }}>매수</div>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>스페이스홀딩스, 견조한 실적과 우주 산업 성장 기대감에 매수</div>
                          <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
                            스페이스홀딩스는 4분기에도 견조한 실적을 낼 것으로 예상돼요. 특히 글로벌 민간 우주 시장 성장으로 추가적인 성장도 기대되니, 긍정적으로 봐도 좋을 것 같아요.
                          </div>
                        </div>
                      </div>

                      {/* 디딤 AI 기업 요약 */}
                      <div style={{ border: '1px solid #3b3c66', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Sparkles size={18} color="#818cf8" /> 디딤 AI 기업 요약
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {[
                            "스페이스홀딩스는 우주 탐사 및 위성 통신을 주력으로 하는 기업입니다. 차세대 발사체, 위성 데이터 솔루션 등을 생산 및 판매하여 수익을 창출합니다.",
                            "최근 스페이스홀딩스는 글로벌 위성 통신망 시장 확대와 민간 우주 여객 사업 기대감으로 인해 성장 잠재력이 높아지고 있습니다. 또한, 4분기 실적 전망도 긍정적으로 평가받고 있습니다.",
                            "스페이스홀딩스는 차세대 우주선 기술 개발 및 발사 비용 절감을 통해 우주 시장에서의 경쟁력 강화를 도모하며 지속적인 성장을 확보할 계획입니다."
                          ].map((text, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#3b3c66', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                              <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>{text}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 기업 관련 뉴스 */}
                      <div style={{ border: '1px solid #3b3c66', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Newspaper size={18} color="#a5a6cc" /> 기업 관련 뉴스
                          </div>
                          <div style={{ fontSize: '12px', color: '#a5a6cc', cursor: 'pointer' }}>더보기 &gt;</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {[
                            { title: '[단독] 스페이스홀딩스, 차세대 위성 통신망 전면 상용화 \'초읽기\'', date: 'Thu, 25 Dec 2025 17:34:00 +0900' },
                            { title: '우주 산업, 연말에도 경영 고삐... 내년 글로벌 진출 전략 짜기 분주', date: 'Thu, 25 Dec 2025 17:02:00 +0900' },
                            { title: 'K-우주 내년 설비투자 50% 줄인다...재무 건전성 확보 집중', date: 'Thu, 25 Dec 2025 16:28:00 +0900' }
                          ].map((news, i) => (
                            <div key={i} onClick={() => handleFeatureClick(news.title)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#242544', padding: '16px', borderRadius: '8px', cursor: 'pointer' }}>
                              <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{news.title}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#a5a6cc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%' }}></div> 네이버뉴스</div>
                                <div>{news.date}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 디딤 AI 관련 기업 추천 */}
                      <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Search size={18} color="#a5a6cc" /> 디딤 AI 관련 기업 추천
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                          {[
                            { initial: 'O', name: '오르빗솔루션', code: '373220', desc: '글로벌 우주 발사체 시스템의 선두 주자로, 스페이스홀딩스의 경쟁 관계에 있으며, 시장 동반 성장에 따른...' },
                            { initial: 'S', name: '스카이네트웍스', code: '096770', desc: '위성 통신 부문을 분사하여 전문성을 높이고, 글로벌 우주 시장 경쟁에 참여하고 있으며, 스페이스홀딩스와...' },
                            { initial: 'A', name: '아스트로프로텍', code: '247540', desc: '우주복 및 생명 유지 장치 전문 기업으로, 스페이스홀딩스 등 우주 산업 핵심 소재를 공급하며, 우주 시장...' },
                            { initial: 'G', name: '갤럭시홀딩스', code: '005490', desc: '우주 자원 탐사 사업 투자를 확대하며, 희귀 광물 등 우주 핵심 원자재 확보에 적극적으로 나서고 있어, 우주...' }
                          ].map((rec, i) => (
                            <div key={i} onClick={() => handleFeatureClick(rec.name)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: '#242544', padding: '24px 16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{rec.initial}</div>
                              <div style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>{rec.name}</div>
                              <div style={{ fontSize: '11px', color: '#a5a6cc', marginBottom: '12px' }}>{rec.code}</div>
                              <div style={{ fontSize: '10px', color: '#8a9bb2', lineHeight: '1.5', textAlign: 'left', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rec.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 관련 영상 */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '800' }}>관련 영상</div>
                          <div style={{ background: '#3b3c66', color: '#a5a6cc', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>YouTube</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                          {[
                            { title: '[스페이스홀딩스 주가 전망] 목요일 긴급공시 속보! "이건 상상도 못했다! 내일 대박..."', chan: '성공하는 주식뉴스', date: '2025.12.25' },
                            { title: '[스페이스홀딩스 추가전망] 환율 3년만 대폭락 + 우주산업 급등 내일 어떻게 됩니다!', chan: '조선통신TV', date: '2025.12.25' },
                            { title: '[스페이스홀딩스 추가 전망] 1분전소식! 이렇게 될겁니다!', chan: '투자리딩', date: '2025.12.24' },
                            { title: '스페이스홀딩스, 정확히 지지했습니다 무조건 추가 \'여기\'까지 갑니다', chan: '여의도 주식클럽', date: '2025.12.23' }
                          ].map((vid, i) => (
                            <div key={i} onClick={() => handleFeatureClick(vid.title)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
                              <div style={{ height: '100px', background: '#3b3c66', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PlaySquare size={32} color="#8a9bb2" />
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.4', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vid.title}</div>
                              <div style={{ fontSize: '10px', color: '#a5a6cc' }}>{vid.chan} · {vid.date}</div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => handleFeatureClick('관련 영상 더보기')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ width: '100%', background: '#242544', color: '#a5a6cc', border: '1px solid #3b3c66', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#2a2b4f'} onMouseOut={e => e.currentTarget.style.background='#242544'}>
                          영상 더보기
                        </button>
                      </div>

                    </div>
                  </>
                )}

                {/* Modal Logic (범용 모달 - report와 stockDetail 모두 적용됨) */}
                {modalTarget === 'web' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '12px', background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '24px' }}>
                    <div style={{ background: '#1a1a3a', border: '1px solid #3b3c66', borderRadius: '16px', padding: '32px 24px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#242544', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <Info size={28} color="#818cf8" strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>안내</div>
                      <div style={{ fontSize: '14px', color: '#a5a6cc', lineHeight: '1.6', marginBottom: '24px' }}>
                        실제 서비스 환경에서 안정적으로 구현을 완료한<br />
                        <span style={{ color: '#818cf8', fontWeight: '700' }}>&apos;{clickedFeature}&apos;</span> 기능입니다.<br />
                        <span style={{ display: 'block', marginTop: '10px', fontSize: '13px', color: '#8a9bb2' }}>
                          아키텍처 설계와 성능 최적화를 깊이 있게 고민했던 이 개발 경험을 실무 프로젝트에서 가치 있게 증명해 보이겠습니다.
                        </span>
                      </div>
                      <button onClick={() => setModalTarget(null)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#3b3d8c', color: '#fff', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#2f3170'} onMouseOut={e => e.currentTarget.style.background='#3b3d8c'}>
                        확인
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
