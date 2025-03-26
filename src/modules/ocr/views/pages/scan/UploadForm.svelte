<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus } from 'lucide-svelte';
	import FileUploadInput from '../../FileUploadInput.svelte';
	import type { ReceiptScannerVM } from './ReceiptScannerVM.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';

	type Props = {
		vm: ReceiptScannerVM;
	};
	const { vm }: Props = $props();
</script>

<form
	class="flex flex-col items-start gap-4"
	method="post"
	action="?/receipt"
	use:enhance={vm.handleForm}
	enctype="multipart/form-data"
>
	<FileUploadInput bind:files={vm.files} allowMultiple />
	<PrimaryButton type="submit" disabled={vm.files.length === 0}>Submit Receipt</PrimaryButton>

	<!-- <button
		type="submit"
		class="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted w-full rounded-lg py-3 font-medium disabled:cursor-not-allowed"
		disabled={vm.files.length === 0}
	>
		Submit Receipt
	</button> -->
</form>
