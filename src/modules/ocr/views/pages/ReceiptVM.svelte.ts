import { z } from 'zod';

const TabsSchema = z.enum(['Overview', 'History', 'Shopping List']);
type Tabs = z.infer<typeof TabsSchema>;

export class ReceiptVM {
	isLoading = $state(false);
	tabDisplayed: Tabs = $state('Overview');

	constructor() {}
	
	// Arrow function is needed to preserve the context of `this` in the function
	onTabChange = (tab: string) => {
		const parsedTab = TabsSchema.safeParse(tab);
		if (parsedTab.success) {
			this.tabDisplayed = parsedTab.data;
			return;
		}
		this.tabDisplayed = 'Overview';
	};
}
