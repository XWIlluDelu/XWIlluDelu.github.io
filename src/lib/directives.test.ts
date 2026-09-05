import { describe, expect, test } from "vitest";
import {
	admonitionTitle,
	isAdmonitionType,
	parseGithubRepo,
} from "./directives";

describe("isAdmonitionType", () => {
	test("accepts the five supported types case-insensitively", () => {
		for (const name of ["note", "TIP", "Important", "warning", "Caution"]) {
			expect(isAdmonitionType(name)).toBe(true);
		}
	});

	test("rejects anything else", () => {
		expect(isAdmonitionType("github")).toBe(false);
		expect(isAdmonitionType("")).toBe(false);
	});
});

describe("admonitionTitle", () => {
	test("upper-cases the type when no custom label is given", () => {
		expect(admonitionTitle("tip")).toBe("TIP");
	});

	test("prefers an explicit label", () => {
		expect(admonitionTitle("note", "My title")).toBe("My title");
	});
});

describe("parseGithubRepo", () => {
	test("splits owner and name", () => {
		expect(parseGithubRepo("saicaca/fuwari")).toEqual({
			owner: "saicaca",
			name: "fuwari",
		});
	});

	test("rejects malformed values", () => {
		expect(parseGithubRepo("no-slash")).toBeNull();
		expect(parseGithubRepo("/empty-owner")).toBeNull();
		expect(parseGithubRepo("a/b/c")).toBeNull();
		expect(parseGithubRepo("")).toBeNull();
	});
});
