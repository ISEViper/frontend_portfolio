"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bot, MessageCircle, X, Send } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const INITIAL_WELCOME_TEXT = `안녕하세요! 👋 K.HYUN 개발자의 포트폴리오 AI 안내원입니다.

💡 **질문 가능한 내용**:
• 대표 프로젝트 (MoM, 줄서잇, 쑥쑥, DIDIM 등)
• 주요 기술 스택 & 역량 (React, Next.js, Flutter, Three.js 등)
• 개발자 경력, 역할 및 이메일 연락처

🛑 **답변 제한 안내**:
• 포트폴리오와 무관한 질문(일반 상식, 코딩 풀이, 사적인 질문 등)은 토큰 보호를 위해 자동 거절됩니다.`;

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: INITIAL_WELCOME_TEXT },
  ]);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // theme detection
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme !== "light");
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const query = customMsg || input;
    if (!query.trim() || loading || cooldown > 0) return;

    const userMsg = query.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);
    setCooldown(3); // 3초 쿨다운
    setShowGreeting(false);
    if (!isOpen) setIsOpen(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.ok ? data.reply : data.error || "오류가 발생했습니다." },
      ]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "서버와 통신할 수 없습니다." }]);
    } finally {
      setLoading(false);
    }
  };

  // 커스텀 커서와의 자연스러운 마우스 인터랙션 처리 (마우스 호버 시 렌더링 전환)
  const handleMouseEnterWidget = () => {
    document.body.classList.add("chat-widget-hovered");
  };

  const handleMouseLeaveWidget = () => {
    document.body.classList.remove("chat-widget-hovered");
  };

  // 대화 중인지 여부 (초기 메시지 외에 유저 메시지가 있거나 대화 내역이 확장된 경우)
  const hasActiveConversation = messages.length > 1;

  // Colors based on theme
  const colors = {
    btnBg: isDark ? "#e6f0ff" : "#0f172a",
    btnIcon: isDark ? "#0f172a" : "#ffffff",
    chatBg: isDark ? "#0d1117" : "#ffffff",
    headerBg: isDark ? "#1e293b" : "#0f172a",
    headerText: "#ffffff",
    msgUserBg: isDark ? "#e6f0ff" : "#0f172a",
    msgUserText: isDark ? "#0f172a" : "#ffffff",
    msgAiBg: isDark ? "#1e293b" : "#f1f5f9",
    msgAiText: isDark ? "#e6f0ff" : "#0f172a",
    msgAiBorder: isDark ? "#334155" : "#e2e8f0",
    inputBg: isDark ? "#1e293b" : "#f1f5f9",
    inputText: isDark ? "#e6f0ff" : "#0f172a",
    inputBorder: isDark ? "#334155" : "#cbd5e1",
    chipBg: isDark ? "#1e293b" : "#ffffff",
    chipText: isDark ? "#e6f0ff" : "#0f172a",
    chipBorder: isDark ? "#334155" : "#cbd5e1",
    bubbleBg: isDark ? "#1e293b" : "#ffffff",
    bubbleText: isDark ? "#e6f0ff" : "#0f172a",
    bubbleSubText: isDark ? "#8a9bb2" : "#64748b",
    bubbleBorder: isDark ? "#334155" : "#e2e8f0",
    tailBg: isDark ? "#1e293b" : "#ffffff",
    tailBorder: isDark ? "#334155" : "#e2e8f0",
    dividerBg: isDark ? "#1e293b" : "#f8fafc",
    dividerBorder: isDark ? "#334155" : "#e2e8f0",
  };

  const wrapperStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 2147483647,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 0,
    pointerEvents: "none",
  };

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={handleMouseEnterWidget}
      onMouseLeave={handleMouseLeaveWidget}
    >
      {/* 글로벌 커서 스타일 오버라이드 (챗봇 위젯 호버 시 커스텀 커서 숨기고 네이티브 커서로 전환) */}
      <style>{`
        body.chat-widget-hovered {
          cursor: auto !important;
        }
        body.chat-widget-hovered .custom-cursor {
          opacity: 0 !important;
          visibility: hidden !important;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse-red {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.8; }
        }
      `}</style>

      {/* ── 1. 챗봇 창 ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            marginBottom: "16px",
            width: "370px",
            maxWidth: "calc(100vw - 48px)",
            height: "540px",
            maxHeight: "80vh",
            background: colors.chatBg,
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            pointerEvents: "auto",
            border: `1px solid ${colors.msgAiBorder}`,
            cursor: "default",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: colors.headerBg,
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Bot size={18} color="#ffffff" />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px", lineHeight: 1.3 }}>
                  포트폴리오 안내원
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "2px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#4ade80",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  보통 1분 내 응답
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                padding: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: colors.chatBg,
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {msg.sender === "ai" && (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: colors.headerBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <Bot size={15} color="#94a3b8" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    background: msg.sender === "user" ? colors.msgUserBg : colors.msgAiBg,
                    color: msg.sender === "user" ? colors.msgUserText : colors.msgAiText,
                    border: msg.sender === "ai" ? `1px solid ${colors.msgAiBorder}` : "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: colors.headerBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={15} color="#94a3b8" />
                </div>
                <div
                  style={{
                    background: colors.msgAiBg,
                    border: `1px solid ${colors.msgAiBorder}`,
                    padding: "12px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                  }}
                >
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        background: colors.msgAiText,
                        borderRadius: "50%",
                        opacity: 0.5,
                        animation: "bounce 1s infinite",
                        animationDelay: `${delay}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              background: colors.dividerBg,
              borderTop: `1px solid ${colors.dividerBorder}`,
              padding: "12px",
              flexShrink: 0,
            }}
          >
            <form
              onSubmit={handleSend}
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={cooldown > 0 ? `⏳ ${cooldown}초 후 다음 질문 가능` : "문의하실 내용을 남겨주세요."}
                disabled={loading || cooldown > 0}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  fontSize: "13px",
                  background: colors.inputBg,
                  color: colors.inputText,
                  border: `1px solid ${colors.inputBorder}`,
                  borderRadius: "12px",
                  outline: "none",
                  fontFamily: "inherit",
                  opacity: cooldown > 0 ? 0.6 : 1,
                  cursor: cooldown > 0 ? "not-allowed" : "text",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || cooldown > 0}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: colors.btnBg,
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: loading || !input.trim() || cooldown > 0 ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  opacity: loading || !input.trim() || cooldown > 0 ? 0.4 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <Send size={16} color={colors.btnIcon} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. 환영 말풍선 & 추천 칩 ────────────────────────────────────────── */}
      {!isOpen && showGreeting && (
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            pointerEvents: "auto",
          }}
        >
          {/* 추천 질문 칩 */}
          {[
            { icon: "🚀", label: "대표 프로젝트 소개해줘" },
            { icon: "💡", label: "주요 기술 스택이 뭐야?" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => handleSend(undefined, label)}
              style={{
                padding: "8px 16px",
                background: colors.chipBg,
                color: colors.chipText,
                border: `1px solid ${colors.chipBorder}`,
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
              }}
            >
              {icon} {label}
            </button>
          ))}

          {/* 말풍선 */}
          <div
            style={{
              position: "relative",
              background: colors.bubbleBg,
              border: `1px solid ${colors.bubbleBorder}`,
              borderRadius: "16px",
              padding: "14px 16px",
              width: "230px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              cursor: "pointer",
            }}
            onClick={() => {
              setIsOpen(true);
              setShowGreeting(false);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGreeting(false);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: colors.bubbleSubText,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} />
            </button>
            <p
              style={{
                color: colors.bubbleText,
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: 1.4,
                margin: "0 0 6px 0",
                paddingRight: "20px",
              }}
            >
              궁금한 건 채팅으로 문의하세요
            </p>
            <p
              style={{
                color: colors.bubbleSubText,
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                margin: 0,
              }}
            >
              <Bot size={13} color={colors.bubbleSubText} />
              프로젝트 & 기술 스택 문의하기
            </p>
            {/* 꼬리 */}
            <div
              style={{
                position: "absolute",
                bottom: "-7px",
                right: "28px",
                width: "14px",
                height: "14px",
                background: colors.tailBg,
                borderBottom: `1px solid ${colors.tailBorder}`,
                borderRight: `1px solid ${colors.tailBorder}`,
                transform: "rotate(45deg)",
              }}
            />
          </div>
        </div>
      )}

      {/* ── 3. 플로팅 버튼 (빨간색 대화 알림 뱃지 포함) ───────────────────── */}
      <button
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) setShowGreeting(false);
        }}
        aria-label="채팅 열기"
        style={{
          position: "relative",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: colors.btnBg,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
          pointerEvents: "auto",
          flexShrink: 0,
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.35)";
        }}
      >
        {/* 대화 진행 중(un-opened) 시 빨간 점 표시 */}
        {!isOpen && hasActiveConversation && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: "13px",
              height: "13px",
              backgroundColor: "#ef4444",
              borderRadius: "50%",
              border: `2px solid ${colors.btnBg}`,
              boxShadow: "0 0 8px rgba(239, 68, 68, 0.9)",
              animation: "pulse-red 2s infinite",
            }}
          />
        )}

        {isOpen ? (
          <X size={24} color={colors.btnIcon} />
        ) : (
          <MessageCircle size={24} color={colors.btnIcon} fill={colors.btnIcon} />
        )}
      </button>
    </div>
  );
}

export default function AiChatButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<ChatWidget />, document.body);
}
