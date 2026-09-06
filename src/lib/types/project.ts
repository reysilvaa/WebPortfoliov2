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

export type ProjectData = Project;
