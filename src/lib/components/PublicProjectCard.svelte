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

<a
	href={project.liveUrl || project.repoUrl || '#'}
	target="_blank"
	rel="noopener noreferrer"
	class="group block space-y-2"
>
	<div class="flex items-center justify-between">
		<h3
			class="text-[15px] font-medium text-neutral-950 decoration-neutral-300 underline-offset-4 transition-all group-hover:underline"
		>
			{project.title}
		</h3>
	</div>
	<p class="text-[14px] leading-relaxed text-neutral-500">
		{project.description}
	</p>
	{#if project.tags}
		<div class="flex flex-wrap gap-3 pt-1">
			{#each (project.tags || '')
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean) as tag}
				<span class="text-[11px] font-medium text-neutral-400">{tag}</span>
			{/each}
		</div>
	{/if}
</a>
