import { PortfolioService } from '$lib/server/services/portfolio.service';
import type { RequestHandler } from './$types';
import pdfmake from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};

pdfmake.setFonts(fonts);

export const GET: RequestHandler = async () => {
	const content = await PortfolioService.getAllContent();
	const { profile, experiences, projects, skills, certificates } = content;

	// fallback if DB is empty
	const fallbackProfile = {
		name: 'Rey Silva.',
		role: 'Full Stack Engineer',
		bio: 'Translating intricate business requirements into robust, high-performing code. I build resilient systems and lead technical workflows with a systematic approach focused on efficiency and impact.',
		avatarUrl: 'https://github.com/reysilvaa.png',
		email: 'contact@reysilva.com',
		github: 'https://github.com/reysilvaa',
		linkedin: 'https://linkedin.com/in/reysilvaa'
	};

	const safeProfile = { ...fallbackProfile, ...(profile || {}) };

	const parseTags = (tags: string | string[] | null | undefined): string[] => {
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
	};

	const docDefinition: TDocumentDefinitions = {
		content: [
			{ text: safeProfile.name, style: 'header' },
			{
				text: `${safeProfile.role} | ${safeProfile.email} | ${safeProfile.linkedin} | ${safeProfile.github}`,
				style: 'subheader'
			},
			{ text: safeProfile.bio, margin: [0, 10, 0, 20] }
		],
		styles: {
			header: {
				fontSize: 24,
				bold: true,
				margin: [0, 0, 0, 5]
			},
			subheader: {
				fontSize: 12,
				margin: [0, 0, 0, 10]
			},
			sectionHeader: {
				fontSize: 16,
				bold: true,
				margin: [0, 15, 0, 8]
			},
			jobTitle: {
				fontSize: 12,
				bold: true
			},
			companyDate: {
				fontSize: 10,
				italics: true,
				margin: [0, 0, 0, 5]
			},
			projectTitle: {
				fontSize: 12,
				bold: true
			},
			skillCategory: {
				fontSize: 11,
				bold: true,
				margin: [0, 5, 0, 2]
			}
		},
		defaultStyle: {
			font: 'Helvetica',
			fontSize: 10,
			lineHeight: 1.2
		}
	};

	const docContent = docDefinition.content as any[];

	// Add Experience
	if (experiences && experiences.length > 0) {
		docContent.push({ text: 'EXPERIENCE', style: 'sectionHeader' });
		experiences.forEach((exp) => {
			docContent.push(
				{ text: exp.role, style: 'jobTitle' },
				{ text: `${exp.company} | ${exp.startDate} - ${exp.endDate}`, style: 'companyDate' }
			);
			if (exp.description) {
				docContent.push({
					text: exp.description,
					margin: [0, 0, 0, 10]
				});
			} else {
				docContent.push({ text: '', margin: [0, 0, 0, 10] });
			}
		});
	}

	// Add Projects
	if (projects && projects.length > 0) {
		docContent.push({ text: 'PROJECTS', style: 'sectionHeader' });
		projects.forEach((proj) => {
			const tags = parseTags(proj.tags).join(', ');
			docContent.push(
				{ text: proj.title, style: 'projectTitle' },
				{ text: tags ? `Technologies: ${tags}` : '', style: 'companyDate' }
			);
			if (proj.description) {
				docContent.push({
					text: proj.description,
					margin: [0, 0, 0, 10]
				});
			} else {
				docContent.push({ text: '', margin: [0, 0, 0, 10] });
			}
		});
	}

	// Add Skills
	if (skills && skills.length > 0) {
		docContent.push({ text: 'SKILLS', style: 'sectionHeader' });

		// Group skills by category
		const skillsByCategory: Record<string, string[]> = {};
		skills.forEach((skill) => {
			const cat = skill.category || 'Other';
			if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
			skillsByCategory[cat].push(skill.name);
		});

		for (const [category, skillNames] of Object.entries(skillsByCategory)) {
			docContent.push({
				text: `${category}: ${skillNames.join(', ')}`,
				margin: [0, 2, 0, 2]
			});
		}
		docContent.push({ text: '', margin: [0, 0, 0, 10] });
	}

	// Add Certificates
	if (certificates && certificates.length > 0) {
		docContent.push({ text: 'CERTIFICATES', style: 'sectionHeader' });
		certificates.forEach((cert) => {
			docContent.push(
				{ text: cert.name, style: 'projectTitle' },
				{ text: cert.issuer, margin: [0, 0, 0, 5] }
			);
		});
	}

	const pdfDoc = pdfmake.createPdf(docDefinition);
	const buffer = await pdfDoc.getBuffer();

	return new Response(buffer as unknown as BodyInit, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${safeProfile.name.replace(/\\s+/g, '_')}_Resume.pdf"`
		}
	});
};
