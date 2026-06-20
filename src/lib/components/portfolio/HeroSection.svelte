<script lang="ts">
	import { resolve } from '$app/paths';
	type Profile = {
		name: string;
		role: string;
		bio: string;
		avatarUrl?: string | null;
		email?: string | null;
		github?: string | null;
		linkedin?: string | null;
	};
	let { profile, scrollY }: { profile: Profile; scrollY: number } = $props();
</script>

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
