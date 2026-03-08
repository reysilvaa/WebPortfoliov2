<script lang="ts">
	// Portfolio Data
	const profile = {
		name: 'Rey Silva',
		role: 'Software Engineer & Full Stack Developer',
		bio: 'Passionate about building scalable web applications and intuitive user experiences. Specialized in SvelteKit, TypeScript, and modern backend architectures.',
		email: 'contact@reysilva.com',
		github: 'https://github.com/reysilvaa',
		linkedin: 'https://linkedin.com/in/reysilvaa'
	};

	const projects = [
		{
			title: 'Oopedia Adaptive Learning',
			description: 'An adaptive learning platform using intelligent rules and dynamic module progression to personalize student learning paths.',
			tags: ['SvelteKit', 'PHP', 'TypeScript', 'Tailwind']
		},
		{
			title: 'Order Degan Sulfat',
			description: 'A comprehensive order management system for a beverage business, featuring real-time tracking, automated inventory, and POS.',
			tags: ['SvelteKit', 'Drizzle ORM', 'Turso SQLite']
		}
	];
</script>

<svelte:head>
	<title>{profile.name} - {profile.role}</title>
	<meta name="description" content={profile.bio} />
</svelte:head>

<div class="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col justify-center items-center px-4 py-20 font-sans">
	<main class="w-full max-w-3xl flex flex-col items-center text-center space-y-16">
		
		<!-- Hero Section -->
		<header class="space-y-6 flex flex-col items-center animate-fade-in">
			<div class="w-24 h-24 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center overflow-hidden mb-4 shadow-sm">
				<span class="text-3xl font-light text-neutral-500">{profile.name.charAt(0)}</span>
			</div>
			
			<h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-950">
				{profile.name}
			</h1>
			
			<p class="text-xl md:text-2xl font-medium text-neutral-600 max-w-2xl">
				{profile.role}
			</p>
			
			<p class="text-base md:text-lg text-neutral-500 max-w-2xl leading-relaxed">
				{profile.bio}
			</p>
			
			<div class="flex gap-4 pt-4 justify-center">
				<a href="mailto:{profile.email}" class="px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors shadow-sm">
					Contact Me
				</a>
				<a href={profile.github} target="_blank" rel="noopener noreferrer" class="px-6 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-full font-medium hover:bg-neutral-50 transition-colors shadow-sm">
					GitHub
				</a>
			</div>
		</header>

		<hr class="w-12 border-neutral-200" />

		<!-- Projects Section -->
		<section class="w-full space-y-8 flex flex-col items-center">
			<h2 class="text-2xl font-bold text-neutral-900 tracking-tight">Selected Work</h2>
			
			<div class="w-full flex-col grid gap-6 md:gap-8 items-center max-w-2xl mx-auto">
				{#each projects as project (project.title)}
					<article class="w-full bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 text-left hover:shadow-lg transition-shadow duration-300 cursor-default group">
						<h3 class="text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">{project.title}</h3>
						<p class="text-neutral-600 mb-6 leading-relaxed">
							{project.description}
						</p>
						<div class="flex flex-wrap gap-2">
							{#each project.tags as tag (tag)}
								<span class="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm font-medium rounded-full">
									{tag}
								</span>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</section>

		<!-- Footer -->
		<footer class="pt-12 text-center text-neutral-400 text-sm font-medium">
			<p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
		</footer>

	</main>
</div>

<style>
	/* Minimalist custom animations */
	:global(body) {
		background-color: #fafafa;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.animate-fade-in {
		animation: fadeIn 0.8s ease-out forwards;
	}
</style>
