<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';

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
	<title>Admin Login</title>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center bg-[#fafafa] p-6 font-sans text-neutral-900 selection:bg-[#FFDE59] selection:text-neutral-900">
	<!-- Minimalist Grid Background -->
	<div class="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#e5e5e5_2px,transparent_2px),linear-gradient(to_bottom,#e5e5e5_2px,transparent_2px)] bg-size-[4rem_4rem]"></div>

	<main class="w-full max-w-[400px]">
		<div class="space-y-8 bg-white p-10 border-4 border-neutral-900 shadow-[10px_10px_0px_0px_#171717]">
			<div class="space-y-3 pb-4">
				<h1 class="text-3xl font-black uppercase tracking-tighter text-neutral-900 leading-none">{m.public_admin()}</h1>
				<p class="text-[14px] font-bold text-neutral-500 uppercase tracking-widest truncate">Please authenticate to continue.</p>
			</div>

			{#if error}
				<div
					class="border-2 border-neutral-900 bg-red-50 p-4 text-[13px] font-bold text-red-600 shadow-[4px_4px_0px_0px_#171717]"
				>
					{error}
				</div>
			{/if}

			<Button onclick={loginWithGithub} isLoading={loading} class="w-full h-14 gap-3 bg-[#FFDE59]" size="lg">
				{#if !loading}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="square"
						><path
							d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"
						></path></svg
					>
				{/if}
				{loading ? m.common_loading() : 'Login with GitHub'}
			</Button>

			<div class="pt-4 text-center">
				<a href="/" class="inline-block border-b-2 border-transparent text-[14px] font-black uppercase tracking-widest text-neutral-400 transition-all hover:border-neutral-900 hover:text-neutral-900">
					← Back Home
				</a>
			</div>
		</div>
	</main>
</div>
