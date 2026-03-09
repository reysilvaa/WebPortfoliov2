<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import Input from './Input.svelte';

	const meta = {
		title: 'UI/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			label: { control: 'text' },
			error: { control: 'text' },
			placeholder: { control: 'text' }
		}
	} satisfies Meta<Input>;

	const _meta = meta;
export default _meta;
	type Story = StoryObj<typeof meta>;

	export const Default: Story = {
		args: {
			placeholder: 'Enter something...'
		}
	};

	export const WithLabel: Story = {
		args: {
			label: 'Full Name',
			placeholder: 'Rey Silva'
		}
	};

	export const WithError: Story = {
		args: {
			label: 'Email',
			placeholder: 'email@example.com',
			error: 'Invalid email address'
		}
	};
</script>
