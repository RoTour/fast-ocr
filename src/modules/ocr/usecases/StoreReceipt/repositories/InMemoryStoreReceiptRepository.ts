import * as IStoreReceiptRepository from './IStoreReceiptRepository';
import { env } from '$env/dynamic/private';
import { EnvNotSetError } from '$lib/errors/common/EnvNotSetError';

type InMemoryStoreReceiptRepository = {
	GetMerchantId: IStoreReceiptRepository.GetMerchantId;
};

export const InMemoryStoreReceiptRepository = (): InMemoryStoreReceiptRepository => ({
	GetMerchantId: async () => {
		if (!env.DEFAULT_MERCHANT_ID) throw new EnvNotSetError('DEFAULT_MERCHANT_ID');
		return env.DEFAULT_MERCHANT_ID;
	}
});
