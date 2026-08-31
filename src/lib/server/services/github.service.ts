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

export const GITHUB_USERNAME = 'reysilvaa';

interface SearchIssue {
	number: number;
	title: string;
	html_url: string;
	repository_url: string;
	pull_request?: { merged_at: string | null };
}

interface CommitItem {
	html_url: string;
	repository: { full_name: string };
	commit: { message: string };
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

	private static async search<T>(path: string): Promise<T | null> {
		// Anonymous on purpose: fine-grained PATs can't use the Search API, but
		// anonymous works (10 req/min/IP) — enough for a 10-min-cached section.
		try {
			const response = await fetch(`https://api.github.com${path}`, {					headers: {
						// search/commits requires this preview Accept header
						Accept: 'application/vnd.github+json',
						'User-Agent': 'reysilvaa-portfolio'
					}
			});
			if (!response.ok) {
				console.error(`GitHub Search error (${path}):`, response.status);
				return null;
			}
			return await response.json();
		} catch (error) {
			console.error(`Error on GitHub Search (${path}):`, error);
			return null;
		}
	}

	/**
	 * My merged PRs + recent authored commits in repos that are NOT mine or my org's.
	 * Full history via the Search API (anonymous). "merged" only — the code
	 * demonstrably landed in other projects.
	 */
	static async getExternalContributions(): Promise<{
		contributions: { repo: string; title: string; url: string; mergedAt: string | null }[];
		commits: { repo: string; message: string; url: string }[];
	}> {
		const ownOwners = new Set((await this.getAllRepositories()).map((r) => r.owner.login));
		const isExternal = (fullName: string) => {
			const owner = fullName.split('/')[0];
			return !!owner && !ownOwners.has(owner);
		};

		// Merged pull requests I authored in other repos.
		const seen = new Set<string>();
		const contributions: {
			repo: string;
			title: string;
			url: string;
			mergedAt: string | null;
		}[] = [];
		const prQuery = encodeURIComponent(`author:${GITHUB_USERNAME} is:pr is:merged`);
		for (let page = 1; page <= 2; page++) {
			const data = await this.search<{ items?: SearchIssue[] }>(
				`/search/issues?q=${prQuery}&per_page=100&page=${page}`
			);
			const items = data?.items ?? [];
			if (items.length === 0) break;
			for (const issue of items) {
				const repo = issue.repository_url.replace('https://api.github.com/repos/', '');
				if (!isExternal(repo)) continue;
				const key = `${repo}#${issue.number}`;
				if (seen.has(key)) continue;
				seen.add(key);
				contributions.push({
					repo,
					title: issue.title,
					url: issue.html_url,
					mergedAt: issue.pull_request?.merged_at ?? null
				});
			}
			if (items.length < 100) break;
		}

		// Recent commits I authored in external repos — my code lines wherever they are.
		const commits: { repo: string; message: string; url: string }[] = [];
		const commitQuery = encodeURIComponent(`author:${GITHUB_USERNAME}`);
		const commitData = await this.search<{ items?: CommitItem[] }>(
			`/search/commits?q=${commitQuery}&sort=committer-date&order=desc&per_page=100`
		);
		for (const item of commitData?.items ?? []) {
			const repo = item.repository?.full_name;
			if (!repo || !isExternal(repo)) continue;
			commits.push({
				repo,
				message: item.commit?.message.split('\n')[0].slice(0, 80),
				url: item.html_url
			});
			if (commits.length >= 8) break;
		}

		return { contributions, commits };
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
