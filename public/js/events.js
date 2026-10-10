/* 화면 공통 도우미, 행사, 지도(SVG) */
/* ---------- 화면 ---------- */
const DOW=['일','월','화','수','목','금','토'];
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const dayLabel=(S,n)=>{if(!S.date)return '';const[y,m,d]=S.date.split('-').map(Number);const t=new Date(y,m-1,d+n-1);return(t.getMonth()+1)+'/'+t.getDate()+'('+DOW[t.getDay()]+')';};
const ampm=m=>{const h=Math.floor(m/60);return(h<12?'오전 ':'오후 ')+(h%12===0?12:h%12)+'시';};
const DEF=()=>({type:'stay',undecided:false,city:'seoul',dmode:'none',date:'',nights:2,originType:'seoul',travelBy:'auto',maxMin:0,recSort:'score',originPos:null,otherCost:0,otherMin:120,depStart:480,arrive:720,depart:1080,who:'kids',adults:2,seniors:0,kids:1,kidAge:'elem',nap:false,wish:[],hotel:'h1',hotelPrice:130000,booked:false,mode:'transit',interests:['food','nature'],mealPref:[],walkLvl:'normal',stairs:false,wheel:false,stroller:false,indoor:false,budget:0,budgetType:'total',incLodge:true,incTravel:true,pace:'normal',styleOverride:'',avoid:[],over:null,avoidEat:[],cafeDays:[],delay:null,customHotel:null,eatPick:{},extras:[]});
let S=DEF(),PLAN=null,UI={view:'home',step:'type',rtab:'plan',day:1,sel:-1,undo:[],wq:'',aq:'',hq:'',edit:false,sheet:null,known:new Set(),rec:false,wishFirst:false,quick:false,big:false,wc:'all',af:'all',as:'near',ids:null,start:null,booked:false};
const $=s=>document.querySelector(s),app=$('#app');
const ls={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}};
function toast(m,u){const e=document.createElement('div');e.className='toast';e.textContent=m;if(u&&UI.undo.length){const b=document.createElement('button');b.className='tu';b.dataset.act='undo';b.textContent='되돌리기';e.appendChild(b);}$('#toastbox').appendChild(e);setTimeout(()=>e.remove(),u?6000:2600);}
const mapUrl=p=>'https://map.kakao.com/link/map/'+encodeURIComponent(p.name)+','+p.lat+','+p.lng;
const cityOf=()=>CITIES[S.city];
const durText=()=>S.type==='day'?'당일':S.nights+'박 '+(S.nights+1)+'일';
const opt=(act,k,v,on,t,sub,extra)=>`<button class="opt${on?' on':''}" data-act="${act}" data-k="${k}" data-v="${v}" aria-pressed="${!!on}"${extra||''}><b>${t}</b>${sub?`<small>${sub}</small>`:''}</button>`;
const chip=(act,k,v,on,t)=>`<button class="chip${on?' on':''}" data-act="${act}" data-k="${k}" data-v="${v}" aria-pressed="${!!on}">${t}</button>`;
const seg=(k,opts)=>'<div class="seg" role="group">'+opts.map(o=>`<button class="${S[k]===o[0]?'on':''}" data-act="set" data-k="${k}" data-v="${o[0]}" aria-pressed="${S[k]===o[0]}">${o[1]}</button>`).join('')+'</div>';
const tog=(k,t)=>`<label class="tog"><input type="checkbox" data-act="bool" data-k="${k}"${S[k]?' checked':''}><span>${t}</span></label>`;
const stp=(k,label)=>`<div class="fld"><small>${label}</small><div class="stp"><button data-act="dec" data-k="${k}" aria-label="${label} 줄이기">−</button><output>${S[k]}</output><button data-act="inc" data-k="${k}" aria-label="${label} 늘리기">+</button></div></div>`;
const rng=(c)=>c.lo===c.hi?'약 '+won(c.v):'약 '+man(c.lo)+'~'+man(c.hi);
const legCost=l=>{if(!l.cost)return '무료';const f=l.fixed?0:(RF[l.use]||0);return f>=0.2?'약 '+won(r100(l.cost*(1-f)))+'~'+won(r100(l.cost*(1+f))):'약 '+won(l.cost);};

/* 질문 단계 */
const DEST_NOTE={suwon:'화성·행궁',daegu:'근대골목·서문시장',gyeongju:'대릉원·불국사',yeosu:'밤바다·케이블카',sokcho:'바다·설악산',incheon:'차이나타운·월미도',daejeon:'과학관·성심당',gwangju:'ACC·무등산',ulsan:'대왕암·태화강',pohang:'호미곶·물회',tongyeong:'동피랑·케이블카',andong:'하회마을·찜닭',chuncheon:'남이섬·닭갈비',taean:'꽃지·신두리',suncheon:'순천만·국가정원',mokpo:'유달산·해상케이블카',buyeo:'백제 유적·궁남지'};
const DESTS=Object.keys(CITIES).map(id=>[id,CITIES[id].name,DEST_NOTE[id]||'',1]).concat([['more','그 외 지역','실제 데이터 연결 후 추가돼요',0]]);
const STEPS=[
{id:'type',q:'어떤 여행을 계획하세요?',sub:'당일 나들이도, 숙박 여행도 가능해요.',auto:1,show:()=>true,
 body:()=>'<div class="opts">'+opt('type','type','day',S.type==='day','당일여행','출발한 날 돌아와요')+opt('type','type','stay',S.type==='stay'&&!S.undecided,'숙박여행','1박 이상 머물러요')+opt('type','type','undecided',S.undecided,'아직 미정','기간부터 같이 정해요')+'</div>'},
{id:'dur',q:'며칠 다녀오세요?',sub:'숙박은 숙소 지역을 기본값으로 잡아 드려요.',auto:1,show:()=>!!(UI.quick||UI.rec),
 body:()=>'<div class="opts g2">'+[[0,'당일','출발한 날 귀가'],[1,'1박 2일',''],[2,'2박 3일',''],[3,'3박 4일','']].map(o=>opt('dur','dur',o[0],(o[0]===0?S.type==='day':(S.type==='stay'&&S.nights===o[0])),o[1],o[2])).join('')+'</div>'},
{id:'dest',q:'어디로 가세요?',sub:'지금은 10개 지역 샘플 데이터로 시험 중이에요.',auto:1,show:()=>true,
 body:()=>'<div class="opts g2">'+DESTS.map(d=>`<button class="opt${S.city===d[0]?' on':''}" data-act="dest" data-v="${d[0]}"${d[3]?'':' disabled'}><b>${d[1]}</b><small>${d[2]||'&nbsp;'}</small></button>`).join('')+'</div>'},
{id:'date',q:'언제, 며칠 가세요?',show:()=>true,
 body:()=>{const sat=new Date();sat.setDate(sat.getDate()+((6-sat.getDay()+7)%7));
  return '<div class="chips">'+[['weekend','이번 주말'],['today','오늘'],['pick','날짜 선택'],['none','아직 안 정함']].map(o=>chip('dmode','dmode',o[0],S.dmode===o[0],o[1])).join('')+'</div>'+
  (S.dmode==='pick'?`<div class="fld" style="margin-top:12px"><small>출발 날짜</small><input type="date" id="datein" value="${S.date}"></div>`:'')+
  (S.date?`<p class="hint">${S.date.replace(/-/g,'.')} (${DOW[new Date(+S.date.slice(0,4),+S.date.slice(5,7)-1,+S.date.slice(8)).getDay()]}) 출발</p>`:'')+
  (S.type==='stay'?'<p class="lab">숙박 일수</p><div class="chips">'+(S.undecided?chip('nights','nights',0,false,'당일'):'')+[1,2,3,4,5].map(n=>chip('nights','nights',n,S.nights===n&&S.type==='stay',n+'박 '+(n+1)+'일')).join('')+'</div>':'');}},
{id:'origin',q:'어디서 출발하세요?',sub:'왕복 교통비와 이동시간을 계산해요.',show:()=>true,
 body:()=>{const t=tripInfo(S);
  return '<div class="opts">'+opt('origin','originType','seoul',S.originType==='seoul','서울·수도권에서 출발',S.city==='seoul'?'서울 안 여행이라 왕복 교통비 없음':'KTX·고속버스·항공 기준 추정')+opt('origin','originType','local',S.originType==='local','도착지 근처에 살아요','왕복 교통비 없음')+opt('origin','originType','other',S.originType==='other','다른 지역에서 출발','교통비·시간을 직접 입력')+'</div>'+'<div style="margin-top:10px"><button class="geob" data-act="originGeo">📍 내 위치로 알아보기</button></div>'+(UI.originMsg?`<p class="hint">${UI.originMsg}</p>`:'')+
  (S.originType==='other'?`<div class="row2" style="margin-top:12px"><div class="fld"><small>1인 왕복 교통비 (원)</small><input type="number" id="ocost" inputmode="numeric" min="0" step="1000" value="${S.otherCost||''}"></div><div class="fld"><small>편도 이동시간 (분)</small><input type="number" id="omin" inputmode="numeric" min="0" step="10" value="${S.otherMin}"></div></div>`:'')+
  (S.originType==='seoul'&&S.city!=='seoul'&&accessOptions(S.city,S).length>1?`<p class="lab" style="margin-top:12px">어떻게 가세요?</p><div class="chips">`+[['auto','추천']].concat(accessOptions(S.city,S).map(o=>[o.k,o.lab])).map(([v,l])=>`<button class="chip${(S.travelBy||'auto')===v?' on':''}" data-act="setr" data-k="travelBy" data-v="${v}" aria-pressed="${(S.travelBy||'auto')===v}">${l}</button>`).join('')+'</div>':'')+(S.originType==='seoul'&&t.how?`<p class="hint">${t.how} 기준 1인 왕복 약 ${man(t.lo)}~${man(t.hi)} · 편도 약 ${hmT(t.min)} (추정, 요금은 날짜·좌석에 따라 달라요)</p>`:'');}},
{id:'time',q:()=>UI.booked?'예약한 기차·항공 시간을 알려주세요':S.type==='day'?'몇 시에 다녀올까요?':'도착·출발 시각을 알려주세요',show:()=>true,
 body:()=>{if(UI.booked){const f=S.type==='day'?[['depStart','가는 기차·버스 출발 시각'],['depart','돌아오는 기차·버스 출발 시각']]:[['arrive','가는 기차·항공 도착 시각'],['depart','돌아오는 기차·항공 출발 시각']];return f.map(([k,l])=>`<div class="fld"><small>${l}</small><input type="time" data-tm="${k}" value="${hm(S[k])}"></div>`).join('')+'<p class="hint">예약한 시간은 그대로 두고, 남은 시간 안에서 일정을 짜요. 마지막 날은 출발 전 여유시간을 자동으로 남겨요.</p>';}
  const a=S.type==='day'?[['depStart','출발 시각',[360,420,480,540,600,720]],['depart','귀가 출발 시각',[900,1020,1080,1200,1320]]]:[['arrive','첫날 도착 시각',[420,540,660,720,900,1080,1260]],['depart','마지막날 출발 시각',[600,720,900,1080,1200,1320]]];
  return a.map(([k,l,vs])=>`<p class="lab" style="margin-top:10px">${l} <b class="tcur">${S[k]!=null?ampm(S[k]):''}</b></p><div class="chips">${vs.map(v=>chip('num',k,v,S[k]===v,ampm(v))).join('')}</div><div class="fld tdir"><small>직접 고르기</small><input type="time" step="600" data-tm="${k}" value="${hm(S[k])}"></div>`).join('')+'<p class="hint">첫날은 도착 후 짐 정리 시간을, 마지막 날은 출발 전 여유시간을 자동으로 남겨요.</p>';}},
{id:'who',q:'누구와 함께 가세요?',auto:1,show:()=>true,
 body:()=>'<div class="opts">'+[['solo','혼자'],['couple','연인·부부'],['kids','어린이 동반'],['parents','부모님 동반'],['group','친구·단체']].map(o=>opt('who','who',o[0],S.who===o[0],o[1])).join('')+'</div>'},
{id:'people',q:'인원을 알려주세요',sub:'시니어는 성인 인원에 포함해서 세어요.',show:()=>!['solo','couple'].includes(S.who),
 body:()=>'<div class="row2">'+stp('adults','성인')+stp('seniors','그중 시니어(65세+)')+'</div>'+stp('kids','어린이')+(S.kids>0?`<p class="lab" style="margin-top:0">어린이 연령</p>${seg('kidAge',[['infant','영유아 (0~5세)'],['elem','초등 (6~12세)']])}`:'')},
{id:'kidx',q:'아이와 함께라면 더 확인할게요',show:()=>S.kids>0,
 body:()=>tog('nap','낮잠 시간이 필요해요 (오후에 휴식을 넣어요)')+tog('kidmeal','어린이 메뉴가 있는 식당 우선')+tog('kidplay','아이 체험·놀이 장소 우선')+'<p class="hint">아이가 있으면 하루 방문 수를 조금 줄이고, 아이가 즐길 만한 곳에 점수를 더 줘요.</p>'},
{id:'wish',q:'꼭 가고 싶은 곳이 있나요?',sub:'카테고리별로 한눈에 보고 눌러서 고르세요. 없으면 건너뛰어도 돼요.',show:()=>true,
 body:()=>wishBody()},
{id:'stay',q:()=>UI.booked?'예약한 호텔은 어느 지역인가요?':'어느 지역에서 묵으실래요?',sub:UI.booked?'가장 가까운 지역을 고르고, 예약한 1박 가격을 입력해 주세요. 그 호텔을 거점으로 동선을 짜요.':'숙소를 바꾸면 이동 동선과 경비가 다시 계산돼요.',show:()=>S.type==='stay',
 body:()=>{const C=cityOf(),x=X(S,true),wa=S.wish.map(id=>C.places.find(p=>p.id===id)).filter(p=>p&&p.cat!=='식당'&&p.cat!=='카페');
  return stayBar()+'<div id="hres">'+stayList()+'</div>'+
   customHotelBlock()+nightsBlock()+`<div class="fld" style="margin-top:12px"><small>객실 1박 가격 (원)</small><input type="number" id="hprice" inputmode="numeric" min="0" step="5000" value="${S.hotelPrice}"></div>`+tog('booked','이미 예약했어요 (입력한 금액을 확정으로 계산)')+
   `<button class="chip" data-act="noStay" style="margin-top:6px">숙박 없음 · 당일여행으로 바꾸기</button>`;}},
{id:'mode',q:'어떻게 이동하세요?',sub:'자가용이 아니면 택시비·대중교통비를 구간마다 계산해요.',auto:1,show:()=>true,
 body:()=>'<div class="opts g2">'+[['transit','대중교통','지하철·버스'],['taxi','택시','편하지만 비용↑'],['mix','대중교통+택시','가까우면 택시, 멀면 지하철'],['car','자가용','유류비·주차비'],['rental','렌터카','대여비 포함'],['walk','도보 중심','가까운 곳 위주']].map(o=>opt('set','mode',o[0],S.mode===o[0],o[1],o[2])).join('')+'</div>'},
{id:'int',q:'어떤 여행을 원하세요?',sub:'여러 개 골라도 돼요.',show:()=>true,
 body:()=>'<div class="chips">'+INTS.map(o=>chip('arr','interests',o[0],S.interests.includes(o[0]),o[1])).join('')+'</div>'+((S.interests.includes('show')||S.interests.includes('festival'))?'<div class="msg">공연·축제는 SHOWDAY 공연 데이터와 연결되면 날짜에 맞게 일정에 넣어드려요. 지금 시안에서는 아직 반영되지 않아요.</div>':'')},
{id:'meal',q:'식사는 어떻게 할까요?',sub:'여러 개 골라도 돼요.',show:()=>true,
 body:()=>'<div class="chips">'+MEALP.map(o=>chip('arr','mealPref',o[0],S.mealPref.includes(o[0]),o[1])).join('')+'</div>'+(S.mealPref.includes('veg')?'<div class="msg">채식 식당은 샘플 데이터에 아직 없어요. 실제 데이터를 연결하면 반영돼요.</div>':'')},
{id:'access',q:'이동 편의를 알려주세요',show:()=>true,
 body:()=>`<p class="lab" style="margin-top:6px">걷는 정도</p>${seg('walkLvl',[['lots','많이 걷기'],['normal','보통'],['less','적게 걷기']])}<div style="margin-top:8px">${tog('stairs','계단·오르막은 피하고 싶어요')}${tog('wheel','휠체어를 사용해요')}${S.kids>0?tog('stroller','유모차를 써요'):''}</div>${S.seniors>0?'<p class="hint">시니어 동반이라 하루 방문 수를 줄이고, 장소마다 휴식 시간을 15분씩 더해요.</p>':''}`},
{id:'budget',q:'예산이 있으세요?',sub:'없으면 건너뛰어도 돼요. 있으면 넘는지 알려드려요.',show:()=>true,optional:1,
 body:()=>`${seg('budgetType',[['total','전체 예산'],['per','1인당 예산']])}<p class="lab">금액</p><div class="chips">${[300000,500000,800000,1000000,1500000].map(v=>chip('num','budget',v,S.budget===v,man(v))).join('')}</div><div class="fld" style="margin-top:12px"><small>직접 입력 (원)</small><input type="number" id="budget" inputmode="numeric" min="0" step="50000" value="${S.budget||''}"></div>${S.type==='stay'?tog('incLodge','숙박비 포함'):''}${tripInfo(S).hi>0?tog('incTravel','출발지 왕복 교통비 포함'):''}`},
{id:'pace',q:'일정은 어느 정도로 채울까요?',auto:1,show:()=>true,
 body:()=>'<div class="opts">'+[['relaxed','여유롭게','하루 2~3곳, 쉬는 시간 넉넉히'],['normal','보통','하루 3~4곳'],['packed','알차게','하루 5곳까지']].map(o=>opt('set','pace',o[0],S.pace===o[0],o[1],o[2])).join('')+'</div>'},
{id:'recpick',q:'이런 곳은 어때요?',sub:'',nobtn:1,show:()=>!!UI.rec,
 body:()=>recBody()},
{id:'confirm',q:'이 조건으로 일정을 만들까요?',sub:'바꾸고 싶은 항목은 수정을 눌러요.',show:()=>true,
 body:()=>{const C=cityOf(),r=[];
  r.push(['type','여행',`${C.name} · ${durText()}${S.date?' · '+dayLabel(S,1)+' 출발':''}`]);
  r.push(['origin','출발',{seoul:'서울·수도권',local:'도착지 근처',other:'다른 지역(입력)'}[S.originType]]);
  r.push(['who','동행',`성인 ${S.adults}${S.seniors?'(시니어 '+S.seniors+')':''}${S.kids?' · 어린이 '+S.kids:''}`]);
  r.push(['wish','필수 방문지',S.wish.length?S.wish.map(id=>(C.places.find(p=>p.id===id)||{}).name).join(', '):'없음 · 추천받기']);
  if(S.type==='stay')r.push(['stay','숙소',(S.hotel==='custom'&&S.customHotel?S.customHotel.name:(C.hotels.find(h=>h.id===S.hotel)||C.hotels[0]).name)+(S.booked?' (예약 확정)':'')]);
  r.push(['mode','이동수단',MLAB[S.mode]]);
  r.push(['int','취향',S.interests.map(k=>INTS.find(i=>i[0]===k)[1]).join('·')||'선택 없음']);
  r.push(['meal','식사',S.mealPref.map(k=>MEALP.find(i=>i[0]===k)[1]).join('·')||'선택 없음']);
  r.push(['access','이동 편의',{lots:'많이 걷기',normal:'보통',less:'적게 걷기'}[S.walkLvl]+(S.stairs?' · 계단 피함':'')+(S.wheel?' · 휠체어':'')+(S.stroller?' · 유모차':'')]);
  r.push(['budget','예산',S.budget?(S.budgetType==='per'?'1인당 ':'전체 ')+man(S.budget):'없음']);
  r.push(['pace','일정 밀도',{relaxed:'여유롭게',normal:'보통',packed:'알차게'}[S.pace]]);
  return '<div class="summ">'+r.map(([id,k,v])=>`<div><span>${k}</span><span class="v">${v}</span><button data-act="jump" data-v="${id}">수정</button></div>`).join('')+'</div>';}}
];
const active=()=>{let ids;
  if(UI.quick)ids=['dest','dur','who'];
  else if(UI.ids)ids=UI.ids;
  else if(UI.rec)ids=['dur','who','people','kidx','int','origin','budget','recpick'];
  else ids=STEPS.filter(s=>!UI.known.has(s.id)).map(s=>s.id);
  let a=ids.map(id=>STEPS.find(s=>s.id===id)).filter(s=>s&&s.show());
  if(UI.wishFirst&&!UI.quick&&!UI.rec){const w=a.find(s=>s.id==='wish');if(w){const de=a.find(s=>s.id==='dest');a=a.filter(s=>s!==w&&s!==de);a.unshift(...(de?[de,w]:[w]));}}
  return a;};
const curStep=()=>STEPS.find(s=>s.id===UI.step)||STEPS[0];

/* 숙소 조건 검색: 이름·가격대·특징·정렬 */
const HTAGS=[['trans','역·교통',/역|터미널|공항|교통|지하철|접근/],['food','먹거리',/먹거리|맛집|시장|카페|음식/],['fam','아이·가족',/아이|가족|체험|워터|테마|키즈/],['calm','조용·온천',/온천|조용|힐링|한적|휴양|리조트/],['view','바다·경치',/바다|해변|해수욕|오션|경치|전망|호수|공원|야경|뷰|항/]];
const HPRICE=[[0,'전체'],[1,'~10만'],[2,'10~15만'],[3,'15만~']];
function hf(){return UI.hf||(UI.hf={p:0,t:'',s:'rec'});}
function stayBar(){const C=cityOf(),f=hf(),chips=(k,arr,cur)=>arr.map(([v,l])=>`<button class="chip${cur===v?' on':''}" data-act="hfset" data-k="${k}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join('');
  const tags=HTAGS.filter(t=>C.hotels.some(h=>t[2].test(h.name+h.note))).map(t=>[t[0],t[1]]);
  const row=(l,h)=>`<div class="rr"><span class="rl">${l}</span><div class="rc wrap">${h}</div></div>`;
  return `<input type="search" id="hsq" class="rsearch" placeholder="숙소·동네 이름으로 찾기" value="${esc(UI.hsq||'')}" autocomplete="off" aria-label="숙소 검색"><div class="rf">`+
   row('가격(1박)',chips('p',HPRICE,f.p))+(tags.length?row('특징',chips('t',[['','전체'],...tags],f.t)):'')+row('정렬',chips('s',[['rec','추천순'],['price','가격 낮은 순'],['near','필수 방문지 가까운 순']],f.s))+`</div>`;}
function stayList(){const C=cityOf(),x=X(S,true),f=hf(),q=(UI.hsq||'').replace(/\s/g,'').toLowerCase(),
  wa=S.wish.map(id=>C.places.find(p=>p.id===id)).filter(p=>p&&p.cat!=='식당'&&p.cat!=='카페'),tg=HTAGS.find(t=>t[0]===f.t);
  let L=C.hotels.map(h=>({h,avg:wa.length?Math.round(wa.reduce((s,p)=>s+legCalc(h,p,'taxi',x,0).min,0)/wa.length):0,d:hav(h,C.hub)}));
  const pass=({h})=>(!q||(h.name+h.note).replace(/\s/g,'').toLowerCase().includes(q))&&(!f.p||(f.p===1?h.price<100000:f.p===2?h.price>=100000&&h.price<150000:h.price>=150000))&&(!tg||tg[2].test(h.name+h.note));
  const all=L.length;L=L.filter(o=>pass(o)||o.h.id===S.hotel);
  if(f.s==='price')L.sort((a,b)=>a.h.price-b.h.price);else if(f.s==='near')L.sort((a,b)=>(wa.length?a.avg-b.avg:a.d-b.d));
  const nHit=L.filter(pass).length,on=f.p||f.t||q||f.s!=='rec';
  return `<div class="rbar"><span class="hint">조건에 맞는 숙소 ${nHit}곳 / 전체 ${all}곳${f.s==='near'&&!wa.length?' · 필수 방문지를 안 골라서 중심가 기준':''}</span>${on?'<button class="lnk" data-act="hfreset">조건 초기화</button>':''}</div>`+
   (nHit?'':'<p class="hint">조건에 맞는 숙소가 없어요. 조건을 줄이거나 아래 "내 숙소 직접 지정"을 써 보세요.</p>')+
   L.map(({h,avg})=>`<button class="opt${S.hotel===h.id?' on':''}" data-act="hotel" data-v="${h.id}" style="margin-bottom:10px"><b>${h.name}</b><small>객실 1박 약 ${won(h.price)} · ${h.note}${avg?` · 필수 방문지까지 평균 택시 약 ${avg}분`:''}</small></button>`+(S.hotel===h.id?hotelChk(h.id):'')).join('');}
function hotelChk(id){const o=(S.hotelInfo||{})[id]||{},ch=(k,v,t)=>`<button class="chip${o[k]===v?' on':''}" data-act="hinfo" data-id="${id}" data-k="${k}" data-v="${v}">${t}</button>`;
  const warn=(o.lift==='n'&&(S.seniors>0||S.stroller||S.wheel))?'<div class="warn" style="margin-top:6px">엘리베이터가 없어요. 어르신·유모차·휠체어와 함께면 불편할 수 있어요.</div>':'';
  return `<div class="hchk" style="margin:-4px 0 12px;padding:8px 10px;border:1px dashed var(--line);border-radius:10px;font-size:14px"><b>예약 전 확인</b> <span class="meta">(전화로 물어보고 눌러 두세요)</span>
<div class="chips" style="margin:6px 0 0"><span class="meta" style="align-self:center">엘리베이터</span>${ch('lift','y','있음')}${ch('lift','n','없음')}<span class="meta" style="align-self:center;margin-left:6px">주차</span>${ch('park','y','가능')}${ch('park','n','불가')}</div>${warn}
<div style="display:flex;gap:6px;margin-top:6px"><input type="tel" id="htel_${id}" placeholder="숙소 전화번호" value="${esc(o.tel||'')}" inputmode="tel" style="flex:1" autocomplete="off">${o.tel?`<a class="chip" href="tel:${esc(o.tel.replace(/[^0-9+]/g,''))}">📞 전화</a>`:''}</div></div>`;}
function nightPick(k){const C=cityOf(),cur=(S.nightHotel||{})[k],nm=cur?cur.name:(k>1?'전날과 같음':'기본 숙소');
  return `<div class="nh" style="border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:8px"><b>${k}일차 밤 숙소</b> <span class="meta">${esc(nm)}</span><div class="chips" style="margin:6px 0">${k>1?`<button class="chip${cur?'':' on'}" data-act="dhSame" data-n="${k}">전날과 같게</button>`:''}${C.hotels.map(h=>`<button class="chip${cur&&cur.id===h.id?' on':''}" data-act="dhPick" data-n="${k}" data-v="${h.id}">${esc(h.name)}</button>`).join('')}</div>
<details><summary class="meta">지도 앱에서 위치 붙여넣기</summary><div class="chips" style="margin:6px 0"><a class="chip" href="https://map.kakao.com/" target="_blank" rel="noopener">카카오맵</a><a class="chip" href="https://map.naver.com/" target="_blank" rel="noopener">네이버지도</a><a class="chip" href="https://maps.google.com/" target="_blank" rel="noopener">구글지도</a></div><input type="text" id="dhn${k}" placeholder="숙소 이름 (선택)" autocomplete="off" style="margin-bottom:6px"><input type="text" id="dhp${k}" placeholder="링크 또는 좌표 붙여넣기" autocomplete="off"><button class="chip" data-act="dhPaste" data-n="${k}" style="width:100%;margin-top:6px">이 위치로 지정</button><button class="chip" data-act="mapFind" data-src="dhn${k},dhp${k}" style="width:100%;margin-top:6px">🔎 입력한 주소·상호를 카카오맵에서 찾기</button></details></div>`;}
function nightsBlock(){if(S.nights<2)return '';let h='';for(let k=2;k<=S.nights;k++)h+=nightPick(k);
  return `<div class="sec" style="margin-top:14px"><h2 style="font-size:16px">밤마다 다른 숙소를 쓰시나요?</h2><p class="meta" style="margin:0 0 4px">위에서 고른 숙소가 1일차 밤이에요. 다른 날 밤만 따로 바꿀 수 있어요. 안 바꾸면 전날과 같아요.</p>${h}</div>`;}
function matchPl(t){const C=cityOf(),n=t.replace(/[\s·()\-]/g,'');if(!n)return null;const L=[...C.hotels,...C.places.filter(p=>p.cat!=='식당'&&p.cat!=='카페')];const core=n.replace(/(앞|근처|입구|옆|에서|출발|주차장|으로|에)+$/,'');return L.find(p=>{const q=p.name.replace(/[\s·()\-]/g,'');return q.length>=3&&n.includes(q);})||(core.length>=3?L.find(p=>p.name.replace(/[\s·()\-]/g,'').includes(core)):null)||null;}
function setNH(k,o,msg){const f=()=>{const m={...(S.nightHotel||{})};if(o)m[k]=o;else delete m[k];S.nightHotel=m;};if(UI.view==='result')commit(f,msg);else{f();render(true);toast(msg);}}
function stRow(d){const e=d.ev.find(z=>z.kind==='start'||z.kind==='arrive'),o=(S.startAt||{})[d.n];if(!e||!e.p)return '';
  return `<div class="stline"><span>📍 출발 위치: <b style="color:var(--ink)">${esc(o?(o.name||'현재 위치'):e.p.name)}</b></span><button class="eb" data-act="stSheet" data-v="${d.n}">바꾸기</button></div>`;}
function setSt(n,o,msg){const f=()=>{const m={...(S.startAt||{})};if(o)m[n]=o;else delete m[n];S.startAt=m;};if(UI.view==='result')commit(f,msg);else{f();render(true);toast(msg);}}
function dhRow(d,P_){if(P_.x.dayTrip||d.n>P_.N)return stRow(d);const e=d.ev.find(z=>z.kind==='hotel');return stRow(d)+`<div class="day-sub"><span>🏨 이 날 밤 숙소: <b style="color:var(--ink)">${esc(e&&e.p?e.p.name:'')}</b></span><button class="eb" data-act="dhSheet" data-v="${d.n}">바꾸기</button></div>`;}
function customHotelBlock(){const C=cityOf(),ch=S.customHotel,on=S.hotel==='custom'&&ch;
  const near=C.places.filter(p=>p.cat!=='식당'&&p.cat!=='카페');
  return `<div class="sec" style="border:1px solid ${on?'var(--accent)':'var(--line)'};border-radius:12px;padding:12px;margin-top:4px;background:${on?'var(--accent-soft)':'var(--surface)'}"><h2 style="font-size:16px">내 숙소 위치 직접 지정</h2>
<div class="fld"><small>숙소 이름 (선택)</small><input type="search" id="hname" placeholder="예: ○○호텔" value="${esc(ch?ch.name:(UI.hname||''))}" autocomplete="off"></div>
<button class="chip" data-act="geoHotel" style="width:100%;margin-bottom:8px">📍 지금 있는 곳을 숙소로 지정</button>
<div class="fld" style="margin-bottom:8px"><small>위치가 안 잡히면: 지도 앱에서 확인 → 붙여넣기</small>
<div class="chips" style="margin:6px 0"><a class="chip" href="https://map.kakao.com/" target="_blank" rel="noopener">카카오맵 열기</a><a class="chip" href="https://map.naver.com/" target="_blank" rel="noopener">네이버지도 열기</a><a class="chip" href="https://maps.google.com/" target="_blank" rel="noopener">구글지도 열기</a></div>
<p class="meta" style="margin:0 0 6px;font-size:13px">지도 앱에서 내 위치(또는 숙소)를 찾고 '공유'로 링크나 좌표를 복사해 아래에 붙여넣으세요.</p>
<input type="text" id="hpaste" placeholder="링크 또는 좌표 붙여넣기 (예: 35.8340, 129.2190)" value="${esc(UI.hpaste||'')}" autocomplete="off"><button class="chip" data-act="hotelPaste" style="width:100%;margin-top:6px">이 위치를 숙소로 지정</button><button class="chip" data-act="mapFind" data-src="hname,hpaste" style="width:100%;margin-top:6px">🔎 입력한 주소·상호를 카카오맵에서 찾기</button></div>
<div class="fld" style="margin-bottom:6px"><small>또는 숙소와 가까운 장소 고르기</small><select id="hnear" aria-label="숙소와 가까운 장소"><option value="">가까운 장소를 골라 주세요</option>${near.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></div>
${on?`<div class="msg good" style="margin-top:8px">내 숙소: <b>${esc(ch.name||'내 숙소')}</b> · ${esc(ch.src||'')}<br><button class="lnk" data-act="hotelClear" style="padding:0">지정 해제</button></div>${hotelChk('custom')}`:'<p class="hint">위치를 정하면 그 숙소를 거점으로 거리·택시비를 다시 계산해요. 정확한 주소 검색은 지도 연동 후 가능해요.</p>'}</div>`;}
function setCustomHotel(lat,lng,src){const nm=($('#hname')&&$('#hname').value.trim())||UI.hname||'';S.customHotel={name:nm||'내 숙소',lat,lng,src};S.hotel='custom';render(true);}
const WG=[['top','유명 명소',['명소']],['nature','자연·산책',['자연']],['culture','전시·문화',['박물관','문화']],['play','체험·놀이',['체험']],['shop','시장·거리·쇼핑',['시장','거리','쇼핑']],['eat','식당',['식당']],['cafe','카페',['카페']]];
function wishItems(){const x=X(S,true),C=cityOf();return C.places.map(p=>{const lg=legCalc(x.H,p,'taxi',x,parkOf(p));return{p,lg,d:hav(x.H,p),eat:p.cat==='식당'||p.cat==='카페'};}).sort((a,b)=>a.d-b.d);}
const wprice=(p,eat)=>eat?'1인 약 '+won(p.fa):(p.fa||p.fc?'어른 '+won(p.fa):'무료');
function wishBody(){return `<input type="search" id="wq" placeholder="장소·식당 이름 검색" value="${esc(UI.wq)}" aria-label="장소 검색" autocomplete="off"><div id="wsel"></div><div class="chips" id="wcat" style="margin-top:10px"></div><div id="wlist"></div>`;}
function wishRefresh(){const items=wishItems(),q=UI.wq.trim(),C=cityOf();
  const sel=S.wish.map(id=>C.places.find(p=>p.id===id)).filter(Boolean);
  $('#wsel').innerHTML=sel.length?`<div class="msg" style="margin-top:10px"><b>고른 곳 ${sel.length}곳</b> · 일정에 꼭 넣어요<div class="chips" style="margin-top:8px">${sel.map(p=>`<button class="chip on" data-act="wish" data-v="${p.id}" aria-label="${esc(p.name)} 빼기">${esc(p.name)} ✕</button>`).join('')}</div></div>`:'';
  const cnt=g=>items.filter(o=>g[2].includes(o.p.cat)).length;
  $('#wcat').innerHTML=chip('wcat','k','all',UI.wc==='all',`전체`)+WG.filter(g=>cnt(g)).map(g=>chip('wcat','k',g[0],UI.wc===g[0],`${g[1]} ${cnt(g)}`)).join('');
  const card=o=>{const{p,lg,eat}=o,on=S.wish.includes(p.id);return `<button class="wc${on?' on':''}" data-act="wish" data-v="${p.id}" aria-pressed="${on}"><b>${on?'✓ ':''}${esc(p.name)}${smp(p)}</b><small>${wprice(p,eat)}</small><small>택시 약 ${lg.alts.taxi.min}분${eat?'':' · '+p.dur+'분 체류'}</small></button>`;};
  const row=o=>{const{p,lg,eat}=o,on=S.wish.includes(p.id),w=lg.alts.walk;return `<button class="place${on?' on':''}" data-act="wish" data-v="${p.id}" aria-pressed="${on}"><span class="ck">✓</span><span class="bd"><b>${esc(p.name)}${smp(p)}<span class="tag">${p.cat}</span></b><span class="meta">${eat?'':'체류 약 '+p.dur+'분 · '}${wprice(p,eat)}${p.note?' · '+esc(p.note):''}</span><span class="dist"><span>${C.hub.name.replace(' (도착 거점)','')}에서 택시 <b>약 ${lg.alts.taxi.min}분 · ${won(lg.alts.taxi.cost)}</b></span><span>도보 <b>${w.min}분</b>${w.ok?'':' (멀어요)'}</span></span></span></button>`;};
  let h='';
  if(q){const L=items.filter(o=>o.p.name.includes(q)||o.p.cat.includes(q)||(o.p.note||'').includes(q));h=L.length?L.map(row).join(''):'<p class="hint">검색 결과가 없어요.</p>';}
  else if(UI.wc!=='all'){const g=WG.find(g=>g[0]===UI.wc);h=items.filter(o=>g[2].includes(o.p.cat)).map(row).join('');}
  else h=WG.map(g=>{const L=items.filter(o=>g[2].includes(o.p.cat));return L.length?`<div class="gh"><b>${g[1]} <span class="meta">${L.length}곳</span></b><button class="lnk" data-act="wcat" data-v="${g[0]}">전체 보기</button></div><div class="hrow">${L.map(card).join('')}</div>`:'';}).join('');
  $('#wlist').innerHTML=h;}
/* 지도 개략도 */
function mapSvg(day){
  const pts=day.ev.map((e,i)=>({e,i})).filter(o=>o.e.p);
  const uniq=[];pts.forEach(o=>{const k=o.e.p.lat+','+o.e.p.lng;if(!uniq.find(u=>u.k===k))uniq.push({k,o});});
  if(uniq.length<2)return '<p class="hint" style="padding:12px">지도에 표시할 장소가 없어요.</p>';
  const exn=(UI.travel&&UI.nearOn&&UI._near)?UI._near.map(o=>o.p):[],lats=[...pts.map(o=>o.e.p.lat),...exn.map(p=>p.lat)],lngs=[...pts.map(o=>o.e.p.lng),...exn.map(p=>p.lng)],mid=(Math.min(...lats)+Math.max(...lats))/2,kx=Math.cos(mid*Math.PI/180);
  const minx=Math.min(...lngs)*kx,maxx=Math.max(...lngs)*kx,miny=Math.min(...lats),maxy=Math.max(...lats);
  const W=340,Hh=300,pad=34,sc=Math.min((W-2*pad)/Math.max(1e-6,maxx-minx),(Hh-2*pad)/Math.max(1e-6,maxy-miny));
  const ox=pad+((W-2*pad)-(maxx-minx)*sc)/2,oy=pad+((Hh-2*pad)-(maxy-miny)*sc)/2;
  const px=p=>ox+(p.lng*kx-minx)*sc,py=p=>oy+(maxy-p.lat)*sc;
  const path=pts.map(o=>px(o.e.p).toFixed(1)+','+py(o.e.p).toFixed(1)).join(' ');
  let n=0;const marks=[];const seen={};const vpts=pts.filter(o=>['place','meal','cafe'].includes(o.e.kind)).map(o=>[px(o.e.p),py(o.e.p)]);
  pts.forEach(o=>{const e=o.e,k=e.p.lat+','+e.p.lng,vis=['place','meal','cafe'].includes(e.kind);
    if(vis){n++;marks.push(`<g class="mk${e.kind==='place'?'':' m3'}${UI.sel===o.i?' on':''}" data-act="pick" data-v="${o.i}"><circle cx="${px(e.p).toFixed(1)}" cy="${py(e.p).toFixed(1)}" r="13"/><text x="${px(e.p).toFixed(1)}" y="${py(e.p).toFixed(1)}">${n}</text></g>`);}
    else if(!seen[k]){seen[k]=1;let hx=px(e.p),hy=py(e.p);if(vpts.some(v=>Math.abs(v[0]-hx)<26&&Math.abs(v[1]-hy)<26)){hx=Math.max(16,hx-24);hy=Math.max(16,hy-24);}marks.push(`<g class="mk m2${UI.sel===o.i?' on':''}" data-act="pick" data-v="${o.i}"><rect x="${(hx-13).toFixed(1)}" y="${(hy-13).toFixed(1)}" width="26" height="26" rx="6"/><text x="${hx.toFixed(1)}" y="${hy.toFixed(1)}">${S.type==='day'?'역':'숙'}</text></g>`);}});
  exn.forEach((p,i)=>marks.push(`<g class="mk nr" data-act="nearPick" data-v="${p.id}"><circle cx="${px(p).toFixed(1)}" cy="${py(p).toFixed(1)}" r="11"/><text x="${px(p).toFixed(1)}" y="${py(p).toFixed(1)}">${'가나다'[i]}</text></g>`));
  if(UI.geo&&UI.geo.lat!=null&&UI.travel){let gx=px(UI.geo),gy=py(UI.geo);const out=gx<10||gx>W-10||gy<10||gy>Hh-10;gx=Math.min(W-10,Math.max(10,gx));gy=Math.min(Hh-10,Math.max(10,gy));marks.push(`<g class="me"><circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="${out?6:9}"/></g>`);}
  const pxKm=sc/111.2;const nice=[0.5,1,2,5,10,20,50].find(k=>k*pxKm>=40)||50;const bw=nice*pxKm;
  return `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="하루 이동 경로 개략도"><polyline class="ln" points="${path}"/>${marks.join('')}<g class="sc"><line x1="14" y1="${Hh-14}" x2="${14+bw}" y2="${Hh-14}"/><text x="${14+bw/2}" y="${Hh-20}">${nice}km</text></g></svg>`;}
function legendHtml(day){let n=0;return '<ol class="legend">'+day.ev.map((e,i)=>{if(!['place','meal','cafe'].includes(e.kind))return '';n++;return `<li class="${UI.sel===i?'on':''}"><span class="n${e.kind==='place'?'':' m3'}">${n}</span><span><button class="lnk" data-act="pick" data-v="${i}" style="color:var(--ink);text-align:left;font-size:14px">${hm(e.t0)} ${e.title}</button></span></li>`;}).join('')+'</ol>';}

const smp=p=>(p&&(p.cat==='식당'||p.cat==='카페'))?'<span class="smp">샘플</span>':'';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function legHtml(lg,tv){const a=lg.alts,u=lg.use,lab=u==='car'?MLAB[S.mode==='rental'?'rental':'car']:MLAB[u];
  const al=['walk','transit','taxi','car'].map(m=>`<span class="${m===u?'u':''}">${m==='car'?(S.mode==='rental'?'렌터카':'자가용'):MLAB[m]} ${m==='walk'?'':lg.km+'km · '}${lg.fixed&&m==='taxi'?lg.min:a[m].min}분${a[m].cost?' · '+won(lg.fixed&&m==='taxi'?lg.cost:a[m].cost)+(m==='transit'||m==='taxi'?' ('+a[m].detail+')':''):''}${m==='walk'&&!a.walk.ok?'(멀어요)':''}</span>`).join('');
  const dt=lg.fixed?`<br><b>${S.adults+S.kids}명 합계</b> · 택시 1대 기준 (카카오맵 값)`:((u==='transit'||u==='taxi')&&lg.alts[u].detail?`<br><b>${S.adults+S.kids}명 합계</b> · ${lg.alts[u].detail}`:'');
  return `<div class="leg${tv?' tv':''}"><span class="m">${lab}</span>약 ${lg.km}km · 약 ${lg.min}분 · ${legCost(lg)}${dt}${lg.note?'<br>'+lg.note:''}<details><summary>버스·택시 인원별 비용 비교</summary><div class="alts">${al}</div></details></div>`;}function insHtml(e,i){if(UI.edit||!['arrive','start','place','meal','cafe'].includes(e.kind))return '';return `<li class="ins"><button class="insb" data-act="addAt" data-v="${i}">＋ 여기에 일정 추가</button></li>`;}
function evHtml(e,i){
  const leg=e.leg?legHtml(e.leg,UI.travel):'',tl=e.p&&e.p.tags&&e.p.tags.includes('pub')?'가볍게 한잔':{place:'가볼 곳',meal:'식사',cafe:'카페'}[e.kind];let meta='';
  const id=e.p&&e.p.id,eb=(op,t,al)=>`<button class="eb" data-act="ed" data-k="${op}" data-v="${id}" aria-label="${al}">${t}</button>`;
  if(e.kind==='place')meta=`체류 약 ${e.dur}분 · ${e.cost?'입장료 합계 약 '+won(e.cost):'입장 무료'}${e.p.note?' · '+e.p.note:''}`;
  else if(e.kind==='meal'||e.kind==='cafe')meta=`약 ${e.dur}분 · 식비 합계 약 ${won(e.cost)}${e.p.note?' · '+e.p.note:''}`;
  else if(e.note)meta=e.note;
  const link=(e.p&&['place','meal','cafe'].includes(e.kind))?` <a href="${mapUrl(e.p)}" target="_blank" rel="noopener">길찾기·지도</a>`:'';
  const req=(e.p&&S.wish.includes(id)&&['place','meal','cafe'].includes(e.kind))?'<span class="tag req">내가 고른 곳</span>':'';
  let ctl='';
  if(!UI.edit&&e.kind==='place')ctl=`<div class="ed"><button class="eb" data-act="item" data-v="${i}">수정</button></div>`;
  else if(UI.edit&&e.kind==='place')ctl=`<div class="ed">${eb('up','↑ 위로','위로 옮기기')}${eb('dn','↓ 아래로','아래로 옮기기')}${PLAN.D>1?eb('day','다른 날로','다른 날로 옮기기'):''}<button class="eb" data-act="repSheet" data-v="${id}">바꾸기</button>${eb('del','빼기','일정에서 빼기')}</div>`;
  else if(e.ex)ctl=`<div class="ed"><button class="eb" data-act="exDel" data-v="${e.ex}">일정에서 빼기</button></div>`;
  else if((e.kind==='meal'||e.kind==='cafe')&&e.slot)ctl=`<div class="ed"><button class="eb" data-act="eatSheet" data-v="${e.slot}">${e.kind==='meal'?'다른 식당 찾기':'다른 카페 찾기'}</button>${(S.eatPick||{})[e.slot]?'<span class="meta" style="align-self:center">내가 바꾼 곳</span>':''}</div>`;
  const evl=(e.kind==='place'&&e.p)?evNear(e.p).slice(0,2).map(v=>`<div class="evline">🎪 <b>${esc(v.title)}</b> <span class="tag" style="display:inline-block">${v.kind}</span> ${esc(v.when)} <span class="smp">샘플</span></div>`).join(''):'';
  const warn=e.late?'<div class="warn">예정 시간을 넘겨요. 다른 날로 옮기거나 빼는 걸 고려해 보세요.</div>':'';
  return `<li class="ev k-${e.kind}${UI.sel===i?' sel':''}${CHK[ckey(UI.day,e)]?' done':''}${UI.travel&&UI._cur===i?' now':''}" id="ev${i}">${leg}<div class="main"><time>${hm(e.t0)}</time><div class="card"><div class="ttl">${e.title}${e.p?smp(e.p):''}${UI.travel&&UI._cur===i?'<span class="tag now">지금</span>':UI.travel&&UI._nx===i?'<span class="tag nx">다음</span>':''}${e.kind==='place'&&e.p?(e.p.indoor?'<span class="tag in">실내</span>':e.p.easy?'<span class="tag in">걷기 편해요</span>':''):''}${tl?`<span class="tag">${tl}</span>`:''}${e.kind==='place'&&e.p&&evNear(e.p).length?`<button class="tag evb" data-act="goEv">🎪 근처 행사 ${evNear(e.p).length}건</button>`:''}${e.ex?'<span class="tag" style="background:var(--c3);color:#fff">추가</span>':''}${req}</div><div class="meta">${meta}${link}</div>${evl}${warn}${ctl}</div></div></li>`;}

const w100=n=>won(r100(n));
function capMsg(P_){const S_=P_.S;if(!S_.budget)return '';const t=P_.cmpT(P_.T.total),lo=P_.cmpT(P_.T.lo),hi=P_.cmpT(P_.T.hi),cap=P_.cap;
  const inc=[S_.type==='stay'&&S_.incLodge?'숙박비':'',tripInfo(S_).hi>0&&S_.incTravel?'왕복 교통비':''].filter(Boolean).join('·');
  const base=`예산 ${man(cap)}${inc?' (현지 경비 + '+inc+')':' (현지 경비만)'} 기준 `;
  if(hi<=cap)return `<div class="msg good">${base}여유가 있어요. 추정 상한까지 써도 약 ${w100(cap-hi)} 남아요.</div>`;
  if(lo>cap)return `<div class="msg bad">${base}최소 추정액도 약 ${w100(lo-cap)} 넘어요. 비용 탭의 절약 대안을 확인해 보세요.</div>`;
  return `<div class="msg">${base}중간 추정은 ${t<=cap?'약 '+w100(cap-t)+' 남지만':'약 '+w100(t-cap)+' 넘고'} 상한 추정은 약 ${w100(hi-cap)} 넘을 수 있어요.</div>`;}
const TOURS=[
 {n:'세계유산투어',t:'매일 09:30~18:00',dow:[0,1,2,3,4,5,6],st:'태종무열왕릉 · 대릉원(천마총) · 분황사 · 석굴암 · 불국사',fill:['g1','g6','g5'],c:'#3a9a6a'},
 {n:'신라역사투어',t:'수·금 09:00~18:00',dow:[3,5],st:'김유신장군묘 · 국립경주박물관 · 황룡사역사문화관 · 불국사 · 경주엑스포',fill:['g7','g5'],c:'#c0392b'},
 {n:'양동마을·남산투어',t:'월 09:30~18:00',dow:[1],st:'양동마을 · 전통시장 · 포석정 · 삼불사·삼릉 · 석조여래좌상 · 경애왕릉',c:'#e08a1e'},
 {n:'동해안투어',t:'화·목·토·일 09:10~18:00',dow:[2,4,6,0],st:'경주전통명주전시관 · 감은사지 · 문무대왕릉 · 양남주상절리 · 골굴사 · 원성왕릉',c:'#3b6fb6'},
 {n:'경주야경투어',t:'매일 18:30~22:00',dow:[0,1,2,3,4,5,6],st:'동궁과 월지 · 첨성대 · 계림 · 교촌마을 · 월정교',c:'#8e44ad',night:1}];
function tourSec(){if(S.city!=='gyeongju')return '';
  let dw=null;if(S.date){const[y,m,dd]=S.date.split('-').map(Number);dw=new Date(y,m-1,dd+UI.day-1).getDay();}
  return `<div class="sec"><h2>시티투어로 하루 보내기</h2><p class="meta">문화해설사와 함께 다니는 경주시 지정 시티투어예요. 운전·주차 부담이 없어요. 요금은 안내판에 없어서 예약 때 확인해 주세요.</p>
  ${TOURS.map((t,i)=>{const ok=dw==null?null:t.dow.includes(dw);return `<div class="tour"><b style="color:${t.c}">${t.n}</b> <span class="tag${ok===false?'':' in'}">${ok==null?t.t:ok?'이 날 운행':'이 날은 운행 안 해요'}</span><div class="meta">${t.t}<br>${t.st}</div>${t.fill&&!t.night?`<button class="lnk" data-act="tourFill" data-v="${i}">${UI.day}일차를 이 코스 장소로 채우기</button>`:''}</div>`;}).join('')}
  <p class="meta">예약·문의 <a href="tel:0547436001">054-743-6001</a> · <a href="https://cmtour.co.kr" target="_blank" rel="noopener">cmtour.co.kr</a><br>현장 안내판 기준이라 운행 요일·시간이 바뀔 수 있어요. 투어 자체를 예약하는 게 아니라 같은 장소를 개별로 다니는 일정으로 채워요.</p></div>`;}
/*EVENTS_START — 근처 행사 (시제품 샘플. 나중에 SHOWDAY 공연 데이터·TourAPI 행사정보로 교체) */
const EVT_SAMPLE={seoul:[['s1','야외 버스킹 공연','공연','주말 오후 3시'],['s7','가을 피크닉 마켓','축제','토·일 11:00~18:00']],
 busan:[['b1','해변 야외 공연','공연','금·토 저녁 7시'],['b3','골목 아트 전시','전시','매일 10:00~18:00']],
 jeju:[['j1','지역 농산물 장터','축제','주말 10:00~17:00'],['j2','소규모 음악회','공연','토 오후 4시']],
 gangneung:[['g1','호수 산책로 야외 음악회','공연','토 오후 5시'],['g3','전통 체험 행사','체험','주말 10:00~16:00']],
 jeonju:[['t1','한옥마을 전통 공연','공연','주말 오후 2시'],['t5','야시장','축제','금·토 18:00~22:00']],
 suwon:[['w1','성곽길 걷기 행사','체험','일 오전 10시'],['w2','행궁 전통 공연','공연','토·일 오후 2시']],
 daegu:[['d2','거리 버스킹','공연','주말 저녁 6시'],['d3','야시장','축제','매일 18:00~23:00']],
 gyeongju:[['g3','월지 야간 공연','공연','주말 저녁 7시'],['g1','신라 문화 체험','체험','주말 10:00~17:00']],
 yeosu:[['y1','해상 야경 음악 공연','공연','토 저녁 7시'],['y5','포차거리 푸드 행사','축제','금·토 18:00~']],
 sokcho:[['k1','해변 야외 영화제','공연','토 저녁 7시'],['k2','시장 먹거리 행사','축제','주말 11:00~18:00']]};
function cityEvents(){const C=cityOf(),L=EVT_SAMPLE[S.city]||[];return L.map(([pid,t,k,w],i)=>{const b=C.places.find(p=>p.id===pid)||C.places[0];return{id:'ev'+i,title:t,kind:k,when:w,name:t,lat:b.lat+0.0012,lng:b.lng+0.0010,near:b.name};});}
function evNear(p){return cityEvents().filter(e=>hav(p,e)<=1.5);}
function evtSec(d){const E=cityEvents(),pts=d.ev.filter(e=>e.p&&e.p.lat!=null).map(e=>e.p);if(!E.length)return '';
  const L=E.map(e=>({e,km:pts.length?Math.min(...pts.map(p=>hav(p,e))):0})).sort((a,b)=>a.km-b.km);
  return `<div class="sec" id="evsec"><h2>근처 행사 소식 <span class="smp">샘플</span></h2><p class="meta">${UI.day}일차 일정 장소 근처 행사예요. 지금은 예시이고, SHOWDAY 공연·행사 데이터가 연결되면 실제 소식으로 바뀌어요.</p>
  ${L.map(({e,km})=>`<div class="evcard"><div><b>${e.title}</b> <span class="tag">${e.kind}</span></div><div class="meta">${e.when} · ${e.near} 근처 · 일정 장소에서 약 ${Math.round(km*10)/10}km</div><a href="${mapUrl(e)}" target="_blank" rel="noopener">카카오맵에서 보기</a></div>`).join('')}
  <p class="meta">행사는 날짜·시간이 바뀌거나 취소될 수 있어요. 방문 전 공식 안내를 확인해 주세요.</p></div>`;}
