"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Trash2, Pointer, BarChart2, Ruler, Sofa,
  User, Dumbbell, Home, History, Camera, Lightbulb,
  ChevronDown, ChevronUp, Sparkles, Activity
} from 'lucide-react';
import Link from 'next/link';
import './mom.css';

// SSR 오류 방지를 위해 뷰어를 dynamic import로 불러옵니다.
const SpzViewer = dynamic(() => import('./SpzViewer'), {
  ssr: false,
});

export default function MoM_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'mom');

  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');
  const [viewerError, setViewerError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jklas187@naver.com');
    setEmailCopied(true);
    setTimeout(() => {
      setEmailCopied(false);
    }, 2000);
  };

  // 인터페이스 연동용 슬라이더 상태값
  const [zoomValue, setZoomValue] = useState(0.5);
  const [rotationDeg, setRotationDeg] = useState(0);

  // 아코디언 컴포넌트 상태값
  const [showGraphs, setShowGraphs] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);

  // 시연용 데모 모달 상태값
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [clickedFeature, setClickedFeature] = useState('');

  const handleFeatureClick = (featureName: string) => {
    setClickedFeature(featureName);
    setDemoModalOpen(true);
  };

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

  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>

      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="logo-nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span className="logo-k">K</span><span className="logo-dot">.</span><span className="logo-hyun">HYUN</span>
          </Link>
          <div className="nav-social-links">
            <button className="nav-social-btn" onClick={handleCopyEmail} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} aria-label="Copy Email">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Email</span>
            </button>
            <a href="https://github.com/ISEViper" target="_blank" rel="noopener noreferrer" className="nav-social-btn" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
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

      <div className="project-detail-view">
        <div className="detail-header" style={{
          backgroundImage: "url('/projects/mom/MoM_background.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
          <div className="detail-title-area detail-fade-up">
            <button className="btn-back" onClick={() => router.push('/')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              &larr; Back to Archive
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
                {["Flutter", "Dart", "Three.js", "MediaPipe", "ML Kit", "Dio", "FCM"].map((t: string, idx: number) => (
                  <span key={idx} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>

            {/* Service Overview (사이드바 하위 문서 형태로 재조정 및 개괄식 정리) */}
            <div className="info-group" style={{ marginTop: '24px' }}>
              <span className="info-label info-label-blue">Service Overview</span>
              <ul className="sidebar-overview-list">
                <li>3DGS 기반 스마트폰 3D 전신 스캐닝 헬스케어 플랫폼</li>
                <li>온디바이스 AI를 통한 실시간 체형 분석 및 12개 치수 정밀 측정</li>
                <li>스쿼트 상태 머신 결합 실시간 오디오 피드백 및 맞춤 코칭</li>
              </ul>
            </div>

            {/* Key Features (사이드바 하위 문서 형태로 재조정 및 표 형식 정리) */}
            <div className="info-group" style={{ marginTop: '24px' }}>
              <span className="info-label info-label-blue">Key Features</span>
              <table className="sidebar-features-table">
                <tbody>
                  <tr>
                    <td>3D 바디 스캐닝</td>
                    <td>스마트폰 촬영 기반 3DGS 전신 모델 렌더링 및 웹/앱 이식</td>
                  </tr>
                  <tr>
                    <td>신체 치수 분석</td>
                    <td>12개 부위 측정 및 20대 남성 평균 대비 편차 시각화</td>
                  </tr>
                  <tr>
                    <td>맞춤형 운동 추천</td>
                    <td>상/하체 밸런스 불균형 분석 결과 기반 AI 맞춤 추천 운동 코칭</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Frontend Engineering (기술적 기여 및 의사결정) */}
            <div className="mom-detail-section" style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)' }}>
                Frontend Engineering (기술적 기여 및 의사결정)
              </h3>

              <div className="mom-highlights-container" style={{ marginTop: '20px' }}>
                {[
                  {
                    title: '3D 렌더링 파이프라인 최적화 및 아키텍처 경량화',
                    problem: '초기 설계 단계에서 검토했던 SuGaR(표면 재구성) 모델의 연산 오버헤드와 모바일 환경에서의 메쉬 변환 병목으로 인한 로딩 지연',
                    solution: <>초기 설계 단계에서 검토했던 SuGaR(표면 재구성) 모델을 과감히 덜어내고, 3D Gaussian Splatting(3DGS) 렌더링에만 집중하도록 파이프라인을 재설계했습니다. 이를 통해 불필요한 메쉬 변환 병목 현상을 제거하고, 모바일 및 웹 환경에서의 데이터 처리 속도와 렌더링 효율을 극대화했습니다.</>
                  },
                  {
                    title: '크로스 플랫폼(Flutter ↔ WebGL) 브릿지 설계',
                    problem: 'Flutter 네이티브 앱과 Three.js 웹 뷰어 간 실시간 상태 동기화 단절 및 모바일 브라우저 전송 중 gzip 압축 에러',
                    solution: <>Flutter 네이티브 앱과 React 기반의 Three.js 뷰어 간 실시간 양방향 데이터 동기화를 구축했습니다. 원본 3D 스캔 데이터(.ply)의 압축 헤더를 프론트엔드에서 자동으로 식별 및 파싱하여, 환경 제약 없이 안정적으로 미디어를 렌더링하는 파이프라인을 설계했습니다.</>
                  },
                  {
                    title: '사용자 경험(UX) 중심의 3D 카메라 수학 모델링',
                    problem: '3D 가우시안 스플래팅 모델의 원본 축 비정렬 및 뷰어 궤도 중심점 이탈로 회전 조작 시 오빗 궤도가 흔들리는 현상',
                    solution: <>단순한 라이브러리 연동에 그치지 않고, 삼각함수를 활용해 사용자 체형 데이터의 중심축(명치 높이)을 기준으로 완벽하게 수평 회전하는 커스텀 3D Orbit Controller를 직접 구현했습니다. 복잡한 체형 수치 데이터를 모던한 UI 요소로 시각화하여 정보 전달력을 높였습니다.</>
                  }
                ].map((h, i) => (
                  <div key={i} className="mom-highlight-card">
                    <div className="mom-highlight-header">
                      <span className="mom-highlight-num">0{i + 1}</span>
                      <h4>{h.title}</h4>
                    </div>
                    <div className="mom-highlight-body">
                      <div className="mom-problem">
                        <span className="badge">Problem</span>
                        <p>{h.problem}</p>
                      </div>
                      <div className="mom-solution">
                        <span className="badge">Solution</span>
                        <p>{h.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-main detail-fade-up">
            {/* Interactive Preview */}
            <div
              className="detail-preview"
              onMouseEnter={() => {
                if (cursorRef.current) cursorRef.current.style.display = 'none';
                document.body.style.cursor = 'auto';
              }}
              onMouseLeave={() => {
                if (cursorRef.current) cursorRef.current.style.display = 'block';
                document.body.style.cursor = 'none';
              }}
              style={{ marginTop: '0px' }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)' }}>
                Interactive Preview
              </h3>

              <div className="mom-container" style={{ padding: '20px 0', minHeight: 'auto', backgroundColor: 'transparent' }}>
                <div className="mom-mobile-app">
                  <div className="mom-notch"></div>

                  <div className="mom-header">
                    <ArrowLeft className="icon" size={24} onClick={() => handleFeatureClick('히스토리 뒤로가기')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                    <div>히스토리</div>
                    <Trash2 className="icon" size={24} color="#333" onClick={() => handleFeatureClick('히스토리 기록 삭제')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                  </div>

                  <div className="mom-content">
                    <div className="mom-section-title" style={{ padding: '0 20px', marginTop: '10px' }}>
                      24.08.22
                    </div>

                    <div className="mom-viewer-wrapper">
                      <div className="mom-viewer-container" style={{ position: 'relative', overflow: 'hidden' }}>
                        <SpzViewer
                          url="/projects/mom/MoM_sample.ply"
                          zoomValue={zoomValue}
                          rotationDeg={rotationDeg}
                          onLoad={() => setIsLoading(false)}
                          onError={(err: any) => {
                            console.error(err);
                            setViewerError(true);
                            setIsLoading(false);
                          }}
                          height={380}
                        />
                        <div className="mom-viewer-overlay" style={{ pointerEvents: 'none' }}>
                          <Pointer size={14} /> 줌
                        </div>
                        {isLoading && !viewerError && (
                          <div className="mom-viewer-status">로딩 중...</div>
                        )}
                        {viewerError && (
                          <div className="mom-viewer-status">
                            모델 로딩 실패<br />
                            <span style={{ fontSize: '11px', color: '#aaa' }}>콘솔 에러를 확인해주세요.</span>
                          </div>
                        )}
                      </div>

                      <div className="mom-zoom-slider">
                        <button
                          className="mom-round-chip"
                          onClick={() => setZoomValue(v => Math.min(1, +(v + 0.1).toFixed(1)))}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <div className="mom-zoom-track">
                          <div className="mom-zoom-thumb-wrap">
                            <input
                              type="range"
                              className="mom-vertical-range"
                              min={0} max={1} step={0.01}
                              value={zoomValue}
                              onChange={e => setZoomValue(+e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          className="mom-round-chip"
                          onClick={() => setZoomValue(v => Math.max(0, +(v - 0.1).toFixed(1)))}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mom-rotation-slider">
                        <span className="mom-rot-label">0&deg;</span>
                        <input
                          type="range"
                          className="mom-horizontal-range"
                          min={0} max={360} step={1}
                          value={rotationDeg}
                          onChange={e => setRotationDeg(+e.target.value)}
                        />
                        <span className="mom-rot-label">360&deg;</span>
                      </div>
                    </div>

                    <div className="mom-section-padding">
                      <div className="mom-section-title">
                        <span style={{ color: '#3b4ab3', fontSize: '18px', marginRight: '5px' }}>&rarr;&larr;</span>
                        내 체형 vs 20대 평균
                      </div>
                      <div className="mom-section-subtitle">
                        이 측정값을 대한민국 20대 남성 평균 체형과 비교했어요.
                      </div>

                      <div className="mom-card">
                        <div className="mom-avatar-comparison">
                          <div className="mom-avatar-box">
                            <div className="mom-avatar blue">
                              <div className="head"></div>
                              <div className="body"></div>
                              <div className="arm-l"></div>
                              <div className="arm-r"></div>
                              <div className="leg-l"></div>
                              <div className="leg-r"></div>
                            </div>
                            <div className="mom-tag blue">내 체형</div>
                          </div>
                          <div className="mom-avatar-box">
                            <div className="mom-avatar grey">
                              <div className="head"></div>
                              <div className="body"></div>
                              <div className="arm-l"></div>
                              <div className="arm-r"></div>
                              <div className="leg-l"></div>
                              <div className="leg-r"></div>
                            </div>
                            <div className="mom-tag grey">20대 평균</div>
                          </div>
                        </div>
                        <div className="mom-card-desc">
                          측정한 둘레·너비를 반영한 체형 윤곽이에요. 아래에서 부위별 수치를 견줘 보세요.
                        </div>
                        <div className="mom-btn-expand" onClick={() => setShowGraphs(!showGraphs)}>
                          <BarChart2 size={16} />
                          부위별 수치 비교 보기
                          {showGraphs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {showGraphs && (
                        <div className="mom-card" style={{ padding: '20px' }}>
                          {[
                            { name: '가슴 둘레', mine: 95.2, avg: 98.0, mineVal: '95.2cm', avgVal: '98.0cm', badge: 'green', label: '평균 수준' },
                            { name: '허리 둘레', mine: 88.3, avg: 82.0, mineVal: '88.3cm', avgVal: '82.0cm', badge: 'purple', label: '평균보다 +6.3cm' },
                            { name: '엉덩이 둘레', mine: 96.6, avg: 97.0, mineVal: '96.6cm', avgVal: '97.0cm', badge: 'green', label: '평균 수준' },
                            { name: '허벅지 둘레', mine: 47.5, avg: 56.0, mineVal: '47.5cm', avgVal: '56.0cm', badge: 'red', label: '평균보다 -8.5cm' },
                            { name: '종아리 둘레', mine: 35.8, avg: 37.5, mineVal: '35.8cm', avgVal: '37.5cm', badge: 'green', label: '평균 수준' },
                            { name: '팔(이두) 둘레', mine: 28.4, avg: 30.5, mineVal: '28.4cm', avgVal: '30.5cm', badge: 'grey', label: '평균보다 -2.1cm' },
                            { name: '어깨 너비', mine: 34.6, avg: 40.5, mineVal: '34.6cm', avgVal: '40.5cm', badge: 'grey', label: '평균보다 -5.9cm' },
                          ].map((item, i) => (
                            <div key={i} className="mom-stat-row">
                              <div className="mom-stat-header">
                                <div className="mom-stat-name"><Ruler size={16} color="#888" /> {item.name}</div>
                                <div className={`mom-stat-badge ${item.badge}`}>{item.label}</div>
                              </div>
                              <div className="mom-bar-wrap">
                                <div className="mom-bar-label">내 측정</div>
                                <div className="mom-bar-track"><div className="mom-bar-fill blue" style={{ width: `${(item.mine / 120) * 100}%` }}></div></div>
                                <div className="mom-bar-value">{item.mineVal}</div>
                              </div>
                              <div className="mom-bar-wrap">
                                <div className="mom-bar-label">평균</div>
                                <div className="mom-bar-track"><div className="mom-bar-fill grey" style={{ width: `${(item.avg / 120) * 100}%` }}></div></div>
                                <div className="mom-bar-value">{item.avgVal}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mom-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div
                          style={{ padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          onClick={() => setShowNumbers(!showNumbers)}
                        >
                          <div>
                            <div className="mom-section-title" style={{ marginBottom: '5px' }}>
                              <Ruler size={16} color="#3b4ab3" /> 전체 신체 치수
                            </div>
                            <div className="mom-section-subtitle" style={{ marginBottom: '0' }}>
                              12개 측정 항목 &middot; 탭하면 펼쳐져요
                            </div>
                          </div>
                          <div style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                            {showNumbers ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                        {showNumbers && (
                          <div style={{ padding: '0 20px', backgroundColor: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                            {[
                              ['키', '170.0 cm'],
                              ['가슴 둘레', '95.2 cm'],
                              ['허리 둘레', '88.3 cm'],
                              ['엉덩이 둘레', '96.6 cm'],
                              ['왼쪽 허벅지 둘레', '47.5 cm'],
                              ['왼쪽 종아리 둘레', '35.8 cm'],
                              ['오른팔(이두) 둘레', '28.4 cm'],
                              ['어깨 너비', '34.6 cm'],
                              ['왼팔 길이', '49.8 cm'],
                              ['오른팔 길이', '49.9 cm'],
                              ['왼다리 길이', '75.4 cm'],
                              ['오른다리 길이', '75.4 cm'],
                            ].map(([label, val], i) => (
                              <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '14px 0',
                                borderBottom: i === 11 ? 'none' : '1px solid #eaeaea'
                              }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>{label}</span>
                                <span style={{ color: '#111', fontSize: '14px', fontWeight: '600' }}>{val}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                          <Sparkles size={18} color="#3b4ab3" strokeWidth={2.5} />
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>AI 코멘트</span>
                        </div>

                        <div className="mom-ai-container" style={{
                          backgroundColor: '#eff2fc',
                          borderRadius: '24px',
                          padding: '20px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <div style={{
                              backgroundColor: '#3b4ab3',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Sparkles size={16} color="#fff" />
                            </div>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#3b4ab3' }}>AI 체형 분석</span>
                          </div>

                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px', marginTop: '6px' }}>
                            하체 근력 보강과 허리 관리가 우선이에요.
                          </div>

                          <div className="mom-ai-subcard" style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} color="#555" />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111' }}>상체</span>
                                <span style={{ fontSize: '11px', color: '#888' }}>어깨 · 가슴 · 팔</span>
                              </div>
                              <span style={{ backgroundColor: '#eff0fb', color: '#5c6cdd', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                                평균
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px', lineHeight: '1.4' }}>
                              가슴 볼륨은 평균 수준이나, 어깨와 팔의 전반적인 근력 보강이 필요해요.
                            </div>

                            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>가슴둘레</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>95.2 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 96.0 cm</span>
                                  <span style={{ backgroundColor: '#eff0fb', color: '#5c6cdd', fontSize: '9px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', flexShrink: 0 }}>평균</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>어깨너비</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>34.6 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 39.5 cm</span>
                                  <span style={{ backgroundColor: '#ffe5e5', color: '#d32f2f', fontSize: '9px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', flexShrink: 0 }}>보강 필요</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>위팔둘레</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>28.4 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 31.2 cm</span>
                                  <span style={{ backgroundColor: '#eff0fb', color: '#5c6cdd', fontSize: '9px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', flexShrink: 0 }}>평균</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#3b4ab3', lineHeight: '1.4' }}>
                              <Lightbulb size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span>가슴·등 중심의 기본 푸시/풀을 곁들이면 상체 라인이 좋아져요.</span>
                            </div>
                          </div>

                          <div className="mom-ai-subcard" style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Activity size={16} color="#555" />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111' }}>코어</span>
                                <span style={{ fontSize: '11px', color: '#888' }}>복부 · 허리</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px', lineHeight: '1.4' }}>
                              허리 둘레가 평균보다 여유가 있어 코어 안정화와 생활습관 관리가 도움돼요.
                            </div>

                            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>허리둘레</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>88.3 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 78.8 cm</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#3b4ab3', lineHeight: '1.4' }}>
                              <Lightbulb size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span>식사 규칙화와 함께 코어 고정 동작을 꾸준히 해보세요.</span>
                            </div>
                          </div>

                          <div className="mom-ai-subcard" style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '16px',
                            marginBottom: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} color="#555" />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111' }}>하체</span>
                                <span style={{ fontSize: '11px', color: '#888' }}>엉덩이 · 허벅지 · 종아리</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '13px', color: '#555', marginBottom: '12px', lineHeight: '1.4' }}>
                              엉덩이 대비 허벅지·종아리 볼륨이 작아, 하체 근력과 근육량을 키우는 쪽이 좋아요.
                            </div>

                            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>엉덩이둘레</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>96.6 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 94.7 cm</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>허벅지둘레</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>47.5 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 56.7 cm</span>
                                  <span style={{ backgroundColor: '#ffe5e5', color: '#d32f2f', fontSize: '9px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', flexShrink: 0 }}>보강 필요</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <span style={{ fontWeight: '600', color: '#444', flexShrink: 0 }}>종아리둘레</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span style={{ fontWeight: 'bold', color: '#3b4ab3', whiteSpace: 'nowrap', flexShrink: 0 }}>35.8 cm</span>
                                  <span style={{ color: '#888', fontSize: '10px', whiteSpace: 'nowrap' }}>평균 37.5 cm</span>
                                  <span style={{ backgroundColor: '#ffe5e5', color: '#d32f2f', fontSize: '9px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', flexShrink: 0 }}>보강 필요</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#3b4ab3', lineHeight: '1.4' }}>
                              <Lightbulb size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span>백스쿼트를 중심으로 하체 전면·후면을 함께 키워보세요.</span>
                            </div>
                          </div>

                          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', cursor: 'pointer', marginTop: '16px' }}
                               onClick={() => handleFeatureClick('추천 운동법 가이드')}
                               onMouseEnter={handleMouseEnter}
                               onMouseLeave={handleMouseLeave}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ backgroundColor: '#f0f4ff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                                <Dumbbell size={20} color="#3b4ab3" />
                              </div>
                              <div>
                                <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>오늘의 추천 운동</div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111' }}>백스쿼트</div>
                              </div>
                            </div>
                            <ChevronDown size={18} color="#ccc" style={{ transform: 'rotate(-90deg)' }} />
                          </div>

                        </div>

                        <div style={{ fontSize: '11px', color: '#888', textAlign: 'center', marginTop: '16px' }}>
                          AI가 분석한 체형 비교 피드백이에요.
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mom-fab" onClick={() => handleFeatureClick('신체 치수 측정 촬영')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
                    <Camera size={26} color="#fff" strokeWidth={1.5} />
                  </div>

                  <div className="mom-bottom-nav">
                    <div className="mom-nav-item" onClick={() => handleFeatureClick('홈 화면')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
                      <Home className="mom-nav-icon" size={22} strokeWidth={1.5} />홈
                    </div>
                    <div className="mom-nav-item active">
                      <History className="mom-nav-icon" size={22} strokeWidth={2.5} />히스토리
                    </div>

                    <div className="mom-nav-item spacer" style={{ visibility: 'hidden' }}></div>

                    <div className="mom-nav-item" onClick={() => handleFeatureClick('운동 분석')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
                      <Dumbbell className="mom-nav-icon" size={22} strokeWidth={1.5} />운동 분석
                    </div>
                    <div className="mom-nav-item" onClick={() => handleFeatureClick('마이페이지')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
                      <User className="mom-nav-icon" size={22} strokeWidth={1.5} />MY
                    </div>
                  </div>

                  {demoModalOpen && (
                    <div className="mom-modal-overlay">
                      <div className="mom-modal-card">
                        <div className="mom-modal-icon-wrap">
                          <Sparkles size={22} color="#3b4ab3" strokeWidth={2.5} />
                        </div>
                        <div className="mom-modal-title">안내</div>
                        <div className="mom-modal-message">
                          실제 서비스 환경에서 안정적으로 구현을 완료한
                          <br />
                          <span className="mom-modal-feature-highlight">&apos;{clickedFeature}&apos;</span> 기능입니다.
                          <br />
                          <span style={{ display: 'block', marginTop: '10px' }}>
                            아키텍처 설계와 성능 최적화를 깊이 있게 고민했던 이 개발 경험을 실무 프로젝트에서 가치 있게 증명해 보이겠습니다.
                          </span>
                        </div>
                        <button 
                          className="mom-modal-btn" 
                          onClick={() => setDemoModalOpen(false)}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
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

      {emailCopied && (
        <div className="toast-notification">
          <span>이메일 주소가 복사되었습니다!</span>
        </div>
      )}
    </div>
  );
}