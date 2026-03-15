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
	let role = $state('');
	let company = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let description = $state('');

	let editingExperience = $state<{
		id: string;
		role: string;
		company: string;
		startDate: string;
		endDate: string | null;
		description: string | null;
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
			<h1 class="text-3xl font-black uppercase tracking-tighter text-neutral-900">Experiences</h1>
			<p class="text-[15px] font-bold text-neutral-500 uppercase tracking-widest">
				{m.dashboard_projects_description()}
			</p>
		</div>
	</header>

	<section class="space-y-10">
		<Card title="Add Experience" description="Add a new experience.">
			<form method="POST" action="?/add" use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
					role = '';
					company = '';
					startDate = '';
					endDate = '';
					description = '';
				};
			}} class="space-y-6">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input bind:value={role} name="role" label="Role" placeholder="e.g., Software Engineer" required />
					<Input
						bind:value={company}
						name="company"
						label="Company"
						placeholder="e.g., Google"
						required
					/>
					<Input bind:value={startDate} name="startDate" label="Start Date" placeholder="e.g., Jan 2022" required />
					<Input bind:value={endDate} name="endDate" label="End Date" placeholder="e.g., Present" />
				</div>
				<Input bind:value={description} name="description" label="Description" placeholder="What did you do there?" />
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">
						Add Experience
					</Button>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.experiences as exp (exp.id)}
				<div
					class="flex items-center justify-between border-4 border-neutral-900 bg-white p-6 shadow-[6px_6px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#171717]"
				>
					<div class="space-y-2 pr-4">
						<h4 class="text-[16px] font-black uppercase tracking-tight text-neutral-900">{exp.role}</h4>
						<p class="text-[13px] font-bold uppercase tracking-widest text-[#FF90E8]">{exp.company}</p>
						<p class="text-[11px] font-bold text-neutral-500 uppercase">{exp.startDate} - {exp.endDate || 'Present'}</p>
					</div>
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="icon"
							type="button"
							class="text-neutral-400"
							onclick={() => {
								editingExperience = { ...exp };
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
								><path
									d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
								/><path d="m15 5 4 4" /></svg
							>
						</Button>
						<form
							method="POST"
							action="?/delete"
							onsubmit={(e) =>
								openDeleteModal(
									e,
									`Delete experience at "${exp.company}"?`,
									'This will permanently remove this record from your history.'
								)}
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={exp.id} />
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
					<p class="text-[14px] font-bold uppercase tracking-widest text-neutral-400">No experiences found.</p>
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

{#if editModalOpen && editingExperience}
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
					Edit Experience
				</h2>
				<p class="text-[14px] font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
					Update experience details.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<input type="hidden" name="id" value={editingExperience.id} />
				<Input
					bind:value={editingExperience.role}
					name="role"
					label="Role"
					placeholder="e.g., Software Engineer"
					required
				/>
				<Input
					bind:value={editingExperience.company}
					name="company"
					label="Company"
					placeholder="e.g., Google"
					required
				/>
				<Input
					bind:value={editingExperience.startDate}
					name="startDate"
					label="Start Date"
					placeholder="e.g., Jan 2022"
					required
				/>
				<Input
					value={editingExperience.endDate || ''}
					oninput={(e) => { if (editingExperience) editingExperience.endDate = (e.target as HTMLInputElement).value }}
					name="endDate"
					label="End Date"
					placeholder="e.g., Present"
				/>
				<div class="col-span-full">
					<Input
						value={editingExperience.description || ''}
						oninput={(e) => { if (editingExperience) editingExperience.description = (e.target as HTMLInputElement).value }}
						name="description"
						label="Description"
						placeholder="What did you do there?"
					/>
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
