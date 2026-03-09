<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import Button from './Button.svelte';

	const meta = {
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
	} satisfies Meta<Button>;

	const _meta = meta;
export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Primary: Story = {
		args: {
			variant: 'primary',
			children: () => 'Primary Button'
		}
	};

	export const Secondary: Story = {
		args: {
			variant: 'secondary',
			children: () => 'Secondary Button'
		}
	};

	export const Outline: Story = {
		args: {
			variant: 'outline',
			children: () => 'Outline Button'
		}
	};

	export const Loading: Story = {
		args: {
			isLoading: true,
			children: () => 'Loading...'
		}
	};
</script>
