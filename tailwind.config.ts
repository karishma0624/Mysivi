import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B1020',
        body: '#5B6478',
        lavender: {
          50: '#FAF9FF',
          100: '#F6F4FF',
          200: '#ECE9F8',
          300: '#DDD8F5',
        },
        brand: {
          blue: '#2F5BFF',
          purple: '#7B4DFF',
          violet: '#6D4AFF',
          success: '#12A36B',
        },
        pastel: {
          indigo: '#EEF0FF',
          pink: '#FFEDEF',
          amber: '#FFF4E0',
          mint: '#E6F8EE',
          sky: '#E8F3FF',
          orange: '#FFF0E6',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
        indic: ['"Noto Sans"', 'sans-serif'],
      },
      borderRadius: {
        '20': '20px',
        '14': '14px',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(109, 74, 255, 0.08)',
        glow: '0 8px 25px -5px rgba(47, 91, 255, 0.32)',
        'glow-violet': '0 8px 25px -5px rgba(109, 74, 255, 0.32)',
        card: '0 2px 12px rgba(11, 16, 32, 0.04), 0 1px 3px rgba(11, 16, 32, 0.02)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2F5BFF 0%, #7B4DFF 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #254DE6 0%, #6D3FE6 100%)',
        'glow-radial': 'radial-gradient(circle, rgba(123, 77, 255, 0.12) 0%, rgba(246, 244, 255, 0) 70%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        wave: 'wave 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
