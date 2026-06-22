/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioService } from './portfolio.service';
import { db } from '$lib/server/db';

// Mock the drizzle db instance
vi.mock('$lib/server/db', () => {
	return {
		db: {
			select: vi.fn().mockReturnThis(),
			from: vi.fn().mockReturnThis(),
			where: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			offset: vi.fn().mockReturnThis(),
			orderBy: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			set: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			values: vi.fn().mockReturnThis(),
			delete: vi.fn().mockReturnThis(),
			returning: vi.fn()
		}
	};
});

describe('PortfolioService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should have a getProfile method', () => {
		expect(typeof PortfolioService.getProfile).toBe('function');
	});

	it('should get a profile', async () => {
		// Basic mock setup for a query
		vi.mocked((db as any).limit).mockResolvedValueOnce([{ id: 'main', name: 'John Doe' }] as any);

		const result = await PortfolioService.getProfile();
		expect((db as any).select).toHaveBeenCalled();
		expect((db as any).from).toHaveBeenCalled();
		expect(result).toEqual({ id: 'main', name: 'John Doe' });
	});

	it('should be able to add a project', async () => {
		const mockProject = { id: '1', title: 'Test Project' };
		vi.mocked((db as any).returning).mockResolvedValueOnce([mockProject] as any);

		const result = await PortfolioService.addProject({
			title: 'Test Project',
			description: 'Test'
		} as any);

		expect((db as any).insert).toHaveBeenCalled();
		expect((db as any).values).toHaveBeenCalledWith({ title: 'Test Project', description: 'Test' });
		expect(result).toEqual([mockProject]);
	});

	describe('Certificates', () => {
		it('should be able to add a certificate', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.addCertificate({ name: 'Test', issuer: 'Issuer' } as any);
			expect((db as any).insert).toHaveBeenCalled();
		});

		it('should be able to update a certificate', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.updateCertificate('1', { name: 'Test Update' } as any);
			expect((db as any).update).toHaveBeenCalled();
		});

		it('should be able to delete a certificate', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.deleteCertificate('1');
			expect((db as any).delete).toHaveBeenCalled();
		});
	});

	describe('Skills', () => {
		it('should be able to add a skill', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.addSkill({ name: 'Svelte' } as any);
			expect((db as any).insert).toHaveBeenCalled();
		});

		it('should be able to update a skill', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.updateSkill('1', { name: 'Svelte 5' } as any);
			expect((db as any).update).toHaveBeenCalled();
		});

		it('should be able to delete a skill', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.deleteSkill('1');
			expect((db as any).delete).toHaveBeenCalled();
		});
	});

	describe('Experiences', () => {
		it('should be able to add an experience', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.addExperience({ company: 'Acme', role: 'Dev' } as any);
			expect((db as any).insert).toHaveBeenCalled();
		});

		it('should be able to update an experience', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.updateExperience('1', { role: 'Senior Dev' } as any);
			expect((db as any).update).toHaveBeenCalled();
		});

		it('should be able to delete an experience', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.deleteExperience('1');
			expect((db as any).delete).toHaveBeenCalled();
		});
	});

	describe('Other missing methods', () => {
		it('should get all content', async () => {
			vi.mocked((db as any).limit).mockResolvedValue([{}] as any); // mock getProfile inner logic
			vi.mocked((db as any).orderBy).mockResolvedValue([] as any); // mock lists

			const content = await PortfolioService.getAllContent();
			expect(content).toBeDefined();
			expect(content.profile).toBeDefined();
		});

		it('should update profile', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: 'main' }] as any);
			await PortfolioService.updateProfile({ name: 'Rey' });
			expect((db as any).insert).toHaveBeenCalled(); // updateProfile uses INSERT ON CONFLICT
		});

		it('should get paginated projects', async () => {
			vi.mocked((db as any).orderBy).mockReturnThis();
			vi.mocked((db as any).limit).mockReturnThis();
			vi.mocked((db as any).offset).mockResolvedValueOnce([{ id: '1' }] as any);
			vi.mocked((db as any).where).mockResolvedValueOnce([{ count: 1 }] as any);

			const result = await PortfolioService.getPaginatedProjects(1, 10);
			expect(result.projects.length).toBe(1);
			expect(result.total).toBe(1);
		});

		it('should update a project', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.updateProject('1', { title: 'Updated Project' } as any);
			expect((db as any).update).toHaveBeenCalled();
		});

		it('should delete a project', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			await PortfolioService.deleteProject('1');
			expect((db as any).delete).toHaveBeenCalled();
		});
	});
});
