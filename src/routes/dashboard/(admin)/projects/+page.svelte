<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let syncing = $state(false);
	let searchQuery = $state('');
	let selectedIds = $state<string[]>([]);

	const filteredProjects = $derived(
		data.projects.filter(
			(p) =>
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(p.language?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(p.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
		)
	);

	const allSelected = $derived(
		filteredProjects.length > 0 && selectedIds.length === filteredProjects.length
	);

	function toggleAll() {
		if (allSelected) {
			selectedIds = [];
		} else {
			selectedIds = filteredProjects.map((p) => p.id);
		}
	}

	function toggleSelect(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	let bulkActionLoading = $state(false);
</script>

<div class="mx-auto max-w-5xl space-y-10 pb-20">
	<header class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
		<div class="space-y-2">
			<h1 class="text-2xl font-semibold tracking-tight">Portfolio Projects</h1>
			<p class="text-[14px] text-neutral-500">
				Sync and manage your showcase projects from GitHub personal & organization.
			</p>
		</div>

		<div class="flex items-center gap-3">
			<form
				method="POST"
				action="?/sync-github"
				use:enhance={() => {
					syncing = true;
					return async ({ update }) => {
						await update();
						syncing = false;
					};
				}}
			>
				<button
					type="submit"
					disabled={syncing}
					class="inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-5 text-[13px] font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
				>
					{#if syncing}
						<svg class="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24"
							><circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							></circle><path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path></svg
						>
						Syncing...
					{:else}
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
							class="lucide lucide-refresh-cw"
							><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path
								d="M21 3v5h-5"
							/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path
								d="M3 21v-5h5"
							/></svg
						>
						Sync GitHub
					{/if}
				</button>
			</form>
		</div>
	</header>

	<div
		class="sticky top-0 z-10 mb-6 border-b border-neutral-100 bg-white/80 pt-4 pb-4 backdrop-blur-md"
	>
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<div class="relative w-full md:max-w-md">
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
					class="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
					><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
				>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search title, tech, or tags..."
					class="h-11 w-full rounded-xl border border-neutral-200 pr-4 pl-10 text-[14px] transition-all outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5"
				/>
			</div>

			{#if selectedIds.length > 0}
				<div
					class="animate-in fade-in slide-in-from-top-2 flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2"
				>
					<span class="mr-2 text-[12px] font-medium text-neutral-600"
						>{selectedIds.length} selected</span
					>

					<div class="flex items-center gap-1.5">
						<form
							method="POST"
							action="?/bulk-action"
							use:enhance={() => {
								bulkActionLoading = true;
								return async ({ update }) => {
									await update();
									selectedIds = [];
									bulkActionLoading = false;
								};
							}}
						>
							<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
							<input type="hidden" name="type" value="show" />
							<button
								type="submit"
								disabled={bulkActionLoading}
								class="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-[12px] font-medium transition-all hover:border-neutral-900"
								>Show</button
							>
						</form>

						<form
							method="POST"
							action="?/bulk-action"
							use:enhance={() => {
								bulkActionLoading = true;
								return async ({ update }) => {
									await update();
									selectedIds = [];
									bulkActionLoading = false;
								};
							}}
						>
							<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
							<input type="hidden" name="type" value="hide" />
							<button
								type="submit"
								disabled={bulkActionLoading}
								class="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-[12px] font-medium transition-all hover:border-neutral-900"
								>Hide</button
							>
						</form>

						<form
							method="POST"
							action="?/bulk-action"
							use:enhance={() => {
								bulkActionLoading = true;
								if (!confirm(`Delete ${selectedIds.length} projects?`)) return;
								return async ({ update }) => {
									await update();
									selectedIds = [];
									bulkActionLoading = false;
								};
							}}
						>
							<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
							<input type="hidden" name="type" value="delete" />
							<button
								type="submit"
								disabled={bulkActionLoading}
								class="h-8 rounded-lg border border-red-100 bg-red-50 px-3 text-[12px] font-medium text-red-600 transition-all hover:bg-red-100"
								>Delete</button
							>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<section class="space-y-4">
		<div
			class="flex items-center border-b border-neutral-100 px-6 py-3 text-[12px] font-semibold tracking-widest text-neutral-400 uppercase"
		>
			<div class="mr-4 flex w-10 justify-center">
				<input
					type="checkbox"
					checked={allSelected}
					onchange={toggleAll}
					class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
				/>
			</div>
			<div class="flex-1">Project Details</div>
			<div class="hidden w-32 md:block">Stats</div>
			<div class="w-24 text-right">Visibility</div>
		</div>

		<div
			class="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-100 bg-white"
		>
			{#each filteredProjects as project (project.id)}
				<div class="group flex items-center p-6 transition-all hover:bg-neutral-50/50">
					<div class="mr-4 flex w-10 justify-center">
						<input
							type="checkbox"
							checked={selectedIds.includes(project.id)}
							onchange={() => toggleSelect(project.id)}
							class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
						/>
					</div>

					<div class="min-w-0 flex-1 pr-8">
						<div class="mb-1 flex items-center gap-3">
							<h4 class="truncate text-[15px] font-semibold text-neutral-900">
								{project.title}
							</h4>
							{#if project.isHidden}
								<span
									class="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold tracking-tighter text-neutral-500 uppercase"
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
									class="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700"
								>
									{project.language}
								</span>
							{/if}
							{#each (project.tags || '').split(',').slice(0, 3) as tag}
								{#if tag.trim()}
									<span
										class="inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium text-neutral-400"
									>
										#{tag.trim()}
									</span>
								{/if}
							{/each}
						</div>
					</div>

					<div class="hidden w-32 flex-col gap-1 md:flex">
						<div class="flex items-center gap-1.5 text-[12px] text-neutral-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-star"
								><polygon
									points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
								/></svg
							>
							{project.stars || 0}
						</div>
						<div class="flex items-center gap-1.5 text-[12px] text-neutral-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-git-fork"
								><circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle
									cx="18"
									cy="6"
									r="3"
								/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><path d="M12 12v3" /></svg
							>
							{project.forks || 0}
						</div>
					</div>

					<div class="flex w-24 justify-end gap-2">
						<form method="POST" action="?/toggle-visibility" use:enhance>
							<input type="hidden" name="id" value={project.id} />
							<input type="hidden" name="isHidden" value={(!project.isHidden).toString()} />
							<button
								type="submit"
								class="flex items-center justify-center rounded-lg p-2 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-900"
								title={project.isHidden ? 'Show' : 'Hide'}
							>
								{#if project.isHidden}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-eye-off"
										><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path
											d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
										/><path
											d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
										/><line x1="2" x2="22" y1="2" y2="22" /></svg
									>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-eye"
										><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle
											cx="12"
											cy="12"
											r="3"
										/></svg
									>
								{/if}
							</button>
						</form>

						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								return async ({ update }) => {
									if (confirm('Delete this project?')) {
										await update();
									}
								};
							}}
						>
							<input type="hidden" name="id" value={project.id} />
							<button
								type="submit"
								class="flex items-center justify-center rounded-lg p-2 text-red-300 transition-all hover:bg-red-50 hover:text-red-500"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="lucide lucide-trash-2"
									><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
										d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
									/><line x1="10" x2="10" y1="11" y2="17" /><line
										x1="14"
										x2="14"
										y1="11"
										y2="17"
									/></svg
								>
							</button>
						</form>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-24 text-center">
					<div class="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-neutral-300"
							><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg
						>
					</div>
					<h3 class="text-neutral-900 font-medium">No results found</h3>
					<p class="text-[13px] text-neutral-500 mt-1">
						Try adjusting your search query or sync new projects.
					</p>
				</div>
			{/each}
		</div>
	</section>
</div>
