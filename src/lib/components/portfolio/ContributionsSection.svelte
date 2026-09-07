<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { scrollAnimation } from '$lib/actions/scroll-animation';
	import type {
		OpenSource,
		GitHubContribution,
		GitHubCommit,
		RepoContributionGroup,
		RepoCommitGroup
	} from '$lib/types';

	let { openSource = [] }: { openSource?: OpenSource[] } = $props();

	let contributions = $state<GitHubContribution[] | null>(null);
	let commits = $state<GitHubCommit[]>([]);
	let expandedRepos = $state<Record<string, boolean>>({});
	let expandedCommitRepos = $state<Record<string, boolean>>({});

	const packages = $derived(openSource.filter((os) => !os.role.toLowerCase().includes('merged')));
	const dbContributions = $derived<GitHubContribution[]>(
		openSource
			.filter((os) => os.role.toLowerCase().includes('merged'))
			.map((os) => ({
				repo: os.role.replace(' · merged', ''),
				title: os.title,
				url: os.repoUrl || '#'
			}))
	);
	const displayContributions = $derived<GitHubContribution[]>(
		contributions && contributions.length > 0 ? contributions : dbContributions
	);

	const groupedContributions = $derived.by<RepoContributionGroup[]>(() => {
		const groups: Record<string, GitHubContribution[]> = {};
		for (const c of displayContributions) {
			if (!groups[c.repo]) {
				groups[c.repo] = [];
			}
			groups[c.repo].push(c);
		}
		return Object.entries(groups).map(([repo, prs]) => ({ repo, prs }));
	});

	const groupedCommits = $derived.by<RepoCommitGroup[]>(() => {
		const groups: Record<string, GitHubCommit[]> = {};
		for (const cm of commits) {
			if (!groups[cm.repo]) {
				groups[cm.repo] = [];
			}
			groups[cm.repo].push(cm);
		}
		return Object.entries(groups).map(([repo, repoCommits]) => ({
			repo,
			commits: repoCommits
		}));
	});

	function toggleRepo(repo: string) {
		expandedRepos[repo] = !expandedRepos[repo];
	}

	function toggleCommitRepo(repo: string) {
		expandedCommitRepos[repo] = !expandedCommitRepos[repo];
	}

	function formatCommitDate(dateStr?: string) {
		if (!dateStr) return '';
		try {
			const d = new Date(dateStr);
			return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-CA');
		} catch {
			return '';
		}
	}

	onMount(() => {
		fetch('/api/contributions')
			.then((r) => r.json())
			.then((d) => {
				contributions = Array.isArray(d?.contributions) ? d.contributions : [];
				commits = Array.isArray(d?.commits) ? d.commits : [];
			})
			.catch(() => (contributions = []));
	});
</script>

{#if packages.length > 0 || displayContributions.length > 0 || commits.length > 0}
	<section id="contributions" class="mt-40">
		<div class="mb-24 text-center">
			<h2
				use:scrollAnimation
				class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
			>
				Open Source
			</h2>
			<div
				use:scrollAnimation={{ rootMargin: '-5% 0px -5% 0px' }}
				class="k-anim stretch-out mx-auto mt-6 h-px w-24 bg-[#222] delay-2"
			></div>
		</div>

		{#if packages.length > 0}
			<div class="mb-10 flex items-center justify-between gap-4">
				<h3 class="font-mono text-[11px] font-bold tracking-[0.2em] text-[#222]/50 uppercase">
					Featured Projects & Roles
				</h3>
				<span class="h-px flex-1 bg-[#222]/10"></span>
			</div>
			<div class="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each packages as os (os.id)}
					<a
						href={os.repoUrl || '#'}
						target={os.repoUrl ? '_blank' : undefined}
						rel="external noopener noreferrer"
						use:scrollAnimation
						class="k-anim fade-up group flex flex-col gap-2 border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
					>
						<span class="font-mono text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase">
							{os.role}
							{#if os.period}· {os.period}{/if}
						</span>
						<h4
							class="font-mono text-base leading-snug font-black tracking-tight text-[#222] uppercase transition-colors group-hover:text-[#666]"
						>
							{os.title}
						</h4>
						{#if os.description}
							<p class="line-clamp-2 font-mono text-xs text-[#555]">
								{os.description}
							</p>
						{/if}
					</a>
				{/each}
			</div>
		{/if}

		{#if groupedContributions.length > 0}
			<div class="mb-10 flex items-center justify-between gap-4">
				<h3 class="font-mono text-[11px] font-bold tracking-[0.2em] text-[#222]/50 uppercase">
					Merged Pull Requests
				</h3>
				<span class="h-px flex-1 bg-[#222]/10"></span>
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each groupedContributions as group (group.repo)}
					<div
						use:scrollAnimation
						class="k-anim fade-up flex flex-col justify-between border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
					>
						<div>
							<div class="flex items-center justify-between gap-3 border-b border-[#222]/10 pb-3">
								<a
									href="https://github.com/{group.repo}"
									target="_blank"
									rel="external noopener noreferrer"
									class="flex items-center gap-1.5 font-mono text-sm font-black tracking-tight break-all text-[#222] uppercase transition-colors hover:text-[#666] sm:text-base"
								>
									<span>{group.repo}</span>
									<span class="font-mono text-[10px] font-normal text-[#888]">↗</span>
								</a>
								<span
									class="shrink-0 border border-[#222]/15 bg-white/70 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.15em] text-[#555] uppercase"
								>
									{group.prs.length}
									{group.prs.length === 1 ? 'PR MERGED' : 'PRS MERGED'}
								</span>
							</div>

							<div class="mt-4 flex flex-col gap-2">
								<span
									class="font-mono text-[9px] font-bold tracking-[0.2em] text-[#555]/80 uppercase"
								>
									Latest Contribution
								</span>
								<a
									href={group.prs[0].url}
									target="_blank"
									rel="external noopener noreferrer"
									class="group/item flex flex-col gap-1.5 border border-[#222]/10 bg-white/60 p-3 transition-colors hover:border-[#222] hover:bg-[#f3edde]"
								>
									<div class="flex items-start justify-between gap-2">
										<h4
											class="font-mono text-xs leading-snug font-bold tracking-tight text-[#222] uppercase group-hover/item:text-[#666] sm:text-[13px]"
										>
											{group.prs[0].title}
										</h4>
										<span class="shrink-0 font-mono text-[10px] text-[#555]">↗</span>
									</div>
								</a>
							</div>
						</div>

						{#if group.prs.length > 1}
							<div class="mt-4 pt-2">
								<button
									type="button"
									onclick={() => toggleRepo(group.repo)}
									class="flex w-full cursor-pointer items-center justify-between border border-dashed border-[#222]/20 px-3 py-2 font-mono text-[10px] font-bold tracking-[0.15em] text-[#444] uppercase transition-colors hover:border-[#222] hover:bg-[#f3edde]"
								>
									<span>
										{expandedRepos[group.repo] ? 'Hide' : 'Show'}
										{group.prs.length - 1} More {group.prs.length - 1 === 1 ? 'Node' : 'Nodes'}
									</span>
									<span
										class="text-xs transition-transform duration-200"
										class:rotate-180={expandedRepos[group.repo]}
									>
										↓
									</span>
								</button>

								{#if expandedRepos[group.repo]}
									<div
										transition:slide={{ duration: 250 }}
										class="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto pr-1"
									>
										{#each group.prs.slice(1) as pr (pr.url)}
											<a
												href={pr.url}
												target="_blank"
												rel="external noopener noreferrer"
												class="group/sub flex items-start justify-between gap-3 border border-[#222]/10 bg-white/40 p-2.5 transition-colors hover:border-[#222] hover:bg-[#f3edde]"
											>
												<span
													class="font-mono text-xs leading-snug font-semibold text-[#222] uppercase group-hover/sub:text-[#666]"
												>
													{pr.title}
												</span>
												<span class="shrink-0 font-mono text-[9px] text-[#555]">↗</span>
											</a>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		{#if groupedCommits.length > 0}
			<div class="mt-16 mb-10 flex items-center justify-between gap-4">
				<h3 class="font-mono text-[11px] font-bold tracking-[0.2em] text-[#222]/50 uppercase">
					Recent External Commits
				</h3>
				<span class="h-px flex-1 bg-[#222]/10"></span>
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each groupedCommits as gc (gc.repo)}
					<div
						use:scrollAnimation
						class="k-anim fade-up flex flex-col justify-between border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
					>
						<div>
							<div class="flex items-center justify-between gap-3 border-b border-[#222]/10 pb-3">
								<a
									href="https://github.com/{gc.repo}"
									target="_blank"
									rel="external noopener noreferrer"
									class="flex items-center gap-1.5 font-mono text-sm font-black tracking-tight break-all text-[#222] uppercase transition-colors hover:text-[#666] sm:text-base"
								>
									<span>{gc.repo}</span>
									<span class="font-mono text-[10px] font-normal text-[#888]">↗</span>
								</a>
								<span
									class="shrink-0 border border-[#222]/15 bg-white/70 px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.15em] text-[#555] uppercase"
								>
									{gc.commits.length}
									{gc.commits.length === 1 ? 'COMMIT' : 'COMMITS'}
								</span>
							</div>

							<div class="mt-4 flex flex-col gap-2">
								<span
									class="font-mono text-[9px] font-bold tracking-[0.2em] text-[#555]/80 uppercase"
								>
									Latest Commit
								</span>
								<a
									href={gc.commits[0].url}
									target="_blank"
									rel="external noopener noreferrer"
									class="group/item flex flex-col gap-1.5 border border-[#222]/10 bg-white/60 p-3 transition-colors hover:border-[#222] hover:bg-[#f3edde]"
								>
									<div class="flex items-start justify-between gap-2">
										<span
											class="font-mono text-xs leading-snug font-bold tracking-tight text-[#222] uppercase group-hover/item:text-[#666] sm:text-[13px]"
										>
											{gc.commits[0].message}
										</span>
										<span class="shrink-0 font-mono text-[10px] text-[#555]">↗</span>
									</div>
									{#if gc.commits[0].date}
										<span class="font-mono text-[9px] tracking-wider text-[#666] uppercase">
											{formatCommitDate(gc.commits[0].date)}
										</span>
									{/if}
								</a>
							</div>
						</div>

						{#if gc.commits.length > 1}
							<div class="mt-4 pt-2">
								<button
									type="button"
									onclick={() => toggleCommitRepo(gc.repo)}
									class="flex w-full cursor-pointer items-center justify-between border border-dashed border-[#222]/20 px-3 py-2 font-mono text-[10px] font-bold tracking-[0.15em] text-[#444] uppercase transition-colors hover:border-[#222] hover:bg-[#f3edde]"
								>
									<span>
										{expandedCommitRepos[gc.repo] ? 'Hide' : 'Show'}
										{gc.commits.length - 1} More {gc.commits.length - 1 === 1
											? 'Commit'
											: 'Commits'}
									</span>
									<span
										class="text-xs transition-transform duration-200"
										class:rotate-180={expandedCommitRepos[gc.repo]}
									>
										↓
									</span>
								</button>

								{#if expandedCommitRepos[gc.repo]}
									<div
										transition:slide={{ duration: 250 }}
										class="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto pr-1"
									>
										{#each gc.commits.slice(1) as cm (cm.url)}
											<a
												href={cm.url}
												target="_blank"
												rel="external noopener noreferrer"
												class="group/sub flex items-baseline justify-between gap-3 border border-[#222]/10 bg-white/40 p-2.5 transition-colors hover:border-[#222] hover:bg-[#f3edde]"
											>
												<span
													class="truncate font-mono text-xs leading-snug font-semibold text-[#222] uppercase group-hover/sub:text-[#666]"
												>
													{cm.message}
												</span>
												<span class="shrink-0 font-mono text-[9px] text-[#555]">
													{formatCommitDate(cm.date)}
												</span>
											</a>
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</section>
{/if}
