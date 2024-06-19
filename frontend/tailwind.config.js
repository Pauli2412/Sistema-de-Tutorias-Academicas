/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      colors: {
        'dark-mode-container': '#121317',
        'dark-mode-background' : '#1a1c23',
        'white-mode-container' : '#fff',
        'white-mode-background' : '#f6f6f6',
        'white-mode-navbar' : '#fff',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
