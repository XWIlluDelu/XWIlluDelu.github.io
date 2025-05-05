const themePreset = {
	spring: {
		hue: 150,
		bannersrc: "assets/images/spring-banner.jpg",
		bannercredit: {
			enable: true,
			text: "こむぎこ2000 @komugiko_2000",
			url: "https://x.com/komugiko_2000",
		},
		avatarsrc: "assets/images/spring-avatar.jpg",
	},

	summer: {
		hue: 250,
		bannersrc: "assets/images/summer-banner.jpg",
		bannercredit: {
			enable: true,
			text: "萩森じあ @jirujiaru826",
			url: "https://x.com/jirujiaru826",
		},
		avatarsrc: "assets/images/summer-avatar.jpg",
	},

	autumn: {
		hue: 290,
		bannersrc: "assets/images/autumn-banner.jpg",
		bannercredit: {
			enable: true,
			text: "荻pote @ogipote",
			url: "https://x.com/ogipote",
		},
		avatarsrc: "assets/images/autumn-avatar.jpg",
	},

	winter: {
		hue: 20,
		bannersrc: "assets/images/winter-banner.jpg",
		bannercredit: {
			enable: true,
			text: "crisalys✨ @Criisalys",
			url: "https://x.com/criisalys",
		},
		avatarsrc: "assets/images/winter-avatar.jpg",
	},
};

const getSeason = () => {
	const month = new Date().getMonth() + 1;
	if (month >= 3 && month <= 5) return "spring";
	if (month >= 6 && month <= 8) return "summer";
	if (month >= 9 && month <= 11) return "autumn";
	return "winter";
};

const activeTheme = getSeason();
// const activeTheme = "winter"; // Set the theme manually
const activeThemeConfig = themePreset[activeTheme];

import type {
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "虚妄IlluDelu",
	subtitle: "My Blog",
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: activeThemeConfig.hue, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		// hue: 160, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: activeThemeConfig.bannersrc, // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "top", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: activeThemeConfig.bannercredit, // Credit text for the banner image
		// src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		// position: "top", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		// credit: {
		// 	enable: true, // Display the credit text of the banner image
		// 	text: "Komugiko2000", // Credit text to be displayed
		// 	url: "https://x.com/komugiko_2000/status/1627813411257192449", // (Optional) URL link to the original artwork or artist's page
		// },
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "Fuwari",
			url: "https://github.com/saicaca/fuwari", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: activeThemeConfig.avatarsrc, // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	// avatar: "assets/images/demo-avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "虚妄IlluDelu",
	bio: "不实为虚，非分为妄。",
	links: [
		// {
		// 	name: "Twitter",
		// 	icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
		// 	// You will need to install the corresponding icon set if it's not already included
		// 	// `pnpm add @iconify-json/<icon-set-name>`
		// 	url: "https://twitter.com",
		// },
		// {
		// 	name: "Steam",
		// 	icon: "fa6-brands:steam",
		// 	url: "https://store.steampowered.com",
		// },
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/XWIlluDelu",
		},
		{
			name: "BiliBili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/137874",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://steamcommunity.com/profiles/76561199133976817",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
