import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { projectData } from "@/lib/data";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// ─── 1. 서버 측 Rate Limiter (RPM / Cooldown 방어) ─────────────────────────
const requestHistory: { [ip: string]: number[] } = {};
const MIN_COOLDOWN_MS = 2500; // 요청 간 최소 2.5초 대기
const MAX_REQUESTS_PER_MINUTE = 15;

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  if (!requestHistory[ip]) {
    requestHistory[ip] = [];
  }

  requestHistory[ip] = requestHistory[ip].filter((time) => now - time < 60000);
  const lastRequest = requestHistory[ip][requestHistory[ip].length - 1];

  if (lastRequest && now - lastRequest < MIN_COOLDOWN_MS) {
    const waitSec = Math.ceil((MIN_COOLDOWN_MS - (now - lastRequest)) / 1000);
    return {
      allowed: false,
      message: `⏳ 너무 빠르게 질문하셨습니다. ${waitSec}초 후 다시 시도해주세요.`,
    };
  }

  if (requestHistory[ip].length >= MAX_REQUESTS_PER_MINUTE) {
    return {
      allowed: false,
      message: "⚠️ 1분당 허용 질문 횟수를 초과했습니다. 잠시 후 다시 질문해주세요.",
    };
  }

  requestHistory[ip].push(now);
  return { allowed: true };
}

// ─── 2. 포트폴리오 사전 검증 (Zero-Token Filtering) ────────────────────────
const ALLOWED_KEYWORDS = [
  "누구", "이름", "소개", "경력", "이력", "프로젝트", "기술", "스택", "스킬",
  "학력", "전공", "연락처", "이메일", "github", "깃허브", "포트폴리오", "역량",
  "경험", "작성자", "개발자", "어떤", "무슨", "소개해", "알려줘", "work", "project",
  "skill", "contact", "about", "who", "mom", "줄서잇", "쑥쑥", "didim", "장점", "강점",
];

function isPortfolioQuery(query: string): boolean {
  const normalized = query.toLowerCase().replace(/\s+/g, "");
  return ALLOWED_KEYWORDS.some((kw) => normalized.includes(kw));
}

// ─── 3. 초경량 컨텍스트 ──────────────────────────────────────────────────────
function buildCompactContext(): string {
  return projectData
    .map(
      (p) =>
        `[${p.title}] ${p.year} | 역할:${p.role} | 기술:${p.tech.join(",")} | 개요:${p.overview}`
    )
    .join("\n");
}

const COMPACT_CONTEXT = buildCompactContext();

const SYSTEM_INSTRUCTION = `당신은 K.HYUN 개발자의 포트폴리오 AI 비서입니다. 아래 데이터 기반으로 2~3문장으로 친절하고 간결하게 한국어로 답변하세요. 포트폴리오 관련 없는 내용은 거절하고 이메일(jklas187@naver.com) 문의를 안내하세요.

[개발자 정보]
이름: K.HYUN | 직무: Lead Frontend Developer & UI/UX Engineer | 이메일: jklas187@naver.com
주요기술: React, Next.js, TypeScript, Flutter, Vue.js, Three.js, React Native, Tailwind CSS

[대표 프로젝트]
${COMPACT_CONTEXT}`;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── 4. 검증된 모델 엔드포인트 ──────────────────────────────────────────────
const MODEL_FALLBACKS = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
];

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "❌ GEMINI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요." },
      { status: 500 }
    );
  }

  const clientIp = req.headers.get("x-forwarded-for") || "client-local";

  const rateLimitCheck = checkRateLimit(clientIp);
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { reply: rateLimitCheck.message, tokenSaved: true },
      { status: 200 }
    );
  }

  let message: string;
  try {
    const body = await req.json();
    message = body.message;
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "메시지를 입력해주세요." }, { status: 400 });
  }

  if (!isPortfolioQuery(message)) {
    return NextResponse.json({
      reply: "죄송합니다. 저는 K.HYUN의 포트폴리오, 경력, 프로젝트 관련 질문에만 답변할 수 있습니다. 자세한 문의는 jklas187@naver.com 으로 이메일 부탁드립니다! 😊",
      tokenSaved: true,
    });
  }

  let lastError: any = null;

  for (const modelName of MODEL_FALLBACKS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.3,
          },
        });

        const reply = result.response.text();
        return NextResponse.json({ reply, tokenSaved: false });

      } catch (err: any) {
        lastError = err;
        const errMsg: string = err?.message || String(err);
        const status: number = err?.status ?? 0;

        if (status === 429 || errMsg.includes("429") || errMsg.includes("QUOTA") || errMsg.includes("quota")) {
          if (attempt < 2) {
            await sleep(1500);
            continue;
          }
          break;
        }

        if (status === 404 || errMsg.includes("not found")) {
          break;
        }

        console.error(`Gemini Error [${modelName} attempt ${attempt}]:`, errMsg);
        return NextResponse.json({ error: `오류가 발생했습니다: ${errMsg}` }, { status: 500 });
      }
    }
  }

  console.error("All models rate limited:", lastError);
  return NextResponse.json(
    { reply: "⏳ 요청이 잠시 몰렸습니다. 3초 후 다시 질문해주세요!", tokenSaved: true },
    { status: 200 }
  );
}
