<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FormModal from '$lib/components/ui/FormModal.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { DashboardHeader, DashboardEmptyState, DeleteForm } from '$lib/components/dashboard';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let title = $state('');
	let role = $state('');
	let repoUrl = $state('');
	let period = $state('');
	let description = $state('');

	let editingOpenSource = $state<{
		id: string;
		title: string;
		role: string;
		repoUrl: string | null;
		period: string | null;
		description: string | null;
	} | null>(null);

	let editModalOpen = $state(false);
</script>

<div class="mx-auto max-w-6xl space-y-12 pb-20">
	<DashboardHeader
		title="Open Source Contributions"
		description="Manage your open-source projects, libraries, and contributions displayed on your portfolio and CV."
	/>

	<section class="space-y-10">
		<Card
			title="Add Open Source Project"
			description="Add an open-source library, tool, or upstream repository contribution."
		>
			<form
				method="POST"
				action="?/add"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						title = '';
						role = '';
						repoUrl = '';
						period = '';
						description = '';
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input
						bind:value={title}
						name="title"
						label="Project / Library Name"
						placeholder="e.g. lean-ctx, aroman-dss"
						required
					/>
					<Input
						bind:value={role}
						name="role"
						label="Role"
						placeholder="e.g. Creator & Maintainer, Contributor"
						required
					/>
					<Input
						bind:value={repoUrl}
						name="repoUrl"
						label="Repository / Package URL"
						placeholder="https://github.com/..."
					/>
					<Input
						bind:value={period}
						name="period"
						label="Period"
						placeholder="e.g. Jan 2025 – Present"
					/>
				</div>

				<Textarea
					bind:value={description}
					name="description"
					label="Description & Highlights (Markdown Bullet Points)"
					placeholder="- Prefix: Description of contribution... [Link Text](https://...)"
				/>

				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto"
						>Add Open Source Project</Button
					>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.openSource as os (os.id)}
				<div
					class="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
				>
					<div class="space-y-2">
						<div class="flex items-start justify-between">
							<h4 class="text-[16px] font-semibold text-brand-text">
								{os.title}
							</h4>
							{#if os.repoUrl}
								<a
									href={os.repoUrl}
									target="_blank"
									rel="external noopener noreferrer"
									class="text-xs text-blue-600 hover:underline"
								>
									View
								</a>
							{/if}
						</div>
						<p class="text-[13px] font-medium text-neutral-600">
							{os.role}
						</p>
						<p class="text-[12px] text-neutral-400">
							{os.period || ''}
						</p>
						{#if os.description}
							<p class="line-clamp-3 text-[12px] text-neutral-500">
								{os.description}
							</p>
						{/if}
					</div>
					<div class="mt-4 flex justify-end gap-2 border-t border-neutral-100 pt-3">
						<Button
							variant="outline"
							size="icon"
							type="button"
							class="text-neutral-400"
							onclick={() => {
								editingOpenSource = { ...os };
								editModalOpen = true;
							}}
							title="Edit"
						>
							<Icon name="pencil" />
						</Button>
						<DeleteForm
							id={os.id}
							modalTitle={`Delete "${os.title}"?`}
							modalMessage="This will permanently remove this open-source contribution."
						/>
					</div>
				</div>
			{:else}
				<DashboardEmptyState message="No open-source contributions recorded yet." />
			{/each}
		</div>
	</section>
</div>

{#if editingOpenSource}
	<FormModal
		bind:isOpen={editModalOpen}
		title="Edit Open Source Project"
		description="Update contribution details."
	>
		<input type="hidden" name="id" value={editingOpenSource.id} />
		<div class="space-y-6">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Input
					bind:value={editingOpenSource.title}
					name="title"
					label="Project / Library Name"
					required
				/>
				<Input bind:value={editingOpenSource.role} name="role" label="Role" required />
				<Input
					value={editingOpenSource.repoUrl || ''}
					oninput={(e) => {
						if (editingOpenSource) editingOpenSource.repoUrl = (e.target as HTMLInputElement).value;
					}}
					name="repoUrl"
					label="Repository URL"
				/>
				<Input
					value={editingOpenSource.period || ''}
					oninput={(e) => {
						if (editingOpenSource) editingOpenSource.period = (e.target as HTMLInputElement).value;
					}}
					name="period"
					label="Period"
				/>
			</div>
			<Textarea
				value={editingOpenSource.description || ''}
				oninput={(e) => {
					if (editingOpenSource)
						editingOpenSource.description = (e.target as HTMLTextAreaElement).value;
				}}
				name="description"
				label="Description & Highlights"
			/>
		</div>
	</FormModal>
{/if}
