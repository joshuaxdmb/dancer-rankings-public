import type { Config } from 'tailwindcss'

const config: Config = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-gradient-to-b',
    'from-purple-900',
    'via-black',
    'from-red-950',
    'from-blue-900',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'spotify-green': '#1db954',
        'primary-purple':'#8250e6'
      }
    },
  },
  plugins: [
    require(
      "tailwind-scrollbar-hide"
    )
  ],
}
export default config
