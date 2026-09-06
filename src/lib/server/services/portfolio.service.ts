import { db } from '$lib/server/db';
import {
	projects,
	certificates,
	skills,
	profile,
	experiences,
	education,
	openSource
} from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { GithubService } from './github.service';
import { BaseRepository } from '$lib/server/db/crud';
import type { PortfolioContent } from '$lib/types';

export class PortfolioService {
	public static readonly projectRepo = new BaseRepository(projects);
	public static readonly certificateRepo = new BaseRepository(certificates);
	public static readonly skillRepo = new BaseRepository(skills);
	public static readonly experienceRepo = new BaseRepository(experiences);
	public static readonly profileRepo = new BaseRepository(profile);
	public static readonly educationRepo = new BaseRepository(education);
	public static readonly openSourceRepo = new BaseRepository(openSource);
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

	static async getProjects(includeHidden = false) {
		const query = db.select().from(projects);
		if (!includeHidden) {
			query.where(eq(projects.isHidden, false));
		}
		return query.orderBy(desc(projects.createdAt));
	}

	static async getCertificates() {
		return this.certificateRepo.getAll(certificates.order, 'asc');
	}

	static async getSkills() {
		return this.skillRepo.getAll(skills.order, 'asc');
	}

	static async getExperiences() {
		return this.experienceRepo.getAll(experiences.order, 'asc');
	}

	static async getEducation() {
		return this.educationRepo.getAll(education.order, 'asc');
	}

	static async getOpenSource() {
		return this.openSourceRepo.getAll(openSource.order, 'asc');
	}

	static async getAllContent(includeHidden = false): Promise<PortfolioContent> {
		const [
			allProjects,
			allCertificates,
			allSkills,
			currentProfile,
			allExperiences,
			allEducation,
			allOpenSource
		] = await Promise.all([
			this.getProjects(includeHidden),
			this.getCertificates(),
			this.getSkills(),
			this.getProfile(),
			this.getExperiences(),
			this.getEducation(),
			this.getOpenSource()
		]);

		return {
			projects: allProjects,
			certificates: allCertificates,
			skills: allSkills,
			profile: currentProfile,
			experiences: allExperiences,
			education: allEducation,
			openSource: allOpenSource
		};
	}

	static async syncGithubProjects() {
		const githubRepos = await GithubService.getAllRepositories();
		const existingProjects = await db.select().from(projects);
		const existingGithubIds = new Set(
			existingProjects
				.filter((p: typeof projects.$inferSelect) => p.githubId !== null)
				.map((p: typeof projects.$inferSelect) => p.githubId as number)
		);

		const operations = githubRepos.map((repo) => {
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

			if (existingGithubIds.has(repo.id)) {
				return db
					.update(projects)
					.set(projectData)
					.where(eq(projects.githubId, repo.id))
					.returning();
			} else {
				return db
					.insert(projects)
					.values({
						...projectData,
						isHidden: true,
						order: 0
					})
					.returning();
			}
		});

		const results = await Promise.all(operations);
		return results.flat();
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
					phone: data.phone || '',
					location: data.location || '',
					website: data.website || '',
					github: data.github || '',
					linkedin: data.linkedin || ''
				})
				.returning();
		}
	}

	static async addProject(data: typeof projects.$inferInsert) {
		return this.projectRepo.add(data);
	}

	static async updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
		return this.projectRepo.update(id, data);
	}

	static async deleteProject(id: string) {
		return this.projectRepo.remove(id);
	}

	static async addCertificate(data: typeof certificates.$inferInsert) {
		return this.certificateRepo.add(data);
	}

	static async updateCertificate(id: string, data: Partial<typeof certificates.$inferInsert>) {
		return this.certificateRepo.update(id, data);
	}

	static async deleteCertificate(id: string) {
		return this.certificateRepo.remove(id);
	}

	static async addSkill(data: typeof skills.$inferInsert) {
		return this.skillRepo.add(data);
	}

	static async updateSkill(id: string, data: Partial<typeof skills.$inferInsert>) {
		return this.skillRepo.update(id, data);
	}

	static async deleteSkill(id: string) {
		return this.skillRepo.remove(id);
	}

	static async addExperience(data: typeof experiences.$inferInsert) {
		return this.experienceRepo.add(data);
	}

	static async updateExperience(id: string, data: Partial<typeof experiences.$inferInsert>) {
		return this.experienceRepo.update(id, data);
	}

	static async deleteExperience(id: string) {
		return this.experienceRepo.remove(id);
	}

	static async addEducation(data: typeof education.$inferInsert) {
		return this.educationRepo.add(data);
	}

	static async updateEducation(id: string, data: Partial<typeof education.$inferInsert>) {
		return this.educationRepo.update(id, data);
	}

	static async deleteEducation(id: string) {
		return this.educationRepo.remove(id);
	}

	static async addOpenSource(data: typeof openSource.$inferInsert) {
		return this.openSourceRepo.add(data);
	}

	static async updateOpenSource(id: string, data: Partial<typeof openSource.$inferInsert>) {
		return this.openSourceRepo.update(id, data);
	}

	static async deleteOpenSource(id: string) {
		return this.openSourceRepo.remove(id);
	}
}
