import { describe, expect, test } from "vitest";
import { theme, toggleTheme } from "./theme";

describe("theme store", () => {
	test("toggles between light and dark", () => {
		theme.set("light");
		toggleTheme();
		expect(theme.get()).toBe("dark");
		toggleTheme();
		expect(theme.get()).toBe("light");
	});
});
