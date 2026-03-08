<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state('');
	let loading = $state(false);
	let isRegister = $state(false);

	async function handleAuth(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		let res;
		if (isRegister) {
			res = await authClient.signUp.email({ email, password, name });
		} else {
			res = await authClient.signIn.email({ email, password });
		}

		if (res.error) {
			error = res.error.message || 'Authentication failed';
			loading = false;
		} else {
			goto('/dashboard');
		}
	}
</script>

<div class="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans">
	<main class="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 space-y-8">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-neutral-900 tracking-tight">{isRegister ? 'Admin Setup' : 'Admin Login'}</h1>
			<p class="text-sm text-neutral-500 mt-2">{isRegister ? 'Create your admin account' : 'Sign in to manage your portfolio'}</p>
		</div>

		{#if error}
			<div class="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
				{error}
			</div>
		{/if}

		<form onsubmit={handleAuth} class="space-y-5">
			{#if isRegister}
				<div class="space-y-2">
					<label for="name" class="text-sm font-medium text-neutral-700">Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						required
						class="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-400 text-neutral-900 bg-neutral-50 focus:bg-white"
						placeholder="Admin Name"
					/>
				</div>
			{/if}

			<div class="space-y-2">
				<label for="email" class="text-sm font-medium text-neutral-700">Email Address</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-400 text-neutral-900 bg-neutral-50 focus:bg-white"
					placeholder="admin@example.com"
				/>
			</div>

			<div class="space-y-2">
				<label for="password" class="text-sm font-medium text-neutral-700">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					class="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 outline-none transition-all placeholder:text-neutral-400 text-neutral-900 bg-neutral-50 focus:bg-white"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center"
			>
				{#if loading}
					<span class="animate-pulse">{isRegister ? 'Creating Account...' : 'Signing in...'}</span>
				{:else}
					{isRegister ? 'Create Account' : 'Sign In'}
				{/if}
			</button>
		</form>

		<div class="text-center pt-2">
			<button 
				type="button" 
				onclick={() => { isRegister = !isRegister; error = ''; }}
				class="text-sm text-neutral-500 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
			>
				{isRegister ? 'Already have an account? Sign In' : 'Need to setup admin? Sign Up'}
			</button>
		</div>
	</main>
</div>
