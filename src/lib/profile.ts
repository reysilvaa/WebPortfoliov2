import type { Profile, Project } from '$lib/types/portfolio';

export const SITE_URL = 'https://www.reynaldsilva.my.id';

export type ProfileData = Omit<Profile, 'id'> & { id?: string };
export type ProjectData = Project;

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
