import type { PortfolioContent } from '$lib/types/portfolio';
import { resolveProfile } from '$lib/profile';
import type {
	CVParsedBullet,
	CVSkillGroup,
	CVFormattedExperience,
	CVFormattedProject,
	CVFormattedOpenSource,
	CVFormattedEducation,
	CVFormattedCertificate,
	CVViewModel
} from '$lib/types/cv';

/**
 * Parses multiline string into structured bullet points with bold prefix and optional link.
 */
function parseBulletPoints(raw: string | null | undefined): CVParsedBullet[] {
	if (!raw) return [];

	const lines = raw
		.split('\n')
		.map((line) => line.replace(/^[-*•]\s*/, '').trim())
		.filter(Boolean);

	return lines.map((line) => {
		let prefix: string | undefined;
		let body = line;
		let linkText: string | undefined;
		let linkUrl: string | undefined;

		// Extract markdown link e.g. [Live Demo](https://...)
		const linkMatch = body.match(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/);
		if (linkMatch) {
			linkText = linkMatch[1];
			linkUrl = linkMatch[2];
			body = body.replace(linkMatch[0], '').trim();
		}

		// Extract bold prefix e.g. **Architected system**: or Architected system:
		const boldMatch = body.match(/^(\*\*(.*?)\*\*|([A-Za-z0-9\s/&,–—-]+)):\s*(.*)$/);
		if (boldMatch) {
			prefix = (boldMatch[2] || boldMatch[3]).trim();
			body = (boldMatch[4] || '').trim();
		}

		return {
			prefix,
			text: body,
			linkText,
			linkUrl
		};
	});
}

const CATEGORY_ORDER = [
	'Programming Languages',
	'Mobile & Frontend',
	'Backend Frameworks',
	'Databases & Caching',
	'AI & Job Queues',
	'DevOps & Practices'
];

function formatOpenSourceToCV(
	rawOpenSource: PortfolioContent['openSource'] = []
): CVFormattedOpenSource[] {
	const curatedItems: CVFormattedOpenSource[] = [];
	const prsByRepo: Record<string, PortfolioContent['openSource']> = {};

	for (const os of rawOpenSource) {
		const isMergedPr = os.role.toLowerCase().includes('merged');
		if (isMergedPr) {
			const repo = os.role.replace(' · merged', '').trim();
			if (!prsByRepo[repo]) {
				prsByRepo[repo] = [];
			}
			prsByRepo[repo].push(os);
		} else {
			curatedItems.push({
				title: os.title,
				role: os.role,
				period: os.period || undefined,
				repoUrl: os.repoUrl || undefined,
				bullets: parseBulletPoints(os.description)
			});
		}
	}

	for (const [repo, prs] of Object.entries(prsByRepo)) {
		const repoNameOnly = repo.includes('/') ? repo.split('/')[1] : repo;
		const matchingCurated = curatedItems.find((item) => {
			const itemTitleLower = item.title.toLowerCase();
			const repoLower = repo.toLowerCase();
			const repoNameLower = repoNameOnly.toLowerCase();
			const matchesTitle = itemTitleLower === repoLower || itemTitleLower === repoNameLower;
			const matchesUrl = item.repoUrl
				? item.repoUrl.toLowerCase().includes(repoLower) ||
					item.repoUrl.toLowerCase().includes(repoNameLower)
				: false;
			return matchesTitle || matchesUrl;
		});

		if (matchingCurated) {
			const existingText = matchingCurated.bullets.map((b) => b.text).join(' ');
			for (const pr of prs) {
				const prNumMatch = pr.repoUrl?.match(/\/pull\/(\d+)/);
				const prNum = prNumMatch ? `#${prNumMatch[1]}` : '';
				if (prNum && existingText.includes(prNum)) {
					continue;
				}
				matchingCurated.bullets.push({
					prefix: prNum ? `PR ${prNum}` : undefined,
					text: pr.title,
					linkText: prNum ? `View PR ${prNum}` : pr.repoUrl ? 'View PR' : undefined,
					linkUrl: pr.repoUrl || undefined
				});
			}
		} else {
			const years = Array.from(
				new Set(prs.map((p) => p.period).filter((p): p is string => Boolean(p)))
			).sort();
			const period =
				years.length > 1
					? `${years[0]} – ${years[years.length - 1]}`
					: years.length === 1
						? years[0]
						: undefined;

			const bullets: CVParsedBullet[] = prs.map((pr) => {
				const prNumMatch = pr.repoUrl?.match(/\/pull\/(\d+)/);
				const prNum = prNumMatch ? `#${prNumMatch[1]}` : '';
				return {
					prefix: prNum ? `PR ${prNum}` : undefined,
					text: pr.title,
					linkText: prNum ? `View PR ${prNum}` : pr.repoUrl ? 'View PR' : undefined,
					linkUrl: pr.repoUrl || undefined
				};
			});

			curatedItems.push({
				title: repo,
				role: 'Contributor',
				period,
				repoUrl: `https://github.com/${repo}`,
				bullets
			});
		}
	}

	return curatedItems;
}

/**
 * Transforms raw portfolio content queried from database into a strongly typed CVViewModel.
 */
export function formatPortfolioToCV(content: PortfolioContent): CVViewModel {
	const p = resolveProfile(content.profile);

	const personal = {
		fullName: p.name,
		jobTitle: p.role,
		location: p.location || '',
		phone: p.phone || '',
		email: p.email || '',
		website: p.website || '',
		linkedin: p.linkedin || '',
		github: p.github || '',
		summary: p.bio || ''
	};

	// Group skills by category
	const groupMap = new Map<string, string[]>();
	for (const s of content.skills || []) {
		const cats = (s.category || 'Other')
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		if (cats.length === 0) cats.push('Other');

		for (const cat of cats) {
			if (!groupMap.has(cat)) groupMap.set(cat, []);
			groupMap.get(cat)!.push(s.name);
		}
	}

	const skillGroups: CVSkillGroup[] = [];
	for (const cat of CATEGORY_ORDER) {
		if (groupMap.has(cat)) {
			skillGroups.push({ category: cat, skills: groupMap.get(cat)! });
			groupMap.delete(cat);
		}
	}
	for (const [cat, skills] of groupMap.entries()) {
		skillGroups.push({ category: cat, skills });
	}

	const experiences: CVFormattedExperience[] = (content.experiences || []).map((exp) => ({
		role: exp.role,
		company: exp.company,
		location: exp.location || undefined,
		companyUrl: exp.companyUrl || undefined,
		startDate: exp.startDate,
		endDate: exp.endDate || 'Present',
		bullets: parseBulletPoints(exp.description)
	}));

	const projects: CVFormattedProject[] = (content.projects || []).map((proj) => ({
		title: proj.title,
		subtitle: proj.subtitle || undefined,
		period: proj.period || undefined,
		repoUrl: proj.repoUrl || undefined,
		liveUrl: proj.liveUrl || undefined,
		bullets: parseBulletPoints(proj.description)
	}));

	const openSource = formatOpenSourceToCV(content.openSource);

	const education: CVFormattedEducation[] = (content.education || []).map((edu) => ({
		school: edu.school,
		degree: edu.degree,
		period: edu.period,
		location: edu.location || undefined
	}));

	const certificates: CVFormattedCertificate[] = (content.certificates || []).map((cert) => ({
		name: cert.name,
		issuer: cert.issuer,
		issueDate: cert.issueDate
			? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
			: undefined,
		credentialUrl: cert.credentialUrl || undefined
	}));

	return {
		personal,
		skillGroups,
		experiences,
		projects,
		openSource,
		education,
		certificates
	};
}
