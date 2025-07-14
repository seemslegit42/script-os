// @ts-check

import next from 'eslint-config-next';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...next.configs.recommended,
  ...next.configs['core-web-vitals'],
];
