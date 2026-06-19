<!-- eslint-disable @inlang/paraglide-js/no-unresolved-href -->
<!-- eslint-disable @inlang/paraglide-js/no-unresolved-goto -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/ui/Button.svelte';

	let { children, data } = $props();

	const links = [
		{ href: '/dashboard', label: m.dashboard_settings_title() },
		{ href: '/dashboard/projects', label: m.dashboard_projects_title() },
		{ href: '/dashboard/experiences', label: 'Experiences' },
		{ href: '/dashboard/certificates', label: m.dashboard_credentials_title() },
		{ href: '/dashboard/skills', label: m.dashboard_skills_title() }
	];

	function isActive(href: string) {
		return page.url.pathname === href;
	}

	let logoutLoading = $state(false);
	async function logout() {
		if (logoutLoading) return;
		logoutLoading = true;
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						if (browser) goto(resolve('/dashboard/login'));
					}
				}
			});
		} catch (e) {
			console.error('Logout failed', e);
			logoutLoading = false;
		}
	}
</script>

<div
	class="flex min-h-screen bg-white font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white"
>
	<!-- Left Sidebar Navigation -->
	<aside
		class="hidden w-64 shrink-0 flex-col justify-between border-r-4 border-neutral-900 bg-[#FFDE59] md:flex"
	>
		<div>
			<div class="flex h-24 items-center border-b-4 border-neutral-900 bg-white px-6">
				<a
					href={resolve('/')}
					class="flex items-center gap-2 text-[20px] font-black tracking-tighter uppercase"
				>
					{data.profile?.name || 'REY SILVA'}
					<span
						class="border-2 border-neutral-900 bg-neutral-900 px-2 py-0.5 text-[10px] tracking-widest text-white uppercase shadow-[3px_3px_0px_0px_#FF90E8]"
						>Admin</span
					>
				</a>
			</div>
			<nav class="space-y-3 p-6">
				{#each links as link (link.href)}
					<a
						href={resolve(link.href)}
						class="block border-2 border-neutral-900 px-4 py-3 text-[14px] font-bold tracking-widest uppercase transition-all
							{isActive(link.href)
							? '-translate-y-0.5 bg-neutral-900 text-[#FFDE59] shadow-[4px_4px_0px_0px_#171717]'
							: 'bg-white text-neutral-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#171717]'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
		<div class="border-t-4 border-neutral-900 bg-white p-6">
			<Button variant="danger" size="md" class="w-full" onclick={logout} isLoading={logoutLoading}>
				{logoutLoading ? 'Signing Out...' : 'Sign Out'}
			</Button>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="flex h-screen flex-1 flex-col overflow-hidden">
		<!-- Mobile Header (Hidden on Desktop) -->
		<header
			class="flex h-16 shrink-0 items-center justify-between border-b-4 border-neutral-900 bg-[#FFDE59] px-4 md:hidden"
		>
			<a
				href={resolve('/')}
				class="border-2 border-neutral-900 bg-white px-2 py-1 text-[15px] font-black tracking-tighter uppercase shadow-[2px_2px_0px_0px_#171717]"
			>
				{data.profile?.name || 'REY SILVA'}
			</a>
			<Button variant="danger" size="sm" onclick={logout} isLoading={logoutLoading}>Out</Button>
		</header>

		<!-- Mobile Nav (Temp Solution) -->
		<nav class="flex shrink-0 overflow-x-auto border-b-4 border-neutral-900 bg-white md:hidden">
			{#each links as link (link.href)}
				<a
					href={resolve(link.href)}
					class="shrink-0 border-r-2 border-neutral-900 px-4 py-3 text-[12px] leading-none font-bold tracking-widest uppercase {isActive(
						link.href
					)
						? 'bg-neutral-900 text-[#FFDE59]'
						: 'text-neutral-900'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Content scrollable area -->
		<div class="flex-1 overflow-y-auto bg-neutral-50/30 p-4 md:p-8 lg:p-12">
			<div class="mx-auto max-w-6xl">
				{@render children()}
			</div>
		</div>
	</main>
</div>
