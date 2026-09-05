import { describe, expect, test } from "vitest";
import { formatDateToYYYYMMDD } from "./dates";
import { t } from "./i18n";

describe("formatDateToYYYYMMDD", () => {
	test("formats in UTC as YYYY-MM-DD", () => {
		expect(formatDateToYYYYMMDD(new Date("2024-05-01T15:00:00Z"))).toBe(
			"2024-05-01",
		);
	});
});

describe("i18n", () => {
	test("resolves the bundled English strings", () => {
		expect(t("home")).toBe("Home");
		expect(t("search")).toBe("Search");
	});
});
