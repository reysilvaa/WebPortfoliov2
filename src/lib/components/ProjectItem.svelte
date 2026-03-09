<script lang="ts">
	interface Project {
		id: string;
		title: string;
		description: string | null;
		language: string | null;
		tags: string | null;
		stars: number | null;
		forks: number | null;
		isHidden: boolean;
	}

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();

</script>

<div class="min-w-0 flex-1 pr-8">
	<div class="mb-1 flex items-center gap-3">
		<h4 class="truncate text-[15px] font-semibold text-neutral-900">
			{project.title}
		</h4>
		{#if project.isHidden}
			<span
				class="inline-flex items-center border border-neutral-900 bg-neutral-200 px-2 py-0.5 text-[10px] font-black tracking-widest text-neutral-600 uppercase"
				>Hidden</span
			>
		{/if}
	</div>

	<p class="mb-2 line-clamp-1 text-[13px] text-neutral-500">
		{project.description || 'No description provided.'}
	</p>

	<div class="flex flex-wrap items-center gap-1.5">
		{#if project.language}
			<span
				class="inline-flex items-center border border-neutral-900 bg-[#FFDE59] px-2 py-0.5 text-[11px] font-black uppercase tracking-widest text-neutral-900"
			>
				{project.language}
			</span>
		{/if}
		{#each (project.tags || '').split(',').slice(0, 3) as tag (tag)}
			{#if tag.trim()}
				<span
					class="inline-flex items-center border border-neutral-900 bg-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400"
				>
					#{tag.trim()}
				</span>
			{/if}
		{/each}
	</div>
</div>

<div class="hidden w-32 flex-col gap-1 md:flex">
	<div class="flex items-center gap-1.5 text-[12px] text-neutral-500">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
		{project.stars || 0}
	</div>
	<div class="flex items-center gap-1.5 text-[12px] text-neutral-500">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" /></svg>
		{project.forks || 0}
	</div>
</div>
