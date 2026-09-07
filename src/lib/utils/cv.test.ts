import { describe, it, expect } from 'vitest';
import { formatPortfolioToCV } from './cv';
import type { PortfolioContent } from '$lib/types';

describe('formatPortfolioToCV - openSource grouping', () => {
	it('groups multiple merged PRs from the same repository into a single CV entry', () => {
		const mockContent: PortfolioContent = {
			profile: { id: '1', name: 'Reynald', role: 'Dev', bio: 'Bio' },
			experiences: [],
			projects: [],
			skills: [],
			certificates: [],
			education: [],
			openSource: [
				{
					id: '1',
					title: 'lean-ctx',
					role: 'Contributor',
					repoUrl: 'https://github.com/yvgude/lean-ctx',
					period: '2026',
					description: 'Core MCP bugfix in Rust (PR #1463)'
				},
				{
					id: '2',
					title: 'fix(mcp): reply -32601 to unknown pre-init requests',
					role: 'yvgude/lean-ctx · merged',
					repoUrl: 'https://github.com/yvgude/lean-ctx/pull/1463',
					period: '2026'
				},
				{
					id: '3',
					title: 'fix(mcp,doctor): serve MCP under a pty',
					role: 'yvgude/lean-ctx · merged',
					repoUrl: 'https://github.com/yvgude/lean-ctx/pull/1616',
					period: '2026'
				},
				{
					id: '4',
					title: 'fix chart selected kematian',
					role: 'Naufall1/SIKEP · merged',
					repoUrl: 'https://github.com/Naufall1/SIKEP/pull/112',
					period: '2024'
				},
				{
					id: '5',
					title: 'Feature/chart/fix',
					role: 'Naufall1/SIKEP · merged',
					repoUrl: 'https://github.com/Naufall1/SIKEP/pull/102',
					period: '2024'
				},
				{
					id: '6',
					title: 'feat: update package.json',
					role: 'Lukman289/PBL_SportCenter · merged',
					repoUrl: 'https://github.com/Lukman289/PBL_SportCenter/pull/16',
					period: '2025'
				}
			]
		};

		const cv = formatPortfolioToCV(mockContent);

		// Exactly 3 entries: lean-ctx, Naufall1/SIKEP, Lukman289/PBL_SportCenter
		expect(cv.openSource).toHaveLength(3);

		// lean-ctx merged PRs merged into the curated entry
		const leanCtx = cv.openSource.find((os) => os.title === 'lean-ctx');
		expect(leanCtx).toBeDefined();
		expect(leanCtx?.bullets).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ text: expect.stringContaining('Core MCP bugfix') }),
				expect.objectContaining({ text: expect.stringContaining('serve MCP under a pty') })
			])
		);

		// Naufall1/SIKEP consolidated into single entry with 2 bullets
		const sikep = cv.openSource.find((os) => os.title === 'Naufall1/SIKEP');
		expect(sikep).toBeDefined();
		expect(sikep?.role).toBe('Contributor');
		expect(sikep?.period).toBe('2024');
		expect(sikep?.bullets).toHaveLength(2);

		// Lukman289/PBL_SportCenter consolidated into single entry
		const sportCenter = cv.openSource.find((os) => os.title === 'Lukman289/PBL_SportCenter');
		expect(sportCenter).toBeDefined();
		expect(sportCenter?.bullets).toHaveLength(1);
	});
});
