import { page } from '$app/state';
import type { UseCaseResponse } from '$lib/interfaces/UseCase';
import type { ProcessedReceipt } from '@modules/ocr/usecases/ReceiptProcessing/dto/ProcessedReceipt';
import type { SubmitFunction } from '@sveltejs/kit';

export class ReceiptVM {
	files: File[] = $state([]);
	fileNames = $derived.by(() => this.files.map((it) => it.name));
	isLoading = $state(false);
	results: UseCaseResponse<ProcessedReceipt>[] = $derived.by(() => {
		const successUseCases = page.form?.results?.filter(
			(it: UseCaseResponse<ProcessedReceipt>) => it.isSuccess
		);
		return successUseCases || [];
	});
	errorMessage: string | undefined = $state(undefined);
	constructor() {}

	handleForm: SubmitFunction = () => {
		this.isLoading = true;
		this.errorMessage = undefined;

		return ({ result, update }) => {
			this.isLoading = false;
			if (result.type === 'failure') {
				this.errorMessage = result.data?.message;
			}

			update();
		};
	};
}
