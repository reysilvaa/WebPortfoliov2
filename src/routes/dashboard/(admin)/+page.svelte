<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let profileLoading = $state(false);
	let profileMessage = $state({ type: '', text: '' });

	let name = $state(data.profile?.name || '');
	let role = $state(data.profile?.role || '');
	let bio = $state(data.profile?.bio || '');
	let email = $state(data.profile?.email || '');
	let github = $state(data.profile?.github || '');
	let linkedin = $state(data.profile?.linkedin || '');

	async function updateProfile(e: Event) {
		e.preventDefault();
		profileLoading = true;
		profileMessage = { type: '', text: '' };

		try {
			const res = await fetch('/api/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, role, bio, email, github, linkedin })
			});

			if (res.ok) {
				profileMessage = { type: 'success', text: 'Profile updated successfully' };
				await invalidateAll();
			} else {
				profileMessage = { type: 'error', text: 'Failed to update profile' };
			}
		} finally {
			profileLoading = false;
		}
	}
</script>

<div class="space-y-16">
	<header class="space-y-2">
		<h1 class="text-xl font-semibold tracking-tight">Settings</h1>
		<p class="text-[14px] text-neutral-500">Manage your public information.</p>
	</header>

	<section class="space-y-10">
		<h2 class="text-[12px] font-semibold tracking-widest text-neutral-400 uppercase">
			Public Profile
		</h2>

		{#if profileMessage.text}
			<p
				class="text-[12px] font-medium {profileMessage.type === 'success'
					? 'text-green-600'
					: 'text-red-600'}"
			>
				{profileMessage.text}
			</p>
		{/if}

		<form onsubmit={updateProfile} class="space-y-8">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div class="space-y-2">
					<label for="name" class="text-[12px] font-medium text-neutral-500">Full Name</label>
					<input
						id="name"
						bind:value={name}
						required
						class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
					/>
				</div>
				<div class="space-y-2">
					<label for="role" class="text-[12px] font-medium text-neutral-500">Job Role</label>
					<input
						id="role"
						bind:value={role}
						required
						class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
						placeholder="e.g. Full Stack Engineer"
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="bio" class="text-[12px] font-medium text-neutral-500">Short Bio</label>
				<textarea
					id="bio"
					bind:value={bio}
					required
					class="h-32 w-full rounded-lg border border-neutral-200 px-4 py-3 text-[14px] transition-all outline-none focus:border-neutral-900"
				></textarea>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div class="space-y-2">
					<label for="email" class="text-[12px] font-medium text-neutral-500">Contact Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
					/>
				</div>
				<div class="space-y-2">
					<label for="github" class="text-[12px] font-medium text-neutral-500">GitHub URL</label>
					<input
						id="github"
						bind:value={github}
						class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
					/>
				</div>
				<div class="space-y-2">
					<label for="linkedin" class="text-[12px] font-medium text-neutral-500">LinkedIn URL</label
					>
					<input
						id="linkedin"
						bind:value={linkedin}
						class="h-11 w-full rounded-lg border border-neutral-200 px-4 text-[14px] transition-all outline-none focus:border-neutral-900"
					/>
				</div>
			</div>

			<div class="flex justify-end">
				<button
					type="submit"
					disabled={profileLoading}
					class="h-11 rounded-lg bg-neutral-900 px-8 text-[13px] font-medium text-white transition-all hover:bg-neutral-800"
				>
					{profileLoading ? 'Saving...' : 'Save Profile'}
				</button>
			</div>
		</form>
	</section>
</div>
