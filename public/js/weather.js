/* 날씨 자동 확인 — window.SD_WEATHER(API 주소)가 있을 때만 켜짐. 여행 날짜의 비·눈·폭염·한파를 확인해 안내하고, 실내 위주 일정으로 바꾸기를 제안 */
(function(){
const _render=render;
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const cache={};
function load(lat,lng){const k=lat.toFixed(2)+','+lng.toFixed(2),c=cache[k];if(c&&Date.now()-c.t<10*60e3)return Promise.resolve(c.j);
  return fetch(window.SD_WEATHER+'?lat='+lat.toFixed(2)+'&lng='+lng.toFixed(2)).then(r=>r.json()).then(j=>{if(j&&j.ok)cache[k]={t:Date.now(),j};return j;});}
const pt=()=>{const g=UI.geo;if(UI.travel&&g&&g.lat!=null)return{lat:g.lat,lng:g.lng};const h=cityOf().hub;return h?{lat:h.lat,lng:h.lng}:null;};
const dateOf=n=>{const d=dayDate(n);return d?iso(d):null;};
const kindTxt={rain:'비',snow:'눈',heat:'폭염',cold:'한파'};
function banner(){
  const W=UI.wx;if(!W||!W.ok||!PLAN||!S.date)return '';
  const rows=PLAN.days.map(d=>({n:d.n,i:W.days[dateOf(d.n)]})).filter(o=>o.i);
  if(!rows.length)return '';
  const bad=rows.filter(o=>o.i.bad),cur=rows.find(o=>o.n===UI.day)||rows[0];
  let live='';
  if(UI.travel&&UI.wxLive)live=`<div class="wxl">☔ <b>${UI.wxLive.hh}시쯤 ${UI.wxLive.txt} 예보</b>예요. 우산을 챙기세요.</div>`;
  if(bad.length){
    const t=bad.map(o=>`${o.n}일차 ${kindTxt[o.i.kind]||o.i.label}${o.i.kind==='rain'?' (강수확률 '+o.i.pop+'%)':o.i.kind==='heat'||o.i.kind==='cold'?' ('+o.i.tmax+'°/'+o.i.tmin+'°)':''}`).join(' · ');
    const rainy=bad.some(o=>['rain','snow'].includes(o.i.kind));
    return `<div class="wxb bad" role="status"><span class="wxi">${bad[0].i.emoji}</span><div><b>날씨 확인: ${t}</b><br><span class="meta">${S.indoor?'날씨에 맞춰 실내 위주 일정이에요.':rainy?'야외 일정은 불편할 수 있어요.':'야외 활동은 무리하지 마세요.'}</span></div>${rainy||S.indoor?`<button class="chip${S.indoor?'':' on'}" data-act="rainTog">${S.indoor?'맑은 날 일정으로':'실내 위주로 바꾸기'}</button>`:''}</div>${live}`;}
  return `<div class="wxb" role="status"><span class="wxi">${cur.i.emoji}</span><div><b>${cur.n}일차 ${cur.i.label} · ${cur.i.tmax}°/${cur.i.tmin}°</b><br><span class="meta">강수확률 ${cur.i.pop}% · 기상 예보 기준</span></div></div>${live}`;}
function liveCheck(){
  const W=UI.wx;UI.wxLive=null;if(!W||!W.ok||!UI.travel||!PLAN)return;
  const today=iso(new Date()),day=W.days[today];if(!day)return;
  const hr=new Date().getHours();
  for(let h=hr;h<=hr+2&&h<24;h++){const o=day.hours[String(h).padStart(2,'0')];
    if(o&&(o.pop>=60||o.mm>=1||(o.c>=51&&o.c<=67)||(o.c>=80&&o.c<=82)||o.c>=95)){UI.wxLive={hh:h,txt:o.c>=71&&o.c<=77?'눈':'비'};break;}}
  if(UI.wxLive){UI.ntf=UI.ntf||new Set();const k='wx'+today+UI.wxLive.hh;const lv=(typeof LV==='function')?LV():{notif:true};
    if(!UI.ntf.has(k)&&lv.notif!==false&&lv.freq!=='off'){UI.ntf.add(k);if(lv.freq!=='quiet'){try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}}toast('☔ '+UI.wxLive.hh+'시쯤 비 예보예요. 우산을 챙기세요');}}}
function paint(){
  const old=document.querySelector('.wxb,.wxl');document.querySelectorAll('.wxb,.wxl').forEach(e=>e.remove());
  const h=banner();if(!h)return;const nav=document.querySelector('#app .rnav');if(nav)nav.insertAdjacentHTML('beforebegin',h);}
function after(){
  if(!window.SD_WEATHER||UI.view!=='result'||!PLAN||!S.date)return;
  const p=pt();if(!p)return;
  const key=p.lat.toFixed(2)+','+p.lng.toFixed(2)+'|'+S.date+'|'+PLAN.days.length;
  if(UI.wxKey!==key||(Date.now()-(UI.wxAt||0)>30*60e3)){
    UI.wxKey=key;UI.wxAt=Date.now();
    load(p.lat,p.lng).then(j=>{UI.wx=j&&j.ok?j:{ok:false};liveCheck();if(UI.view==='result')render(true);}).catch(()=>{UI.wx={ok:false};});
    return;}
  liveCheck();paint();}
render=function(k){_render(k);try{after();}catch(e){}};
setInterval(()=>{try{if(window.SD_WEATHER&&UI.view==='result'&&UI.travel){UI.wxAt=0;after();}}catch(e){}},10*60e3);
})();
