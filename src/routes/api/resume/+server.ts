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

	const contactInfo = [
		safeProfile.email,
		safeProfile.linkedin,
		safeProfile.github
	].filter(Boolean).join('  |  ');

	const docDefinition: TDocumentDefinitions = {
		content: [
			{ text: safeProfile.name.toUpperCase(), style: 'header', alignment: 'center' },
			{
				text: `${safeProfile.role}\n${contactInfo}`,
				style: 'subheader',
				alignment: 'center'
			},
			{ text: safeProfile.bio, style: 'bio' }
		],
		styles: {
			header: {
				fontSize: 22,
				bold: true,
				margin: [0, 0, 0, 4]
			},
			subheader: {
				fontSize: 10,
				margin: [0, 0, 0, 15],
				color: '#444444'
			},
			bio: {
				fontSize: 10,
				margin: [0, 0, 0, 15],
				lineHeight: 1.3
			},
			sectionHeader: {
				fontSize: 14,
				bold: true,
				color: '#000000',
				margin: [0, 15, 0, 5]
			},
			jobTitle: {
				fontSize: 12,
				bold: true,
				margin: [0, 5, 0, 2]
			},
			companyName: {
				fontSize: 11,
				italics: true,
				margin: [0, 0, 0, 5]
			},
			dateText: {
				fontSize: 10,
				margin: [0, 5, 0, 2]
			},
			listText: {
				fontSize: 10,
				lineHeight: 1.3
			},
			projectTitle: {
				fontSize: 11,
				bold: true,
				margin: [0, 5, 0, 2]
			},
			projectTags: {
				fontSize: 9,
				italics: true,
				color: '#555555',
				margin: [0, 0, 0, 5]
			}
		},
		defaultStyle: {
			font: 'Helvetica',
			fontSize: 10,
			lineHeight: 1.2
		}
	};

	const docContent = docDefinition.content as any[];

	const addDivider = () => {
		docContent.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 10] });
	};

	// Add Experience
	if (experiences && experiences.length > 0) {
		docContent.push({ text: 'EXPERIENCE', style: 'sectionHeader' });
		addDivider();
		
		experiences.forEach((exp) => {
			docContent.push({
				columns: [
					{ text: exp.role, style: 'jobTitle' },
					{ text: `${exp.startDate} - ${exp.endDate || 'Present'}`, alignment: 'right', style: 'dateText' }
				]
			});
			docContent.push({ text: exp.company, style: 'companyName' });

			if (exp.description) {
				const bulletPoints = exp.description.split('\n').map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
				docContent.push({
					ul: bulletPoints,
					margin: [0, 2, 0, 10],
					style: 'listText'
				});
			} else {
				docContent.push({ text: '', margin: [0, 0, 0, 10] });
			}
		});
	}

	// Add Projects
	if (projects && projects.length > 0) {
		docContent.push({ text: 'PROJECTS', style: 'sectionHeader' });
		addDivider();

		projects.forEach((proj) => {
			const tags = parseTags(proj.tags).join(', ');
			docContent.push(
				{ text: proj.title, style: 'projectTitle' },
				{ text: tags ? `Technologies: ${tags}` : '', style: 'projectTags' }
			);
			if (proj.description) {
				const bulletPoints = proj.description.split('\n').map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
				docContent.push({
					ul: bulletPoints,
					margin: [0, 2, 0, 10],
					style: 'listText'
				});
			} else {
				docContent.push({ text: '', margin: [0, 0, 0, 10] });
			}
		});
	}

	// Add Skills
	if (skills && skills.length > 0) {
		docContent.push({ text: 'SKILLS', style: 'sectionHeader' });
		addDivider();

		// Group skills by category
		const skillsByCategory: Record<string, string[]> = {};
		skills.forEach((skill) => {
			const cats = (skill.category || 'Other')
				.split(',')
				.map((c) => c.trim())
				.filter(Boolean);
			if (cats.length === 0) cats.push('Other');
			
			cats.forEach((cat) => {
				if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
				skillsByCategory[cat].push(skill.name);
			});
		});

		for (const [category, skillNames] of Object.entries(skillsByCategory)) {
			docContent.push({
				text: [
					{ text: `${category}: `, bold: true },
					{ text: skillNames.join(', ') }
				],
				margin: [0, 2, 0, 2],
				fontSize: 10
			});
		}
		docContent.push({ text: '', margin: [0, 0, 0, 10] });
	}

	// Add Certificates
	if (certificates && certificates.length > 0) {
		docContent.push({ text: 'CERTIFICATES', style: 'sectionHeader' });
		addDivider();

		const certsList = certificates.map((cert) => `${cert.name} - ${cert.issuer}`);
		docContent.push({
			ul: certsList,
			margin: [0, 2, 0, 10],
			style: 'listText'
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
