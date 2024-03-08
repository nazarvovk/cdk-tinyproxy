module.exports = {
  extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
  plugins: ['prettier', 'import'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
        printWidth: 100,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        trailingComma: 'all',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    'no-debugger': 'error',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unreachable': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
