module.exports = {
    extends: ["airbnb-base", "prettier", "plugin:flowtype/recommended", "react-app"],
    plugins: ["react", "flowtype", "prettier"],
    rules: {
        "prettier/prettier": ["error", {
            "singleQuote": true,
            "bracketSpacing": true,
            "jsxBracketSameLine": true,
            "parser": "flow"
        }],
        "comma-dangle": 0,
        "jsx-a11y/href-no-hash": "off",
        "no-console": [
            "error",
            {
                allow: ["warn", "error"]
            }
        ],
        "no-underscore-dangle": 1
    },
    parserOptions: {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
};
