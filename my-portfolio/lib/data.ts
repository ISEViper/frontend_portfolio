export const projectData = [
  {
    id: 1,
    slug: "mom",
    title: "MoM (Model of Me)",
    year: "2026.04 - 2026.06",
    logo: "MoM",
    logoDesc: "AI 3D Modeling",
    image: "/projects/mom/MoM_App_Icon.png",
    role: "Lead Frontend Developer",
    tech: ["Flutter", "Dart", "Three.js", "Dio"],
    overview: "스마트폰을 활용한 3D 가우시안 스플래팅(3DGS) 기반 AI 신체 렌더링 서비스",
    highlights: [
      "다크 모드 기반의 직관적인 3D 뷰어 컨트롤러 UI/UX 설계 및 프로토타이핑",
      "대용량 3DGS 데이터 로딩 로직 최적화를 통한 모바일 렌더링 속도 40% 이상 개선",
      "Flutter를 활용한 iOS/Android 크로스 플랫폼 아키텍처 설계 및 상태 관리 최적화",
      "Python 백엔드 AI 모델과의 비동기 통신(REST API) 파이프라인 구축"
    ],
    previewType: "mobile"
  },
  {
    id: 2,
    slug: "lineup",
    title: "줄서잇",
    year: "2026.02 - 2026.03",
    logo: "줄서잇",
    logoDesc: "Queue Platform",
    image: "/projects/lineup/Lineup_App_Icon.png",
    role: "Frontend Engineer",
    tech: ["React Native", "Expo", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts", "Axios"],
    overview: "박람회 부스 대기열 관리 플랫폼의 유저(App) 및 관리자(Web) 통합 구축",
    highlights: [
      "Next.js SSR(Server-Side Rendering)을 적용하여 관리자 대시보드의 초기 로딩 속도 및 SEO 향상",
      "유저 모바일 앱과 관리자 웹 간의 실시간 대기열 데이터 동기화 로직 구현 (WebSocket 연동)",
      "Zustand를 활용한 전역 상태 관리로 불필요한 리렌더링 방지 및 프론트엔드 퍼포먼스 최적화",
      "반응형 웹 디자인 적용 및 크로스 브라우징 이슈 해결"
    ],
    previewType: "responsive"
  },
  {
    id: 3,
    slug: "ssukssuk",
    title: "쑥쑥 (SSUKSSUK)",
    year: "2026.01 - 2026.02",
    logo: "SSUKSSUK",
    logoDesc: "Smart IoT Farm",
    image: "/projects/ssukssuk/ssukssuk_App_Icon.png",
    role: "UI/UX & Frontend Developer",
    tech: ["React Native", "TypeScript", "Firebase FCM", "Recharts", "Figma"],
    overview: "센서 데이터 실시간 모니터링, AI 기반 건강 진단(YOLO) 및 STM32 펌프 자동 복구 시스템을 구축한 IoT 스마트 수경 재배 플랫폼",
    highlights: [
      "SSE(Server-Sent Events) 및 MQTT 프로토콜 연동을 통한 온습도·수위·EC 센서 데이터 실시간 대시보드 시각화",
      "YOLO Segmentation 모델 활용 AI 식물 건강 분석(정상, 과습 등 5단계) 및 14일 생장 추적 카메라 파이프라인 연동",
      "STM32 MCU 레벨의 상태 머신 자동 제어/복구 및 사용자 원터치 모바일 제어 인터랙션 구현",
      "Jenkins CI/CD 자동화 빌드 및 Prometheus + Grafana + Loki 모니터링 경보(12가지 규칙) 인프라 구축"
    ],
    previewType: "mobile"
  },
  {
    id: 4,
    slug: "didim",
    title: "DIDIM",
    year: "2025.11 - 2025.12",
    logo: "DIDIM",
    logoDesc: "AI Financial Recommendation",
    image: "/projects/didim/didim_App_Icon.png",
    role: "Frontend Developer & UI/UX Designer",
    tech: ["Vue.js", "Django", "DRF(Django REST Framework)", "SQLite", "Axios", "Gemini 2.5 Pro", "Docker", "AWS"],
    overview: "AI 기반 사용자 맞춤형 금융 상품 및 자산 분배 추천 플랫폼",
    highlights: [
      "Gemini API를 활용한 실시간 주식/ETF 심층 분석 및 투자 코멘트 제공",
      "금융감독원 Open API 기반 전국 은행 예적금 데이터 실시간 통합 검색"
    ],
    previewType: "web"
  }
];
