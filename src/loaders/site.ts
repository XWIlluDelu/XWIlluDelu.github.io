import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Loader } from "astro/loaders";

const CONFIG_URL = new URL("../../site.config.json", import.meta.url);

export function siteLoader(): Loader {
	return {
		name: "huwari-site",
		async load({ store, logger, parseData, watcher }) {
			const reload = async () => {
				store.clear();
				const raw = JSON.parse(readFileSync(fileURLToPath(CONFIG_URL), "utf-8"));
				const data = await parseData({ id: "config", data: raw });
				store.set({ id: "config", data });
			};
			await reload().catch((error) => {
				logger.error(`Failed to load site.config.json: ${String(error)}`);
			});
			watcher?.add(fileURLToPath(CONFIG_URL));
			watcher?.on("change", (path) => {
				if (path === fileURLToPath(CONFIG_URL)) void reload();
			});
		},
	};
}
