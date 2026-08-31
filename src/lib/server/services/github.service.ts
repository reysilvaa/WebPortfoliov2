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
	commit: { message: string; committer?: { date?: string } };
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

		const allRepos = [...personalRepos, ...orgRepos];
		const uniqueRepos = Array.from(new Map(allRepos.map((repo) => [repo.id, repo])).values());

		return uniqueRepos;
	}

	private static async search<T>(path: string): Promise<T | null> {
		try {
			const response = await fetch(`https://api.github.com${path}`, {					headers: {
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

	static async getExternalContributions(): Promise<{
		contributions: { repo: string; title: string; url: string; mergedAt: string | null }[];
		commits: { repo: string; message: string; url: string; date: string }[];
	}> {
		// "Mine" = my personal account + orgs I own — NOT every repo the
		// default /user/repos call returns (its default affiliation also lists
		// repos I merely collaborate on, which silently filtered out real
		// external PRs like PBL_SportCenter and SIKEP).
		const [ownRepos, orgOwnedRepos] = await Promise.all([
			this.fetchRepos(GITHUB_TOKEN_PERSONAL, '?affiliation=owner&per_page=100'),
			this.fetchRepos(GITHUB_TOKEN_ORGANIZATION, '?affiliation=owner&per_page=100')
		]);
		const ownOwners = new Set<string>([
			GITHUB_USERNAME,
			...ownRepos.map((r) => r.owner.login),
			...orgOwnedRepos.map((r) => r.owner.login)
		]);
		const isExternal = (fullName: string) => {
			const owner = fullName.split('/')[0];
			return !!owner && !ownOwners.has(owner);
		};

		// External repos discovered from the merged-PR sweep — reused below to
		// fetch every commit I pushed there (repo-scoped, dodging the 1000-
		// result cap of an author-wide commit search).
		const externalRepos = new Set<string>();

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
				`/search/issues?q=${prQuery}&sort=updated&order=desc&per_page=100&page=${page}`
			);
			const items = data?.items ?? [];
			if (items.length === 0) break;
			for (const issue of items) {
				const repo = issue.repository_url.replace('https://api.github.com/repos/', '');
				if (!isExternal(repo)) continue;
				externalRepos.add(repo);
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

		// Every commit I authored in the external repos found above, newest
		// first. No artificial cap — SIKEP alone has 70 of them.
		const commits: { repo: string; message: string; url: string; date: string }[] = [];
		for (const repo of externalRepos) {
			const q = encodeURIComponent(`author:${GITHUB_USERNAME} repo:${repo}`);
			for (let page = 1; page <= 2; page++) {
				const commitData = await this.search<{ items?: CommitItem[] }>(
					`/search/commits?q=${q}&sort=committer-date&order=desc&per_page=100&page=${page}`
				);
				const items = commitData?.items ?? [];
				if (items.length === 0) break;
				for (const item of items) {
					commits.push({
						repo,
						message: item.commit?.message.split('\n')[0].slice(0, 80),
						url: item.html_url,
						date: item.commit?.committer?.date ?? ''
					});
				}
				if (items.length < 100) break;
			}
		}
		commits.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

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
