<script lang="ts">
	import { scrollAnimation } from '$lib/actions/scroll-animation';

	type Experience = {
		id: string;
		role: string;
		company: string;
		startDate: string;
		endDate?: string | null;
		description?: string | null;
	};
	let { items }: { items: { experiences: Experience[] } } = $props();
</script>

{#if items.experiences.length > 0}
	<section id="work" class="mt-40">
		<div class="mb-32">
			<h2
				use:scrollAnimation
				class="k-anim mask-up text-center font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl md:text-left"
			>
				Experience
			</h2>
			<div
				use:scrollAnimation={{ rootMargin: '-5% 0px -5% 0px' }}
				class="k-anim stretch-out relative mt-6 h-px w-full bg-[#222]/20 delay-2"
			>
				<div class="absolute top-0 left-0 h-full w-24 bg-[#222]"></div>
			</div>
		</div>

		<!-- Editorial Timeline Layout -->
		<div class="relative ml-4 border-l border-[#222]/20 pl-8 md:ml-12 md:pl-16">
			{#each items.experiences as exp, i (exp.id || i)}
				<div
					use:scrollAnimation
					class="k-anim fade-up group relative mb-20 last:mb-0"
					style="transition-delay: {(i % 3) * 100}ms"
				>
					<!-- Node (rotated square) -->
					<div
						class="absolute top-2.5 left-[-36.5px] h-2.5 w-2.5 rotate-45 border border-[#222] bg-[#f3edde] ring-4 ring-[#f3edde] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#222] md:left-[-68.5px]"
					></div>

					<!-- Horizontal connector line -->
					<div
						class="absolute top-3.5 -left-8 h-px w-8 bg-[#222]/15 transition-colors duration-300 group-hover:bg-[#222]/40 md:-left-16 md:w-16"
					></div>

					<div
						class="-m-4 grid grid-cols-1 items-start gap-6 rounded p-4 transition-all duration-300 hover:bg-white/20 md:grid-cols-12"
					>
						<div class="flex flex-col items-start gap-2 md:col-span-4">
							<span
								class="inline-block border border-[#222]/25 bg-white/40 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.2em] text-[#222] uppercase shadow-[2px_2px_0_rgba(34,34,34,0.05)]"
							>
								{exp.startDate} — {exp.endDate ?? 'Present'}
							</span>
							<h3
								class="mt-2 font-mono text-2xl leading-none font-black tracking-tight text-[#222] uppercase"
							>
								{exp.company}
							</h3>
						</div>

						<div class="border-l border-[#222]/10 pl-6 md:col-span-8 md:pl-8">
							<h4 class="text-lg font-bold tracking-wide text-[#222] uppercase">{exp.role}</h4>
							{#if exp.description}
								<p class="mt-4 font-sans text-sm leading-relaxed text-[#555]">
									{exp.description}
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}
