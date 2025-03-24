<script lang="ts">
	import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';
	import { ReceiptHistoryVM } from './ReceiptHistoryVM.svelte';

	type Props = {
		ownReceipts: OwnReceiptList;
	};

	const { ownReceipts }: Props = $props();
  const vm = new ReceiptHistoryVM(ownReceipts);
</script>

<ul>
  {#each vm.receiptList as receipt}
    <li>{receipt.merchant} - {receipt.totalPaid}€</li>
  {/each}
</ul>