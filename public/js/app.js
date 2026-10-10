/* 첫 화면·설문 단계, 클릭 처리, 시작(render) */
function setWho(w){S.who=w;const p={solo:[1,0,0],couple:[2,0,0],kids:[2,0,1],parents:[4,2,0],group:[4,0,0]}[w];S.adults=p[0];S.seniors=p[1];S.kids=p[2];if(!S.kids){S.nap=false;S.stroller=false;}}
function originGeo(){const fail=()=>{UI.originMsg='이 화면에서는 위치를 못 가져와요. 위 세 가지 중에서 골라 주세요.';render(true);};
  if(!navigator.geolocation){fail();return;}
  UI.originMsg='위치를 확인하는 중이에요…';render(true);
  navigator.geolocation.getCurrentPosition(pos=>{const G={lat:pos.coords.latitude,lng:pos.coords.longitude};S.originPos=G;const hub=CITIES[S.city].hub,dh=hav(G,hub),ds=hav(G,CITIES.seoul.hub);
    if(dh<=40){S.originType='local';UI.originMsg=`내 위치가 ${CITIES[S.city].name} 근처예요 (약 ${Math.round(dh)}km). "도착지 근처에 살아요"로 맞췄어요.`;}
    else if(ds<=40){S.originType='seoul';UI.originMsg=`내 위치가 서울·수도권이에요. "서울·수도권에서 출발"로 맞췄어요.`;}
    else{const km=dh*1.3;S.originType='other';S.otherMin=Math.round(km/70*60/10)*10+30;S.otherCost=Math.round(km*2*110/1000)*1000;UI.originMsg=`내 위치에서 ${CITIES[S.city].name}까지 직선 약 ${Math.round(dh)}km예요. 편도 약 ${hmT(S.otherMin)}, 왕복 교통비 약 ${man(S.otherCost)}으로 거리 기준 추정했어요. 실제와 다르면 아래 칸을 고쳐 주세요.`;}
    UI.originOk=true;render(true);},()=>{fail();},{enableHighAccuracy:false,timeout:8000});}
function setCity(c){if(S.city!==c){S.city=c;S.hotel='h1';S.hotelPrice=CITIES[c].hotels[0].price;S.wish=[];S.customHotel=null;S.nightHotel={};S.booked=!!UI.booked;}}
function syncDate(){const t=new Date();if(S.dmode==='weekend'){t.setDate(t.getDate()+((6-t.getDay()+7)%7));S.date=iso(t);}else if(S.dmode==='today')S.date=iso(t);else if(S.dmode==='none')S.date='';}
function quickDefaults(){const m={solo:[['food','culture'],'transit','normal'],couple:[['food','cafe','photo'],'mix','normal'],kids:[['play','nature','food'],'mix','relaxed'],parents:[['walk','nature','food'],'mix','relaxed'],group:[['food','shop','photo'],'transit','normal']}[S.who];S.interests=m[0];S.mode=m[1];S.pace=m[2];if(S.seniors>0)S.walkLvl='less';}
function afterKidFlags(){const mp=new Set(S.mealPref);if(S.kidmeal)mp.add('kid');S.mealPref=[...mp];if(S.kidplay&&!S.interests.includes('play'))S.interests=[...S.interests,'play'];}
function doCopy(t){(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('일정을 복사했어요')).catch(()=>{UI.sheet={t:'copy',text:t};render(true);});}
/* 첫 화면 클릭 기록: window.SD_TRACK 이 있을 때만(서버 배포판). 개인정보 없이 버튼 종류·값만 보냄 */
function sdTrack(e,v){try{if(window.SD_TRACK&&navigator.sendBeacon)navigator.sendBeacon(window.SD_TRACK,new Blob([JSON.stringify({e,v:v||''})],{type:'application/json'}));}catch(x){}}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b||b.tagName==='INPUT')return;const a=b.dataset.act,k=b.dataset.k,v=b.dataset.v;sdTrack(a,v||b.dataset.c);
  const auto=()=>{if(UI.view==='wizard'&&curStep().auto){render();setTimeout(nextStep,140);}else render(true);};
  switch(a){
   case 'back':if(UI.view==='stays'&&UI.stv==='res'){UI.stv='pick';render();}else if(UI.view==='wizard')prevStep();else if(UI.view==='result'){UI.view='wizard';UI.step=active().slice(-1)[0].id;render();}else{UI.view='home';UI.sheet=null;render();}window.scrollTo(0,0);break;
   case 'thMore':UI.thmore=!UI.thmore;render(true);break;
   case 'thG':UI.thg=v;render(true);break;
   case 'home':UI.view='home';UI.sheet=null;render();window.scrollTo(0,0);break;
   case 'theme':UI.view='theme';UI.th={k:v,t:'',rg:''};UI.sheet=null;render();window.scrollTo(0,0);break;
   case 'thSet':{const f=thf();if(k==='k'){f.k=v;f.t='';}else f[k]=v;render(true);break;}
   case 'thReset':{const f=thf();f.t='';f.rg='';render(true);break;}
   case 'season':UI.view='season';UI.sn={s:v,t:'',rg:''};UI.sheet=null;render();window.scrollTo(0,0);break;
   case 'snSet':{const f=snf();if(k==='s'){f.s=v;f.t='';}else f[k]=v;render(true);break;}
   case 'snReset':{const f=snf();f.t='';f.rg='';render(true);break;}
   case 'stays':UI.view='stays';UI.stv='pick';UI.st=null;UI.stMsg='';UI.sheet=null;render();window.scrollTo(0,0);break;
   case 'stSet':{const f=stf();f[k]=(k==='p'||k==='dist'?+v:v);if(k==='pu'&&b.getAttribute('aria-pressed')==='true')f.pu='';if(k==='pu'&&v==='car')f.m='camp';if(k==='s'&&v==='near'&&!stPos(f))f.s='rec';render(true);break;}
   case 'stMode':{const f=stf();f.m=v;f.t='';f.f=f.f.filter(x=>FLAGS_BY[v].includes(x));if(f.pu==='car'&&v==='stay')f.pu='';render(true);break;}
   case 'stBase':{const f=stf();UI.stMsg='';if(v===''||v==='seoul'){f.base=v;f.dist=0;f.s=v?'near':'rec';render(true);break;}
     const fail=()=>{f.base='seoul';f.s='near';UI.stMsg='이 화면에서는 내 위치를 못 가져와서 서울 기준으로 보여요. 공개 주소(https)에서는 위치를 허용하면 내 위치 기준이 돼요.';render(true);};
     if(!navigator.geolocation){fail();break;}
     navigator.geolocation.getCurrentPosition(pp=>{UI.stPos={lat:pp.coords.latitude,lng:pp.coords.longitude};f.base='me';f.s='near';UI.stMsg='';render(true);},()=>fail(),{enableHighAccuracy:false,timeout:8000});break;}
   case 'stFlag':{const f=stf();f.f=f.f.includes(v)?f.f.filter(x=>x!==v):[...f.f,v];render(true);break;}
   case 'stShow':UI.stv='res';render();window.scrollTo(0,0);break;
   case 'stBack':UI.stv='pick';render();window.scrollTo(0,0);break;
   case 'stReset2':{const f=stf();f.p=0;f.f=[];f.q='';f.s=f.base?'near':'rec';render(true);break;}
   case 'stayGo':{newTrip();setCity(b.dataset.c);UI.known.add('dest');S.type='stay';S.nights=2;UI.known.add('type');UI.view='wizard';UI.step=active()[0].id;render();window.scrollTo(0,0);break;}
   case 'resume':resumeDraft();break;
   case 'draftDel':ls.set('showday_draft',null);render(true);break;
   case 'big':UI.big=!UI.big;ls.set('showday_big',UI.big);render(true);break;
   case 'start':newTrip();if(v==='wish')UI.wishFirst=true;else{S.type=v;S.nights=v==='day'?0:2;UI.known.add('type');}UI.view='wizard';UI.step=active()[0].id;render();window.scrollTo(0,0);break;
   case 'quick':newTrip();S.nights=2;UI.quick=true;UI.view='wizard';UI.step='dest';render();window.scrollTo(0,0);break;
   case 'begin':{newTrip();UI.start=v;UI.view='wizard';
    if(v==='dates'){UI.rec=true;UI.ids=['date','who','people','kidx','int','origin','budget','recpick'];S.nights=2;S.undecided=true;UI.step='date';}
    else if(v==='none'){UI.rec=true;UI.ids=['budget','int','who','people','kidx','dur','origin','recpick'];S.nights=2;UI.step='budget';}
    else if(v==='booked'){UI.booked=true;S.booked=true;S.fixedTimes=true;UI.ids=['dest','type','date','origin','time','stay','who','people','kidx','wish','mode','int','meal','access','budget','pace','confirm'];UI.step='dest';}
    else{UI.wishFirst=true;UI.step=active()[0].id;}
    render();window.scrollTo(0,0);break;}
   case 'rec':newTrip();S.nights=2;UI.rec=true;UI.view='wizard';UI.step='dur';render();window.scrollTo(0,0);break;
   case 'recgo':setCity(v);if(S.originType==='other'&&S.originPos){const pk=pickOpt(originOptions(v,S),S);if(pk){S.otherMin=pk.min;S.otherCost=pk.lo;}}UI.rec=false;UI.ids=null;['type','dur','dest','who','people','kidx','int','origin','budget'].concat(UI.start==='dates'?['date']:[]).forEach(i=>UI.known.add(i));UI.step='wish';UI.wq='';render();window.scrollTo(0,0);break;
   case 'sgo':{newTrip();setCity(b.dataset.c);UI.known.add('dest');if(b.dataset.p)S.wish=[b.dataset.p];UI.view='wizard';UI.step=active()[0].id;render();window.scrollTo(0,0);break;}
   case 'next':nextStep();break; case 'prev':prevStep();break;
   case 'make':afterKidFlags();make();break;
   case 'jump':UI.quick=false;UI.rec=false;UI.sheet=null;UI.known.delete(v);UI.view='wizard';UI.step=v;render();window.scrollTo(0,0);break;
   case 'type':if(v==='day'){S.type='day';S.undecided=false;S.nights=0;}else if(v==='stay'){S.type='stay';S.undecided=false;S.nights=Math.max(1,S.nights);}else{S.type='stay';S.undecided=true;S.nights=Math.max(1,S.nights);}auto();break;
   case 'dest':setCity(v);auto();break;
   case 'dmode':S.dmode=v;syncDate();render(true);break;
   case 'nights':if(+v===0){S.type='day';S.nights=0;S.undecided=true;}else{S.type='stay';S.nights=+v;}render(true);break;
   case 'origin':S[k]=v;UI.originMsg='';UI.originOk=true;render(true);break;
   case 'recOrigin':if(v==='geo'){originGeo();}else{S.originType=v;UI.originOk=true;render(true);}break;
   case 'hfset':hf()[k]=(k==='p'?+v:v);render(true);break;
   case 'hfreset':UI.hf={p:0,t:'',s:'rec'};UI.hsq='';render(true);break;
   case 'setr':S[k]=(k==='maxMin'?+v:v);render(true);break;
   case 'recPreset':recPreset(v);break;
   case 'recReset':recReset();break;
   case 'recFilt':UI.recFilt=!UI.recFilt;render(true);break;
   case 'recAll':UI.recAll=!UI.recAll;render(true);break;
   case 'originGeo':originGeo();break;
   case 'num':S[k]=+v;render(true);break;
   case 'who':setWho(v);if(UI.quick){quickDefaults();UI.quick=false;afterKidFlags();make();}else auto();break;
   case 'dur':if(+v===0){S.type='day';S.nights=0;}else{S.type='stay';S.nights=+v;}S.undecided=false;auto();break;
   case 'set':S[k]=v;auto();break;
   case 'bool':break;
   case 'arr':{const set=new Set(S[k]);set.has(v)?set.delete(v):set.add(v);S[k]=[...set];render(true);break;}
   case 'inc':{const mx={adults:9,seniors:S.adults,kids:6}[k];S[k]=Math.min(mx,S[k]+1);if(k==='kids'&&S.kids===1&&!S.nap&&S.kidAge==='infant')S.nap=true;render(true);break;}
   case 'dec':{const mn={adults:1,seniors:0,kids:0}[k];S[k]=Math.max(mn,S[k]-1);if(S.seniors>S.adults)S.seniors=S.adults;if(!S.kids){S.nap=false;S.stroller=false;}render(true);break;}
   case 'wish':S.wish=S.wish.includes(v)?S.wish.filter(i=>i!==v):[...S.wish,v];wishRefresh();saveDraft();break;
   case 'wcat':UI.wc=v;wishRefresh();break;
   case 'hotelClear':S.customHotel=null;S.hotel='h1';S.hotelPrice=cityOf().hotels[0].price;render(true);break;
   case 'mapFind':{const q=b.dataset.src.split(',').map(i=>(($('#'+i)||{}).value||'').trim()).filter(t=>t&&!/^https?:/.test(t)&&!/\d{2,3}\.\d{3,}/.test(t)).join(' ');
     if(!q){toast('찾을 주소나 상호를 먼저 적어 주세요');break;}window.open('https://map.kakao.com/?q='+encodeURIComponent(q),'_blank','noopener');break;}
   case 'fxSheet':UI.sheet={t:'fx',n:+v||UI.day};render(true);break;
   case 'fxDel':commit(()=>{S.fixedEv=(S.fixedEv||[]).filter(z=>z.day!==+v);},'행사를 일정에서 뺐어요');break;
   case 'fxSave':{const n=+v,g=i=>($('#'+i)||{}).value,tm=(g('fxt')||'').split(':').map(Number);if(tm.length<2||isNaN(tm[0])){toast('시작 시간을 확인해 주세요');break;}
     const o={day:n,t:tm[0]*60+(tm[1]||0),dur:+g('fxd')||120,title:(g('fxn')||'').trim()||'행사',pid:g('fxp')||null};
     commit(()=>{S.fixedEv=[...(S.fixedEv||[]).filter(z=>z.day!==n),o];},'행사를 '+hm(o.t)+'로 바꿔 다시 짰어요');break;}
   case 'stTime':{const n=+b.dataset.n,tm=(($('#stt')||{}).value||'').split(':').map(Number);if(tm.length<2||isNaN(tm[0])){toast('시간을 확인해 주세요');break;}const st=tm[0]*60+(tm[1]||0);commit(()=>{S.startShift={day:n,st};},n+'일차를 '+hm(st)+'부터 시작하도록 다시 짰어요');break;}
   case 'stTimeNow':{const n=+b.dataset.n,st=Math.ceil(nowMin()/5)*5;commit(()=>{S.startShift={day:n,st};},n+'일차를 지금('+hm(st)+')부터 시작하도록 다시 짰어요');break;}
   case 'stTimeReset':{const n=+b.dataset.n;commit(()=>{if(S.startShift&&S.startShift.day===n)S.startShift=null;},'출발 시간을 기본으로 되돌렸어요');break;}
   case 'stSheet':UI.sheet={t:'st',n:+v||UI.day};render(true);break;
   case 'stClear':{const n=+b.dataset.n;commit(()=>{const m={...(S.startAt||{})};delete m[n];S.startAt=m;if(S.legFix&&S.legFix.day===n)S.legFix=null;},'숙소에서 출발로 되돌렸어요');break;}
   case 'stFix':{const n=+b.dataset.n,g=i=>($('#'+i)||{}).value,km=+g('sfk'),mn=+g('sfm'),cs=+g('sfc'),id=g('sft'),nm=(g('sfn')||'').trim()||'출발지';
     if(!(km>0)||!(mn>0)||!(cs>=0)||!id){toast('거리·시간·택시비를 확인해 주세요');break;}
     const o=curOver();o.forEach((L,i)=>{o[i]=L.filter(z=>z!==id);});o[n-1].unshift(id);
     commit(()=>{S.over=o;S.avoid=S.avoid.filter(z=>z!==id);if(!S.wish.includes(id))S.wish=[...S.wish,id];S.startAt={...(S.startAt||{}),[n]:{name:nm,lat:35.834,lng:129.182}};S.legFix={day:n,id,km,min:mn,cost:cs};},n+'일차 첫 이동을 '+km+'km·'+mn+'분으로 맞췄어요');break;}
   case 'stPaste':{let n=+b.dataset.n,tx=($('#stp')||{}).value||'',nm=(($('#stn')||{}).value||'').trim(),nums=(tx.match(/\d{2,3}\.\d{3,}/g)||[]).map(Number),lat=nums.find(z=>z>=33&&z<=39.5),lng=nums.find(z=>z>=124&&z<=132);
     if(lat==null||lng==null){const m_=matchPl(tx+' '+(typeof nm==='string'?nm:''));if(m_){lat=m_.lat;lng=m_.lng;if(typeof nm==='string'&&!nm)nm=m_.name;}}
     if(lat==null||lng==null){toast('위치를 찾지 못했어요. 주소 검색은 아직 안 돼요. 앱에 있는 장소 이름이나 지도 앱의 링크·좌표를 붙여 주세요');break;}
     const dd=hav({lat,lng},cityOf().hub);if(dd>60){toast('선택한 지역에서 너무 멀어요 ('+Math.round(dd)+'km)');break;}
     setSt(n,{name:nm||'현재 위치',lat,lng},n+'일차를 그 위치에서 출발하도록 바꿨어요');break;}
   case 'stGeo':{const n=+b.dataset.n;if(!navigator.geolocation){toast('이 화면에서는 위치를 쓸 수 없어요. 아래 붙여넣기를 써 주세요');break;}
     navigator.geolocation.getCurrentPosition(pos=>{const lat=pos.coords.latitude,lng=pos.coords.longitude,dd=hav({lat,lng},cityOf().hub);if(dd>60){toast('선택한 지역에서 너무 멀어요 ('+Math.round(dd)+'km)');return;}setSt(n,{name:'현재 위치',lat,lng},n+'일차를 내 위치에서 출발하도록 바꿨어요');},()=>toast('위치를 못 가져왔어요. 아래 붙여넣기를 써 주세요'),{enableHighAccuracy:true,timeout:8000});break;}
   case 'hinfo':{const o={...(S.hotelInfo||{})},c={...(o[b.dataset.id]||{})};c[k]=c[k]===v?null:v;o[b.dataset.id]=c;S.hotelInfo=o;render(true);break;}
   case 'dhSheet':UI.sheet={t:'dh',n:+v||UI.day};render(true);break;
   case 'dhSame':setNH(+b.dataset.n,null,b.dataset.n+'일차 밤은 전날 숙소와 같게 했어요');break;
   case 'dhPick':{const h=cityOf().hotels.find(z=>z.id===v);if(h)setNH(+b.dataset.n,{id:h.id,name:h.name,lat:h.lat,lng:h.lng},b.dataset.n+'일차 밤 숙소를 '+h.name+'(으)로 바꿨어요');break;}
   case 'dhPaste':{let n=+b.dataset.n,tx=($('#dhp'+n)||{}).value||'',nm=(($('#dhn'+n)||{}).value||'').trim(),nums=(tx.match(/\d{2,3}\.\d{3,}/g)||[]).map(Number),lat=nums.find(z=>z>=33&&z<=39.5),lng=nums.find(z=>z>=124&&z<=132);
     if(lat==null||lng==null){const m_=matchPl(tx+' '+(typeof nm==='string'?nm:''));if(m_){lat=m_.lat;lng=m_.lng;if(typeof nm==='string'&&!nm)nm=m_.name;}}
     if(lat==null||lng==null){toast('위치를 찾지 못했어요. 주소 검색은 아직 안 돼요. 앱에 있는 장소 이름이나 지도 앱의 링크·좌표를 붙여 주세요');break;}
     const dd=hav({lat,lng},cityOf().hub);if(dd>60){toast('선택한 지역에서 너무 멀어요 ('+Math.round(dd)+'km)');break;}
     setNH(n,{id:'nh'+n,name:nm||'내 숙소',lat,lng},n+'일차 밤 숙소 위치를 바꿨어요');break;}
   case 'hotelPaste':{let tx=($('#hpaste')&&$('#hpaste').value)||UI.hpaste||'',nums=(tx.match(/\d{2,3}\.\d{3,}/g)||[]).map(Number),lat=nums.find(n=>n>=33&&n<=39.5),lng=nums.find(n=>n>=124&&n<=132);
     if(lat==null||lng==null){const m_=matchPl(tx+' '+(typeof nm==='string'?nm:''));if(m_){lat=m_.lat;lng=m_.lng;if(typeof nm==='string'&&!nm)nm=m_.name;}}
     if(lat==null||lng==null){toast('위치를 찾지 못했어요. 주소 검색은 아직 안 돼요. 앱에 있는 장소 이름이나 지도 앱의 링크·좌표를 붙여 주세요 (주소 검색은 지도 연동 후 가능해요)');break;}
     const dd=hav({lat,lng},cityOf().hub);if(dd>60){toast('선택한 지역에서 너무 멀어요 ('+Math.round(dd)+'km). 도시를 확인해 주세요');break;}
     UI.hpaste='';setCustomHotel(lat,lng,'지도 앱에서 붙여넣은 위치');toast('숙소 위치를 바꿨어요');break;}
   case 'geoHotel':{if(!navigator.geolocation){toast('이 기기에서는 위치를 쓸 수 없어요. 가까운 장소를 골라 주세요');break;}navigator.geolocation.getCurrentPosition(pos=>{const h=cityOf().hub,d=hav({lat:pos.coords.latitude,lng:pos.coords.longitude},h);if(d>60){toast('선택한 지역에서 너무 멀어요 ('+Math.round(d)+'km). 가까운 장소를 골라 주세요');return;}setCustomHotel(pos.coords.latitude,pos.coords.longitude,'현재 위치 기준');},()=>toast('위치를 가져올 수 없어요. 가까운 장소를 골라 주세요'),{timeout:8000,maximumAge:60000});break;}
   case 'hotel':S.customHotel=null;S.hotel=v;S.hotelPrice=(cityOf().hotels.find(h=>h.id===v)||{}).price;render(true);break;
   case 'noStay':S.type='day';S.nights=0;S.undecided=false;UI.step='mode';render();window.scrollTo(0,0);break;
   case 'rtab':UI.rtab=v;render();window.scrollTo(0,0);break;
   case 'day':UI.day=+v;UI.sel=-1;if(UI.travel)UI.scrollCur=true;render(true);break;
   case 'pick':{UI.sel=+v;render(true);const el=document.getElementById('ev'+v);if(el&&UI.rtab==='plan'&&window.innerWidth<960)el.scrollIntoView({block:'center'});break;}
   case 'applyAlt':{const alt=PLAN.alts[+v];commit(()=>{Object.assign(S,alt.patch);},'적용했어요 · 약 '+won(alt.delta)+' 절약');break;}
   case 'sheet':if(v==='voice')UI.day=liveDay(UI.day);UI.sheet=v==='add'?{t:'add',idx:lastIdx(),tab:'place'}:{t:v};if(v==='add'){UI.af='all';UI.as='near';UI.aq='';}render(true);break;
   case 'addAt':{const a=PLAN.days[UI.day-1].ev[+v];UI.sheet={t:'add',idx:+v,tab:a&&a.kind==='meal'?'cafe':a&&a.kind==='arrive'?'night':'place'};UI.af='all';UI.as='near';UI.aq='';render(true);break;}
   case 'atab':UI.sheet.tab=v;UI.af='all';UI.as='near';$('#achips').innerHTML=achips();$('#alist').innerHTML=addList();break;
   case 'afilter':UI.af=v;$('#achips').innerHTML=achips();$('#alist').innerHTML=addList();break;
   case 'asort':UI.as=v;$('#achips').innerHTML=achips();$('#alist').innerHTML=addList();break;
   case 'exDel':commit(()=>{S.extras=(S.extras||[]).filter(e=>e.uid!==v);},'일정에서 뺐어요');break;
   case 'micGo':micGo();break;
   case 'vApply':applySay();break;
   case 'vEx':{UI.vtext=vExamples()[+v];const ta=document.getElementById('vtext');if(ta)ta.value=UI.vtext;vUpd();break;}
   case 'closeSheet':UI.sheet=null;render(true);break;
   case 'adj':ADJ[v]();break;
   case 'goEv':{const t=document.getElementById('evsec');if(t)t.scrollIntoView({behavior:'smooth'});break;}
   case 'rainTog':ADJ.rainTog();break;
   case 'tourFill':ADJ.tourFill(+v);break;
   case 'delay':commit(()=>{S.delay=+v?{day:UI.day,min:+v}:null;},+v?UI.day+'일차를 '+v+'분 늦춰 다시 계산했어요':'지연을 해제했어요');break;
   case 'swapDo':swapPlace(v);break;
   case 'addDo':{const s=UI.sheet,pp=plc(v);if(s.tab==='place'||(s.tab==='night'&&pp&&pp.cat!=='식당'&&pp.cat!=='카페'))addPlaceAt(v,s.idx);else addExtra(v,s.idx);break;}
   case 'editOn':UI.edit=true;UI.sheet=null;UI.rtab='plan';render(true);break;
   case 'editOff':UI.edit=false;render(true);break;
   case 'ed':if(k==='del')delPlace(v);else if(k==='swap')swapPlace(v);else editPlace(k,v);break;
   case 'eat':eatSwap(v);break;
   case 'item':UI.sheet={t:'item',idx:+v};render(true);break;
   case 'repSheet':UI.sheet={t:'rep',id:v};UI.rf='all';UI.rq='';render(true);break;
   case 'rfilter':UI.rf=v;$('#rchips').innerHTML=rchips();$('#rlist').innerHTML=repList();break;
   case 'repDo':{const id=UI.sheet.id;doReplace(id,plc(v));break;}
   case 'eatSheet':UI.sheet={t:'eat',slot:v,day:UI.day};UI.ef='all';UI.es='near';UI.eq='';render(true);break;
   case 'efilter':UI.ef=v;$('#echips').innerHTML=echips();$('#elist').innerHTML=eatList();break;
   case 'esort':UI.es=v;$('#echips').innerHTML=echips();$('#elist').innerHTML=eatList();break;
   case 'eatDo':{const sl=UI.sheet.slot,cur=eatCtx().e.p.id,p=plc(v);commit(()=>{S.eatPick={...(S.eatPick||{}),[sl]:v};S.avoidEat=(S.avoidEat||[]).filter(x=>x!==v);S.wish=S.wish.filter(w=>w!==cur);},p.name+'(으)로 바꿨어요');break;}
   case 'eatReset':{const sl=UI.sheet.slot;commit(()=>{const o={...(S.eatPick||{})};delete o[sl];S.eatPick=o;},'처음 추천으로 되돌렸어요');break;}
   case 'confirmYes':{const s=UI.sheet;UI.sheet=null;if(s.op==='del')delPlace(s.id,true);else if(s.op==='swap')swapPlace(s.id,true);else eatSwap(s.id,true);break;}
   case 'undo':if(UI.undo.length){S=JSON.parse(UI.undo.pop());PLAN=buildPlan(S);UI.sheet=null;UI.day=Math.min(UI.day,PLAN.days.length);render(true);toast('되돌렸어요');}break;
   case 'save':{const t=ls.get('showday_trips',[]);t.unshift({name:cityOf().name+' '+durText()+(S.date?' · '+dayLabel(S,1):''),at:new Date().toLocaleDateString('ko-KR'),S});ls.set('showday_trips',t.slice(0,10))?toast('내 여행에 저장했어요'):toast('이 브라우저에서는 저장할 수 없어요');break;}
   case 'loadTrip':{const t=ls.get('showday_trips',[])[+v];if(t){UI.originOk=true;newTrip();S={...DEF(),...t.S};make(true);}break;}
   case 'delTrip':{const t=ls.get('showday_trips',[]);t.splice(+v,1);ls.set('showday_trips',t);render();break;}
   case 'addExp':{const amt=+($('#eamt').value||0);if(amt>0){EXP.push({amt,memo:$('#ememo').value.trim()});ls.set('showday_exp',EXP);render(true);}break;}
   case 'delExp':EXP.splice(+v,1);ls.set('showday_exp',EXP);render(true);break;
   case 'nearTog':UI.nearOn=!UI.nearOn;render(true);break;
   case 'nearTab':UI.nearTab=v;render(true);break;
   case 'nearPick':{const e=[...document.querySelectorAll('[data-nid="'+v+'"]')].find(z=>z.offsetParent);if(e)e.scrollIntoView({block:'center',behavior:'smooth'});break;}
   case 'nearAdd':{const d=PLAN.days[UI.day-1],st=lvState(d),p=plc(v);if(!p)break;const idx=st.cur?st.cur.i:lastIdx();if(p.cat==='식당'||p.cat==='카페')addExtra(v,idx);else addPlaceAt(v,idx);break;}
   case 'hereGo':hereGo();break;
   case 'hereTog':UI.hereOpen=!UI.hereOpen;render(true);break;
   case 'syncGo':syncGo();break;
   case 'syncNo':UI.syncNo=UI.day;render(true);break;
   case 'busSet':{const v=document.getElementById('busw').value;UI.busWait=v===''?null:Math.max(0,Math.min(120,+v));render(true);break;}
   case 'busClr':UI.busWait=null;render(true);break;
   case 'geoTog':if(UI.geo||UI.geoWant)geoStop();else geoStart();render(true);break;
   case 'travelOn':UI.travel=true;UI.rtab='plan';UI.clk=null;UI.edit=false;UI.day=pickDay();UI.scrollCur=true;render();break;
   case 'travelOff':UI.travel=false;geoStop();UI.clk=null;render(true);break;
   case 'lvNext':{const d=PLAN.days[UI.day-1],st=lvState(d);if(st.cur){CHK[ckey(d.n,st.cur.e)]=true;ls.set('showday_chk',CHK);}if(UI.clk!=null&&st.nx)UI.clk=st.nx.e.t0-5;UI.scrollCur=true;render(true);toast(st.nx?'다음 코스로 안내할게요: '+st.nx.e.title:'오늘 일정을 마쳤어요. 수고하셨습니다!');break;}
   case 'lvSkip':{const d=PLAN.days[UI.day-1],st=lvState(d);if(st.cur){CHK[ckey(d.n,st.cur.e)]='skip';ls.set('showday_chk',CHK);}if(UI.clk!=null&&st.nx)UI.clk=st.nx.e.t0-5;render(true);toast('건너뛰고 다음으로 안내할게요');break;}
   case 'lvStay':UI.scrollCur=true;commit(()=>{const m=(S.delay&&S.delay.day===UI.day)?S.delay.min:0;S.delay={day:UI.day,min:m+30};},'30분 더 머무는 걸로 남은 일정을 다시 계산했어요');break;
   case 'lvFreq':{const o=LV();if(v==='off')o.notif=false;else{o.notif=true;o.freq=v;}ls.set('showday_live',o);render(true);toast('알림: '+({often:'자주',normal:'보통',quiet:'조용히',off:'끔'})[v]);break;}
   case 'lvNtf':{const o=LV();o.notif=o.notif===false;ls.set('showday_live',o);render(true);break;}
   case 'lvClk':{const d=PLAN.days[UI.day-1],st=lvState(d),c=st.cur&&st.cur.e;let n=nowMin();if(v==='now')UI.clk=null;else if(v==='cur'&&c)UI.clk=c.t0+5;else if(v==='end'&&c)UI.clk=c.t1;else if(!isNaN(+v))UI.clk=Math.max(0,n+(+v));render(true);break;}
   case 'chk':CHK[v]=!CHK[v];if(!CHK[v])delete CHK[v];ls.set('showday_chk',CHK);render(true);break;
   case 'chkReset':CHK={};ls.set('showday_chk',CHK);render(true);break;
   case 'copy':doCopy(planText());break;
   case 'share':{const t=planText();if(navigator.share){navigator.share({title:'SHOWDAY 여행일정',text:t}).catch(()=>{});}else doCopy(t);break;}
  }});
document.addEventListener('change',ev=>{const t=ev.target;setTimeout(saveDraft,0);if(t.id==='hnear'&&t.value){const p=cityOf().places.find(x=>x.id===t.value);if(p)setCustomHotel(p.lat,p.lng,p.name+' 근처로 추정');return;}if(t.dataset&&t.dataset.act==='bool'){S[t.dataset.k]=t.checked;}if(t.dataset&&t.dataset.tm&&UI.view==='wizard'&&UI.step==='time'&&!UI.booked)render(true);});
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target.id==='hq'){const f=document.querySelector('#hres [data-act="sgo"]');if(f)f.click();}});
document.addEventListener('input',ev=>{const t=ev.target;setTimeout(saveDraft,0);
  if(t.id==='budget'){S.budget=Math.max(0,+t.value||0);}
  else if(t.id==='vtext'){UI.vtext=t.value;vUpd();}
  else if(t.id==='hpaste'){UI.hpaste=t.value;}
  else if(t.id&&t.id.startsWith('htel_')){const id=t.id.slice(5),o={...(S.hotelInfo||{})};o[id]={...(o[id]||{}),tel:t.value};S.hotelInfo=o;}
  else if(t.id==='hname'){UI.hname=t.value;if(S.customHotel)S.customHotel.name=t.value.trim()||'내 숙소';}
  else if(t.id==='hprice')S.hotelPrice=Math.max(0,+t.value||0);
  else if(t.id==='ocost')S.otherCost=Math.max(0,+t.value||0);
  else if(t.id==='omin')S.otherMin=Math.max(0,+t.value||0);
  else if(t.id==='datein'){S.date=t.value;}
  else if(t.dataset&&t.dataset.tm){const p=t.value.split(':').map(Number);if(!isNaN(p[0]))S[t.dataset.tm]=p[0]*60+(p[1]||0);}
  else if(t.id==='hq'){UI.hq=t.value;$('#hres').innerHTML=homeRes();}
  else if(t.id==='sq'){stf().q=t.value;$('#sres').innerHTML=stayRes();}
  else if(t.id==='hsq'){UI.hsq=t.value;$('#hres').innerHTML=stayList();}
  else if(t.id==='rq'){UI.rq=t.value;$('#rres').innerHTML=recList();}
  else if(t.id==='rq'){UI.rq=t.value;$('#rlist').innerHTML=repList();}
  else if(t.id==='eq'){UI.eq=t.value;$('#elist').innerHTML=eatList();}
  else if(t.id==='aq'){UI.aq=t.value;$('#alist').innerHTML=addList();}
  else if(t.id==='wq'){UI.wq=t.value;wishRefresh();}});
EXP=ls.get('showday_exp',[]);CHK=ls.get('showday_chk',{});UI.big=!!ls.get('showday_big',false);
render();
{const dr=ls.get('showday_draft',null);if(dr&&dr.ui&&dr.ui.travel&&dr.ui.view==='result'&&Date.now()-dr.at<12*3600000)resumeDraft();}
setInterval(lvTick,30000);
