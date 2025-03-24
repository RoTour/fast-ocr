<script lang="ts">
  const { error } = $props();
</script>

<h1>Something went wrong</h1>
<p>{error.message}</p>