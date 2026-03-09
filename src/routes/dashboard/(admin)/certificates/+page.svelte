<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let name = $state('');
	let issuer = $state('');
	let credentialUrl = $state('');

</script>

<div class="space-y-12">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">{m.dashboard_credentials_title()}</h1>
		<p class="text-[14px] text-neutral-500">{m.dashboard_credentials_description()}</p>
	</header>

	<section class="max-w-2xl space-y-10">
		<Card title="Add Entry" description="Add a new certification or award.">
			<form method="POST" action="?/add" use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
					name = '';
					issuer = '';
					credentialUrl = '';
				};
			}} class="space-y-6">
				<Input bind:value={name} name="name" label="Certificate Name" required />
				<Input bind:value={issuer} name="issuer" label="Issuer" placeholder="e.g., Google, Coursera" required />
				<Input bind:value={credentialUrl} name="credentialUrl" label="Verification URL" placeholder="https://..." />
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">
						Add Credential
					</Button>
				</div>
			</form>
		</Card>

		<div class="space-y-3">
			{#each data.certificates as cert (cert.id)}
				<div
					class="flex items-center justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 transition-all hover:bg-neutral-50/50"
				>
					<div class="space-y-1">
						<h4 class="text-[15px] font-semibold text-neutral-900">{cert.name}</h4>
						<p class="text-[13px] text-neutral-500">{cert.issuer}</p>
					</div>
					<form method="POST" action="?/delete" use:enhance={() => {
						return async ({ update }) => {
							if (confirm('Delete this credential?')) {
								await update();
							}
						};
					}}>
						<input type="hidden" name="id" value={cert.id} />
						<Button variant="danger" size="sm" type="submit">
							{m.common_delete()}
						</Button>
					</form>
				</div>
			{:else}
				<div class="py-12 text-center rounded-2xl border border-dashed border-neutral-200">
					<p class="text-[14px] text-neutral-400">No credentials found.</p>
				</div>
			{/each}
		</div>
	</section>
</div>
