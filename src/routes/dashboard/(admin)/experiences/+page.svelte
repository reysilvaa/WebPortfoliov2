<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FormModal from '$lib/components/ui/FormModal.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { DashboardHeader, DashboardEmptyState, DeleteForm } from '$lib/components/dashboard';

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

	let editModalOpen = $state(false);
</script>

<div class="mx-auto max-w-6xl space-y-12 pb-20">
	<DashboardHeader title="Experiences" description={m.dashboard_projects_description()} />

	<section class="space-y-10">
		<Card title="Add Experience" description="Add a new experience.">
			<form
				method="POST"
				action="?/add"
				use:enhance={() => {
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
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input
						bind:value={role}
						name="role"
						label="Role"
						placeholder="e.g., Software Engineer"
						required
					/>
					<Input
						bind:value={company}
						name="company"
						label="Company"
						placeholder="e.g., Google"
						required
					/>
					<Input
						bind:value={startDate}
						name="startDate"
						label="Start Date"
						placeholder="e.g., Jan 2022"
						required
					/>
					<Input bind:value={endDate} name="endDate" label="End Date" placeholder="e.g., Present" />
				</div>
				<Input
					bind:value={description}
					name="description"
					label="Description"
					placeholder="What did you do there?"
				/>
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">Add Experience</Button>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.experiences as exp (exp.id)}
				<div
					class="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
				>
					<div class="space-y-2 pr-4">
						<h4 class="text-[16px] font-medium text-brand-text">
							{exp.role}
						</h4>
						<p class="text-[13px] text-neutral-500">
							{exp.company}
						</p>
						<p class="text-[12px] text-neutral-400">
							{exp.startDate} - {exp.endDate || 'Present'}
						</p>
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
							<Icon name="pencil" />
						</Button>
						<DeleteForm
							id={exp.id}
							modalTitle={`Delete experience at "${exp.company}"?`}
							modalMessage="This will permanently remove this record from your history."
						/>
					</div>
				</div>
			{:else}
				<DashboardEmptyState message="No experiences found." />
			{/each}
		</div>
	</section>
</div>

{#if editingExperience}
	<FormModal
		bind:isOpen={editModalOpen}
		title="Edit Experience"
		description="Update experience details."
	>
		<input type="hidden" name="id" value={editingExperience.id} />
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
				oninput={(e) => {
					if (editingExperience) editingExperience.endDate = (e.target as HTMLInputElement).value;
				}}
				name="endDate"
				label="End Date"
				placeholder="e.g., Present"
			/>
			<div class="col-span-full">
				<Input
					value={editingExperience.description || ''}
					oninput={(e) => {
						if (editingExperience)
							editingExperience.description = (e.target as HTMLInputElement).value;
					}}
					name="description"
					label="Description"
					placeholder="What did you do there?"
				/>
			</div>
		</div>
	</FormModal>
{/if}
