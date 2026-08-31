import { GITHUB_TOKEN_PERSONAL, GITHUB_TOKEN_ORGANIZATION } from '$env/static/private';

export interface GitHubRepository {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	topics: string[];
	created_at: string;
	updated_at: string;
	owner: {
		login: string;
		type: string;
	};
}

export class GithubService {
	private static async api<T>(path: string, token: string): Promise<T | null> {
		if (!token) return null;

		try {
			const response = await fetch(`https://api.github.com${path}`, {
				headers: {
					Authorization: `token ${token}`,
					Accept: 'application/vnd.github.v3+json'
				}
			});

			if (!response.ok) {
				console.error(`GitHub API error (${path}):`, response.status);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error(`Error fetching GitHub API (${path}):`, error);
			return null;
		}
	}

	private static async fetchRepos(token: string, query = ''): Promise<GitHubRepository[]> {
		return (await this.api<GitHubRepository[]>(`/user/repos${query}`, token)) ?? [];
	}

	static async getAllRepositories(): Promise<GitHubRepository[]> {
		const [personalRepos, orgRepos] = await Promise.all([
			this.fetchRepos(GITHUB_TOKEN_PERSONAL, '?sort=updated&per_page=100'),
			this.fetchRepos(GITHUB_TOKEN_ORGANIZATION, '?type=all&sort=updated&per_page=100')
		]);

		// Merge and deduplicate by ID
		const allRepos = [...personalRepos, ...orgRepos];
		const uniqueRepos = Array.from(new Map(allRepos.map((repo) => [repo.id, repo])).values());

		return uniqueRepos;
	}

	static async getProfileInfo() {
		const data = await this.api<{
			name: string | null;
			bio: string | null;
			avatar_url: string | null;
			html_url: string | null;
			email: string | null;
		}>('/user', GITHUB_TOKEN_PERSONAL);

		if (!data) return null;

		return {
			name: data.name ?? undefined,
			bio: data.bio ?? undefined,
			avatarUrl: data.avatar_url,
			github: data.html_url,
			email: data.email
		};
	}
}
