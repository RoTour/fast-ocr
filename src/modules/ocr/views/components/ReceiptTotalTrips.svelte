<script lang="ts">
	import CardStats from '$lib/components/CardStats.svelte';
	import type { OwnReceiptList } from '@modules/ocr/usecases/ListOwnReceipts/models/OwnReceiptList';
	import { ShoppingCart } from 'lucide-svelte';
	import { ReceiptTotalTripsVM } from './ReceiptTotalTripsVM.svelte';

  type Props = {
		ownReceipts: OwnReceiptList;
	};

	const { ownReceipts }: Props = $props();

  const vm = new ReceiptTotalTripsVM(ownReceipts);
</script>

{#snippet icon()}
  <ShoppingCart />
{/snippet}

<CardStats 
  title="Total Trips this month"
  stats={`${vm.totalTrips}`}
  subTitle="-x since last month"
  icon={icon} />
