<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollAnimation } from '$lib/actions/scroll-animation';

	type Contribution = { repo: string; title: string; url: string };

	let contributions = $state<Contribution[] | null>(null);

	onMount(() => {
		fetch('/api/contributions')
			.then((r) => r.json())
			.then((d) => (contributions = Array.isArray(d?.contributions) ? d.contributions : []))
			.catch(() => (contributions = []));
	});
</script>

{#if contributions && contributions.length > 0}
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

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each contributions as c (c.url)}
				<a
					href={c.url}
					target="_blank"
					rel="external noopener noreferrer"
					use:scrollAnimation
					class="k-anim fade-up group flex flex-col gap-2 border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
				>
					<span
						class="font-mono text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase"
					>
						{c.repo} · merged
					</span>
					<h3
						class="font-mono text-base leading-snug font-black tracking-tight text-[#222] uppercase transition-colors group-hover:text-[#666]"
					>
						{c.title}
					</h3>
				</a>
			{/each}
		</div>
	</section>
{/if}