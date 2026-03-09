<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

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

<div class="mx-auto max-w-4xl space-y-12">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">{m.dashboard_skills_title()}</h1>
		<p class="text-[14px] text-neutral-500">{m.dashboard_skills_description()}</p>
	</header>

	<section class="space-y-10">
		<Card title="Add Skill" description="Add a new technical capability.">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input bind:value={name} label="Skill Name" placeholder="e.g., SvelteKit" required />
					<Input
						bind:value={category}
						label="Category"
						placeholder="e.g., Frontend, Backend"
						required
					/>
				</div>
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">
						Add Skill
					</Button>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.skills as skill (skill.id)}
				<div
					class="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:bg-neutral-50/50"
				>
					<div class="space-y-1">
						<h4 class="text-[15px] font-semibold text-neutral-900">{skill.name}</h4>
						<p class="text-[13px] text-neutral-500">{skill.category}</p>
					</div>
					<Button variant="danger" size="icon" onclick={() => deleteEntry(skill.id)}>
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
					</Button>
				</div>
			{:else}
				<div class="py-12 text-center rounded-2xl border border-dashed border-neutral-200 sm:col-span-2 lg:col-span-3">
					<p class="text-[14px] text-neutral-400">No skills found.</p>
				</div>
			{/each}
		</div>
	</section>
</div>
