-- SHOWDAY 여행 (travel) 전용 Supabase 프로젝트용 표.
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행하세요.

-- 1) 클릭 기록 (통계용, 개인정보 없음)
create table if not exists travel_events (
  id bigserial primary key,
  at timestamptz not null default now(),
  event text not null check (char_length(event) <= 24),
  value text not null default '' check (char_length(value) <= 40),
  month int check (month between 1 and 12)
);
alter table travel_events enable row level security;
-- 누구나 기록은 넣을 수 있지만 읽을 수는 없음
create policy "events insert" on travel_events for insert to anon, authenticated with check (true);

-- 월별 테마 클릭 순위 (집계 결과만 공개)
create or replace function travel_top_themes(p_month int default extract(month from now())::int, p_limit int default 10)
returns table(value text, clicks bigint)
language sql security definer set search_path = public as $$
  select value, count(*) from travel_events
  where event = 'theme' and month = p_month and value <> ''
  group by value order by count(*) desc limit p_limit;
$$;
grant execute on function travel_top_themes(int, int) to anon, authenticated;

-- 2) 내 여행 저장 (로그인한 본인만)
create table if not exists travel_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table travel_trips enable row level security;
create policy "trips owner" on travel_trips for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 3) 장소·숙소 캐시 (TourAPI/고캠핑 등에서 서버가 채움, 읽기는 누구나)
create table if not exists travel_places (
  id bigserial primary key,
  source text not null,            -- 'tourapi' | 'gocamping' | 'manual'
  source_id text,
  theme text, name text not null, city text, tag text, note text,
  lat double precision, lng double precision,
  updated_at timestamptz not null default now(),
  unique (source, source_id)
);
alter table travel_places enable row level security;
create policy "places read" on travel_places for select to anon, authenticated using (true);

create table if not exists travel_stays (
  id bigserial primary key,
  source text not null, source_id text,
  city text, kind text, name text not null, price_krw int, flags text,
  lat double precision, lng double precision,
  updated_at timestamptz not null default now(),
  unique (source, source_id)
);
alter table travel_stays enable row level security;
create policy "stays read" on travel_stays for select to anon, authenticated using (true);
-- places/stays 쓰기는 서버(service role)만 가능: 별도 쓰기 정책을 만들지 않음
