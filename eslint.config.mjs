// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**', 'lib/**'],
  },
  eslint.configs.recommended,
  // Gunakan recommended biasa, bukan recommendedTypeChecked untuk performa lebih baik
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      // Hapus parserOptions untuk menghindari type-checking yang lambat
      // Uncomment jika Anda benar-benar membutuhkan type-checked rules
      // parserOptions: {
      //   project: './tsconfig.json',
      //   tsconfigRootDir: import.meta.dirname,
      // },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off', // Changed to 'off' karena butuh type-checking
      '@typescript-eslint/no-unsafe-argument': 'off', // Changed to 'off' karena butuh type-checking
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
);
