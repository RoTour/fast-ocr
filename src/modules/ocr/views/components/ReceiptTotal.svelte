<script lang="ts">
	import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';
	import { ReceiptTotalVM } from './ReceiptTotalVM.svelte';
	import CardStats from '$lib/components/CardStats.svelte';
  import { DollarSign } from 'lucide-svelte';

	type Props = {
		ownReceipts: OwnReceiptList;
	};

	const { ownReceipts }: Props = $props();

	const vm = new ReceiptTotalVM(ownReceipts);
</script>

{#snippet icon()}
  <DollarSign />
{/snippet}

<CardStats 
  title="Total spent"
  stats={`${vm.total}€`}
  subTitle="Total amount spent"
  icon={icon} />
