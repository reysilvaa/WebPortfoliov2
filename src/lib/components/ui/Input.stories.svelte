<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Input from './Input.svelte';

	const { Story } = defineMeta({
		title: 'UI/Input',
		component: Input,
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
		placeholder: 'Enter something...'
	}}
/>

<Story
	name="WithLabel"
	args={{
		label: 'Full Name',
		placeholder: 'Rey Silva'
	}}
/>

<Story
	name="WithError"
	args={{
		label: 'Email',
		placeholder: 'email@example.com',
		error: 'Invalid email address'
	}}
/>
