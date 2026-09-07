<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollAnimation } from '$lib/actions/scroll-animation';
	import type { OpenSource } from '$lib/types/open-source';

	type Contrib = { repo: string; title: string; url: string };
	type Commit = { repo: string; message: string; url: string };

	let { openSource = [] }: { openSource?: OpenSource[] } = $props();

	let contributions = $state<Contrib[] | null>(null);
	let commits = $state<Commit[]>([]);

	const packages = $derived(openSource.filter((os) => !os.role.toLowerCase().includes('merged')));
	const dbContributions = $derived(
		openSource
			.filter((os) => os.role.toLowerCase().includes('merged'))
			.map((os) => ({
				repo: os.role.replace(' · merged', ''),
				title: os.title,
				url: os.repoUrl || '#'
			}))
	);
	const displayContributions = $derived(
		contributions && contributions.length > 0 ? contributions : dbContributions
	);

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

		{#if displayContributions.length > 0}
			<div class="mb-10 flex items-center justify-between gap-4">
				<h3 class="font-mono text-[11px] font-bold tracking-[0.2em] text-[#222]/50 uppercase">
					Merged Pull Requests
				</h3>
				<span class="h-px flex-1 bg-[#222]/10"></span>
			</div>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each displayContributions as c (c.url)}
					<a
						href={c.url}
						target="_blank"
						rel="external noopener noreferrer"
						use:scrollAnimation
						class="k-anim fade-up group flex flex-col gap-2 border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
					>
						<span class="font-mono text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase">
							{c.repo} · merged
						</span>
						<h4
							class="font-mono text-base leading-snug font-black tracking-tight text-[#222] uppercase transition-colors group-hover:text-[#666]"
						>
							{c.title}
						</h4>
					</a>
				{/each}
			</div>
		{/if}

		{#if commits.length > 0}
			<div class="mt-16 mb-10 flex items-center justify-between gap-4">
				<h3 class="font-mono text-[11px] font-bold tracking-[0.2em] text-[#222]/50 uppercase">
					Recent External Commits
				</h3>
				<span class="h-px flex-1 bg-[#222]/10"></span>
			</div>
			<ul class="divide-y divide-[#222]/10 border border-[#222]/15 bg-white/40">
				{#each commits as cm (cm.url)}
					<li>
						<a
							href={cm.url}
							target="_blank"
							rel="external noopener noreferrer"
							class="group flex items-baseline justify-between gap-6 p-4 transition-colors hover:bg-[#f3edde]"
						>
							<span
								class="truncate font-mono text-[13px] font-bold tracking-tight text-[#222] uppercase group-hover:text-[#666]"
							>
								{cm.message}
							</span>
							<span class="shrink-0 font-mono text-[9px] tracking-[0.2em] text-[#555] uppercase">
								{cm.repo}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/if}
