export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        text: '#000000',
        brown: {
          light: '#CD853F',
          DEFAULT: '#A0522D',
          dark: '#8B4513'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite'
      }
    }
  },
  plugins: [],
  safelist: [
    'bg-brown',
    'bg-brown-light',
    'bg-brown-dark',
    'text-brown',
    'text-brown-light',
    'text-brown-dark',
    'border-brown',
    'ring-brown',
    'hover:bg-brown-dark',
    'focus:ring-brown'
  ]
}