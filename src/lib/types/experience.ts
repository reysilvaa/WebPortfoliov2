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
