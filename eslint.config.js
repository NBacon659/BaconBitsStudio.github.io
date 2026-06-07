// Flat ESLint config. Lints .astro / .ts / .js for correctness and reinforces
// the separation-of-concerns rules (eslint-plugin-astro recommended set).
import eslintPluginAstro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: ["dist/", ".astro/", "node_modules/"] },
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    // Parse the TypeScript frontmatter of .astro files with the TS parser.
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { parser: tsParser },
    },
  },
];
