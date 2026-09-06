import { env } from '$env/dynamic/private';

const GITHUB_TOKEN_PERSONAL = env.GITHUB_TOKEN_PERSONAL || '';
const GITHUB_TOKEN_ORGANIZATION = env.GITHUB_TOKEN_ORGANIZATION || '';

interface GitHubRepository {
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
	owner: { login: string; type: string };
}

const GITHUB_USERNAME = env.GITHUB_USERNAME || 'reysilvaa';

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
	private static async request<T>(path: string, token?: string): Promise<T | null> {
		try {
			const res = await fetch(`https://api.github.com${path}`, {
				headers: {
					Accept: 'application/vnd.github+json',
					'User-Agent': 'portfolio',
					...(token ? { Authorization: `token ${token}` } : {})
				}
			});
			return res.ok ? ((await res.json()) as T) : null;
		} catch {
			return null;
		}
	}

	static async getAllRepositories(): Promise<GitHubRepository[]> {
		const [personal, org] = await Promise.all([
			this.request<GitHubRepository[]>('/user/repos?sort=updated&per_page=100', GITHUB_TOKEN_PERSONAL),
			this.request<GitHubRepository[]>('/user/repos?type=all&sort=updated&per_page=100', GITHUB_TOKEN_ORGANIZATION)
		]);

		const map = new Map<number, GitHubRepository>();
		for (const r of [...(personal ?? []), ...(org ?? [])]) map.set(r.id, r);
		return Array.from(map.values());
	}

	static async getExternalContributions(): Promise<{
		contributions: { repo: string; title: string; url: string; mergedAt: string | null }[];
		commits: { repo: string; message: string; url: string; date: string }[];
	}> {
		const [ownRepos, orgRepos] = await Promise.all([
			this.request<GitHubRepository[]>('/user/repos?affiliation=owner&per_page=100', GITHUB_TOKEN_PERSONAL),
			this.request<GitHubRepository[]>('/user/repos?affiliation=owner&per_page=100', GITHUB_TOKEN_ORGANIZATION)
		]);

		const ownOwners = new Set([
			GITHUB_USERNAME.toLowerCase(),
			'rey-workbench',
			...(env.GITHUB_ORGANIZATION ? [env.GITHUB_ORGANIZATION.toLowerCase()] : []),
			...[...(ownRepos ?? []), ...(orgRepos ?? [])].map((r) => r.owner.login.toLowerCase())
		]);
		const isExternal = (repo: string) => {
			const owner = repo.split('/')[0]?.toLowerCase();
			return Boolean(owner && !ownOwners.has(owner));
		};

		const seenPrs = new Set<string>();
		const contributions: { repo: string; title: string; url: string; mergedAt: string | null }[] = [];
		const prQuery = encodeURIComponent(`author:${GITHUB_USERNAME} is:pr is:merged`);

		for (let page = 1; page <= 2; page++) {
			const data = await this.request<{ items?: SearchIssue[] }>(
				`/search/issues?q=${prQuery}&per_page=100&page=${page}`
			);
			const items = data?.items ?? [];
			if (items.length === 0) break;

			for (const issue of items) {
				const repo = issue.repository_url.replace('https://api.github.com/repos/', '');
				if (!isExternal(repo)) continue;
				const key = `${repo}#${issue.number}`;
				if (seenPrs.has(key)) continue;
				seenPrs.add(key);
				contributions.push({
					repo,
					title: issue.title,
					url: issue.html_url,
					mergedAt: issue.pull_request?.merged_at ?? null
				});
			}
			if (items.length < 100) break;
		}

		const commits: { repo: string; message: string; url: string; date: string }[] = [];
		const commitQuery = encodeURIComponent(`author:${GITHUB_USERNAME}`);
		const commitData = await this.request<{ items?: CommitItem[] }>(
			`/search/commits?q=${commitQuery}&sort=committer-date&order=desc&per_page=100`
		);

		for (const item of commitData?.items ?? []) {
			const repo = item.repository?.full_name;
			if (!repo || !isExternal(repo)) continue;
			commits.push({
				repo,
				message: item.commit?.message.split('\n')[0].slice(0, 80),
				url: item.html_url,
				date: item.commit?.committer?.date ?? ''
			});
			if (commits.length >= 8) break;
		}

		return { contributions, commits };
	}

	static async getProfileInfo() {
		const data = await this.request<{
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
