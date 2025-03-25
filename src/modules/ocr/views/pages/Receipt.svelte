<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import FileUploadInput from '@modules/ocr/views/FileUploadInput.svelte';
	import { ReceiptVM } from '@modules/ocr/views/pages/ReceiptVM.svelte';
	import ReceiptHistory from '../components/ReceiptHistory.svelte';
	import ReceiptTotal from '../components/ReceiptTotal.svelte';
	import TabBar from '$lib/components/TabBar.svelte';
	import ReceiptAverage from '../components/ReceiptAverage.svelte';
	import ReceiptTotalTrips from '../components/ReceiptTotalTrips.svelte';

	let vm = new ReceiptVM();

	$inspect("INSPECT - Receipt.svelte", vm.tabDisplayed)
</script>

<form
	class="p-8"
	method="post"
	action="?/receipt"
	use:enhance={vm.handleForm}
	enctype="multipart/form-data"
>
	<FileUploadInput bind:files={vm.files} allowMultiple />

	<button type="submit" class="cursor-pointer rounded bg-teal-500 px-4 py-2 text-white">
		Submit
	</button>
</form>
{#if vm.isLoading}
	<div class="mb-2">Loading...</div>
{/if}

{#if vm.fileNames.length > 0}
	<div class="mt-4">
		{#each vm.fileNames as fileName}
			<div class="mb-2">{fileName}</div>
		{/each}
	</div>
{/if}

{#if vm.errorMessage}
	<div class="mb-2 text-red-500">{vm.errorMessage}</div>
{/if}

{#if vm.results.length > 0}
	{#each vm.results as result}
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

<ReceiptHistory ownReceipts={page.data.ownReceipts} />

<div class="px-8 py-4 space-y-8">
	<h1 class="text-2xl font-bold">Grocery Tracker</h1>
	<TabBar tabs={['Overview', 'History', 'Shopping List']} onTabChange={vm.onTabChange} />
	{#if vm.tabDisplayed === 'Overview'}
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<ReceiptTotal ownReceipts={page.data.ownReceipts} />
		<ReceiptAverage ownReceipts={page.data.ownReceipts} />
		<ReceiptTotalTrips ownReceipts={page.data.ownReceipts} />
	</div>
	{/if}
	{#if vm.tabDisplayed === 'History'}
		<h1>history</h1>
	{/if}
	{#if vm.tabDisplayed === 'Shopping List'}
		<h1>shopping list</h1>
	{/if}
</div>
