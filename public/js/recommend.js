/* "이런 곳은 어때요?" 지역 추천 화면: 이동수단·최대 시간·정렬·카테고리 변수 */
const REC_PRESETS=[
  ['sea','🌊 바다 보러',{interests:['sea'],maxMin:0,recSort:'score',travelBy:'auto'}],
  ['near','🚗 가까운 곳',{maxMin:120,recSort:'time'}],
  ['food','🍜 맛집 여행',{interests:['food'],recSort:'score'}],
  ['easy','🧓 덜 걷는 곳',{interests:['walk','culture'],walkLvl:'less',recSort:'score'}],
  ['kid','🎡 아이와 체험',{interests:['play','nature'],recSort:'score'}],
  ['fest','🎪 축제·공연',{interests:['festival','show'],recSort:'score'}],
  ['cheap','💰 알뜰하게',{interests:['free'],recSort:'cost'}]];
function recPreset(k){const p=REC_PRESETS.find(x=>x[0]===k);if(!p)return;Object.assign(S,{interests:[],travelBy:'auto',maxMin:0,recSort:'score'},p[2]);UI.rq='';render(true);}
function recReset(){Object.assign(S,{interests:[],travelBy:'auto',maxMin:0,recSort:'score'});UI.rq='';render(true);}
function recBody(){
  const ok0=!!UI.originOk,by=ok0?(S.travelBy||'auto'):'auto',mx=ok0?(S.maxMin||0):0,so=ok0?(S.recSort||'score'):'score';
  const chips=(k,arr,cur)=>arr.map(([v,l])=>`<button class="chip${cur===v?' on':''}" data-act="setr" data-k="${k}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join('');
  const origin=S.originType==='seoul'?'서울·수도권 출발 기준':S.originType==='local'?'도착지 근처 거주(교통비 없음)':S.originPos?'내 위치 기준(직선거리 추정)':'입력한 교통비·시간 기준';
  const row=(lab,html,wrap)=>`<div class="rr"><span class="rl">${lab}</span><div class="rc${wrap?' wrap':''}">${html}</div></div>`;
  const ob=ok0?'':`<div class="obanner"><b>📍 출발지를 먼저 알려 주세요</b><span class="hint" style="margin:0">이동시간·교통비·이동수단 조건은 출발지를 정하면 적용돼요. 지금은 카테고리로만 골라요.</span><div class="rc wrap"><button class="chip" data-act="recOrigin" data-v="seoul">서울·수도권</button><button class="chip" data-act="recOrigin" data-v="geo">📍 내 위치</button><button class="chip" data-act="recOrigin" data-v="local">도착지 근처</button></div></div>`;
  const dis=ok0?'':' disabled';
  return ob+`<div class="rpre">${REC_PRESETS.map(p=>`<button class="chip" data-act="recPreset" data-v="${p[0]}">${p[1]}</button>`).join('')}</div>`+
    `<input type="search" id="rq" class="rsearch" placeholder="지역·장소 이름으로 찾기 (예: 불국사, 남이섬)" value="${esc(UI.rq||'')}" autocomplete="off" aria-label="지역 또는 장소 검색">`+
    `<div class="rf">`+
    row('카테고리',INTS.map(o=>chip('arr','interests',o[0],S.interests.includes(o[0]),o[1])).join(''),1)+
    row('이동수단',(ok0?'':'<span class="hint" style="margin:6px 0">출발지를 정하면 고를 수 있어요</span>')+(ok0?chips('travelBy',[['auto','전체'],['rail','기차'],['car','자가용'],['bus','버스'],['air','항공']],by):''),1)+
    row('편도(시간)',(ok0?'':'<span class="hint" style="margin:6px 0">출발지를 정하면 고를 수 있어요</span>')+(ok0?chips('maxMin',[[0,'전체'],[90,'1.5'],[120,'2'],[180,'3'],[240,'4']],mx):''),1)+
    row('정렬',chips('recSort',ok0?[['score','추천순'],['time','가까운 순'],['cost','비용 적은 순']]:[['score','추천순']],so),1)+
    `</div><div class="rbar"><span class="hint">${origin} · 시간·요금은 대략값</span><button class="lnk" data-act="recReset">조건 초기화</button></div><div id="rres">${recList()}</div>`;}
function recList(){
  const ok0=!!UI.originOk,by=ok0?(S.travelBy||'auto'):'auto',mx=ok0?(S.maxMin||0):0,so=ok0?(S.recSort||'score'):'score',q=(UI.rq||'').trim().toLowerCase();
  let rows=recommendCities(S).map(c=>{const C=CITIES[c.id];let P=null;try{P=buildPlan({...S,city:c.id,hotel:'h1',hotelPrice:C.hotels[0].price,booked:false,wish:[],avoid:[],over:null,delay:null,cafeDays:[],avoidEat:[]},true);}catch(e){}
    const ok=!!(S.budget&&P&&P.cmpT(P.T.hi)<=P.cap);
    const noMode=by!=='auto'&&c.opts.length>0&&!c.opts.some(o=>o.k===by);
    const tm=(by==='auto'&&c.opts.length)?Math.min(...c.opts.map(o=>o.min)):c.min;
    const tooFar=!!(mx&&c.min>0&&tm>mx);
    const qhit=q?(C.name.toLowerCase().includes(q)||C.places.some(p=>p.cat!=='식당'&&p.cat!=='카페'&&p.name.toLowerCase().includes(q))):true;
    return {c,P,ok,qhit,hide:noMode?'선택한 이동수단이 없어요':tooFar?'편도 시간이 길어요':''};});
  if(q)rows=rows.filter(r=>r.qhit);
  if(so==='time')rows.sort((a,b)=>a.c.min-b.c.min);else if(so==='cost')rows.sort((a,b)=>(a.P?a.P.T.lo:a.c.lo)-(b.P?b.P.T.lo:b.c.lo));
  if(S.budget)rows.sort((a,b)=>(b.ok-a.ok));
  const shown=rows.filter(r=>!r.hide),hid=rows.filter(r=>r.hide);
  const none=S.budget&&!shown.some(r=>r.ok);
  const card=({c,P,ok,hide},i)=>{const line=!ok0?'<span style="color:var(--muted)">이동시간·교통비는 출발지를 정하면 나와요</span>':c.opts.length?c.opts.map(o=>{const t=`${o.lab} ${hmT(o.min)} · 왕복 약 ${man(o.lo)}${o.hi>o.lo?'~'+man(o.hi):''}`;return o.k===c.mode?`<span style="color:var(--accent);font-weight:700">${t}</span>`:t;}).join('<br>'):(c.hi>0?'왕복 교통 약 '+man(c.lo)+'~'+man(c.hi)+' · 편도 약 '+hmT(c.min):'왕복 교통비 거의 없음');
    const h=c.catHit.filter(o=>o[1]>0).map(o=>(INTS.find(i=>i[0]===o[0])||[0,o[0]])[1]+' '+o[1]+'곳');
    return `<button class="opt${i===0&&!hide?' on':''}" data-act="recgo" data-v="${c.id}" style="margin-bottom:10px${hide?';opacity:.55':''}"><b>${hide?'':(i+1)+'. '}${c.name}${S.budget&&P?` <span class="tag" style="${ok?'':'background:var(--line);color:var(--muted)'}">${ok?'예산 안':'예산 초과 가능'}</span>`:''}${hide?` <span class="tag" style="background:var(--line);color:var(--muted)">${hide}</span>`:''}</b><small>${c.picks.join(' · ')}</small>${P?`<small>예상 총 약 ${man(P.T.lo)}~${man(P.T.hi)} (추정)</small>`:''}<small>${line}</small>${h.length?`<small>${h.slice(0,3).join(' · ')}</small>`:S.interests.length?'<small>선택한 카테고리 후보 없음</small>':''}</button>`;};
  return `<p class="hint" style="margin:0 0 6px">${q?`'${esc(UI.rq.trim())}' 검색 · `:''}조건에 맞는 <b>${shown.length}곳</b>${hid.length?` (안 맞는 ${hid.length}곳 접힘)`:''}</p>`+(none?'<div class="msg bad">입력한 예산 안에 들어오는 곳이 없어요. 기간을 줄이거나 예산을 조금 올려 보세요.</div><div style="height:10px"></div>':'')+
    (shown.length?shown.map((r,i)=>card(r,i)).join(''):'<div class="msg bad">조건에 맞는 지역이 없어요. 이동수단이나 최대 시간을 바꿔 보세요.</div>')+
    (hid.length?`<button class="lnk" data-act="recAll" style="margin:4px 0 10px">${UI.recAll?'조건에 안 맞는 지역 접기':`조건에 안 맞는 지역 ${hid.length}곳 보기`}</button>`+(UI.recAll?hid.map((r,i)=>card(r,i)).join(''):''):'')+
    '<p class="hint">고르면 가고 싶은 곳, 숙소, 이동수단을 이어서 물어봐요. 총액은 숙소 대표 지역 기준 추정이에요.</p>';}
