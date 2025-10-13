module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y"],
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier", // keep prettier last to avoid conflicts
    ],
    rules: {
      "react/react-in-jsx-scope": "off", // not needed with React 17+, using react 19 in this project
      "react/prop-types": "off", // using TypeScript for props
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  