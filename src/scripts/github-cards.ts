const hydrated = new Set<string>();

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
		if (card && data.description) {
			const span = document.createElement("span");
			span.className = "github-card-desc";
			span.textContent = String(data.description).replace(/:[a-zA-Z0-9_]+:/g, "");
			card.appendChild(span);
		}
		link.setAttribute("title", `${data.stargazers_count ?? 0} stars`);
	} catch {
		/* offline: keep the static shell */
	}
}

export function hydrateGithubCards(): void {
	const links = document.querySelectorAll<HTMLAnchorElement>(
		"a.github-card-link[data-repo]:not([data-hydrated])",
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
