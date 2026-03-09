import { db } from '$lib/server/db';
import { projects, certificates, skills, profile } from '$lib/server/db/schema';
import { desc, asc, eq } from 'drizzle-orm';

export class PortfolioService {
	static async getAllContent() {
		const [allProjects, allCertificates, allSkills, currentProfile] = await Promise.all([
			db.select().from(projects).orderBy(asc(projects.order), desc(projects.createdAt)),
			db.select().from(certificates).orderBy(asc(certificates.order)),
			db.select().from(skills).orderBy(asc(skills.order)),
			db.select().from(profile).where(eq(profile.id, 'main')).limit(1)
		]);

		return {
			projects: allProjects,
			certificates: allCertificates,
			skills: allSkills,
			profile: currentProfile[0] || null
		};
	}

	static async getProfile() {
		const result = await db.select().from(profile).where(eq(profile.id, 'main')).limit(1);
		return result[0] || null;
	}

	static async updateProfile(data: Partial<typeof profile.$inferInsert>) {
		const existing = await this.getProfile();
		if (existing) {
			return await db.update(profile).set(data).where(eq(profile.id, 'main')).returning();
		} else {
			return await db.insert(profile).values({
				id: 'main',
				name: data.name || '',
				role: data.role || '',
				bio: data.bio || '',
				email: data.email || '',
				github: data.github || '',
				linkedin: data.linkedin || ''
			}).returning();
		}
	}

	static async addProject(data: typeof projects.$inferInsert) {
		return await db.insert(projects).values(data).returning();
	}

	static async updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
		return await db.update(projects).set(data).where(eq(projects.id, id)).returning();
	}

	static async deleteProject(id: string) {
		return await db.delete(projects).where(eq(projects.id, id)).returning();
	}

	static async addCertificate(data: typeof certificates.$inferInsert) {
		return await db.insert(certificates).values(data).returning();
	}

	static async updateCertificate(id: string, data: Partial<typeof certificates.$inferInsert>) {
		return await db.update(certificates).set(data).where(eq(certificates.id, id)).returning();
	}

	static async deleteCertificate(id: string) {
		return await db.delete(certificates).where(eq(certificates.id, id)).returning();
	}

	static async addSkill(data: typeof skills.$inferInsert) {
		return await db.insert(skills).values(data).returning();
	}

	static async updateSkill(id: string, data: Partial<typeof skills.$inferInsert>) {
		return await db.update(skills).set(data).where(eq(skills.id, id)).returning();
	}

	static async deleteSkill(id: string) {
		return await db.delete(skills).where(eq(skills.id, id)).returning();
	}
}
