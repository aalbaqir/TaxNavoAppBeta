/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            DEFAULT: '#0076c0', // TurboTax teal
            dark: '#005fa3',
            light: '#e6f2fa',
          },
          blue: {
            DEFAULT: '#25324B', // Darker, more grey-toned blue
            dark: '#1a2233',
            light: '#e6f2fa',
          },
          green: {
            DEFAULT: '#1db954',
            dark: '#168f3e',
            light: '#a7f5c6',
          },
          black: '#171717',
          white: '#ffffff',
          inputText: '#22292f', // Add a dark color for input text
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(0,0,0,0.10)',
        button: '0 2px 8px 0 rgba(0,118,192,0.12)',
        input: '0 1px 4px 0 rgba(0,0,0,0.06)',
        md: '0 4px 12px 0 rgba(0,0,0,0.08)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1.25rem',
        full: '9999px',
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #0076c0 0%, #e6f2fa 100%)',
        'blue-gradient': 'linear-gradient(135deg, #0074cc 0%, #e6f2fa 100%)',
        'green-gradient': 'linear-gradient(135deg, #1db954 0%, #a7f5c6 100%)',
        'green-white': 'linear-gradient(135deg, #1db954 0%, #ffffff 100%)',
      },
      spacing: {
        'section': '3.5rem',
        'form': '2.5rem',
      },
    },
  },
  plugins: [],
};
