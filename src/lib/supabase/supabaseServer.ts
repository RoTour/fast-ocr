import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { createClient } from '@supabase/supabase-js';

const { PUBLIC_SUPABASE_URL } = publicEnv;
const { SUPABASE_SERVICE_ROLE_KEY } = privateEnv;
export const supabaseServer = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)