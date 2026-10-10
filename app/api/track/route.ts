import { serverSupabase } from '@/lib/supabase/server';

/** 첫 화면 클릭 기록 (개인정보 없음: 어떤 버튼, 어떤 값, 월). 환경변수가 없으면 조용히 건너뜀. */
const ACTS = new Set(['theme', 'thG', 'season', 'stays', 'begin', 'quick', 'stayGo', 'snSet']);

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const e = String(b?.e ?? '').slice(0, 24), v = String(b?.v ?? '').slice(0, 40);
    if (!ACTS.has(e)) return new Response(null, { status: 204 });
    const sb = serverSupabase();
    if (sb) await sb.from('travel_events').insert({ event: e, value: v, month: new Date().getMonth() + 1 });
  } catch { /* 기록 실패는 사용자에게 영향 없음 */ }
  return new Response(null, { status: 204 });
}
