export function parseTags(tags: string | string[] | null | undefined): string[] {
	if (!tags) return [];
	if (typeof tags !== 'string') return Array.isArray(tags) ? tags : [String(tags)];
	const trimmed = tags.trim();
	if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
		try {
			const parsed = JSON.parse(trimmed);
			return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
		} catch {
			// fallback
		}
	}
	return trimmed
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}
