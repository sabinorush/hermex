export const baseConfig = [
  {
    ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/coverage/**'],
  },
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
];

export default baseConfig;
