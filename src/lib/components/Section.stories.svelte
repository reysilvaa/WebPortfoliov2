<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Section from './Section.svelte';

	const { Story } = defineMeta({
		title: 'Layout/Section',
		component: Section,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			class: { control: 'text' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		title: 'Projects',
		children: () => 'Section content goes here. This could be a list of projects or other elements.'
	}}
/>
