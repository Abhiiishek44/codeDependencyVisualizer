import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/renderer/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
