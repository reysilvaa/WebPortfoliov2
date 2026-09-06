export interface Certificate {
	id: string;
	name: string;
	issuer: string;
	issueDate?: Date | null;
	credentialUrl?: string | null;
	imageUrl?: string | null;
	order?: number | null;
}
