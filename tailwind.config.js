/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta oficial da escola / PEI: azul escuro, azul claro, verde e amarelo.
        navy: {
          DEFAULT: '#0a3d78',
          deep: '#062a54',
          light: '#155a9e',
        },
        sky: {
          DEFAULT: '#2f9bd6',
          light: '#6ec4ee',
          dark: '#1f78ab',
        },
        green: {
          DEFAULT: '#3fa54a',
          light: '#63c46e',
          dark: '#2c7d35',
        },
        yellow: {
          DEFAULT: '#f4b400',
          light: '#ffcc33',
          dark: '#c98f00',
        },
        cream: '#f6f8f6',
        sand: '#eaf0ec',
        ink: '#182124',
        // Aliases usados no painel admin — mesma paleta, nomes antigos mantidos por conveniência.
        brand: {
          DEFAULT: '#0a3d78',
          dark: '#062a54',
          light: '#155a9e',
        },
        accent: {
          DEFAULT: '#f4b400',
          green: '#3fa54a',
        },
        bg: '#f6f8f6',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'serif'],
        body: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(28,23,18,0.08), 0 1px 2px rgba(28,23,18,0.04)',
        'card-lg': '0 20px 48px rgba(13,43,69,0.18), 0 6px 16px rgba(13,43,69,0.1)',
        modal: '0 32px 80px rgba(13,43,69,0.28), 0 10px 24px rgba(13,43,69,0.14)',
        pop: '6px 6px 0 rgba(244,180,0,0.4)',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        slideDown: {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        drawLine: {
          from: { strokeDashoffset: '240' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.6s ease both',
        'slide-up': 'slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both',
        'slide-down': 'slideDown 0.22s ease both',
        'scale-in': 'scaleIn 0.28s ease both',
        shimmer: 'shimmer 1.6s infinite linear',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
