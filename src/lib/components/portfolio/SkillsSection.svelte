<script lang="ts">
	import { scrollAnimation } from '$lib/actions/scroll-animation';

	type Skill = {
		id: string;
		name: string;
		category?: string | null;
		level?: number | null;
	};
	let { items }: { items: { skills: Skill[] } } = $props();

	let activeCategory = $state('All');

	const categories = $derived([
		'All',
		...new Set(
			items.skills.flatMap((s: Skill) =>
				(s.category || 'Other')
					.split(',')
					.map((c: string) => c.trim())
					.filter(Boolean)
			)
		)
	] as string[]);

	const filteredSkills = $derived(
		activeCategory === 'All'
			? items.skills
			: items.skills.filter((s: Skill) => {
					const cats = (s.category || 'Other')
						.split(',')
						.map((c: string) => c.trim())
						.filter(Boolean);
					return cats.includes(activeCategory);
				})
	);
</script>

{#if items.skills.length > 0}
	<section id="skills" class="mt-40">
		<div class="mb-24 text-center">
			<h2
				use:scrollAnimation
				class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
			>
				Toolbox
			</h2>
			<div
				use:scrollAnimation={{ rootMargin: '-5% 0px -5% 0px' }}
				class="k-anim stretch-out mx-auto mt-6 h-px w-24 bg-[#222] delay-2"
			></div>
		</div>

		<!-- Category Filter -->
		<div use:scrollAnimation class="k-anim fade-up mb-12 flex flex-wrap justify-center gap-3">
			{#each categories as cat (cat)}
				<button
					onclick={() => (activeCategory = cat)}
					class="cursor-pointer border px-6 py-2 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all active:scale-95 {activeCategory ===
					cat
						? 'border-[#222] bg-[#222] text-[#f3edde] shadow-[4px_4px_0_#222]'
						: 'border-[#222]/25 bg-white/30 text-[#555] hover:border-[#222] hover:bg-[#222]/5 hover:text-[#222]'}"
				>
					{cat}
				</button>
			{/each}
		</div>

		<!-- Skills Grid -->
		<!-- Key on activeCategory ensures Svelte re-creates elements on filter change,
		     which triggers use:scrollAnimation fresh on each new card -->
		{#key activeCategory}
			<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
				{#each filteredSkills as skill, i (skill.id || skill.name)}
					<div
						use:scrollAnimation
						class="k-anim fade-up group relative flex h-32 flex-col justify-between border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#222] hover:shadow-[6px_6px_0_#222]"
						style="transition-delay: {(i % 4) * 75}ms"
					>
						<div class="flex items-start justify-between">
							<span class="font-mono text-[10px] font-bold tracking-widest text-[#222]/40">
								[{String(i + 1).padStart(2, '0')}]
							</span>
							<span
								class="rounded bg-[#222]/5 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#555] uppercase"
							>
								{skill.category || 'Skill'}
							</span>
						</div>

						<div>
							<h3
								class="font-mono text-base font-black tracking-tight text-[#222] uppercase transition-colors duration-300 group-hover:text-[#666]"
							>
								{skill.name}
							</h3>
						</div>
					</div>
				{/each}
			</div>
		{/key}
	</section>
{/if}
