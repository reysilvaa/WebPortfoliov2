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

export type ProfileData = Omit<Profile, 'id'> & { id?: string };
