// 날씨 요약 (Open-Meteo 응답 -> 날짜별·시간별). 기상청(KMA) 연결 시 이 파일의 입력부만 바꾸면 됨.
type OM = {
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: (number | null)[];
    precipitation: (number | null)[];
    weather_code: (number | null)[];
  };
};

export function describe(code: number) {
  if (code >= 95) return { label: "천둥·번개", emoji: "⛈️" };
  if (code === 85 || code === 86 || (code >= 71 && code <= 77)) return { label: "눈", emoji: "🌨️" };
  if (code >= 80 && code <= 82) return { label: "소나기", emoji: "🌧️" };
  if (code >= 61 && code <= 67) return { label: "비", emoji: "🌧️" };
  if (code >= 51 && code <= 57) return { label: "이슬비", emoji: "🌦️" };
  if (code === 45 || code === 48) return { label: "안개", emoji: "🌫️" };
  if (code === 0) return { label: "맑음", emoji: "☀️" };
  if (code <= 2) return { label: "구름 조금", emoji: "🌤️" };
  return { label: "흐림", emoji: "☁️" };
}

const isSnow = (c: number) => c === 85 || c === 86 || (c >= 71 && c <= 77);
const isRain = (c: number) => (c >= 51 && c <= 67) || (c >= 80 && c <= 82) || c >= 95;

export function summarize(j: OM) {
  const h = j.hourly;
  if (!h || !h.time) return { ok: false as const };
  const days: Record<string, any> = {};
  h.time.forEach((t, i) => {
    const d = t.slice(0, 10), hh = t.slice(11, 13);
    const code = Number(h.weather_code[i] ?? 0), pop = Number(h.precipitation_probability[i] ?? 0), mm = Number(h.precipitation[i] ?? 0), temp = Number(h.temperature_2m[i]);
    const o = (days[d] ||= { hours: {}, _t: [] as number[], _pop: 0, _mm: 0, _code: 0, _snow: false });
    const bad = isSnow(code) || isRain(code) || pop >= 60 || mm >= 1;
    o.hours[hh] = { t: Math.round(temp), pop, mm: Math.round(mm * 10) / 10, c: code, bad };
    o._t.push(temp);
    const hr = Number(hh);
    if (hr >= 8 && hr <= 21) {
      o._pop = Math.max(o._pop, pop);
      o._mm += mm;
      if (isSnow(code)) o._snow = true;
      if (code > o._code) o._code = code;
    }
  });
  const out: Record<string, any> = {};
  Object.keys(days).forEach((d) => {
    const o = days[d];
    const tmax = Math.round(Math.max(...o._t)), tmin = Math.round(Math.min(...o._t));
    const dsc = describe(o._code);
    let kind = "", bad = false, label = dsc.label, emoji = dsc.emoji;
    if (o._snow) { kind = "snow"; bad = true; label = "눈"; emoji = "🌨️"; }
    else if (o._pop >= 60 || o._mm >= 3 || isRain(o._code)) { kind = "rain"; bad = true; if (!isRain(o._code)) { label = "비"; emoji = "🌧️"; } }
    else if (tmax >= 33) { kind = "heat"; bad = true; label = "폭염"; emoji = "🥵"; }
    else if (tmin <= -10) { kind = "cold"; bad = true; label = "한파"; emoji = "🥶"; }
    out[d] = { tmax, tmin, pop: o._pop, mm: Math.round(o._mm * 10) / 10, label, emoji, bad, kind, hours: o.hours };
  });
  return { ok: true as const, src: "open-meteo", days: out };
}
