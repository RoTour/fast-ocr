<script lang="ts">
	import CardStats from '$lib/components/CardStats.svelte';
	import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';
	import { DollarSign } from 'lucide-svelte';
	import { ReceiptTotalVM } from './ReceiptTotalVM.svelte';

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
  title="Total spent this month"
  stats={`${vm.totalOfCurrentMonth}€`}
  subTitle={`${vm.diffSinceLastMonth}€`}
  icon={icon} />
