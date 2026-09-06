import type { PortfolioContent, Experience, Project, OpenSource, Education, Certificate } from './portfolio';
import { fallbackProfile } from '$lib/profile';

export interface CVParsedBullet {
	prefix?: string;
	text: string;
	linkText?: string;
	linkUrl?: string;
}

export interface CVSkillGroup {
	category: string;
	skills: string[];
}

export interface CVFormattedExperience {
	role: string;
	company: string;
	location?: string;
	companyUrl?: string;
	startDate: string;
	endDate: string;
	bullets: CVParsedBullet[];
}

export interface CVFormattedProject {
	title: string;
	subtitle?: string;
	period?: string;
	repoUrl?: string;
	liveUrl?: string;
	bullets: CVParsedBullet[];
}

export interface CVFormattedOpenSource {
	title: string;
	role: string;
	period?: string;
	repoUrl?: string;
	bullets: CVParsedBullet[];
}

export interface CVFormattedEducation {
	school: string;
	degree: string;
	period: string;
	location?: string;
}

export interface CVFormattedCertificate {
	name: string;
	issuer: string;
	issueDate?: string;
	credentialUrl?: string;
}

export interface CVViewModel {
	personal: {
		fullName: string;
		jobTitle: string;
		location: string;
		phone: string;
		email: string;
		website: string;
		linkedin: string;
		github: string;
		summary: string;
	};
	skillGroups: CVSkillGroup[];
	experiences: CVFormattedExperience[];
	projects: CVFormattedProject[];
	openSource: CVFormattedOpenSource[];
	education: CVFormattedEducation[];
	certificates: CVFormattedCertificate[];
}

/**
 * Parses multiline string into structured bullet points with bold prefix and optional link.
 */
export function parseBulletPoints(raw: string | null | undefined): CVParsedBullet[] {
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

/**
 * Transforms raw portfolio content queried from database into a strongly typed CVViewModel.
 */
export function formatPortfolioToCV(content: PortfolioContent): CVViewModel {
	const p = { ...fallbackProfile, ...(content.profile || {}) };

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

	const openSource: CVFormattedOpenSource[] = (content.openSource || []).map((os) => ({
		title: os.title,
		role: os.role,
		period: os.period || undefined,
		repoUrl: os.repoUrl || undefined,
		bullets: parseBulletPoints(os.description)
	}));

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
