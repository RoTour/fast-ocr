<script lang="ts">
	import { page } from '$app/state';

	type Props = {
		tabs: string[];
		onTabChange?: (tab: string) => void;
	};

	const { tabs, onTabChange }: Props = $props();
	let activeTab = $derived.by(() => {
		const selectedTab = page.url.searchParams.get('tab');
		return tabs.find((tab) => tab === selectedTab) || tabs[0];
	});

	$effect(() => {
		onTabChange?.(activeTab);
		console.debug('TabBar activeTab', activeTab);
	});

	const getTabLink = (tab: string) => {
		return `?${new URLSearchParams({ tab })}`;
	};
</script>

<ul class="flex w-fit gap-4 rounded-md bg-gray-100 p-1">
	{#each tabs as tab}
		<li class="py-2">
			<a
				class="w-full cursor-pointer rounded px-4 py-2 font-semibold hover:text-black transition-colors duration-200 
        {tab === activeTab
					? 'bg-gray-50 text-gray-700 shadow'
					: 'text-gray-700/70'}"
				href={getTabLink(tab)}
				aria-label={tab}>{tab}</a
			>
		</li>
	{/each}
</ul>
