<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { browser } from '$app/environment';

	let error = $state('');
	let loading = $state(false);

	async function loginWithGithub() {
		if (loading) return;
		loading = true;
		error = '';

		try {
			await authClient.signIn.social({
				provider: 'github',
				callbackURL: '/dashboard'
			});
		} catch (err: any) {
			error = err.message || 'Github connection failed';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Access | Digital Portfolio</title>
</svelte:head>

<div class="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans antialiased text-neutral-900 overflow-hidden relative">
	<!-- Background accent -->
	<div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-neutral-200 via-neutral-900 to-neutral-200 opacity-40"></div>
	
	<main class="w-full max-w-[360px] flex flex-col gap-10 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
		<div class="flex flex-col items-center gap-4 text-center">
			<div class="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center mb-2 shadow-2xl shadow-neutral-900/20 rotate-3 hover:rotate-0 transition-all duration-500 cursor-default group">
				<span class="text-white text-2xl font-bold group-hover:scale-110 transition-transform">R</span>
			</div>
			<div class="space-y-1.5">
				<h1 class="text-2xl font-extrabold tracking-tight text-neutral-950 font-sans">
					Admin Control
				</h1>
				<p class="text-[13px] font-bold text-neutral-400 uppercase tracking-[0.15em] leading-relaxed">
					Secure Management Area
				</p>
			</div>
		</div>

		{#if error}
			<div 
				class="p-4 bg-red-50/80 backdrop-blur-sm text-red-700 border border-red-100 rounded-2xl text-[13px] font-bold animate-in fade-in slide-in-from-top-2 flex gap-3 items-center"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
				<span class="flex-1 uppercase tracking-wider">{error}</span>
			</div>
		{/if}

		<div class="flex flex-col gap-6">
			<button
				onclick={loginWithGithub}
				disabled={loading}
				class="w-full h-14 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-2xl shadow-2xl shadow-neutral-900/10 hover:shadow-neutral-900/20 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-3 group"
			>
				{#if loading}
					<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
					<span class="text-[14px] uppercase tracking-widest">Verifying...</span>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
					<span class="text-[14px] uppercase tracking-widest">Login with GitHub</span>
				{/if}
			</button>

			<p class="text-center text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] px-8 leading-loose">
				Restricted to authorized developers only.
			</p>
		</div>
	</main>

	<!-- Branding overlay hint -->
	<div class="absolute inset-0 pointer-events-none border-12 border-neutral-950/5 z-0"></div>

	<footer class="absolute bottom-8 left-0 w-full text-center">
		<p class="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">
			Alpha Enterprise v2.0
		</p>
	</footer>
</div>

<style>
	:global(body) {
		background-color: #fafafa;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
	.animate-spin {
		animation: spin 0.8s linear infinite;
	}
</style>
