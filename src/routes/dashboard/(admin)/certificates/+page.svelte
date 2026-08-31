<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FormModal from '$lib/components/ui/FormModal.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { DashboardHeader, DashboardEmptyState, DeleteForm } from '$lib/components/dashboard';
	import { enhance } from '$app/forms';
	import { getCertificatePreviewUrl } from '$lib/utils/portfolio';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let name = $state('');
	let issuer = $state('');
	let credentialUrl = $state('');
	let imageUrl = $state('');

	let editingCertificate = $state<{
		id: string;
		name: string;
		issuer: string;
		credentialUrl: string | null;
		imageUrl: string | null;
	} | null>(null);

	let editModalOpen = $state(false);
</script>

{#snippet certPreview(
	displayUrl: string | null,
	className = 'relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm'
)}
	{#if displayUrl}
		{@const previewUrl = getCertificatePreviewUrl(displayUrl) ?? ''}
		<div class={className}>
			<img src={previewUrl} alt="Preview" class="h-full w-full object-cover" />
		</div>
	{/if}
{/snippet}

<div class="mx-auto max-w-6xl space-y-12 pb-20">
	<DashboardHeader
		title={m.dashboard_credentials_title()}
		description={m.dashboard_credentials_description()}
	/>

	<section class="max-w-2xl space-y-10">
		<Card title="Add Entry" description="Add a new certification or award.">
			<form
				method="POST"
				action="?/add"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						name = '';
						issuer = '';
						credentialUrl = '';
						imageUrl = '';
					};
				}}
				class="space-y-6"
			>
				<Input bind:value={name} name="name" label="Certificate Name" required />
				<Input
					bind:value={issuer}
					name="issuer"
					label="Issuer"
					placeholder="e.g., Google, Coursera"
					required
				/>
				<Input
					bind:value={credentialUrl}
					name="credentialUrl"
					label="Verification URL"
					placeholder="https://..."
				/>
				<Input
					bind:value={imageUrl}
					name="imageUrl"
					label="Direct Image URL (Optional)"
					placeholder="https://... (Overrides automatic preview)"
				/>

				{#if credentialUrl || imageUrl}
					<div class="space-y-4">
						<p class="text-[12px] font-medium text-neutral-500">Preview</p>
						{@render certPreview(imageUrl || credentialUrl)}
					</div>
				{/if}
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">Add Credential</Button>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.certificates as cert (cert.id)}
				<div class="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
					<div class="mb-4 flex-1 space-y-2">
						<h4 class="text-[16px] font-medium text-brand-text">
							{cert.name}
						</h4>
						<p class="text-[13px] text-neutral-500">
							{cert.issuer}
						</p>
					</div>

					{#if cert.credentialUrl || cert.imageUrl}
						{@render certPreview(
							cert.imageUrl || cert.credentialUrl,
							'mb-6 aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm'
						)}
					{/if}

					<div class="flex items-center justify-end gap-2 border-t border-neutral-100 pt-4">
						<Button
							variant="outline"
							size="icon"
							type="button"
							class="text-neutral-400"
							onclick={() => {
								editingCertificate = { ...cert };
								editModalOpen = true;
							}}
							title="Edit"
						>
							<Icon name="pencil" />
						</Button>
						<DeleteForm
							id={cert.id}
							modalTitle={`Delete "${cert.name}"?`}
							modalMessage="This will permanently remove this certification/award from your records."
						/>
					</div>
				</div>
			{:else}
				<DashboardEmptyState message="No credentials found." />
			{/each}
		</div>
	</section>
</div>

{#if editingCertificate}
	<FormModal
		bind:isOpen={editModalOpen}
		title="Edit Credential"
		description="Update certification details."
	>
		<input type="hidden" name="id" value={editingCertificate.id} />
		<div class="space-y-6">
			<Input bind:value={editingCertificate.name} name="name" label="Certificate Name" required />
			<Input
				bind:value={editingCertificate.issuer}
				name="issuer"
				label="Issuer"
				placeholder="e.g., Google, Coursera"
				required
			/>
			<div class="space-y-4">
				<Input
					value={editingCertificate.credentialUrl || ''}
					oninput={(e) => {
						if (editingCertificate)
							editingCertificate.credentialUrl = (e.target as HTMLInputElement).value;
					}}
					name="credentialUrl"
					label="Verification URL"
					placeholder="https://yourapp.com/image.png"
				/>
				<Input
					value={editingCertificate.imageUrl || ''}
					oninput={(e) => {
						if (editingCertificate)
							editingCertificate.imageUrl = (e.target as HTMLInputElement).value;
					}}
					name="imageUrl"
					label="Direct Image URL (Optional)"
					placeholder="https://..."
				/>
				{#if editingCertificate.credentialUrl || editingCertificate.imageUrl}
					{@render certPreview(
						editingCertificate.imageUrl || editingCertificate.credentialUrl
					)}
				{/if}
			</div>
		</div>
	</FormModal>
{/if}
