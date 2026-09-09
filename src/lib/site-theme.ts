import { getEntry } from "astro:content";
import { getSeason } from "./seasons";

const buildSeason = getSeason();

export async function getSiteTheme() {
	const site = await getEntry("site", "config");
	if (!site) throw new Error("Site config not found");
	const selected = site.data.seasonalThemes?.[buildSeason];
	return {
		season: selected ? buildSeason : undefined,
		hue: selected?.hue,
		banner: selected?.banner ?? site.data.banner,
	};
}
