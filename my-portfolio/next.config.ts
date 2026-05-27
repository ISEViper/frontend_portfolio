import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // COOP + COEP: SharedArrayBuffer / WASM Web Worker (.spz gzip 해제에 필요)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
  // Turbopack 명시 (Next.js 16 기본 번들러 - webpack 설정 불필요)
  turbopack: {},
};

export default nextConfig;
