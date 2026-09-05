import { describe, expect, test } from "vitest";
import {
	admonitionTitle,
	compactNumber,
	extractGithubRepos,
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

describe("extractGithubRepos", () => {
	test("collects unique owner/name pairs in order", () => {
		const md = [
			'::github{repo="a/one"}',
			"",
			'::github{repo="b/two"}',
			'::github{repo="a/one"}',
			'::github{repo="bad value"}',
		].join("\n");
		expect(extractGithubRepos(md)).toEqual(["a/one", "b/two"]);
	});

	test("returns empty when nothing matches", () => {
		expect(extractGithubRepos("# Hello\n\nplain text")).toEqual([]);
	});
});

describe("compactNumber", () => {
	test("compacts thousands", () => {
		expect(compactNumber(104)).toBe("104");
		expect(compactNumber(5200)).toBe("5.2K");
	});
});
