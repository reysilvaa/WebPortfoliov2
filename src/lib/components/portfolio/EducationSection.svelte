<script lang="ts">
	import { scrollAnimation } from '$lib/actions/scroll-animation';
	import type { Education } from '$lib/types';

	let { items }: { items: { education: Education[] } } = $props();
</script>

{#if items.education.length > 0}
	<section id="education" class="mt-40">
		<div class="mb-32">
			<h2
				use:scrollAnimation
				class="k-anim mask-up text-center font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl md:text-left"
			>
				Education
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
			{#each items.education as edu, i (edu.id || i)}
				<div
					use:scrollAnimation
					class="k-anim fade-up group relative mb-16 last:mb-0"
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
						<div class="flex flex-col items-start gap-2 md:col-span-5">
							<span
								class="inline-block border border-[#222]/25 bg-white/40 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.2em] text-[#222] uppercase shadow-[2px_2px_0_rgba(34,34,34,0.05)]"
							>
								{edu.period}
							</span>
							<h3
								class="mt-2 font-mono text-2xl leading-none font-black tracking-tight text-[#222] uppercase"
							>
								{edu.school}
							</h3>
							{#if edu.location}
								<span class="font-mono text-xs text-[#555] uppercase">
									{edu.location}
								</span>
							{/if}
						</div>

						<div class="flex flex-col md:col-span-7">
							<p class="font-mono text-base font-bold text-[#222]">
								{edu.degree}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}
