<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
	import DashboardEmptyState from '$lib/components/dashboard/DashboardEmptyState.svelte';
	import DeleteForm from '$lib/components/dashboard/DeleteForm.svelte';
	import { enhance } from '$app/forms';

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
					{@const displayUrl = imageUrl || credentialUrl}
					{@const udemyMatch = displayUrl.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
					{@const isDirectImage = displayUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)}
					{@const previewUrl = udemyMatch
						? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
						: isDirectImage
							? displayUrl
							: `https://api.microlink.io?url=${encodeURIComponent(displayUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
					<div class="space-y-4">
						<p class="text-[12px] font-medium text-neutral-500">Preview</p>
						<div
							class="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm"
						>
							<img
								src={previewUrl}
								alt="Preview"
								class="relative z-10 h-full w-full object-cover"
							/>
						</div>
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
						{@const displayUrl = cert.imageUrl || cert.credentialUrl || ''}
						{@const udemyMatch = displayUrl.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
						{@const isDirectImage = displayUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)}
						{@const previewUrl = udemyMatch
							? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
							: isDirectImage
								? displayUrl
								: `https://api.microlink.io?url=${encodeURIComponent(displayUrl)}&screenshot=true&meta=false&embed=screenshot.url`}

						<div
							class="mb-6 aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm"
						>
							<img src={previewUrl} alt="Preview" class="h-full w-full object-cover" />
						</div>
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
								class="lucide lucide-pencil"
								><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
									d="m15 5 4 4"
								/></svg
							>
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

{#if editModalOpen && editingCertificate}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/60 backdrop-blur-sm"
			onclick={() => (editModalOpen = false)}
			aria-label="Close modal"
		></button>

		<!-- Modal -->
		<form
			method="POST"
			action="?/update"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					editModalOpen = false;
					loading = false;
				};
			}}
			class="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl"
		>
			<div class="mb-6">
				<h2 class="mb-2 text-[24px] font-semibold tracking-tight text-brand-text">
					Edit Credential
				</h2>
				<p class="text-[14px] text-neutral-500">Update certification details.</p>
			</div>

			<div class="space-y-6">
				<input type="hidden" name="id" value={editingCertificate.id} />
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
						{@const displayUrl =
							editingCertificate.imageUrl || editingCertificate.credentialUrl || ''}
						{@const udemyMatch = displayUrl.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
						{@const isDirectImage = displayUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)}
						{@const previewUrl = udemyMatch
							? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
							: isDirectImage
								? displayUrl
								: `https://api.microlink.io?url=${encodeURIComponent(displayUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
						<div
							class="relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm"
						>
							<img
								src={previewUrl}
								alt="Preview"
								class="relative z-10 h-full w-full object-cover"
							/>
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-8 flex justify-end gap-4">
				<Button variant="outline" type="button" onclick={() => (editModalOpen = false)}>
					Cancel
				</Button>
				<Button type="submit" isLoading={loading}>Save Changes</Button>
			</div>
		</form>
	</div>
{/if}
