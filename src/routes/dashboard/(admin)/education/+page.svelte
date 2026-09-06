<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import FormModal from '$lib/components/ui/FormModal.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { DashboardHeader, DashboardEmptyState, DeleteForm } from '$lib/components/dashboard';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let school = $state('');
	let degree = $state('');
	let period = $state('');
	let location = $state('');

	let editingEducation = $state<{
		id: string;
		school: string;
		degree: string;
		period: string;
		location: string | null;
	} | null>(null);

	let editModalOpen = $state(false);
</script>

<div class="mx-auto max-w-6xl space-y-12 pb-20">
	<DashboardHeader
		title="Education"
		description="Manage your educational background for your portfolio and ATS CV."
	/>

	<section class="space-y-10">
		<Card title="Add Education" description="Add a new degree, school, or academic institution.">
			<form
				method="POST"
				action="?/add"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						school = '';
						degree = '';
						period = '';
						location = '';
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input
						bind:value={school}
						name="school"
						label="Institution / University"
						placeholder="e.g. Politeknik Negeri Malang"
						required
					/>
					<Input
						bind:value={degree}
						name="degree"
						label="Degree & Major (with GPA)"
						placeholder="e.g. D-IV Informatics Engineering (GPA: 3.87/4.00)"
						required
					/>
					<Input
						bind:value={period}
						name="period"
						label="Period"
						placeholder="e.g. 2022 – 2026 (Expected)"
						required
					/>
					<Input
						bind:value={location}
						name="location"
						label="Location"
						placeholder="e.g. Malang, Indonesia"
					/>
				</div>
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">Add Education</Button>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.education as edu (edu.id)}
				<div
					class="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
				>
					<div class="space-y-2 pr-4">
						<h4 class="text-[16px] font-medium text-brand-text">
							{edu.school}
						</h4>
						<p class="text-[13px] text-neutral-600">
							{edu.degree}
						</p>
						<p class="text-[12px] text-neutral-400">
							{edu.period}
							{edu.location ? `• ${edu.location}` : ''}
						</p>
					</div>
					<div class="flex gap-2">
						<Button
							variant="outline"
							size="icon"
							type="button"
							class="text-neutral-400"
							onclick={() => {
								editingEducation = { ...edu };
								editModalOpen = true;
							}}
							title="Edit"
						>
							<Icon name="pencil" />
						</Button>
						<DeleteForm
							id={edu.id}
							modalTitle={`Delete education at "${edu.school}"?`}
							modalMessage="This will permanently remove this record from your history."
						/>
					</div>
				</div>
			{:else}
				<DashboardEmptyState message="No education records found." />
			{/each}
		</div>
	</section>
</div>

{#if editingEducation}
	<FormModal
		bind:isOpen={editModalOpen}
		title="Edit Education"
		description="Update academic institution details."
	>
		<input type="hidden" name="id" value={editingEducation.id} />
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<Input
				bind:value={editingEducation.school}
				name="school"
				label="Institution / University"
				placeholder="e.g. Politeknik Negeri Malang"
				required
			/>
			<Input
				bind:value={editingEducation.degree}
				name="degree"
				label="Degree & Major"
				placeholder="e.g. D-IV Informatics Engineering"
				required
			/>
			<Input
				bind:value={editingEducation.period}
				name="period"
				label="Period"
				placeholder="e.g. 2022 – 2026"
				required
			/>
			<Input
				value={editingEducation.location || ''}
				oninput={(e) => {
					if (editingEducation) editingEducation.location = (e.target as HTMLInputElement).value;
				}}
				name="location"
				label="Location"
				placeholder="e.g. Malang, Indonesia"
			/>
		</div>
	</FormModal>
{/if}
