<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { DashboardHeader, DashboardEmptyState, DeleteForm } from '$lib/components/dashboard';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let name = $state('');
	let category = $state('');

	let editingSkill = $state<{
		id: string;
		name: string;
		category: string | null;
	} | null>(null);

	let editModalOpen = $state(false);
</script>

<div class="mx-auto max-w-6xl space-y-12 pb-20">
	<DashboardHeader
		title={m.dashboard_skills_title()}
		description={m.dashboard_skills_description()}
	/>

	<section class="space-y-10">
		<Card title="Add Skill" description="Add a new technical capability.">
			<form
				method="POST"
				action="?/add"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
						name = '';
						category = '';
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<Input
						bind:value={name}
						name="name"
						label="Skill Name"
						placeholder="e.g., SvelteKit"
						required
					/>
					<Input
						bind:value={category}
						name="category"
						label="Category"
						placeholder="e.g., Frontend, Backend"
						required
					/>
				</div>
				<div class="flex justify-end pt-2">
					<Button type="submit" isLoading={loading} class="w-full sm:w-auto">Add Skill</Button>
				</div>
			</form>
		</Card>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.skills as skill (skill.id)}
				<div class="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
					<div class="mb-4 flex flex-1 items-start justify-between space-y-2">
						<div>
							<h4 class="text-[16px] font-medium text-brand-text">
								{skill.name}
							</h4>
							<p class="text-[13px] text-neutral-500">
								{skill.category}
							</p>
						</div>
						<div
							class="shrink-0 rounded bg-brand-text px-2 py-0.5 text-[10px] font-medium text-brand-bg uppercase"
						>
							{skill.level}%
						</div>
					</div>

					<div class="flex items-center justify-end gap-2 border-t border-neutral-100 pt-4">
						<Button
							variant="outline"
							size="icon"
							type="button"
							class="text-neutral-400"
							onclick={() => {
								editingSkill = { ...skill };
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
							id={skill.id}
							modalTitle={`Delete skill "${skill.name}"?`}
							modalMessage="This will remove this skill from your tech stack showcase."
						/>
					</div>
				</div>
			{:else}
				<DashboardEmptyState message="No skills found." />
			{/each}
		</div>
	</section>
</div>

{#if editModalOpen && editingSkill}
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
				<h2 class="mb-2 text-[24px] font-semibold tracking-tight text-brand-text">Edit Skill</h2>
				<p class="text-[14px] text-neutral-500">Update technical capability details.</p>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<input type="hidden" name="id" value={editingSkill.id} />
				<Input bind:value={editingSkill.name} name="name" label="Skill Name" required />
				<Input
					value={editingSkill.category || ''}
					oninput={(e) => {
						if (editingSkill) editingSkill.category = (e.target as HTMLInputElement).value;
					}}
					name="category"
					label="Category"
					placeholder="e.g., Frontend, Backend"
					required
				/>
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
