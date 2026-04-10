import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@/types": path.resolve(__dirname, "./src/domain/shared/types"),
      "@/lib": path.resolve(__dirname, "./src/domain/shared"),
      "@/data": path.resolve(__dirname, "./src/domain/reat/data"),
      "@/services/file-service": path.resolve(__dirname, "./src/infrastructure/persistence/file-service"),
      "@/services/remotion-builder": path.resolve(__dirname, "./src/infrastructure/rendering/remotion-builder"),
      "@/services": path.resolve(__dirname, "./src/domain/reat/service"),
      "@/components": path.resolve(__dirname, "./src/presentation/components"),
      "@/stores": path.resolve(__dirname, "./src/presentation/stores"),
      "@/hooks": path.resolve(__dirname, "./src/presentation/hooks"),
      "@/infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@/domain": path.resolve(__dirname, "./src/domain"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
