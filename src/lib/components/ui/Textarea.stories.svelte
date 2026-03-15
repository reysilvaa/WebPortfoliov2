<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Textarea from './Textarea.svelte';

	const { Story } = defineMeta({
		title: 'UI/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			error: { control: 'text' },
			placeholder: { control: 'text' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		placeholder: 'Write your content here...'
	}}
/>

<Story
	name="WithLabel"
	args={{
		label: 'Bio',
		placeholder: 'Tell us about yourself...'
	}}
/>

<Story
	name="WithError"
	args={{
		label: 'Bio',
		placeholder: 'Tell us about yourself...',
		error: 'Bio must be at least 10 characters'
	}}
/>
