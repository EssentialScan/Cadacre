import { defineConfig, globalIgnores } from "eslint/config";
import nextTs from "eslint-config-next/typescript.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...nextTs,
  ...compat.extends("next/core-web-vitals"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Standalone Node CLI scripts (run via `node scripts/*.js`, not part of
    // the Next.js app) — plain CommonJS, not subject to the app's lint rules.
    "scripts/**",
  ]),
]);

export default eslintConfig;
