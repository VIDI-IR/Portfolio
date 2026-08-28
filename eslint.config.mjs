import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored agent tooling, not application code — linting it produced 16
    // errors from scripts this project neither ships nor maintains.
    ".claude/**",
    // Image masters, kept out of public/ so they are never served or deployed.
    "design/**",
  ]),
]);

export default eslintConfig;
