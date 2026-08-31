import { db } from '$lib/server/db';
import { projects, certificates, skills, profile, experiences } from '$lib/server/db/schema';
import { desc, asc, eq, sql } from 'drizzle-orm';
import { GithubService } from './github.service';
import { createCrud } from '$lib/server/db/crud';

const projectCrud = createCrud(projects);
const certificateCrud = createCrud(certificates);
const skillCrud = createCrud(skills);
const experienceCrud = createCrud(experiences);

export class PortfolioService {
	static async getPaginatedProjects(page: number, limit: number, includeHidden = false) {
		const offset = (page - 1) * limit;

		const whereClause = !includeHidden ? eq(projects.isHidden, false) : undefined;

		const [allProjects, totalResult] = await Promise.all([
			db
				.select()
				.from(projects)
				.where(whereClause)
				.orderBy(desc(projects.createdAt))
				.limit(limit)
				.offset(offset),
			db
				.select({ count: sql<number>`count(*)` })
				.from(projects)
				.where(whereClause)
		]);

		return {
			projects: allProjects,
			total: totalResult[0].count
		};
	}

	static async getAllContent(includeHidden = false) {
		const projectQuery = db.select().from(projects);

		if (!includeHidden) {
			projectQuery.where(eq(projects.isHidden, false));
		}

		const [allProjects, allCertificates, allSkills, currentProfile, allExperiences] =
			await Promise.all([
				projectQuery.orderBy(desc(projects.createdAt)),
				db.select().from(certificates).orderBy(asc(certificates.order)),
				db.select().from(skills).orderBy(asc(skills.order)),
				db.select().from(profile).where(eq(profile.id, 'main')).limit(1),
				db.select().from(experiences).orderBy(asc(experiences.order))
			]);

		return {
			projects: allProjects,
			certificates: allCertificates,
			skills: allSkills,
			profile: currentProfile[0] || null,
			experiences: allExperiences
		};
	}

	static async syncGithubProjects() {
		const githubRepos = await GithubService.getAllRepositories();
		const existingProjects = await db.select().from(projects);
		const existingGithubIds = existingProjects
			.filter((p: typeof projects.$inferSelect) => p.githubId !== null)
			.map((p: typeof projects.$inferSelect) => p.githubId as number);

		const results = [];

		for (const repo of githubRepos) {
			const projectData = {
				githubId: repo.id,
				title: repo.name,
				description: repo.description,
				repoUrl: repo.html_url,
				liveUrl:
					repo.homepage && repo.homepage.trim() !== ''
						? repo.homepage.startsWith('http')
							? repo.homepage
							: `https://${repo.homepage}`
						: null,
				stars: repo.stargazers_count,
				forks: repo.forks_count,
				language: repo.language,
				tags: Array.from(new Set([...(repo.topics || [])])).join(', '),
				updatedAt: new Date(repo.updated_at)
			};

			if (existingGithubIds.includes(repo.id)) {
				// Update existing
				const updated = await db
					.update(projects)
					.set(projectData)
					.where(eq(projects.githubId, repo.id))
					.returning();
				results.push(...updated);
			} else {
				// Insert new
				const inserted = await db
					.insert(projects)
					.values({
						...projectData,
						isHidden: true,
						order: 0
					})
					.returning();
				results.push(...inserted);
			}
		}

		return results;
	}

	static async toggleProjectVisibility(id: string, isHidden: boolean) {
		return await db.update(projects).set({ isHidden }).where(eq(projects.id, id)).returning();
	}

	static async updateProjectOrder(id: string, order: number) {
		return await db.update(projects).set({ order }).where(eq(projects.id, id)).returning();
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
			return await db
				.insert(profile)
				.values({
					id: 'main',
					name: data.name || '',
					role: data.role || '',
					bio: data.bio || '',
					avatarUrl: data.avatarUrl || '',
					email: data.email || '',
					github: data.github || '',
					linkedin: data.linkedin || ''
				})
				.returning();
		}
	}

	static async addProject(data: typeof projects.$inferInsert) {
		return projectCrud.add(data);
	}

	static async updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
		return projectCrud.update(id, data);
	}

	static async deleteProject(id: string) {
		return projectCrud.remove(id);
	}

	static async addCertificate(data: typeof certificates.$inferInsert) {
		return certificateCrud.add(data);
	}

	static async updateCertificate(id: string, data: Partial<typeof certificates.$inferInsert>) {
		return certificateCrud.update(id, data);
	}

	static async deleteCertificate(id: string) {
		return certificateCrud.remove(id);
	}

	static async addSkill(data: typeof skills.$inferInsert) {
		return skillCrud.add(data);
	}

	static async updateSkill(id: string, data: Partial<typeof skills.$inferInsert>) {
		return skillCrud.update(id, data);
	}

	static async deleteSkill(id: string) {
		return skillCrud.remove(id);
	}

	static async addExperience(data: typeof experiences.$inferInsert) {
		return experienceCrud.add(data);
	}

	static async updateExperience(id: string, data: Partial<typeof experiences.$inferInsert>) {
		return experienceCrud.update(id, data);
	}

	static async deleteExperience(id: string) {
		return experienceCrud.remove(id);
	}
}
