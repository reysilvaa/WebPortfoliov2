<script lang="ts">
	interface Project {
		id: string;
		title: string;
		description: string | null;
		liveUrl: string | null;
		repoUrl: string | null;
		imageUrl: string | null;
		tags: string | null;
		language: string | null;
		stars: number | null;
		forks: number | null;
	}

	let { 
		project, 
		isHovered = false
	}: { 
		project: Project, 
		isHovered?: boolean
	} = $props();
</script>

<!-- eslint-disable @inlang/paraglide-js/no-unresolved-href -->
<a
	href={project.liveUrl || project.repoUrl || '#'}
	target="_blank"
	rel="noopener noreferrer"
	class="group relative flex aspect-square flex-col overflow-visible border-4 border-neutral-900 bg-white shadow-[6px_6px_0px_0px_#171717] transition-all duration-500 active:translate-x-1 active:translate-y-1 active:shadow-none
		{isHovered ? 'z-50 -translate-y-4 shadow-[20px_20px_0px_0px_#171717] border-[#FF90E8]' : 'z-10'}"
>
	<!-- Project Photo Container (Adjusted for Square) -->
	<div class="relative h-2/3 w-full overflow-hidden border-b-4 border-neutral-900 bg-neutral-100">
		{#if project.imageUrl}
			<img 
				src={project.imageUrl} 
				alt={project.title} 
				class="h-full w-full object-cover transition-transform duration-700 {isHovered ? 'scale-110' : ''}" 
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center bg-linear-to-br from-[#FFDE59] to-[#FF90E8] p-12 opacity-30">
				<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="square" class="text-neutral-900 opacity-50"><path d="m20.2 11.2-.5 4.5c-.3 2.1-1.7 3.8-3.7 4.2l-4.5.5-4.5-.5c-2-.4-3.4-2.1-3.7-4.2l-.5-4.5.5-4.5c.3-2.1 1.7-3.8 3.7-4.2l4.5-.5 4.5.5c2 .4 3.4 2.1 3.7 4.2l.5 4.5Z"/><path d="M12 7v10"/><path d="M7 12h10"/></svg>
			</div>
		{/if}
	</div>

	<!-- Floating Detail Bubble (Avoidance implementation moves it higher) -->
	<div class="pointer-events-none absolute -top-16 -right-4 -left-4 z-60 transition-all duration-500
		{isHovered ? '-top-48 opacity-100 pointer-events-auto translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'}">
		<div class="relative w-full bg-white p-6 border-4 border-neutral-900 shadow-[12px_12px_0px_0px_#171717]">
			<!-- Speech Bubble Tail -->
			<div class="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-8 rotate-45 border-r-4 border-b-4 border-neutral-900 bg-white"></div>
			
			<div class="space-y-4">
				<div class="flex items-center justify-between border-b-2 border-neutral-900 pb-2">
					<div class="flex gap-4">
						<div class="flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" class="text-neutral-900"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
							<span class="text-[14px] font-black">{project.stars || 0}</span>
						</div>
						<div class="flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" class="text-neutral-900"><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" /></svg>
							<span class="text-[14px] font-black">{project.forks || 0}</span>
						</div>
					</div>
					{#if project.language}
						<span class="bg-[#FF90E8] border-2 border-neutral-900 px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#171717]">
							{project.language}
						</span>
					{/if}
				</div>
				<p class="text-[14px] font-bold leading-relaxed text-neutral-800 line-clamp-4">
					{project.description || 'Discover more detail by exploring the repository or live site.'}
				</p>
			</div>
		</div>
	</div>

	<!-- Main Title & Tags Area (Uniformly aligned at bottom) -->
	<div class="flex flex-1 flex-col justify-between p-6">
		<div class="space-y-3">
			<div class="flex items-start justify-between">
				<h3 class="text-[20px] font-black uppercase tracking-tighter text-neutral-900 group-hover:text-[#FF90E8] transition-colors line-clamp-2">
					{project.title}
				</h3>
				<div class="mt-1 shrink-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
				</div>
			</div>
		</div>

		{#if project.tags}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each (project.tags || '').split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3) as tag (tag)}
					<span class="border-2 border-neutral-900 bg-neutral-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-900 transition-all">
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</a>
