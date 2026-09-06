import { PortfolioService } from '$lib/server/services/portfolio.service';
import { ResumeService } from '$lib/server/services/resume.service';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const content = await PortfolioService.getAllContent();
	const { buffer, fileName } = await ResumeService.generatePdfBuffer(content);

	return new Response(buffer as unknown as BodyInit, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${fileName}"`
		}
	});
};
