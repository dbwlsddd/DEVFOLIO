// [업로드된 파일: dbwlsddd/devfolio/DEVFOLIO-dbb00499082e35b2b5d54ff0d97aa50d78692051/vite.config.ts]
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    // Spring Boot 서버 주소 (8080)로 프록시 설정
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Spring Boot 서버 주소로 변경
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      // index.html 접근 허용을 위해 "." 추가
      allow: [".", "./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));