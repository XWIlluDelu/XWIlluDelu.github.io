import type { LIGHT_DARK_MODE } from "@/types/config";
import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback);
}

// Customize
// export function getHue(): number {
// 	const stored = localStorage.getItem("hue");
// 	return stored ? Number.parseInt(stored) : getDefaultHue();
// }

// Customize
// I WANT TO USE THE DEFAULT HUE IN THE CONFIG CARRIER
export function getHue(): number {
	return getDefaultHue();
}

// Customize
// export function setHue(hue: number): void {
// 	localStorage.setItem("hue", String(hue));
// 	const r = document.querySelector(":root") as HTMLElement;
// 	if (!r) {
// 		return;
// 	}
// 	r.style.setProperty("--hue", String(hue));
// }

// Customize
// I DON'T WANT TO STORE HUE IN LOCAL STORAGE ANYMORE
export function setHue(hue: number): void {
	// localStorage.setItem("hue", String(hue)); // No longer store hue in localStorage
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) return;
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
