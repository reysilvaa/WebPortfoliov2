<script lang="ts">
	import { scrollAnimation } from '$lib/actions/scroll-animation';
	import { parseTags } from '$lib/utils/portfolio';

	type Project = {
		id: string;
		title: string;
		description?: string | null;
		imageUrl?: string | null;
		repoUrl?: string | null;
		liveUrl?: string | null;
		tags?: string | null;
	};

	let { items }: { items: { projects: Project[] } } = $props();

	let projectsLimit = $state(6);
	const displayedProjects = $derived(items.projects.slice(0, projectsLimit));
</script>

{#if items.projects.length > 0}
	<section id="projects" class="mt-40">
		<div class="mb-32 text-right">
			<h2
				use:scrollAnimation
				class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
			>
				Selected Works
			</h2>
			<div
				use:scrollAnimation={{ rootMargin: '-5% 0px -5% 0px' }}
				class="k-anim stretch-out relative mt-6 h-px w-full bg-[#222]/20 delay-2"
			>
				<div class="absolute top-0 right-0 h-full w-24 bg-[#222]"></div>
			</div>
		</div>

		<div class="flex flex-col gap-40">
			{#each displayedProjects as proj, i (proj.id || i)}
				<div class="group relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
					<!-- Image -->
					<div
						use:scrollAnimation
						class="k-anim zoom-in md:col-span-7 md:row-start-1 {i % 2 === 0
							? 'md:col-start-1'
							: 'md:col-start-6'} relative z-0"
					>
						<a
							href={proj.liveUrl || proj.repoUrl || ''}
							target="_blank"
							rel="external noopener noreferrer"
							aria-label="View Project"
							class="block w-full overflow-hidden border border-[#222]/20 bg-white/50 p-2 shadow-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl"
						>
							{#if proj.imageUrl}
								<div class="aspect-video w-full overflow-hidden">
									<img
										src={proj.imageUrl}
										alt={proj.title}
										class="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
									/>
								</div>
							{:else}
								<div
									class="flex aspect-video w-full items-center justify-center bg-[#222] font-mono text-sm tracking-widest text-[#f3edde] uppercase transition-transform duration-700 group-hover:scale-105"
								>
									No Image
								</div>
							{/if}
						</a>
					</div>

					<!-- Text Block -->
					<div
						use:scrollAnimation
						class="k-anim md:col-span-6 md:row-start-1 {i % 2 === 0
							? 'slide-left md:col-start-7 md:-ml-16'
							: 'slide-right md:col-start-1 md:-mr-16'} relative z-10 border border-[#222]/20 bg-[#f3edde]/95 p-8 shadow-[8px_8px_0_rgba(34,34,34,0.08)] backdrop-blur-md transition-all duration-500 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_#222] md:mt-24"
					>
						<div
							class="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase"
						>
							Project {i + 1}
						</div>
						<h3
							class="font-mono text-3xl font-black tracking-tighter text-[#222] uppercase transition-colors duration-300 sm:text-4xl"
						>
							{proj.title}
						</h3>
						<p class="mt-6 font-sans text-sm leading-relaxed text-[#444]">
							{proj.description}
						</p>

						<div class="mt-8 flex flex-wrap gap-2">
							{#each parseTags(proj.tags) as tag, t (tag)}
								<span
									use:scrollAnimation
									class="k-anim fade-up border border-[#222]/20 bg-white/55 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.2em] uppercase transition-all hover:-translate-y-0.5 hover:bg-[#222] hover:text-[#f3edde] hover:shadow-[2px_2px_0_#222]"
									style="transition-delay: {t * 50}ms"
								>
									{tag}
								</span>
							{/each}
						</div>

						<div class="mt-8 flex gap-5 border-t border-[#222]/10 pt-6">
							{#if proj.liveUrl}
								<a
									href={proj.liveUrl}
									target="_blank"
									rel="external noopener noreferrer"
									class="group/btn flex items-center gap-2 font-mono text-[11px] font-black tracking-[0.15em] text-[#222] uppercase transition-colors hover:text-[#666]"
								>
									<span>Live Demo</span>
									<svg
										class="h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
										fill="none"
										stroke="currentColor"
										stroke-width="2.5"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
										/>
									</svg>
								</a>
							{/if}
							{#if proj.repoUrl}
								<a
									href={proj.repoUrl}
									target="_blank"
									rel="external noopener noreferrer"
									class="group/btn flex items-center gap-2 font-mono text-[11px] font-black tracking-[0.15em] text-[#222]/70 uppercase transition-colors hover:text-[#222]"
								>
									<span>Repository</span>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
										/>
									</svg>
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- SHOW MORE -->
		{#if projectsLimit < items.projects.length}
			<div
				use:scrollAnimation
				class="k-anim fade-up mt-32 flex items-center justify-center gap-8 border-t border-[#222]/10 pt-10"
			>
				<button
					onclick={() => (projectsLimit += 6)}
					class="group relative cursor-pointer overflow-hidden border border-[#222]/20 bg-white/50 px-8 py-3 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all"
				>
					<span class="relative z-10 transition-colors group-hover:text-[#f3edde]">Show More</span>
					<div
						class="absolute inset-0 z-0 h-full w-full origin-bottom scale-y-0 bg-[#222] transition-transform duration-300 ease-out group-hover:scale-y-100"
					></div>
				</button>
			</div>
		{/if}
	</section>
{/if}
