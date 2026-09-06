/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { ResumeService } from './resume.service';

vi.mock('pdfmake', () => ({
	default: {
		setFonts: vi.fn(),
		createPdf: vi.fn().mockReturnValue({
			getBuffer: vi.fn().mockResolvedValue(Buffer.from('mock pdf content'))
		})
	}
}));

describe('ResumeService', () => {
	it('should generate PDF buffer and filename', async () => {
		const mockContent: any = {
			profile: { name: 'Reynald Silva' },
			experiences: [],
			projects: [],
			skills: [],
			certificates: [],
			education: [],
			openSource: []
		};

		const result = await ResumeService.generatePdfBuffer(mockContent);

		expect(result).toBeDefined();
		expect(result.fileName).toBe('Reynald_Silva_CV.pdf');
		expect(result.buffer).toBeDefined();
	});
});
