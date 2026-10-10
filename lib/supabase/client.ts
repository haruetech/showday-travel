import { createClient } from '@supabase/supabase-js';
/** 브라우저용 (anon 키만 사용. RLS 로 보호). 환경변수가 없으면 null. */
export function browserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}
