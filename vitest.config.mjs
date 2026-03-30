import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.{js,mjs}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'process/**/*.js',
        'src/config/utils.js',
        'src/lib/utils.js',
        'scripts/**/*.mjs',
      ],
    },
  },
})
