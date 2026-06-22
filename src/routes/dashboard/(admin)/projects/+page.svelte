<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import ProjectItem from '$lib/components/portfolio/ProjectItem.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import EditProjectModal from '$lib/components/portfolio/EditProjectModal.svelte';
	import { DashboardHeader, DeleteForm } from '$lib/components/dashboard';

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

	function openEditModal(project: {
		id: string;
		title: string;
		description: string | null;
		language: string | null;
		tags: string | null;
		liveUrl: string | null;
		repoUrl: string | null;
	}) {
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
	<DashboardHeader
		title={m.dashboard_projects_title()}
		description={m.dashboard_projects_description()}
	>
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
	</DashboardHeader>

	<div
		class="sticky top-0 z-10 mb-8 border-b border-neutral-200 bg-white/95 pt-4 pb-6 backdrop-blur-md"
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
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400"
					><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg
				>
			</div>

			{#if selectedIds.length > 0}
				<div class="flex items-center gap-4 rounded-lg bg-blue-50 px-6 py-3">
					<span class="text-[14px] font-medium text-blue-700">{selectedIds.length} SELECTED</span>

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
							onsubmit={(e) =>
								openDeleteModal(
									e,
									`Delete ${selectedIds.length} projects?`,
									'This will permanently remove these projects from your portfolio database.'
								)}
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
			class="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
		>
			{#each filteredProjects as project (project.id)}
				<div class="group flex items-center p-6 transition-all hover:bg-neutral-50">
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
								><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
									d="m15 5 4 4"
								/></svg
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

						<DeleteForm
							id={project.id}
							modalTitle={`Delete "${project.title}"?`}
							modalMessage="This project will be permanently removed from your portfolio."
						/>
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

<EditProjectModal
	bind:isOpen={editModalOpen}
	project={editingProject}
	onSave={() => {
		editModalOpen = false;
	}}
/>
