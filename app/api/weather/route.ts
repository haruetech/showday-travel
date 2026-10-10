import { summarize } from "@/lib/weather";

export const dynamic = "force-dynamic";

// GET /api/weather?lat=37.57&lng=126.98  -> 날짜별·시간별 날씨 요약 (키 불필요: Open-Meteo)
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const lat = Number(sp.get("lat")), lng = Number(sp.get("lng"));
  if (!isFinite(lat) || !isFinite(lng) || lat < 30 || lat > 40 || lng < 123 || lng > 133) {
    return Response.json({ ok: false, error: "bad coords" }, { status: 400 });
  }
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lng.toFixed(2)}` +
      `&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&forecast_days=16&timezone=Asia%2FSeoul`;
    const r = await fetch(url, { next: { revalidate: 900 } });
    if (!r.ok) throw new Error(String(r.status));
    return Response.json(summarize(await r.json()), {
      headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=1800" },
    });
  } catch {
    return Response.json({ ok: false });
  }
}
