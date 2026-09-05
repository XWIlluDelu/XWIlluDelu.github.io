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

export function parseGithubRepo(repo: string): GithubRepo | null {
  const match = /^([^/\s]+)\/([^/\s]+)$/.exec(repo.trim());
  if (!match) return null;
  return { owner: match[1], name: match[2] };
}
