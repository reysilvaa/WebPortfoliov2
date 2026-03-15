<script lang="ts">
	import type { PageData } from "./$types";
	import { enhance } from "$app/forms";
	import * as m from "$lib/paraglide/messages";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Textarea from "$lib/components/ui/Textarea.svelte";
	import Card from "$lib/components/ui/Card.svelte";

	let { data }: { data: PageData } = $props();

	let profileLoading = $state(false);
	let profileMessage = $state({ type: "", text: "" });

	let name = $state("");
	let role = $state("");
	let bio = $state("");
	let avatarUrl = $state("");
	let email = $state("");
	let github = $state("");
	let linkedin = $state("");

	$effect(() => {
		if (data.profile) {
			name = data.profile.name || "";
			role = data.profile.role || "";
			bio = data.profile.bio || "";
			avatarUrl = data.profile.avatarUrl || "";
			email = data.profile.email || "";
			github = data.profile.github || "";
			linkedin = data.profile.linkedin || "";
		}
	});

</script>

<div class="space-y-12">
	<header class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b-4 border-neutral-900 pb-6 mb-8 mt-2">
		<div class="space-y-2">
			<h1 class="text-3xl font-black uppercase tracking-tighter text-neutral-900">
				{m.dashboard_settings_title()}
			</h1>
			<p class="text-[15px] font-bold text-neutral-500 uppercase tracking-widest">
				{m.dashboard_settings_description()}
			</p>
		</div>

		<form method="POST" action="?/syncGithubProfile" use:enhance={() => {
			profileLoading = true;
			return async ({ update }) => {
				await update();
				profileLoading = false;
			};
		}}>
			<Button type="submit" variant="outline" isLoading={profileLoading}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" class="mr-2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
				Sync from GitHub
			</Button>
		</form>
	</header>

	<Card
		title={m.dashboard_profile_section()}
		description={m.dashboard_settings_description()}
	>
		{#if profileMessage.text}
			<div
				class="mb-8 border-4 p-4 text-[13px] font-black uppercase tracking-widest {profileMessage.type === 'success'
					? 'border-neutral-900 bg-[#FFDE59] text-neutral-900 shadow-[4px_4px_0px_0px_#171717]'
					: 'border-neutral-900 bg-[#FF90E8] text-neutral-900 shadow-[4px_4px_0px_0px_#171717]'}"
			>
				{profileMessage.text}
			</div>
		{/if}

		<form method="POST" action="?/updateProfile" use:enhance={() => {
			profileLoading = true;
			profileMessage = { type: "", text: "" };
			return async ({ update, result }) => {
				await update();
				profileLoading = false;
				if (result.type === 'success') {
					profileMessage = { type: "success", text: m.common_success() };
				} else {
					profileMessage = { type: "error", text: m.common_error() };
				}
			};
		}} class="space-y-8">
			<div class="flex flex-col sm:flex-row gap-8 items-start">
				<div class="shrink-0">
					<div class="size-32 border-4 border-neutral-900 bg-neutral-100 shadow-[4px_4px_0px_0px_#171717] overflow-hidden">
						{#if avatarUrl}
							<img src={avatarUrl} alt={name} class="w-full h-full object-cover" />
						{:else}
							<div class="w-full h-full flex items-center justify-center text-neutral-400">
								<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
							</div>
						{/if}
					</div>
				</div>
				
				<div class="flex-1 w-full space-y-6">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<Input label={m.form_label_name()} name="name" bind:value={name} required />
						<Input
							label={m.form_label_role()}
							name="role"
							bind:value={role}
							required
							placeholder="e.g. Full Stack Engineer"
						/>
					</div>
					<Input label="Avatar URL" name="avatarUrl" bind:value={avatarUrl} placeholder="https://..." />
				</div>
			</div>

			<Textarea label={m.form_label_bio()} name="bio" bind:value={bio} required />

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Input
					label={m.form_label_email()}
					name="email"
					type="email"
					bind:value={email}
				/>
				<Input label={m.form_label_github()} name="github" bind:value={github} />
				<Input label={m.form_label_linkedin()} name="linkedin" bind:value={linkedin} />
			</div>

			<div class="flex justify-end pt-4">
				<Button type="submit" isLoading={profileLoading}>
					{m.common_save()}
				</Button>
			</div>
		</form>
	</Card>
</div>
