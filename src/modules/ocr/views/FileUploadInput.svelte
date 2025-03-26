<script lang="ts">
	import { Plus } from "lucide-svelte";

	type Props = {
		allowMultiple?: boolean;
    files: File[];
	};
	let { allowMultiple = false, files = $bindable() }: Props = $props();

	$inspect('INSPECT - FileUploadInput.files', files);

	let isLoading = $state(false);

	const handleFileUpload = async (event: Event) => {
		const fileInput = event.target as HTMLInputElement;
		const newFiles = Array.from(
			(allowMultiple ? fileInput.files : [fileInput.files?.[0]]) ?? []
		).filter(Boolean) as File[];
		if (!newFiles) return;

    files.push(...newFiles);
	};

	
</script>

<label for="file-upload" class="border-2 border-primary text-primary-foreground ps-2 pe-4 py-2 rounded cursor-pointer flex gap-2">
	<Plus /> Add Images
</label>

<input
	class="hidden"
	id="file-upload"
	type="file"
	accept="image/*"
  name="images[]"
  multiple={allowMultiple}
	onchange={handleFileUpload}
	disabled={isLoading}
/>
