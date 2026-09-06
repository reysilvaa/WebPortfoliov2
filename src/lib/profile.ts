export const SITE_URL = 'https://www.reynaldsilva.my.id';

export type ProfileData = {
	name: string;
	role: string;
	bio: string;
	avatarUrl: string | null;
	email: string | null;
	phone?: string | null;
	location?: string | null;
	website?: string | null;
	github: string | null;
	linkedin: string | null;
};

export type ProjectData = {
	id: string;
	title: string;
	subtitle?: string | null;
	period?: string | null;
	description: string | null;
	imageUrl?: string | null;
	repoUrl?: string | null;
	liveUrl?: string | null;
	stars?: number | null;
	forks?: number | null;
	language?: string | null;
	tags?: string | null;
	isHidden?: boolean | null;
};

export const fallbackProfile: ProfileData = {
	name: 'Moch. Reynald Silva Baktiar',
	role: 'Fullstack Software Engineer',
	bio: 'Fullstack Software Engineer with extensive experience in building, architecting, and optimizing high-performance distributed web and mobile platforms. Specialized in Laravel, SvelteKit, React, Node.js, and Flutter with strong database design (PostgreSQL, Redis) and DevOps automation (Docker, CI/CD). Passionate about developer tooling, performance engineering, clean architecture, and AI integrations.',
	avatarUrl: 'https://github.com/reysilvaa.png',
	email: 'reynaldsilva123@gmail.com',
	phone: '+62 852-3215-2313',
	location: 'Malang, Indonesia',
	website: 'https://www.reynaldsilva.my.id',
	github: 'https://github.com/reysilvaa',
	linkedin: 'https://www.linkedin.com/in/reynald-silva/'
};
