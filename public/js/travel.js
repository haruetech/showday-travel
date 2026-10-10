/* 여행 중 화면: 길잡이, 위치, 지금 위치에서 가는 시간, 시각 맞추기 */
function pickDay(){const P_=PLAN;let t=P_.days.find(d=>isTravelDay(d));if(t)return t.n;t=P_.days.find(d=>lvState(d).cur);return t?t.n:1;}
function tvTop(d){
  if(!UI.travel)return `<div class="tvstart"><button class="btn" data-act="travelOn">▶ 일정 시작</button><span class="meta">오늘 여행이면 지금 시각부터 일정 시간을 다시 맞추고, 지금·다음 코스를 안내해요</span></div>`;
  const st=lvState(d),c0=st.cur&&st.cur.e,trav=isTravelDay(d);if(UI.clk==null&&!trav&&c0)UI.clk=c0.t0+5;
  const g=guideSay(st),x=st.nx&&st.nx.e,nt=LV().notif!==false;
  UI._near=UI.nearOn?nearCands(d,st):null;UI.lvSig=g.k+(c0?c0.title:'');UI._cur=st.cur?st.cur.i:-1;UI._nx=st.nx?st.nx.i:-1;UI.sel=UI._cur;
  return `<div class="gsticky"><div class="guide"><div class="gface">${guideSvg}<small>하루 길잡이</small></div><div class="gbub" role="status">${g.t}</div></div>${tvStrip(st)}</div><div class="tvtop">
  <div class="lvprog">${st.done}/${st.L.length} 완료 · <button class="lnk" data-act="travelOff">계획으로 돌아가기</button></div>
  ${x?`<div class="lvcard nxt"><small>다음</small><b>${esc(x.title)}${smp(x.p)}</b><span class="meta">${hm(x.t0)} 시작 · ${x.leg?legLab(x.leg)+' 약 '+x.leg.min+'분 · '+legCost(x.leg):''}</span><a href="${mapUrl(x.p)}" target="_blank" rel="noopener">카카오맵 길찾기</a></div>`:''}
  ${syncHtml(d)}${hereHtml(st)}
  <div class="lvset">${nearBtn()} <button class="geob${UI.geo||UI.geoWant?' on':''}" data-act="geoTog">${UI.geo||UI.geoWant?'📍 내 위치 켜짐 · 끄기':'📍 내 위치로 안내 받기'}</button>${UI.geo||UI.geoWant?'':'<span class="meta"> 허용하면 지도에 내 위치가 보이고 도착을 알려드려요. 위치는 이 폰 안에서만 쓰고 저장·전송하지 않아요.</span>'}
  ${nearHtml()}<details class="lvdet"><summary>${trav?'⚙ 알림·시험 설정':'예시 시각으로 보는 중 (여행 날짜가 아니에요)'}</summary><p class="meta" style="margin:6px 0 4px">알림 빈도 <span class="meta">(앱이 열려 있을 때 시간이 되면 알려드려요)</span></p><div class="chips">${[['often','자주'],['normal','보통'],['quiet','조용히'],['off','끄기']].map(([k,t])=>`<button class="chip${(nt?(LV().freq||'normal'):'off')===k?' on':''}" data-act="lvFreq" data-v="${k}">${t}</button>`).join('')}</div><p class="meta" style="font-size:13px">자주: 끝나기 10분 전 · 시작할 때 · 끝날 때 / 보통: 끝날 때 (진동) / 조용히: 끝날 때 화면 안내만 (진동 없음)</p><p class="meta">지금 시각: ${hm(nowMin())}${UI.clk!=null?' (예시)':''}</p><div class="chips"><button class="chip" data-act="lvClk" data-v="-30">−30분</button><button class="chip" data-act="lvClk" data-v="30">＋30분</button><button class="chip" data-act="lvClk" data-v="cur">지금 장소 시작</button><button class="chip" data-act="lvClk" data-v="end">지금 장소 끝</button><button class="chip" data-act="lvClk" data-v="now">처음으로</button></div></details></div></div>`;}
/* 마지막 날 귀가 교통(기차·버스·항공) 미리 알림 */
function homeTr(){const tr=PLAN&&PLAN.trip;return(tr&&tr.hi>0&&tr.mode!=='car'&&S.type!==undefined)?tr:null;}
function homeBuf(tr){return tr.mode==='air'?120:tr.mode==='bus'?20:30;}
const HOME_BOOK={rail:[['코레일 예매','https://www.korail.com']],air:[['한국공항공사','https://www.airport.co.kr']],bus:[['고속버스','https://www.kobus.co.kr'],['시외버스','https://www.txbus.co.kr']]};
function homeCard(d){const tr=homeTr();if(!tr||d.n!==PLAN.days.length)return '';const dep=S.depart,buf=homeBuf(tr),lab=tr.how&&tr.how!=='직접 입력'?tr.how:({air:'항공',bus:'버스',rail:'기차'}[tr.mode]||'기차·버스');
  const lk=(HOME_BOOK[tr.mode]||[['코레일 예매','https://www.korail.com'],['고속버스','https://www.kobus.co.kr']]).map(o=>`<a class="ol" href="${o[1]}" target="_blank" rel="noopener noreferrer">${o[0]}</a>`).join('');
  return `<div class="homecard"><b>🚆 귀가 교통 안내 · ${esc(lab)}</b><span>출발 <b>${hm(dep)}</b> · ${tr.mode==='air'?'공항':'역·터미널'}에는 <b>${hm(dep-buf)}</b>까지 도착하세요</span><span>마지막 장소는 <b>${hm(dep-(PLAN.x.dayTrip?75:90))}</b>쯤 마무리하고 이동을 시작해요</span><span class="meta">알림: 전날 저녁 7시 · 출발 2시간 30분 전 · 1시간 30분 전 · 30분 전 (여행 중 화면이 열려 있을 때)</span><div class="olr" style="padding:6px 0 0">${lk}</div></div>`;}
function homeAlerts(){const tr=homeTr();if(!tr||!PLAN||UI.clk!=null||LV().notif===false)return;const fq=LV().freq||'normal';if(fq==='off')return;UI.ntf=UI.ntf||new Set();
  const n=nowMin(),L=PLAN.days,dep=S.depart,fire=(k,m,v)=>{if(UI.ntf.has(k))return;UI.ntf.add(k);if(v&&fq!=='quiet'){try{navigator.vibrate&&navigator.vibrate(v);}catch(e){}}toast(m);};
  if(L.length>1&&isTravelDay(L[L.length-2])&&n>=19*60)fire('home|eve','내일 '+hm(dep)+'에 귀가 교통이 있어요. 시간표와 예매를 확인하세요.',[150,80,150]);
  if(isTravelDay(L[L.length-1])){[[150,'귀가 교통 2시간 30분 전이에요. 짐을 정리하고 체크아웃을 준비하세요.'],[90,'지금 '+(tr.mode==='air'?'공항으로':'역·터미널로')+' 이동할 시간이에요. 출발은 '+hm(dep)+'이에요.'],[30,'귀가 교통 출발 30분 전이에요. 승차 위치와 시간을 확인하세요.']].forEach(([m,t])=>{if(n>=dep-m&&n<dep-m+20)fire('home|'+m,t,[200,100,200]);});}}
let lvTimer=null;function lvTick(){if(UI.view!=='result'||!UI.travel||!['plan','map'].includes(UI.rtab)||UI.sheet)return;if(document.activeElement&&/^(busw|vtext|stt)$/.test(document.activeElement.id))return;const d=PLAN&&PLAN.days[UI.day-1];if(!d)return;
  homeAlerts();const st=lvState(d),c=st.cur&&st.cur.e;UI.ntf=UI.ntf||new Set();
  const lv=LV(),fq=lv.freq||'normal';
  if(c&&lv.notif!==false&&UI.clk==null){const n=nowMin(),key=ckey(d.n,c),fire=(k,msg,vib)=>{const kk=key+'|'+k;if(UI.ntf.has(kk))return;UI.ntf.add(kk);if(vib&&fq!=='quiet'){try{navigator.vibrate&&navigator.vibrate(vib);}catch(e){}}toast(msg);};
    if(fq==='often'&&n>=c.t0&&n<c.t0+15)fire('start','지금 '+c.title+' 시작 시간이에요',[150]);
    if(fq==='often'&&n>=c.t1-10&&n<c.t1)fire('pre','곧 마무리할 시간이에요. '+(st.nx?'다음은 '+st.nx.e.title+'이에요':'오늘의 마지막 장소예요'),[120]);
    if(n>=c.t1)fire('end',st.nx?'다음 코스는 '+st.nx.e.title+'입니다. 이동하실까요?':'오늘 마지막 코스를 마칠 시간이에요',[200,100,200]);}
  if(UI.lvSig!==guideSay(st).k+(c?c.title:''))render(true);}
