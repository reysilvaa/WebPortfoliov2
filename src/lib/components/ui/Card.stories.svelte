<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';

	const { Story } = defineMeta({
		title: 'UI/Card',
		component: Card,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			description: { control: 'text' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		children: () => 'Card Content'
	}}
/>

<Story
	name="WithHeader"
	args={{
		title: 'Card Title',
		description: 'Card Description',
		children: () => 'Card Content'
	}}
/>

<Story
	name="WithFooter"
	args={{
		title: 'Settings',
		description: 'Update your profile information.',
		children: () => 'Settings form content goes here.',
		footerSnippet: () => 'Save Changes'
	}}
/>
