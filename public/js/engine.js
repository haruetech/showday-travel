/* 일정 엔진: 이동 계산(legCalc), 일정 생성(buildPlan) */
Object.values(CITIES).forEach(C=>{C.hotels.forEach(h=>{const nm=h.name.replace(/ 인근.*$/,'').replace(/ 호텔$/,'');C.places.push(M('pb_'+h.id,nm+' 근처 호프·수제맥주',"식당",h.lat+0.0022,h.lng+0.0018,15000,'e','pub beer','숙소 근처에서 가볍게 한잔'));});});
/* 서울 출발 왕복 1인 추정(성인). 확정 요금이 아니라 범위예요 */
const RF={walk:0,transit:0.1,taxi:0.25,car:0.2};
function tripInfo(S){
  if(S.originType==='local'||(S.originType==='seoul'&&S.city==='seoul'))return{min:0,lo:0,hi:0,v:0,how:'',input:false};
  if(S.originType==='seoul'){let t=accessPick(S.city,S);if(!t&&(S.travelBy||'auto')!=='auto')t=accessPick(S.city,{...S,travelBy:'auto'});if(!t)return{min:0,lo:0,hi:0,v:0,how:'',input:false};return{min:t.min,lo:t.lo,hi:t.hi,v:Math.round(t.lo+(t.hi-t.lo)*0.4),how:t.how,input:false,mode:t.k};}
  return{min:S.otherMin||0,lo:S.otherCost||0,hi:S.otherCost||0,v:S.otherCost||0,how:'직접 입력',input:true};}
function hav(a,b){const R=6371,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lng-a.lng)*r;const x=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
const r100=n=>Math.round(n/100)*100;
const won=n=>Math.round(n).toLocaleString('ko-KR')+'원';
const man=n=>{const v=n/10000;return(v>=100?Math.round(v):Math.round(v*10)/10).toLocaleString('ko-KR')+'만원';};
const hmT=m=>Math.floor(m/60)+'시간'+(m%60?' '+(m%60)+'분':'');
const hm=m=>{m=Math.round(m);return String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};
function styleOf(S){if(S.styleOverride)return S.styleOverride;if(S.mealPref.includes('cheap')||S.interests.includes('free'))return'cheap';if(S.interests.includes('food')&&S.mealPref.includes('local'))return'food';return'balanced';}
function X(S,hubOnly){const C=CITIES[S.city];const hub={id:'hub',name:C.hub.name,lat:C.hub.lat,lng:C.hub.lng,price:0};
  const ch=S.hotel==='custom'&&S.customHotel&&S.customHotel.lat!=null?S.customHotel:null;const hotel=ch?{id:'custom',name:ch.name||'내 숙소',lat:ch.lat,lng:ch.lng,price:S.hotelPrice,note:''}:(C.hotels.find(h=>h.id===S.hotel&&h.id!=='custom')||C.hotels[0]);const day=S.type==='day';
  const infant=S.kids>0&&S.kidAge==='infant';
  const slow=!!(S.seniors>0||S.stroller||infant||S.walkLvl==='less'||S.wheel);
  const people=S.adults+S.kids;
  return{S,C,hub,hotel,H:(day||hubOnly)?hub:hotel,infant,slow,people,wheel:!!S.wheel,dayTrip:day,
    walkLim:S.wheel?0.3:(S.walkLvl==='lots'?3.0:(slow?1.0:2.0)),walkSp:S.walkLvl==='lots'?5:(slow?3:4.5),
    style:styleOf(S),taxis:Math.max(1,Math.ceil(people/4)),rooms:Math.max(1,Math.ceil(S.adults/2))};}
function taxiFare(d,base){const raw=d<=1.6?base:base+Math.ceil((d-1.6)*1000/131)*100;return r100(raw*1.15);}
function trFare(d){return 1550+Math.ceil(Math.max(0,d-10)/5)*100;}
function legCalc(a,b,pref,x,park){
  const C=x.C,S=x.S,hv=hav(a,b),d=Math.max(0.1,hv*1.3),dw=hv*1.2;
  const wMin=Math.max(1,Math.ceil(dw/x.walkSp*60)),wOk=dw<=x.walkLim;
  const sp=d>12?45:C.speed;
  const tx={mode:'taxi',min:Math.ceil(d/sp*60)+5,cost:taxiFare(d,C.base)*x.taxis,detail:x.taxis>1?'택시 '+x.taxis+'대 합계':'택시 1대 기준'};
  const trSp=C.transit?16:12,trWait=C.transit?C.wait:25,kf=x.infant?0:0.5;
  const tr={mode:'transit',min:Math.ceil(d/trSp*60)+trWait,cost:r100(trFare(d)*(S.adults+kf*S.kids))};
  {const f=trFare(d),pr=[];if(S.adults)pr.push((S.kids||x.infant?'어른 ':'1인 ')+won(r100(f))+' × '+S.adults+'명');
   if(S.kids)pr.push((x.infant?'영유아 무료 ':'어린이 '+won(r100(f*0.5))+' × ')+(x.infant?'':S.kids+'명'));
   tr.detail=pr.join(' + ')+(S.adults+S.kids>1&&!S.kids?' = 총 '+won(tr.cost):'');}
  const car={mode:'car',min:Math.ceil(d/sp*60)+4,cost:r100(d*140)+(park||0)};
  const wk={mode:'walk',min:wMin,cost:0,ok:wOk};
  const alts={walk:wk,transit:tr,taxi:tx,car:car};
  let use=pref,note='';
  if(pref==='rental')use='car';
  if(pref==='walk'){if(!wOk){use=(C.transit&&d<=8&&!x.slow)?'transit':'taxi';note='걷기엔 멀어서 '+(use==='taxi'?'택시':'대중교통')+'로 안내했어요';}}
  else if(pref==='transit'){if(dw<=0.8&&wOk)use='walk';}
  else if(pref==='taxi'){if(dw<=0.4&&wOk)use='walk';}
  else if(pref==='car'||pref==='rental'){if(dw<=0.3&&wOk)use='walk';}
  else if(pref==='mix'){if(dw<=0.5&&wOk)use='walk';else{use=((x.slow&&d>1.2)||(tr.min-tx.min>20)||(!C.transit&&d>3))?'taxi':'transit';}}
  const u=alts[use];
  return{use,km:Math.round(d*10)/10,min:u.min,cost:u.cost,note,alts};
}
const entryCost=(p,x)=>r100(p.fa*x.S.adults+(x.infant?0:p.fc)*x.S.kids);
const mealCost=(p,x)=>r100(p.fa*x.S.adults+p.fa*x.S.kids*(x.infant?0.3:0.6));
const parkOf=p=>p.pk!=null?p.pk:(p.cat==='자연'?0:3000);
const SEA_RE=/해수욕장|해변|해안|바다|해상|해양|오동도|태종대|섭지코지|일출봉|영금정|갯배|흰여울|용궁사|정동진|안목|경포|솟대|향일암|수산시장|포차|아바이/;
function matchInt(t,p){switch(t){case'food':return p.tags.includes('food');case'nature':return p.tags.includes('nature');
  case'walk':return p.easy&&(p.tags.includes('nature')||p.tags.includes('culture'));case'culture':return p.tags.includes('culture');
  case'play':return p.tags.includes('play');case'shop':return p.tags.includes('shop');case'photo':return p.tags.includes('nature')||p.tags.includes('culture');
  case'cafe':return p.tags.includes('cafe');case'free':return p.fa===0&&p.fc===0;case'sea':return SEA_RE.test(p.name);default:return false;}}
function scoreAttr(p,x){const S=x.S;let s=0;S.interests.forEach(t=>{if(matchInt(t,p))s+=3;});
  if(S.kids>0)s+=p.kid?2:-1;if(x.slow)s+=p.easy?2:-2;if(S.stairs&&!p.easy)s-=3;if(S.indoor){if(p.indoor)s+=6;else if(p.tags.includes('nature')||p.tags.includes('play'))s-=4;}
  const per=(p.fa*S.adults+(x.infant?0:p.fc)*S.kids)/Math.max(1,x.people);
  if(x.style==='cheap')s-=per/3000;else if(x.style==='balanced')s-=per/9000;
  if(x.style==='food'&&p.tags.includes('food'))s+=2;
  s-=hav(x.H,p)*(S.mode==='walk'?1.2:0.4);
  if(S.avoid.includes(p.id))s-=100;return s;}
function scoreMeal(m,pos,x){const S=x.S,mp=S.mealPref;let s=-hav(pos,m)*(S.mode==='walk'?3:1.5);
  if(x.style==='cheap'||mp.includes('cheap'))s-=m.fa/2500;else if(x.style==='food'||mp.includes('local'))s+=m.fa/9000+1;else s-=Math.abs(m.fa-16000)/5000;
  if(mp.includes('kr')&&m.tags.includes('kr'))s+=2;if(mp.includes('west')&&m.tags.includes('west'))s+=2;if(mp.includes('cn')&&m.tags.includes('cn'))s+=2;if(mp.includes('jp')&&m.tags.includes('jp'))s+=2;if(mp.includes('quick')&&m.tags.includes('quick'))s+=2;
  if((mp.includes('kid')||S.kids>0)&&m.kid)s+=1.5;if(x.slow&&m.easy)s+=1;if(x.wheel&&!m.easy)s-=3;return s;}
const argmin=(a,f)=>{let bi=0,bv=Infinity;a.forEach((v,i)=>{const z=f(v);if(z<bv){bv=z;bi=i;}});return bi;};
const argmax=(a,f)=>argmin(a,v=>-f(v));
function pickEat(kind,pos,x,used,wset){let list=x.C.places.filter(p=>p.cat===kind&&!p.tags.includes('pub')&&!(x.S.avoidEat||[]).includes(p.id));if(!list.length)list=x.C.places.filter(p=>p.cat===kind&&!p.tags.includes('pub'));const fresh=list.filter(p=>!used.has(p.id));const pool=fresh.length?fresh:list;
  const w=pool.filter(p=>wset.has(p.id));let m;
  if(w.length)m=w[argmin(w,p=>hav(pos,p))];else m=pool[argmax(pool,p=>scoreMeal(p,pos,x))];
  used.add(m.id);return m;}
function buildPlan(S,noAlt){
  const x=X(S),C=x.C,H=x.H,N=x.dayTrip?0:S.nights,D=N+1,trip=tripInfo(S);
  const arriveMin=x.dayTrip?S.depStart+trip.min:S.arrive;
  const attrAll=C.places.filter(p=>p.cat!=='식당'&&p.cat!=='카페'&&(!x.wheel||p.easy));
  const NH=k=>{const o=(S.nightHotel||{})[k];if(o)return{id:o.id||'nh'+k,name:o.name,lat:o.lat,lng:o.lng,price:S.hotelPrice,note:''};return k>1?NH(k-1):H;};
  const info=[];
  for(let i=0;i<D;i++){const first=i===0,last=i===N;
    const dl=(S.delay&&S.delay.day===i+1)?S.delay.min:0;
    const ss=(S.startShift&&S.startShift.day===i+1)?S.startShift.st:null,base=first?Math.min(arriveMin+(x.dayTrip?15:60),20*60):570;
    const st=(ss!=null?(first?Math.max(base,ss):ss):base)+dl;
    const en=last?S.depart-(x.dayTrip?75:90):21*60;
    const fxd=(S.fixedEv||[]).find(f=>f.day===i+1),en2=(fxd&&fxd.t+fxd.dur>=17*60&&fxd.t-20<en)?Math.max(st,fxd.t-20):en;
    const lunch=(st<=13*60+30&&en2>=13*60),dinner=en>=19*60+30,dinCap=en2>=19*60+30;
    let cap=Math.floor((en2-st-(lunch?60:0)-(dinCap?75:0))/({relaxed:130,normal:115,packed:95}[S.pace]));
    const pm={relaxed:3,normal:4,packed:6}[S.pace];let mx=pm;if(x.slow&&S.pace!=='relaxed')mx=Math.max(1,pm-1);
    cap=Math.max(0,Math.min(mx,cap));
    info.push({i,first,last,st,en,lunch,dinner,cap,fx:fxd||null});}
  const wish=S.wish.map(id=>C.places.find(p=>p.id===id)).filter(Boolean);
  const wAttr=wish.filter(p=>p.cat!=='식당'&&p.cat!=='카페'),wMeal=wish.filter(p=>p.cat==='식당'),wCafe=wish.filter(p=>p.cat==='카페');
  const totalCap=info.reduce((a,d)=>a+d.cap,0),excluded=[];
  const chosen=wAttr.slice(0,totalCap);
  wAttr.slice(totalCap).forEach(p=>{const lg=legCalc(H,p,'taxi',x,0);excluded.push({p,why:'숙소 기준 약 '+lg.km+'km·택시 약 '+lg.min+'분이고, 일정에 넣을 시간이 부족해요. 일수를 늘리거나 일정 밀도를 높이면 넣을 수 있어요'});});
  const rest=attrAll.filter(p=>!wAttr.includes(p)).map(p=>({p,s:scoreAttr(p,x)})).sort((a,b)=>b.s-a.s);
  for(const r of rest){if(chosen.length>=totalCap)break;chosen.push(r.p);}
  const left=[...chosen],byDay=Array.from({length:D},()=>[]),order=[];
  for(let i=1;i<N;i++)order.push(i);order.push(0);if(N>0)order.push(N);
  for(const i of order){const cap=info[i].cap,full=!info[i].first&&!info[i].last;let cur=null;
    for(let k=0;k<cap&&left.length;k++){
      const idx=!cur?(full?argmax(left,p=>hav(H,p)):argmin(left,p=>hav(H,p))):argmin(left,p=>hav(cur,p));
      const p=left.splice(idx,1)[0];byDay[i].push(p);cur=p;}
    const L=byDay[i];if(full&&L.length>1&&hav(H,L[L.length-1])<hav(H,L[0]))L.reverse();}
  const manual=!!(S.over&&S.over.length===D);
  if(manual){excluded.length=0;for(let i=0;i<D;i++)byDay[i]=S.over[i].map(id=>C.places.find(p=>p.id===id)).filter(Boolean);}
  const used=new Set([...Object.values(S.eatPick||{}),...(S.extras||[]).map(e=>e.id)]),wMealSet=new Set(wMeal.map(p=>p.id)),wCafeSet=new Set(wCafe.map(p=>p.id));
  const cafeWanted=S.interests.includes('cafe')||x.style==='food'||wCafe.length>0;
  const days=[],legRecs=[],extra=x.slow?15:0;
  for(const d of info){
    const so=(S.startAt||{})[d.i+1],Hs=so?{id:'st'+(d.i+1),name:so.name||'현재 위치',lat:so.lat,lng:so.lng,price:S.hotelPrice,note:''}:(d.i===0?NH(1):NH(d.i)),He=NH(d.i+1);const ev=[];let t=d.st,cur=Hs;const fpl=d.fx&&d.fx.pid?C.places.find(p=>p.id===d.fx.pid):null;const q=byDay[d.i].filter(p=>!fpl||p.id!==fpl.id);
    if(d.first)ev.push({kind:'arrive',t0:arriveMin,title:x.dayTrip?'도착 · 시내로 이동':'도착 · 숙소 체크인 또는 짐 보관',p:Hs,note:(x.dayTrip?C.hub.name:Hs.name)+(trip.min?' · 출발지에서 약 '+hmT(trip.min):'')});
    else ev.push({kind:'start',t0:d.st,title:so?'현재 위치에서 출발':(d.last?'숙소 체크아웃':'숙소에서 출발'),p:Hs,note:Hs.name});
    const cd=(S.cafeDays||[]).includes(d.i+1);
    let lunchDone=!d.lunch,dinnerDone=!d.dinner,cafeDone=!(cafeWanted||cd)||(d.last&&!x.dayTrip&&!cd),napDone=!(S.nap&&S.kids>0);
    const addStop=(p,kind,dur,cost)=>{let leg=legCalc(cur,p,S.mode,x,parkOf(p));const lf=S.legFix;if(lf&&lf.day===d.i+1&&lf.id===p.id&&cur===Hs&&!d.fixUsed){d.fixUsed=1;leg={...leg,use:'taxi',km:lf.km,min:lf.min,cost:lf.cost,fixed:true,note:'카카오맵 길찾기 기준'};}legRecs.push({a:cur,b:p,park:parkOf(p)});t+=leg.min;ev.push({kind,t0:t,t1:t+dur,p,leg,cost,title:p.name,dur});t+=dur;cur=p;};
    const lim=d.last?(x.dayTrip?S.depart-45:d.en):d.en+30;
    const eatCnt={};
    const fx=d.fx;let fxDone=!fx;
    const fbuf=()=>fpl?legCalc(cur,fpl,S.mode,x,0).min+5:20;
    const putFx=()=>{fxDone=true;const bf=fbuf();if(t<fx.t-bf-25)ev.push({kind:'free',t0:t,t1:fx.t-bf,title:'여유 시간 · 행사 이동 준비',p:null});
      if(fpl){const lg=legCalc(cur,fpl,S.mode,x,0);legRecs.push({a:cur,b:fpl,park:0});ev.push({kind:'fixed',t0:fx.t,t1:fx.t+fx.dur,title:fx.title+' · '+fpl.name,p:fpl,leg:lg,note:'정해진 시간이에요 · 이동 약 '+lg.min+'분을 미리 비워뒀어요'});cur=fpl;}
      else ev.push({kind:'fixed',t0:fx.t,t1:fx.t+fx.dur,title:fx.title,p:null,note:'약속된 시간이에요 · 이동 시간 20분을 미리 비워뒀어요 (행사장 위치는 앱이 몰라서 정확한 이동시간은 별도예요)'});
      if(fx.t<=12*60+30&&fx.t+fx.dur>=12*60+30)lunchDone=true;
      t=Math.max(t,fx.t)+fx.dur;};
    const eat=(kind,dur,set)=>{const sk=(d.i+1)+'|'+kind+'|'+(eatCnt[kind]=(eatCnt[kind]||0)+1);const ov=(S.eatPick||{})[sk],op=ov&&C.places.find(p=>p.id===ov&&p.cat===kind);let m;if(op){m=op;used.add(m.id);}else m=pickEat(kind,cur,x,used,set);if(d.last&&t+legCalc(cur,m,S.mode,x,0).min+dur+(x.dayTrip?legCalc(m,H,S.mode,x,0).min:0)>lim)return false;addStop(m,kind==='식당'?'meal':'cafe',dur,mealCost(m,x));ev[ev.length-1].slot=sk;flush(m.id);return true;};
    const exs=(S.extras||[]).filter(e=>e.day===d.i+1&&C.places.some(p=>p.id===e.id)),exd=new Set();
    const flush=(aid)=>{exs.forEach(e=>{if(exd.has(e.uid)||(aid!=='*'&&e.after!==aid))return;exd.add(e.uid);const p=C.places.find(z=>z.id===e.id),isM=p.cat==='식당',pb=p.tags.includes('pub');
      if(isM&&!pb&&t>=11*60&&t<=14*60+30)lunchDone=true;if(isM&&!pb&&t>=17*60&&t<=20*60)dinnerDone=true;if(!isM)cafeDone=true;
      addStop(p,isM?'meal':'cafe',pb?45:isM?60:45,mealCost(p,x));const le=ev[ev.length-1];le.ex=e.uid;if(t>lim)le.late=true;});};
    flush(null);
    const glued=()=>{const l=ev[ev.length-1];return !!(q.length&&l&&l.kind==='place'&&l.p&&(S.glue||[]).some(g=>g[0]===l.p.id&&g[1]===q[0].id));};
    let guard=0;
    while(guard++<50){
      const nx=q.length?legCalc(cur,q[0],S.mode,x,0).min+q[0].dur+extra:0;
      if(!lunchDone&&!(glued()&&t<13*60+30)&&(t>=11*60+30||(t>=10*60+30&&q.length&&t+nx>13*60+45))){eat('식당',60,wMealSet);lunchDone=true;continue;}
      if(!fxDone){const nd=q.length?legCalc(cur,q[0],S.mode,x,0).min+q[0].dur+extra:(!lunchDone?Math.max(11*60+30-t,0)+60:(!dinnerDone?Math.max(18*60-t,0)+75:0));
        const bf=fbuf();if(t>=fx.t-bf||t+nd>fx.t-bf){putFx();continue;}}
      if(!napDone&&lunchDone&&t>=13*60+15&&t<=15*60&&!d.last){ev.push({kind:'free',t0:t,t1:t+75,title:'아이 낮잠 · 휴식 (숙소 또는 근처 카페)',p:null});t+=75;napDone=true;continue;}
      if(!dinnerDone&&!(glued()&&t<19*60)&&(t>=17*60+30||(t>=16*60+30&&q.length&&t+nx>19*60+15))){eat('식당',75,wMealSet);dinnerDone=true;continue;}
      if(q.length){const p=q[0],lg=legCalc(cur,p,S.mode,x,0);
        const late=t+lg.min+p.dur+extra+(x.dayTrip?legCalc(p,H,S.mode,x,0).min:0)>lim;
        const endT=t+lg.min+p.dur+extra;if(late&&(endT>23*60+30||!(S.wish.includes(p.id)||(manual&&!d.fx&&endT<=lim+90)))){excluded.push({p,why:endT>23*60+30?'밤이 너무 늦어져서 제외했어요 (다른 날로 옮겨 보세요)':'시간이 모자라 제외했어요'});q.shift();continue;}
        q.shift();addStop(p,'place',p.dur+extra,entryCost(p,x));if(late)ev[ev.length-1].late=true;flush(p.id);
        if(!cafeDone&&!glued()&&t>=(cd?12*60:14*60+30)&&t<=17*60){eat('카페',45,wCafeSet);cafeDone=true;}
        continue;}
      if(!lunchDone){if(t<=14*60){t=Math.max(t,11*60+30);eat('식당',60,wMealSet);}lunchDone=true;continue;}
      if(!dinnerDone){if(t<18*60){if(18*60-t>=60)ev.push({kind:'free',t0:t,t1:18*60,title:'자유시간 · 쉬어가기',p:null});t=Math.max(t,18*60);}eat('식당',75,wMealSet);dinnerDone=true;continue;}
      if(!fxDone){putFx();continue;}
      break;}
    flush('*');
    if(!d.last||x.dayTrip){const leg=legCalc(cur,He,S.mode,x,0);legRecs.push({a:cur,b:He,park:0});t+=leg.min;ev.push({kind:'hotel',t0:t,title:x.dayTrip?'도착 거점으로 복귀 (역·공항)':'숙소 도착',p:He,leg,note:He.name});}
    if(d.last)ev.push({kind:'depart',t0:S.depart,title:'귀가 · 출발',p:null,note:'출발 '+(x.dayTrip?'75':'90')+'분 전 도착을 기준으로 잡았어요'+(x.dayTrip?'':' (역·공항까지 이동은 별도)')});
    let entry=0,meal=0,move=0;
    ev.forEach(e=>{if(e.kind==='place')entry+=e.cost;else if(e.kind==='meal'||e.kind==='cafe')meal+=e.cost;if(e.leg)move+=e.leg.cost;});
    let km=0,mins=0;ev.forEach(e=>{if(e.leg){km+=e.leg.km;mins+=e.leg.min;}});
    days.push({n:d.i+1,ev,entry,meal,move,sum:entry+meal+move,km:Math.round(km*10)/10,mins,late:ev.some(e=>e.late)});}
  const legs=[];days.forEach(d=>d.ev.forEach(e=>{if(e.leg)legs.push(e.leg);}));
  const eq=S.adults+(x.infant?0:0.5)*S.kids;
  let mv=0,mlo=0,mhi=0;legs.forEach(l=>{const f=l.fixed?0:(RF[l.use]||0);mv+=l.cost;mlo+=l.cost*(1-f);mhi+=l.cost*(1+f);});
  let me=0,en2=0;days.forEach(d=>{me+=d.meal;en2+=d.entry;});
  const lv=x.rooms*S.hotelPrice*N,lf=S.booked?0:0.15;
  const rv=S.mode==='rental'?D*65000:0;
  const cats={
    travel:{label:'왕복 교통',v:Math.round(eq*trip.v),lo:Math.round(eq*trip.lo),hi:Math.round(eq*trip.hi),conf:trip.input?'입력':'추정'},
    lodge:{label:'숙박',v:lv,lo:Math.round(lv*(1-lf)),hi:Math.round(lv*(1+lf)),conf:N===0?'':(S.booked?'예약 확정':'추정')},
    move:{label:'현지 교통',v:mv,lo:Math.round(mlo),hi:Math.round(mhi),conf:'추정'},
    rental:{label:'렌터카 대여',v:rv,lo:rv?D*50000:0,hi:rv?D*80000:0,conf:'추정'},
    meal:{label:'식비',v:me,lo:Math.round(me*0.8),hi:Math.round(me*1.2),conf:'추정'},
    entry:{label:'입장료·체험비',v:en2,lo:Math.round(en2*0.95),hi:Math.round(en2*1.1),conf:'추정'}};
  const T={total:0,lo:0,hi:0};Object.values(cats).forEach(c=>{T.total+=c.v;T.lo+=c.lo;T.hi+=c.hi;});
  const cmp={};
  ['walk','transit','taxi','mix','car','rental'].forEach(m=>{let c=0,mn=0;legRecs.forEach(r=>{const lg=legCalc(r.a,r.b,m,x,r.park);c+=lg.cost;mn+=lg.min;});if(m==='rental')c+=D*65000;cmp[m]={cost:c,min:mn};});
  const cap=S.budgetType==='per'?S.budget*x.people:S.budget;
  const cmpT=(t)=>t-(S.incLodge?0:cats.lodge.v)-(S.incTravel?0:cats.travel.v);
  let alts=[];
  if(!noAlt){
    const tryAlt=(label,patch,why)=>{const p2=buildPlan({...S,...patch},true);const delta=T.total-p2.T.total;if(delta>=1000)alts.push({label,why,patch,delta});};
    if(x.style!=='cheap')tryAlt('식당을 가성비 중심으로',{styleOverride:'cheap',mealPref:[...new Set([...S.mealPref,'cheap'])]},'식비와 입장료를 낮춰요');
    if(!S.interests.includes('free'))tryAlt('무료 관광지 위주로',{interests:[...S.interests,'free']},'입장료가 없는 곳을 우선해요');
    if(!['transit','walk'].includes(S.mode)&&!x.slow)tryAlt('이동을 대중교통으로',{mode:'transit'},'교통비가 크게 줄어요');
    if(!x.dayTrip&&!S.booked){const cheap=[...C.hotels].sort((a,b)=>a.price-b.price)[0];if(S.hotel!=='custom'&&cheap.id!==S.hotel&&cheap.price<S.hotelPrice)tryAlt('가장 저렴한 숙소 지역으로',{hotel:cheap.id,hotelPrice:cheap.price},cheap.name);}
    alts.sort((a,b)=>b.delta-a.delta);}
  return{S,x,days,excluded,cats,T,cmp,alts,N,D,trip,cap,cmpT,per:r100(T.total/Math.max(1,x.people))};
}
function reduceCost(S,target){const start=buildPlan(S,true).T.total;let cur={...S,over:null},tot=start,applied=[];
  for(let k=0;k<4&&start-tot<target;k++){const P=buildPlan(cur);if(!P.alts.length)break;const a=P.alts[0];cur={...cur,...a.patch};applied.push(a.label);tot=buildPlan(cur,true).T.total;}
  return{S:cur,saved:start-tot,applied};}
function recommendCities(S){const out=[];
  Object.keys(CITIES).forEach(id=>{const C=CITIES[id];const T={...S,city:id,hotel:'h1',hotelPrice:C.hotels[0].price,wish:[],avoid:[],over:null};const x=X(T);
    const attr=C.places.filter(p=>p.cat!=='식당'&&p.cat!=='카페');
    const sc=attr.map(p=>({p,s:scoreAttr(p,x)})).sort((a,b)=>b.s-a.s).slice(0,5);
    const opts=originOptions(id,S),pk=pickOpt(opts,S);if(S.originType==='other'&&S.originPos&&pk){T.otherMin=pk.min;T.otherCost=pk.lo;}
    const trip=tripInfo(T),eq=T.adults+(x.infant?0:0.5)*T.kids;
    const hits=S.interests.map(k=>[k,attr.filter(p=>matchInt(k,p)).length]).sort((a,b)=>b[1]-a[1])[0]||['',0];
    const catHit=S.interests.map(k=>[k,attr.filter(p=>matchInt(k,p)).length]);
    out.push({id,name:C.name,catHit,opts,mode:pk?pk.k:'',score:sc.reduce((a,o)=>a+o.s,0)+catHit.reduce((a,o)=>a+Math.min(o[1],5)*(o[0]==='sea'?25:4),0)-(eq*trip.v)/20000,lo:Math.round(eq*trip.lo),hi:Math.round(eq*trip.hi),min:trip.min,top:hits,picks:sc.slice(0,3).map(o=>o.p.name)});});
  return out.sort((a,b)=>b.score-a.score);}
