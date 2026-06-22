<script lang="ts">
	let { message = 'No items found.' } = $props();
</script>

<div
	class="py-16 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-white sm:col-span-2 lg:col-span-3"
>
	<p class="text-[14px] font-medium text-neutral-500">{message}</p>
</div>
