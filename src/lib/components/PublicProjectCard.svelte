<script lang="ts">
	interface Project {
		title: string;
		description: string | null;
		liveUrl: string | null;
		repoUrl: string | null;
		tags: string | null;
	}

	let { project }: { project: Project } = $props();
</script>

<!-- eslint-disable @inlang/paraglide-js/no-unresolved-href -->
<a
	href={project.liveUrl || project.repoUrl || '#'}
	target="_blank"
	rel="noopener noreferrer"
	class="group flex h-full flex-col justify-between border-2 border-neutral-900 bg-white p-6 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
>
	<div class="space-y-4">
		<div class="flex items-start justify-between">
			<h3 class="text-[18px] font-bold tracking-tight text-neutral-900">
				{project.title}
			</h3>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="square"
				stroke-linejoin="miter"
				class="text-neutral-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-neutral-900"
			>
				<path d="M7 17L17 7M17 7H7M17 7V17" />
			</svg>
		</div>
		<p class="text-[14px] leading-relaxed text-neutral-600 line-clamp-3">
			{project.description}
		</p>
	</div>
	{#if project.tags}
		<div class="mt-6 flex flex-wrap gap-2">
			{#each (project.tags || '').split(',').map((t) => t.trim()).filter(Boolean) as tag (tag)}
				<span class="border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
					{tag}
				</span>
			{/each}
		</div>
	{/if}
</a>
