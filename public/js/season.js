/* 계절 명소 추천 (시제품: 평년 기준 대략 시기·샘플. 실제 올해 시기는 단풍지도·개화 정보로 확인) */
const SEASONS=[['spring','봄','벚꽃·꽃길',[3,4,5]],['summer','여름','바다·계곡',[6,7,8]],['autumn','가을','단풍·억새',[9,10,11]],['winter','겨울','설경·온천',[12,1,2]]];
const SN_THEME={spring:[['bl','🌸 벚꽃'],['fl','🌼 유채·튤립'],['az','🌺 진달래·철쭉'],['fest','🎪 봄 축제']],summer:[['sea','🌊 바다'],['val','🌿 계곡·숲'],['fl','🪷 수국·연꽃'],['night','🌙 야경'],['fest','🎪 축제']],autumn:[['mp','🍁 단풍'],['gk','🍂 은행나무'],['gr','🌾 억새·갈대'],['fest','🎪 가을 축제']],winter:[['sn','⛄ 설경'],['sp','♨️ 온천'],['sea','🌅 해돋이'],['fest','✨ 축제·불빛'],['fl','🌺 겨울꽃']]};
const SN_KEY={spring:'개화 현황',summer:'운영 안내',autumn:'단풍 현황',winter:'운영 안내'};
const SN_LINK={autumn:['대한민국 구석구석 단풍지도 보기','https://korean.visitkorea.or.kr'],spring:['대한민국 구석구석에서 확인','https://korean.visitkorea.or.kr'],summer:['대한민국 구석구석에서 확인','https://korean.visitkorea.or.kr'],winter:['대한민국 구석구석에서 확인','https://korean.visitkorea.or.kr']};
/* [계절, 테마, 이름, 가까운 지역, 시작 MMDD, 끝 MMDD, 한 줄 설명] */
const SPOTS=[
['spring','bl','여의도 윤중로 벚꽃길','seoul',401,410,'한강 옆 벚꽃길, 지하철로 가기 쉬워요'],
['spring','bl','석촌호수 벚꽃길','seoul',401,410,'호수 둘레 산책, 롯데월드와 함께 즐겨요'],
['spring','bl','수원화성 행궁동 벚꽃','suwon',401,410,'성곽 길과 벚꽃을 함께 봐요'],
['spring','bl','인천 자유공원 벚꽃','incheon',401,412,'차이나타운과 이어 걷기 좋아요'],
['spring','bl','경포호 벚꽃길','gangneung',405,415,'호수 둘레길과 바다를 함께'],
['spring','bl','의암호·소양강 벚꽃','chuncheon',410,420,'서울보다 늦게 피어 한 번 더 볼 수 있어요'],
['spring','bl','대릉원·보문호 벚꽃','gyeongju',330,410,'고분과 벚꽃, 전국에서 손꼽는 명소'],
['spring','bl','하동 십리벚꽃길 (하동)','suncheon',402,410,'순천에서 가까워요, 천천히 걸어요'],
['spring','bl','수성못 벚꽃','daegu',328,408,'호수 야경과 함께'],
['spring','fl','제주 녹산로 유채·벚꽃길','jeju',325,410,'노란 유채와 벚꽃이 함께 나오는 도로'],
['spring','fl','대저생태공원 유채','busan',320,410,'낙동강 옆 노란 유채 물결'],
['spring','fl','태안 꽃지 튤립','taean',410,430,'바다 옆 튤립 정원, 행사 기간 확인'],
['spring','fl','순천만국가정원 봄꽃','suncheon',405,515,'걷기 좋은 큰 정원'],
['spring','az','비슬산 참꽃(진달래) 군락','daegu',410,420,'산 위 분홍 꽃 군락, 많이 걸어요'],
['spring','az','전주 완산공원 꽃동산','jeonju',405,420,'시내에서 가까운 봄꽃 동산'],
['spring','az','황매산 철쭉 (합천)','daegu',503,515,'산 전체가 분홍빛, 주말은 매우 붐벼요'],
['spring','fest','진해 군항제 (창원)','busan',325,405,'부산에서 약 1시간, 기간 중 매우 붐벼요'],
['spring','fest','여의도 봄꽃축제','seoul',401,410,'일정은 해마다 달라요'],
['summer','sea','해운대·광안리 해수욕장','busan',701,820,'도심 바다, 밤에는 광안대교 야경'],
['summer','sea','경포 해수욕장','gangneung',701,820,'모래사장이 길고 카페 거리가 가까워요'],
['summer','sea','속초 해수욕장','sokcho',701,820,'설악산과 바다를 같이 즐겨요'],
['summer','sea','만리포·꽃지 해수욕장','taean',701,820,'서해 노을과 갯벌 체험'],
['summer','sea','협재·함덕 해변','jeju',620,831,'에메랄드빛 바다, 물놀이와 휴식'],
['summer','sea','영일대 해수욕장','pohang',701,820,'해상 전망대와 야경'],
['summer','sea','진하·대왕암 해변','ulsan',701,820,'바위 해안 산책과 해수욕'],
['summer','night','여수 밤바다','yeosu',601,930,'낭만포차 거리와 케이블카 야경'],
['summer','night','동궁과 월지 야경','gyeongju',501,930,'밤에 불 밝힌 연못, 여름밤 산책'],
['summer','night','한강 야경·크루즈','seoul',501,930,'해 질 무렵부터 야경까지'],
['summer','val','장태산자연휴양림','daejeon',620,831,'숲이 시원해 한낮에도 걷기 좋아요'],
['summer','val','담양 메타세쿼이아길','gwangju',610,830,'푸른 가로수 터널 산책'],
['summer','val','춘천 의암호 수상레저','chuncheon',620,831,'카누·수상 체험, 물가가 시원해요'],
['summer','val','통영 한려수도 섬 투어','tongyeong',601,930,'바다 위 섬 여행, 케이블카도 함께'],
['summer','fl','제주 수국길','jeju',610,710,'장마철 직전 수국이 절정'],
['summer','fl','서출지 연꽃','gyeongju',710,815,'연못 가득 연꽃, 이른 아침이 한산해요'],
['summer','fl','두물머리 세미원 연꽃 (양평)','seoul',701,810,'서울에서 가까운 연꽃 정원'],
['summer','fest','보령 머드축제 (보령)','taean',714,725,'태안에서 가까워요, 일정은 해마다 달라요'],
['autumn','mp','설악산 단풍','sokcho',1015,1030,'전국에서 가장 일찍 물들어요, 케이블카 이용'],
['autumn','mp','오대산 월정사 단풍길','gangneung',1010,1025,'전나무숲길과 단풍'],
['autumn','mp','북한산 단풍','seoul',1020,1105,'도심에서 가까워요, 코스 난이도 확인'],
['autumn','mp','주왕산 단풍 (청송)','andong',1020,1105,'계곡 따라 걷는 단풍'],
['autumn','mp','내장산 단풍 (정읍)','jeonju',1101,1115,'단풍 명소로 유명, 주말은 매우 붐벼요'],
['autumn','mp','지리산 피아골 단풍 (구례)','suncheon',1025,1110,'산행 준비가 필요해요'],
['autumn','mp','팔공산 동화사 단풍','daegu',1025,1110,'케이블카와 사찰 단풍'],
['autumn','mp','마곡사 단풍 (공주)','buyeo',1025,1110,'사찰 길 단풍, 걷기 편해요'],
['autumn','mp','불국사·대릉원 단풍','gyeongju',1101,1120,'천년 고도와 단풍'],
['autumn','mp','한라산 단풍','jeju',1020,1105,'등산 준비 필요'],
['autumn','mp','담양 메타세쿼이아길 단풍','gwangju',1105,1120,'가로수길이 갈색으로 물들어요'],
['autumn','gk','남이섬 은행나무길','chuncheon',1020,1105,'노란 은행나무 길, 배를 타고 들어가요'],
['autumn','gk','부석사 은행나무 (영주)','andong',1025,1105,'절 앞 은행나무 길'],
['autumn','gk','전주향교 은행나무','jeonju',1101,1110,'한옥마을과 함께 보기 좋아요'],
['autumn','gk','경복궁·서울숲 은행','seoul',1101,1115,'도심 가을 산책'],
['autumn','gr','하늘공원 억새','seoul',1010,1031,'서울에서 억새를 볼 수 있어요'],
['autumn','gr','순천만 갈대밭','suncheon',1025,1125,'노을 시간이 가장 아름다워요'],
['autumn','gr','간월재 억새 (영남알프스)','ulsan',1010,1031,'산을 올라야 해요, 체력 필요'],
['autumn','gr','새별오름 억새','jeju',1010,1105,'오름 위 황금빛 억새'],
['autumn','gr','무등산 억새평전','gwangju',1015,1105,'억새 능선, 산행 준비'],
['autumn','fest','백제문화제 (공주·부여)','buyeo',925,1010,'일정은 해마다 달라요'],
['autumn','fest','안동 국제탈춤페스티벌','andong',925,1005,'일정은 해마다 달라요'],
['autumn','fest','부산국제영화제','busan',1001,1012,'일정은 해마다 달라요'],
['autumn','fest','서울세계불꽃축제','seoul',1004,1010,'일정은 해마다 달라요, 매우 붐벼요'],
['winter','sn','대관령 양떼목장 설경','gangneung',1215,228,'눈 덮인 목장 산책'],
['winter','sn','설악산 권금성 설경','sokcho',1215,228,'케이블카로 쉽게 올라가요'],
['winter','sn','덕유산 상고대·설경 (무주)','jeonju',1215,215,'곤돌라로 올라가는 눈꽃, 많이 추워요'],
['winter','sn','한라산 눈꽃','jeju',1215,228,'등산 준비 필요, 입산 통제 확인'],
['winter','sn','수원화성 설경','suwon',1215,215,'눈 오는 날 성곽 길'],
['winter','sn','전주한옥마을 눈 오는 날','jeonju',1215,215,'한옥 지붕에 쌓인 눈'],
['winter','sn','하회마을 설경','andong',1215,215,'눈 오는 날 전통마을 풍경'],
['winter','fest','화천 산천어축제 (화천)','chuncheon',110,202,'얼음낚시, 일정은 해마다 달라요'],
['winter','fest','평창 송어축제 (평창)','gangneung',1220,215,'얼음낚시와 눈썰매, 일정 확인'],
['winter','fest','서울 겨울 야경(광화문·청계천)','seoul',1201,131,'연말 빛 장식, 일정은 해마다 달라요'],
['winter','fest','동궁과 월지 겨울 야경','gyeongju',1201,228,'눈 오면 더 아름다워요'],
['winter','sp','유성온천 족욕·온천','daejeon',1201,228,'몸을 녹이는 온천, 어르신과 함께하기 좋아요'],
['winter','sea','정동진·경포 해돋이','gangneung',1229,105,'새해 해맞이, 숙소를 미리 잡으세요'],
['winter','sea','호미곶 해맞이','pohang',1229,105,'상생의 손 앞에서 일출'],
['winter','sea','간절곶 해맞이','ulsan',1229,105,'새해 해맞이 명소'],
['winter','sea','향일암 일출','yeosu',1229,105,'바다 위로 뜨는 해, 계단이 많아요'],
['winter','fl','제주 카멜리아힐 동백','jeju',1201,315,'붉은 동백이 피는 정원'],
['winter','fl','오동도 동백','yeosu',1215,331,'바다 위 섬 산책로에 동백']];
const _doy=(md)=>{const m=Math.floor(md/100),d=md%100;return Math.round((Date.UTC(2025,m-1,d)-Date.UTC(2025,0,1))/864e5)+1;};
function curSeason(d){const m=(d||new Date()).getMonth()+1;return SEASONS.find(s=>s[3].includes(m))[0];}
function spotStat(sp,now){const t=Math.round((Date.UTC(2025,now.getMonth(),now.getDate())-Date.UTC(2025,0,1))/864e5)+1,a=_doy(sp[4]),b=_doy(sp[5]),inw=a<=b?(t>=a&&t<=b):(t>=a||t<=b),ds=(a-t+365)%365;
  if(inw)return{k:'now',n:0};if(ds<=30)return{k:'soon',n:ds};return{k:'later',n:ds};}
const MD_TXT=md=>{const m=Math.floor(md/100),d=md%100;return m+'월 '+(d<=10?'초':d<=20?'중순':'하순');};
function spotWin(sp){const a=MD_TXT(sp[4]),b=MD_TXT(sp[5]);if(a===b)return a;const ma=Math.floor(sp[4]/100),mb=Math.floor(sp[5]/100);return ma===mb?a+'~'+b.replace(/^\d+월 /,''):a+' ~ '+b;}
function seasonCount(sk,now){const L=SPOTS.filter(p=>p[0]===sk);return{all:L.length,now:L.filter(p=>spotStat(p,now).k==='now').length,soon:L.filter(p=>spotStat(p,now).k==='soon').length};}
function seasonOrder(now){const c=curSeason(now),i=SEASONS.findIndex(s=>s[0]===c);return SEASONS.map((_,k)=>SEASONS[(i+k)%4]);}
/* 첫 화면 한 줄 */
function seasonRow(){const now=new Date();return `<p class="hlab">계절 명소 <span class="meta">지금 가기 좋은 곳</span></p><div class="hseason">${seasonOrder(now).map((s,i)=>{const c=seasonCount(s[0],now),tag=c.now?`지금 ${c.now}곳`:c.soon?`곧 ${c.soon}곳`:`${c.all}곳`;return `<button class="hs${i===0?' now':''}" data-act="season" data-v="${s[0]}" aria-label="${s[1]} ${s[2]}">${SEASON_ART[s[0]]}${i===0?'<em>지금</em>':''}<span class="tx"><b>${s[1]}</b><small>${s[2]}</small><i>${tag}</i></span></button>`;}).join('')}</div>`;}
/* 계절 화면 */
function snf(){return UI.sn||(UI.sn={s:curSeason(),t:'',rg:''});}
function snList(){const f=snf(),now=new Date();
  let L=SPOTS.filter(p=>p[0]===f.s&&CITIES[p[3]]&&(!f.t||p[1]===f.t)&&(!f.rg||(REG[p[3]]&&REG[p[3]][0]===f.rg))).map(p=>({p,st:spotStat(p,now)}));
  const ord={now:0,soon:1,later:2};L.sort((a,b)=>ord[a.st.k]-ord[b.st.k]||a.st.n-b.st.n);
  const kw=SN_KEY[f.s];
  return `<div class="rbar"><span class="hint">조건에 맞는 명소 ${L.length}곳</span>${f.t||f.rg?'<button class="lnk" data-act="snReset">조건 초기화</button>':''}</div>`+(L.length?'':'<p class="hint">조건에 맞는 명소가 없어요. 조건을 줄여 보세요.</p>')+
   L.map(({p,st})=>{const C=CITIES[p[3]],bad=st.k==='now'?'<span class="sb now">🔥 지금 한창</span>':st.k==='soon'?`<span class="sb soon">곧 시작 · ${st.n}일 뒤</span>`:`<span class="sb">${Math.round(st.n/30)}개월 뒤</span>`,th=(SN_THEME[f.s].find(x=>x[0]===p[1])||['','']),q=encodeURIComponent(p[2].replace(/\(.*\)/,'').trim()+' '+kw);
    return `<div class="stc"><div class="sth">${bad}<span class="meta">${esc(C.name)}${REG[p[3]]?' · '+REG[p[3]][0]:''}</span></div><b>${esc(p[2])} <span class="smp">샘플</span></b><span class="snw">${esc(spotWin(p))} <small>(평년 기준)</small></span><span class="sub">${esc(p[6])}</span><div class="sta"><button class="btn sm" data-act="stayGo" data-c="${p[3]}">${esc(C.name)} 일정 만들기</button><a class="ol" href="https://search.naver.com/search.naver?query=${q}" target="_blank" rel="noopener noreferrer">올해 ${kw.replace(' 현황','')} 확인</a></div></div>`;}).join('');}
function viewSeason(){const f=snf(),S0=SEASONS.find(s=>s[0]===f.s),now=new Date(),c=seasonCount(f.s,now),ch=(k,arr,cur)=>arr.map(([v,l])=>`<button class="chip${cur===v?' on':''}" data-act="snSet" data-k="${k}" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join(''),row=(l,h)=>`<div class="rr"><span class="rl">${l}</span><div class="rc wrap">${h}</div></div>`,lk=SN_LINK[f.s];
  return `${ART_DEFS}<div class="sthero sn">${SEASON_BANNER[f.s]}<div class="sttx"><h1>${S0[1]} ${S0[2]} 명소</h1><span>${c.now?`지금 한창인 곳 ${c.now}곳`:c.soon?`곧 시작하는 곳 ${c.soon}곳`:'시기가 아직 멀어요'} · 평년 기준 시기예요</span></div></div>
<div class="sntabs">${SEASONS.map(s=>`<button class="chip${f.s===s[0]?' on':''}" data-act="snSet" data-k="s" data-v="${s[0]}" aria-pressed="${f.s===s[0]}">${s[1]}</button>`).join('')}</div>
<div class="rf">${row('테마',ch('t',[['','전체'],...SN_THEME[f.s]],f.t))}${row('지역',ch('rg',[['','전체'],...REGIONS.map(r=>[r,r])],f.rg))}</div>
<div id="snres">${snList()}</div>
<div class="msg" style="margin-top:14px">시기는 평년 기준 <b>대략값(샘플)</b>이고 해마다 달라요. 올해 단풍·개화 시기는 <a href="${lk[1]}" target="_blank" rel="noopener noreferrer">${lk[0]}</a>${f.s==='autumn'?' 또는 <a href="https://www.weather.go.kr" target="_blank" rel="noopener noreferrer">기상청 날씨누리(주요 산 단풍 관측)</a>':''}에서 확인해 주세요. 일정에 넣을 곳은 가까운 지역으로 이어져요.</div>`;}
