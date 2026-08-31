/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioService } from './portfolio.service';
import { db } from '$lib/server/db';

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
			returning: vi.fn().mockResolvedValue([])
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
		vi.mocked((db as any).limit).mockResolvedValueOnce([{ id: 'main', name: 'John Doe' }] as any);

		const result = await PortfolioService.getProfile();
		expect((db as any).select).toHaveBeenCalled();
		expect((db as any).from).toHaveBeenCalled();
		expect(result).toEqual({ id: 'main', name: 'John Doe' });
	});

	it('should be able to add a project', async () => {
		const mockProject = { id: '1', title: 'Test Project' };
		vi.mocked((db as any).returning).mockResolvedValueOnce([mockProject] as any);

		const result = await PortfolioService.addProject(mockProject as any);
		expect((db as any).insert).toHaveBeenCalled();
		expect(result).toEqual([mockProject]);
	});

	describe('CRUD Methods', () => {
		it('should be able to add a certificate', async () => {
			const mockCert = { id: '1', name: 'Cert' };
			vi.mocked((db as any).returning).mockResolvedValueOnce([mockCert] as any);
			const result = await PortfolioService.addCertificate(mockCert as any);
			expect((db as any).insert).toHaveBeenCalled();
			expect(result).toEqual([mockCert]);
		});

		it('should be able to update a certificate', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1', name: 'Updated' }] as any);
			const result = await PortfolioService.updateCertificate('1', { name: 'Updated' } as any);
			expect((db as any).update).toHaveBeenCalled();
			expect(result).toEqual([{ id: '1', name: 'Updated' }]);
		});

		it('should be able to delete a certificate', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			const result = await PortfolioService.deleteCertificate('1');
			expect((db as any).delete).toHaveBeenCalled();
			expect(result).toEqual([{ id: '1' }]);
		});

		it('should be able to add a skill', async () => {
			const mockSkill = { id: '1', name: 'Skill' };
			vi.mocked((db as any).returning).mockResolvedValueOnce([mockSkill] as any);
			const result = await PortfolioService.addSkill(mockSkill as any);
			expect((db as any).insert).toHaveBeenCalled();
			expect(result).toEqual([mockSkill]);
		});

		it('should be able to update a skill', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1', name: 'Updated' }] as any);
			const result = await PortfolioService.updateSkill('1', { name: 'Updated' } as any);
			expect((db as any).update).toHaveBeenCalled();
			expect(result).toEqual([{ id: '1', name: 'Updated' }]);
		});

		it('should be able to delete a skill', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			const result = await PortfolioService.deleteSkill('1');
			expect((db as any).delete).toHaveBeenCalled();
			expect(result).toEqual([{ id: '1' }]);
		});

		it('should be able to add an experience', async () => {
			const mockExp = { id: '1', role: 'Dev' };
			vi.mocked((db as any).returning).mockResolvedValueOnce([mockExp] as any);
			const result = await PortfolioService.addExperience(mockExp as any);
			expect((db as any).insert).toHaveBeenCalled();
			expect(result).toEqual([mockExp]);
		});

		it('should be able to update an experience', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1', role: 'Updated' }] as any);
			const result = await PortfolioService.updateExperience('1', { role: 'Updated' } as any);
			expect((db as any).update).toHaveBeenCalled();
			expect(result).toEqual([{ id: '1', role: 'Updated' }]);
		});

		it('should be able to delete an experience', async () => {
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: '1' }] as any);
			const result = await PortfolioService.deleteExperience('1');
			expect((db as any).delete).toHaveBeenCalled();
			expect(result).toEqual([{ id: '1' }]);
		});
	});

	describe('Other missing methods', () => {
		it('should get all content', async () => {
			vi.mocked((db as any).limit).mockResolvedValue([{}] as any);
			vi.mocked((db as any).orderBy).mockResolvedValue([] as any);

			const content = await PortfolioService.getAllContent();
			expect(content).toBeDefined();
			expect(content.profile).toBeDefined();
		});

		it('should update profile', async () => {
			vi.mocked((db as any).limit).mockResolvedValueOnce([] as any);
			vi.mocked((db as any).returning).mockResolvedValueOnce([{ id: 'main' }] as any);
			await PortfolioService.updateProfile({ name: 'Rey' });
			expect((db as any).insert).toHaveBeenCalled();
		});

		it('should get paginated projects', async () => {
			const listChain = {
				orderBy: vi.fn().mockReturnValue({
					limit: vi.fn().mockReturnValue({
						offset: vi.fn().mockResolvedValueOnce([{ id: '1' }] as any)
					})
				})
			};
			vi.mocked((db as any).where)
				.mockReturnValueOnce(listChain as any)
				.mockResolvedValueOnce([{ count: 1 }] as any);

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
