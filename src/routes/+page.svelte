<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	// Fallback if DB is empty
	const profile = {
		name: 'Rey Silva',
		role: 'Full Stack Engineer',
		bio: 'Crafting high-precision digital experiences with SvelteKit and modern backend systems. Specialized in creating scalable, performance-oriented architectures.',
		email: 'contact@reysilva.com',
		github: 'https://github.com/reysilvaa',
		linkedin: 'https://linkedin.com/in/reysilvaa'
	};

	const items = $derived({
		projects: data.projects || [],
		certificates: data.certificates || [],
		skills: data.skills || []
	});
</script>

<svelte:head>
	<title>{profile.name} — {profile.role}</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div class="min-h-screen bg-[#fafafa] selection:bg-neutral-950 selection:text-white font-sans antialiased text-neutral-900 pb-32">
	<!-- Background Mesh -->
	<div class="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
		<svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)" />
		</svg>
	</div>

	<main class="max-w-2xl mx-auto px-6 pt-32 sm:pt-48 relative z-10 space-y-24">
		<!-- Hero -->
		<section class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
			<div class="flex flex-col gap-6">
				<div class="w-14 h-14 bg-neutral-950 rounded-2xl flex items-center justify-center shadow-2xl shadow-neutral-900/20 rotate-3 hover:rotate-0 transition-all duration-500 cursor-default">
					<span class="text-white text-2xl font-bold">R</span>
				</div>
				<div class="space-y-2">
					<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
						{profile.name}
					</h1>
					<p class="text-lg sm:text-xl font-bold text-neutral-400">
						{profile.role}
					</p>
				</div>
			</div>

			<p class="text-[17px] leading-relaxed text-neutral-500 font-medium max-w-xl">
				{profile.bio}
			</p>

			<div class="flex items-center gap-4 pt-2">
				<a href="mailto:{profile.email}" class="h-12 px-6 bg-neutral-950 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-95 flex items-center shadow-xl shadow-neutral-900/10">
					Get in touch
				</a>
				<div class="flex gap-2">
					<a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" class="w-12 h-12 flex items-center justify-center bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 transition-all">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
					</a>
					<a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" class="w-12 h-12 flex items-center justify-center bg-white border border-neutral-200 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 transition-all">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
					</a>
				</div>
			</div>
		</section>

		<!-- Projects -->
		<section class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
			<div class="space-y-1">
				<h2 class="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Selected Works</h2>
				<div class="h-1 w-8 bg-neutral-900 rounded-full"></div>
			</div>
			
			<div class="grid gap-8">
				{#each items.projects as project}
					<article class="group relative flex flex-col gap-3 p-6 -mx-6 rounded-3xl hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-transparent hover:border-neutral-200/60 transition-all duration-500">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-bold text-neutral-950 group-hover:translate-x-1 transition-transform">{project.title}</h3>
							<div class="opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
							</div>
						</div>
						<p class="text-[15px] font-medium text-neutral-500 max-w-lg leading-relaxed">{project.description}</p>
						<div class="flex gap-2 pt-2">
							{#each (project.tags || '').split(',').map(t => t.trim()).filter(Boolean) as tag}
								<span class="text-[10px] font-black uppercase tracking-widest text-neutral-400 bg-neutral-100 px-2 py-1 rounded-lg">{tag}</span>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</section>

		{#if items.certificates.length > 0}
			<!-- Certificates -->
			<section class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
				<div class="space-y-1">
					<h2 class="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Credentials</h2>
					<div class="h-1 w-8 bg-neutral-900 rounded-full"></div>
				</div>
				
				<div class="grid gap-6">
					{#each items.certificates as cert}
						<div class="flex items-center justify-between p-6 -mx-6 rounded-3xl hover:bg-white border border-transparent hover:border-neutral-200/60 transition-all group">
							<div class="space-y-1">
								<h3 class="text-[15px] font-bold text-neutral-950">{cert.name}</h3>
								<p class="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">{cert.issuer}</p>
							</div>
							{#if cert.credentialUrl}
								<a href={cert.credentialUrl} target="_blank" aria-label="View Certificate for {cert.name}" class="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 group-hover:bg-neutral-950 group-hover:text-white transition-all">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Footer -->
		<footer class="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-400 font-bold text-[11px] uppercase tracking-[0.2em] animate-in fade-in duration-1000 delay-500">
			<p>© {new Date().getFullYear()} Precision Built</p>
			<div class="flex gap-6 items-center">
				<a href="/dashboard" class="hover:text-neutral-950 transition-colors">Admin Area</a>
				<div class="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
			</div>
		</footer>
	</main>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.animate-in {
		animation-fill-mode: both;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slideInFromBottom {
		from { opacity: 0; transform: translateY(2rem); }
		to { opacity: 1; transform: translateY(0); }
	}

	.fade-in { animation: fadeIn 1s ease-out; }
	.slide-in-from-bottom-4 { animation: slideInFromBottom 0.8s ease-out; }
	.slide-in-from-bottom-8 { animation: slideInFromBottom 1.2s ease-out; }

	.delay-200 { animation-delay: 200ms; }
	.delay-500 { animation-delay: 500ms; }
</style>
