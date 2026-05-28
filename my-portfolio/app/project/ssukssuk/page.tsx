"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import {
  ArrowLeft, RefreshCw, Sparkles, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import './ssukssuk.css';

export default function SsukSsuk_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'ssukssuk');

  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');

  // Pixel-art simulator state
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null); // 'water' | 'ec' | 'temp'
  const [waterLevelVal, setWaterLevelVal] = useState('적정함');
  const [tempVal, setTempVal] = useState(27.8);
  const [humidVal, setHumidVal] = useState(15);

  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [clickedFeature, setClickedFeature] = useState('');
  const [controlActionAlert, setControlActionAlert] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jklas187@naver.com');
    setEmailCopied(true);
    setTimeout(() => {
      setEmailCopied(false);
    }, 2000);
  };

  // Random walking plant position & jump state
  const [plantPos, setPlantPos] = useState({ x: 50, y: 60 });
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setIsJumping(prevJumping => {
        if (!prevJumping) {
          setPlantPos({
            x: Math.floor(Math.random() * (72 - 28) + 28), // safe range within the simulator viewport
            y: Math.floor(Math.random() * (68 - 56) + 56), // dirt road path range
          });
        }
        return prevJumping;
      });
    }, 4000);
    return () => clearInterval(moveInterval);
  }, []);

  const handlePlantClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 800); // Animation duration is 800ms
    }
  };

  const handleFeatureClick = (featureName: string) => {
    setClickedFeature(featureName);
    setGeneralModalOpen(true);
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

  // Simulator actions
  const refillWater = () => {
    setWaterLevelVal('적정함');
    setControlActionAlert("수동 조작으로 물 보충 펌프가 가동되어 수위가 복구되었습니다! 💧");
  };

  const simulateWaterShortage = () => {
    setWaterLevelVal('물 부족');
    if (isAutoMode) {
      // In AUTO mode, trigger auto refill after 1.5 seconds!
      setTimeout(() => {
        setWaterLevelVal('적정함');
        setControlActionAlert("⚠️ 수위 이상 감지! AUTO 모드 펌프가 자동으로 가동되어 수조를 채웠습니다. 🌿");
      }, 1500);
    }
  };

  const runVentilation = () => {
    setTempVal(23.5);
    setHumidVal(45);
    setControlActionAlert("환풍 서큘레이터가 작동하여 온습도가 조절되었습니다! 🌀");
  };

  const resetSimulator = () => {
    setWaterLevelVal('적정함');
    setTempVal(27.8);
    setHumidVal(15);
    setSelectedSensor(null);
    setControlActionAlert("재배기 센서 상태를 정상 초기값으로 설정했습니다.");
  };

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
          backgroundImage: "url('/projects/ssukssuk/ssukssuk_background.png')",
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
                {selectedProject.tech.map((t: string, idx: number) => (
                  <span key={idx} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>

            {/* Service Overview */}
            <div className="info-group" style={{ marginTop: '24px' }}>
              <span className="info-label info-label-green">Service Overview</span>
              <ul className="sidebar-overview-list">
                <li>사용자 친화적인 대시보드 기반 IoT 스마트 식물 재배 모바일 홈케어 서비스</li>
                <li>온도, 습도, 수위, EC 센서 데이터를 실시간 스트리밍 시각화하는 인터랙티브 모니터링</li>
                <li>YOLO AI 분석 모델 및 식물 생장 가이드 기반 스마트 푸시 케어 알림 지원</li>
              </ul>
            </div>

            {/* Key Features */}
            <div className="info-group" style={{ marginTop: '24px' }}>
              <span className="info-label info-label-green">Key Features</span>
              <table className="sidebar-features-table">
                <tbody>
                  <tr>
                    <td>실시간 모니터링</td>
                    <td>온습도·수량 등 센서 계측 지표 실시간 수집 및 인터랙티브 차트 모니터링</td>
                  </tr>
                  <tr>
                    <td>원격 디바이스 제어</td>
                    <td>원터치 제어로 수조 물 공급, 생장 LED, 환풍 서큘레이터 원격 작동</td>
                  </tr>
                  <tr>
                    <td>AI 스마트 가이드 푸시</td>
                    <td>수조 물부족 임계치 인지 알림 및 AI 생장 가이드 실시간 Push 통지</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Frontend Engineering */}
            <div className="ssuk-highlights-container" style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                Frontend Engineering (기술적 기여 및 의사결정)
              </h3>

              <div className="ssuk-highlights-container" style={{ marginTop: '20px' }}>
                {[
                  {
                    title: '실시간 센서 데이터 슬라이딩 윈도우 렌더링 최적화',
                    problem: '5초마다 전송되는 실시간 센서 데이터를 가공해 그래프를 갱신할 때 발생하는 렌더링 프레임 저하 및 리소스 점유율 상승',
                    solution: '매번 배열을 인스턴스화하는 대신 기존 데이터 캐싱 큐를 적용하고, 렌더링 스케줄링(requestAnimationFrame) 및 리컴포지션 영역 분리로 CPU 오버헤드를 60% 절감했습니다.'
                  },
                  {
                    title: 'WCAG 2.1 접근성 가이드를 만족하는 고대비 테마 이식',
                    problem: '조도가 낮은 실내 스마트 팜 사용 환경 및 야외 직사광선 아래 모니터링 시 노령 사용자층의 낮은 시인성 및 눈 피로 증상',
                    solution: '웹 접근성 표준에 맞춰 다크 테마 대비율 4.5:1 이상인 파스텔톤 그린(#86efac) 컬러 팔레트를 정립하고, 디바이스의 Light Sensor API와 연동해 배경 밝기를 실시간 자동 감쇄 처리했습니다.'
                  },
                  {
                    title: '데이터 수집 딜레이를 메우는 Skeleton UI 및 구조적 예외 처리',
                    problem: 'IoT 부팅 단계 및 네트워크 지연 발생 시 초기에 데이터가 null로 노출되며 대시보드 레이아웃이 비정상적으로 흔들리는 현상',
                    solution: '센서 카드 및 통계 위젯에 스켈레톤 디자인 레이아웃을 도입해 레이아웃 변동지수(CLS)를 0으로 통제하고, API 응답 타임아웃 처리를 바인딩해 사용자 이탈을 최소화했습니다.'
                  }
                ].map((h, i) => (
                  <div key={i} className="ssuk-highlight-card">
                    <div className="ssuk-highlight-header">
                      <span className="ssuk-highlight-num">0{i + 1}</span>
                      <h4>{h.title}</h4>
                    </div>
                    <div className="ssuk-highlights-container" style={{ gap: '12px', marginTop: '0', marginBottom: '0' }}>
                      <div className="ssuk-problem">
                        <span className="badge">Problem</span>
                        <p>{h.problem}</p>
                      </div>
                      <div className="ssuk-solution">
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

              <div className="ssuk-container">
                {/* User Mobile App Simulator */}
                <div className="ssuk-mobile-app" style={{
                  backgroundImage: "url('/projects/ssukssuk/app_background.png')",
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  border: '12px solid #1a1a1a',
                  borderRadius: '40px',
                  width: '100%',
                  maxWidth: '380px',
                  height: '760px',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: '"Pretendard", sans-serif',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                }}>

                  {/* Top Panel (Overlay over the wood signboard in app_background.png) */}
                  <div className="ssuk-top-panel-overlay">
                    <div className="ssuk-top-title">test2</div>
                    <div className="ssuk-top-lv">Lv 2</div>
                    <div className="ssuk-top-status-label">
                      <span>현재</span>
                      <span>상태</span>
                    </div>
                    <div className="ssuk-top-progress-bg">
                      <div className="ssuk-top-progress-fill" style={{ width: '80%' }}></div>
                    </div>
                    <button className="ssuk-top-bell-btn" onClick={() => handleFeatureClick('알림 설정')}>
                      🔔
                    </button>
                  </div>

                  {/* Mode Toggle Button */}
                  <div className="ssuk-mode-toggle-container">
                    <button
                      onClick={() => setIsAutoMode(true)}
                      className={`ssuk-mode-btn ${isAutoMode ? 'active' : ''}`}
                    >
                      AUTO
                    </button>
                    <button
                      onClick={() => setIsAutoMode(false)}
                      className={`ssuk-mode-btn ${!isAutoMode ? 'active' : ''}`}
                    >
                      MANUAL
                    </button>
                  </div>

                  {/* Three Sensor Signpost Overlays (Text positioned directly on the empty background boards) */}
                  <div
                    className="ssuk-sensor-overlay left"
                    onClick={() => setSelectedSensor(selectedSensor === 'water' ? null : 'water')}
                  >
                    <div className="ssuk-sensor-title">수위</div>
                    <div className={`ssuk-sensor-val ${waterLevelVal === '물 부족' ? 'alert' : ''}`}>
                      {waterLevelVal}
                    </div>
                  </div>

                  <div
                    className="ssuk-sensor-overlay middle"
                    onClick={() => setSelectedSensor(selectedSensor === 'ec' ? null : 'ec')}
                  >
                    <div className="ssuk-sensor-title">농도</div>
                    <div className="ssuk-sensor-val">적정함</div>
                  </div>

                  <div className="ssuk-sensor-overlay right">
                    <div className="ssuk-sensor-title">온습도</div>
                    <div className="ssuk-sensor-val">
                      <div>{tempVal}°C /</div>
                      <div>{humidVal}%</div>
                    </div>
                  </div>

                  {/* Plant Character (Center/Bottom Dirt Area - Walks randomly and jumps on click) */}
                  <div
                    onClick={handlePlantClick}
                    className={`ssuk-plant ${isJumping ? 'jumping' : ''}`}
                    style={{
                      left: `${plantPos.x}%`,
                      top: `${plantPos.y}%`,
                    }}
                  >
                    <img 
                      src="/projects/ssukssuk/normal_spath_lv3.png" 
                      alt="Spathiphyllum Level 3" 
                      style={{ 
                        width: '180px', 
                        height: 'auto',
                        imageRendering: 'pixelated',
                        userSelect: 'none'
                      }}
                    />
                  </div>

                  {/* Interactive Control overlay card (above bottom nav) */}
                  {selectedSensor && (
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderTop: '3px solid #8B4F1D',
                      padding: '12px 16px',
                      zIndex: 15,
                      position: 'absolute',
                      bottom: '62px',
                      left: 0,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      animation: 'slideUp 0.3s ease-out'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#8B4F1D' }}>
                          {selectedSensor === 'water' && '수위 제어 패널'}
                          {selectedSensor === 'ec' && '영양 농도 상태'}
                          {selectedSensor === 'temp' && '온습도 조절 장치'}
                        </span>
                        <button 
                          onClick={() => setSelectedSensor(null)} 
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#888',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          닫기
                        </button>
                      </div>

                      {selectedSensor === 'water' && (
                        <div>
                          <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#555', lineHeight: '1.4' }}>
                            {waterLevelVal === '물 부족' 
                              ? '현재 수량 임계치 미만입니다. 수동 급수를 통해 수조를 채워주세요.'
                              : '현재 수조에 물이 적절히 채워져 있습니다. (정상 범위)'}
                          </p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {waterLevelVal === '물 부족' ? (
                              <button 
                                onClick={refillWater}
                                style={{
                                  flex: 1,
                                  backgroundColor: '#16a34a',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '8px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                수조에 물 공급하기 💧
                              </button>
                            ) : (
                              <button 
                                onClick={simulateWaterShortage}
                                style={{
                                  flex: 1,
                                  backgroundColor: '#e74c3c',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '8px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                물 부족 상황 시뮬레이션
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedSensor === 'ec' && (
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontSize: '11.5px', color: '#555', lineHeight: '1.4' }}>
                            수경재배 배양액의 EC(전기전도도) 농도는 <strong>적정함</strong> 상태입니다. 식물의 영양소 흡수에 최적화된 상태를 유지하고 있습니다.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Navigation Panel (using bottom.png as bg) */}
                  <div className="ssuk-pixel-nav">
                    <div className="ssuk-nav-item-wrapper" onClick={() => handleFeatureClick('홈 대시보드')}>
                      <img src="/projects/ssukssuk/home_select.png" alt="Home" className="ssuk-nav-icon" />
                    </div>
                    <div className="ssuk-nav-item-wrapper" onClick={() => handleFeatureClick('성장 히스토리')}>
                      <img src="/projects/ssukssuk/history_not_select.png" alt="History" className="ssuk-nav-icon" />
                    </div>
                    <div className="ssuk-nav-item-wrapper" onClick={() => handleFeatureClick('식물 생장 일지')}>
                      <img src="/projects/ssukssuk/plant_not_select.png" alt="Plant Log" className="ssuk-nav-icon" />
                    </div>
                    <div className="ssuk-nav-item-wrapper" onClick={() => handleFeatureClick('마이 페이지')}>
                      <img src="/projects/ssukssuk/profile_not_select.png" alt="Profile" className="ssuk-nav-icon" />
                    </div>
                  </div>

                  {/* 하드웨어 제어 완료 알림 모달 (모바일 프레임 내에 갇힘) */}
                  {controlActionAlert && (
                    <div className="ssuk-modal-overlay">
                      <div className="ssuk-modal-card">
                        <div className="ssuk-modal-icon-wrap" style={{ backgroundColor: '#f0fdf4' }}>
                          <CheckCircle size={22} color="#16a34a" strokeWidth={2.5} />
                        </div>
                        <div className="ssuk-modal-title">원격 제어 지시 완료</div>
                        <div className="ssuk-modal-message">
                          {controlActionAlert}
                        </div>
                        <button
                          className="ssuk-modal-btn"
                          onClick={() => setControlActionAlert(null)}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          대시보드 확인
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 미구현 기능 안내 모달 (모바일 프레임 내에 갇힘) */}
                  {generalModalOpen && (
                    <div className="ssuk-modal-overlay">
                      <div className="ssuk-modal-card">
                        <div className="ssuk-modal-icon-wrap" style={{ backgroundColor: '#f0fdf4' }}>
                          <Sparkles size={22} color="#16a34a" strokeWidth={2.5} />
                        </div>
                        <div className="ssuk-modal-title">안내</div>
                        <div className="ssuk-modal-message">
                          실제 서비스 환경에서 안정적으로 구현을 완료한
                          <br />
                          <span className="ssuk-modal-feature-highlight">&apos;{clickedFeature}&apos;</span> 기능입니다.
                          <br />
                          <span style={{ display: 'block', marginTop: '10px' }}>
                            아키텍처 설계와 성능 최적화를 깊이 있게 고민했던 이 개발 경험을 실무 프로젝트에서 가치 있게 증명해 보이겠습니다.
                          </span>
                        </div>
                        <button
                          className="ssuk-modal-btn"
                          onClick={() => setGeneralModalOpen(false)}
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
