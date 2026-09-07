export interface OpenSource {
	id: string;
	title: string;
	role: string;
	repoUrl?: string | null;
	period?: string | null;
	description?: string | null;
	order?: number | null;
	createdAt?: Date | null;
	updatedAt?: Date | null;
}

export interface GitHubContribution {
	repo: string;
	title: string;
	url: string;
	mergedAt?: string | null;
}

export interface GitHubCommit {
	repo: string;
	message: string;
	url: string;
	date?: string;
}

export interface RepoContributionGroup {
	repo: string;
	prs: GitHubContribution[];
}

export interface RepoCommitGroup {
	repo: string;
	commits: GitHubCommit[];
}
