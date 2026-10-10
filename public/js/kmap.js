/* 카카오맵 일정 지도 — window.SD_KAKAO(JavaScript 키)가 있을 때만 켜지고, 없거나 실패하면 기존 SVG 개략도로 대체 */
(function(){
const _svg=mapSvg,_render=render;
const VIS=['place','meal','cafe'];
let sdkP=null;
function loadSdk(){
  if(window.kakao&&window.kakao.maps&&window.kakao.maps.LatLng)return Promise.resolve();
  if(sdkP)return sdkP;
  sdkP=new Promise((ok,no)=>{const s=document.createElement('script');
    s.src='https://dapi.kakao.com/v2/maps/sdk.js?appkey='+encodeURIComponent(window.SD_KAKAO)+'&autoload=false';
    s.onload=()=>window.kakao&&window.kakao.maps?window.kakao.maps.load(ok):no(new Error('nokakao'));
    s.onerror=()=>{sdkP=null;no(new Error('sdk'));};document.head.appendChild(s);});
  return sdkP;}
mapSvg=function(day){
  if(!window.SD_KAKAO)return _svg(day);
  const n=day.ev.filter(e=>e.p).length;
  if(n<2)return '<p class="hint" style="padding:12px">지도에 표시할 장소가 없어요.</p>';
  return '<div id="kmap" class="kmap" data-d="'+UI.day+'" aria-label="일정 지도"><p class="hint" style="padding:12px">지도를 불러오는 중…</p></div>';};
function fallback(el,day){if(!el||!day)return;el.outerHTML=_svg(day)+'<p class="hint">카카오맵을 불러오지 못해 이동 경로 개략도로 보여드려요.</p>';}
function draw(el,day){
  const K=window.kakao.maps,ll=p=>new K.LatLng(p.lat,p.lng);
  el.innerHTML='';
  const map=new K.Map(el,{center:ll(day.ev.find(e=>e.p).p),level:6});
  const pts=day.ev.map((e,i)=>({e,i})).filter(o=>o.e.p),bounds=new K.LatLngBounds();
  new K.Polyline({map,path:pts.map(o=>ll(o.e.p)),strokeWeight:4,strokeColor:'#2f6fed',strokeOpacity:.65,strokeStyle:'shortdash'});
  const add=(p,cls,txt,act,v)=>{const d=document.createElement('div');d.className='kmk '+cls;d.textContent=txt;if(act){d.setAttribute('data-act',act);d.setAttribute('data-v',v);}
    new K.CustomOverlay({map,position:ll(p),content:d,xAnchor:.5,yAnchor:.5,zIndex:cls.includes('on')?5:2});bounds.extend(ll(p));};
  let n=0;const seen={};
  pts.forEach(o=>{const e=o.e,k=e.p.lat+','+e.p.lng,on=UI.sel===o.i?' on':'';
    if(VIS.includes(e.kind)){n++;add(e.p,(e.kind==='place'?'':'m3 ')+on,n,'pick',o.i);}
    else if(!seen[k]){seen[k]=1;add(e.p,'m2'+on,S.type==='day'?'역':'숙','pick',o.i);}});
  if(UI.travel&&UI.nearOn&&UI._near)UI._near.forEach((o,i)=>add(o.p,'nr','가나다'[i]||'·','nearPick',o.p.id));
  if(UI.geo&&UI.geo.lat!=null&&UI.travel){const d=document.createElement('div');d.className='kme';new K.CustomOverlay({map,position:ll(UI.geo),content:d,xAnchor:.5,yAnchor:.5});}
  map.setBounds(bounds,50,50,50,50);
  setTimeout(()=>{if(el.isConnected&&!el.querySelector('img'))fallback(el,day);},4000);}
function after(){
  if(!window.SD_KAKAO||UI.view!=='result'||!['plan','map'].includes(UI.rtab))return;
  const el=document.getElementById('kmap');if(!el||!el.offsetWidth)return;
  const day=PLAN&&PLAN.days[UI.day-1];if(!day)return;
  const to=new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),6000));
  Promise.race([loadSdk(),to]).then(()=>{const cur=document.getElementById('kmap');if(cur)draw(cur,day);}).catch(er=>{try{console.warn('[kmap]',er&&er.message,'- 카카오 콘솔 > 플랫폼 > Web 에 이 사이트 주소가 등록됐는지, JavaScript 키가 맞는지 확인');}catch(_){}fallback(document.getElementById('kmap'),day);});}
render=function(k){_render(k);try{after();}catch(e){}};
})();
