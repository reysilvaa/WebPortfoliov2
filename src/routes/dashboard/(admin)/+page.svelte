<script lang="ts">
	import type { PageData } from "./$types";
	import { invalidateAll } from "$app/navigation";
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
	let email = $state("");
	let github = $state("");
	let linkedin = $state("");

	$effect(() => {
		if (data.profile) {
			name = data.profile.name || "";
			role = data.profile.role || "";
			bio = data.profile.bio || "";
			email = data.profile.email || "";
			github = data.profile.github || "";
			linkedin = data.profile.linkedin || "";
		}
	});

	async function updateProfile(e: Event) {
		e.preventDefault();
		profileLoading = true;
		profileMessage = { type: "", text: "" };

		try {
			const res = await fetch("/api/profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					role,
					bio,
					email,
					github,
					linkedin,
				}),
			});

			if (res.ok) {
				profileMessage = { type: "success", text: m.common_success() };
				await invalidateAll();
			} else {
				profileMessage = { type: "error", text: m.common_error() };
			}
		} finally {
			profileLoading = false;
		}
	}
</script>

<div class="space-y-12">
	<header class="space-y-2 border-b-4 border-neutral-900 pb-6 mb-8 mt-2">
		<h1 class="text-3xl font-black uppercase tracking-tighter text-neutral-900">
			{m.dashboard_settings_title()}
		</h1>
		<p class="text-[15px] font-bold text-neutral-500 uppercase tracking-widest">
			{m.dashboard_settings_description()}
		</p>
	</header>

	<Card
		title={m.dashboard_profile_section()}
		description={m.dashboard_settings_description()}
	>
		{#if profileMessage.text}
			<div
				class="mb-6 rounded-lg p-3 text-[12px] font-medium {profileMessage.type ===
				'success'
					? 'bg-green-50 text-green-600'
					: 'bg-red-50 text-red-600'}"
			>
				{profileMessage.text}
			</div>
		{/if}

		<form onsubmit={updateProfile} class="space-y-8">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Input label={m.form_label_name()} bind:value={name} required />
				<Input
					label={m.form_label_role()}
					bind:value={role}
					required
					placeholder="e.g. Full Stack Engineer"
				/>
			</div>

			<Textarea label={m.form_label_bio()} bind:value={bio} required />

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<Input
					label={m.form_label_email()}
					type="email"
					bind:value={email}
				/>
				<Input label={m.form_label_github()} bind:value={github} />
				<Input label={m.form_label_linkedin()} bind:value={linkedin} />
			</div>

			<div class="flex justify-end pt-4">
				<Button type="submit" isLoading={profileLoading}>
					{m.common_save()}
				</Button>
			</div>
		</form>
	</Card>
</div>
