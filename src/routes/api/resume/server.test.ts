/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './+server';
import { PortfolioService } from '$lib/server/services/portfolio.service';

// Mock the PortfolioService
vi.mock('$lib/server/services/portfolio.service', () => ({
	PortfolioService: {
		getAllContent: vi.fn()
	}
}));

// Mock pdfmake
vi.mock('pdfmake', () => ({
	default: {
		setFonts: vi.fn(),
		createPdf: vi.fn().mockReturnValue({
			getBuffer: vi.fn().mockResolvedValue(Buffer.from('mock pdf content'))
		})
	}
}));

describe('GET /api/resume', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return a PDF response with empty data', async () => {
		vi.mocked(PortfolioService.getAllContent).mockResolvedValueOnce({
			profile: null as any,
			experiences: [],
			projects: [],
			skills: [],
			certificates: []
		});

		const response = await GET({} as any);

		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Type')).toBe('application/pdf');
		expect(response.headers.get('Content-Disposition')).toContain('attachment; filename=');
	});

	it('should handle full data', async () => {
		vi.mocked(PortfolioService.getAllContent).mockResolvedValueOnce({
			profile: { name: 'Test User', email: 'test@example.com' } as any,
			experiences: [
				{ role: 'Developer', company: 'Test Corp', startDate: '2020', description: 'Test desc' }
			] as any,
			projects: [{ title: 'Test Project', tags: 'React, Node', description: 'Test desc' }] as any,
			skills: [{ name: 'Svelte', category: 'Frontend' }] as any,
			certificates: [{ name: 'AWS', issuer: 'Amazon' }] as any
		});

		const response = await GET({} as any);

		expect(response.status).toBe(200);
		expect(PortfolioService.getAllContent).toHaveBeenCalled();
	});
});
