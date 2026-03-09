<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let name = $state('');
	let issuer = $state('');
	let credentialUrl = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		try {
			const res = await fetch('/api/certificates', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, issuer, credentialUrl })
			});
			if (res.ok) {
				name = '';
				issuer = '';
				credentialUrl = '';
				await invalidateAll();
			}
		} finally {
			loading = false;
		}
	}

	async function deleteEntry(id: string) {
		if (!confirm('Are you sure?')) return;
		await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
		await invalidateAll();
	}
</script>

<div class="space-y-16">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">Credentials</h1>
		<p class="text-[14px] text-neutral-500">Manage your certifications and awards.</p>
	</header>

	<section class="space-y-8">
		<form
			onsubmit={handleSubmit}
			class="max-w-xl space-y-4 rounded-xl border border-neutral-100 bg-neutral-50 p-6"
		>
			<h3 class="mb-4 text-[13px] font-semibold tracking-widest text-neutral-400 uppercase">
				Add Entry
			</h3>
			<input
				bind:value={name}
				placeholder="Certificate Name"
				required
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<input
				bind:value={issuer}
				placeholder="Issuer (e.g., Google, Coursera)"
				required
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<input
				bind:value={credentialUrl}
				placeholder="Verification URL"
				class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
			/>
			<button
				type="submit"
				disabled={loading}
				class="h-11 w-full rounded-lg bg-neutral-900 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
			>
				{loading ? 'Adding...' : 'Add Credential'}
			</button>
		</form>

		<div class="space-y-4">
			{#each data.certificates as cert}
				<div class="flex items-center justify-between rounded-xl border border-neutral-100 p-4">
					<div class="space-y-1">
						<h4 class="text-[14px] font-medium">{cert.name}</h4>
						<p class="text-[12px] text-neutral-400">{cert.issuer}</p>
					</div>
					<button
						onclick={() => deleteEntry(cert.id)}
						class="text-[12px] font-medium text-red-500 hover:text-red-700">Delete</button
					>
				</div>
			{:else}
				<p class="text-[13px] text-neutral-400 py-8 text-center bg-neutral-50 rounded-xl">
					No credentials found.
				</p>
			{/each}
		</div>
	</section>
</div>
