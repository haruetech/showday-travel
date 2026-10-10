/* 서울(출발) → 각 지역 이동수단별 접근 정보 (샘플·추정치)
   rail: 기차·전철, air: 항공, bus: 고속·시외버스, car: 자가용 (km는 서울 기준 도로거리)
   min = 편도 소요(분, 대기·공항 이동 포함), lo/hi = 1인 왕복 요금(원). car는 km만 적고 시간·비용은 계산 */
const ACCESS={
  suwon:{rail:{min:60,lo:3000,hi:6000,how:'지하철·전철'},km:40},
  incheon:{rail:{min:70,lo:3000,hi:6000,how:'지하철·전철'},km:40},
  busan:{rail:{min:170,lo:100000,hi:140000,how:'KTX'},air:{min:150,lo:90000,hi:200000,how:'항공(김포-김해)'},km:325},
  gangneung:{rail:{min:130,lo:48000,hi:62000,how:'KTX-이음'},km:165},
  jeonju:{rail:{min:100,lo:62000,hi:72000,how:'KTX'},bus:{min:170,lo:28000,hi:36000},km:215},
  jeju:{air:{min:150,lo:80000,hi:280000,how:'항공'}},
  daegu:{rail:{min:110,lo:85000,hi:100000,how:'KTX'},km:295},
  gyeongju:{rail:{min:130,lo:80000,hi:100000,how:'KTX(신경주역)'},km:330},
  yeosu:{rail:{min:170,lo:92000,hi:115000,how:'KTX'},air:{min:140,lo:90000,hi:180000,how:'항공(김포-여수)'},km:400},
  sokcho:{bus:{min:150,lo:42000,hi:60000},km:215},
  daejeon:{rail:{min:55,lo:47000,hi:52000,how:'KTX'},km:165},
  gwangju:{rail:{min:115,lo:94000,hi:100000,how:'KTX(광주송정)'},air:{min:130,lo:80000,hi:150000,how:'항공(김포-광주)'},km:300},
  ulsan:{rail:{min:140,lo:105000,hi:115000,how:'KTX(울산역)'},air:{min:140,lo:90000,hi:170000,how:'항공(김포-울산)'},km:400},
  pohang:{rail:{min:160,lo:100000,hi:110000,how:'KTX(포항역)'},air:{min:130,lo:80000,hi:150000,how:'항공(김포-포항경주)'},km:370},
  tongyeong:{bus:{min:230,lo:56000,hi:70000},km:340},
  andong:{rail:{min:125,lo:60000,hi:66000,how:'KTX-이음'},km:230},
  chuncheon:{rail:{min:75,lo:16000,hi:18000,how:'ITX-청춘'},km:85},
  taean:{bus:{min:140,lo:28000,hi:34000},km:150},
  suncheon:{rail:{min:175,lo:105000,hi:115000,how:'KTX'},km:380},
  mokpo:{rail:{min:160,lo:95000,hi:105000,how:'KTX'},km:340},
  buyeo:{bus:{min:150,lo:24000,hi:30000},km:160}
};
const MODE_LAB={rail:'기차·전철',car:'자가용',bus:'버스',air:'비행기'};
const MODE_PRI=['rail','air','bus','car'];
/* 한 지역의 이동수단 목록: [{k,lab,min,lo,hi,how}] (lo/hi = 1인 왕복, 자가용은 차 1대 비용을 사람 수로 나눈 값) */
function accessOptions(cityId,S){
  const a=ACCESS[cityId];if(!a)return [];
  const eq=Math.max(1,S.adults+(S.kids>0&&S.kidAge==='infant'?0:0.5)*S.kids),out=[];
  if(a.rail)out.push({k:'rail',lab:MODE_LAB.rail,how:a.rail.how,min:a.rail.min,lo:a.rail.lo,hi:a.rail.hi});
  if(a.air)out.push({k:'air',lab:MODE_LAB.air,how:a.air.how,min:a.air.min,lo:a.air.lo,hi:a.air.hi});
  if(a.bus||a.km){const b=a.bus||{min:Math.round(a.km/75*60*1.15),lo:Math.round(a.km*2*80/1000)*1000,hi:Math.round(a.km*2*105/1000)*1000};out.push({k:'bus',lab:MODE_LAB.bus,how:'고속·시외버스',min:b.min,lo:b.lo,hi:b.hi});}
  if(a.km){const rt=Math.round(a.km*2*150/1000)*1000;out.push({k:'car',lab:MODE_LAB.car,how:'자가용(연료·통행료 추정)',min:Math.max(25,Math.round(a.km/75*60)),lo:Math.round(rt/eq/100)*100,hi:Math.round(rt/eq/100)*100,km:a.km,rt});}
  return out;}
/* 선택한 이동수단(S.travelBy)을 반영한 옵션. 없으면 우선순위 기본값 */
function accessPick(cityId,S){const L=accessOptions(cityId,S);if(!L.length)return null;
  const by=S.travelBy||'auto';let o=by!=='auto'?L.find(x=>x.k===by):null;
  if(!o&&by==='auto')o=MODE_PRI.map(k=>L.find(x=>x.k===k)).find(Boolean);
  return o||null;}

/* 출발지 기준 이동수단 목록: 서울 출발=ACCESS, 내 위치(직선거리 추정)=자가용·버스 */
function originOptions(cityId,S){
  if(S.originType==='seoul')return accessOptions(cityId,S);
  if(S.originType==='other'&&S.originPos&&CITIES[cityId]){
    const d=hav(S.originPos,CITIES[cityId].hub)*1.3,eq=Math.max(1,S.adults+(S.kids>0&&S.kidAge==='infant'?0:0.5)*S.kids),rt=Math.round(d*2*150/1000)*1000;
    if(d<3)return [];
    return [{k:'bus',lab:MODE_LAB.bus,how:'버스(거리 추정)',min:Math.round(d/75*60*1.15)+20,lo:Math.round(d*2*80/1000)*1000,hi:Math.round(d*2*105/1000)*1000},
            {k:'car',lab:MODE_LAB.car,how:'자가용(거리 추정)',min:Math.max(25,Math.round(d/75*60)),lo:Math.round(rt/eq/100)*100,hi:Math.round(rt/eq/100)*100,km:Math.round(d),rt}];}
  return [];}
function pickOpt(L,S){if(!L.length)return null;const by=S.travelBy||'auto';let o=by!=='auto'?L.find(x=>x.k===by):null;
  if(!o&&by==='auto')o=MODE_PRI.map(k=>L.find(x=>x.k===k)).find(Boolean);return o||null;}
