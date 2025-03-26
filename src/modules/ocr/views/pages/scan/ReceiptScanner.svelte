<script>
	import BackButtonHeader from '$lib/components/layout/BackButtonHeader.svelte';
	import { Calendar, Check, Receipt, ShoppingBasket, X } from 'lucide-svelte';
	import { ReceiptScannerVM } from './ReceiptScannerVM.svelte';
	import ScanFromCamera from './ScanFromCamera.svelte';
	import UploadedFileList from './UploadedFileList.svelte';
	import UploadForm from './UploadForm.svelte';

	let vm = new ReceiptScannerVM();
</script>

<div class="min-h-screen bg-background p-4 text-foreground">
	<!-- Header Section -->
	<BackButtonHeader />

	<!-- Main Card Container -->
	<div class="mx-auto max-w-md rounded-xl bg-card p-6 shadow-lg text-card-foreground">
		<h2 class="mb-2 text-center text-xl font-semibold">Receipt Scanner</h2>
		<p class="mb-6 text-center text-muted-foreground">
			Scan your grocery receipt to add it to your records.
		</p>

		<!-- Tab Switcher -->
		<div class="mb-6 flex border-b border-border">
			<button
				class={`flex-1 py-2 font-medium ${vm.activeTab === 'Camera' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
				onclick={() => vm.switchTab('Camera')}
			>
				Camera
			</button>
			<button
				class={`flex-1 py-2 font-medium ${vm.activeTab === 'Upload' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
				onclick={() => vm.switchTab('Upload')}
			>
				Upload
			</button>
		</div>

		{#if vm.activeTab === 'Camera'}
			<!-- Camera View -->
			<ScanFromCamera />
		{:else}
			<!-- Upload View -->
			{#if vm.results.length === 0 && !vm.isLoading}
				<UploadForm {vm} />
			{/if}

			<!-- Processing State -->
			{#if vm.isLoading}
				<div class="mt-6 flex items-center justify-center gap-2 text-primary">
					<div
						class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
					></div>
					<span>Processing receipt...</span>
				</div>
			{/if}

			<!-- Results Display -->
			{#if vm.results.length > 0}
      <div>
				<div class="mt-6 space-y-6">
					{#each vm.results as result}
						<div class="rounded-lg border border-border p-4">
							{#if result.isSuccess}
								<!-- Success Card -->
								<div class="mb-4 flex items-center gap-2 text-primary">
									<Check class="h-5 w-5" />
									<h3 class="text-lg font-semibold">Receipt processed successfully</h3>
								</div>

								<!-- Merchant Info -->
								<div class="mb-4 flex items-center gap-3">
									<div class="rounded-full bg-muted p-2">
										<Receipt class="h-5 w-5 text-primary" />
									</div>
									<div>
										<p class="font-medium">{result.data.merchant.name}</p>
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<Calendar class="h-4 w-4" />
											<span>{result.data.transactionDate}</span>
										</div>
									</div>
								</div>

								<!-- Items Summary -->
								<div class="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
									<ShoppingBasket class="h-4 w-4" />
									<span>{result.data.items.length} items</span>
								</div>

								<!-- Items List -->
								<div class="space-y-3 border-t border-border pt-3">
									{#each result.data.items as item}
										<div class="flex justify-between">
											<div>
												<p class="font-medium">{item.description}</p>
												<p class="text-sm text-muted-foreground">
													{item.quantity} × {item.unitPrice}
													{item.currency}
												</p>
											</div>
											<p class="font-medium">
												{item.total}
												{item.currency}
											</p>
										</div>
									{/each}
								</div>

								<!-- Total -->
								<div class="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
									<span>Total</span>
									<span>
										<!-- {result.data.totalAmount} {result.data.currency} -->
										x.xx€
									</span>
								</div>
							{:else}
								<!-- Error Card -->
								<div class="flex items-center gap-2 text-destructive">
									<X class="h-5 w-5" />
									<h3 class="text-lg font-semibold">Processing failed</h3>
								</div>
								<p class="mt-2 text-foreground">{result.message}</p>
							{/if}
						</div>
					{/each}
				</div>

        <a href="/receipt" class="mt-6 block w-full rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground hover:bg-primary/90">Confirm</a>
      </div>
			{/if}

			<!-- Uploaded Files List -->
			{#if vm.fileNames.length > 0 && vm.results.length === 0}
				<UploadedFileList fileNames={vm.fileNames} />
			{/if}
		{/if}
	</div>
</div>

<!-- Error Message Toast -->
{#if vm.errorMessage}
	<div class="fixed bottom-4 left-1/2 w-full max-w-md -translate-x-1/2 transform px-4">
		<div class="flex items-center gap-2 rounded-lg bg-destructive px-4 py-3 text-destructive-foreground shadow-lg">
			<X class="h-5 w-5" />
			<span>{vm.errorMessage}</span>
		</div>
	</div>
{/if}