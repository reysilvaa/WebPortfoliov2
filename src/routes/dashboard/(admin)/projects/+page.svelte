<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import ProjectItem from '$lib/components/ProjectItem.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

	let { data }: { data: PageData } = $props();

	let syncing = $state(false);
	let searchQuery = $state('');
	let selectedIds = $state<string[]>([]);

	const filteredProjects = $derived(
		data.projects.filter(
			(p) =>
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(p.language?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(p.tags?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
		)
	);

	const allSelected = $derived(
		filteredProjects.length > 0 && selectedIds.length === filteredProjects.length
	);

	function toggleAll() {
		if (allSelected) {
			selectedIds = [];
		} else {
			selectedIds = filteredProjects.map((p) => p.id);
		}
	}

	function toggleSelect(id: string) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	let bulkActionLoading = $state(false);

	// Modal State
	let deleteModalOpen = $state(false);
	let editModalOpen = $state(false);
	let pendingDeleteForm = $state<HTMLFormElement | null>(null);
	let deleteModalTitle = $state('');
	let deleteModalMessage = $state('');

	// Edit State
	let editingProject = $state<{
		id: string;
		title: string;
		description: string | null;
		language: string | null;
		tags: string | null;
		liveUrl: string | null;
		repoUrl: string | null;
	} | null>(null);

	function openEditModal(project: any) {
		editingProject = { ...project };
		editModalOpen = true;
	}

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

<div class="mx-auto max-w-5xl space-y-10 pb-20">
	<header class="flex flex-col justify-between gap-6 md:flex-row md:items-end border-b-4 border-neutral-900 pb-6 mb-8 mt-2">
		<div class="space-y-2">
			<h1 class="text-3xl font-black uppercase tracking-tighter text-neutral-900">{m.dashboard_projects_title()}</h1>
			<p class="text-[15px] font-bold text-neutral-500 uppercase tracking-widest">
				{m.dashboard_projects_description()}
			</p>
		</div>

		<form
			method="POST"
			action="?/sync-github"
			use:enhance={() => {
				syncing = true;
				return async ({ update }) => {
					await update();
					syncing = false;
				};
			}}
		>
			<Button type="submit" isLoading={syncing} class="gap-2">
				{#if !syncing}
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
						class="lucide lucide-refresh-cw"
						><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path
							d="M21 3v5h-5"
						/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path
							d="M3 21v-5h5"
						/></svg
					>
				{/if}
				{m.projects_sync_github()}
			</Button>
		</form>
	</header>

	<div
		class="sticky top-0 z-10 mb-8 border-b-4 border-neutral-900 bg-white/95 pt-4 pb-6 backdrop-blur-md"
	>
		<div class="flex flex-col items-center justify-between gap-6 md:flex-row">
			<div class="relative w-full md:max-w-md">
				<Input
					bind:value={searchQuery}
					placeholder={m.projects_search_placeholder()}
					class="pl-12"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="square"
					class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-900"
					><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
				>
			</div>

			{#if selectedIds.length > 0}
				<div
					class="flex items-center gap-4 border-4 border-neutral-900 bg-[#FF90E8] px-6 py-3 shadow-[4px_4px_0px_0px_#171717]"
				>
					<span class="text-[14px] font-black uppercase tracking-widest text-neutral-900"
						>{selectedIds.length} SELECTED</span
					>

					<div class="flex items-center gap-2">
						<form
							method="POST"
							action="?/bulk-action"
							use:enhance={() => {
								bulkActionLoading = true;
								return async ({ update }) => {
									await update();
									selectedIds = [];
									bulkActionLoading = false;
								};
							}}
						>
							<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
							<input type="hidden" name="type" value="show" />
							<Button variant="outline" size="sm" type="submit" disabled={bulkActionLoading}
								>Show</Button
							>
						</form>

						<form
							method="POST"
							action="?/bulk-action"
							use:enhance={() => {
								bulkActionLoading = true;
								return async ({ update }) => {
									await update();
									selectedIds = [];
									bulkActionLoading = false;
								};
							}}
						>
							<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
							<input type="hidden" name="type" value="hide" />
							<Button variant="outline" size="sm" type="submit" disabled={bulkActionLoading}
								>Hide</Button
							>
						</form>

						<form
							method="POST"
							action="?/bulk-action"
							onsubmit={(e) => openDeleteModal(e, `Delete ${selectedIds.length} projects?`, 'This will permanently remove these projects from your portfolio database.')}
							use:enhance={() => {
								bulkActionLoading = true;
								return async ({ update }) => {
									await update();
									selectedIds = [];
									bulkActionLoading = false;
								};
							}}
						>
							<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
							<input type="hidden" name="type" value="delete" />
							<Button variant="danger" size="sm" type="submit" disabled={bulkActionLoading}
								>Delete</Button
							>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<section class="space-y-4">
		<div
			class="flex items-center border-b border-neutral-100 px-6 py-3 text-[12px] font-semibold tracking-widest text-neutral-400 uppercase"
		>
			<div class="mr-4 flex w-10 justify-center">
				<input
					type="checkbox"
					checked={allSelected}
					onchange={toggleAll}
					class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
				/>
			</div>
			<div class="flex-1">Project Details</div>
			<div class="hidden w-32 md:block">Stats</div>
			<div class="w-24 text-right">Visibility</div>
		</div>

		<div
			class="divide-y-4 divide-neutral-900 overflow-hidden border-4 border-neutral-900 bg-white shadow-[8px_8px_0px_0px_#171717]"
		>
			{#each filteredProjects as project (project.id)}
				<div class="group flex items-center p-6 transition-all hover:bg-neutral-50/50">
					<div class="mr-4 flex w-10 justify-center">
						<input
							type="checkbox"
							checked={selectedIds.includes(project.id)}
							onchange={() => toggleSelect(project.id)}
							class="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
						/>
					</div>

					<ProjectItem project={{ ...project, isHidden: project.isHidden ?? false }} />

					<div class="flex w-24 justify-end gap-2">
						<Button
							variant="outline"
							size="icon"
							type="button"
							class="text-neutral-400"
							onclick={() => openEditModal(project)}
							title="Edit"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
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

						<form method="POST" action="?/toggle-visibility" use:enhance>
							<input type="hidden" name="id" value={project.id} />
							<input type="hidden" name="isHidden" value={(!project.isHidden).toString()} />
							<Button
								variant="ghost"
								size="icon"
								type="submit"
								class="text-neutral-400"
								title={project.isHidden ? 'Show' : 'Hide'}
							>
								{#if project.isHidden}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-eye-off"
										><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path
											d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
										/><path
											d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
										/><line x1="2" x2="22" y1="2" y2="22" /></svg
									>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-eye"
										><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle
											cx="12"
											cy="12"
											r="3"
										/></svg
									>
								{/if}
							</Button>
						</form>

						<form
							method="POST"
							action="?/delete"
							onsubmit={(e) => openDeleteModal(e, `Delete "${project.title}"?`, 'This project will be permanently removed from your portfolio.')}
							use:enhance={() => {
								return async ({ update }) => {
									await update();
								};
							}}
						>
							<input type="hidden" name="id" value={project.id} />
							<Button variant="danger" size="icon" type="submit" class="text-red-300">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
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
				<div class="flex flex-col items-center justify-center py-24 text-center">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-neutral-300"
							><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg
						>
					</div>
					<h3 class="font-medium text-neutral-900">{m.projects_no_results()}</h3>
					<p class="mt-1 text-[13px] text-neutral-500">
						{m.projects_no_results_description()}
					</p>
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
	isLoading={bulkActionLoading}
/>

{#if editModalOpen && editingProject}
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
				bulkActionLoading = true;
				return async ({ update }) => {
					await update();
					editModalOpen = false;
					bulkActionLoading = false;
				};
			}}
			class="relative w-full max-w-2xl border-4 border-neutral-900 bg-white p-8 shadow-[12px_12px_0px_0px_#171717]"
		>
			<div class="mb-6">
				<h2 class="text-2xl font-black uppercase tracking-tighter text-neutral-900 mb-2">
					Edit Project
				</h2>
				<p class="text-[14px] font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
					Update project information.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<input type="hidden" name="id" value={editingProject.id} />
				<div class="col-span-full">
					<Input bind:value={editingProject.title} name="title" label="Title" required />
				</div>
				<div class="col-span-full">
					<Input
						value={editingProject.description || ''}
						oninput={(e) => { if (editingProject) editingProject.description = (e.target as HTMLInputElement).value }}
						name="description"
						label="Description"
						placeholder="Briefly describe what this project is about..."
					/>
				</div>
				<Input
					value={editingProject.language || ''}
					oninput={(e) => { if (editingProject) editingProject.language = (e.target as HTMLInputElement).value }}
					name="language"
					label="Primary Language"
					placeholder="e.g., TypeScript, Python"
				/>
				<Input
					value={editingProject.tags || ''}
					oninput={(e) => { if (editingProject) editingProject.tags = (e.target as HTMLInputElement).value }}
					name="tags"
					label="Tags"
					placeholder="svelte, tailwind, etc. (comma separated)"
				/>
				<Input
					value={editingProject.liveUrl || ''}
					oninput={(e) => { if (editingProject) editingProject.liveUrl = (e.target as HTMLInputElement).value }}
					name="liveUrl"
					label="Live URL"
					placeholder="https://yourapp.com"
				/>
				<Input
					value={editingProject.repoUrl || ''}
					oninput={(e) => { if (editingProject) editingProject.repoUrl = (e.target as HTMLInputElement).value }}
					name="repoUrl"
					label="Repository URL"
					placeholder="https://github.com/..."
				/>
			</div>

			<div class="mt-8 flex justify-end gap-4">
				<Button variant="outline" type="button" onclick={() => (editModalOpen = false)}>
					Cancel
				</Button>
				<Button type="submit" isLoading={bulkActionLoading}>Save Changes</Button>
			</div>
		</form>
	</div>
{/if}
