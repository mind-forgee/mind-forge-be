// eslint.config.js
import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", "dist/**"], // optional: adjust for your project
  },
  ...tseslint.configs.recommended, // includes parser + TS recommended rules
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
];
