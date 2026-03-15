<script lang="ts">
	import { onMount } from 'svelte';
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
		avatarUrl: 'https://github.com/reysilvaa.png',
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
		pagination: data.pagination,
		certificates: data.certificates || [],
		skills: data.skills || [],
		experiences: data.experiences || []
	});

	let activeSection = $state('home');
	let hoveredProjectId = $state<string | null>(null);

	onMount(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeSection = entry.target.id;
				}
			});
		}, { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 });

		document.querySelectorAll('header[id], section[id]').forEach((sec) => {
			observer.observe(sec);
		});

		return () => observer.disconnect();
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
	<nav class="hidden lg:flex fixed right-8 xl:right-16 top-1/2 -translate-y-1/2 flex-col gap-6 z-50 pointer-events-auto">
		<a href="#home" class="block text-[14px] font-black uppercase tracking-widest transition-all px-4 py-2 border-2 
			{activeSection === 'home' || activeSection === '' ? 'bg-[#FFDE59] text-neutral-900 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] -translate-y-1' : 'border-transparent text-neutral-400 hover:text-neutral-900 hover:-translate-y-1'}"
		>Home</a>
		
		{#if items.experiences && items.experiences.length > 0}
		<a href="#experience" class="block text-[14px] font-black uppercase tracking-widest transition-all px-4 py-2 border-2 
			{activeSection === 'experience' ? 'bg-[#FFDE59] text-neutral-900 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] -translate-y-1' : 'border-transparent text-neutral-400 hover:text-neutral-900 hover:-translate-y-1'}"
		>Experience</a>
		{/if}

		<a href="#projects" class="block text-[14px] font-black uppercase tracking-widest transition-all px-4 py-2 border-2 
			{activeSection === 'projects' ? 'bg-[#FFDE59] text-neutral-900 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] -translate-y-1' : 'border-transparent text-neutral-400 hover:text-neutral-900 hover:-translate-y-1'}"
		>Projects</a>
		
		{#if items.certificates.length > 0}
		<a href="#credentials" class="block text-[14px] font-black uppercase tracking-widest transition-all px-4 py-2 border-2 
			{activeSection === 'credentials' ? 'bg-[#FFDE59] text-neutral-900 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] -translate-y-1' : 'border-transparent text-neutral-400 hover:text-neutral-900 hover:-translate-y-1'}"
		>Credentials</a>
		{/if}
		
		{#if items.skills.length > 0}
		<a href="#skills" class="block text-[14px] font-black uppercase tracking-widest transition-all px-4 py-2 border-2 
			{activeSection === 'skills' ? 'bg-[#FFDE59] text-neutral-900 border-neutral-900 shadow-[4px_4px_0px_0px_#171717] -translate-y-1' : 'border-transparent text-neutral-400 hover:text-neutral-900 hover:-translate-y-1'}"
		>Stack</a>
		{/if}
	</nav>

	<!-- Main Content Area -->
	<main class="mx-auto max-w-6xl px-6 pt-24 sm:pt-32 lg:pr-64">
		<header id="home" class="mb-24 flex flex-col gap-6 border-b-4 border-neutral-900 pb-12">
			<div class="flex flex-col md:flex-row gap-8 items-start">
				<div class="shrink-0">
					<div class="relative group">
						<div class="absolute inset-0 bg-neutral-900 translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
						<div class="relative size-48 md:size-64 border-4 border-neutral-900 bg-white overflow-hidden shadow-[2px_2px_0px_0px_#171717]">
							{#if profile.avatarUrl}
								<img 
									src={profile.avatarUrl} 
									alt={profile.name} 
									class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center bg-[#FFDE59]">
									<span class="text-6xl font-black">{profile.name.charAt(0)}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>

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
			</div>

			<div class="flex flex-row flex-wrap gap-4 pt-2">
				<a
					href="mailto:{profile.email}"
					class="group flex items-center justify-center border-2 border-neutral-900 bg-white p-3 text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
					title="Email"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" class="transition-transform group-hover:-translate-y-1"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
				</a>
				<a
					href={profile.github}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center justify-center border-2 border-neutral-900 bg-[#FFDE59] p-3 text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
					title="GitHub"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" class="transition-transform group-hover:-translate-y-1"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
				</a>
				<a
					href={profile.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex items-center justify-center border-2 border-neutral-900 bg-white p-3 text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none"
					title="LinkedIn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" class="transition-transform group-hover:-translate-y-1"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
				</a>
			</div>
		</header>

		<!-- Experience Section -->
		{#if items.experiences && items.experiences.length > 0}
			<Section id="experience" title="Experience">
				<div class="flex flex-col gap-6">
					{#each items.experiences as exp (exp.id)}
						<div class="group flex flex-col items-start gap-4 border-4 border-neutral-900 bg-white p-6 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717]">
							<div class="w-full flex flex-col md:flex-row md:items-start md:justify-between gap-2">
								<h3 class="text-[20px] font-black uppercase tracking-tight text-neutral-900">{exp.role}</h3>
								<div class="flex items-center gap-2">
									<span class="inline-block border-2 border-neutral-900 bg-[#FFDE59] px-2 py-0.5 text-[12px] font-bold text-neutral-900 uppercase">{exp.company}</span>
									<span class="text-[12px] font-bold text-neutral-500">{exp.startDate} - {exp.endDate}</span>
								</div>
							</div>
							{#if exp.description}
								<p class="text-[15px] font-medium leading-relaxed text-neutral-700">
									{exp.description}
								</p>
							{/if}
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Projects Section -->
		<Section id="projects" title={m.public_projects()}>
			<div class="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 transition-all duration-700">
				{#each items.projects as project, i (project.id)}
					{@const row = Math.floor(i / 3)}
					{@const col = i % 3}
					{@const hoveredIdx = items.projects.findIndex(p => p.id === hoveredProjectId)}
					{@const hRow = hoveredIdx !== -1 ? Math.floor(hoveredIdx / 3) : -1}
					{@const hCol = hoveredIdx !== -1 ? hoveredIdx % 3 : -1}
					
					<article 
						class="h-full transition-all duration-500 ease-out"
						onmouseenter={() => (hoveredProjectId = project.id)}
						onmouseleave={() => (hoveredProjectId = null)}
						onfocusin={() => (hoveredProjectId = project.id)}
						onfocusout={() => (hoveredProjectId = null)}
						style:transform={hoveredProjectId && hoveredProjectId !== project.id
							? row < hRow && col === hCol
								? 'translateY(-160px)'
								: 'scale(1)'
							: ''}
						style:z-index={hoveredProjectId === project.id ? '50' : '1'}
						style:opacity={hoveredProjectId && hoveredProjectId !== project.id ? '0.7' : '1'}
						style:filter={hoveredProjectId && hoveredProjectId !== project.id
							? 'blur(4px) grayscale(0.2)'
							: 'none'}
					>
						<PublicProjectCard {project} isHovered={hoveredProjectId === project.id} />
					</article>
				{/each}
			</div>
			
			{#if items.pagination && items.pagination.totalPages > 1}
				<div class="mt-20 flex flex-wrap justify-center gap-4">
					{#each Array.from({ length: items.pagination.totalPages }, (_, i) => i + 1) as p (p)}
						<a
							href="?page={p}#projects"
							class="flex h-14 w-14 items-center justify-center border-4 border-neutral-900 text-[18px] font-black transition-all
								{items.pagination.page === p 
									? 'bg-[#FFDE59] text-neutral-900 shadow-[6px_6px_0px_0px_#171717] -translate-y-1' 
									: 'bg-white text-neutral-900 hover:shadow-[6px_6px_0px_0px_#171717] hover:-translate-y-1 active:translate-y-0 active:shadow-none'}"
						>
							{p}
						</a>
					{/each}
				</div>
			{/if}
		</Section>

		<!-- Credentials Section -->
		{#if items.certificates.length > 0}
			<Section id="credentials" title={m.public_credentials()}>
				<div class="flex flex-col gap-4">
					{#each items.certificates as cert (cert.id)}
						{@const url = cert.imageUrl || cert.credentialUrl || ''}
						{@const udemyMatch = url.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
						{@const isDirectImage = url.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)}
						{@const previewUrl = udemyMatch 
							? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
							: isDirectImage 
								? url 
								: `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`}
						
						<div class="group flex flex-col items-center gap-8 border-4 border-neutral-900 bg-white p-6 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] md:flex-row">
							{#if cert.credentialUrl}
								<a 
									href={cert.credentialUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="relative shrink-0 w-full md:w-48 aspect-video rounded-xl border-4 border-neutral-900 bg-neutral-100 overflow-hidden shadow-[4px_4px_0px_0px_#171717] group/img"
								>
									<div class="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-neutral-400">Loading...</div>
									<img 
										src={previewUrl} 
										alt={cert.name} 
										class="relative z-10 w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500" 
									/>
									<div class="absolute inset-0 z-20 flex items-center justify-center bg-neutral-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity">
										<div class="bg-neutral-900/60 rounded-full p-3 backdrop-blur-sm">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
										</div>
									</div>
								</a>
							{/if}
							
							<div class="flex flex-1 flex-col justify-center">
								<h3 class="text-[20px] font-black uppercase tracking-tight text-neutral-900 sm:text-[24px]">{cert.name}</h3>
								<div class="mt-2 flex items-center gap-3">
									<span class="inline-block border-2 border-neutral-900 bg-[#FFDE59] px-2 py-0.5 text-[12px] font-bold text-neutral-900 uppercase">{cert.issuer}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</Section>
		{/if}

		<!-- Skills Section -->
		{#if items.skills.length > 0}
			<Section id="skills" title={m.public_stack()}>
				<div class="flex flex-wrap gap-4">
					{#each items.skills as skill (skill.id)}
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
		<footer class="mt-40 mb-12 flex flex-col md:flex-row md:items-center justify-between border-t-4 border-neutral-900 pt-8 gap-6 bg-white p-8 shadow-[4px_4px_0px_0px_#171717]">
			<div class="space-y-2">
				<p class="text-[14px] font-black uppercase tracking-widest text-neutral-900 bg-[#FFDE59] inline-block px-2 py-1 border-2 border-neutral-900">Portfolio</p>
				<p class="text-[14px] font-bold uppercase text-neutral-500">© {new Date().getFullYear()} — {profile.name}</p>
			</div>
			<a href="/dashboard" class="group flex shrink-0 items-center gap-2 border-2 border-neutral-900 bg-white px-6 py-3 text-[14px] font-black uppercase tracking-widest text-neutral-900 shadow-[4px_4px_0px_0px_#171717] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#171717] active:translate-x-1 active:translate-y-1 active:shadow-none">
				<span>{m.public_admin()}</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</a>
		</footer>
	</main>
</div>
