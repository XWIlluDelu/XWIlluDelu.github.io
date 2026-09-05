const hydrated = new Set<string>();

function compact(value: number): string {
	return Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);
}

export async function hydrateGithubCard(link: HTMLAnchorElement): Promise<void> {
	const repo = link.getAttribute("data-repo");
	if (!repo || hydrated.has(repo)) return;
	hydrated.add(repo);
	try {
		const res = await fetch(`https://api.github.com/repos/${repo}`, {
			referrerPolicy: "no-referrer",
		});
		if (!res.ok) return;
		const data = await res.json();
		const card = link.closest(".github-card");
		if (!card) return;
		const desc = card.querySelector(".gc-description");
		if (desc && data.description) {
			desc.textContent = String(data.description).replace(/:[a-zA-Z0-9_]+:/g, "");
		}
		const set = (cls: string, value: string) => {
			const el = card.querySelector(`.${cls}`);
			if (el) el.textContent = value;
		};
		set("gc-stars", compact(data.stargazers_count ?? 0));
		set("gc-forks", compact(data.forks ?? 0));
		set("gc-license", data.license?.spdx_id ?? "no-license");
		set("gc-language", data.language ?? "—");
		const avatar = card.querySelector<HTMLImageElement>(".gc-avatar");
		if (avatar && data.owner?.avatar_url) avatar.src = data.owner.avatar_url;
		link.setAttribute("title", `${data.stargazers_count ?? 0} stars`);
	} catch {
		/* offline: keep the static shell */
	}
}

export function hydrateGithubCards(): void {
	const links = document.querySelectorAll<HTMLAnchorElement>(
		"a.github-card-link[data-repo]:not([data-hydrated]), a.github-card[data-repo]:not([data-hydrated])",
	);
	for (const link of links) {
		link.setAttribute("data-hydrated", "");
		void hydrateGithubCard(link);
	}
}

let initialized = false;

export function initGithubCards(): void {
	if (initialized) return;
	initialized = true;
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", hydrateGithubCards);
	} else {
		hydrateGithubCards();
	}
	document.addEventListener("astro:after-swap", hydrateGithubCards);
}
