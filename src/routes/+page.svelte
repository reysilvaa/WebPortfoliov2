<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import PublicProjectCard from '$lib/components/PublicProjectCard.svelte';
	import Section from '$lib/components/Section.svelte';

	let { data }: { data: PageData } = $props();

	// Fallback if DB is empty
	const fallbackProfile = {
		name: 'Rey Silva.',
		role: 'Full Stack Engineer & Designer',
		bio: 'Crafting digital experiences with precision. Specializing in highly performant architectures, minimal aesthetics, and scalable engineering.',
		email: 'contact@reysilva.com',
		github: 'https://github.com/reysilvaa',
		linkedin: 'https://linkedin.com/in/reysilvaa'
	};

	const profile = $derived({
		...fallbackProfile,
		...(data.profile || {})
	});

	const items = $derived({
		projects: data.projects || [],
		certificates: data.certificates || [],
		skills: data.skills || []
	});
</script>

<svelte:head>
	<title>{profile.name}</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div class="relative min-h-screen bg-[#fafafa] pb-32 font-sans text-neutral-900 selection:bg-[#FFDE59] selection:text-neutral-900 overflow-x-hidden">
	<!-- Minimalist Grid Background (Comic Pattern style) -->
	<div class="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#e5e5e5_2px,transparent_2px),linear-gradient(to_bottom,#e5e5e5_2px,transparent_2px)] bg-size-[4rem_4rem]"></div>

	<!-- Right Side Navigation (Comic style vertical nav) -->
	<nav class="hidden lg:flex fixed right-16 top-1/2 -translate-y-1/2 flex-col gap-8 z-50 pointer-events-auto">
		<a href="#home" class="text-[15px] font-black uppercase tracking-widest text-neutral-900 bg-[#FFDE59] px-4 py-2 border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">Home</a>
		
		<a href="#projects" class="text-[15px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:-translate-y-1 transition-all pl-4 hover:pl-2">Projects</a>
		
		{#if items.certificates.length > 0}
		<a href="#credentials" class="text-[15px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:-translate-y-1 transition-all pl-4 hover:pl-2">Credentials</a>
		{/if}
		
		{#if items.skills.length > 0}
		<a href="#skills" class="text-[15px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 hover:-translate-y-1 transition-all pl-4 hover:pl-2">Stack</a>
		{/if}
	</nav>

	<!-- Main Content Area -->
	<main class="mx-auto max-w-6xl px-6 pt-24 sm:pt-32 lg:pr-64">
		<!-- Hero Section -->
		<header id="home" class="mb-24 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b-4 border-neutral-900 pb-12">
			<div class="space-y-6 lg:max-w-2xl bg-white p-8 border-4 border-neutral-900 shadow-[8px_8px_0px_0px_#171717]">
				<h1 class="text-5xl font-black uppercase tracking-tighter text-neutral-900 sm:text-7xl leading-none">
					{profile.name}
				</h1>
				<p class="inline-block bg-[#FF90E8] border-2 border-neutral-900 text-[16px] font-bold tracking-widest text-neutral-900 px-3 py-1 uppercase shadow-[2px_2px_0px_0px_#171717]">
					{profile.role}
				</p>
				<p class="text-[18px] font-medium leading-relaxed text-neutral-900 text-balance border-l-4 border-neutral-900 pl-4 py-1">
					{profile.bio}
				</p>
			</div>

			<div class="flex flex-row flex-wrap gap-4 pt-4 lg:flex-col lg:items-end lg:pt-0 shrink-0">
				<a
					href="mailto:{profile.email}"
					class="border-2 border-neutral-900 bg-white px-6 py-3 text-[14px] font-black uppercase tracking-widest text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
				>
					Email ↗
				</a>
				<a
					href={profile.github}
					target="_blank"
					rel="noopener noreferrer"
					class="border-2 border-neutral-900 bg-[#FFDE59] px-6 py-3 text-[14px] font-black uppercase tracking-widest text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
				>
					GitHub ↗
				</a>
				<a
					href={profile.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="border-2 border-neutral-900 bg-white px-6 py-3 text-[14px] font-black uppercase tracking-widest text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
				>
					LinkedIn ↗
				</a>
			</div>
		</header>

		<!-- Projects Section -->
		<Section id="projects" title={m.public_projects()}>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each items.projects as project}
					<div class="h-full">
						<PublicProjectCard {project} />
					</div>
				{/each}
			</div>
		</Section>

		<!-- Credentials Section -->
		{#if items.certificates.length > 0}
			<Section id="credentials" title={m.public_credentials()}>
				<div class="flex flex-col gap-4">
					{#each items.certificates as cert}
						<div class="group flex flex-col items-start gap-4 border-4 border-neutral-900 bg-white p-6 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] sm:flex-row sm:items-center sm:justify-between">
							<div class="space-y-2">
								<h3 class="text-[18px] font-black uppercase tracking-tight text-neutral-900">{cert.name}</h3>
								<p class="inline-block border-2 border-neutral-900 bg-[#FFDE59] px-2 py-0.5 text-[12px] font-bold text-neutral-900 uppercase">{cert.issuer}</p>
							</div>
							{#if cert.credentialUrl}
								<a
									href={cert.credentialUrl}
									target="_blank"
									class="inline-flex shrink-0 border-2 items-center justify-center border-neutral-900 bg-white px-6 py-2.5 text-[12px] font-black tracking-widest text-neutral-900 uppercase shadow-[2px_2px_0px_0px_#171717] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
								>
									{m.public_verify()}
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Skills Section -->
		{#if items.skills.length > 0}
			<Section id="skills" title={m.public_stack()}>
				<div class="flex flex-wrap gap-4">
					{#each items.skills as skill}
						<div class="flex items-center border-2 border-neutral-900 bg-white shadow-[4px_4px_0px_0px_#171717] hover:shadow-[6px_6px_0px_0px_#171717] hover:-translate-y-0.5 transition-all cursor-default">
							<span class="px-4 py-2 text-[15px] font-black uppercase text-neutral-900">
								{skill.name}
							</span>
							{#if skill.category}
								<span class="border-l-2 border-neutral-900 bg-[#FF90E8] px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-900 h-full flex items-center">
									{skill.category}
								</span>
							{/if}
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Footer -->
		<footer class="mt-40 mb-12 flex flex-col md:flex-row md:items-end justify-between border-t-4 border-neutral-900 pt-8 gap-4 bg-white p-8 shadow-[4px_4px_0px_0px_#171717]">
			<div class="space-y-2">
				<p class="text-[14px] font-black uppercase tracking-widest text-neutral-900 bg-[#FFDE59] inline-block px-2 py-1 border-2 border-neutral-900">Portfolio</p>
				<p class="text-[14px] font-bold uppercase text-neutral-500">© {new Date().getFullYear()} — {profile.name}</p>
			</div>
			<a href="/dashboard" class="group relative text-[14px] font-black uppercase tracking-widest text-neutral-900 bg-white border-2 border-neutral-900 px-4 py-2 shadow-[2px_2px_0px_0px_#171717] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
				<span>{m.public_admin()}</span>
			</a>
		</footer>
	</main>
</div>
