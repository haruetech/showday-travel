/* 그림 v3 — 관광 포스터풍: 선명한 종이공예 겹면 + 동심원 해 + 계절 상징 + 테마 아이콘 21종 (그림 교체는 이 파일만 수정) */
(function(){
let _q=0;
const _r=s=>{s=Math.sin(s*127.1+311.7)*43758.5453;return s-Math.floor(s);};
/* 능선: pointy=뾰족한 산, 아니면 둥근 언덕 */
function _rg(w,h,base,amp,seed,n,pointy,col,edge){let p=[];for(let i=0;i<=n;i++){p.push([w*i/n,base-amp*(.25+.75*_r(seed+i*1.7))]);}
 let d=`M0 ${h} L0 ${p[0][1].toFixed(1)}`;
 if(pointy)p.forEach(q=>d+=` L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
 else{for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],mx=(a[0]+b[0])/2;d+=` Q${a[0].toFixed(1)} ${a[1].toFixed(1)} ${mx.toFixed(1)} ${((a[1]+b[1])/2).toFixed(1)}`;}d+=` T${w} ${p[n][1].toFixed(1)}`;}
 return `<path d="${d} L${w} ${h}Z" fill="${col}"${edge?` stroke="${edge}" stroke-width="1"`:''}/>`;}
const _sun=(x,y,r,c,rings,a)=>{let o='';for(let i=rings;i>=1;i--)o+=`<circle cx="${x}" cy="${y}" r="${(r*(1+i*.38)).toFixed(1)}" fill="${c}" opacity="${((a||.28)/i).toFixed(2)}"/>`;return o+`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;};
const _sp=(x,y,s,c,o)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -5 C.6 -1.6 1.6 -.6 5 0 C1.6 .6 .6 1.6 0 5 C-.6 1.6 -1.6 .6 -5 0 C-1.6 -.6 -.6 -1.6 0 -5Z" fill="${c||'#fff'}" opacity="${o||.9}"/>`;
const _bd=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M-6 0 Q-3 -4 0 0 Q3 -4 6 0" fill="none" stroke="${c||'#fff'}" stroke-width="1.5" stroke-linecap="round"/>`;
const _pine=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -16 L6 -6 H3 L8 2 H3.5 L9 10 H1 V14 H-1 V10 H-9 L-3.5 2 H-8 L-3 -6 H-6Z" fill="${c}"/>`;
const _wv=(w,y,c,amp,gap,rows,o)=>{let s='';for(let i=0;i<rows;i++){const yy=y+i*gap;let d=`M0 ${yy}`;const n=Math.round(w/16);for(let k=0;k<n;k++)d+=` q8 ${i%2?amp:-amp} 16 0`;s+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round" opacity="${o||.5}"/>`;}return s;};
const _leaf=(x,y,s,rot,c)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 -9 L2.4 -5 L6.5 -6 L4.8 -2 L9 0 L4.4 1.6 L5.6 6 L1.2 4 L0 9 L-1.2 4 L-5.6 6 L-4.4 1.6 L-9 0 L-4.8 -2 L-6.5 -6 L-2.4 -5Z" fill="${c}"/><path d="M0 -6 V10" stroke="#7A2418" stroke-width=".9" opacity=".5"/></g>`;
const _bl=(x,y,s,c,c2)=>`<g transform="translate(${x} ${y}) scale(${s})">${[0,72,144,216,288].map(a=>`<ellipse transform="rotate(${a}) translate(0 -3.6)" rx="2.7" ry="3.6" fill="${c}"/>`).join('')}<circle r="1.5" fill="${c2||'#FFC233'}"/></g>`;
const _fl=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" stroke="#fff" stroke-width="1.1" stroke-linecap="round">${[0,60,120].map(a=>`<path transform="rotate(${a})" d="M0 -6 V6 M-1.8 -4.3 L0 -6 L1.8 -4.3 M-1.8 4.3 L0 6 L1.8 4.3"/>`).join('')}</g>`;
function _svg(w,h,sky,body,pos,pad){const g='a3_'+(_q++);
 const sh=w>=300?`<linearGradient id="${g}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a2a" stop-opacity=".5"/><stop offset=".62" stop-color="#0a0a2a" stop-opacity="0"/></linearGradient>`:'';
 return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${pos||'xMidYMid slice'}" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">${sky.map((c,i)=>`<stop offset="${(c[1]).toFixed(2)}" stop-color="${c[0]}"/>`).join('')}</linearGradient>${sh}</defs><rect width="${w}" height="${h}" fill="url(#${g})"/>${body}${sh?`<rect width="${w}" height="${h}" fill="url(#${g}s)"/>`:''}</svg>`;}

/* 첫 화면 큰 그림: 일출 바다 */
const _hero=(w,h)=>{const sx=w*.7,sy=h*.66,sr=h*.25;let b='';
 [[.06,.08,.7],[.3,.06,.55],[.66,.1,.7],[.78,.3,.5],[.9,.14,.65],[.96,.4,.5],[.5,.05,.5]].forEach(a=>b+=_sp(w*a[0],h*a[1],a[2]*(h/140)+.25,'#fff',.85));
 b+=_sun(sx,sy,sr,'#FFE08A',3,.3);
 b+=_rg(w,h,h*.72,h*.3,3,9,true,'#7B2E8E','rgba(255,255,255,.18)')+_rg(w,h,h*.8,h*.26,9,8,true,'#4A2A86','rgba(255,255,255,.15)');
 const sea=h*.8;b+=`<rect y="${sea}" width="${w}" height="${h-sea}" fill="#1B2A74"/>`+_wv(w,sea+4,'#5C7BFF',2.2,6,Math.floor((h-sea)/6),.45);
 for(let i=0;i<6;i++)b+=`<rect x="${sx-(14-i*2.2)}" y="${sea+3+i*5}" width="${(28-i*4.4).toFixed(1)}" height="2.2" rx="1.1" fill="#FFD36B" opacity="${(.9-i*.12).toFixed(2)}"/>`;
 b+=_bd(w*.86,h*.3,1.1)+_bd(w*.92,h*.24,.8)+_bd(w*.8,h*.2,.7);
 return _svg(w,h,[['#241658',0],['#7A2A94',.38],['#E04A78',.62],['#FF8A4C',.78],['#FFC85A',1]],b,'xMidYMax slice');};
/* 계절 */
const _season={
 spring:(w,h)=>{let b='';b+=_sun(w*.22,h*.3,h*.1,'#fff',2,.35);
  b+=`<path d="M${w*1.02} ${h*.02} C${w*.78} ${h*.1} ${w*.7} ${h*.2} ${w*.5} ${h*.26}" fill="none" stroke="#6B3A2A" stroke-width="${h*.028}" stroke-linecap="round"/><path d="M${w*.74} ${h*.12} C${w*.7} ${h*.2} ${w*.62} ${h*.24} ${w*.58} ${h*.34}" fill="none" stroke="#6B3A2A" stroke-width="${h*.018}" stroke-linecap="round"/>`;
  [[.9,.07,1],[.8,.13,1.15],[.7,.19,1],[.6,.25,1.2],[.52,.27,.9],[.68,.3,.9],[.6,.36,.8],[.82,.24,.8]].forEach((a,i)=>b+=_bl(w*a[0],h*a[1],a[2]*(h/92)*1.5,i%3?'#FFF':'#FFB3D1'));
  [[.3,.5],[.15,.62],[.45,.58],[.75,.5],[.9,.6]].forEach((a,i)=>b+=`<ellipse cx="${w*a[0]}" cy="${h*a[1]}" rx="2" ry="1.2" transform="rotate(${30+i*25} ${w*a[0]} ${h*a[1]})" fill="#FFD0E2"/>`);
  b+=_rg(w,h,h*.74,h*.2,21,7,false,'#58B98A')+_rg(w,h,h*.84,h*.16,5,6,false,'#1F8A61')+_rg(w,h,h*.95,h*.1,8,6,false,'#0E5E47');
  return _svg(w,h,[['#FFC2DA',0],['#FF8DB7',.55],['#F7608F',1]],b,'xMidYMax slice');},
 summer:(w,h)=>{let b='';b+=_sun(w*.24,h*.27,h*.11,'#FFE45E',3,.35);
  b+=`<g transform="translate(${w*.66} ${h*.5}) scale(${h/92*.9})"><path d="M0 -15 V6 M0 -15 C9 -9 11 -2 10 4 H0" fill="#fff" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/><path d="M-2 -10 C-8 -5 -10 -1 -9 4 H-2Z" fill="#FFD6DD"/><path d="M-13 7 H13 L9 12 H-9Z" fill="#FF6B57"/></g>`;
  b+=_bd(w*.5,h*.2,1.1)+_bd(w*.58,h*.14,.8);
  b+=`<rect y="${h*.58}" width="${w}" height="${h*.42}" fill="#0AA6C9"/>`+_wv(w,h*.64,'#fff',2.4,h*.09,4,.55)+`<rect y="${h*.8}" width="${w}" height="${h*.2}" fill="#0A5CA8"/>`+_wv(w,h*.86,'#7FD6FF',2.4,h*.07,2,.6);
  return _svg(w,h,[['#7FE0F0',0],['#31C0DE',.5],['#13A0CC',1]],b,'xMidYMax slice');},
 autumn:(w,h)=>{let b='';b+=_sun(w*.7,h*.46,h*.16,'#FFE08A',3,.3);
  b+=_rg(w,h,h*.62,h*.3,31,7,true,'#E0602B','rgba(255,255,255,.2)')+_rg(w,h,h*.76,h*.26,17,7,true,'#B83A27','rgba(255,255,255,.16)')+_rg(w,h,h*.9,h*.18,4,6,false,'#7D2020');
  [[.2,.18,1.5,20,'#FFB02E'],[.42,.1,1.1,-25,'#FF6B3D'],[.58,.3,1.3,40,'#FFC233'],[.82,.16,1.6,-10,'#E8412F'],[.32,.42,1,60,'#FF8A3C'],[.9,.4,1,15,'#FFC233']].forEach(a=>b+=_leaf(w*a[0],h*a[1],a[2]*(h/92)*.9,a[3],a[4]));
  return _svg(w,h,[['#FFD27A',0],['#FF9A45',.55],['#F0612B',1]],b,'xMidYMax slice');},
 winter:(w,h)=>{let b='';[[.1,.12],[.3,.08],[.55,.2],[.75,.1],[.9,.26],[.2,.3]].forEach((a,i)=>b+=_sp(w*a[0],h*a[1],.45+.25*(i%3),'#fff',.9));
  b+=`<path d="M0 ${h*.3} C${w*.25} ${h*.05} ${w*.5} ${h*.4} ${w} ${h*.1} V${h*.28} C${w*.55} ${h*.58} ${w*.25} ${h*.22} 0 ${h*.5}Z" fill="#3EF0C8" opacity=".38"/><path d="M0 ${h*.45} C${w*.3} ${h*.2} ${w*.6} ${h*.55} ${w} ${h*.32} V${h*.42} C${w*.6} ${h*.7} ${w*.3} ${h*.38} 0 ${h*.62}Z" fill="#FF7BD5" opacity=".28"/>`;
  b+=`<circle cx="${w*.8}" cy="${h*.2}" r="${h*.07}" fill="#FFF6D6"/>`;
  b+=_rg(w,h,h*.7,h*.34,12,6,true,'#EAF2FF','rgba(255,255,255,.5)')+`<path d="M${w*.1} ${h} L${w*.34} ${h*.5} L${w*.58} ${h}Z" fill="#B7C8F0" opacity=".35"/>`+_rg(w,h,h*.9,h*.16,6,5,false,'#2A3C94');
  [[.14,.9],[.26,.94],[.82,.92]].forEach(a=>b+=_pine(w*a[0],h*a[1],h/92*.9,'#0F1F66'));
  [[.2,.4],[.45,.52],[.7,.45],[.9,.6],[.35,.2]].forEach(a=>b+=_fl(w*a[0],h*a[1],h/92*.7));
  return _svg(w,h,[['#16226A',0],['#3A4FC0',.6],['#6C86F0',1]],b,'xMidYMax slice');}};
HOME_HERO=_hero(360,140);ST_HERO=HOME_HERO;
SEASON_ART={spring:_season.spring(80,92),summer:_season.summer(80,92),autumn:_season.autumn(80,92),winter:_season.winter(80,92)};
SEASON_BANNER={spring:_season.spring(360,84),summer:_season.summer(360,84),autumn:_season.autumn(360,84),winter:_season.winter(360,84)};
/* 숙소·캠핑 */
const _night=(w,h,tx,ts)=>{let b='';[[.08,.14],[.2,.3],[.35,.1],[.5,.24],[.62,.08],[.8,.18],[.92,.1],[.15,.5],[.7,.4]].forEach((a,i)=>b+=_sp(w*a[0],h*a[1],.4+.25*(i%3),'#fff',.85));
 b+=_sun(w*.82,h*.24,h*.1,'#FFF3C4',2,.3);
 b+=_rg(w,h,h*.66,h*.3,41,7,true,'#1E6B66','rgba(255,255,255,.14)')+_rg(w,h,h*.82,h*.22,7,6,true,'#0F4A4D');
 [[.06,.94],[.14,.88],[.24,.95],[.58,.92],[.7,.9],[.94,.94]].forEach(a=>b+=_pine(w*a[0],h*a[1],h/84*.95,'#07302F'));
 b+=`<g transform="translate(${tx} ${h*.86}) scale(${ts})"><path d="M-22 0 L0 -26 L22 0Z" fill="#FF8A3C"/><path d="M-4 0 L0 -12 L4 0Z" fill="#FFE08A"/><circle cx="0" cy="-5" r="14" fill="#FFC233" opacity=".18"/></g>`;
 return _svg(w,h,[['#0B1E4A',0],['#145A6B',.7],['#1E8A78',1]],b,'xMidYMax slice');};
HOME_ART.stays=_night(360,84,300,1.15);
ST_ART={stay:_svg(80,48,[['#FFB86B',0],['#F0577C',.6],['#7A2E8E',1]],_sun(58,20,7,'#FFF0B8',2,.3)+_rg(80,48,34,10,6,5,true,'#5A2A86')+`<g transform="translate(26 36)"><path d="M-22 6 C-12 4 -10 -2 0 -10 C10 -2 12 4 22 6 L18 8 H-18Z" fill="#2B1546"/><rect x="-13" y="6" width="26" height="8" fill="#3D1D5E"/><rect x="-3" y="8" width="6" height="6" fill="#FFC233"/></g>`),
 camp:_night(80,48,28,.6)};
/* 3번 눌러 바로 추천 아이콘 */
HOME_ART.quick=`<svg viewBox="0 0 48 40" aria-hidden="true"><circle cx="24" cy="20" r="19" fill="#fff" opacity=".24"/><path d="M6 20 L42 6 L32 36 L23 26Z" fill="#fff"/><path d="M23 26 L42 6 L21 23Z" fill="#FFD9BD"/><path d="M23 26 L22 34 L28 28Z" fill="#F0A877"/><path d="M4 33 C9 31 11 34 15 32" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 3.4" opacity=".9"/></svg>`;

/* 테마 아이콘 (24x24, 흰색 도형 · d=어두운 컷아웃 색) */
const _W='#fff',_T='rgba(255,255,255,.6)',_S='fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
const _TI={
 mount:d=>`<path d="M1.5 20 L9 6.5 L13 13 L15.8 9 L22.5 20Z" fill="${_W}"/><path d="M9 6.5 L11.3 10.6 L9 9.4 L6.8 10.6Z" fill="${_T}"/><circle cx="18.5" cy="5.5" r="2.2" fill="${_T}"/>`,
 walk:d=>`<path d="M5 21 C4 15 19 16 12.5 10.5 C8 6.5 14 5.5 16.5 4" ${_S} stroke-width="3.2"/><path d="M5 21 C4 15 19 16 12.5 10.5 C8 6.5 14 5.5 16.5 4" fill="none" stroke="${d}" stroke-width=".9" stroke-dasharray="1.6 2.2" stroke-linecap="round"/><circle cx="18.2" cy="4.5" r="2.6" fill="${_W}"/>`,
 spa:d=>`<path d="M2.5 13.5 H21.5 C21.5 18.2 17.8 21 12 21 C6.2 21 2.5 18.2 2.5 13.5Z" fill="${_W}"/><path d="M7.5 3.5 C5.5 6 9.5 7.5 7.5 10 M12 2.5 C10 5 14 6.5 12 9 M16.5 3.5 C14.5 6 18.5 7.5 16.5 10" ${_S} stroke-width="1.7"/>`,
 temple:d=>`<path d="M1.5 10.5 C6 9.5 9.5 7 12 2.5 C14.5 7 18 9.5 22.5 10.5 L20 12.8 H4Z" fill="${_W}"/><rect x="6" y="12.8" width="12" height="7.6" fill="${_W}"/><rect x="10.4" y="14.6" width="3.2" height="5.8" rx=".4" fill="${d}"/><rect x="3.5" y="20.4" width="17" height="1.6" rx=".8" fill="${_T}"/>`,
 senior:d=>`<rect x="2.5" y="7" width="19" height="3.4" rx="1.2" fill="${_W}"/><rect x="2" y="12" width="20" height="3.2" rx="1.2" fill="${_W}"/><path d="M5 15.2 V20.5 M19 15.2 V20.5" ${_S} stroke-width="2.2"/><circle cx="7.5" cy="4" r="1.4" fill="${_T}"/><circle cx="12" cy="3.4" r="1.4" fill="${_T}"/><circle cx="16.5" cy="4" r="1.4" fill="${_T}"/>`,
 island:d=>`<path d="M2.5 21 C6 16.5 18 16.5 21.5 21Z" fill="${_W}"/><path d="M12 17.5 C12 13 13 10 14.2 7" ${_S} stroke-width="2"/><path d="M14.2 7 C10.5 3.8 6.2 5.2 5 8.6 C9 6.8 11.5 7.8 14.2 7Z M14.2 7 C17 3.5 21 4.8 22 8 C18.5 6.8 16.5 7.4 14.2 7Z M14.2 7 C13 3 10.5 2 8.5 2.4 C11 3.2 12.3 4.8 14.2 7Z" fill="${_W}"/><circle cx="4.5" cy="4.5" r="2.2" fill="${_T}"/>`,
 sun:d=>`<path d="M4 17 A8 8 0 0 1 20 17Z" fill="${_W}"/><path d="M12 3 V5.4 M3.5 8 L5.3 9.6 M20.5 8 L18.7 9.6 M1.5 13.5 H3.6 M22.5 13.5 H20.4" ${_S} stroke-width="1.7"/><path d="M2 20.2 H22" ${_S} stroke-width="1.9"/><path d="M6 23 H18" ${_S} stroke-width="1.5" opacity=".6"/>`,
 fish:d=>`<path d="M2.5 12 C6.5 5.5 14 5.5 17.2 12 C14 18.5 6.5 18.5 2.5 12Z" fill="${_W}"/><path d="M16.5 12 L22 7 V17Z" fill="${_W}"/><circle cx="7.4" cy="10.8" r="1.2" fill="${d}"/><path d="M11 8.2 C12.6 10.5 12.6 13.5 11 15.8" fill="none" stroke="${d}" stroke-width="1" opacity=".5"/>`,
 kids:d=>`<circle cx="12" cy="10" r="7" ${_S} stroke-width="1.9"/><path d="M12 3 V17 M5 10 H19 M7 5 L17 15 M17 5 L7 15" ${_S} stroke-width="1"/><circle cx="12" cy="10" r="1.8" fill="${_W}"/><path d="M12 10 L6.5 21.5 M12 10 L17.5 21.5" ${_S} stroke-width="1.8"/>`,
 drive:d=>`<path d="M2.5 15.5 L4.6 10.2 C5.2 8.7 6.6 8 8.2 8 H15.8 C17.4 8 18.8 8.7 19.4 10.2 L21.5 15.5 V19 H2.5Z" fill="${_W}"/><path d="M6.4 10.4 H17.6 L19 14 H5Z" fill="${d}" opacity=".85"/><circle cx="7" cy="19" r="2.4" fill="${_W}" stroke="${d}" stroke-width="1.2"/><circle cx="17" cy="19" r="2.4" fill="${_W}" stroke="${d}" stroke-width="1.2"/>`,
 zoo:d=>`<path d="M12 11.5 C8 11.5 5.8 15.2 7.4 17.8 C9 20.4 15 20.4 16.6 17.8 C18.2 15.2 16 11.5 12 11.5Z" fill="${_W}"/><ellipse cx="5.6" cy="9.8" rx="1.9" ry="2.4" fill="${_W}"/><ellipse cx="9.6" cy="6" rx="1.9" ry="2.5" fill="${_W}"/><ellipse cx="14.4" cy="6" rx="1.9" ry="2.5" fill="${_W}"/><ellipse cx="18.4" cy="9.8" rx="1.9" ry="2.4" fill="${_W}"/>`,
 park:d=>`<path d="M1.5 19 C4.5 5 8.5 5 10.8 13.5 C12.8 20.5 16.5 20.5 22.5 6" ${_S} stroke-width="2.4"/><path d="M1.5 19 L1.5 22 M10.8 13.5 L10.8 22 M22.5 6 L22.5 22" ${_S} stroke-width="1.4" opacity=".7"/><circle cx="6" cy="8" r="1.7" fill="${_T}"/><path d="M19 3.5 L22.5 6 L19 8.5" fill="${_W}"/>`,
 beach:d=>`<circle cx="17.5" cy="6.5" r="3.4" fill="${_T}"/><path d="M1.5 14 C4.5 10.5 7.5 17.5 12 14 S19.5 10.5 22.5 14" ${_S} stroke-width="2.2"/><path d="M1.5 19.5 C4.5 16 7.5 23 12 19.5 S19.5 16 22.5 19.5" ${_S} stroke-width="2.2"/>`,
 museum:d=>`<path d="M2.5 9 L12 2.8 L21.5 9Z" fill="${_W}"/><rect x="4.4" y="10.2" width="2.8" height="8" rx=".6" fill="${_W}"/><rect x="9" y="10.2" width="2.8" height="8" rx=".6" fill="${_W}"/><rect x="13.6" y="10.2" width="2.8" height="8" rx=".6" fill="${_W}"/><rect x="2.5" y="19.4" width="19" height="2.4" rx=".8" fill="${_W}"/><circle cx="12" cy="6.6" r="1.1" fill="${d}"/>`,
 flower:d=>`${[0,72,144,216,288].map(a=>`<circle transform="rotate(${a} 12 12) translate(0 -5)" cx="12" cy="12" r="3.9" fill="${_W}"/>`).join('')}<circle cx="12" cy="12" r="2.8" fill="#FFC233"/>`,
 market:d=>`<path d="M2.5 9.2 L4.6 3.8 H19.4 L21.5 9.2Z" fill="${_W}"/>${[0,1,2,3].map(i=>`<rect x="${3+i*4.6}" y="3.8" width="2.3" height="5.4" fill="${d}" opacity=".28"/>`).join('')}<rect x="4" y="10.6" width="16" height="2" rx=".6" fill="${_W}"/><path d="M5.2 12.6 V20.8 M18.8 12.6 V20.8" ${_S} stroke-width="1.6"/><circle cx="9.4" cy="17.8" r="2.6" fill="${_T}"/><circle cx="14.8" cy="17.8" r="2.6" fill="${_T}"/>`,
 view:d=>`<path d="M1.5 5.5 L22.5 2.5" ${_S} stroke-width="1.3"/><path d="M12 4.1 V8" ${_S} stroke-width="1.4"/><rect x="6.8" y="8" width="10.4" height="8.4" rx="2" fill="${_W}"/><rect x="8.6" y="10" width="2.9" height="3.2" rx=".5" fill="${d}"/><rect x="12.5" y="10" width="2.9" height="3.2" rx=".5" fill="${d}"/><path d="M1.5 22 L8 17.6 L12 20.2 L17 16.8 L22.5 22Z" fill="${_T}"/>`,
 cafe:d=>`<path d="M3.5 10 H16 V15.2 C16 18.4 13.6 20.5 9.8 20.5 C6 20.5 3.5 18.4 3.5 15.2Z" fill="${_W}"/><path d="M16 11.4 H17.4 A2.6 2.6 0 0 1 17.4 16.6 H16" ${_S} stroke-width="1.8"/><path d="M7 3 C5.8 4.6 8.2 5.6 7 7.4 M11 3 C9.8 4.6 12.2 5.6 11 7.4" ${_S} stroke-width="1.5"/><path d="M2.5 22.2 H17.5" ${_S} stroke-width="1.6" opacity=".7"/>`,
 camp:d=>`<path d="M1.8 20.5 L12 4.2 L22.2 20.5Z" fill="${_W}"/><path d="M12 11.5 L15.6 20.5 H8.4Z" fill="${d}"/><path d="M12 2.8 V5" ${_S} stroke-width="1.5"/><circle cx="19.5" cy="5" r="1.4" fill="${_T}"/><circle cx="4.5" cy="7" r="1.1" fill="${_T}"/>`,
 bike:d=>`<circle cx="5.8" cy="16" r="3.9" ${_S} stroke-width="1.9"/><circle cx="18.2" cy="16" r="3.9" ${_S} stroke-width="1.9"/><path d="M5.8 16 L10 8.8 H15 L18.2 16 M10 8.8 L12.8 16 H5.8 M15 8.8 L14 6.2 H17" ${_S} stroke-width="1.8"/>`,
 food:d=>`<path d="M2.5 12.5 H21.5 C21.5 17.8 17.6 21 12 21 C6.4 21 2.5 17.8 2.5 12.5Z" fill="${_W}"/><path d="M14 2.8 L19.2 11 M17.4 2.8 L21.6 10" ${_S} stroke-width="1.6"/><path d="M6.5 5 C5.4 6.4 7.6 7.4 6.5 9 M10 4 C8.9 5.4 11.1 6.4 10 8" ${_S} stroke-width="1.4" opacity=".85"/>`};
window.thIcon=function(id,d){const f=_TI[id];return f?`<svg class="tic" viewBox="0 0 24 24" aria-hidden="true">${f(d||'#2a2a2a')}</svg>`:'';};
})();
