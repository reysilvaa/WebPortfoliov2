<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ProjectItem from './ProjectItem.svelte';

	const { Story } = defineMeta({
		title: 'Components/ProjectItem',
		component: ProjectItem,
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
			id: '123',
			title: 'Project Title',
			description: 'This is a description of the project.',
			language: 'TypeScript',
			tags: 'svelte, tailwind',
			stars: 42,
			forks: 7,
			isHidden: false
		}
	}}
/>

<Story
	name="Hidden"
	args={{
		project: {
			id: '124',
			title: 'Secret Project',
			description: 'This project is hidden from the public portfolio.',
			language: 'Python',
			tags: 'machine-learning',
			stars: 0,
			forks: 0,
			isHidden: true
		}
	}}
/>
