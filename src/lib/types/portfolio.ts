export interface Profile {
	id: string;
	name: string;
	role: string;
	bio: string;
	avatarUrl?: string | null;
	email?: string | null;
	phone?: string | null;
	location?: string | null;
	website?: string | null;
	github?: string | null;
	linkedin?: string | null;
	updatedAt?: Date | null;
}

export interface Experience {
	id: string;
	role: string;
	company: string;
	startDate: string;
	endDate?: string | null;
	location?: string | null;
	companyUrl?: string | null;
	employmentType?: string | null;
	description?: string | null;
	order?: number | null;
}

export interface Project {
	id: string;
	githubId?: number | null;
	title: string;
	subtitle?: string | null;
	period?: string | null;
	description?: string | null;
	imageUrl?: string | null;
	repoUrl?: string | null;
	liveUrl?: string | null;
	stars?: number | null;
	forks?: number | null;
	language?: string | null;
	tags?: string | null;
	isHidden?: boolean | null;
	order?: number | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

export interface Skill {
	id: string;
	name: string;
	category?: string | null;
	level?: number | null;
	order?: number | null;
}

export interface Certificate {
	id: string;
	name: string;
	issuer: string;
	issueDate?: Date | null;
	credentialUrl?: string | null;
	imageUrl?: string | null;
	order?: number | null;
}

export interface Education {
	id: string;
	school: string;
	degree: string;
	period: string;
	location?: string | null;
	order?: number | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

export interface OpenSource {
	id: string;
	title: string;
	role: string;
	repoUrl?: string | null;
	period?: string | null;
	description?: string | null;
	order?: number | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

export interface PortfolioContent {
	profile: Profile | null;
	experiences: Experience[];
	projects: Project[];
	skills: Skill[];
	certificates: Certificate[];
	education: Education[];
	openSource: OpenSource[];
}
