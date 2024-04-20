/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        react: "url('/assets/react.svg')",
        vite: "url('/vite.svg')",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
    fontFamily: {
      sans: ['"Inter var", sans-serif'],
    },
    container: {
      center: true,
    },
  },
  plugins: [],
};
