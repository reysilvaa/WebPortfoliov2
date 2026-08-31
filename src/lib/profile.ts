export const SITE_URL = 'https://www.reynaldsilva.my.id';

export type ProfileData = {
	name: string;
	role: string;
	bio: string;
	avatarUrl: string | null;
	email: string | null;
	github: string | null;
	linkedin: string | null;
};

export type ProjectData = {
	id: string;
	title: string;
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
	name: 'Rey Silva.',
	role: 'Full Stack Engineer',
	bio: 'Translating intricate business requirements into robust, high-performing code. I build resilient systems and lead technical workflows with a systematic approach focused on efficiency and impact.',
	avatarUrl: 'https://github.com/reysilvaa.png',
	email: 'contact@reysilva.com',
	github: 'https://github.com/reysilvaa',
	linkedin: 'https://www.linkedin.com/in/reynald-silva/'
};
