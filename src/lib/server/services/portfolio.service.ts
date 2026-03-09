import { db } from '$lib/server/db';
import { projects, certificates, skills } from '$lib/server/db/schema';
import { desc, asc, eq } from 'drizzle-orm';

export class PortfolioService {
	static async getAllContent() {
		const [allProjects, allCertificates, allSkills] = await Promise.all([
			db.select().from(projects).orderBy(asc(projects.order), desc(projects.createdAt)),
			db.select().from(certificates).orderBy(asc(certificates.order)),
			db.select().from(skills).orderBy(asc(skills.order))
		]);

		return {
			projects: allProjects,
			certificates: allCertificates,
			skills: allSkills
		};
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

	// Add more methods as needed (MVC: Controllers use this service)
}
