<script lang="ts">
	import { resolve } from '$app/paths';

	let {
		items,
		activeSection
	}: {
		items: {
			experiences: unknown[];
			projects: unknown[];
			skills: unknown[];
			certificates: unknown[];
		};
		activeSection: string;
	} = $props();
</script>

<nav
	class="pointer-events-auto fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
>
	<span class="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#222]/40 uppercase"
		>Start</span
	>

	<a
		href="{resolve('/')}#hero"
		aria-label="Go to Hero"
		class="group relative flex h-10 w-8 items-center justify-center"
	>
		<span
			class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
		>
			Intro
		</span>
		<div
			class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
			'hero'
				? 'scale-110 bg-[#222]'
				: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
		></div>
	</a>

	{#if items.experiences.length > 0}
		<div class="h-6 border-l border-dashed border-[#222]/25"></div>
		<a
			href="{resolve('/')}#work"
			aria-label="Go to Experience"
			class="group relative flex h-10 w-8 items-center justify-center"
		>
			<span
				class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
			>
				Experience
			</span>
			<div
				class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
				'work'
					? 'scale-110 bg-[#222]'
					: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
			></div>
		</a>
	{/if}

	{#if items.projects.length > 0}
		<div class="h-6 border-l border-dashed border-[#222]/25"></div>
		<a
			href="{resolve('/')}#projects"
			aria-label="Go to Projects"
			class="group relative flex h-10 w-8 items-center justify-center"
		>
			<span
				class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
			>
				Projects
			</span>
			<div
				class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
				'projects'
					? 'scale-110 bg-[#222]'
					: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
			></div>
		</a>
	{/if}

	{#if items.skills.length > 0}
		<div class="h-6 border-l border-dashed border-[#222]/25"></div>
		<a
			href="{resolve('/')}#skills"
			aria-label="Go to Skills"
			class="group relative flex h-10 w-8 items-center justify-center"
		>
			<span
				class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
			>
				Toolbox
			</span>
			<div
				class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
				'skills'
					? 'scale-110 bg-[#222]'
					: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
			></div>
		</a>
	{/if}

	{#if items.certificates.length > 0}
		<div class="h-6 border-l border-dashed border-[#222]/25"></div>
		<a
			href="{resolve('/')}#certificates"
			aria-label="Go to Credentials"
			class="group relative flex h-10 w-8 items-center justify-center"
		>
			<span
				class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
			>
				Credentials
			</span>
			<div
				class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
				'certificates'
					? 'scale-110 bg-[#222]'
					: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
			></div>
		</a>
	{/if}

	<span class="mt-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#222]/40 uppercase"
		>Now</span
	>
</nav>
