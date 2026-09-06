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
