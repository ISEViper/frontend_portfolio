"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import {
  ArrowLeft, RefreshCw, User, Home, Sparkles, ChevronRight,
  Droplets, Thermometer, Sun, Flame, CheckCircle, Activity,
  Lightbulb, AlertCircle, BarChart2
} from 'lucide-react';
import Link from 'next/link';
import './ssukssuk.css';

export default function SsukSsuk_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'ssukssuk');

  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');
  const [selectedSensor, setSelectedSensor] = useState('temp'); // 'temp' | 'humid' | 'light' | 'water'

  // 실시간 스마트폰 센서 상태 및 제어 시뮬레이션 상태값
  const [tempVal, setTempVal] = useState(24.5);
  const [humidVal, setHumidVal] = useState(60);
  const [lightVal, setLightVal] = useState(500);
  const [waterVal, setWaterVal] = useState(45); // % (45% -> 물 부족 상태 시뮬레이션)

  // 모달 팝업 상태값
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [clickedFeature, setClickedFeature] = useState('');
  const [controlActionAlert, setControlActionAlert] = useState<string | null>(null);

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

  // 센서 모의 제어 동작 (물 공급)
  const supplyWater = () => {
    setWaterVal(100);
    setControlActionAlert("스마트 재배기에 물이 가득 공급되었습니다! 🌿");
  };

  // 센서 모의 제어 동작 (LED 켜기)
  const turnOnLed = () => {
    setLightVal(950);
    setControlActionAlert("스마트 식물 LED 생장조명을 작동시켰습니다! 💡");
  };

  // 센서 모의 제어 동작 (환풍기 작동)
  const turnOnFan = () => {
    setTempVal(22.1);
    setHumidVal(52);
    setControlActionAlert("환풍 서큘레이터를 가동하여 공기를 순환시킵니다! 🌀");
  };

  // 리셋 시뮬레이션
  const resetSensors = () => {
    setTempVal(24.5);
    setHumidVal(60);
    setLightVal(500);
    setWaterVal(45);
    setControlActionAlert("모든 재배기 센서값을 정상 대기치로 리셋했습니다.");
  };

  // 센서별 차트 데이터 맵핑
  const getChartData = () => {
    switch (selectedSensor) {
      case 'temp':
        return [
          { label: '09:00', val: 21.2, display: '21.2°' },
          { label: '11:00', val: 23.5, display: '23.5°' },
          { label: '13:00', val: tempVal, display: `${tempVal}°` },
          { label: '15:00', val: 23.8, display: '23.8°' }
        ];
      case 'humid':
        return [
          { label: '09:00', val: 65, display: '65%' },
          { label: '11:00', val: 58, display: '58%' },
          { label: '13:00', val: humidVal, display: `${humidVal}%` },
          { label: '15:00', val: 55, display: '55%' }
        ];
      case 'light':
        return [
          { label: '09:00', val: 30, display: '300lx' },
          { label: '11:00', val: 60, display: '600lx' },
          { label: '13:00', val: (lightVal / 10), display: `${lightVal}lx` },
          { label: '15:00', val: 80, display: '800lx' }
        ];
      case 'water':
        return [
          { label: '09:00', val: 50, display: '50%' },
          { label: '11:00', val: 48, display: '48%' },
          { label: '13:00', val: waterVal, display: `${waterVal}%` },
          { label: '15:00', val: 42, display: '42%' }
        ];
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const maxChartVal = selectedSensor === 'light' ? 100 : 100; // Normalizing heights

  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>

      <nav>
        <Link href="/" className="logo" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          HKS.DEV
        </Link>
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
                <li>식물 초보자를 위한 IoT 스마트 수경 재배기 원격 제어 홈케어 서비스</li>
                <li>식물 종류별 생장 알고리즘 연동 맞춤 자동 급수 및 광량 조절 지원</li>
                <li>환경 상태(온/습도, 조도, 수위) 실시간 수집 및 인터랙티브 차트 모니터링</li>
              </ul>
            </div>

            {/* Key Features */}
            <div className="info-group" style={{ marginTop: '24px' }}>
              <span className="info-label info-label-green">Key Features</span>
              <table className="sidebar-features-table">
                <tbody>
                  <tr>
                    <td>센서 원격 제어</td>
                    <td>모바일 클릭 한 번으로 물 펌프, 생장 LED, 팬 등을 실시간 구동</td>
                  </tr>
                  <tr>
                    <td>히스토리 차트</td>
                    <td>시간별, 부위별 상태 지표를 애니메이션 차트로 시각화 모니터링</td>
                  </tr>
                  <tr>
                    <td>맞춤 가이드 알림</td>
                    <td>수위 경보 및 식물별 생장 팁 등의 AI 자동 푸시 가이드 제공</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="detail-main detail-fade-up">
            {/* Frontend Engineering */}
            <div className="ssuk-highlights-container" style={{ marginBottom: '40px' }}>
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

              <div className="ssuk-container">
                {/* User Mobile App Simulator */}
                <div className="ssuk-mobile-app">
                  <div className="ssuk-notch"></div>

                  <div className="ssuk-header">
                    <ArrowLeft className="icon" size={20} onClick={() => handleFeatureClick('이전 화면')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                    <div>쑥쑥 스마트 홈</div>
                    <RefreshCw className="icon" size={18} onClick={resetSensors} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                  </div>

                  <div className="ssuk-content ssuk-section-padding">
                    {/* Plant Panel */}
                    <div className="ssuk-plant-panel">
                      <div className="ssuk-plant-info">
                        <h4>스파트필름 1호</h4>
                        <p>생장 단계: 3단계 (개화기)</p>
                        <p>수경 재배 45일차 🌿</p>
                      </div>
                      <div className="ssuk-plant-avatar">
                        <Sparkles size={24} color="#fff" />
                      </div>
                    </div>

                    <div className="ssuk-section-title" style={{ fontSize: '15px', color: '#0f172a', marginBottom: '10px' }}>
                      실시간 센서 모니터링
                    </div>

                    {/* Sensor Cards Grid */}
                    <div className="ssuk-sensor-grid">
                      <div
                        className={`ssuk-sensor-card ${selectedSensor === 'temp' ? 'active' : ''}`}
                        onClick={() => setSelectedSensor('temp')}
                        style={{ borderColor: selectedSensor === 'temp' ? '#16a34a' : '#f1f5f9' }}
                      >
                        <div className="ssuk-sensor-header">
                          <span className="ssuk-sensor-label">온도</span>
                          <Thermometer size={16} color={selectedSensor === 'temp' ? '#16a34a' : '#64748b'} />
                        </div>
                        <div className="ssuk-sensor-value">{tempVal}°C</div>
                        <span className="ssuk-sensor-status good">정상</span>
                      </div>

                      <div
                        className={`ssuk-sensor-card ${selectedSensor === 'humid' ? 'active' : ''}`}
                        onClick={() => setSelectedSensor('humid')}
                        style={{ borderColor: selectedSensor === 'humid' ? '#16a34a' : '#f1f5f9' }}
                      >
                        <div className="ssuk-sensor-header">
                          <span className="ssuk-sensor-label">습도</span>
                          <Droplets size={16} color={selectedSensor === 'humid' ? '#16a34a' : '#64748b'} />
                        </div>
                        <div className="ssuk-sensor-value">{humidVal}%</div>
                        <span className="ssuk-sensor-status good">쾌적</span>
                      </div>

                      <div
                        className={`ssuk-sensor-card ${selectedSensor === 'light' ? 'active' : ''}`}
                        onClick={() => setSelectedSensor('light')}
                        style={{ borderColor: selectedSensor === 'light' ? '#16a34a' : '#f1f5f9' }}
                      >
                        <div className="ssuk-sensor-header">
                          <span className="ssuk-sensor-label">조도</span>
                          <Sun size={16} color={selectedSensor === 'light' ? '#16a34a' : '#64748b'} />
                        </div>
                        <div className="ssuk-sensor-value">{lightVal} lx</div>
                        <span className={`ssuk-sensor-status ${lightVal < 600 ? 'warning' : 'good'}`}>
                          {lightVal < 600 ? '일조부족' : '충분'}
                        </span>
                      </div>

                      <div
                        className={`ssuk-sensor-card ${selectedSensor === 'water' ? 'active' : ''}`}
                        onClick={() => setSelectedSensor('water')}
                        style={{ borderColor: selectedSensor === 'water' ? '#16a34a' : '#f1f5f9' }}
                      >
                        <div className="ssuk-sensor-header">
                          <span className="ssuk-sensor-label">수위</span>
                          <Droplets size={16} color={selectedSensor === 'water' ? '#16a34a' : '#64748b'} />
                        </div>
                        <div className="ssuk-sensor-value">{waterVal}%</div>
                        <span className={`ssuk-sensor-status ${waterVal < 50 ? 'warning' : 'good'}`}>
                          {waterVal < 50 ? '물부족' : '정상'}
                        </span>
                      </div>
                    </div>

                    {/* Sensor Dynamic History Chart */}
                    <div className="ssuk-chart-box">
                      <div className="ssuk-card-title" style={{ fontSize: '13px', margin: 0 }}>
                        <BarChart2 size={15} color="#16a34a" /> {selectedSensor === 'temp' && '온도 추이 (°C)'}
                        {selectedSensor === 'humid' && '습도 추이 (%)'}
                        {selectedSensor === 'light' && '광량 추이 (lx / 10)'}
                        {selectedSensor === 'water' && '수조 잔여 수량 (%)'}
                      </div>
                      <div className="ssuk-chart-bars">
                        {chartData.map((item, idx) => (
                          <div key={idx} className="ssuk-chart-bar-wrap">
                            <div
                              className="ssuk-chart-bar-fill"
                              style={{ height: `${(item.val / maxChartVal) * 100}%` }}
                              data-value={item.display}
                            ></div>
                            <span className="ssuk-chart-label">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* IoT Controller Actions */}
                    <div className="ssuk-card" style={{ marginBottom: '0' }}>
                      <div className="ssuk-card-title">
                        <Activity size={15} color="#16a34a" /> 스마트 원격 원터치 제어
                      </div>
                      <p className="ssuk-card-desc" style={{ marginBottom: '14px', fontSize: '11.5px' }}>
                        센서 관찰 후 급수 제어나 LED 조명 조작 등의 하드웨어 원격 액션을 트리거해 보세요.
                      </p>
                      
                      {selectedSensor === 'water' && (
                        <button className="ssuk-btn" onClick={supplyWater}>
                          물 보충 펌프 켜기 (100% 충전)
                        </button>
                      )}
                      {selectedSensor === 'light' && (
                        <button className="ssuk-btn" onClick={turnOnLed}>
                          식물용 LED 생장조명 작동
                        </button>
                      )}
                      {selectedSensor === 'temp' && (
                        <button className="ssuk-btn" onClick={turnOnFan}>
                          강제 통풍 및 열기 순환팬 작동
                        </button>
                      )}
                      {selectedSensor === 'humid' && (
                        <button className="ssuk-btn" onClick={turnOnFan}>
                          내부 습도 하강용 벤트 개방
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Bottom Navigation */}
                  <div className="ssuk-bottom-nav">
                    <div className="ssuk-nav-item active">
                      <Home size={20} />대시보드
                    </div>
                    <div className="ssuk-nav-item" onClick={() => handleFeatureClick('식물 생장 일지')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                      <Sun size={20} />성장일지
                    </div>
                    <div className="ssuk-nav-item" onClick={() => handleFeatureClick('마이 페이지')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                      <User size={20} />마이
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
    </div>
  );
}
