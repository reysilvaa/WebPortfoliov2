<script lang="ts">
	import FormModal from '$lib/components/ui/FormModal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import type { Project } from '$lib/types';

	let {
		isOpen = $bindable(false),
		project = null,
		onSave
	}: {
		isOpen: boolean;
		project: Project | null;
		onSave: () => void;
	} = $props();

	let editData = $state({
		id: '',
		title: '',
		description: '',
		language: '',
		tags: '',
		liveUrl: '',
		repoUrl: ''
	});

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
</script>

{#if project}
	<FormModal
		bind:isOpen
		title="Edit Project"
		description="Update project information."
		onSubmitted={onSave}
	>
		<input type="hidden" name="id" value={editData.id} />
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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
	</FormModal>
{/if}
