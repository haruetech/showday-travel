import { createClient } from '@supabase/supabase-js';
/** 서버용. SUPABASE_SERVICE_ROLE_KEY 는 서버 환경변수에만 두고 브라우저로 내보내지 않는다. */
export function serverSupabase(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}
