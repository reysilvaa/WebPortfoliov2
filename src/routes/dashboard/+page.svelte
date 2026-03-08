<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let name = $state('');
	$effect(() => {
		if (!name && data.user?.name) {
			name = data.user.name;
		}
	});
	let currentPassword = $state('');
	let newPassword = $state('');
	
	let nameLoading = $state(false);
	let nameMessage = $state({ type: '', text: '' });

	let passLoading = $state(false);
	let passMessage = $state({ type: '', text: '' });

	let logoutLoading = $state(false);

	async function updateName(e: Event) {
		e.preventDefault();
		nameLoading = true;
		nameMessage = { type: '', text: '' };

		const { error } = await authClient.updateUser({
			name: name
		});

		if (error) {
			nameMessage = { type: 'error', text: error.message };
		} else {
			nameMessage = { type: 'success', text: 'Name updated successfully!' };
		}
		nameLoading = false;
	}

	async function updatePassword(e: Event) {
		e.preventDefault();
		passLoading = true;
		passMessage = { type: '', text: '' };

		const { error } = await authClient.changePassword({
			newPassword,
			currentPassword,
			revokeOtherSessions: true
		});

		if (error) {
			passMessage = { type: 'error', text: error.message };
		} else {
			passMessage = { type: 'success', text: 'Password updated successfully!' };
			currentPassword = '';
			newPassword = '';
		}
		passLoading = false;
	}

	async function logout() {
		logoutLoading = true;
		await authClient.signOut();
		goto('/dashboard/login');
	}
</script>

<div class="min-h-screen bg-neutral-50 px-4 py-8 font-sans">
	<main class="max-w-4xl mx-auto space-y-8">
		
		<header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
			<div>
				<h1 class="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard Dashboard</h1>
				<p class="text-neutral-500">Welcome back, {data.user?.name}</p>
			</div>
			
			<button 
				onclick={logout}
				disabled={logoutLoading}
				class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium rounded-xl transition-colors disabled:opacity-50"
			>
				{logoutLoading ? 'Logging out...' : 'Log out'}
			</button>
		</header>

		<div class="grid md:grid-cols-2 gap-8">
			<!-- Update Name -->
			<section class="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
				<h2 class="text-xl font-bold text-neutral-900 mb-2">Update Profile</h2>
				<p class="text-sm text-neutral-500 mb-6">Change your display name (username).</p>

				{#if nameMessage.text}
					<div class="p-3 mb-6 font-medium text-sm rounded-xl border {nameMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}">
						{nameMessage.text}
					</div>
				{/if}

				<form onsubmit={updateName} class="space-y-4">
					<div class="space-y-2">
						<label for="name" class="text-sm font-medium text-neutral-700">Name</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all text-neutral-900 bg-neutral-50 focus:bg-white"
						/>
					</div>
					
					<button
						type="submit"
						disabled={nameLoading}
						class="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
					>
						{nameLoading ? 'Saving...' : 'Save Changes'}
					</button>
				</form>
			</section>

			<!-- Update Password -->
			<section class="bg-white p-6 md:p-8 rounded-2xl border border-neutral-200 shadow-sm">
				<h2 class="text-xl font-bold text-neutral-900 mb-2">Change Password</h2>
				<p class="text-sm text-neutral-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>

				{#if passMessage.text}
					<div class="p-3 mb-6 font-medium text-sm rounded-xl border {passMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}">
						{passMessage.text}
					</div>
				{/if}

				<form onsubmit={updatePassword} class="space-y-4">
					<div class="space-y-2">
						<label for="currentPassword" class="text-sm font-medium text-neutral-700">Current Password</label>
						<input
							type="password"
							id="currentPassword"
							bind:value={currentPassword}
							required
							class="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all text-neutral-900 bg-neutral-50 focus:bg-white"
						/>
					</div>

					<div class="space-y-2">
						<label for="newPassword" class="text-sm font-medium text-neutral-700">New Password</label>
						<input
							type="password"
							id="newPassword"
							bind:value={newPassword}
							required
							minlength="8"
							class="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all text-neutral-900 bg-neutral-50 focus:bg-white"
						/>
					</div>
					
					<button
						type="submit"
						disabled={passLoading}
						class="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
					>
						{passLoading ? 'Updating...' : 'Update Password'}
					</button>
				</form>
			</section>
		</div>

	</main>
</div>
