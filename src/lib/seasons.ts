export type Season = "spring" | "summer" | "autumn" | "winter";

/** Match the original Northern Hemisphere calendar, using the build machine's date. */
export function getSeason(date = new Date()): Season {
	const month = date.getMonth() + 1;
	if (month >= 3 && month <= 5) return "spring";
	if (month >= 6 && month <= 8) return "summer";
	if (month >= 9 && month <= 11) return "autumn";
	return "winter";
}
