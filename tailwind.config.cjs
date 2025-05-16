/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
	darkMode: "class", // allows toggling dark mode manually
	theme: {
		extend: {
			fontFamily: {
				// Customize
				// sans: ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
				sans: [
					"NotoSansMono",
					"NotoSansSC",
					// "NotoColorEmoji",
					...defaultTheme.fontFamily.sans,
				],
				// sans: [defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
