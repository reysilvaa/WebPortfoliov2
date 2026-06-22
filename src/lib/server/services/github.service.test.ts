import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GithubService } from './github.service';

// Mock the environment variables used by GithubService
vi.mock('$env/static/private', () => ({
	GITHUB_TOKEN_PERSONAL: 'mock_personal_token',
	GITHUB_TOKEN_ORGANIZATION: 'mock_org_token'
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GithubService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should get all repositories from personal and org tokens', async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: true,
				json: async () => [{ id: 1, name: 'repo1' }]
			})
			.mockResolvedValueOnce({
				ok: true,
				json: async () => [{ id: 2, name: 'repo2' }]
			});

		const repos = await GithubService.getAllRepositories();

		expect(repos.length).toBe(2);
		expect(repos[0].name).toBe('repo1');
		expect(repos[1].name).toBe('repo2');
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it('should handle fetch errors gracefully for repositories', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 401,
			text: async () => 'Unauthorized'
		});

		const repos = await GithubService.getAllRepositories();

		expect(repos).toEqual([]);
	});

	it('should get profile info', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				name: 'Test User',
				bio: 'Test Bio',
				avatar_url: 'http://test.com/avatar.jpg',
				html_url: 'http://github.com/test',
				email: 'test@test.com'
			})
		});

		const profile = await GithubService.getProfileInfo();

		expect(profile).toBeDefined();
		expect(profile?.name).toBe('Test User');
		expect(profile?.bio).toBe('Test Bio');
	});

	it('should return null for profile info on fetch failure', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false
		});

		const profile = await GithubService.getProfileInfo();

		expect(profile).toBeNull();
	});
});
