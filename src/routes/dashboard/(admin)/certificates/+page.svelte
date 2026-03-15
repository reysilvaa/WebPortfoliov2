<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

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

	// Modal State
	let deleteModalOpen = $state(false);
	let editModalOpen = $state(false);
	let pendingDeleteForm = $state<HTMLFormElement | null>(null);
	let deleteModalTitle = $state('');
	let deleteModalMessage = $state('');

	function openDeleteModal(e: Event, title: string, message: string) {
		e.preventDefault();
		pendingDeleteForm = e.target as HTMLFormElement;
		deleteModalTitle = title;
		deleteModalMessage = message;
		deleteModalOpen = true;
	}

	function handleConfirm() {
		if (pendingDeleteForm) {
			pendingDeleteForm.requestSubmit();
		}
		deleteModalOpen = false;
	}
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
					imageUrl = '';
				};
			}} class="space-y-6">
				<Input bind:value={name} name="name" label="Certificate Name" required />
				<Input bind:value={issuer} name="issuer" label="Issuer" placeholder="e.g., Google, Coursera" required />
				<Input bind:value={credentialUrl} name="credentialUrl" label="Verification URL" placeholder="https://..." />
				<Input bind:value={imageUrl} name="imageUrl" label="Direct Image URL (Optional)" placeholder="https://... (Overrides automatic preview)" />
				
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
						<p class="text-[12px] font-bold uppercase tracking-widest text-neutral-500">Preview</p>
						<div class="relative w-full aspect-video border-4 border-neutral-900 bg-neutral-100 overflow-hidden shadow-[4px_4px_0px_0px_#171717]">
							<img src={previewUrl} alt="Preview" class="relative z-10 w-full h-full object-cover" />
						</div>
					</div>
				{/if}
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
					class="flex flex-col border-4 border-neutral-900 bg-white p-6 shadow-[6px_6px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#171717]"
				>
					<div class="flex-1 space-y-2 mb-4">
						<h4 class="text-[16px] font-black uppercase tracking-tight text-neutral-900 leading-tight">
							{cert.name}
						</h4>
						<p class="text-[13px] font-bold uppercase tracking-widest text-[#FF90E8]">{cert.issuer}</p>
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
						
						<div class="mb-6 aspect-video w-full overflow-hidden border-2 border-neutral-900 rounded-lg shadow-[2px_2px_0px_0px_#171717] bg-neutral-50">
							<img src={previewUrl} alt="Preview" class="h-full w-full object-cover" />
						</div>
					{/if}

					<div class="flex items-center justify-end gap-2 border-t-2 border-neutral-50 pt-4">
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
						<form
							method="POST"
							action="?/delete"
							onsubmit={(e) =>
								openDeleteModal(
									e,
									`Delete "${cert.name}"?`,
									'This will permanently remove this certification/award from your records.'
								)}
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={cert.id} />
							<Button variant="danger" size="icon" type="submit">
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
						</form>
					</div>
				</div>
			{:else}
				<div class="py-16 text-center border-4 border-dashed border-neutral-300 bg-white sm:col-span-2 lg:col-span-3">
					<p class="text-[14px] font-bold uppercase tracking-widest text-neutral-400">No credentials found.</p>
				</div>
			{/each}
		</div>
	</section>
</div>

<ConfirmModal
	isOpen={deleteModalOpen}
	title={deleteModalTitle}
	message={deleteModalMessage}
	onConfirm={handleConfirm}
	onCancel={() => (deleteModalOpen = false)}
	isLoading={loading}
/>

{#if editModalOpen && editingCertificate}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm border-none cursor-default w-full h-full"
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
			class="relative w-full max-w-2xl border-4 border-neutral-900 bg-white p-8 shadow-[12px_12px_0px_0px_#171717]"
		>
			<div class="mb-6">
				<h2 class="text-2xl font-black uppercase tracking-tighter text-neutral-900 mb-2">
					Edit Credential
				</h2>
				<p class="text-[14px] font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
					Update certification details.
				</p>
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
						oninput={(e) => { if (editingCertificate) editingCertificate.credentialUrl = (e.target as HTMLInputElement).value }}
						name="credentialUrl"
						label="Verification URL"
						placeholder="https://yourapp.com/image.png"
					/>
					<Input
						value={editingCertificate.imageUrl || ''}
						oninput={(e) => { if (editingCertificate) editingCertificate.imageUrl = (e.target as HTMLInputElement).value }}
						name="imageUrl"
						label="Direct Image URL (Optional)"
						placeholder="https://..."
					/>
					{#if editingCertificate.credentialUrl || editingCertificate.imageUrl}
						{@const displayUrl = editingCertificate.imageUrl || editingCertificate.credentialUrl || ''}
						{@const udemyMatch = displayUrl.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
						{@const isDirectImage = displayUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)}
						{@const previewUrl = udemyMatch 
							? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
							: isDirectImage 
								? displayUrl 
								: `https://api.microlink.io?url=${encodeURIComponent(displayUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
						<div class="relative w-full aspect-video border-4 border-neutral-900 bg-neutral-100 overflow-hidden shadow-[4px_4px_0px_0px_#171717]">
							<img src={previewUrl} alt="Preview" class="relative z-10 w-full h-full object-cover" />
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
