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
    tech: ["React Native", "Next.js", "TypeScript", "Zustand"],
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
    title: "쑥쑥",
    year: "2026.01 - 2026.02",
    logo: "SSUKSSUK",
    logoDesc: "AI Farm System",
    image: "/projects/ssukssuk/ssukssuk_App_Icon.png",
    role: "UI/UX & Frontend Developer",
    tech: ["React Native", "Recharts", "Figma", "Python API"],
    overview: "스파트필름 수경 재배 시스템을 위한 스마트 식물 재배기 모니터링 앱 (Mobile Only)",
    highlights: [
      "사용자 친화적인 모바일 모니터링 대시보드 UI 컴포넌트 모듈화 및 개발",
      "재배기 센서 데이터 및 AI 이미지 분석 결과를 실시간 Interactive Chart로 시각화",
      "다크모드/라이트모드 테마 시스템 구축을 통한 사용자 접근성 극대화",
      "API 응답 실패 및 로딩 상태 처리를 위한 Skeleton UI 및 Error Boundary 설계"
    ],
    previewType: "mobile"
  }
];
