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

interface GithubPullRequestEvent {
	type: string;
	repo: { name: string } | null;
	payload: {
		action: string;
		pull_request?: {
			number: number;
			title: string;
			html_url: string;
			merged: boolean;
			merged_at: string | null;
		};
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

	/**
	 * Merged PRs I authored in repos that are NOT mine or my org's.
	 * fine-grained PATs can't use the Search API, so attribution comes from public
	 * events — ponytail: last ~90 days / 300 events window; a classic token + Search
	 * API later gives full history and authored-commits-in-others'-commits.
	 */
	static async getMergedContributions(): Promise<
		{ repo: string; title: string; url: string; mergedAt: string | null }[]
	> {
		const ownSet = new Set((await this.getAllRepositories()).map((r) => r.full_name));

		const events =
			(await this.api<GithubPullRequestEvent[]>(
				`/users/${GITHUB_USERNAME}/events/public?per_page=100`,
				GITHUB_TOKEN_PERSONAL
			)) ?? [];

		const seen = new Set<string>();
		const contributions: {
			repo: string;
			title: string;
			url: string;
			mergedAt: string | null;
		}[] = [];

		for (const event of events) {
			if (event.type !== 'PullRequestEvent' || event.payload.action !== 'closed') continue;
			const pr = event.payload.pull_request;
			if (!pr?.merged) continue;
			const repo = event.repo?.name;
			if (!repo || ownSet.has(repo)) continue;

			const key = `${repo}#${pr.number}`;
			if (seen.has(key)) continue;
			seen.add(key);
			contributions.push({
				repo,
				title: pr.title,
				url: pr.html_url,
				mergedAt: pr.merged_at ?? null
			});
		}

		return contributions;
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
