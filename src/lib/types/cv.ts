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
