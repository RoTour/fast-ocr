import type { SupabaseClient } from '@supabase/supabase-js';
import * as uuid from 'uuid';
import * as IFileUploadRepository from './IFileUploadRepository';

type SupabaseFileUploadRepository = {
	uploadFile: IFileUploadRepository.UploadFile;
};
export const SupabaseFileUploadRepository = (
	supabaseClient: SupabaseClient
): SupabaseFileUploadRepository => ({
	uploadFile: async (file: File, extension: string) => {
		const finalName =
			extension === 'pdf' || extension === 'md' ? file.name : `${uuid.v4()}.${extension}`;

		const folder = extension === 'pdf' ? 'pdf' : extension === 'md' ? 'md' : 'images';
		console.debug('uploading file', folder, finalName);

		const { data, error } = await supabaseClient.storage
			.from('ocr')
			.upload(`/${folder}/${finalName}`, file);
		if (error) throw error;
		const { data: urlData } = await supabaseClient.storage
			.from('ocr')
			.createSignedUrl(data.path, 60);
		return urlData?.signedUrl ?? 'NO URL FOUND';
	}
});
