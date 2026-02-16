import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        najdi: {
          'palm':        '#2F4F3A',
          'palm-dark':   '#243D2D',
          'coffee':      '#5A3E2B',
          'coffee-dark': '#4A3222',
          'clay':        '#B87444',
          'clay-dark':   '#9E6339',
          'clay-light':  '#D4915E',
          'sand':        '#F4E6D3',
          'sand-dark':   '#E8D5BC',
          'cream':       '#FFF9F0',
          'border':      '#E6D3BD',
          'text':        '#2A1F17',
          'muted':       '#7A6A58',
          'muted-light': '#9E8E7A',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      boxShadow: {
        'desert':    '0 2px 8px 0 rgba(90, 62, 43, 0.08), 0 1px 4px 0 rgba(90, 62, 43, 0.06)',
        'desert-md': '0 4px 16px 0 rgba(90, 62, 43, 0.10), 0 2px 8px 0 rgba(90, 62, 43, 0.07)',
        'desert-lg': '0 8px 32px 0 rgba(90, 62, 43, 0.12), 0 4px 16px 0 rgba(90, 62, 43, 0.08)',
        'desert-xl': '0 16px 48px 0 rgba(90, 62, 43, 0.14), 0 8px 24px 0 rgba(90, 62, 43, 0.10)',
        'sunlight':  '0 4px 20px 0 rgba(184, 116, 68, 0.15), 0 2px 8px 0 rgba(184, 116, 68, 0.10)',
      },
    },
  },
  plugins: [],
}
export default config
