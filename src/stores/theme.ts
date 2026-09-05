import { atom } from "nanostores";

export type Theme = "light" | "dark";

export const theme = atom<Theme>("light");

export function toggleTheme(): void {
	theme.set(theme.get() === "dark" ? "light" : "dark");
}

let initialized = false;

export function initTheme(): void {
	if (initialized) return;
	initialized = true;
	theme.subscribe((value) => {
		document.documentElement.dataset.theme = value;
		try {
			localStorage.setItem("huwari-theme", value);
		} catch {
			/* private mode */
		}
	});
	document.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) return;
		if (!event.target.closest("#theme-toggle")) return;
		toggleTheme();
	});
}
