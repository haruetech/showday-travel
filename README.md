# showday-travel (travel.showday.kr)

SHOWDAY 여행일정. Next.js + Supabase(여행 전용 새 프로젝트).

## 구조
- `public/app.html`, `public/css`, `public/js` : 지금 앱(검증된 화면·계산). `/` 주소에서 그대로 열립니다.
- `app/api/track` : 첫 화면 클릭 기록 → Supabase `travel_events` (개인정보 없음)
- `lib/supabase` : 브라우저(anon)·서버(service role) 클라이언트
- `supabase/migrations/001_travel_schema.sql` : 표와 RLS (Supabase SQL Editor에서 실행)
- 화면을 React 로 옮길 때마다 `next.config.mjs` 의 rewrite 를 줄여 갑니다.

## 처음 실행
```
npm install
cp .env.example .env.local   # 값 채우기 (Git 에 올리지 않음)
npm run dev                   # http://localhost:3000
```

## 배포 (Vercel)
1. Vercel 에서 이 저장소를 Import.
2. Settings > Environment Variables 에 `.env.example` 의 값 입력 (서비스 키는 서버 전용).
3. Domains 에 `travel.showday.kr` 추가 → 안내하는 DNS 레코드를 도메인 관리 화면에 추가.

## 키 관리
API·Supabase 키는 코드나 대화에 넣지 말고 환경변수로만 관리합니다.
