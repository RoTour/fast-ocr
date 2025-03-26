<script lang="ts">
	import { page } from '$app/state';
	import TabBar from '$lib/components/TabBar.svelte';
	import { ReceiptVM } from '@modules/ocr/views/pages/ReceiptVM.svelte';
	import { ScanText } from 'lucide-svelte';
	import ReceiptHistory from '../components/ReceiptHistory.svelte';
	import ReceiptAverage from '../components/stats/ReceiptAverage.svelte';
	import ReceiptTotal from '../components/stats/ReceiptTotal.svelte';
	import ReceiptTotalTrips from '../components/stats/ReceiptTotalTrips.svelte';

	let vm = new ReceiptVM();
</script>

<div class="space-y-8 px-8 py-4">
	<h1 class="text-2xl font-bold">Grocery Tracker</h1>
	<a href="/receipt/scan">
		<ScanText/>
		Scan Receipt
	</a>
	<TabBar tabs={['Overview', 'History', 'Shopping List']} onTabChange={vm.onTabChange} />
	{#if vm.tabDisplayed === 'Overview'}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
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

	<div class="flex">
		<!-- TODO: Monthly Spending -->
		<ReceiptHistory ownReceipts={page.data.ownReceipts} />
	</div>
</div>
