import js from "@eslint/js";
export default [
  js.configs.recommended,
  {
    languageOptions: { globals: { process: "readonly", describe: "readonly", it: "readonly", expect: "readonly", beforeEach: "readonly" } },
    rules: { "no-unused-vars": "error", "no-console": "warn" }
  }
];
