<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['primary', 'secondary', 'outline', 'ghost', 'danger']
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg', 'icon']
			},
			isLoading: { control: 'boolean' }
		}
	});
</script>

<Story
	name="Primary"
	args={{
		variant: 'primary',
		children: () => 'Primary Button'
	}}
/>

<Story
	name="Secondary"
	args={{
		variant: 'secondary',
		children: () => 'Secondary Button'
	}}
/>

<Story
	name="Outline"
	args={{
		variant: 'outline',
		children: () => 'Outline Button'
	}}
/>

<Story
	name="Loading"
	args={{
		isLoading: true,
		children: () => 'Loading...'
	}}
/>
