export default {
    darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "background-primary": "var(--background-primary)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        "border-primary": "var(--border-primary)",
        "success": "var(--success)",
        "error": "var(--error)",
        "accent": "var(--accent)",
        "accent-light": "var(--accent-light)",
        "background-color": "var(--background-color)",
      },
    },
  },
  plugins: [],
};