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
	private static async fetchRepos(
		token: string,
		type: 'user' | 'org' = 'user'
	): Promise<GitHubRepository[]> {
		if (!token) return [];

		try {
			// For personal token, 'user/repos' gets everything (personal + orgs if authorized)
			// But the user specifically asked for both tokens.
			const url =
				type === 'user'
					? 'https://api.github.com/user/repos?sort=updated&per_page=100'
					: 'https://api.github.com/user/repos?type=all&sort=updated&per_page=100'; // Actually user/repos with proper token works

			const response = await fetch(url, {
				headers: {
					Authorization: `token ${token}`,
					Accept: 'application/vnd.github.v3+json'
				}
			});

			if (!response.ok) {
				const error = await response.text();
				console.error(`GitHub API error (${type}):`, response.status, error);
				return [];
			}

			return await response.json();
		} catch (error) {
			console.error(`Error fetching GitHub repositories (${type}):`, error);
			return [];
		}
	}

	static async getAllRepositories(): Promise<GitHubRepository[]> {
		const [personalRepos, orgRepos] = await Promise.all([
			this.fetchRepos(GITHUB_TOKEN_PERSONAL, 'user'),
			this.fetchRepos(GITHUB_TOKEN_ORGANIZATION, 'org')
		]);

		// Merge and deduplicate by ID
		const allRepos = [...personalRepos, ...orgRepos];
		const uniqueRepos = Array.from(new Map(allRepos.map((repo) => [repo.id, repo])).values());

		return uniqueRepos;
	}
}
