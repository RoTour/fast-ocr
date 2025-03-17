import { env } from '$env/dynamic/private';
import { Mistral } from '@mistralai/mistralai';

const { MISTRAL_API_KEY } = env;
export const mistral = new Mistral({ apiKey: MISTRAL_API_KEY });