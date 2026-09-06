import pdfmake from 'pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { PortfolioContent } from '$lib/types/portfolio';
import { formatPortfolioToCV } from '$lib/utils/cv';

const fonts = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};

pdfmake.setFonts(fonts);

export class ResumeService {
	static async generatePdfBuffer(
		content: PortfolioContent
	): Promise<{ buffer: Buffer; fileName: string }> {
		const cv = formatPortfolioToCV(content);
		const { personal, skillGroups, experiences, projects, openSource, education, certificates } =
			cv;

		const docDefinition: TDocumentDefinitions = {
			pageSize: 'A4',
			pageMargins: [36, 36, 36, 36],
			content: [],
			styles: {
				candidateName: {
					fontSize: 19,
					bold: true,
					color: '#0F3B7D',
					alignment: 'center',
					margin: [0, 0, 0, 2]
				},
				candidateRole: {
					fontSize: 10.5,
					bold: true,
					color: '#2B3E50',
					alignment: 'center',
					margin: [0, 0, 0, 4]
				},
				contactBar: {
					fontSize: 8.5,
					color: '#4B5563',
					alignment: 'center',
					margin: [0, 0, 0, 10]
				},
				sectionHeader: {
					fontSize: 11,
					bold: true,
					color: '#0F3B7D',
					margin: [0, 9, 0, 2]
				},
				itemTitle: {
					fontSize: 9.5,
					bold: true,
					color: '#111827'
				},
				itemSubtitle: {
					fontSize: 9,
					color: '#374151'
				},
				itemRightMeta: {
					fontSize: 8.5,
					color: '#4B5563',
					alignment: 'right'
				},
				bodyText: {
					fontSize: 8.5,
					lineHeight: 1.25,
					color: '#1F2937'
				},
				skillCategory: {
					fontSize: 8.5,
					bold: true,
					color: '#111827'
				},
				bulletPrefix: {
					bold: true,
					color: '#111827'
				},
				hyperlink: {
					color: '#0F3B7D',
					decoration: 'underline'
				}
			},
			defaultStyle: {
				font: 'Helvetica',
				fontSize: 8.5,
				lineHeight: 1.2,
				color: '#1F2937'
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const docContent = docDefinition.content as any[];

		const addDivider = () => {
			docContent.push({
				canvas: [
					{
						type: 'line',
						x1: 0,
						y1: 0,
						x2: 523,
						y2: 0,
						lineWidth: 0.8,
						lineColor: '#0F3B7D'
					}
				],
				margin: [0, 0, 0, 5]
			});
		};

		// 1. Header (Name, Title, Contact Info)
		docContent.push({ text: personal.fullName.toUpperCase(), style: 'candidateName' });
		docContent.push({ text: personal.jobTitle.toUpperCase(), style: 'candidateRole' });

		// Contact Bar
		const contactParts: unknown[] = [];
		if (personal.location) {
			contactParts.push(personal.location);
		}
		if (personal.phone) {
			if (contactParts.length > 0) contactParts.push('  |  ');
			contactParts.push(personal.phone);
		}
		if (personal.email) {
			if (contactParts.length > 0) contactParts.push('  |  ');
			contactParts.push({
				text: personal.email,
				link: `mailto:${personal.email}`,
				style: 'hyperlink'
			});
		}
		if (personal.website) {
			if (contactParts.length > 0) contactParts.push('  |  ');
			const cleanWeb = personal.website.replace(/^https?:\/\//, '');
			contactParts.push({ text: cleanWeb, link: personal.website, style: 'hyperlink' });
		}
		if (personal.linkedin) {
			if (contactParts.length > 0) contactParts.push('  |  ');
			const cleanLi = personal.linkedin.replace(/^https?:\/\/(www\.)?/, '');
			contactParts.push({ text: cleanLi, link: personal.linkedin, style: 'hyperlink' });
		}

		docContent.push({ text: contactParts, style: 'contactBar' });

		// 2. Professional Summary
		if (personal.summary) {
			docContent.push({ text: 'SUMMARY', style: 'sectionHeader' });
			addDivider();
			docContent.push({
				text: personal.summary,
				style: 'bodyText',
				margin: [0, 0, 0, 6]
			});
		}

		// 3. Technical Skills
		if (skillGroups.length > 0) {
			docContent.push({ text: 'TECHNICAL SKILLS', style: 'sectionHeader' });
			addDivider();
			for (const group of skillGroups) {
				docContent.push({
					text: [
						{ text: `${group.category}: `, style: 'skillCategory' },
						{ text: group.skills.join(', '), style: 'bodyText' }
					],
					margin: [0, 1, 0, 1]
				});
			}
			docContent.push({ text: '', margin: [0, 0, 0, 4] });
		}

		// 4. Work Experience
		if (experiences.length > 0) {
			docContent.push({ text: 'WORK EXPERIENCE', style: 'sectionHeader' });
			addDivider();

			for (const exp of experiences) {
				const leftCol: unknown[] = [
					{ text: exp.company, style: 'itemTitle' },
					{ text: ` — ${exp.role}`, style: 'itemSubtitle' }
				];

				const rightColParts: string[] = [];
				rightColParts.push(`${exp.startDate} – ${exp.endDate}`);
				if (exp.location) rightColParts.push(exp.location);

				docContent.push({
					columns: [
						{ text: leftCol, width: '*' },
						{ text: rightColParts.join(' | '), style: 'itemRightMeta', width: 'auto' }
					],
					margin: [0, 3, 0, 2]
				});

				if (exp.bullets.length > 0) {
					const bulletItems = exp.bullets.map((b) => {
						const parts: unknown[] = [];
						if (b.prefix) {
							parts.push({ text: `${b.prefix}: `, style: 'bulletPrefix' });
						}
						parts.push({ text: b.text });
						if (b.linkText && b.linkUrl) {
							parts.push(' ');
							parts.push({ text: b.linkText, link: b.linkUrl, style: 'hyperlink' });
						}
						return { text: parts, margin: [0, 1, 0, 1.5] };
					});

					docContent.push({
						ul: bulletItems,
						style: 'bodyText',
						margin: [10, 0, 0, 4]
					});
				}
			}
		}

		// 5. Selected Projects
		if (projects.length > 0) {
			docContent.push({ text: 'SELECTED PROJECTS', style: 'sectionHeader' });
			addDivider();

			for (const proj of projects) {
				const leftCol: unknown[] = [{ text: proj.title, style: 'itemTitle' }];
				if (proj.subtitle) {
					leftCol.push({ text: ` | ${proj.subtitle}`, style: 'itemSubtitle' });
				}

				docContent.push({
					columns: [
						{ text: leftCol, width: '*' },
						{ text: proj.period || '', style: 'itemRightMeta', width: 'auto' }
					],
					margin: [0, 3, 0, 2]
				});

				if (proj.bullets.length > 0) {
					const bulletItems = proj.bullets.map((b) => {
						const parts: unknown[] = [];
						if (b.prefix) {
							parts.push({ text: `${b.prefix}: `, style: 'bulletPrefix' });
						}
						parts.push({ text: b.text });
						if (b.linkText && b.linkUrl) {
							parts.push(' ');
							parts.push({ text: b.linkText, link: b.linkUrl, style: 'hyperlink' });
						}
						return { text: parts, margin: [0, 1, 0, 1.5] };
					});

					docContent.push({
						ul: bulletItems,
						style: 'bodyText',
						margin: [10, 0, 0, 4]
					});
				}
			}
		}

		// 6. Open-Source Contributions
		if (openSource.length > 0) {
			docContent.push({ text: 'OPEN-SOURCE CONTRIBUTIONS', style: 'sectionHeader' });
			addDivider();

			for (const os of openSource) {
				const leftCol: unknown[] = [{ text: os.title, style: 'itemTitle' }];
				if (os.role) {
					leftCol.push({ text: ` (${os.role})`, style: 'itemSubtitle' });
				}

				docContent.push({
					columns: [
						{ text: leftCol, width: '*' },
						{ text: os.period || '', style: 'itemRightMeta', width: 'auto' }
					],
					margin: [0, 3, 0, 2]
				});

				if (os.bullets.length > 0) {
					const bulletItems = os.bullets.map((b) => {
						const parts: unknown[] = [];
						if (b.prefix) {
							parts.push({ text: `${b.prefix}: `, style: 'bulletPrefix' });
						}
						parts.push({ text: b.text });
						if (b.linkText && b.linkUrl) {
							parts.push(' ');
							parts.push({ text: b.linkText, link: b.linkUrl, style: 'hyperlink' });
						}
						return { text: parts, margin: [0, 1, 0, 1.5] };
					});

					docContent.push({
						ul: bulletItems,
						style: 'bodyText',
						margin: [10, 0, 0, 4]
					});
				}
			}
		}

		// 7. Education
		if (education.length > 0) {
			docContent.push({ text: 'EDUCATION', style: 'sectionHeader' });
			addDivider();

			for (const edu of education) {
				docContent.push({
					columns: [
						{ text: edu.school, style: 'itemTitle' },
						{ text: edu.period, style: 'itemRightMeta', width: 'auto' }
					],
					margin: [0, 2, 0, 1]
				});

				docContent.push({
					columns: [
						{ text: edu.degree, style: 'itemSubtitle' },
						{ text: edu.location || '', style: 'itemRightMeta', width: 'auto' }
					],
					margin: [0, 0, 0, 4]
				});
			}
		}

		// 8. Certifications
		if (certificates.length > 0) {
			docContent.push({ text: 'CERTIFICATIONS', style: 'sectionHeader' });
			addDivider();

			for (const cert of certificates) {
				docContent.push({
					columns: [
						{
							text: [
								{ text: cert.name, style: 'itemTitle' },
								{ text: ` — ${cert.issuer}`, style: 'itemSubtitle' }
							],
							width: '*'
						},
						{ text: cert.issueDate || '', style: 'itemRightMeta', width: 'auto' }
					],
					margin: [0, 1.5, 0, 1.5]
				});
			}
		}

		const pdfDoc = pdfmake.createPdf(docDefinition);
		const buffer = (await pdfDoc.getBuffer()) as Buffer;
		const fileName = `${personal.fullName.replace(/\s+/g, '_')}_CV.pdf`;

		return { buffer, fileName };
	}
}
