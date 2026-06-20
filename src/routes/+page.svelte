<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Fallback if DB is empty
	const fallbackProfile = {
		name: 'Rey Silva.',
		role: 'Full Stack Engineer',
		bio: 'Translating intricate business requirements into robust, high-performing code. I build resilient systems and lead technical workflows with a systematic approach focused on efficiency and impact.',
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
		certificates: data.certificates || [],
		skills: data.skills || [],
		experiences: data.experiences || []
	});

	let projectsLimit = $state(6);
	const displayedProjects = $derived(items.projects.slice(0, projectsLimit));

	let activeCategory = $state('All');
	const categories = $derived([
		'All',
		...new Set(
			items.skills.flatMap((s) =>
				(s.category || 'Other')
					.split(',')
					.map((c) => c.trim())
					.filter(Boolean)
			)
		)
	]);
	const filteredSkills = $derived(
		activeCategory === 'All'
			? items.skills
			: items.skills.filter((s) => {
					const cats = (s.category || 'Other')
						.split(',')
						.map((c) => c.trim())
						.filter(Boolean);
					return cats.includes(activeCategory);
				})
	);

	function parseTags(tags: string | string[] | null | undefined): string[] {
		if (!tags) return [];
		if (typeof tags !== 'string') return Array.isArray(tags) ? tags : [String(tags)];
		const trimmed = tags.trim();
		if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
			try {
				const parsed = JSON.parse(trimmed);
				return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
			} catch {
				// fallback
			}
		}
		return trimmed
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	}

	let scrollY = $state(0);
	let activeSection = $state('hero');

	$effect(() => {
		// Reference items that change the DOM structure so animations re-trigger
		void items;
		void displayedProjects;
		void filteredSkills;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						if (
							entry.target.id &&
							['hero', 'work', 'projects', 'skills', 'certificates'].includes(entry.target.id)
						) {
							activeSection = entry.target.id;
						}
					}
				});
			},
			{ rootMargin: '-20% 0px -20% 0px', threshold: 0.1 }
		);

		document.querySelectorAll('.k-anim, section[id]').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{profile.name} | Portfolio</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="kalso-theme relative min-h-screen w-full overflow-x-hidden bg-[#f3edde] text-[#222222] selection:bg-[#222] selection:text-[#f3edde]"
>
	<!-- Cardboard Noise Overlay -->
	<div
		class="pointer-events-none fixed inset-0 z-50 opacity-40 mix-blend-multiply"
		style="background-image: url('https://assets.website-files.com/632362a86148e65d0023fa79/632362a86148e6223d23fad9_cardboard.png'); background-size: 400px;"
	></div>

	<!-- KALSO-STYLE TIMELINE (Fixed Right) -->
	<nav
		class="pointer-events-auto fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex"
	>
		<span class="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#222]/40 uppercase"
			>Start</span
		>

		<a
			href="{resolve('/')}#hero"
			aria-label="Go to Hero"
			class="group relative flex h-10 w-8 items-center justify-center"
		>
			<span
				class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
			>
				Intro
			</span>
			<div
				class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
				'hero'
					? 'scale-110 bg-[#222]'
					: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
			></div>
		</a>

		{#if items.experiences.length > 0}
			<div class="h-6 border-l border-dashed border-[#222]/25"></div>
			<a
				href="{resolve('/')}#work"
				aria-label="Go to Experience"
				class="group relative flex h-10 w-8 items-center justify-center"
			>
				<span
					class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
				>
					Experience
				</span>
				<div
					class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
					'work'
						? 'scale-110 bg-[#222]'
						: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
				></div>
			</a>
		{/if}

		{#if items.projects.length > 0}
			<div class="h-6 border-l border-dashed border-[#222]/25"></div>
			<a
				href="{resolve('/')}#projects"
				aria-label="Go to Projects"
				class="group relative flex h-10 w-8 items-center justify-center"
			>
				<span
					class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
				>
					Projects
				</span>
				<div
					class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
					'projects'
						? 'scale-110 bg-[#222]'
						: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
				></div>
			</a>
		{/if}

		{#if items.skills.length > 0}
			<div class="h-6 border-l border-dashed border-[#222]/25"></div>
			<a
				href="{resolve('/')}#skills"
				aria-label="Go to Skills"
				class="group relative flex h-10 w-8 items-center justify-center"
			>
				<span
					class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
				>
					Toolbox
				</span>
				<div
					class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
					'skills'
						? 'scale-110 bg-[#222]'
						: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
				></div>
			</a>
		{/if}

		{#if items.certificates.length > 0}
			<div class="h-6 border-l border-dashed border-[#222]/25"></div>
			<a
				href="{resolve('/')}#certificates"
				aria-label="Go to Credentials"
				class="group relative flex h-10 w-8 items-center justify-center"
			>
				<span
					class="pointer-events-none absolute right-8 z-50 mr-2 translate-x-2 border border-[#222]/20 bg-[#f3edde]/95 px-2.5 py-1 font-mono text-[9px] font-black tracking-widest whitespace-nowrap text-[#222] uppercase opacity-0 shadow-[3px_3px_0_#222] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
				>
					Credentials
				</span>
				<div
					class="h-3 w-3 rotate-45 border-2 border-[#222] transition-all duration-300 {activeSection ===
					'certificates'
						? 'scale-110 bg-[#222]'
						: 'bg-[#f3edde] opacity-50 group-hover:scale-110 group-hover:opacity-100'}"
				></div>
			</a>
		{/if}

		<span class="mt-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#222]/40 uppercase"
			>Now</span
		>
	</nav>

	<!-- Fixed Logo and Contact Link -->
	<div class="fixed top-8 left-8 z-40 flex flex-col items-start gap-1">
		<a
			href="#hero"
			class="font-mono text-2xl font-black tracking-tighter transition-opacity hover:opacity-70"
			>{profile.name.split(' ')[0]}.</a
		>
		<a
			href="mailto:{profile.email}"
			class="border-b border-[#222] pb-0.5 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:tracking-[0.3em] hover:text-[#555]"
			>Contact</a
		>
	</div>

	<!-- GIANT BACKGROUND TEXT (Changes based on section) -->
	<div
		class="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
	>
		<h2
			class="text-[25vw] leading-none font-black text-[#222] opacity-[0.03] transition-all duration-1000 ease-out"
			style="font-family: 'Inconsolata', monospace; letter-spacing: -0.05em;"
		>
			{#if activeSection === 'hero'}
				HELLO
			{:else if activeSection === 'work'}
				WORK
			{:else if activeSection === 'projects'}
				PROJ
			{:else if activeSection === 'skills'}
				TOOL
			{:else if activeSection === 'certificates'}
				CERT
			{/if}
		</h2>
	</div>

	<main class="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-32 sm:px-12 md:px-24">
		<!-- HERO SECTION -->
		<section id="hero" class="relative flex min-h-[90vh] flex-col justify-center pt-10 pb-20">
			<div class="relative grid grid-cols-1 items-center gap-12 md:grid-cols-12">
				<!-- Left Text Side -->
				<div class="z-10 flex flex-col items-start text-left md:col-span-7">
					<div class="k-anim slide-right mb-4 delay-1">
						<p class="font-mono text-[10px] font-bold tracking-[0.3em] text-[#555] uppercase">
							Welcome to the portfolio of
						</p>
					</div>

					<h1
						class="k-anim mask-up font-mono text-5xl leading-[0.9] font-black tracking-tighter text-[#222] uppercase delay-2 sm:text-7xl md:text-8xl lg:text-[110px]"
					>
						{profile.name}
					</h1>

					<div class="k-anim slide-up mt-4 mb-8 delay-3">
						<p
							class="inline-block border-b-2 border-[#222] pb-1 text-sm font-bold tracking-[0.2em] text-[#222] uppercase sm:text-base"
							style="font-family: 'Inconsolata', monospace;"
						>
							{profile.role}
						</p>
					</div>

					<div class="k-anim fade-up max-w-xl delay-4">
						<p class="font-sans text-base leading-relaxed font-medium text-[#444] sm:text-lg">
							{profile.bio}
						</p>
					</div>

					<div class="k-anim slide-up mt-10 flex flex-wrap gap-4 delay-5 md:gap-6">
						<a
							href="#work"
							class="border border-[#222] bg-[#222] px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#f3edde] uppercase transition-all hover:bg-transparent hover:text-[#222]"
						>
							View Work
						</a>
						<a
							href={resolve('/api/resume')}
							target="_blank"
							class="border border-[#222] bg-[#f3edde] px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#222] uppercase transition-all hover:bg-[#222] hover:text-[#f3edde]"
						>
							Download ATS Resume
						</a>
						<a
							href="mailto:{profile.email}"
							class="border border-[#222]/20 px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-[#222] uppercase transition-all hover:border-[#222] hover:bg-[#222]/5"
						>
							Contact
						</a>
					</div>
				</div>

				<!-- Right Image Side -->
				{#if profile.avatarUrl}
					<div class="relative z-0 mt-12 flex justify-center md:col-span-5 md:mt-0 md:justify-end">
						<!-- Decorative Elements Behind Image -->
						<div
							class="absolute -top-10 -right-10 -z-10 opacity-20"
							style="transform: translateY({scrollY * -0.1}px) rotate({scrollY * 0.05}deg)"
						>
							<svg width="200" height="200" viewBox="0 0 100 100" fill="none"
								><circle
									cx="50"
									cy="50"
									r="48"
									stroke="#222"
									stroke-width="0.5"
									stroke-dasharray="2 4"
								/></svg
							>
						</div>

						<div
							class="k-anim scale-up overflow-hidden border border-[#222]/15 bg-white/40 p-3 shadow-[8px_8px_0_rgba(34,34,34,0.03)] delay-4"
							style="transform: translateY({scrollY * -0.03}px) rotate(2deg)"
						>
							<img
								src={profile.avatarUrl}
								alt="Avatar"
								class="aspect-3/4 w-64 object-cover grayscale transition-all duration-700 hover:grayscale-0 md:w-80"
							/>
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- WORK SECTION -->
		{#if items.experiences.length > 0}
			<section id="work" class="mt-40">
				<div class="mb-32">
					<h2
						class="k-anim mask-up text-center font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl md:text-left"
					>
						Experience
					</h2>
					<div class="k-anim stretch-out relative mt-6 h-px w-full bg-[#222]/20 delay-2">
						<div class="absolute top-0 left-0 h-full w-24 bg-[#222]"></div>
					</div>
				</div>

				<!-- Editorial Timeline Layout -->
				<div class="relative ml-4 border-l border-[#222]/20 pl-8 md:ml-12 md:pl-16">
					{#each items.experiences as exp, i (exp.id || i)}
						<div
							class="k-anim fade-up group relative mb-20 last:mb-0"
							style="transition-delay: {(i % 3) * 100}ms"
						>
							<!-- Node (rotated square) -->
							<div
								class="absolute top-2.5 left-[-36.5px] h-2.5 w-2.5 rotate-45 border border-[#222] bg-[#f3edde] ring-4 ring-[#f3edde] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#222] md:left-[-68.5px]"
							></div>

							<!-- Horizontal connector line that grows on hover -->
							<div
								class="absolute top-3.5 -left-8 h-px w-8 bg-[#222]/15 transition-colors duration-300 group-hover:bg-[#222]/40 md:-left-16 md:w-16"
							></div>

							<div
								class="-m-4 grid grid-cols-1 items-start gap-6 rounded p-4 transition-all duration-300 hover:bg-white/20 md:grid-cols-12"
							>
								<div class="flex flex-col items-start gap-2 md:col-span-4">
									<span
										class="inline-block border border-[#222]/25 bg-white/40 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.2em] text-[#222] uppercase shadow-[2px_2px_0_rgba(34,34,34,0.05)]"
									>
										{exp.startDate} — {exp.endDate}
									</span>
									<h3
										class="mt-2 font-mono text-2xl leading-none font-black tracking-tight text-[#222] uppercase"
									>
										{exp.company}
									</h3>
								</div>

								<div class="border-l border-[#222]/10 pl-6 md:col-span-8 md:pl-8">
									<h4 class="text-lg font-bold tracking-wide text-[#222] uppercase">{exp.role}</h4>
									{#if exp.description}
										<p class="mt-4 font-sans text-sm leading-relaxed text-[#555]">
											{exp.description}
										</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- PROJECTS SECTION -->
		{#if items.projects.length > 0}
			<section id="projects" class="mt-40">
				<div class="mb-32 text-right">
					<h2
						class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
					>
						Selected Works
					</h2>
					<div class="k-anim stretch-out relative mt-6 h-px w-full bg-[#222]/20 delay-2">
						<div class="absolute top-0 right-0 h-full w-24 bg-[#222]"></div>
					</div>
				</div>

				<div class="flex flex-col gap-40">
					{#each displayedProjects as proj, i (proj.id || i)}
						<div class="group relative grid grid-cols-1 items-center gap-8 md:grid-cols-12">
							<!-- Image (Large alternating left/right) -->
							<div
								class="k-anim zoom-in md:col-span-7 md:row-start-1 {i % 2 === 0
									? 'md:col-start-1'
									: 'md:col-start-6'} relative z-0"
							>
								<a
									href={proj.liveUrl || proj.repoUrl || '#'}
									target="_blank"
									aria-label="View Project"
									class="block w-full overflow-hidden border border-[#222]/20 bg-white/50 p-2 shadow-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl"
								>
									{#if proj.imageUrl}
										<div class="aspect-video w-full overflow-hidden">
											<img
												src={proj.imageUrl}
												alt={proj.title}
												class="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
											/>
										</div>
									{:else}
										<div
											class="flex aspect-video w-full items-center justify-center bg-[#222] font-mono text-sm tracking-widest text-[#f3edde] uppercase transition-transform duration-700 group-hover:scale-105"
										>
											No Image
										</div>
									{/if}
								</a>
							</div>

							<!-- Text Overlapping Block -->
							<div
								class="k-anim md:col-span-6 md:row-start-1 {i % 2 === 0
									? 'slide-left md:col-start-7 md:-ml-16'
									: 'slide-right md:col-start-1 md:-mr-16'} relative z-10 border border-[#222]/20 bg-[#f3edde]/95 p-8 shadow-[8px_8px_0_rgba(34,34,34,0.08)] backdrop-blur-md transition-all duration-500 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_#222] md:mt-24"
							>
								<div
									class="mb-4 font-mono text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase"
								>
									Project {i + 1}
								</div>
								<h3
									class="font-mono text-3xl font-black tracking-tighter text-[#222] uppercase transition-colors duration-300 sm:text-4xl"
								>
									{proj.title}
								</h3>
								<p class="mt-6 font-sans text-sm leading-relaxed text-[#444]">
									{proj.description}
								</p>

								<div class="mt-8 flex flex-wrap gap-2">
									{#each parseTags(proj.tags) as tag, t (tag)}
										<span
											class="k-anim fade-up border border-[#222]/20 bg-white/55 px-3 py-1 font-mono text-[9px] font-bold tracking-[0.2em] uppercase transition-all hover:-translate-y-0.5 hover:bg-[#222] hover:text-[#f3edde] hover:shadow-[2px_2px_0_#222]"
											style="transition-delay: {t * 50}ms"
										>
											{tag}
										</span>
									{/each}
								</div>

								<div class="mt-8 flex gap-5 border-t border-[#222]/10 pt-6">
									{#if proj.liveUrl}
										<a
											href={proj.liveUrl}
											target="_blank"
											class="group/btn flex items-center gap-2 font-mono text-[11px] font-black tracking-[0.15em] text-[#222] uppercase transition-colors hover:text-[#666]"
										>
											<span>Live Demo</span>
											<svg
												class="h-3.5 w-3.5 transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
												fill="none"
												stroke="currentColor"
												stroke-width="2.5"
												viewBox="0 0 24 24"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
												/>
											</svg>
										</a>
									{/if}
									{#if proj.repoUrl}
										<a
											href={proj.repoUrl}
											target="_blank"
											class="group/btn flex items-center gap-2 font-mono text-[11px] font-black tracking-[0.15em] text-[#222]/70 uppercase transition-colors hover:text-[#222]"
										>
											<span>Repository</span>
											<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
												<path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
												/>
											</svg>
										</a>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- SHOW MORE CONTROLS -->
				{#if projectsLimit < items.projects.length}
					<div
						class="k-anim fade-up mt-32 flex items-center justify-center gap-8 border-t border-[#222]/10 pt-10"
					>
						<button
							onclick={() => (projectsLimit += 6)}
							class="group relative cursor-pointer overflow-hidden border border-[#222]/20 bg-white/50 px-8 py-3 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all"
						>
							<span class="relative z-10 transition-colors group-hover:text-[#f3edde]"
								>Show More</span
							>
							<div
								class="absolute inset-0 z-0 h-full w-full origin-bottom scale-y-0 bg-[#222] transition-transform duration-300 ease-out group-hover:scale-y-100"
							></div>
						</button>
					</div>
				{/if}
			</section>
		{/if}

		<!-- SKILLS / TOOLBOX SECTION -->
		{#if items.skills.length > 0}
			<section id="skills" class="mt-40">
				<div class="mb-24 text-center">
					<h2
						class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
					>
						Toolbox
					</h2>
					<div class="k-anim stretch-out mx-auto mt-6 h-px w-24 bg-[#222] delay-2"></div>
				</div>

				<!-- Category Filter Tabs -->
				<div class="k-anim fade-up mb-12 flex flex-wrap justify-center gap-3">
					{#each categories as cat (cat)}
						<button
							onclick={() => (activeCategory = cat)}
							class="cursor-pointer border px-6 py-2 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all active:scale-95 {activeCategory ===
							cat
								? 'border-[#222] bg-[#222] text-[#f3edde] shadow-[4px_4px_0_#222]'
								: 'border-[#222]/25 bg-white/30 text-[#555] hover:border-[#222] hover:bg-[#222]/5 hover:text-[#222]'}"
						>
							{cat}
						</button>
					{/each}
				</div>

				<!-- Skills Grid -->
				<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
					{#each filteredSkills as skill, i (skill.id || skill.name)}
						<div
							class="k-anim fade-up group relative flex h-32 flex-col justify-between border border-[#222]/15 bg-white/40 p-5 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#222] hover:shadow-[6px_6px_0_#222]"
							style="transition-delay: {(i % 4) * 75}ms"
						>
							<div class="flex items-start justify-between">
								<span class="font-mono text-[10px] font-bold tracking-widest text-[#222]/40">
									[{String(i + 1).padStart(2, '0')}]
								</span>
								<span
									class="rounded bg-[#222]/5 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#555] uppercase"
								>
									{skill.category || 'Skill'}
								</span>
							</div>

							<div>
								<h3
									class="font-mono text-base font-black tracking-tight text-[#222] uppercase transition-colors duration-300 group-hover:text-[#666]"
								>
									{skill.name}
								</h3>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- CERTIFICATES SECTION -->
		{#if items.certificates.length > 0}
			<section id="certificates" class="mt-40">
				<div class="mb-32 text-center">
					<h2
						class="k-anim mask-up font-mono text-4xl font-black tracking-tighter uppercase sm:text-6xl"
					>
						Credentials
					</h2>
					<div class="k-anim stretch-out mx-auto mt-6 h-px w-24 bg-[#222] delay-2"></div>
				</div>

				<div class="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
					{#each items.certificates as cert, i (cert.id || i)}
						{@const url = cert.imageUrl || cert.credentialUrl || ''}
						{@const udemyMatch = url.match(/udemy\.com\/certificate\/(UC-[\w-]+)/)}
						{@const previewUrl = udemyMatch
							? `https://udemy-certificate.s3.amazonaws.com/image/${udemyMatch[1]}.jpg`
							: url}

						<div
							class="k-anim flip-up group flex flex-col border border-[#222]/15 bg-white/40 p-4 shadow-[4px_4px_0_rgba(34,34,34,0.04)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-[#222] hover:shadow-[8px_8px_0_#222]"
							style="transition-delay: {(i % 3) * 100}ms"
						>
							<a
								href={cert.credentialUrl || '#'}
								target="_blank"
								aria-label="View Credential"
								class="block overflow-hidden border border-[#222]/10 bg-white/50"
							>
								{#if previewUrl}
									<div class="aspect-4/3 w-full overflow-hidden">
										<img
											src={previewUrl}
											alt={cert.name}
											class="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
										/>
									</div>
								{:else}
									<div
										class="flex aspect-4/3 w-full items-center justify-center bg-[#222] font-mono text-[10px] tracking-widest text-[#f3edde] uppercase"
									>
										No Document
									</div>
								{/if}
							</a>
							<div class="mt-5 flex grow flex-col justify-between">
								<h4
									class="line-clamp-2 font-mono text-sm leading-snug font-black tracking-tight text-[#222] uppercase transition-colors group-hover:text-[#666]"
								>
									{cert.name}
								</h4>
								<div
									class="mt-6 flex items-center justify-between border-t border-[#222]/10 pt-4 font-mono text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase"
								>
									<span>{cert.issuer}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- FOOTER -->
		<footer
			class="mt-40 flex flex-col items-center justify-between gap-6 border-t border-[#222]/20 pt-10 sm:flex-row"
		>
			<span class="font-mono text-[10px] font-bold tracking-[0.2em] text-[#555] uppercase">
				© {new Date().getFullYear()}
				{profile.name}
			</span>
			<a
				href={resolve('/dashboard')}
				class="k-anim slide-left font-mono text-[10px] font-bold tracking-[0.2em] text-[#222] uppercase transition-all hover:tracking-[0.3em] hover:underline"
			>
				Admin Dashboard
			</a>
		</footer>
	</main>
</div>

<style>
	/* Custom Fonts & Base */
	.kalso-theme {
		font-family: 'Inconsolata', monospace;
	}
	.font-sans {
		font-family:
			'Inter',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	/* Animations Engine */
	.k-anim {
		will-change: transform, opacity, filter;
	}

	/* 1. Mask Up (For Headers) */
	.mask-up {
		clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
		transform: translateY(40px);
		transition:
			transform 1s cubic-bezier(0.16, 1, 0.3, 1),
			clip-path 1s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.mask-up.is-visible) {
		clip-path: polygon(0 -20%, 100% -20%, 100% 120%, 0 120%);
		transform: translateY(0);
	}

	/* 2. Fade Up (For Cards/Sections) */
	.fade-up {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 0.8s ease-out,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.fade-up.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	/* 4. Scale Up (For Avatar) */
	.scale-up {
		opacity: 0;
		transform: scale(0.8) translateY(20px);
		transition:
			opacity 1s ease-out,
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.scale-up.is-visible) {
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	/* 5. Zoom In (For Project Pictures) */
	.zoom-in {
		opacity: 0;
		transform: scale(0.95);
		transition:
			opacity 1s ease-out,
			transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.zoom-in.is-visible) {
		opacity: 1;
		transform: scale(1);
	}

	/* 6. Slide Right (For Left-side items) */
	.slide-right {
		opacity: 0;
		transform: translateX(-40px);
		transition:
			opacity 0.8s ease-out,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.slide-right.is-visible) {
		opacity: 1;
		transform: translateX(0);
	}

	/* 7. Slide Left (For Right-side items) */
	.slide-left {
		opacity: 0;
		transform: translateX(40px);
		transition:
			opacity 0.8s ease-out,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.slide-left.is-visible) {
		opacity: 1;
		transform: translateX(0);
	}

	/* 9. Stretch Out (For dividers) */
	.stretch-out {
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.stretch-out.is-visible) {
		transform: scaleX(1);
	}

	/* 11. Flip Up (For Certificates) */
	.flip-up {
		opacity: 0;
		transform: perspective(1000px) rotateX(-20deg) translateY(30px);
		transform-origin: bottom;
		transition:
			opacity 0.8s ease-out,
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.flip-up.is-visible) {
		opacity: 1;
		transform: perspective(1000px) rotateX(0) translateY(0);
	}

	/* 12. Slide Up */
	.slide-up {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s ease-out,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.slide-up.is-visible) {
		opacity: 1;
		transform: translateY(0);
	}

	/* Utility Delays */
	:global(.delay-1) {
		transition-delay: 100ms;
	}
	:global(.delay-2) {
		transition-delay: 200ms;
	}
	:global(.delay-3) {
		transition-delay: 300ms;
	}
	:global(.delay-4) {
		transition-delay: 400ms;
	}
	:global(.delay-5) {
		transition-delay: 500ms;
	}
</style>
