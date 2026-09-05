export const ADMONITION_TYPES = ["note", "tip", "important", "warning", "caution"] as const;

export type AdmonitionType = (typeof ADMONITION_TYPES)[number];

export function isAdmonitionType(name: string): name is AdmonitionType {
  return (ADMONITION_TYPES as readonly string[]).includes(name.toLowerCase());
}

export function admonitionTitle(type: AdmonitionType | string, label?: string): string {
  const trimmed = label?.trim();
  if (trimmed) return trimmed;
  return type.toUpperCase();
}

export interface GithubRepo {
	owner: string;
	name: string;
}

const GITHUB_DIRECTIVE_RE = /::github\{repo="([^"]+)"\}/g;

export function extractGithubRepos(markdown: string): string[] {
	const repos: string[] = [];
	for (const match of markdown.matchAll(GITHUB_DIRECTIVE_RE)) {
		if (parseGithubRepo(match[1]) && !repos.includes(match[1].trim())) {
			repos.push(match[1].trim());
		}
	}
	return repos;
}

export function parseGithubRepo(repo: string): GithubRepo | null {
	const match = /^([^/\s]+)\/([^/\s]+)$/.exec(repo.trim());
	if (!match) return null;
	return { owner: match[1], name: match[2] };
}

export function compactNumber(value: number): string {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}
