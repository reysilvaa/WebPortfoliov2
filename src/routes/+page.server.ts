import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { PageServerLoad } from './$types';
import type { projects as projectsTable, skills as skillsTable } from '$lib/server/db/schema';
import { SITE_URL, fallbackProfile, type ProfileData } from '$lib/server/profile';

function buildJsonLd(
	profile: ProfileData,
	projectRows: (typeof projectsTable.$inferSelect)[],
	skillRows: (typeof skillsTable.$inferSelect)[],
	canonical: string,
	ogImage: string
) {
	const person = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.role,
		description: profile.bio,
		url: canonical,
		image: profile.avatarUrl || ogImage,
		email: profile.email || undefined,
		sameAs: [profile.github, profile.linkedin].filter(Boolean),
		knowsAbout: skillRows.map((s) => s.name)
	};

	const webSite = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `${profile.name} — ${profile.role}`,
		url: canonical
	};

	const itemList = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Selected Works',
		itemListElement: projectRows.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			item: {
				'@type': 'CreativeWork',
				name: p.title,
				description: p.description || undefined,
				url: p.liveUrl || p.repoUrl || undefined,
				keywords: p.tags || undefined
			}
		}))
	};

	return JSON.stringify([person, webSite, itemList]).replace(/</g, '\\u003c');
}

export const load: PageServerLoad = async () => {
	const content = await PortfolioService.getAllContent();

	const profile = { ...fallbackProfile, ...(content.profile || {}) };

	const canonical = `${SITE_URL}/`;
	const ogImage = `${SITE_URL}/og-card.svg`;

	return {
		projects: content.projects,
		certificates: content.certificates,
		skills: content.skills,
		experiences: content.experiences,
		profile: content.profile,
		seo: {
			title: `${profile.name} — ${profile.role} | Portfolio`,
			description: profile.bio,
			canonical,
			ogImage,
			jsonLd: buildJsonLd(profile, content.projects, content.skills, canonical, ogImage)
		}
	};
};
