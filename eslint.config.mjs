import js from "@eslint/js";
export default [
  js.configs.recommended,
  {
    languageOptions: { 
      globals: { 
        process: "readonly", describe: "readonly", it: "readonly", expect: "readonly", beforeEach: "readonly",
        require: "readonly", module: "readonly", console: "readonly"
      } 
    },
    rules: { "no-unused-vars": "error", "no-console": "error" }
  }
];
