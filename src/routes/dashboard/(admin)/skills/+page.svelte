<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let name = $state('');
	let category = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		try {
			const res = await fetch('/api/skills', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, category })
			});
			if (res.ok) {
				name = '';
				category = '';
				await invalidateAll();
			}
		} finally {
			loading = false;
		}
	}

	async function deleteEntry(id: string) {
		if (!confirm('Are you sure?')) return;
		await fetch(`/api/skills/${id}`, { method: 'DELETE' });
		await invalidateAll();
	}
</script>

<div class="space-y-16">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">Stack</h1>
		<p class="text-[14px] text-neutral-500">Manage your technical capabilities.</p>
	</header>

	<section class="space-y-8">
		<form
			onsubmit={handleSubmit}
			class="max-w-xl space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-6"
		>
			<h3 class="mb-4 text-[13px] font-semibold tracking-widest text-neutral-400 uppercase">
				Add Skill
			</h3>
			<input
				bind:value={name}
				placeholder="Skill Name (e.g., SvelteKit)"
				required
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<input
				bind:value={category}
				placeholder="Category (e.g., Frontend, Backend)"
				required
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<button
				type="submit"
				disabled={loading}
				class="h-11 w-full rounded-lg bg-neutral-900 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
			>
				{loading ? 'Adding...' : 'Add Skill'}
			</button>
		</form>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each data.skills as skill}
				<div class="flex items-center justify-between rounded-xl border border-neutral-100 p-4">
					<div class="space-y-1">
						<h4 class="text-[14px] font-medium">{skill.name}</h4>
						<p class="text-[12px] text-neutral-400">{skill.category}</p>
					</div>
					<button
						onclick={() => deleteEntry(skill.id)}
						class="text-[12px] font-medium text-red-500 hover:text-red-700">Delete</button
					>
				</div>
			{:else}
				<p
					class="text-[13px] text-neutral-400 py-8 text-center bg-neutral-50 rounded-xl sm:col-span-2"
				>
					No skills found.
				</p>
			{/each}
		</div>
	</section>
</div>
