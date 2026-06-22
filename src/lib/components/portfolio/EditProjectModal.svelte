<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	let {
		isOpen = $bindable(false),
		project = null,
		onSave
	}: {
		isOpen: boolean;
		project: {
			id: string;
			title: string;
			description: string | null;
			language: string | null;
			tags: string | null;
			liveUrl: string | null;
			repoUrl: string | null;
		} | null;
		onSave: () => void;
	} = $props();

	let loading = $state(false);

	let editData = $state<{
		id: string;
		title: string;
		description: string;
		language: string;
		tags: string;
		liveUrl: string;
		repoUrl: string;
	}>({
		id: '',
		title: '',
		description: '',
		language: '',
		tags: '',
		liveUrl: '',
		repoUrl: ''
	});

	// React to project prop changes
	$effect(() => {
		if (project) {
			editData = {
				id: project.id,
				title: project.title,
				description: project.description || '',
				language: project.language || '',
				tags: project.tags || '',
				liveUrl: project.liveUrl || '',
				repoUrl: project.repoUrl || ''
			};
		}
	});

	function close() {
		isOpen = false;
	}
</script>

{#if isOpen && project}
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/60 backdrop-blur-sm"
			onclick={close}
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
					loading = false;
					onSave();
				};
			}}
			class="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl"
		>
			<div class="mb-6">
				<h2 class="mb-2 text-[24px] font-semibold tracking-tight text-brand-text">Edit Project</h2>
				<p class="text-[14px] text-neutral-500">Update project information.</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<input type="hidden" name="id" value={editData.id} />
				<div class="col-span-full">
					<Input bind:value={editData.title} name="title" label="Title" required />
				</div>
				<div class="col-span-full">
					<Input
						bind:value={editData.description}
						name="description"
						label="Description"
						placeholder="Briefly describe what this project is about..."
					/>
				</div>
				<Input
					bind:value={editData.language}
					name="language"
					label="Primary Language"
					placeholder="e.g., TypeScript, Python"
				/>
				<Input
					bind:value={editData.tags}
					name="tags"
					label="Tags"
					placeholder="svelte, tailwind, etc. (comma separated)"
				/>
				<Input
					bind:value={editData.liveUrl}
					name="liveUrl"
					label="Live URL"
					placeholder="https://yourapp.com"
				/>
				<Input
					bind:value={editData.repoUrl}
					name="repoUrl"
					label="Repository URL"
					placeholder="https://github.com/..."
				/>
			</div>

			<div class="mt-8 flex justify-end gap-4">
				<Button variant="outline" type="button" onclick={close}>Cancel</Button>
				<Button type="submit" isLoading={loading}>Save Changes</Button>
			</div>
		</form>
	</div>
{/if}
