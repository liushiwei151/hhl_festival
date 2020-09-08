module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    //是否使用分号
    semi: ["error", "always"],
    //是否使用双引号
    quotes: [1, "double"],
    //不检测函数前是否有空客
    "space-before-function-paren": 0,
    //允许使用this的别名，如self等
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/no-var-requires": 0
  }
};
