<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ConfirmModal from './ConfirmModal.svelte';

	const { Story } = defineMeta({
		title: 'UI/ConfirmModal',
		component: ConfirmModal,
		tags: ['autodocs'],
		argTypes: {
			isOpen: { control: 'boolean' },
			title: { control: 'text' },
			message: { control: 'text' },
			variant: {
				control: 'select',
				options: ['danger', 'primary']
			},
			isLoading: { control: 'boolean' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		isOpen: true,
		title: 'Delete Item?',
		message: 'Are you sure you want to delete this item? This action cannot be undone.',
		onConfirm: () => console.log('Confirmed'),
		onCancel: () => console.log('Cancelled'),
		confirmText: 'Delete',
		cancelText: 'Cancel',
		variant: 'danger',
		isLoading: false
	}}
/>

<Story
	name="Primary"
	args={{
		isOpen: true,
		title: 'Save Changes?',
		message: 'Do you want to save your progress before leaving the page?',
		onConfirm: () => console.log('Confirmed'),
		onCancel: () => console.log('Cancelled'),
		confirmText: 'Save Changes',
		cancelText: 'Discard',
		variant: 'primary',
		isLoading: false
	}}
/>

<Story
	name="Loading"
	args={{
		isOpen: true,
		title: 'Deleting...',
		message: 'Please wait while we process your request.',
		onConfirm: () => console.log('Confirmed'),
		onCancel: () => console.log('Cancelled'),
		confirmText: 'Delete',
		cancelText: 'Cancel',
		variant: 'danger',
		isLoading: true
	}}
/>
