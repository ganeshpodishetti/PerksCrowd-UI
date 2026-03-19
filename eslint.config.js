const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      "react/display-name": "warn",
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "react-hooks/exhaustive-deps": "error"
    },
  },
  {
    files: ['app/**/*.{js,jsx,ts,tsx}', 'src/**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**',
      'src/setupTests.ts',
      'src/shared/utils/runtimeSafety.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Program:has(ExpressionStatement > Literal[value='use client']) CallExpression[callee.object.name='console']",
          message:
            'Avoid console.* in browser runtime paths. Use browserConsole.* for production-safe behavior.',
        },
        {
          selector:
            "Program:has(ExpressionStatement > Literal[value='use client']) ThrowStatement",
          message:
            'Avoid throw in browser-facing runtime paths. Use Promise.reject(...) or ensureClientContext(...) for production-safe behavior.',
        },
      ],
    },
  },
];
