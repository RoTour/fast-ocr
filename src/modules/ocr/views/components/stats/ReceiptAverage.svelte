<script lang="ts">
	import CardStats from '$lib/components/CardStats.svelte';
  import { CreditCard } from 'lucide-svelte';
	import { ReceiptAverageVM } from './ReceiptAverageVM.svelte';
	import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';

  type Props = {
		ownReceipts: OwnReceiptList;
	};

	const { ownReceipts }: Props = $props();

  const vm = new ReceiptAverageVM(ownReceipts);
</script>

{#snippet icon()}
  <CreditCard />
{/snippet}

<CardStats 
  title="Average Per Trip"
  stats={`${vm.average}€`}
  subTitle="-x% from last month"
  icon={icon} />
