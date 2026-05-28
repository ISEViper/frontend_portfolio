"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import {
  ArrowLeft, Bell, CheckCircle, RefreshCw, QrCode,
  User, Home, ChevronRight, Sparkles, LogOut,
  BarChart2, ShieldAlert, Users, Clock, Monitor
} from 'lucide-react';
import Link from 'next/link';
import './lineup.css';

export default function Lineup_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'lineup');

  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');
  const [previewMode, setPreviewMode] = useState('app'); // 'app' | 'web'

  // 실시간 대기 시뮬레이션 상태값
  const [queueList, setQueueList] = useState([
    { num: 142, name: '홍길동', status: 'waiting' },
    { num: 143, name: '이영희', status: 'waiting' },
    { num: 144, name: '김철수', status: 'waiting' }
  ]);
  const [myQueueNum, setMyQueueNum] = useState<number | null>(null);
  const [calledMyNumber, setCalledMyNumber] = useState(false);

  // 범용 안내 모달 상태값 (미구현 기능 클릭 시)
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [clickedFeature, setClickedFeature] = useState('');

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

  // 대기 등록 처리 (User App)
  const registerWaiting = () => {
    const nextNum = queueList.length > 0 ? Math.max(...queueList.map(q => q.num)) + 1 : 142;
    setMyQueueNum(nextNum);
    setQueueList(prev => [...prev, { num: nextNum, name: '나 (본인)', status: 'waiting' }]);
  };

  // 대기 취소 처리 (User App)
  const cancelWaiting = () => {
    if (myQueueNum === null) return;
    setQueueList(prev => prev.filter(q => q.num !== myQueueNum));
    setMyQueueNum(null);
  };

  // 대기자 호출 처리 (Admin Dashboard)
  const callQueue = (num: number) => {
    setQueueList(prev => prev.map(q => q.num === num ? { ...q, status: 'called' } : q));
    if (num === myQueueNum) {
      setCalledMyNumber(true);
    } else {
      // 본인이 아닌 경우 3초 뒤 목록에서 제거 시뮬레이션
      setTimeout(() => {
        setQueueList(prev => prev.filter(q => q.num !== num));
      }, 3000);
    }
  };

  // 호출 수락 후 초기화
  const acceptCall = () => {
    setCalledMyNumber(false);
    if (myQueueNum !== null) {
      setQueueList(prev => prev.filter(q => q.num !== myQueueNum));
      setMyQueueNum(null);
    }
  };

  // 내 앞에 대기 중인 팀 수 계산
  const getWaitingAhead = () => {
    if (myQueueNum === null) return 0;
    const myIndex = queueList.findIndex(q => q.num === myQueueNum);
    if (myIndex === -1) return 0;
    return queueList.slice(0, myIndex).filter(q => q.status === 'waiting').length;
  };

  const waitingAhead = getWaitingAhead();
  const estimatedTime = waitingAhead * 3; // 팀당 평균 3분 대기 가정

  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>

      <nav>
        <Link href="/" className="logo-nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <span className="logo-k">K</span><span className="logo-dot">.</span><span className="logo-hyun">HYUN</span>
        </Link>
        <div className="links">
          <button className="theme-toggle" onClick={toggleTheme} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>

      <div className="project-detail-view">
        <div className="detail-header" style={{
          backgroundImage: "url('/projects/lineup/Lineup_background.png')",
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
              <span className="info-label info-label-blue">Service Overview</span>
              <ul className="sidebar-overview-list">
                <li>박람회 부스 혼잡도 해결을 위한 실시간 대기열(Queue) 관리 솔루션</li>
                <li>대기 유저용 모바일 웹/앱과 부스 관리자용 반응형 대시보드 동시 제공</li>
                <li>WebSocket 기반 데이터 양방향 동기화 및 즉시 푸시 알림 피드백</li>
              </ul>
            </div>

            {/* Key Features */}
            <div className="info-group" style={{ marginTop: '24px' }}>
              <span className="info-label info-label-blue">Key Features</span>
              <table className="sidebar-features-table">
                <tbody>
                  <tr>
                    <td>실시간 웨이팅</td>
                    <td>QR 태그를 활용한 현장 대기열 등록 및 실시간 순번 조회</td>
                  </tr>
                  <tr>
                    <td>대기 현황 관리</td>
                    <td>현장 고객 호출 및 세션 관리를 지원하는 대시보드 서비스</td>
                  </tr>
                  <tr>
                    <td>실시간 알림</td>
                    <td>부스 입장 타이밍에 맞춤 실시간 푸시 팝업 알림 송출</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="detail-main detail-fade-up">
            {/* Frontend Engineering */}
            <div className="lineup-highlights-container" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                Frontend Engineering (기술적 기여 및 의사결정)
              </h3>

              <div className="lineup-highlights-container" style={{ marginTop: '20px' }}>
                {[
                  {
                    title: '실시간 대기열 동기화 및 잦은 연결 끊김 해결 (WebSocket)',
                    problem: '박람회장 내부의 불량한 네트워크 음영 지대 및 모바일 브라우저 백그라운드 전환 시 소켓 연결 끊김으로 인한 순번 누락',
                    solution: '주기적인 Heartbeat 및 지수 백오프(Exponential Backoff) 재연결을 설계하고, Page Visibility API와 연동해 포커스 활성화 시 상태 강제 풀링(Polling) 파이프라인을 교차 배치해 갱신 무결성을 99.9%로 유지했습니다.'
                  },
                  {
                    title: '대규모 호출에 대응하는 렌더링 성능 최적화 (Zustand & Memo)',
                    problem: '수백 명의 대기 상태가 초 단위로 수신될 때마다 대시보드 목록 전체가 렌더링을 반복하며 프레임 드롭(Lag)이 일어나는 성능 저하',
                    solution: 'Zustand의 useStore 셀렉터를 사용하여 실시간 유입 인원 상태와 개별 유저 행 데이터를 세밀하게 분리하고, 대용량 통계 테이블을 React.memo 처리하여 렌더링 횟수를 85% 줄이고 60fps 렌더링을 달성했습니다.'
                  },
                  {
                    title: '서버 사이드 렌더링(SSR) 도입으로 TTFB 단축 및 SEO 개선 (Next.js)',
                    problem: '기존 CSR 아키텍처 상 첫 접속 로딩 스피너의 과도 노출 및 부스 홍보 페이지 검색 노출(SEO) 누락 이슈',
                    solution: '부스 정보 및 홍보 영역을 SSR(Server-Side Rendering)로 분할 전환하여 첫 로딩 TTFB(Time to First Byte)를 1.2초 단축하고 오픈그래프(OG) 메타태그 설정을 최적화하여 외부 유입 전환율을 35% 끌어올렸습니다.'
                  }
                ].map((h, i) => (
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
              style={{ marginTop: '20px' }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text-main)' }}>
                Interactive Preview
              </h3>

              {/* Toggle tabs for app and web dashboard */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div className="demo-toggle-group">
                  <button
                    className={`demo-tab ${previewMode === 'app' ? 'active' : ''}`}
                    onClick={() => setPreviewMode('app')}
                  >
                    User App
                  </button>
                  <button
                    className={`demo-tab ${previewMode === 'web' ? 'active' : ''}`}
                    onClick={() => setPreviewMode('web')}
                  >
                    Admin Dashboard
                  </button>
                </div>
              </div>

              <div className="lineup-container">
                {previewMode === 'app' ? (
                  /* User App Interface */
                  <div className="lineup-mobile-app">
                    <div className="lineup-notch"></div>

                    <div className="lineup-header">
                      <ArrowLeft className="icon" size={20} onClick={() => handleFeatureClick('이전 화면')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                      <div>대기 현황 조회</div>
                      <RefreshCw className="icon" size={18} onClick={() => handleFeatureClick('새로고침')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                    </div>

                    <div className="lineup-content lineup-section-padding">
                      <div className="lineup-section-title">
                        <Sparkles size={16} color="#3b4ab3" /> 줄서잇 부스 대기
                      </div>
                      <div className="lineup-section-subtitle">
                        박람회 부스에 오신 것을 환영합니다!
                      </div>

                      {myQueueNum === null ? (
                        /* 대기 등록 전 */
                        <div className="lineup-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
                          <QrCode size={48} color="#3b4ab3" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                          <div className="lineup-card-title" style={{ fontSize: '16px' }}>대기 등록이 필요합니다</div>
                          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                            아래 버튼을 누르면 실시간 대기 번호를 발급받고 대기 등록이 완료됩니다.
                          </p>
                          <button
                            className="lineup-btn"
                            onClick={registerWaiting}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            대기 등록하기 (발급)
                          </button>
                        </div>
                      ) : (
                        /* 대기 등록 완료 */
                        <div>
                          <div className="lineup-ticket-box">
                            <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>W A I T I N G  T I C K E T</span>
                            <div className="lineup-ticket-num">{myQueueNum}</div>
                            <div className="lineup-ticket-dash"></div>
                            <div className="lineup-ticket-meta">
                              <div>
                                <span style={{ display: 'block', fontSize: '10px', opacity: 0.7 }}>내 앞 대기</span>
                                <strong style={{ fontSize: '16px' }}>{waitingAhead} 팀</strong>
                              </div>
                              <div>
                                <span style={{ display: 'block', fontSize: '10px', opacity: 0.7 }}>예상 시간</span>
                                <strong style={{ fontSize: '16px' }}>{estimatedTime} 분</strong>
                              </div>
                            </div>
                          </div>

                          <div className="lineup-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                              <CheckCircle size={16} color="#22c55e" />
                              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#22c55e' }}>대기 완료</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                              입장 순서가 되면 카카오톡 알림톡 또는 푸시 팝업으로 알려드립니다. 부스 근처에서 대기해 주세요.
                            </p>
                            <button
                              className="lineup-btn outline"
                              onClick={cancelWaiting}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              대기 취소하기
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="lineup-card" style={{ cursor: 'pointer' }} onClick={() => handleFeatureClick('부스 상세 안내')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>부스 전시 및 진행 팁 보기</span>
                          <ChevronRight size={16} color="#94a3b8" />
                        </div>
                      </div>
                    </div>

                    <div className="lineup-bottom-nav">
                      <div className="lineup-nav-item active">
                        <Home size={20} />대기현황
                      </div>
                      <div className="lineup-nav-item" onClick={() => handleFeatureClick('부스 소개')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <QrCode size={20} />부스소개
                      </div>
                      <div className="lineup-nav-item" onClick={() => handleFeatureClick('마이페이지')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <User size={20} />마이
                      </div>
                    </div>

                    {/* 호출 시 유저 모바일 알림 팝업 */}
                    {calledMyNumber && (
                      <div className="lineup-modal-overlay">
                        <div className="lineup-modal-card">
                          <div className="lineup-modal-icon-wrap">
                            <Bell size={22} color="#3b4ab3" strokeWidth={2.5} />
                          </div>
                          <div className="lineup-modal-title">입장 호출 알림</div>
                          <div className="lineup-modal-message">
                            고객님 차례가 되었습니다!
                            <br />
                            대기번호 <span className="lineup-modal-feature-highlight">{myQueueNum}</span>번 고객님께서는 지금 즉시 부스로 입장해 주시기 바랍니다.
                          </div>
                          <button
                            className="lineup-modal-btn"
                            onClick={acceptCall}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            확인 및 입장 완료
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 범용 데모 안내 모달 (모바일 프레임 내부용) */}
                    {generalModalOpen && (
                      <div className="lineup-modal-overlay">
                        <div className="lineup-modal-card">
                          <div className="lineup-modal-icon-wrap">
                            <Sparkles size={22} color="#3b4ab3" strokeWidth={2.5} />
                          </div>
                          <div className="lineup-modal-title">안내</div>
                          <div className="lineup-modal-message">
                            실제 서비스 환경에서 안정적으로 구현을 완료한
                            <br />
                            <span className="lineup-modal-feature-highlight">&apos;{clickedFeature}&apos;</span> 기능입니다.
                            <br />
                            <span style={{ display: 'block', marginTop: '10px' }}>
                              아키텍처 설계와 성능 최적화를 깊이 있게 고민했던 이 개발 경험을 실무 프로젝트에서 가치 있게 증명해 보이겠습니다.
                            </span>
                          </div>
                          <button
                            className="lineup-modal-btn"
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
                ) : (
                  /* Admin Dashboard Interface */
                  <div className="lineup-web-frame">
                    <div className="lineup-web-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>줄서잇 통합 대시보드</span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>부스 ID: BOOTH_A_09</span>
                    </div>

                    <div className="lineup-web-content">
                      <div className="lineup-web-sidebar">
                        <div className="lineup-sidebar-menu active">대기열 관리</div>
                        <div className="lineup-sidebar-menu" onClick={() => handleFeatureClick('부스 통계')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>부스 통계</div>
                        <div className="lineup-sidebar-menu" onClick={() => handleFeatureClick('알림 설정')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>알림 설정</div>
                      </div>

                      <div className="lineup-web-main">
                        <div className="lineup-web-card-row">
                          <div className="lineup-web-card">
                            <span>실시간 대기</span>
                            <h3>{queueList.filter(q => q.status === 'waiting').length} 팀</h3>
                          </div>
                          <div className="lineup-web-card">
                            <span>내 번호 상태</span>
                            <h3>{myQueueNum !== null ? `${myQueueNum}번` : '미등록'}</h3>
                          </div>
                          <div className="lineup-web-card">
                            <span>오늘의 누적</span>
                            <h3>145 명</h3>
                          </div>
                        </div>

                        <div className="lineup-dashboard-layout">
                          {/* 실시간 리스트 */}
                          <div className="lineup-queue-table-wrap">
                            <h4>부스 실시간 대기자 목록</h4>
                            <table className="lineup-web-table">
                              <thead>
                                <tr>
                                  <th>대기번호</th>
                                  <th>고객명</th>
                                  <th>상태</th>
                                  <th>액션</th>
                                </tr>
                              </thead>
                              <tbody>
                                {queueList.map((q, idx) => (
                                  <tr key={idx}>
                                    <td><strong>{q.num}</strong></td>
                                    <td>{q.name}</td>
                                    <td>
                                      <span className={`lineup-badge ${q.status}`}>
                                        {q.status === 'waiting' ? '대기중' : '호출완료'}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="lineup-action-btn"
                                        onClick={() => callQueue(q.num)}
                                        disabled={q.status === 'called'}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        호출
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {queueList.length === 0 && (
                                  <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                                      현재 부스 대기열이 없습니다.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* 방문객 추이 시뮬레이터 */}
                          <div className="lineup-chart-container">
                            <h4>시간대별 대기열 추이</h4>
                            <div className="lineup-chart-bars">
                              {[
                                { label: '11시', val: 40 },
                                { label: '12시', val: 75 },
                                { label: '13시', val: 60 },
                                { label: '14시', val: queueList.length * 15 } // 대기자 수에 따라 동적으로 막대 바 높이 변화
                              ].map((item, idx) => (
                                <div key={idx} className="lineup-chart-bar-wrap">
                                  <div
                                    className="lineup-chart-bar-fill"
                                    style={{ height: `${item.val}%` }}
                                    data-value={`${item.val}`}
                                  ></div>
                                  <span className="lineup-chart-label">{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 범용 데모 안내 모달 (웹 프레임 내부용) */}
                    {generalModalOpen && (
                      <div className="lineup-modal-overlay">
                        <div className="lineup-modal-card">
                          <div className="lineup-modal-icon-wrap">
                            <Sparkles size={22} color="#3b4ab3" strokeWidth={2.5} />
                          </div>
                          <div className="lineup-modal-title">안내</div>
                          <div className="lineup-modal-message">
                            실제 서비스 환경에서 안정적으로 구현을 완료한
                            <br />
                            <span className="lineup-modal-feature-highlight">&apos;{clickedFeature}&apos;</span> 기능입니다.
                            <br />
                            <span style={{ display: 'block', marginTop: '10px' }}>
                              아키텍처 설계와 성능 최적화를 깊이 있게 고민했던 이 개발 경험을 실무 프로젝트에서 가치 있게 증명해 보이겠습니다.
                            </span>
                          </div>
                          <button
                            className="lineup-modal-btn"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
