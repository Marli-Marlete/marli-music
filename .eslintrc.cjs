module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: "eslint:recommended",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["sort-keys-fix"],
    rules: {
        "sort-keys-fix/sort-keys-fix": "warn",
    },
};
