// eslint.config.js

import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1. 기본 설정 (모든 파일에 적용)
  {
    ignores: ['node_modules', 'dist'], // 검사에서 제외할 폴더
  },
  // 2. 언어 및 환경 설정
  {
    languageOptions: {
      globals: {
        ...globals.browser, // 브라우저 전역 변수 (window 등)
        ...globals.node, // Node.js 전역 변수 (process 등)
      },
    },
  },
  // 3. 타입스크립트, 리액트, Prettier 규칙 적용
  ...tseslint.configs.recommended, // 타입스크립트 추천 규칙
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+ JSX 변환 대응
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'typescript-eslint/no-unused-vars': 'warn', // 사용하지 않는 변수 경고
      'typescript-eslint/no-require-imports': 'off', // require 사용 금지
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 경고
    },
    settings: {
      react: {
        version: 'detect', // 설치된 리액트 버전을 자동으로 감지
      },
    },
  },
  prettierConfig, // Prettier 규칙 (반드시 가장 마지막에 와야 함)
];
