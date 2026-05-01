/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--color-primary))",
        accent: "hsl(var(--color-accent))",
        bg: "hsl(var(--color-bg))",
        card: "hsl(var(--color-card))",
        muted: "hsl(var(--color-muted))"
      }
    }
  },
  plugins: []
};
