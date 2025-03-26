<script lang="ts">
	import { Check } from "lucide-svelte";

  type Props = {
    fileNames: string[];
  };
  const { fileNames }: Props = $props();
</script>

<div class="mt-4">
  <h4 class="mb-2 text-sm font-medium text-muted-foreground">Uploaded files:</h4>
  <ul class="space-y-1">
    {#each fileNames as fileName}
      <li class="flex items-center gap-2 text-sm text-foreground">
        <Check class="h-4 w-4 text-primary" />
        <span>{fileName}</span>
      </li>
    {/each}
  </ul>
</div>