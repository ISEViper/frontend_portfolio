"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectData } from '../../../lib/data';
import {
  ArrowLeft, Bell, CheckCircle, QrCode,
  User, Home, Sparkles, BarChart2, Settings, MapPin, ChevronRight, Clock, Package
} from 'lucide-react';
import Link from 'next/link';
import './lineup.css';

/* ═══════════════════════════════════════════════
   가상 부스 데이터
   ═══════════════════════════════════════════════ */
const BOOTHS = [
  {
    id: 'nexwave',
    code: 'P300',
    name: '넥스트웨이브',
    floor: '2층 The Platz P300',
    bookable: true,
    color: '#ef4444',
    bgColor: '#fff5f5',
    waitPeople: 130,
    waitMin: 107,
    expPeople: 60,
    intro: '넥스트웨이브는 AI, IoT, 클라우드 기반 기술에 Digital Twin, Metaverse, Robot 등 디지털 기술을 융합해 산업전반의 디지털 전환(DX)을 리딩해 나갑니다.',
    goods: [
      { name: '넥스트 볼펜', status: '판매 중' },
      { name: '넥스트 인형', status: '매진' },
      { name: '넥스트 메모 패드', status: '판매 중' },
    ],
  },
  { id: 'starion', code: 'P310', name: '스타리온 홀딩스', floor: '2층 The Platz P310', bookable: false, color: '#22c55e', bgColor: '#f0fdf4', waitPeople: 85, waitMin: 72, expPeople: 40, intro: '', goods: [] },
  { id: 'techno', code: 'P200', name: '테크노폴리스', floor: '2층 The Platz P200', bookable: false, color: '#ef4444', bgColor: '#fff0f0', waitPeople: 95, waitMin: 83, expPeople: 50, intro: '', goods: [] },
  { id: 'fusion', code: 'P210', name: '퓨전스탠다드', floor: '2층 The Platz P210', bookable: false, color: '#22c55e', bgColor: '#f0fdf4', waitPeople: 60, waitMin: 55, expPeople: 30, intro: '', goods: [] },
  { id: 'aiflex', code: 'P100', name: '에이아이플렉스', floor: '1층 The Platz P100', bookable: false, color: '#f59e0b', bgColor: '#fffbeb', waitPeople: 110, waitMin: 95, expPeople: 55, intro: '', goods: [] },
  { id: 'robohive', code: 'P110', name: '로보하이브', floor: '1층 The Platz P110', bookable: false, color: '#22c55e', bgColor: '#f0fdf4', waitPeople: 45, waitMin: 35, expPeople: 20, intro: '', goods: [] },
];

export default function Lineup_page() {
  const router = useRouter();
  const selectedProject = projectData.find(p => p.slug === 'lineup');
  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState('dark');
  const [emailCopied, setEmailCopied] = useState(false);

  // ── 모바일 화면 상태 ──
  type MobileScreen = 'map' | 'detail' | 'booking' | 'booked' | 'waiting';
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('map');
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  // ── 모달 ──
  const [generalModalOpen, setGeneralModalOpen] = useState(false);
  const [clickedFeature, setClickedFeature] = useState('');

  // ── 대기열 공유 상태 ──
  const [queueList, setQueueList] = useState([
    { num: 89, name: '김*민', status: 'called' },
    { num: 76, name: '이*주', status: 'waiting' },
    { num: 92, name: '최*수', status: 'waiting' },
  ]);
  const [myQueueNum, setMyQueueNum] = useState<number | null>(null);
  const [calledMyNumber, setCalledMyNumber] = useState(false);

  const selectedBooth = BOOTHS.find(b => b.id === selectedBoothId) || BOOTHS[0];

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

  /* ── 부스 클릭 ── */
  const handleBoothClick = (boothId: string) => {
    const booth = BOOTHS.find(b => b.id === boothId);
    if (!booth) return;
    setSelectedBoothId(boothId);
    if (booth.bookable) {
      setMobileScreen('detail');
    } else {
      setClickedFeature(booth.name + ' 부스 예약');
      setGeneralModalOpen(true);
    }
  };

  /* ── 예약 → 대기 등록 ── */
  const confirmBooking = () => {
    const nextNum = Math.max(...queueList.map(q => q.num), 92) + 1;
    setMyQueueNum(nextNum);
    setQueueList(prev => [...prev, { num: nextNum, name: '나 (본인)', status: 'waiting' }]);
    setMobileScreen('booked');
    setAgreed(false);
  };

  /* ── 예약 완료 → 대기 조회 ── */
  const goToWaiting = () => {
    setMobileScreen('waiting');
  };

  /* ── 대기 취소 (모바일) ── */
  const cancelWaiting = () => {
    if (myQueueNum !== null) {
      setQueueList(prev => prev.filter(q => q.num !== myQueueNum));
      setMyQueueNum(null);
    }
    setCalledMyNumber(false);
    setMobileScreen('map');
  };

  /* ── 호출 (관리자) ── */
  const callQueue = (num: number) => {
    setQueueList(prev => prev.map(q => q.num === num ? { ...q, status: 'called' } : q));
    if (num === myQueueNum) setCalledMyNumber(true);
  };

  /* ── 입장 (관리자) ── */
  const enterQueue = (num: number) => {
    setQueueList(prev => prev.filter(q => q.num !== num));
    if (num === myQueueNum) { setCalledMyNumber(false); setMyQueueNum(null); setMobileScreen('map'); }
  };

  /* ── 취소 (관리자) ── */
  const cancelQueue = (num: number) => {
    setQueueList(prev => prev.filter(q => q.num !== num));
    if (num === myQueueNum) { setMyQueueNum(null); setCalledMyNumber(false); setMobileScreen('map'); }
  };

  /* ── 호출 수락 (모바일) ── */
  const acceptCall = () => {
    setCalledMyNumber(false);
    if (myQueueNum !== null) {
      setQueueList(prev => prev.filter(q => q.num !== myQueueNum));
      setMyQueueNum(null);
    }
    setMobileScreen('map');
  };

  const waitingAhead = myQueueNum !== null
    ? queueList.filter(q => q.status === 'waiting').findIndex(q => q.num === myQueueNum)
    : 0;

  const engineeringItems = [
    {
      title: '크로스 플랫폼(App & Web) 실시간 상태 동기화 및 알림 파이프라인 구축',
      problem: '관람객(App)의 대기 등록/취소와 관리자(Web)의 입장/호출 처리가 지연 없이 양방향으로 동기화되어야 하며, 브라우저 백그라운드 전환 시 상태 누락 위험 존재',
      solution: '웹소켓을 통한 실시간 통신을 기반으로, 관리자 웹에서는 상태 변경 시 즉각적인 UI 피드백을 제공하고 관람객 앱에서는 expo-notifications를 활용한 네이티브 푸시 알림을 연동하여 갱신 무결성과 단절 없는 사용자 경험을 구현했습니다.',
    },
    {
      title: '네이티브 모듈 연동을 통한 현장 밀착형 관람객 경험 최적화',
      problem: '박람회 현장에서 관람객이 빠르고 정확하게 부스에 체크인하고 본인의 상태를 확인할 수 있는 앱 환경 필요',
      solution: 'expo-camera를 도입하여 빠르고 정확한 QR 코드 스캔 기능을 구현하고, expo-router 기반의 직관적인 네비게이션을 설계하여 복잡한 행사장에서도 사용자가 헤매지 않고 예약부터 도착 인증까지 원활하게 진행할 수 있도록 최적화했습니다.',
    },
    {
      title: '대규모 데이터를 다루는 관리자용 대시보드 렌더링 및 UI 최적화',
      problem: '50개 이상의 부스 현황, 실시간 유입 인원, 굿즈 재고 등 다량의 데이터가 수시로 변경되는 웹 대시보드에서 렌더링 지연(Lag) 발생',
      solution: 'Tailwind CSS와 shadcn/ui를 결합하여 일관성 있고 가벼운 컴포넌트 시스템을 구축하고, 상태 관리와 React.memo를 활용해 잦은 데이터 변경 영역과 정적 영역을 분리하여 불필요한 리렌더링을 방지함으로써 쾌적한 60fps 조작감을 달성했습니다.',
    },
  ];

  /* ═══════════════════════════════════════════════════════
     모바일 앱 화면 렌더 함수
     ═══════════════════════════════════════════════════════ */
  const renderMobileScreen = () => {
    switch (mobileScreen) {
      /* ─── 배치도 ─── */
      case 'map':
        return (
          <>
            {/* 헤더 */}
            <div style={{ padding: '18px 12px 6px', background: '#fff', borderBottom: '1px solid #eaeaea', flexShrink: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>배치도</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                <span style={{ fontSize: '9px', color: '#3b4ab3', fontWeight: '700', borderBottom: '2px solid #3b4ab3', paddingBottom: '3px' }}>부스 배치도</span>
                <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '600' }}>부스 목록</span>
              </div>
            </div>

            {/* 배치도 콘텐츠 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', background: '#ebebeb', display: 'flex', flexDirection: 'column', gap: '5px', paddingBottom: '52px' }}>
              {/* 층 선택 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '3px 4px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', gap: '2px' }}>
                  {['3F', '2F', '1F'].map(f => (
                    <div key={f} style={{ padding: '3px 7px', borderRadius: '4px', fontSize: '8px', fontWeight: '700', background: f === '2F' ? '#0f172a' : 'transparent', color: f === '2F' ? '#fff' : '#94a3b8' }}>{f}</div>
                  ))}
                </div>
              </div>

              {/* 부스 그리드 */}
              {[BOOTHS.slice(0, 2), BOOTHS.slice(2, 4), BOOTHS.slice(4, 6)].map((row, ri) => (
                <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  {row.map(booth => (
                    <div
                      key={booth.id}
                      onClick={() => handleBoothClick(booth.id)}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        background: booth.bgColor,
                        border: `2px solid ${booth.color}`,
                        borderRadius: '10px',
                        padding: '8px 7px',
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                      }}
                    >
                      <div style={{ fontSize: '7px', fontWeight: '800', color: booth.color, marginBottom: '2px' }}>{booth.code}</div>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>{booth.name}</div>
                      <div style={{ fontSize: '7px', color: '#64748b', marginTop: '2px' }}>대기 {booth.waitPeople}명</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        );

      /* ─── 부스 상세 ─── */
      case 'detail':
        return (
          <>
            {/* 헤더 */}
            <div style={{ padding: '18px 12px 8px', background: '#fff', borderBottom: '1px solid #eaeaea', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={14} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setMobileScreen('map')} />
              <span style={{ fontSize: '12px', fontWeight: '700' }}>{selectedBooth.name}</span>
            </div>

            {/* 부스 상세 콘텐츠 */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '52px', background: '#f8fafc' }}>
              {/* 회사 카드 */}
              <div style={{ background: 'linear-gradient(180deg, #e8eaf6 0%, #f3f4fb 100%)', padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}>{selectedBooth.name}</div>
                <div style={{ fontSize: '9px', color: '#64748b' }}>{selectedBooth.floor}</div>
              </div>

              <div style={{ padding: '14px 14px' }}>
                {/* 소개 */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', textAlign: 'center' }}>소개</div>
                  <p style={{ fontSize: '10px', color: '#475569', lineHeight: '1.7', margin: 0, textAlign: 'center' }}>{selectedBooth.intro}</p>
                </div>

                {/* 부스 현황 */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>부스 현황</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '4px' }}>
                    <Clock size={13} color="#3b4ab3" />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b4ab3' }}>예상 대기 시간: {selectedBooth.waitMin}분</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', textAlign: 'center', lineHeight: '1.8' }}>
                    예약 인원: {selectedBooth.waitPeople}명<br />
                    체험 인원: {selectedBooth.expPeople}명
                  </div>
                </div>

                {/* 굿즈 현황 */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', textAlign: 'center' }}>굿즈 현황</div>
                  {selectedBooth.goods.map((g, i) => (
                    <div key={i} style={{ fontSize: '10px', color: '#475569', textAlign: 'center', lineHeight: '1.8' }}>
                      <strong>{g.name}</strong>: <span style={{ color: g.status === '매진' ? '#ef4444' : '#22c55e' }}>{g.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 예약하기 버튼 (하단 고정) */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '8px 14px', background: '#fff', borderTop: '1px solid #f0f0f0', zIndex: 10 }}>
              <button
                onClick={() => setMobileScreen('booking')}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#1e2235', color: '#fff', fontSize: '11px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
              >
                예약하기
              </button>
            </div>
          </>
        );

      /* ─── 예약하기 화면 ─── */
      case 'booking':
        return (
          <>
            {/* 헤더 */}
            <div style={{ padding: '18px 12px 8px', background: '#fff', borderBottom: '1px solid #eaeaea', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={14} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => setMobileScreen('detail')} />
              <span style={{ fontSize: '12px', fontWeight: '700' }}>예약하기</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', background: '#fff', paddingBottom: '60px' }}>
              {/* 예약 내역 */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>예약 내역</div>
                <div style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a' }}>{selectedBooth.name}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>부스 위치: {selectedBooth.floor}</div>
              </div>

              {/* 실시간 대기 현황 */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>실시간 대기 현황</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '8px', color: '#94a3b8' }}>현재 대기 인원</div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>{selectedBooth.waitPeople}명</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '8px', color: '#94a3b8' }}>예상 대기 시간</div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a' }}>{selectedBooth.waitMin}분</div>
                  </div>
                </div>
                <div style={{ fontSize: '8px', color: '#94a3b8', marginTop: '4px' }}>* 대기 시간은 현장 상황에 따라 유동적으로 변경될 수 있습니다.</div>
              </div>

              {/* 예약자 정보 확인 */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>예약자 정보 확인</div>
                <div style={{ fontSize: '11px', color: '#0f172a', lineHeight: '1.8' }}>
                  <strong>예약자:</strong> 청하한 두루미<br />
                  <strong>참여 일자:</strong> 2026.03.06(목)
                </div>
              </div>

              {/* 대기 및 이용 안내사항 */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' }}>대기 및 이용 안내사항</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '9px', color: '#3b4ab3' }}>ⓘ</span>
                  <span style={{ fontSize: '9px', fontWeight: '700', color: '#0f172a' }}>예약 신청 전 반드시 확인해주세요!</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '9px', color: '#475569', lineHeight: '1.8' }}>
                  <li>내 순서가 다가오면 <strong>앱 푸시 및 알림톡</strong>으로 안내해 드립니다.</li>
                  <li>입장 호출 알림 수신 후 <strong>5분 이내</strong>에 부스 입구로 와주세요.</li>
                  <li>시간 내 미입장 시 대기 예약이 <strong>&apos;자동 취소&apos;</strong> 처리됩니다.</li>
                  <li>보다 많은 관람객의 체험을 위해 동시 대기 가능한 부스 개수는 <strong>최대 3개</strong>로 제한합니다.</li>
                </ul>
              </div>

              {/* 동의 체크박스 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  style={{ width: '13px', height: '13px', accentColor: '#3b4ab3' }}
                />
                <span style={{ fontSize: '9px', color: '#475569' }}>[필수] 위 안내사항을 모두 확인하였으며 동의합니다.</span>
              </div>
            </div>

            {/* 예약하기 버튼 (하단 고정) */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '8px 14px', background: '#fff', borderTop: '1px solid #f0f0f0', zIndex: 10 }}>
              <button
                onClick={confirmBooking}
                disabled={!agreed}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  width: '100%', padding: '10px', borderRadius: '10px',
                  background: agreed ? '#1e2235' : '#d1d5db', color: '#fff',
                  fontSize: '11px', fontWeight: '700', border: 'none',
                  cursor: agreed ? 'pointer' : 'not-allowed',
                }}
              >
                예약하기
              </button>
            </div>
          </>
        );

      /* ─── 예약 완료 ─── */
      case 'booked':
        return (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '16px' }}>예약이 완료되었습니다!</div>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <CheckCircle size={28} color="#22c55e" strokeWidth={2.5} />
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', width: '100%', textAlign: 'left', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>꼭 알아두세요!</div>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '9px', color: '#475569', lineHeight: '1.8' }}>
                  <li>내 순서가 다가오면 <strong>앱 푸시 및 알림톡</strong>으로 안내해 드립니다.</li>
                  <li>입장 호출 알림 수신 후 <strong>5분 이내</strong>에 부스 입구로 와주세요.</li>
                  <li>시간 내 미입장 시 대기 예약이 <strong>&apos;자동 취소&apos;</strong> 처리됩니다.</li>
                  <li>보다 많은 관람객의 체험을 위해 동시 대기 가능한 부스 개수는 <strong>최대 3개</strong>로 제한합니다.</li>
                </ul>
              </div>

              <button
                onClick={goToWaiting}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#1e2235', color: '#fff', fontSize: '11px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
              >
                예약 내역 조회
              </button>
            </div>
          </>
        );

      /* ─── 대기 현황 ─── */
      case 'waiting':
        return (
          <>
            {/* 헤더 */}
            <div style={{ padding: '18px 12px 8px', background: '#fff', borderBottom: '1px solid #eaeaea', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setMobileScreen('map')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ArrowLeft size={14} color="#94a3b8" />
              </button>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>대기 현황 조회</span>
              <QrCode size={13} color="#3b4ab3" />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '52px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={10} color="#3b4ab3" />
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#1e293b' }}>줄서잇 부스 대기</span>
              </div>
              <div style={{ fontSize: '8px', color: '#64748b' }}>박람회 부스에 오신 것을 환영합니다!</div>

              {/* 대기 티켓 */}
              <div style={{ background: 'linear-gradient(135deg, #3b4ab3, #2b3a8c)', color: '#fff', borderRadius: '14px', padding: '14px', textAlign: 'center', boxShadow: '0 8px 20px rgba(59,74,179,0.3)' }}>
                <div style={{ fontSize: '7px', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.7 }}>WAITING TICKET</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', lineHeight: '1', margin: '4px 0' }}>{myQueueNum}</div>
                <div style={{ width: '60%', margin: '8px auto', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '8px', opacity: 0.85, marginTop: '4px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '6px', opacity: 0.7 }}>내 앞 대기</span>
                    <strong style={{ fontSize: '12px' }}>{Math.max(0, waitingAhead)} 팀</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '6px', opacity: 0.7 }}>예상 시간</span>
                    <strong style={{ fontSize: '12px' }}>{Math.max(0, waitingAhead) * 3} 분</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}>
                  <CheckCircle size={10} color="#22c55e" />
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#22c55e' }}>대기 완료</span>
                </div>
                <p style={{ fontSize: '8px', color: '#64748b', lineHeight: '1.5', margin: '0 0 8px 0' }}>
                  입장 순서가 되면 푸시 팝업으로 알려드립니다. 부스 근처에서 대기해 주세요.
                </p>
                <button onClick={cancelWaiting} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', padding: '5px', fontSize: '8px', fontWeight: '700', cursor: 'pointer', width: '100%' }}>
                  대기 취소하기
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="app-wrapper">
      <div className="custom-cursor" ref={cursorRef}></div>

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
        <div className="detail-header" style={{ backgroundImage: "url('/projects/lineup/Lineup_background.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
          <div className="detail-title-area detail-fade-up">
            <button className="btn-back" onClick={() => router.push('/')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>&larr; Back to Archive</button>
            <h1 className="detail-title">{selectedProject.title}</h1>
          </div>
        </div>

        {/* ════════════════════════════════════════
            BODY — 2행 레이아웃
            행 1: [Project Info | Frontend Engineering]
            행 2: [Interactive Preview (모바일 + 웹)]
            ════════════════════════════════════════ */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 5vw 80px' }}>

          {/* ─── 행 1: Project Info + Frontend Engineering ─── */}
          <div className="detail-fade-up" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px', alignItems: 'start', marginBottom: '60px' }}>

            {/* PROJECT INFO */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
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
                  <li>박람회 부스 장기 대기로 인한 연쇄 취소 및 혼잡도를 해결하기 위한 스마트 부스 연결 플랫폼</li>
                  <li>관람객을 위한 모바일 앱(App)과 부스 및 총괄 관리자를 위한 반응형 웹 대시보드(Web) 동시 제공</li>
                  <li>실시간 대기열 동기화, QR 기반 현장 등록, 푸시 알림을 통한 양방향 피드백 시스템 구축</li>
                </ul>
              </div>

              {/* Key Features */}
              <div className="info-group" style={{ marginTop: '24px' }}>
                <span className="info-label info-label-blue">Key Features</span>
                <table className="sidebar-features-table">
                  <tbody>
                    <tr><td>스마트 웨이팅</td><td>expo-camera를 활용한 현장 QR 스캔으로 터치 한 번에 실시간 대기 등록 및 순번 조회</td></tr>
                    <tr><td>실시간 알림</td><td>expo-notifications를 연동하여 부스 입장 타이밍에 맞춘 실시간 푸시 팝업 송출</td></tr>
                    <tr><td>통합 관리</td><td>Recharts와 shadcn/ui를 활용해 전체 부스 대기 현황과 굿즈 상태를 시각화한 대시보드</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FRONTEND ENGINEERING */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
                Frontend Engineering
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
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '8px' }}>
              Interactive Preview
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '24px', lineHeight: '1.6' }}>
              배치도에서 <strong style={{ color: 'var(--text-main)' }}>넥스트웨이브</strong> 부스를 클릭하면 예약 플로우를 체험할 수 있습니다. 예약 후 관리자 대시보드에서 호출하면 모바일에 알림이 도착합니다.
            </p>

            {/* ═══ 모바일 + 웹 동시 표시 ═══ */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'center' }}>

              {/* ──── 모바일 앱 프레임 ──── */}
              <div style={{
                width: '220px', minWidth: '220px', height: '480px',
                backgroundColor: '#f7f7f9',
                border: '10px solid #1a1a1a',
                borderRadius: '36px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                position: 'relative',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif',
                color: '#1a1a1a',
                display: 'flex', flexDirection: 'column', flexShrink: 0,
              }}>
                {/* 노치 */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70px', height: '16px', backgroundColor: '#1a1a1a', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', zIndex: 20 }} />

                {/* 화면 내용 */}
                {renderMobileScreen()}

                {/* 바텀 내비 (map과 waiting 화면에서만) */}
                {(mobileScreen === 'map' || mobileScreen === 'waiting') && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '44px', background: '#fff', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 10 }}>
                    {[
                      { icon: <Home size={14} />, label: '홈', active: mobileScreen === 'waiting' },
                      { icon: <QrCode size={14} />, label: '예약관리', active: false },
                      { icon: <MapPin size={14} />, label: '배치도', active: mobileScreen === 'map' },
                      { icon: <User size={14} />, label: 'MY', active: false },
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '7px', fontWeight: '600', color: n.active ? '#3b4ab3' : '#94a3b8', cursor: 'pointer' }}
                        onClick={() => {
                          if (n.label === '배치도') setMobileScreen('map');
                          if (n.label === '홈' && myQueueNum !== null) setMobileScreen('waiting');
                        }}
                      >
                        {n.icon}{n.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* 호출 알림 팝업 */}
                {calledMyNumber && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10,10,20,0.55)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '20px 16px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 30px rgba(10,15,40,0.2)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#eff2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <Bell size={20} color="#3b4ab3" strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>입장 호출 알림</div>
                      <div style={{ fontSize: '11px', color: '#4a4a4a', lineHeight: '1.6', marginBottom: '16px' }}>
                        고객님 차례가 되었습니다!<br />
                        대기번호 <span style={{ color: '#3b4ab3', fontWeight: '700', background: '#eff2fc', padding: '1px 5px', borderRadius: '4px' }}>{myQueueNum}</span>번 고객님은<br />즉시 부스로 입장해 주세요.
                      </div>
                      <button onClick={acceptCall} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#3b4ab3', color: '#fff', fontSize: '11px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                        확인 및 입장 완료
                      </button>
                    </div>
                  </div>
                )}

                {/* 범용 모달 (bookable 아닌 부스) */}
                {generalModalOpen && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10,10,20,0.55)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '18px', padding: '20px 16px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 10px 30px rgba(10,15,40,0.2)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#eff2fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <Sparkles size={20} color="#3b4ab3" strokeWidth={2.5} />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#1a1a1a', marginBottom: '8px' }}>안내</div>
                      <div style={{ fontSize: '11px', color: '#4a4a4a', lineHeight: '1.6', marginBottom: '16px' }}>
                        실제 서비스 환경에서 안정적으로 구현을 완료한<br />
                        <span style={{ color: '#3b4ab3', fontWeight: '700' }}>&apos;{clickedFeature}&apos;</span> 기능입니다.<br />
                        <span style={{ display: 'block', marginTop: '8px' }}>
                          아키텍처 설계와 성능 최적화를 깊이 있게 고민했던 이 개발 경험을 실무 프로젝트에서 가치 있게 증명해 보이겠습니다.
                        </span>
                      </div>
                      <button onClick={() => setGeneralModalOpen(false)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#3b4ab3', color: '#fff', fontSize: '11px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                        확인
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SYNC 인디케이터 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', minWidth: '24px', marginTop: '160px', opacity: 0.5 }}>
                <div style={{ width: '1px', height: '30px', background: 'linear-gradient(to bottom, transparent, #3b4ab3)' }} />
                <div style={{ fontSize: '7px', fontWeight: '800', color: '#3b4ab3', letterSpacing: '0.08em' }}>SYNC</div>
                <div style={{ width: '1px', height: '30px', background: 'linear-gradient(to top, transparent, #3b4ab3)' }} />
              </div>

              {/* ──── 웹 관리자 대시보드 ──── */}
              <div style={{
                flex: 1, minWidth: 0, height: '480px',
                border: '1px solid #e2e8f0', borderRadius: '14px',
                overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                backgroundColor: '#ffffff',
              }}>

                {/* 대시보드 헤더 */}
                <div style={{ padding: '10px 16px', background: '#1e2235', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#fff' }}>
                    <div style={{ width: '22px', height: '22px', background: 'linear-gradient(135deg, #a3e635, #65a30d)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900', color: '#1a2e05' }}>L</div>
                    줄서잇 매니저
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>A-01 부스 관리자</span>
                </div>

                {/* 대시보드 바디 */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                  {/* 사이드바 */}
                  <div style={{ width: '100px', background: '#1e2235', flexShrink: 0, padding: '10px 6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ padding: '8px', borderRadius: '6px', background: '#2d3452', color: '#fff', fontSize: '10px', fontWeight: '700', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <BarChart2 size={13} /><span>대시보드</span>
                    </div>
                    <div style={{ padding: '8px', borderRadius: '6px', color: '#64748b', fontSize: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <User size={13} /><span>사용자 통계</span>
                    </div>
                    <div style={{ padding: '8px', borderRadius: '6px', color: '#64748b', fontSize: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <Settings size={13} /><span>환경 설정</span>
                    </div>
                    <div style={{ marginTop: 'auto', borderTop: '1px solid #2d3452', paddingTop: '8px' }}>
                      <button style={{ background: '#2d3452', border: 'none', borderRadius: '5px', color: '#94a3b8', fontSize: '8px', padding: '5px 6px', width: '100%', cursor: 'pointer', lineHeight: '1.4' }}>
                        총괄 관리자에게<br />문의하기
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#374151', flexShrink: 0 }} />
                        <div style={{ fontSize: '8px', color: '#94a3b8', lineHeight: '1.4' }}>
                          관리자<br /><strong style={{ color: '#e2e8f0' }}>A-01</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 메인 콘텐츠 */}
                  <div style={{ flex: 1, background: '#f8fafc', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>

                    {/* 제목 + 상태 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>실시간 대기 현황</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                          <span style={{ fontSize: '9px', color: '#22c55e', fontWeight: '500' }}>현재 부스 정상 운영 중</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '9px', color: '#94a3b8' }}>예상 대기 시간</div>
                        <div style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.1' }}>
                          {queueList.filter(q => q.status === 'waiting').length * 10}분
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', justifyContent: 'flex-end' }}>
                          <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '4px', padding: '2px 6px', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>⊙ 운영중지</span>
                          <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', padding: '2px 6px', fontSize: '8px', fontWeight: '700', cursor: 'pointer' }}>⊗ 운영종료</span>
                        </div>
                      </div>
                    </div>

                    {/* 탭 */}
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div style={{ background: '#0f172a', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '700' }}>
                        대기 {queueList.filter(q => q.status === 'waiting').length}
                      </div>
                      <div style={{ color: '#94a3b8', padding: '4px 12px', fontSize: '11px', fontWeight: '600' }}>입장</div>
                      <div style={{ color: '#94a3b8', padding: '4px 12px', fontSize: '11px', fontWeight: '600' }}>취소</div>
                    </div>

                    {/* 대기자 목록 */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {queueList.map((q, idx) => (
                        <div key={q.num} style={{
                          display: 'flex', alignItems: 'center', padding: '10px 12px',
                          background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px',
                          borderLeft: `3px solid ${q.status === 'called' ? '#22c55e' : '#ef4444'}`,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)', gap: '10px',
                        }}>
                          <div style={{ textAlign: 'center', minWidth: '30px' }}>
                            <div style={{ fontSize: '7px', color: '#94a3b8' }}>ORDER</div>
                            <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>{idx + 1}</div>
                          </div>
                          <div style={{ minWidth: '38px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '900', color: '#3b4ab3' }}>{q.num}</span>
                            <span style={{ fontSize: '9px', color: '#94a3b8' }}>번</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>{q.name} 님</div>
                            <div style={{ fontSize: '9px', color: q.status === 'called' ? '#22c55e' : '#f59e0b', fontWeight: '500' }}>
                              {q.status === 'called' ? '⊙ 호출 완료' : '⊙ 대기 중'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => callQueue(q.num)} disabled={q.status === 'called'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                              style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', background: q.status === 'called' ? '#f1f5f9' : '#fef9c3', color: q.status === 'called' ? '#94a3b8' : '#854d0e', fontSize: '9px', fontWeight: '700', cursor: q.status === 'called' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                            >🔔 호출</button>
                            <button onClick={() => enterQueue(q.num)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                              style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', background: '#dcfce7', color: '#166534', fontSize: '9px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >✓ 입장</button>
                            <button onClick={() => cancelQueue(q.num)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                              style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#991b1b', fontSize: '9px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >✕ 취소</button>
                          </div>
                        </div>
                      ))}

                      {queueList.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: '12px' }}>
                          현재 대기열이 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
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
