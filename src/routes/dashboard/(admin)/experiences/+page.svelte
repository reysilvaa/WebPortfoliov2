<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let role = $state('');
	let company = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let description = $state('');
</script>

<div class="mx-auto max-w-4xl space-y-12">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">Experiences</h1>
		<p class="text-[14px] text-neutral-500">Manage your past projects and jobs.</p>
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

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.experiences as exp (exp.id)}
				<div
					class="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-5 transition-all hover:bg-neutral-50/50"
				>
					<div class="space-y-1">
						<h4 class="text-[15px] font-semibold text-neutral-900">{exp.role} @ {exp.company}</h4>
						<p class="text-[13px] text-neutral-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
					</div>
					<form method="POST" action="?/delete" use:enhance={() => {
						return async ({ update }) => {
							if (confirm('Delete this experience?')) {
								await update();
							}
						};
					}}>
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
			{:else}
				<div class="py-12 text-center rounded-2xl border border-dashed border-neutral-200 sm:col-span-2 lg:col-span-3">
					<p class="text-[14px] text-neutral-400">No experiences found.</p>
				</div>
			{/each}
		</div>
	</section>
</div>
