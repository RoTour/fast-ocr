<script lang="ts">
	let isLoading = false;
	let error: string | null = null;
	let outputFilesUrls: string[] = [];

	async function handleFileUpload(event: Event) {
		const formData = new FormData();
		const fileInput = event.target as HTMLInputElement;

		if (fileInput.files?.[0]) {
			isLoading = true;
			error = null;
			outputFilesUrls = [];

			try {
				formData.append('image', fileInput.files[0]);

				const response = await fetch('/api/ocr', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) throw new Error(await response.text());

				const json = await response.json();
				outputFilesUrls = json.outputFilesUrls;
			} catch (err) {
				error = err instanceof Error ? err.message : 'Failed to process image';
			} finally {
				isLoading = false;
			}
		}
	}

	const handleDownload = (url: string, filename: string) => {
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = filename;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			});
	};

  const getFileName = (strUrl: string) => {
    const url = new URL(strUrl);
    return url.pathname.split('/').pop() || 'unknown.txt';
  }
</script>

<div class="container">
	<h1>OCR Image to PDF Converter</h1>

	<label for="file-upload" class="upload-button">
		{#if isLoading}
			Processing...
		{:else}
			Upload Image
		{/if}
	</label>
	<input
		id="file-upload"
		type="file"
		accept="image/*"
		on:change={handleFileUpload}
		disabled={isLoading}
	/>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	{#each outputFilesUrls as url}
		<button
			on:click={() => handleDownload(url, getFileName(url))}
			class="download-button w-full"
		>
			Download File
		</button>
	{/each}
</div>

<style>
	.container {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		text-align: center;
	}

	.upload-button {
		display: inline-block;
		padding: 1rem 2rem;
		background: #007bff;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.upload-button:hover {
		background: #0056b3;
	}

	input[type='file'] {
		display: none;
	}

	.download-button {
		display: block;
		margin-top: 2rem;
		padding: 1rem 2rem;
		background: #28a745;
		color: white;
		text-decoration: none;
		border-radius: 4px;
	}

	.error {
		color: #dc3545;
		margin-top: 1rem;
	}
</style>
