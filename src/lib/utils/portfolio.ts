export function getCertificatePreviewUrl(displayUrl: string | null | undefined): string | null {
	if (!displayUrl) return null;
	const udemyMatch = displayUrl.match(/udemy\.com\/certificate\/(UC-[\w-]+)/);
	if (udemyMatch) return `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`;
	if (displayUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)) return displayUrl;
	return `https://api.microlink.io?url=${encodeURIComponent(displayUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
}

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
