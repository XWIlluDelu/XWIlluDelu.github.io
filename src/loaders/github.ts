import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Loader } from "astro/loaders";
import { extractGithubRepos } from "@/lib/directives";

export const GITHUB_CACHE_PATH = "./node_modules/.cache/huwari/github.json";

function collectMarkdownFiles(dir: string): string[] {
	let out: string[] = [];
	let entries: string[] = [];
	try {
		entries = readdirSync(dir);
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) out = out.concat(collectMarkdownFiles(full));
		else if (/\.mdx?$/.test(entry)) out.push(full);
	}
	return out;
}

interface RepoInfo {
	repo: string;
	owner: string;
	name: string;
	description: string;
	stars: number;
	forks: number;
	license: string;
	language: string;
	avatar: string;
	ok: boolean;
}

async function fetchRepo(repo: string): Promise<RepoInfo> {
	const [owner, name] = repo.split("/");
	const fallback: RepoInfo = {
		repo,
		owner,
		name,
		description: "",
		stars: 0,
		forks: 0,
		license: "",
		language: "",
		avatar: `https://github.com/${owner}.png`,
		ok: false,
	};
	try {
		const headers: Record<string, string> = {
			Accept: "application/vnd.github+json",
			"User-Agent": "huwari",
		};
		const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
		if (!res.ok) return fallback;
	 const data = (await res.json()) as {
			description?: string | null;
			stargazers_count?: number;
			forks?: number;
			license?: { spdx_id?: string } | null;
			language?: string | null;
			owner?: { avatar_url?: string };
		};
		return {
			...fallback,
			description: (data.description ?? "").replace(/:[a-zA-Z0-9_]+:/g, ""),
			stars: data.stargazers_count ?? 0,
			forks: data.forks ?? 0,
			license: data.license?.spdx_id ?? "",
			language: data.language ?? "",
			avatar: data.owner?.avatar_url ?? fallback.avatar,
			ok: true,
		};
	} catch {
		return fallback;
	}
}

export function githubLoader(contentDir: string): Loader {
	return {
		name: "huwari-github",
		async load({ store, logger, parseData, generateDigest, meta, watcher }) {
			const reload = async () => {
				const files = collectMarkdownFiles(contentDir);
				const repos = [...new Set(files.flatMap((file) => extractGithubRepos(readFileSync(file, "utf-8"))))];
				const digest = generateDigest(repos.slice().sort().join(","));
				if (
					repos.length > 0 &&
					existsSync(GITHUB_CACHE_PATH) &&
					meta.get("repos-digest") === digest &&
					repos.every((repo) => store.has(repo))
				) {
					return;
				}
				store.clear();
				if (repos.length === 0) return;
				logger.info(`Fetching ${repos.length} GitHub repositor${repos.length === 1 ? "y" : "ies"}`);
				const infos = await Promise.all(repos.map(fetchRepo));
				const failed = infos.filter((info) => !info.ok).map((info) => info.repo);
				if (failed.length > 0) {
					logger.warn(`Using placeholders for unreachable repositor${failed.length === 1 ? "y" : "ies"}: ${failed.join(", ")}`);
				}
				const cache: Record<string, RepoInfo> = {};
				for (const info of infos) {
					const { ok: _ok, ...data } = info;
					const parsed = await parseData({ id: info.repo, data: { ...data } });
					store.set({ id: info.repo, data: parsed });
					cache[info.repo] = info;
				}
				if (failed.length === 0) {
					meta.set("repos-digest", digest);
				}
				const serialized = JSON.stringify(cache);
				let previous: string | null = null;
				try {
					previous = readFileSync(GITHUB_CACHE_PATH, "utf-8");
				} catch {
					/* first run */
				}
				if (previous !== serialized) {
					mkdirSync(join("./node_modules/.cache/huwari"), { recursive: true });
					writeFileSync(GITHUB_CACHE_PATH, serialized);
				}
			};
			await reload();
			if (watcher) {
				watcher.add(contentDir);
				watcher.on("change", () => void reload());
				watcher.on("add", () => void reload());
			}
		},
	};
}
