<script lang="ts">
	type Props = {
		allowMultiple?: boolean;
    files: File[];
	};
	let { allowMultiple = false, files = $bindable() }: Props = $props();

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

<label for="file-upload" class="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer">
	Add Images
</label>

<input
	class="hidden"
	id="file-upload"
	type="file"
	accept="image/*"
  name="images"
  multiple={allowMultiple}
	onchange={handleFileUpload}
	disabled={isLoading}
/>
