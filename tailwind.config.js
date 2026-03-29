/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9fb',
          100: '#def0f6',
          200: '#b6def0',
          300: '#8ecce9',
          400: '#66bae2',
          500: '#63c5df', // Main primary color
          600: '#4aa0b8',
          700: '#357d91',
          800: '#235a6b',
          900: '#153a47',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#059669', // Main secondary color
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
        },
        accent: {
          500: '#F97316', // Accent color
        },
      },
      spacing: {
        '128': '32rem',
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg')",
        'andaman-beach': "url('https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg')",
        'andaman-water': "url('https://images.pexels.com/photos/5528991/pexels-photo-5528991.jpeg')",
      },
    },
  },
  plugins: [],
};