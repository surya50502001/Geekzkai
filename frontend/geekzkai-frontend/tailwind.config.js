 
/** @type { import('tailwindcss').Config }*/
export default {
	darkMode: "class",
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				bg: "var(--bg-color)",
				text: "var(--text-color)",
				accent: "var(--accent-color)",
			},
		},
	},
	plugins: [],
}