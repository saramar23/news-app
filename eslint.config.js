import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
    { ignores: ["dist", "node_modules"] },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    jsxA11y.flatConfigs.recommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    reactHooks.configs["recommended-latest"],
    reactRefresh.configs.vite,
    {
        languageOptions: {
            globals: globals.browser,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/prop-types": "off",
        },
    },
    eslintConfigPrettier,
);
