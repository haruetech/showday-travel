/* 숙소·캠핑 찾기 (시제품: 지역·유형별 샘플 데이터. 실제 숙소는 TourAPI·고캠핑 연동 후 교체)
   flags: c 취사 · d 반려동물 · p 주차 · e 엘리베이터·무장애 · k 아이 동반 */
const STAY_TYPES=[['hanok','🏯','한옥스테이','전통 한옥에서 머무는 숙박. 조용하고 사진이 잘 나와요.'],['pension','🏡','펜션·풀빌라','취사와 모임에 편해요. 가족·친구 여행에 많이 써요.'],['resort','🏨','리조트·콘도','객실 안 취사와 부대시설이 있어요. 아이 동반·여러 박에 가성비가 좋아요.'],['glamp','⛺','글램핑·카라반','장비 없이 캠핑 느낌을 내요. 시설이 갖춰져 있어요.'],['camp','🏕️','오토캠핑·차박','자가용이 있을 때. 장비가 필요하고 비용이 가장 적어요.'],['forest','🌲','자연휴양림','숲속의 집. 값이 싸고 조용하지만 예약 경쟁이 있어요.'],['temple','🛕','템플스테이','사찰에서 쉬고 명상해요. 조용한 쉼을 원하는 분께.'],['farm','🌾','농촌체험 민박','시골 민박과 체험. 아이·부모님 동반에 좋아요.'],['guest','🛏️','게스트하우스','1인·알뜰 여행. 공용 공간이 있어요.'],['hotel','🏙️','호텔·모텔','기본형. 교통이 편하고 이동이 잦을 때.']];
const STAY_FLAGS=[['c','취사'],['d','반려동물'],['p','주차'],['e','엘리베이터·무장애'],['k','아이 동반'],['n','장비 없이'],['f','낚시 가까움']];
const FLAGS_BY={stay:['c','d','p','e','k'],camp:['n','d','p','k']};
const STAY_PRICE=[[0,'전체'],[1,'~5만'],[2,'5~10만'],[3,'10~15만'],[4,'15만~']];
/* [도시, 유형, 이름(샘플), 1박 가격(2인), flags] */
const STAYS=[
['seoul','hanok','북촌 한옥스테이',160000,'k'],['seoul','hotel','명동·시청 인근 호텔',130000,'pe'],['seoul','guest','홍대 게스트하우스',45000,''],['seoul','temple','도심 사찰 템플스테이(체험형)',50000,''],
['suwon','hotel','수원화성 인근 호텔',90000,'pek'],['suwon','hotel','수원역 인근 비즈니스호텔',80000,'pe'],['suwon','guest','행궁동 게스트하우스',50000,''],
['incheon','hotel','차이나타운 인근 호텔',85000,'pe'],['incheon','hotel','송도 센트럴파크 호텔',150000,'pek'],['incheon','pension','영종도 바다 펜션',130000,'cdpk'],['incheon','camp','을왕리 인근 오토캠핑장',40000,'dp'],
['chuncheon','pension','의암호 인근 펜션',120000,'cdpk'],['chuncheon','glamp','소양강 글램핑',140000,'cpk'],['chuncheon','camp','북한강변 오토캠핑장',35000,'dp'],['chuncheon','forest','인근 자연휴양림 숲속의집',70000,'cpk'],['chuncheon','hotel','춘천역 인근 호텔',80000,'pe'],
['gangneung','hotel','경포 해변 호텔',160000,'pek'],['gangneung','resort','정동진 리조트',190000,'cpek'],['gangneung','pension','주문진 바다 펜션',150000,'cdpk'],['gangneung','camp','해변 오토캠핑장',40000,'dp'],['gangneung','guest','강릉역 게스트하우스',45000,''],['gangneung','forest','대관령 자연휴양림',80000,'cpk'],
['sokcho','resort','설악산 콘도',140000,'cpek'],['sokcho','hotel','속초해변 호텔',150000,'pek'],['sokcho','pension','영랑호 펜션',130000,'cdpk'],['sokcho','camp','청초호 인근 캠핑장',40000,'dp'],['sokcho','forest','설악산 인근 휴양림',75000,'cpk'],
['taean','pension','안면도 바다 펜션',140000,'cdpk'],['taean','glamp','태안 해변 글램핑',150000,'cdpk'],['taean','camp','안면도 오토캠핑장',40000,'dp'],['taean','forest','안면도 자연휴양림',75000,'cpk'],['taean','resort','안면도 리조트',170000,'cpek'],
['daejeon','hotel','유성온천 호텔',110000,'pek'],['daejeon','hotel','대전역 인근 호텔',80000,'pe'],['daejeon','forest','장태산 인근 휴양림',70000,'cpk'],['daejeon','guest','은행동 게스트하우스',40000,''],
['buyeo','hanok','부여 한옥 체험숙소',90000,'dpk'],['buyeo','farm','백마강 농촌체험 민박',70000,'cdpk'],['buyeo','temple','인근 사찰 템플스테이',50000,''],['buyeo','hotel','부여 읍내 호텔',70000,'p'],
['jeonju','hanok','한옥마을 한옥스테이',130000,'k'],['jeonju','hanok','한옥마을 인근 한옥(주차 가능)',110000,'pk'],['jeonju','hotel','전주역 인근 호텔',85000,'pe'],['jeonju','guest','객리단길 게스트하우스',40000,''],['jeonju','farm','근교 농촌체험 민박',70000,'cdpk'],
['gwangju','hotel','상무지구 호텔',95000,'pek'],['gwangju','hotel','송정역 인근 호텔',85000,'pe'],['gwangju','guest','동명동 게스트하우스',40000,''],['gwangju','forest','무등산 인근 휴양림',70000,'cpk'],
['mokpo','hotel','목포역·평화광장 호텔',85000,'pe'],['mokpo','guest','근대역사거리 게스트하우스',40000,''],['mokpo','pension','유달산 인근 펜션',100000,'cdp'],
['suncheon','hanok','낙안읍성 한옥민박',80000,'dpk'],['suncheon','temple','사찰 템플스테이',50000,''],['suncheon','farm','순천만 농촌체험 민박',70000,'cdpk'],['suncheon','pension','순천만 펜션',110000,'cdpk'],['suncheon','hotel','순천역 인근 호텔',80000,'pe'],['suncheon','camp','순천만 인근 캠핑장',35000,'dp'],
['yeosu','resort','여수 바다 리조트',200000,'cpek'],['yeosu','hotel','이순신광장 인근 호텔',140000,'pek'],['yeosu','pension','돌산 바다 펜션',150000,'cdpk'],['yeosu','guest','해양공원 게스트하우스',50000,''],['yeosu','glamp','돌산 글램핑',130000,'cpk'],
['tongyeong','hotel','통영항 인근 호텔',110000,'pek'],['tongyeong','pension','바다 전망 펜션',140000,'cdpk'],['tongyeong','guest','동피랑 게스트하우스',45000,''],['tongyeong','camp','한려해상 인근 캠핑장',40000,'dp'],['tongyeong','resort','통영 리조트',180000,'cpek'],
['busan','hotel','해운대 호텔',170000,'pek'],['busan','hotel','서면·부산역 호텔',100000,'pe'],['busan','guest','광안리 게스트하우스',45000,''],['busan','resort','기장 오션 리조트',200000,'cpek'],['busan','temple','범어사 템플스테이',50000,''],['busan','camp','기장 오토캠핑장',40000,'dp'],
['ulsan','hotel','삼산 호텔',90000,'pek'],['ulsan','resort','간절곶 인근 리조트',150000,'cpek'],['ulsan','camp','대왕암 인근 캠핑장',35000,'dp'],['ulsan','pension','울주 펜션',100000,'cdpk'],
['pohang','hotel','영일대 해변 호텔',110000,'pek'],['pohang','guest','포항 게스트하우스',40000,''],['pohang','pension','호미곶 펜션',120000,'cdpk'],['pohang','camp','해변 오토캠핑장',35000,'dp'],
['daegu','hotel','동성로 인근 호텔',95000,'pek'],['daegu','guest','서문시장 게스트하우스',40000,''],['daegu','temple','팔공산 템플스테이',50000,''],['daegu','hotel','동대구역 인근 호텔',100000,'pek'],
['gyeongju','hanok','황리단길 한옥스테이',130000,'k'],['gyeongju','resort','보문단지 리조트',190000,'cpek'],['gyeongju','hotel','보문 호텔',150000,'pek'],['gyeongju','temple','불국사 인근 템플스테이',50000,''],['gyeongju','guest','황리단길 게스트하우스',45000,''],['gyeongju','pension','감포 바다 펜션',120000,'cdpk'],['gyeongju','camp','보문 인근 캠핑장',35000,'dp'],
['andong','hanok','하회마을 인근 고택·한옥',120000,'dpk'],['andong','farm','농촌체험 민박',70000,'cdpk'],['andong','hotel','안동 시내 호텔',80000,'pe'],['andong','temple','인근 사찰 템플스테이',50000,''],
['jeju','resort','서귀포 리조트',220000,'cpek'],['jeju','hotel','제주시 공항 인근 호텔',110000,'pek'],['jeju','pension','애월·한림 풀빌라',250000,'cdpk'],['jeju','glamp','제주 글램핑·카라반',150000,'cpk'],['jeju','camp','제주 오토캠핑장',30000,'dp'],['jeju','guest','제주 게스트하우스',40000,''],['jeju','forest','제주 자연휴양림',80000,'cpk'],['jeju','farm','제주 농촌체험 민박',90000,'cdpk']];

/* 형태: 숙소 / 캠핑·자연, 지역 정보(권역·풍경), 여행 목적 */
const GRP={stay:['hanok','pension','resort','hotel','guest','temple','farm'],camp:['glamp','camp','forest']};
const GRP_LAB={stay:['🏨','숙소','호텔·한옥·펜션 등'],camp:['🏕️','캠핑·자연','글램핑·휴양림']};
const REGIONS=['수도권','강원','충청','전라','경상','제주'];
const REG={seoul:['수도권',['city']],suwon:['수도권',['city','trad']],incheon:['수도권',['sea','city']],chuncheon:['강원',['lake','mount']],gangneung:['강원',['sea','mount']],sokcho:['강원',['sea','mount']],taean:['충청',['sea']],daejeon:['충청',['city']],buyeo:['충청',['trad','lake']],jeonju:['전라',['trad','city']],gwangju:['전라',['city','mount']],mokpo:['전라',['sea']],suncheon:['전라',['sea','trad']],yeosu:['전라',['sea']],tongyeong:['경상',['sea']],busan:['경상',['sea','city']],ulsan:['경상',['sea','city']],pohang:['경상',['sea']],daegu:['경상',['city','mount']],gyeongju:['경상',['trad']],andong:['경상',['trad','lake']],jeju:['제주',['sea','mount']]};
const SCN=[['sea','🌊바다'],['mount','⛰️산·숲'],['lake','🏞️강·호수'],['city','🏙️도시'],['trad','🏯전통']];
const PUR=[['family','👨‍👩‍👧 가족·아이'],['parents','🧓 부모님'],['couple','💑 커플'],['friends','👥 친구·모임'],['solo','🧍 혼자'],['fish','🎣 낚시'],['pet','🐶 반려동물'],['car','🚗 차박']];
const PURF={family:{need:'k'},parents:{any:'e',types:['hanok','temple','resort']},couple:{types:['pension','hanok','resort','glamp','hotel']},friends:{types:['pension','glamp','camp','resort']},solo:{types:['guest','hotel','camp','temple'],max:100000},fish:{need:'f'},pet:{need:'d'},car:{types:['camp']}};
const FISH_C=['incheon','chuncheon','gangneung','sokcho','taean','yeosu','tongyeong','busan','ulsan','pohang','jeju','mokpo'];
STAYS.forEach(a=>{if(FISH_C.includes(a[0])&&['pension','camp','glamp','guest'].includes(a[1]))a[4]+='f';if(a[1]==='glamp')a[4]+='n';});
const stDef=()=>({m:'stay',pu:'',base:'',dist:0,rg:'',sc:'',t:'',p:0,f:[],s:'rec',q:''});
function stf(){return UI.st||(UI.st=stDef());}
function stPos(f){return f.base==='me'&&UI.stPos?UI.stPos:(f.base?CITIES.seoul.hub:null);}
function stayFind(f){const q=(f.q||'').replace(/\s/g,'').toLowerCase(),pf=PURF[f.pu]||null,pos=stPos(f);
  let L=STAYS.map(a=>({c:a[0],t:a[1],n:a[2],pr:a[3],fl:a[4]})).filter(o=>{const C=CITIES[o.c];if(!C)return false;const g=REG[o.c]||['',[]];
    if(!GRP[f.m].includes(o.t)||(f.t&&o.t!==f.t)||(f.rg&&g[0]!==f.rg)||(f.sc&&!g[1].includes(f.sc)))return false;
    if(f.p&&!(f.p===1?o.pr<50000:f.p===2?o.pr>=50000&&o.pr<100000:f.p===3?o.pr>=100000&&o.pr<150000:o.pr>=150000))return false;
    if(!f.f.every(x=>o.fl.includes(x)))return false;
    if(pf){if(pf.need&&!o.fl.includes(pf.need))return false;if(pf.max&&o.pr>pf.max)return false;if(pf.types&&!pf.types.includes(o.t)&&!(pf.any&&o.fl.includes(pf.any)))return false;}
    if(q&&!(o.n+C.name+STAY_TYPES.find(t=>t[0]===o.t)[2]).replace(/\s/g,'').toLowerCase().includes(q))return false;return true;});
  L.forEach(o=>{o.km=pos?Math.round(hav(pos,CITIES[o.c].hub)):null;});
  if(f.dist&&pos)L=L.filter(o=>o.km<=f.dist);
  const sc=o=>o.fl.length*2+(pf&&pf.types&&pf.types.includes(o.t)?3:0)+(o.km!=null?-o.km/150:0)-o.pr/60000;
  if(f.s==='near'&&pos)L.sort((a,b)=>a.km-b.km||a.pr-b.pr);else if(f.s==='price')L.sort((a,b)=>a.pr-b.pr);else if(f.s==='high')L.sort((a,b)=>b.pr-a.pr);
  else if(f.s==='fac')L.sort((a,b)=>b.fl.length-a.fl.length||a.pr-b.pr);else if(f.s==='reg')L.sort((a,b)=>REGIONS.indexOf((REG[a.c]||[''])[0])-REGIONS.indexOf((REG[b.c]||[''])[0])||a.pr-b.pr);else L.sort((a,b)=>sc(b)-sc(a));
  return L;}
const SORTS=[['rec','추천순'],['near','가까운 순'],['price','가격 낮은 순'],['high','가격 높은 순'],['fac','시설 많은 순'],['reg','지역별']];
const SORT_HINT={rec:'조건에 잘 맞고 시설이 많고 가까운 곳을 앞에 둬요',near:'기준 위치에서 직선거리가 가까운 순',price:'1박 가격이 낮은 순',high:'1박 가격이 높은 순',fac:'취사·주차·반려동물 등 조건이 많은 순',reg:'수도권→강원→충청→전라→경상→제주 순'};
const sgCh=(act,k,arr,cur)=>arr.map(([v,l])=>`<button class="chip${cur===v?' on':''}" data-act="${act}" data-k="${k}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join('');
const sgRow=(l,h)=>`<div class="rr"><span class="rl">${l}</span><div class="rc wrap">${h}</div></div>`;
function stSum(f){const a=[GRP_LAB[f.m][1]];if(f.pu)a.push(PUR.find(x=>x[0]===f.pu)[1].replace(/^\S+\s/,''));if(f.base)a.push(f.base==='me'?'내 위치 기준':'서울 기준');if(f.dist)a.push(f.dist+'km 이내');if(f.rg)a.push(f.rg);if(f.sc)a.push(SCN.find(x=>x[0]===f.sc)[1].replace(/^\S{1,4}(?=[가-힣])/,''));if(f.t)a.push(STAY_TYPES.find(x=>x[0]===f.t)[2]);return a.join(' · ');}
/* 1화면: 큰 선택만 (형태 → 누구와 → 어디서부터 → 지역 → 유형), 세부 조건은 결과 화면에서 */
function viewStays(){return UI.stv==='res'?viewStayRes():viewStayPick();}
function pickBar(){if(UI.view!=='stays')return '';const f=stf();if(UI.stv==='res')return '';const n=stayFind(f).length;return `<button class="btn" data-act="stShow"${n?'':' disabled'}>${n?GRP_LAB[f.m][1]+' '+n+'곳 보기':'조건에 맞는 곳이 없어요'}</button>`;}
function viewStayPick(){const f=stf(),g=GRP[f.m],pos=!!stPos(f);
  return `${ART_DEFS}<div class="sthero">${ST_HERO}<div class="sttx"><h1>어디서 머물까요?</h1><span>형태와 취향만 고르면 바로 찾아 드려요</span></div></div>
<div class="stmode">${['stay','camp'].map(m=>`<button class="${f.m===m?'on':''}" data-act="stMode" data-v="${m}" aria-pressed="${f.m===m}">${ST_ART[m]}<span><b>${GRP_LAB[m][1]}</b><small>${GRP_LAB[m][2]}</small></span></button>`).join('')}</div>
<div class="stpur" role="group" aria-label="누구와 어떤 여행">${PUR.map(([v,l])=>{const ic=l.split(' ')[0],tx=l.slice(ic.length+1);return `<button class="${f.pu===v?'on':''}" data-act="stSet" data-k="pu" data-v="${v}" aria-pressed="${f.pu===v}"><i>${ic}</i><span>${tx}</span></button>`;}).join('')}</div>
<div class="rf">${sgRow('어디서',sgCh('stBase','base',[['me','📍 내 위치'],['seoul','서울'],['','상관없음']],f.base)+(pos?sgCh('stSet','dist',[[0,'거리 전체'],[100,'~100km'],[200,'~200km'],[300,'~300km']],f.dist):''))}
${sgRow('지역',sgCh('stSet','rg',[['','전체'],...REGIONS.map(r=>[r,r])],f.rg))}
${sgRow('풍경',sgCh('stSet','sc',[['','전체'],...SCN],f.sc))}
${sgRow('유형',sgCh('stSet','t',[['','전체'],...g.map(id=>{const t=STAY_TYPES.find(x=>x[0]===id);return [id,t[1]+' '+t[2]];})],f.t))}</div>
${UI.stMsg?`<p class="hint">${esc(UI.stMsg)}</p>`:''}`;}
function stayRes(){const f=stf(),L=stayFind(f),pos=stPos(f),on=f.p||f.f.length||f.q||f.s!=='rec';
  return `<div class="rbar"><span class="hint">조건에 맞는 곳 ${L.length}곳</span>${on?'<button class="lnk" data-act="stReset2">세부 조건 초기화</button>':''}</div>`+(L.length?'':'<p class="hint">조건에 맞는 곳이 없어요. 조건을 줄여 보세요.</p>')+
   L.slice(0,40).map((o,i,A)=>{const gh=f.s==='reg'&&(i===0||(REG[A[i-1].c]||[''])[0]!==(REG[o.c]||[''])[0])?`<h3 class="sgh">${(REG[o.c]||['기타'])[0]}</h3>`:'';const T=STAY_TYPES.find(t=>t[0]===o.t),nm=encodeURIComponent(CITIES[o.c].name+' '+o.n.replace(/\(.*\)/,''));
    return gh+`<div class="stc"><div class="sth"><span class="stt">${T[1]} ${T[2]}</span><span class="meta">${esc(CITIES[o.c].name)} · ${REG[o.c]?REG[o.c][0]:''}${o.km!=null?` · ${f.base==='me'?'내 위치':'서울'}에서 직선 약 ${o.km}km`:''}</span></div><b>${esc(o.n)} <span class="smp">샘플</span></b><span class="stp">1박 약 ${won(o.pr)}~ <small>· 2박 약 ${won(o.pr*2)} (2인 기준 추정)</small></span><div class="stf">${((REG[o.c]||['',[]])[1]).map(k=>{const x=SCN.find(y=>y[0]===k);return x?`<span class="sc">${x[1]}</span>`:'';}).join('')}${STAY_FLAGS.filter(x=>o.fl.includes(x[0])).map(x=>`<span>${x[1]}</span>`).join('')||'<span class="no">조건 정보 없음</span>'}</div><div class="sta"><button class="btn sm" data-act="stayGo" data-c="${o.c}">${esc(CITIES[o.c].name)} 일정 만들기</button><a class="ol" href="https://search.naver.com/search.naver?query=${nm}${encodeURIComponent(' 숙박 가격')}" target="_blank" rel="noopener noreferrer">가격·예약 검색</a>${o.t==='camp'||o.t==='glamp'?'<a class="ol" href="https://gocamping.or.kr" target="_blank" rel="noopener noreferrer">고캠핑</a>':''}${o.t==='forest'?'<a class="ol" href="https://www.foresttrip.go.kr" target="_blank" rel="noopener noreferrer">숲나들e</a>':''}</div></div>`;}).join('')+(L.length>40?'<p class="hint">상위 40곳만 보여요. 조건을 더 좁혀 보세요.</p>':'');}
function viewStayRes(){const f=stf(),pos=!!stPos(f);
  return `<div class="stsum"><span>${esc(stSum(f))}</span><button class="lnk" data-act="stBack">조건 바꾸기</button></div>
<input type="search" id="sq" class="rsearch" placeholder="지역·숙소 이름으로 찾기" value="${esc(f.q||'')}" autocomplete="off" aria-label="숙소 검색"><div class="rf">
${sgRow('가격(1박)',sgCh('stSet','p',STAY_PRICE,f.p))}
${sgRow('조건',FLAGS_BY[f.m].map(x=>`<button class="chip${f.f.includes(x)?' on':''}" data-act="stFlag" data-v="${x}" aria-pressed="${f.f.includes(x)}">${STAY_FLAGS.find(y=>y[0]===x)[1]}</button>`).join(''))}
${sgRow('정렬',sgCh('stSet','s',SORTS.filter(x=>x[0]!=='near'||pos),f.s))}<p class="hint" style="margin:2px 4px 0">↕ ${SORT_HINT[f.s]||''}</p></div>
<div id="sres">${stayRes()}</div>
<div class="msg" style="margin-top:14px">이름·가격·조건은 모두 <b>샘플(추정)</b>이에요. 실제 숙소는 한국관광공사 TourAPI·고캠핑 연동 후 채워지고, 가격과 예약은 "가격·예약 검색"으로 확인해 주세요. 거리는 직선 기준 추정이에요.</div>`;}
