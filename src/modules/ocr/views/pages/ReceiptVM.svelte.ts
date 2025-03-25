import { page } from '$app/state';
import type { UseCaseResponse } from '$lib/interfaces/UseCase';
import type { ProcessedReceipt } from '@modules/ocr/usecases/ReceiptProcessing/dto/ProcessedReceipt';
import type { SubmitFunction } from '@sveltejs/kit';
import { z } from 'zod';

const TabsSchema = z.enum(['Overview', 'History', 'Shopping List']);
type Tabs = z.infer<typeof TabsSchema>;

export class ReceiptVM {
	files: File[] = $state([]);
	fileNames = $derived.by(() => this.files.map((it) => it.name));
	isLoading = $state(false);
	tabDisplayed: Tabs = $state('Overview');

	results: UseCaseResponse<ProcessedReceipt>[] = $derived.by(() => {
		const successUseCases = page.form?.results?.filter(
			(it: UseCaseResponse<ProcessedReceipt>) => it.isSuccess
		);
		return successUseCases || [];
	});
	errorMessage: string | undefined = $state(undefined);
	constructor() {
    // this.onTabChange = this.onTabChange.bind(this);
	}

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

	// Arrow function is needed to preserve the context of `this` in the function
	onTabChange = (tab: string) => {
		const parsedTab = TabsSchema.safeParse(tab);
		if (parsedTab.success) {
			this.tabDisplayed = parsedTab.data;
			return;
		}
		this.tabDisplayed = 'Overview';
	}
}
