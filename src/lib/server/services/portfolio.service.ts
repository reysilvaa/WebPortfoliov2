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
import { desc, asc, eq, sql } from 'drizzle-orm';
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
				.orderBy(
					sql`case when ${projects.order} > 0 then 0 else 1 end asc`,
					asc(projects.order),
					desc(projects.stars),
					desc(projects.updatedAt)
				)
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
		return query.orderBy(
			sql`case when ${projects.order} > 0 then 0 else 1 end asc`,
			asc(projects.order),
			desc(projects.stars),
			desc(projects.updatedAt)
		);
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
		const existingGithubMap = new Map(
			existingProjects
				.filter((p: typeof projects.$inferSelect) => p.githubId !== null)
				.map((p: typeof projects.$inferSelect) => [p.githubId as number, p])
		);

		const JUNK_REPO_PATTERNS = [
			/^crud/i,
			/^chall?enge/i,
			/^tugas/i,
			/^latihan/i,
			/^pwl/i,
			/^\d{6,}/,
			/bucin/i,
			/love-birthday/i,
			/truck-letter/i,
			/^-01-/i,
			/--old/i,
			/config files/i,
			/laundry_ukk/i,
			/rest-api/i,
			/^react[_-]?\d/i,
			/^node[_-]?react/i,
			/^auth-/i,
			/siperpus/i,
			/php-docs/i,
			/undangan-ippnu/i,
			/-clone$/i
		];

		const operations = githubRepos.map((repo) => {
			const existing = existingGithubMap.get(repo.id);
			const isJunk = JUNK_REPO_PATTERNS.some(
				(regex) => regex.test(repo.name) || (repo.description && regex.test(repo.description))
			);

			// Preserve existing title and description if already customized
			const title =
				existing?.title && existing.title.trim() !== '' && existing.title !== repo.name
					? existing.title
					: repo.name;

			const description =
				existing?.description && existing.description.trim() !== ''
					? existing.description
					: repo.description;

			const projectData = {
				githubId: repo.id,
				title,
				description,
				repoUrl: repo.html_url,
				liveUrl:
					repo.homepage && repo.homepage.trim() !== ''
						? repo.homepage.startsWith('http')
							? repo.homepage
							: `https://${repo.homepage}`
						: (existing?.liveUrl ?? null),
				stars: repo.stargazers_count,
				forks: repo.forks_count,
				language: repo.language,
				tags: Array.from(new Set([...(repo.topics || [])])).join(', '),
				updatedAt: new Date(repo.updated_at)
			};

			if (existing) {
				const isHidden = isJunk ? true : existing.isHidden;
				return db
					.update(projects)
					.set({
						...projectData,
						isHidden
					})
					.where(eq(projects.githubId, repo.id))
					.returning();
			} else {
				const isHighActivity =
					!isJunk &&
					(repo.stargazers_count > 0 ||
						(repo.description &&
							Date.now() - new Date(repo.updated_at).getTime() < 180 * 24 * 60 * 60 * 1000));

				return db
					.insert(projects)
					.values({
						...projectData,
						isHidden: !isHighActivity,
						order: 0
					})
					.returning();
			}
		});

		const results = await Promise.all(operations);
		return results.flat();
	}

	static async syncGithubOpenSource() {
		const { contributions } = await GithubService.getExternalContributions();
		const existingItems = await db.select().from(openSource);
		const existingUrls = new Set(
			existingItems.filter((item) => item.repoUrl !== null).map((item) => item.repoUrl as string)
		);

		const operations = contributions.map((c) => {
			const year = c.mergedAt ? new Date(c.mergedAt).getFullYear().toString() : 'Merged';
			const itemData = {
				title: c.title,
				role: `${c.repo} · merged`,
				repoUrl: c.url,
				period: year,
				description: `Merged pull request in ${c.repo}`,
				order: 0
			};

			if (existingUrls.has(c.url)) {
				return db
					.update(openSource)
					.set({
						title: c.title,
						role: `${c.repo} · merged`,
						period: year
					})
					.where(eq(openSource.repoUrl, c.url))
					.returning();
			} else {
				return db.insert(openSource).values(itemData).returning();
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
