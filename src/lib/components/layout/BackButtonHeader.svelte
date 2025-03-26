<script>
	import { MoveLeft } from 'lucide-svelte';
</script>

<header class="mb-6 flex items-center gap-2 px-4 py-2">
	<button
		class="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
		onclick={() => history.back()}
	>
		<MoveLeft />
	</button>
	<h1 class="text-2xl font-bold">Scan Receipt</h1>
</header>
