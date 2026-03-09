<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
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
		if (nameLoading) return;
		nameLoading = true;
		nameMessage = { type: '', text: '' };

		try {
			const { error } = await authClient.updateUser({
				name: name
			});

			if (error) {
				nameMessage = { type: 'error', text: error.message || 'An error occurred' };
			} else {
				nameMessage = { type: 'success', text: 'Profile updated successfully' };
			}
		} finally {
			nameLoading = false;
		}
	}

	async function updatePassword(e: Event) {
		e.preventDefault();
		if (passLoading) return;
		passLoading = true;
		passMessage = { type: '', text: '' };

		try {
			const { error } = await authClient.changePassword({
				newPassword,
				currentPassword,
				revokeOtherSessions: true
			});

			if (error) {
				passMessage = { type: 'error', text: error.message || 'An error occurred' };
			} else {
				passMessage = { type: 'success', text: 'Password secured successfully' };
				currentPassword = '';
				newPassword = '';
			}
		} finally {
			passLoading = false;
		}
	}

	async function logout() {
		if (logoutLoading) return;
		logoutLoading = true;
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						if (browser) goto('/dashboard/login');
					}
				}
			});
		} catch (e) {
			console.error('Logout failed', e);
			logoutLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard | Digital Portfolio</title>
</svelte:head>

<div class="min-h-screen bg-[#fafafa] font-sans antialiased text-neutral-900 pb-20">
	<!-- Top Navigation Bar -->
	<header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 h-16 px-6 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center shadow-lg shadow-neutral-900/10">
				<span class="text-white text-sm font-bold">R</span>
			</div>
			<div class="h-4 w-px bg-neutral-200 mx-1"></div>
			<span class="text-sm font-bold tracking-tight text-neutral-950 uppercase opacity-40">System Control</span>
		</div>

		<div class="flex items-center gap-4">
			<div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full border border-neutral-200/50">
				<div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
				<span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{data.user?.email}</span>
			</div>
			<button 
				onclick={logout}
				disabled={logoutLoading}
				class="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
			>
				{logoutLoading ? 'Ending Session...' : 'Sign Out'}
			</button>
		</div>
	</header>

	<main class="max-w-5xl mx-auto px-6 pt-12 space-y-12">
		<!-- Hero Section -->
		<section class="space-y-2">
			<h1 class="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl">
				Dashboard
			</h1>
			<p class="text-lg text-neutral-500 font-medium">
				Manage your identity and security settings.
			</p>
		</section>

		<div class="grid lg:grid-cols-12 gap-10">
			<!-- Sidebar Nav (Desktop) -->
			<aside class="hidden lg:block lg:col-span-3 space-y-1">
				<button class="w-full text-left px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-[14px] transition-all">
					Profile Settings
				</button>
				<button class="w-full text-left px-4 py-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 font-bold text-[14px] transition-all">
					Global Analytics
				</button>
				<button class="w-full text-left px-4 py-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 font-bold text-[14px] transition-all">
					Assets Manager
				</button>
			</aside>

			<!-- Content Area -->
			<div class="lg:col-span-9 space-y-10">
				<!-- Profile Section -->
				<div class="bg-white rounded-4xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
					<div class="p-8 md:p-10">
						<div class="flex items-start justify-between mb-8">
							<div class="space-y-1">
								<h2 class="text-xl font-bold text-neutral-950">Identity Details</h2>
								<p class="text-[14px] text-neutral-500 font-medium">This name will be visible across your public portfolio.</p>
							</div>
							<div class="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
							</div>
						</div>

						{#if nameMessage.text}
							<div class="p-4 mb-8 font-bold text-xs uppercase tracking-widest rounded-2xl animate-in fade-in slide-in-from-top-2 {nameMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}">
								{nameMessage.text}
							</div>
						{/if}

						<form onsubmit={updateName} class="space-y-6">
							<div class="space-y-2">
								<label for="name" class="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Display Name</label>
								<input
									type="text"
									id="name"
									bind:value={name}
									required
									class="w-full px-5 py-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-950 outline-none transition-all text-neutral-900 font-bold text-[15px]"
									placeholder="Your name"
								/>
							</div>
							
							<div class="flex justify-end">
								<button
									type="submit"
									disabled={nameLoading}
									class="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-2 group shadow-xl shadow-neutral-900/10"
								>
									{nameLoading ? 'Saving...' : 'Update Profile'}
									{#if !nameLoading}
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
									{/if}
								</button>
							</div>
						</form>
					</div>
				</div>

				<!-- Security Section -->
				<div class="bg-white rounded-4xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
					<div class="p-8 md:p-10">
						<div class="flex items-start justify-between mb-8">
							<div class="space-y-1">
								<h2 class="text-xl font-bold text-neutral-950">Security Access</h2>
								<p class="text-[14px] text-neutral-500 font-medium">Update your credentials to maintain a secure environment.</p>
							</div>
							<div class="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
							</div>
						</div>

						{#if passMessage.text}
							<div class="p-4 mb-8 font-bold text-xs uppercase tracking-widest rounded-2xl animate-in fade-in slide-in-from-top-2 {passMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}">
								{passMessage.text}
							</div>
						{/if}

						<form onsubmit={updatePassword} class="space-y-6">
							<div class="grid sm:grid-cols-2 gap-6">
								<div class="space-y-2">
									<label for="currentPassword" class="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Current Key</label>
									<input
										type="password"
										id="currentPassword"
										bind:value={currentPassword}
										required
										class="w-full px-5 py-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-950 outline-none transition-all text-neutral-900 font-bold text-[15px]"
										placeholder="••••••••"
									/>
								</div>

								<div class="space-y-2">
									<label for="newPassword" class="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">New Access Key</label>
									<input
										type="password"
										id="newPassword"
										bind:value={newPassword}
										required
										minlength="8"
										class="w-full px-5 py-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-neutral-900/5 focus:border-neutral-950 outline-none transition-all text-neutral-900 font-bold text-[15px]"
										placeholder="Minimum 8 chars"
									/>
								</div>
							</div>
							
							<div class="flex justify-end pt-2">
								<button
									type="submit"
									disabled={passLoading}
									class="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-2xl transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-2 group shadow-xl shadow-neutral-900/10"
								>
									{passLoading ? 'Verifying...' : 'Change Password'}
									{#if !passLoading}
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-0.5 transition-transform"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
									{/if}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		background-color: #fafafa;
	}
	
	.animate-in {
		animation-duration: 0.3s;
		animation-fill-mode: both;
	}
	
	.fade-in {
		animation-name: fade-in;
	}
	
	.slide-in-from-top-2 {
		animation-name: slide-in-from-top-2;
	}
	
	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slide-in-from-top-2 {
		from { transform: translateY(-0.5rem); }
		to { transform: translateY(0); }
	}
</style>
