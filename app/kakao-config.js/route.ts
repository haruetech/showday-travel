export const dynamic = "force-dynamic";

// 카카오 JavaScript 키(공개용, 도메인 등록으로 보호됨)를 정적 앱에 전달
export function GET() {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
  return new Response(`window.SD_KAKAO=${JSON.stringify(key)};`, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
