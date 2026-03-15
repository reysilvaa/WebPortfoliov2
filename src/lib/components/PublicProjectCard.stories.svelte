<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import PublicProjectCard from './PublicProjectCard.svelte';

	const { Story } = defineMeta({
		title: 'Components/PublicProjectCard',
		component: PublicProjectCard,
		tags: ['autodocs'],
		argTypes: {
			project: { control: 'object' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		project: {
			title: 'Awesome Open Source Project',
			description: 'A very cool project that does amazing things with some technology.',
			liveUrl: 'https://example.com',
			repoUrl: 'https://github.com/example/repo',
			tags: 'svelte, typescript, tailwind'
		}
	}}
/>

<Story
	name="NoTags"
	args={{
		project: {
			title: 'Simple Utility Script',
			description: 'Just a small script.',
			liveUrl: null,
			repoUrl: 'https://github.com/example/utility',
			tags: null
		}
	}}
/>
