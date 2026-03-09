<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let title = $state('');
	let description = $state('');
	let repoUrl = $state('');
	let liveUrl = $state('');
	let tags = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		try {
			const res = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, description, repoUrl, liveUrl, tags })
			});
			if (res.ok) {
				title = '';
				description = '';
				repoUrl = '';
				liveUrl = '';
				tags = '';
				await invalidateAll();
			}
		} finally {
			loading = false;
		}
	}

	async function deleteProject(id: string) {
		if (!confirm('Are you sure?')) return;
		await fetch(`/api/projects/${id}`, { method: 'DELETE' });
		await invalidateAll();
	}
</script>

<div class="space-y-16">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">Projects</h1>
		<p class="text-[14px] text-neutral-500">Manage your showcase items.</p>
	</header>

	<section class="space-y-8">
		<form
			onsubmit={handleSubmit}
			class="max-w-xl space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-6"
		>
			<h3 class="mb-4 text-[13px] font-semibold tracking-widest text-neutral-400 uppercase">
				Add New Project
			</h3>
			<input
				bind:value={title}
				placeholder="Project Title"
				required
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<textarea
				bind:value={description}
				placeholder="Description"
				required
				class="h-32 w-full rounded-lg border border-neutral-200 px-4 py-3 text-[14px] transition-all outline-none focus:border-neutral-900"
			></textarea>
			<div class="grid grid-cols-2 gap-4">
				<input
					bind:value={repoUrl}
					placeholder="Repo URL"
					class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
				/>
				<input
					bind:value={liveUrl}
					placeholder="Live URL"
					class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
				/>
			</div>
			<input
				bind:value={tags}
				placeholder="Tags (comma separated)"
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<button
				type="submit"
				disabled={loading}
				class="h-11 w-full rounded-lg bg-neutral-900 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
			>
				{loading ? 'Adding...' : 'Add Project'}
			</button>
		</form>

		<div class="space-y-4">
			{#each data.projects as project}
				<div
					class="flex items-center justify-between rounded-xl border border-neutral-100 p-4 transition-all hover:border-neutral-200"
				>
					<div class="space-y-1">
						<h4 class="text-[14px] font-medium">{project.title}</h4>
						<p class="text-[12px] text-neutral-400">{project.tags || 'No tags'}</p>
					</div>
					<button
						onclick={() => deleteProject(project.id)}
						class="text-[12px] font-medium text-red-500 hover:text-red-700">Delete</button
					>
				</div>
			{:else}
				<p class="text-[13px] text-neutral-400 py-8 text-center bg-neutral-50 rounded-xl">
					No projects found.
				</p>
			{/each}
		</div>
	</section>
</div>
