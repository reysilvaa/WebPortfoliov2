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
