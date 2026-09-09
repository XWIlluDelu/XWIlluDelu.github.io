export function resolvePostAuthor(author: string | undefined, owner: string, ownerUrl?: string) {
	const name = author?.trim() || owner;
	return {
		"@type": "Person" as const,
		name,
		...(name === owner && ownerUrl ? { url: ownerUrl } : {}),
	};
}

/** Prevent arbitrary author/title text from terminating an inline JSON script. */
export function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}
