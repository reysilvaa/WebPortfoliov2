<script lang="ts">
	import { authClient } from '$lib/auth-client';
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

<div class="flex min-h-screen items-center justify-center p-6">
	<main class="w-full max-w-[320px] space-y-12">
		<div class="space-y-4 text-center">
			<h1 class="text-xl font-medium tracking-tight text-neutral-950">Admin</h1>
			<p class="text-[13px] text-neutral-500">Please authenticate to continue.</p>
		</div>

		{#if error}
			<div
				class="rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-[13px] font-medium text-neutral-600"
			>
				{error}
			</div>
		{/if}

		<Button onclick={loginWithGithub} isLoading={loading} class="w-full h-12 gap-2" size="lg">
			{#if !loading}
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
					><path
						d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
					></path></svg
				>
			{/if}
			{loading ? 'Authenticating...' : 'Login with GitHub'}
		</Button>

		<footer class="pt-8 text-center">
			<a href="/" class="text-[12px] text-neutral-400 transition-colors hover:text-neutral-900"
				>← Back Home</a
			>
		</footer>
	</main>
</div>
