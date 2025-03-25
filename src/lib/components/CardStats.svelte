<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		stats: string;
		subTitle: string;
		icon?: Snippet;
	};

	const { title, stats, subTitle, icon }: Props = $props();
</script>

<div class="rounded-md border border-gray-300 p-4">
	{#if icon}
		<div class="top-0 float-end opacity-70">
			{@render icon()}
		</div>
	{/if}
	<h3 class="text-md font-bold">{title}</h3>
	<p class="mt-2 text-2xl font-black">{stats}</p>
	<p class="font-regular text-sm tracking-wide opacity-50">{subTitle}</p>
</div>
