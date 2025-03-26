<script>
	import { enhance } from '$app/forms';
	import { MoveLeft } from 'lucide-svelte';
	import FileUploadInput from '@modules/ocr/views/FileUploadInput.svelte';


	let activeTab = $state('camera');
</script>

<div class="min-h-screen bg-gray-900 p-4 text-gray-100">
	<!-- Header Section -->
	<header class="mb-6">
		<button class="text-2xl text-teal-400 hover:text-teal-300" onclick={() => history.back()}>
			<MoveLeft />
		</button>
		<h1 class="mt-2 text-2xl font-bold">Scan Receipt</h1>
	</header>

	<!-- Main Card Container -->
	<div class="mx-auto max-w-md rounded-xl bg-gray-800 p-6 shadow-lg">
		<h2 class="mb-2 text-center text-xl font-semibold">Receipt Scanner</h2>
		<p class="mb-6 text-center text-gray-400">
			Scan your grocery receipt to add it to your records.
		</p>

		<!-- Tab Switcher -->
		<div class="mb-6 flex border-b border-gray-700">
			<button
				class={`flex-1 py-2 font-medium ${activeTab === 'camera' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-gray-400'}`}
				onclick={() => switchTab('camera')}
			>
				Camera
			</button>
			<button
				class={`flex-1 py-2 font-medium ${activeTab === 'upload' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-gray-400'}`}
				onclick={() => switchTab('upload')}
			>
				Upload
			</button>
		</div>

		{#if activeTab === 'camera'}
			<!-- Camera View -->
			<div
				class="mb-6 flex aspect-[3/4] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600"
			>
				<div class="mb-2 text-4xl text-gray-500">📷</div>
				<p class="text-gray-500">Position receipt in frame</p>
			</div>
			<button class="w-full rounded-lg bg-teal-500 py-3 font-medium text-white hover:bg-teal-600">
				Capture Receipt
			</button>
		{:else}
			<!-- Upload View -->
			<form
				class="space-y-4"
				method="post"
				action="?/receipt"
				use:enhance={handleForm}
				enctype="multipart/form-data"
			>
				<FileUploadInput bind:files allowMultiple />

				<button
					type="submit"
					class="w-full rounded-lg bg-teal-500 py-3 font-medium text-white hover:bg-teal-600"
					disabled={files.length === 0}
				>
					Submit Receipt
				</button>
			</form>
		{/if}
	</div>
</div>
