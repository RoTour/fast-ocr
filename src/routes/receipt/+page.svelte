<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { UseCaseResponse } from '$lib/interfaces/UseCase';
	import type { ProcessedReceipt } from '@modules/ocr/usecases/receipt/services/IReceiptParser';
	import FileUploadInput from '@modules/ocr/views/FileUploadInput.svelte';

	let files: File[] = $state([]);
	let fileNames = $derived(files.map((it) => it.name));
	let results: UseCaseResponse<ProcessedReceipt>[] = $derived.by(() => {
		const successUseCases = page.form?.results?.filter((it: UseCaseResponse<ProcessedReceipt>) => it.isSuccess);
		return successUseCases || [];
	})
	let errorMessage = $derived.by(() => {
		const failedUseCases = page.form?.results?.filter((it: UseCaseResponse<ProcessedReceipt>) => !it.isSuccess);
		return failedUseCases?.[0]?.message;
	});
</script>

<form class="p-8" method="post" action="?/receipt" use:enhance enctype="multipart/form-data">
	<FileUploadInput bind:files allowMultiple />

	<button type="submit" class="cursor-pointer rounded bg-teal-500 px-4 py-2 text-white"
		>Submit</button
	>
</form>

{#if fileNames.length > 0}
	<div class="mt-4">
		{#each fileNames as fileName}
			<div class="mb-2">{fileName}</div>
		{/each}
	</div>
{/if}

{#if errorMessage}
	<div class="mb-2 text-red-500">{errorMessage}</div>
{/if}

{#if results.length > 0}
	{#each results as result}
		{#if result.isSuccess}
			<div class="flex flex-col gap-2">
				<div class="flex gap-4">
					<div class="mb-2">{result.data.merchant.name}</div>
					<div class="mb-2">({result.data.items.length} items)</div>
					<div class="text-sm font-light">{result.data.transactionDate}</div>
				</div>
				<div class="flex flex-col gap-4">
					{#each result.data.items as item}
						<div class="mb-2">
							{item.description} - {item.quantity} x {item.unitPrice}
							{item.currency} = {item.total}
							{item.currency}
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<!-- If parsing receipt failed -->
			<div class="mb-2">{result.message}</div>
		{/if}
	{/each}
{/if}
