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
		project
	}: {
		project: Project;
	} = $props();

	const snapshotUrl = $derived(project.liveUrl || project.repoUrl);
	const previewUrl = $derived(
		project.imageUrl ||
			(snapshotUrl
				? `https://api.microlink.io?url=${encodeURIComponent(snapshotUrl)}&screenshot=true&meta=false&embed=screenshot.url`
				: null)
	);
</script>

<a
	href={project.liveUrl || project.repoUrl || '#'}
	target="_blank"
	rel="noopener noreferrer external"
	class="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-brand-surface text-brand-text transition-all duration-700 hover:scale-[1.02] hover:border-neutral-300 hover:shadow-xl"
>
	<!-- Image Container -->
	<div class="relative aspect-4/3 w-full overflow-hidden bg-neutral-200">
		{#if previewUrl}
			<img
				src={previewUrl}
				alt={project.title}
				class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
			/>
		{:else}
			<div
				class="flex h-full w-full items-center justify-center bg-brand-bg text-brand-surface-light opacity-90"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="opacity-50"
					><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle
						cx="9"
						cy="9"
						r="2"
					/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
				>
			</div>
		{/if}
	</div>

	<!-- Content Container -->
	<div class="flex flex-1 flex-col justify-between p-6 sm:p-8">
		<div class="space-y-4">
			<div class="flex items-start justify-between gap-4">
				<h3 class="font-sans text-[20px] leading-tight font-semibold">
					{project.title}
				</h3>
				<div
					class="shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg
					>
				</div>
			</div>

			<p class="line-clamp-3 text-[14px] leading-relaxed font-normal text-neutral-600">
				{project.description || 'Discover more detail by exploring the repository or live site.'}
			</p>
		</div>

		<div class="mt-8 flex items-center justify-between">
			{#if project.tags}
				<div class="flex flex-wrap gap-2">
					{#each (project.tags || '')
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
						.slice(0, 2) as tag (tag)}
						<span
							class="rounded-full bg-neutral-900/10 px-3 py-1 text-[11px] font-medium tracking-wide"
						>
							{tag}
						</span>
					{/each}
				</div>
			{:else}
				<div class="flex gap-4 text-neutral-500">
					<div class="flex items-center gap-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><polygon
								points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
							/></svg
						>
						<span class="text-[13px]">{project.stars || 0}</span>
					</div>
					<div class="flex items-center gap-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle
								cx="18"
								cy="6"
								r="3"
							/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" /></svg
						>
						<span class="text-[13px]">{project.forks || 0}</span>
					</div>
				</div>
			{/if}

			{#if project.language}
				<span class="text-[12px] font-medium text-neutral-500">
					{project.language}
				</span>
			{/if}
		</div>
	</div>
</a>
