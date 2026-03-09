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

<div class="mx-auto max-w-6xl space-y-12 pb-20">
	<header class="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b-4 border-neutral-900 pb-6 mb-8 mt-2">
		<div class="space-y-2">
			<h1 class="text-3xl font-black uppercase tracking-tighter text-neutral-900">{m.dashboard_credentials_title()}</h1>
			<p class="text-[15px] font-bold text-neutral-500 uppercase tracking-widest">
				{m.dashboard_credentials_description()}
			</p>
		</div>
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

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.certificates as cert (cert.id)}
				<div
					class="flex items-center justify-between border-4 border-neutral-900 bg-white p-6 shadow-[6px_6px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#171717]"
				>
					<div class="space-y-2 pr-4">
						<h4 class="text-[16px] font-black uppercase tracking-tight text-neutral-900 leading-tight">{cert.name}</h4>
						<p class="text-[13px] font-bold uppercase tracking-widest text-[#FF90E8]">{cert.issuer}</p>
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
				<div class="py-16 text-center border-4 border-dashed border-neutral-300 bg-white sm:col-span-2 lg:col-span-3">
					<p class="text-[14px] font-bold uppercase tracking-widest text-neutral-400">No credentials found.</p>
				</div>
			{/each}
		</div>
	</section>
</div>
