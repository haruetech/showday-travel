/* SHOWDAY 여행일정 · 상수와 장소 데이터 도우미 (P, M) */
const INTS=[['food','맛집'],['nature','자연'],['walk','산책'],['show','공연'],['culture','전시·역사'],['festival','축제'],['play','아이 체험'],['shop','쇼핑'],['photo','사진'],['cafe','휴식·카페'],['free','무료 관광'],['sea','바닷가']];
const MEALP=[['local','현지 맛집'],['cheap','가성비'],['kr','한식'],['cn','중식'],['jp','일식'],['west','양식'],['quick','간편식'],['veg','채식'],['kid','어린이 메뉴']];
const MLAB={walk:'도보',transit:'대중교통',taxi:'택시',mix:'대중교통+택시',car:'자가용',rental:'렌터카'};
/* 장소: P(id,이름,분류,위도,경도,체류분,어른,어린이,플래그(k아이/e걷기쉬움/i실내),관심태그,메모,주차비) */
const P=(id,name,cat,lat,lng,dur,fa,fc,fl,tags,note,pk)=>({id,name,cat,lat,lng,dur,fa,fc,kid:fl.includes('k'),easy:fl.includes('e'),indoor:fl.includes('i'),tags:tags.split(' ').filter(Boolean),note:note||'',pk:pk==null?null:pk});
/* 식당·카페: M(id,이름,분류,위도,경도,1인가격,플래그,태그,메모) */
const M=(id,name,cat,lat,lng,price,fl,tags,note)=>P(id,name,cat,lat,lng,cat==='카페'?45:60,price,0,fl,tags,note,null);
