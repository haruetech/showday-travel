/* 결과 화면 조립, 말·글로 일정 바꾸기(parseSay/applySay) */
function viewResult(){const P_=PLAN,t=UI.rtab;
  const days=(t==='plan'||t==='map')?`<div class="tabs">${P_.days.map(d=>chip('day','day',d.n,UI.day===d.n,d.n+'일차'+(P_.S.date?' '+dayLabel(P_.S,d.n).split('(')[0]:''))).join('')}</div>`:'';
  const body=t==='cost'?viewCost():t==='glance'?viewGlance():viewPlan();
  return `<div class="rhead c-${t}${UI.travel?' trvh':''}"><h1 style="margin-top:14px">${cityOf().name} ${durText()} 추천 일정</h1><p class="sub">${P_.S.date?dayLabel(P_.S,1)+' 출발 · ':''}${P_.x.H.name} 기준 · 샘플 데이터와 추정값이에요${P_.S.fixedTimes?' · 예약 시간 고정':''}</p><p class="tbtn"><button class="chip" data-act="jump" data-v="time">🕐 ${P_.S.type==='day'?hm(P_.S.depStart)+' 출발 · '+hm(P_.S.depart)+' 귀가':hm(P_.S.arrive)+' 도착 · '+hm(P_.S.depart)+' 출발'} · 바꾸기</button></p>${t==='cost'?'':strip()}</div>
<div class="rnav"><div class="rtabs">${[['glance','한눈에'],['plan','일정'],['map','지도'],['cost','비용']].map(([k,l])=>`<button data-act="rtab" data-v="${k}" class="${t===k?'on':''}">${l}</button>`).join('')}</div>${days}</div><div class="res ${(t==='plan'||t==='map')?'two':''}" data-t="${t}">${body}</div>`;}
function homeRes(){const q=UI.hq.trim();if(!q)return '';
  const out=[],names={seoul:['서울'],suwon:['수원','경기'],busan:['부산'],daegu:['대구'],gyeongju:['경주'],yeosu:['여수'],sokcho:['속초','설악'],jeju:['제주'],gangneung:['강릉','강원'],jeonju:['전주','전라']};
  Object.keys(CITIES).forEach(id=>{if((names[id]||[]).some(n=>n.includes(q)||q.includes(n))||CITIES[id].name.includes(q))out.push(`<button class="opt" data-act="sgo" data-c="${id}"><b>${CITIES[id].name}</b><small>여행지로 시작하기</small></button>`);});
  Object.keys(CITIES).forEach(id=>CITIES[id].places.forEach(p=>{if(p.name.includes(q))out.push(`<button class="opt" data-act="sgo" data-c="${id}" data-p="${p.id}"><b>${p.name}<span class="tag">${p.cat}</span></b><small>${CITIES[id].name} · 꼭 가는 곳으로 넣고 시작</small></button>`);}));
  if(!out.length)return `<p class="hint">'${esc(q)}'은(는) 아직 샘플 데이터에 없어요. 지금은 서울·수원·부산·대구·경주·여수·속초·제주·강릉·전주만 시험 중이에요.</p>`;
  return '<div class="opts" style="margin-top:8px">'+out.slice(0,8).join('')+'</div>';}
function viewHome(){const saved=ls.get('showday_trips',[]);
  const tile=(act,v,k,t,d)=>`<button class="htile" data-act="${act}"${v?` data-v="${v}"`:''}>${HOME_ART[k]}<span class="tx"><b>${t}</b><small>${d}</small></span></button>`;
  return `${ART_DEFS}<div class="hmain"><div class="hcol">
<div class="hhero">${HOME_HERO}<div class="htx"><h1>어디로 떠나볼까요?</h1><span>눌러서 고르면 일정·경비까지 계획해요</span></div></div>${draftCard()}
<button class="hquick" data-act="quick">${HOME_ART.quick}<span><b>3번만 눌러 바로 추천</b><small>정한 게 없어도 괜찮아요</small></span><em>›</em></button>
<div class="hchips"><button data-act="begin" data-v="region"><i>📍</i><b>갈 곳 있어요</b><small>숙소·교통·일정</small></button><button data-act="begin" data-v="dates"><i>📅</i><b>날짜 정했어요</b><small>여행지 추천</small></button><button data-act="begin" data-v="booked"><i>✅</i><b>예약 마쳤어요</b><small>시간 그대로 구성</small></button></div>
<button class="htile wide" data-act="stays">${HOME_ART.stays}<span class="tx"><b>숙소·캠핑 찾기</b><small>한옥·펜션·글램핑·캠핑·휴양림</small></span></button>
</div><div class="hcol">${seasonRow()}${themeRow()}</div></div>
${saved.length?`<p class="hlab">내 여행</p>${saved.map((t,i)=>`<div class="trip"><span><b>${esc(t.name)}</b><span class="meta">${t.at}</span></span><span class="tb"><button class="btn sm ghost" data-act="loadTrip" data-v="${i}">열기</button><button class="lnk" data-act="delTrip" data-v="${i}">삭제</button></span></div>`).join('')}`:''}
<p class="hfoot">거리·시간·요금은 추정값이에요. 작성 중인 내용은 이 기기에 자동 임시저장돼요.</p>`;}

function planText(){const P_=PLAN,x=P_.x;let t=`SHOWDAY 여행일정 · ${cityOf().name} ${durText()}\n${x.H.name} 기준 / 성인 ${S.adults} 어린이 ${S.kids} / ${MLAB[S.mode]}\n총 약 ${man(P_.T.total)} (추정 ${man(P_.T.lo)}~${man(P_.T.hi)}), 1인당 약 ${won(P_.per)}\n`;
  P_.days.forEach(d=>{t+=`\n[${d.n}일차${S.date?' '+dayLabel(S,d.n):''}] 하루 약 ${won(d.sum)}\n`;d.ev.forEach(e=>{if(e.leg)t+=`   > ${e.leg.use==='car'?MLAB[S.mode==='rental'?'rental':'car']:MLAB[e.leg.use]} 약 ${e.leg.km}km ${e.leg.min}분 ${legCost(e.leg)}${e.leg.alts[e.leg.use].detail?' ('+e.leg.alts[e.leg.use].detail+')':''}\n`;t+=`${hm(e.t0)} ${e.title}${e.cost?' (약 '+won(e.cost)+')':''}\n`;});});
  return t+'\n※ 거리·시간·요금은 추정값이에요.';}

/* 렌더 */
function saveDraft(){if(UI.view==='home'||UI.view==='stays'||UI.view==='season'||UI.view==='theme')return;ls.set('showday_draft',{S,at:Date.now(),ui:{view:UI.view,step:UI.step,rtab:UI.rtab,day:UI.day,known:[...UI.known],rec:UI.rec,ids:UI.ids,start:UI.start,booked:UI.booked,quick:UI.quick,wishFirst:UI.wishFirst,travel:!!UI.travel}});}
const ago=ms=>{const m=Math.round((Date.now()-ms)/60000);return m<1?'방금':m<60?m+'분 전':m<1440?Math.floor(m/60)+'시간 전':Math.floor(m/1440)+'일 전';};
function resumeDraft(){const dr=ls.get('showday_draft',null);if(!dr||!dr.S)return;UI.originOk=true;S={...DEF(),...dr.S};const u=dr.ui||{};PLAN=null;UI.undo=[];UI.sheet=null;UI.edit=false;UI.known=new Set(u.known||[]);UI.rec=!!u.rec;UI.ids=u.ids||null;UI.start=u.start||null;UI.booked=!!u.booked;UI.quick=!!u.quick;UI.wishFirst=!!u.wishFirst;UI.rtab=u.rtab||'plan';UI.day=u.day||1;UI.sel=-1;
  if(u.view==='result'){try{PLAN=buildPlan(S);UI.view='result';UI.travel=!!u.travel;UI.clk=null;if(UI.travel){UI.rtab='plan';UI.day=pickDay();UI.scrollCur=true;}}catch(e){UI.view='wizard';UI.step='confirm';}}else{UI.view='wizard';UI.step=u.step||'type';}
  if(UI.view==='wizard'&&!active().some(s=>s.id===UI.step))UI.step=active()[0].id;
  render();window.scrollTo(0,0);}
function draftCard(){const dr=ls.get('showday_draft',null);if(!dr||!dr.S)return '';const C=CITIES[dr.S.city]||{name:''},u=dr.ui||{};
  const nm=C.name+' '+(dr.S.type==='day'?'당일':dr.S.nights+'박 '+(dr.S.nights+1)+'일');
  return `<div class="dcard"><span class="dtx"><b>작성 중인 여행</b><span class="meta">${nm} · ${u.view==='result'?'일정 완성':'질문 진행 중'} · ${ago(dr.at)}</span></span><span class="dbt"><button class="btn sm" data-act="resume">${u.travel?'일정 보기':'이어서'}</button><button class="btn sm ghost" data-act="draftDel">지우기</button></span></div>`;}
function newTrip(){UI.hf=null;UI.hsq='';UI.originOk=false;UI.rq='';S=DEF();PLAN=null;UI.undo=[];UI.known=new Set();UI.quick=false;UI.rec=false;UI.ids=null;UI.start=null;UI.booked=false;UI.wishFirst=false;UI.edit=false;UI.sheet=null;UI.wq='';UI.aq='';}
function setHH(){try{const h=document.querySelector('header.top');if(h)document.documentElement.style.setProperty('--hh',h.offsetHeight+'px');}catch(e){}}
window.addEventListener('resize',setHH);
const BACKROW='<button class="backrow" data-act="back">‹ 이전으로</button>';
function render(keepScroll){setHH();const y=window.scrollY;
  const wrap=$('#wrap'),prog=$('#prog'),bar=$('#barin');
  wrap.classList.toggle('wide',UI.view==='result');wrap.classList.toggle('home',UI.view==='home');$('#homebtn').hidden=UI.view==='home';$('#backbtn').hidden=['home','theme','season','stays'].includes(UI.view);
  document.body.classList.toggle('big',!!UI.big);$('#bigbtn').setAttribute('aria-pressed',!!UI.big);
  if(UI.view==='home'){prog.hidden=true;app.innerHTML=viewHome();bar.innerHTML='';$('#bar').hidden=true;}
  else if(UI.view==='theme'){prog.hidden=true;app.innerHTML=BACKROW+viewTheme();bar.innerHTML='';$('#bar').hidden=true;}
  else if(UI.view==='season'){prog.hidden=true;app.innerHTML=BACKROW+viewSeason();bar.innerHTML='';$('#bar').hidden=true;}
  else if(UI.view==='stays'){prog.hidden=true;app.innerHTML=BACKROW+viewStays();bar.innerHTML=pickBar();$('#bar').hidden=!bar.innerHTML;}
  else if(UI.view==='wizard'){$('#bar').hidden=false;const a=active(),st=curStep(),i=Math.max(0,a.findIndex(s=>s.id===st.id));
    prog.hidden=false;prog.firstElementChild.style.width=((i+1)/a.length*100)+'%';
    app.innerHTML=`<p class="qn">${i+1} / ${a.length}</p><h1 style="margin-top:6px">${typeof st.q==='function'?st.q():st.q}</h1>${st.sub?`<p class="lead">${st.sub}</p>`:'<div style="height:8px"></div>'}${st.body()}`;
    const last=st.id==='confirm';
    bar.innerHTML=`<button class="btn ghost" data-act="prev">이전</button>${st.optional||st.id==='wish'?'<button class="btn ghost" data-act="next">건너뛰기</button>':''}${st.nobtn?'':`<button class="btn" data-act="${last?'make':'next'}">${last?'일정 만들기':'다음'}</button>`}`;}
  else{prog.hidden=true;$('#bar').hidden=false;app.innerHTML=viewResult();
    bar.innerHTML=UI.edit?'<button class="btn" data-act="editOff">편집 완료</button>':(UI.travel&&['plan','map'].includes(UI.rtab))?tvBar():'<button class="btn ghost" data-act="save">저장</button><button class="btn ghost" data-act="share">공유·복사</button><button class="btn" data-act="sheet" data-v="menu">일정 수정</button>';
    if(!UI.edit&&!UI.sheet&&UI.rtab!=='cost')bar.insertAdjacentHTML('beforeend','<button class="fab" data-act="sheet" data-v="voice" aria-label="말·글로 일정 바꾸기">✏️ 말·글로 일정 바꾸기</button>');}
  if(UI.view==='wizard'&&UI.step==='wish')wishRefresh();
  $('#sheetbox').innerHTML=sheetHtml();document.body.classList.toggle('vopen',!!(UI.sheet&&UI.sheet.t==='voice'&&UI.view==='result'));
  saveDraft();
  if(UI.sheet&&UI.sheet.t==='copy'){const ta=$('#cptext');if(ta){ta.value=UI.sheet.text;ta.focus();ta.select();}}
  if(keepScroll)window.scrollTo(0,y);
  if(UI.scrollCur){UI.scrollCur=false;setTimeout(()=>{const e=document.getElementById('ev'+UI._cur);if(e)e.scrollIntoView({block:'center'});},60);}}
function nextStep(){const a=active(),i=a.findIndex(s=>s.id===UI.step);if(i<a.length-1){UI.step=a[i+1].id;render();window.scrollTo(0,0);}}
function prevStep(){const a=active(),i=a.findIndex(s=>s.id===UI.step);if(i>0){UI.step=a[i-1].id;render();window.scrollTo(0,0);}else{UI.view='home';render();window.scrollTo(0,0);}}
function make(keepOver){if(!keepOver){S.over=null;CHK={};ls.set('showday_chk',CHK);}PLAN=buildPlan(S);UI.view='result';UI.rtab='glance';UI.day=1;UI.sel=-1;UI.edit=false;UI.sheet=null;render();window.scrollTo(0,0);}
function commit(fn,msg){UI.undo.push(JSON.stringify(S));if(UI.undo.length>8)UI.undo.shift();fn();PLAN=buildPlan(S);UI.sel=-1;UI.sheet=null;UI.day=Math.min(UI.day,PLAN.days.length);render(true);if(msg)toast(msg,true);}
function reshuf(fn,msg){const had=!!S.over;commit(()=>{S.over=null;fn();},msg+(had?' · 직접 고친 순서는 새로 짰어요':''));}
let CHK={};
const ckey=(d,e)=>d+'|'+e.kind+'|'+(e.p?e.p.id:'');
const CHECKABLE=['place','meal','cafe'];
function preList(){const P_=PLAN,x=P_.x,vm=new Map();P_.days.forEach(d=>d.ev.forEach(e=>{if(e.kind==='place'&&e.p&&!vm.has(e.p.id))vm.set(e.p.id,e.p);}));const vp=[...vm.values()];const r=[['hotel',S.type==='stay'?(S.booked?'숙소 예약 내용(체크인·주차) 다시 확인':'숙소 예약하기'):null],['trip',P_.trip&&P_.trip.hi>0?'왕복 교통편(KTX·항공 등) 예매':null],...vp.map(o=>['v_'+o.id,o.name+' · 운영시간·휴무일 전화/공식 안내로 확인']),['kid',S.kids>0?'아이 간식·여벌 옷'+(S.stroller?'·유모차':''):null],['sen',S.seniors>0?'상비약·편한 신발·휴식용 접이식 방석':null],['rain',S.indoor?'우산·우비':null],['pay','교통카드·결제수단 챙기기']];return r.filter(o=>o[1]);}
/* 출발 전 자동 점검: 앱 안 정보로 확인되는 것 + API 연결 후 확인될 것 */
/* 자동 확인이 안 되는 것: 공식 안내 바로가기 (검색 주소는 장소 이름으로 만들어 항상 유효) */
const OFF_LINKS=[['기상청 날씨','https://www.weather.go.kr'],['코레일(열차)','https://www.korail.com'],['한국공항공사(항공)','https://www.airport.co.kr'],['한국관광공사','https://korean.visitkorea.or.kr']];
const lk=(u,t)=>`<a class="ol" href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`;
function offLinks(k){if(k.indexOf('v_')!==0)return '';const p=plc(k.slice(2));if(!p)return '';const q=encodeURIComponent(p.name);
  return `<div class="olr">${lk('https://search.naver.com/search.naver?query='+q+encodeURIComponent(' 운영시간 휴무'),'운영시간·휴무 검색')}${lk('https://map.kakao.com/?q='+q,'카카오맵')}</div>`;}
function preCheck(){const P_=PLAN,w=[],ok=[];
  if(S.date){const t0=new Date();t0.setHours(0,0,0,0);const d0=new Date(S.date+'T00:00:00'),dd=Math.round((d0-t0)/864e5);
    if(dd<0)w.push('여행 날짜가 이미 지났어요. 날짜를 다시 확인하세요.');else ok.push(dd===0?'오늘 출발이에요.':'출발까지 '+dd+'일 남았어요.');
    const mon=[];P_.days.forEach(d=>{const dt=new Date(d0);dt.setDate(dt.getDate()+d.n-1);if(dt.getDay()===1){const n=[...new Set(d.ev.filter(e=>e.kind==='place'&&e.p&&/박물관|미술관|전시|기념관/.test(e.p.name+e.p.cat)).map(e=>e.p.name))];if(n.length)mon.push(d.n+'일차 '+n.join('·'));}});
    if(mon.length)w.push('월요일은 쉬는 박물관·미술관이 많아요: '+mon.join(', ')+'. 운영 여부를 확인하세요.');
  }else w.push('날짜를 정하지 않았어요. 날짜를 정하면 요일 휴무·날씨 점검이 정확해져요.');
  const lt=P_.days.filter(d=>d.late).map(d=>d.n+'일차');if(lt.length)w.push(lt.join('·')+'은(는) 마무리가 늦어요. 장소를 줄이거나 시작 시간을 당겨 보세요.');else ok.push('늦은 시간에 끝나는 날이 없어요.');
  if(P_.excluded.length)w.push('시간이 모자라 빠진 곳 '+P_.excluded.length+'곳: '+P_.excluded.slice(0,3).map(o=>o.p.name).join('·')+(P_.excluded.length>3?' 외':''));
  if(P_.cap>0){if(P_.T.total>P_.cap)w.push('예상 비용 '+won(P_.T.total)+'이 예산 '+won(P_.cap)+'을 넘어요.');else ok.push('예상 비용이 예산 안이에요.');}
  if(S.type==='stay'&&!S.booked)w.push('숙소를 아직 예약 전으로 표시했어요.');
  if(P_.trip&&P_.trip.hi>0)w.push('왕복 교통편(KTX·항공 등) 예매 여부를 확인하세요.'+(homeTr()?' 마지막 날 귀가는 '+hm(S.depart)+' 출발로 잡혀 있어요(전날 저녁·당일 알림).':''));
  const api=['날씨(비·더위) · 기상청','장소 실제 운영시간·휴무 · 관광공사','열차·항공 지연·결항, 버스 도착','미세먼지 · 에어코리아'];
  return{w,ok,api};}
function viewGlance(){const P_=PLAN;let tot=0,done=0,nxt=null;
  P_.days.forEach(d=>d.ev.forEach(e=>{if(CHECKABLE.includes(e.kind)){tot++;if(CHK[ckey(d.n,e)])done++;else if(!nxt)nxt=ckey(d.n,e);}}));
  const pre=preList(),pd=pre.filter(o=>CHK['pre:'+o[0]]).length;
  const days=P_.days.map(d=>{const dn=d.ev.filter(e=>CHECKABLE.includes(e.kind)&&CHK[ckey(d.n,e)]).length,dt=d.ev.filter(e=>CHECKABLE.includes(e.kind)).length;
    return `<section class="gday"><header><span><b>${d.n}일차</b>${P_.S.date?' '+dayLabel(P_.S,d.n):''}</span><span>${dn}/${dt} 완료 · 이동 ${d.km}km · 약 ${man(d.sum)}</span></header>${d.ev.filter(e=>e.kind!=='start').map(e=>{
      if(!CHECKABLE.includes(e.kind))return `<div class="grow plain"><span class="bx">✓</span><span class="tm">${hm(e.t0)}</span><span class="tx"><b style="font-weight:500;font-size:14px">${e.title}</b></span></div>`;
      const k=ckey(d.n,e),on=!!CHK[k],lg=e.leg?`${e.leg.use==='car'?MLAB[S.mode==='rental'?'rental':'car']:MLAB[e.leg.use]} ${e.leg.min}분 · ${legCost(e.leg)}`:'';
      return `<button class="grow${on?' on':''}${k===nxt?' nx':''}" data-act="chk" data-v="${k}" aria-pressed="${on}"><span class="bx">✓</span><span class="tm">${hm(e.t0)}</span><span class="tx"><b>${e.title}${smp(e.p)}</b><small>${{place:'가볼 곳',meal:'식사',cafe:'카페'}[e.kind]}${e.cost?' · 약 '+won(e.cost):''}${lg?' · 앞 구간 '+lg:''}</small></span></button>`;}).join('')}</section>`;}).join('');
  const pc=preCheck(),pcHtml=`<section class="gday pcheck"><header><span><b>🔎 출발 전 자동 점검</b></span><span>${pc.w.length?'확인 '+pc.w.length+'건':'이상 없음'}</span></header>${pc.w.map(t=>`<div class="pcr warn"><span>⚠️</span><span>${esc(t)}</span></div>`).join('')}${pc.ok.map(t=>`<div class="pcr"><span>✅</span><span>${esc(t)}</span></div>`).join('')}<div class="pcr api"><span>🔌</span><span><b>연결 후 자동 확인:</b> ${pc.api.join(' / ')}<br>그 전에는 공식 사이트에서 직접 확인하세요.<span class="olr" style="padding:6px 0 0">${OFF_LINKS.map(o=>lk(o[1],o[0])).join('')}</span></span></div></section>`;
  return `<div class="gl-prog"><b>${done}/${tot} 완료</b><div class="stack"><i style="width:${tot?done/tot*100:0}%"></i></div></div>
${pcHtml}<section class="gday"><header><span><b>출발 전 체크</b></span><span>${pd}/${pre.length}</span></header>${pre.map(o=>{const on=!!CHK['pre:'+o[0]];return `<button class="grow${on?' on':''}" data-act="chk" data-v="pre:${o[0]}" aria-pressed="${on}"><span class="bx">✓</span><span class="tx"><b style="font-weight:500">${o[1]}</b></span></button>`+offLinks(o[0]);}).join('')}</section>${days}
<p class="hint">칸을 누르면 체크돼요. 이 폰에 저장되고, 일정이 새로 만들어지면 초기화돼요. <button class="lnk" data-act="chkReset">전체 해제</button></p>`;}
const curOver=()=>PLAN.days.map(d=>d.ev.filter(e=>e.kind==='place').map(e=>e.p.id));
const plc=id=>cityOf().places.find(p=>p.id===id);
function editPlace(op,id){const o=curOver(),di=UI.day-1,L=o[di],i=L.indexOf(id);if(i<0)return;
  if(op==='up'){if(i===0){toast('이미 맨 위예요');return;}[L[i-1],L[i]]=[L[i],L[i-1]];}
  else if(op==='dn'){if(i===L.length-1){toast('이미 맨 아래예요');return;}[L[i+1],L[i]]=[L[i],L[i+1]];}
  else if(op==='day'){const nd=(di+1)%o.length;L.splice(i,1);o[nd].push(id);commit(()=>{S.over=o;UI.day=nd+1;},(nd+1)+'일차로 옮겼어요');UI.day=nd+1;render(true);return;}
  commit(()=>{S.over=o;},'순서를 바꿨어요 · 이동거리를 다시 계산했어요');}
function delPlace(id,ok){const isW=S.wish.includes(id);if(isW&&!ok){UI.sheet={t:'confirm',op:'del',id};render(true);return;}
  const o=curOver();o[UI.day-1]=o[UI.day-1].filter(x=>x!==id);commit(()=>{S.over=o;S.wish=S.wish.filter(x=>x!==id);S.avoid=[...new Set([...S.avoid,id])];},'일정에서 뺐어요');}
function swapPlace(id,ok){const isW=S.wish.includes(id);if(isW&&!ok){UI.sheet={t:'confirm',op:'swap',id};render(true);return;}
  const o=curOver(),all=new Set(o.flat()),x=PLAN.x,C=cityOf(),cur=plc(id);
  const cand=C.places.filter(p=>p.cat!=='식당'&&p.cat!=='카페'&&!all.has(p.id)&&!(S.avoid||[]).includes(p.id)&&(!x.wheel||p.easy)).map(p=>({p,s:scoreAttr(p,x)-hav(cur,p)*2})).sort((a,b)=>b.s-a.s);
  if(!cand.length){UI.sheet=null;render(true);toast('바꿀 만한 다른 장소가 없어요');return;}
  doReplace(id,cand[0].p);}
function doReplace(id,n){const o=curOver(),cur=plc(id);o.forEach((L,k)=>{o[k]=L.filter(z=>z!==n.id||z===id);});o.forEach(L=>{const i=L.indexOf(id);if(i>=0)L[i]=n.id;});
  commit(()=>{S.over=o;S.avoid=[...new Set([...S.avoid.filter(a=>a!==n.id),id])];S.wish=S.wish.filter(w=>w!==id);},`'${cur.name}' 대신 '${n.name}'(으)로 바꿨어요`);}
function eatSwap(id,ok){if(S.wish.includes(id)&&!ok){UI.sheet={t:'confirm',op:'eat',id};render(true);return;}
  commit(()=>{S.avoidEat=[...new Set([...(S.avoidEat||[]),id])];S.wish=S.wish.filter(w=>w!==id);},'다른 곳으로 바꿨어요');}
function addPlaceAt(id,idx){const p=plc(id);if(!p)return;const d=PLAN.days[UI.day-1],o=curOver(),pos0=d.ev.slice(0,idx+1).filter(e=>e.kind==='place');const prevIds=new Set(pos0.map(e=>e.p.id));let pos=pos0.length;o.forEach((L,k)=>{if(L.includes(id)){if(k===UI.day-1&&prevIds.has(id))pos--;o[k]=L.filter(z=>z!==id);}});o[UI.day-1].splice(pos,0,id);
  commit(()=>{S.over=o;S.avoid=S.avoid.filter(a=>a!==id);if(!S.wish.includes(id))S.wish=[...S.wish,id];},`${p.name}을(를) ${UI.day}일차에 넣었어요`);}
function addExtra(id,idx){const p=plc(id);if(!p)return;const a=PLAN.days[UI.day-1].ev[idx],after=a&&['place','meal','cafe'].includes(a.kind)?a.p.id:null;
  commit(()=>{S.extras=[...(S.extras||[]),{uid:Date.now()+''+Math.floor(Math.random()*1000),day:UI.day,after,id}];},`${p.name}을(를) ${UI.day}일차에 넣었어요`);}
const ADJ={
 cut5(){const over=S.over,before=PLAN.T.total,r=reduceCost(S,50000);if(r.saved<=0){UI.sheet=null;render(true);toast('더 줄일 방법이 거의 없어요');return;}
  commit(()=>{S=r.S;S.over=over||null;});const d=Math.round(before-PLAN.T.total);toast(d>0?'약 '+won(r100(d))+' 줄였어요 · '+r.applied.join(', '):'조건을 바꿨지만 금액 변화는 작아요');},
 less(){commit(()=>{S.walkLvl='less';if(S.mode==='walk')S.mode='transit';if(S.pace==='packed')S.pace='normal';},'걷는 양을 줄여 다시 짰어요');},
 notaxi(){if(!['taxi','mix'].includes(S.mode)){UI.sheet=null;render(true);toast('이미 택시를 쓰지 않는 일정이에요');return;}commit(()=>{S.mode='transit';},'택시 대신 대중교통으로 바꿨어요');},
 food(){reshuf(()=>{S.interests=[...new Set([...S.interests,'food'])];S.mealPref=[...new Set([...S.mealPref,'local'])];S.styleOverride='food';},'맛집 중심으로 다시 짰어요');},
 rain(){reshuf(()=>{S.indoor=true;},'비 오는 날 일정으로 다시 짰어요 · 실내 위주');},
 tourFill(i){const t=TOURS[i],o=curOver();o[UI.day-1]=t.fill.slice();commit(()=>{S.over=o;},t.n+' 장소로 '+UI.day+'일차를 채웠어요 (개별 방문 기준)');},
 rainTog(){if(S.indoor)reshuf(()=>{S.indoor=false;},'맑은 날 일정으로 다시 짰어요');else ADJ.rain();},
 tired(){reshuf(()=>{S.pace='relaxed';if(S.kids>0)S.nap=true;},'여유롭게 쉬어 가는 일정으로 바꿨어요');},
 late(){UI.sheet={t:'late'};render(true);},
 swap(){UI.sheet={t:'swap'};render(true);},
 cafe(){const d=UI.day;if((S.cafeDays||[]).includes(d)){UI.sheet=null;render(true);toast(d+'일차에는 이미 카페 휴식이 있어요');return;}commit(()=>{S.cafeDays=[...(S.cafeDays||[]),d];},d+'일차에 카페 휴식을 넣었어요');}
};
/*VOICE_START — 말·글로 일정 바꾸기 (규칙 기반, 무료) */
const KDAY={'첫':1,'둘':2,'셋':3,'넷':4,'다섯':5};
function dayDate(n){if(!S.date)return null;const[y,m,d]=S.date.split('-').map(Number);return new Date(y,m-1,d+n-1);}
function liveDay(n){const dt=dayDate(n);if(!dt||!PLAN)return n;const t=new Date();t.setHours(0,0,0,0);if(dt>=t)return n;
  for(let i=1;i<=PLAN.days.length;i++){const z=dayDate(i);if(z>=t)return i;}return PLAN.days.length;}
function findTimes(c,mode){const out=[],re=/(오전|오후|저녁|아침|밤|새벽|낮)?\s*(\d{1,2})\s*시\s*(?:(반)|(\d{1,2})\s*분)?|(\d{1,2}):(\d{2})/g;let m;
  while((m=re.exec(c))){let h,mi=0;
    if(m[5]){h=+m[5];mi=+m[6];}else{h=+m[2];mi=m[3]?30:(m[4]?+m[4]:0);const g=m[1];
      if(g&&/오후|저녁|밤|낮/.test(g)){if(h<12)h+=12;}else if(g&&/오전|아침|새벽/.test(g)){if(h===12)h=0;}else if(mode==='ev'?h<=8:h<=5)h+=12;}
    if(h<=24)out.push(h*60+mi);}
  return out;}
function parseSay(raw,one){const txt=(raw||'').replace(/\s+/g,' ').trim(),acts=[],miss=[];if(!txt||!PLAN)return{acts,miss};
  const nD=PLAN.days.length;let day=UI.day;
  const dm=txt.match(/(\d)\s*일\s*차|(첫|둘|셋|넷|다섯)\s*째\s*날|(내일)|(모레)/);
  if(dm)day=dm[1]?+dm[1]:dm[2]?KDAY[dm[2]]:dm[3]?UI.day+1:UI.day+2;
  day=Math.max(1,Math.min(nD,day));if(!dm)day=liveDay(day);
  const C=cityOf(),np=s=>s.replace(/[\s·()\-]/g,'');
  const clauses=one?[txt]:txt.split(/[.,!?\n]| 그리고 | 그래서 | 그러니까 | 근데 | 그런데 |(?<=는데|인데|니까|라서) /).map(s=>s.trim()).filter(Boolean);
  const EVK=/(행사|공연|콘서트|약속|예약|미팅|모임|축제|경기|결혼식|파티|티켓|관람|전시회|페스티벌|버스킹|식사 약속|회식)/;
  const SUF=/(해수욕장|해변|박물관|미술관|공원|시장|전망대|아쿠아리움|타워|폭포|수목원|둘레길|케이블카|스카이워크|사찰|마을)$/,keyOf=nm=>{const k=np(nm).replace(SUF,'');return k.length>=3?k:'';},aliasN={};C.places.forEach(p=>{const k=keyOf(p.name);if(k)aliasN[k]=(aliasN[k]||0)+1;});
  const findPl=c=>{const n=np(c);return C.places.filter(p=>{const nm=np(p.name),k=keyOf(p.name);return n.includes(nm)||(nm.length>=5&&n.includes(nm.slice(0,4)))||(k&&aliasN[k]===1&&n.includes(k));});};
  clauses.forEach(c=>{let hit=false;const ek=c.match(EVK);
    if(!ek&&(/(지금|현재)\s*(시간|시각|부터|바로|출발|시작|떠|나가)|지금\s*(출발|시작|가자|갈게)|(지금|현재)\s*(내\s*)?(위치|여기)/.test(c)||(/(지금|현재)/.test(c)&&/(시간|시각)/.test(c)&&/(적용|맞춰|기준)/.test(c)))){const st=Math.ceil(nowMin()/5)*5,loc=/위치|여기|내\s*위치/.test(txt);
      acts.push({k:'now',day,st,loc,label:`${day}일차를 지금(${hm(st)})부터 시작${loc?' · 지금 내 위치에서 출발':''}`});hit=true;}
    if(ek&&/(취소|빼\s*줘|빼\s*고|없애|삭제|지워)/.test(c)&&!findTimes(c,'ev').length&&(S.fixedEv||[]).some(f=>f.day===day)){acts.push({k:'fxdel',day,label:`${day}일차 행사 일정 빼기`});hit=true;}
    else if(ek){const ts=findTimes(c,'ev');if(ts.length){const t=ts[0];let dur=ts.length>1&&ts[1]>t?ts[1]-t:0;
      const hm_=c.match(/(\d+)\s*시간(\s*반)?/);if(!dur&&hm_)dur=(+hm_[1])*60+(hm_[2]?30:0);if(!dur)dur=/약속|예약|미팅|모임/.test(ek[1])?90:120;
      const fp=findPl(c).find(p=>p.cat!=='식당'&&p.cat!=='카페');acts.push({k:'fixed',day,t,dur,pid:fp?fp.id:null,title:ek[1],label:`${day}일차 ${hm(t)}부터 ${fp?fp.name+' ':''}${ek[1]} (약 ${hmT(dur)}) — 이 시간에 맞춰 짜요`});hit=true;}}
    const early=findPl(c).length?/일찍|빨리\s*시작|아침부터/.test(c):/오후.{0,8}오전|오전(으로|에)\s*(다|몰|옮|당|해|바꿔|끝|하고)|일찍|앞당|당겨|아침부터|빨리\s*시작/.test(c);
    if(early||(!ek&&/(시작|출발|나가|나갈|움직|부터)/.test(c)&&findTimes(c,'st').length)){let st=480;const ts=!ek?findTimes(c,'st'):[];if(ts.length&&ts[0]<12*60)st=ts[0];
      acts.push({k:'start',day,st,label:`${day}일차를 ${hm(st)}에 시작 — 오후 일정을 앞으로 당겨요`});hit=true;}
    let mn=0;const dl=c.match(/(\d+)\s*(분|시간)\s*(정도\s*)?(늦|지연|밀|더\s*(있|머))/);
    if(dl)mn=dl[2]==='시간'?+dl[1]*60:+dl[1];
    else{const kk=c.match(/(한|두|세|네)\s*시간\s*(정도\s*)?(반\s*)?(늦|지연|밀|더)/);if(kk)mn=({한:1,두:2,세:3,네:4})[kk[1]]*60+(kk[3]?30:0);else if(/반\s*시간\s*(정도\s*)?(늦|지연|밀|더)/.test(c))mn=30;}
    if(mn||/늦어졌|늦었|지체|늦잠|지각|밀렸|막혀|막혔|체증|정체|놓쳤|연착|지연됐|늦게\s*(시작|출발|나가|일어)/.test(c)){if(!mn)mn=/늦잠|늦게/.test(c)?60:30;acts.push({k:'delay',day,min:mn,label:`${day}일차를 ${mn>=60?mn/60+'시간':mn+'분'} 늦춰서 다시 계산`});hit=true;}
    if(/비\s*(가|도|는)?\s*(오|와|올|내|온|옴|예보|소식|때문)|소나기|장마|폭우|우산|우천|비바람|궂|날씨\s*(가|도)?\s*(안\s*좋|나쁘|별로|걱정)|눈\s*(이|도)?\s*(오|와|올|내|많이)|폭설|눈길|태풍|한파|폭염|무더위|미세먼지|황사|실내|너무\s*(더워|더운|추워|추운|덥|춥)|더워서|추워서/.test(c)&&!/맑|화창|비\s*(안|없)/.test(c)){acts.push({k:'rain',label:/비|소나기|장마|폭우|우산|우천/.test(c)?'비 오는 날 — 실내 위주로':'날씨 때문에 — 실내 위주로'});hit=true;}
    if(/피곤|힘들|힘드|지쳐|지쳤|지친|피로|쉬엄|천천히|여유롭게|느긋|졸려|졸린|졸리|다리\s*(가|도)?\s*아|발\s*(이|도)?\s*아|아파|무릎|허리|걷기\s*(싫|힘|부담)|걷는\s*(거|게)?\s*(싫|힘|부담)|많이\s*걸|덜\s*걷|적게\s*걷|숨\s*차|쉬고\s*싶|쉬었으면|빡빡하|널널|칭얼|보채/.test(c)){acts.push({k:'tired',label:'여유롭게 — 덜 걷고 쉬어가요'});hit=true;}
    if(/택시.{0,6}(말고|빼|싫|대신|안)|(버스|지하철|전철|대중교통)\s*(으로|로|만|이용|타고|탈|타|이동)|택시\s*(비|값|요금)\s*(비싸|아까|부담)/.test(c)){acts.push({k:'notaxi',label:'택시 대신 대중교통'});hit=true;}
    if(/맛집|먹방|식도락|맛\s*기행|먹거리|배고|출출|밥\s*먼저|식당\s*먼저/.test(c)&&/(중심|위주|많이|먹으러|여행|투어|코스|바꿔|해줘|해\s*줘|넣|먼저|배고|출출)/.test(c)){acts.push({k:'food',label:'맛집 중심으로'});hit=true;}
    if(/(카페|커피|차\s*한\s*잔|디저트|브런치|빵집)/.test(c)&&/(가|쉬|넣|추가|마시|싶|먹|들러)/.test(c)&&!/(빼|제외)/.test(c)&&!findPl(c).length){acts.push({k:'cafe',day,label:`${day}일차에 카페 휴식 추가`});hit=true;}
    const pls=findPl(c);const n_=np(c),ix=p=>{const nm=np(p.name),k=n_.indexOf(nm);return k>=0?k:n_.indexOf(nm.slice(0,4));};pls.sort((p,q)=>ix(p)-ix(q));let aft=false;
    if(pls.length>=2&&!ek&&/(다음|뒤에|이후)/.test(c)){const A=pls[0],B=pls[1];if(A.cat!=='식당'&&A.cat!=='카페'&&B.cat!=='식당'&&B.cat!=='카페'){const fr=/(오전|아침|먼저|처음|첫)/.test(c);acts.push({k:'after',a:A.id,b:B.id,day,front:fr,label:fr?`${day}일차 오전에 '${A.name}' → '${B.name}' 순서로 넣기`:`'${B.name}'을(를) '${A.name}' 바로 다음에 넣기`});hit=true;aft=true;}}
    if(pls.length&&!ek&&!aft){const rm=/(빼|제외|취소|안\s*갈|안\s*가|가지\s*않|말고|스킵|건너|지워|패스|생략|없애|삭제|그만|싫)/.test(c);
      pls.slice(0,3).forEach(p=>{if(rm){if(p.cat!=='식당'&&p.cat!=='카페'){acts.push({k:'rm',id:p.id,label:`'${p.name}' 일정에서 빼기`});hit=true;}}
        else if(/(넣|추가|포함|끼워|껴|가고\s*싶|가보고|가자|가볼|가봐|들러|들를|방문|가요|갈래|갈게|보고\s*싶|구경|바꿔|옮겨|당겨|미뤄|앞으로|뒤로|해줘|해 줘|하고\s*싶)/.test(c)){
          const fr=/(오전|먼저|아침|처음|첫|앞으로|당겨)/.test(c),bk=/(오후|저녁|나중|마지막|뒤로|미뤄)/.test(c);
          if(!fr&&!bk&&!/(넣|추가|포함|끼워|껴|가고\s*싶|가보고|가자|가볼|가봐|들러|들를|방문|가요|갈래|갈게|보고\s*싶|구경)/.test(c))return;
          const pdi=PLAN.days.findIndex(z=>z.ev.some(e=>e.kind==='place'&&e.p&&e.p.id===p.id)),dd=(pdi>=0&&(fr||bk)&&!dm)?pdi+1:day;
          acts.push({k:'add',id:p.id,day:dd,front:fr&&!bk,label:fr&&!bk?`'${p.name}' ${dd}일차 오전(맨 앞)으로`:bk?`'${p.name}' ${dd}일차 뒤쪽(오후)으로`:`'${p.name}' ${dd}일차에 넣기`});hit=true;}});}
    if(!hit)miss.push(c);});
  if(!one&&miss.length){const r2=parseSay(raw.replace(/[.,!?]/g,' '),true);if(r2.acts.length>=acts.length&&r2.miss.length<miss.length)return r2;}
  return{acts,miss,day};}
function vprev(){const r=parseSay(UI.vtext);if(!UI.vtext||!UI.vtext.trim())return '<p class="meta">위 칸에 쓰거나 🎤로 말하면, 이렇게 바꿀 거라고 먼저 보여드려요.</p>';
  return (r.acts.length?`<p class="meta" style="margin:0 0 6px">이렇게 바꿀게요</p>`+r.acts.map(a=>`<div class="vp">✓ ${esc(a.label)}</div>`).join(''):'<p class="meta">아직 알아듣지 못했어요. 시간·행사, 일찍/늦게 시작, 늦어짐, 비·날씨, 피곤·다리 아픔, 교통수단, 맛집·카페, 장소 빼기/넣기를 말해 보세요.</p>')
   +(r.miss.length&&r.acts.length?`<p class="meta" style="margin-top:6px">알아듣지 못한 부분: ${esc(r.miss.join(' / '))}</p>`:'');}
function applySay(){const r=parseSay(UI.vtext);if(!r.acts.length)return;const A=r.acts;
  const edit=A.some(a=>a.k==='rm'||a.k==='add'||a.k==='after'),flag=A.some(a=>['rain','tired','food'].includes(a.k));
  const lastP=dn=>{const d=PLAN.days[dn-1];let id=null;d.ev.forEach(e=>{if(['place','meal','cafe'].includes(e.kind)&&e.p)id=e.p.id;});return id;};
  const o=edit?curOver():null,exs=[];
  A.forEach(a=>{if(a.k==='after'){if(a.front){o.forEach((L,i)=>{o[i]=L.filter(x=>x!==a.a&&x!==a.b);});o[a.day-1].unshift(a.a,a.b);}else{o.forEach((L,i)=>{o[i]=L.filter(x=>x!==a.b);});let di=o.findIndex(L=>L.includes(a.a));if(di<0){di=a.day-1;o[di].push(a.a);}o[di].splice(o[di].indexOf(a.a)+1,0,a.b);}}
    if(a.k==='rm')o.forEach((L,i)=>{o[i]=L.filter(x=>x!==a.id);});
    if(a.k==='add'){const p=plc(a.id);if(p.cat==='식당'||p.cat==='카페')exs.push({uid:Date.now()+''+Math.floor(Math.random()*1000),day:a.day,after:lastP(a.day),id:a.id});
      else{o.forEach((L,i)=>{o[i]=L.filter(x=>x!==a.id);});if(a.front)o[a.day-1].unshift(a.id);else o[a.day-1].push(a.id);}}});
  const fd=A.find(a=>a.day);if(fd){UI.day=(fd.k==='after'&&!fd.front)?(PLAN.days.findIndex(z=>z.ev.some(e=>e.kind==='place'&&e.p&&e.p.id===fd.a))+1||fd.day):fd.day;}UI.rtab='plan';
  commit(()=>{
    if(edit)S.over=o;else if(flag)S.over=null;
    A.forEach(a=>{
      if(a.k==='fixed')S.fixedEv=[...(S.fixedEv||[]).filter(f=>f.day!==a.day),{day:a.day,t:a.t,dur:a.dur,title:a.title,pid:a.pid||null}];
      else if(a.k==='fxdel')S.fixedEv=(S.fixedEv||[]).filter(f=>f.day!==a.day);
      else if(a.k==='now')S.startShift={day:a.day,st:a.st};
      else if(a.k==='start')S.startShift={day:a.day,st:a.st};
      else if(a.k==='delay')S.delay={day:a.day,min:a.min};
      else if(a.k==='rain')S.indoor=true;
      else if(a.k==='tired'){S.pace='relaxed';if(S.kids>0)S.nap=true;}
      else if(a.k==='notaxi'){if(['taxi','mix'].includes(S.mode))S.mode='transit';}
      else if(a.k==='food'){S.interests=[...new Set([...S.interests,'food'])];S.mealPref=[...new Set([...S.mealPref,'local'])];S.styleOverride='food';}
      else if(a.k==='cafe')S.cafeDays=[...new Set([...(S.cafeDays||[]),a.day])];
      else if(a.k==='rm'){S.wish=S.wish.filter(x=>x!==a.id);S.avoid=[...new Set([...S.avoid,a.id])];}
      else if(a.k==='add'){S.avoid=S.avoid.filter(x=>x!==a.id);}
      else if(a.k==='after'){S.glue=[...(S.glue||[]).filter(g=>g[1]!==a.b&&g[0]!==a.b),[a.a,a.b]];S.avoid=S.avoid.filter(x=>x!==a.b);if(!S.wish.includes(a.b))S.wish=[...S.wish,a.b];if(a.front&&!S.wish.includes(a.a))S.wish=[...S.wish,a.a];}});
    if(exs.length)S.extras=[...(S.extras||[]),...exs];
    A.filter(a=>a.k==='add').forEach(a=>{const p=plc(a.id);if(p.cat!=='식당'&&p.cat!=='카페'&&!S.wish.includes(a.id))S.wish=[...S.wish,a.id];});
  },'말씀하신 대로 바꿨어요 ('+A.length+'가지)');
  const ex=PLAN.excluded.filter(e=>e.why==='시간이 모자라 제외했어요');if(ex.length)setTimeout(()=>toast('시간이 모자라 빠진 곳: '+ex.map(e=>e.p.name).slice(0,3).join(', ')),2600);
  const ad=A.filter(a=>a.k==='add');if(ad.length){const a=ad[ad.length-1],e=PLAN.days[a.day-1].ev.find(z=>z.p&&z.p.id===a.id&&z.kind==='place');
    if(e)setTimeout(()=>toast(`${plc(a.id).name}: ${a.day}일차 ${hm(e.t0)}에 넣었어요`+(a.front&&e.t0>=12*60?' (오전 시간이 없어 가장 이른 시간이에요)':'')),600);}
  if(A.some(a=>a.k==='now'&&a.loc)){const nd=A.find(a=>a.k==='now').day;setTimeout(()=>geoSt(nd),900);}
  UI.vtext='';}
function geoSt(n){if(!navigator.geolocation){toast('이 화면에서는 위치를 못 가져와요. "출발 위치 바꾸기"에서 지도 앱 위치를 붙여넣어 주세요');return;}
  navigator.geolocation.getCurrentPosition(pos=>{const lat=pos.coords.latitude,lng=pos.coords.longitude;if(hav({lat,lng},cityOf().hub)>60){toast('선택한 지역에서 너무 멀어요');return;}setSt(n,{name:'현재 위치',lat,lng},n+'일차를 내 위치에서 출발하도록 바꿨어요');},()=>toast('위치를 못 가져왔어요. "출발 위치 바꾸기"에서 지도 앱 위치를 붙여넣어 주세요'),{enableHighAccuracy:true,timeout:8000});}
function micGo(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const fail=()=>toast('이 화면에선 마이크를 쓸 수 없어요. 입력칸을 누르고 키보드의 🎤로 말씀하세요');
  if(!SR){fail();return;}
  try{const r=new SR();r.lang='ko-KR';r.interimResults=false;r.maxAlternatives=1;UI.mic=true;
    r.onresult=e=>{const tx=e.results[0][0].transcript;UI.vtext=((UI.vtext||'')+' '+tx).trim();const ta=document.getElementById('vtext');if(ta)ta.value=UI.vtext;vUpd();};
    r.onerror=ev=>{UI.mic=false;if(ev.error==='not-allowed'||ev.error==='service-not-allowed')fail();else toast('잘 못 들었어요. 다시 말씀해 주세요');vUpd();};
    r.onend=()=>{UI.mic=false;vUpd();};r.start();toast('듣고 있어요. 말씀하세요');vUpd();}catch(e){fail();}}
function vUpd(){const p=document.getElementById('vprev'),g=document.getElementById('vgo'),m=document.getElementById('vmic');
  if(p)p.innerHTML=vprev();if(g)g.disabled=!parseSay(UI.vtext).acts.length;if(m)m.textContent=UI.mic?'🎤 듣는 중…':'🎤 말하기';}
function vExamples(){const d=PLAN.days[UI.day-1],pl=d.ev.find(e=>e.kind==='place');
  return ['5시에 행사가 있어. 오후 일정을 오전으로 당겨줘','오후 3시 반에 약속 있어','9시부터 시작할게','1시간 늦었어','비 와서 실내로 바꿔줘','아이가 피곤해해'].concat(pl?[pl.title+' 빼줘']:[]);}
