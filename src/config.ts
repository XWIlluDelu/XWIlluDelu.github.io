import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

const seasonalThemes = {
	spring: {
		hue: 150,
		bannerSrc: "assets/images/spring-banner.jpg",
		bannerCredit: {
			enable: true,
			text: "こむぎこ2000 @komugiko_2000",
			url: "https://x.com/komugiko_2000",
		},
		avatarSrc: "assets/images/spring-avatar.jpg",
	},
	summer: {
		hue: 250,
		bannerSrc: "assets/images/summer-banner.jpg",
		bannerCredit: {
			enable: true,
			text: "萩森じあ @jirujiaru826",
			url: "https://x.com/jirujiaru826",
		},
		avatarSrc: "assets/images/summer-avatar.jpg",
	},
	autumn: {
		hue: 290,
		bannerSrc: "assets/images/autumn-banner.jpg",
		bannerCredit: {
			enable: true,
			text: "荻pote @ogipote",
			url: "https://x.com/ogipote",
		},
		avatarSrc: "assets/images/autumn-avatar.jpg",
	},
	winter: {
		hue: 20,
		bannerSrc: "assets/images/winter-banner.jpg",
		bannerCredit: {
			enable: true,
			text: "crisalys✨ @Criisalys",
			url: "https://x.com/criisalys",
		},
		avatarSrc: "assets/images/winter-avatar.jpg",
	},
} as const;

type Season = keyof typeof seasonalThemes;

function getCurrentSeason(): Season {
	const month = new Date().getMonth() + 1;
	if (month >= 3 && month <= 5) return "spring";
	if (month >= 6 && month <= 8) return "summer";
	if (month >= 9 && month <= 11) return "autumn";
	return "winter";
}

const activeSeasonTheme = seasonalThemes[getCurrentSeason()];

export const siteConfig: SiteConfig = {
	title: "虚妄IlluDelu",
	subtitle: "My Blog",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: activeSeasonTheme.hue, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: activeSeasonTheme.bannerSrc, // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "top", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: activeSeasonTheme.bannerCredit,
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
			name: "GitHub",
			url: "https://github.com/XWIlluDelu", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: activeSeasonTheme.avatarSrc, // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "虚妄IlluDelu",
	bio: "不实为虚，非分为妄。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // Visit https://icones.js.org/ for icon codes
			url: "https://github.com/XWIlluDelu",
		},
		{
			name: "BiliBili",
			icon: "fa6-solid:circle-play",
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

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
