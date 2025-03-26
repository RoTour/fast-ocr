<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		type?: 'submit' | 'button' | 'reset';
		disabled?: boolean;
	};
	const { children, type, disabled }: Props = $props();
</script>

<button
	class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
	{type}
	{disabled}
>
	{@render children()}
</button>
