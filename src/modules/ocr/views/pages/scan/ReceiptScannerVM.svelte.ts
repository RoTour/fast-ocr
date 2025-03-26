import type { UseCaseResponse } from '$lib/interfaces/UseCase';
import type { ProcessedReceipt } from '@modules/ocr/usecases/ReceiptProcessing/dto/ProcessedReceipt';
import type { SubmitFunction } from '@sveltejs/kit';
import { page } from '$app/state';

// const TabsSchema = z.enum(['Camera', 'Upload']);
// type Tabs = z.infer<typeof TabsSchema>;

type Tabs = 'Camera' | 'Upload';

export class ReceiptScannerVM {
	private _activeTab: Tabs = $state('Camera');
	private _isLoading = $state(false);
	private _errorMessage: string | undefined = $state(undefined);

	files: File[] = $state([]);
	fileNames = $derived.by(() => this.files.map((it) => it.name));

	results: UseCaseResponse<ProcessedReceipt>[] = $derived.by(() => {
		const successUseCases = page.form?.results?.filter(
			(it: UseCaseResponse<ProcessedReceipt>) => it.isSuccess
		);
		return successUseCases || [];
	});

	constructor() {}

	get activeTab() {
		return this._activeTab;
	}

	get isLoading() {
		return this._isLoading;
	}

	get errorMessage() {
		return this._errorMessage;
	}

  switchTab(tab: Tabs) {
		this._activeTab = tab;
	}

	handleForm: SubmitFunction = () => {
		this._isLoading = true;
		this._errorMessage = undefined;

		return ({ result, update }) => {
			this._isLoading = false;
			if (result.type === 'failure') {
				this._errorMessage = result.data?.message;
			}

			update();
		};
	};
}