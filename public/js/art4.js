/* v99 그림·아이콘 정리: 채도 낮은 톤 + 선 아이콘. art3.js 다음에 불러와 같은 이름을 덮어씁니다. */
(function(){
const P='preserveAspectRatio="xMidYMax slice"';
const svg=(w,h,sky,body)=>`<svg viewBox="0 0 ${w} ${h}" ${P} aria-hidden="true"><defs><linearGradient id="a4${w}${h}${sky[0].slice(1)}" x1="0" y1="0" x2="0" y2="1">${sky.map((c,i)=>`<stop offset="${(i/(sky.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#a4${w}${h}${sky[0].slice(1)})"/>${body}</svg>`;
// 부드러운 능선: base(높이 비율) amp(굽이) ph(위상)
const hill=(w,h,base,amp,ph,col,op=1)=>{let d=`M0 ${h}`;const n=8;for(let i=0;i<=n;i++){const x=w*i/n,y=h*base+amp*Math.sin(i*1.15+ph)+amp*.5*Math.sin(i*2.3+ph*2);d+=` L${x.toFixed(1)} ${y.toFixed(1)}`;}return `<path d="${d} L${w} ${h}Z" fill="${col}" opacity="${op}"/>`;};
const ln=(c,o=.18)=>`fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width=".8"`;
const sun=(x,y,r,c,o=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`;
const dots=(w,h,n,c,seed,y0=0,y1=.5)=>{let s=seed,o='';for(let i=0;i<n;i++){s=(s*9301+49297)%233280;const x=s/233280*w;s=(s*9301+49297)%233280;const y=y0*h+s/233280*(y1-y0)*h;o+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.6+(i%3)*.35).toFixed(2)}" fill="${c}" opacity=".7"/>`;}return o;};
const SEA={
 autumn:(w,h)=>svg(w,h,['#EBC29A','#D98E64','#B66A55'],sun(w*.74,h*.34,h*.12,'#FFE9C8',.9)+hill(w,h,.56,h*.05,.3,'#B0655A',.8)+hill(w,h,.7,h*.05,1.4,'#8A4B4C')+hill(w,h,.84,h*.04,2.2,'#5E3A40')+`<path d="M${w*.2} ${h*.2} q4 3 0 7 q-4-4 0-7z" fill="#F7D9B5" opacity=".8"/><path d="M${w*.42} ${h*.3} q4 3 0 7 q-4-4 0-7z" fill="#F7D9B5" opacity=".6"/>`),
 winter:(w,h)=>svg(w,h,['#C5D2EC','#9BADD6','#7589BC'],sun(w*.3,h*.3,h*.1,'#F4F7FF',.85)+hill(w,h,.5,h*.04,.6,'#E8EEFA',.55)+hill(w,h,.64,h*.05,1.8,'#7F93C6')+hill(w,h,.8,h*.04,.4,'#4F6199')+dots(w,h,16,'#fff',7,0,.7)),
 spring:(w,h)=>svg(w,h,['#F6D3DC','#EBAFC3','#D98FAA'],sun(w*.28,h*.3,h*.1,'#FFF6F0',.9)+hill(w,h,.6,h*.05,.9,'#A9C3A4',.85)+hill(w,h,.74,h*.04,2,'#7FA98A')+hill(w,h,.88,h*.03,.2,'#5A8A70')+`<g fill="#FFF6F8" opacity=".9">${[[.62,.2],[.74,.3],[.52,.34],[.82,.14]].map(([x,y])=>`<circle cx="${w*x}" cy="${h*y}" r="${h*.035}"/>`).join('')}</g>`),
 summer:(w,h)=>svg(w,h,['#A8DAE6','#6DB9D0','#3E93B2'],sun(w*.74,h*.26,h*.11,'#FFF4D2',.95)+`<rect y="${h*.62}" width="${w}" height="${h*.4}" fill="#2D7C9E"/><path d="M0 ${h*.74} q${w*.12} -3 ${w*.25} 0 t${w*.25} 0 t${w*.25} 0 t${w*.25} 0" ${ln('#fff',.4)} stroke-width="1"/><path d="M0 ${h*.86} q${w*.12} -3 ${w*.25} 0 t${w*.25} 0 t${w*.25} 0 t${w*.25} 0" ${ln('#fff',.25)} stroke-width="1"/><path d="M${w*.36} ${h*.6} v${-h*.26} l${w*.1} ${h*.22}z" fill="#fff" opacity=".95"/><path d="M${w*.34} ${h*.6} h${w*.16}" stroke="#fff" stroke-width="1.4"/>`)
};
SEASON_ART={spring:SEA.spring(80,92),summer:SEA.summer(80,92),autumn:SEA.autumn(80,92),winter:SEA.winter(80,92)};
SEASON_BANNER={spring:SEA.spring(360,84),summer:SEA.summer(360,84),autumn:SEA.autumn(360,84),winter:SEA.winter(360,84)};
// 첫 화면 큰 그림: 남보라 새벽 능선
HOME_HERO=svg(360,140,['#2A2770','#5A4EB4','#C47FA0','#F2B99C'],
 sun(268,100,17,'#FFE6BE',.95)+sun(268,100,30,'#FFE6BE',.12)+
 hill(360,140,.62,7,.4,'#4A3F9E',.7)+hill(360,140,.74,6,1.6,'#352E86',.9)+hill(360,140,.88,5,2.4,'#221E63')+
 `<path d="M0 108 C90 98 190 114 360 100" ${ln('#fff',.16)}/><path d="M0 118 C100 108 200 124 360 112" ${ln('#fff',.12)}/>`);
ST_HERO=HOME_HERO;
HOME_ART.stays=svg(360,84,['#1F3B52','#2C5864','#3D7378'],
 sun(70,20,6,'#F6E7C6',.9)+hill(360,84,.64,5,.5,'#244B57',.9)+hill(360,84,.8,4,1.8,'#17323C')+
 `<g fill="none" stroke="#F6C9A0" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M284 70 L304 38 L324 70Z"/><path d="M304 38 L304 70 M304 52 L296 70 M304 52 L312 70"/></g>`+dots(360,84,14,'#fff',3,0,.4));
ST_ART={
 stay:svg(80,48,['#F4DFC8','#E7BC98','#D49A7C'],hill(80,48,.72,2.5,.3,'#C58468',.8)+`<g fill="none" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"><path d="M22 36 V24 L40 14 L58 24 V36Z" fill="#8E4B4B" fill-opacity=".85"/><path d="M36 36 V28 H44 V36"/></g>`+sun(64,12,5,'#FFF3DC')),
 camp:svg(80,48,['#274862','#386C7C','#5B9488'],hill(80,48,.74,2.5,1,'#2A5560',.9)+`<g fill="none" stroke="#F6C9A0" stroke-width="1.5" stroke-linejoin="round"><path d="M26 40 L40 16 L54 40Z"/><path d="M40 16 V40"/></g>`+dots(80,48,8,'#fff',5,0,.45))
};
HOME_ART.quick=`<svg viewBox="0 0 48 40" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21 L39 8 L31 33 L22 25Z"/><path d="M22 25 L39 8"/><path d="M22 25 V32 L27 28"/></g></svg>`;
// 테마 아이콘: 가는 선(currentColor) — 색은 CSS에서
const _L='fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const _I={
 mount:'<path d="M2.5 19.5 9 8l4 6.5 2.5-3.8 6 8.8z"/>',
 walk:'<path d="M5 20.5c-1.2-6 12-5 7-10.5-3-3.2 1.2-5 5-5.8"/><circle cx="18.5" cy="4.2" r="1.2"/>',
 spa:'<path d="M3 13h18c0 4.5-3.5 7-9 7s-9-2.5-9-7z"/><path d="M8 4c-1.5 2 1.5 3 0 5M12 3c-1.5 2 1.5 3 0 5M16 4c-1.5 2 1.5 3 0 5"/>',
 temple:'<path d="M2.5 10.5c4.5-1 8-3.5 9.5-7.5 1.5 4 5 6.5 9.5 7.5l-2 2.2h-15z"/><path d="M6 12.7V20h12v-7.3M10.5 20v-4h3v4"/>',
 senior:'<path d="M3 8h18v3H3zM2.5 13h19v3h-19zM5 16v4.5M19 16v4.5"/>',
 island:'<path d="M3 20.5c4-4 14-4 18 0z"/><path d="M12 16.5c0-4 1-7 2.5-9.5M14.5 7c-3-3-7-2-8.5 1 3-1.5 5.5-1 8.5-1zM14.5 7c3-2 6.5-1 7.5 2-3-1.2-5.2-1.3-7.5-2z"/>',
 sun:'<path d="M5 17a7 7 0 0 1 14 0M12 4v2.5M4.2 8.7l1.8 1.5M19.8 8.7l-1.8 1.5M2 20.5h20"/>',
 fish:'<path d="M3 12c4-6 10-6 14 0-4 6-10 6-14 0zM17 12l5-4v8z"/><circle cx="7.6" cy="11" r=".6"/>',
 kids:'<circle cx="12" cy="10" r="6.5"/><path d="M12 3.5v13M5.5 10h13M7.4 5.4l9.2 9.2M16.6 5.4l-9.2 9.2M8 21h8M12 16.5V21"/>',
 drive:'<path d="M3 16l2-5.5C5.6 9 7 8 8.5 8h7c1.5 0 2.9 1 3.5 2.5L21 16v3H3zM3 16h18"/><circle cx="7.5" cy="19" r="1.6"/><circle cx="16.5" cy="19" r="1.6"/>',
 zoo:'<path d="M12 12c-3.5 0-5.5 3-4 5.5S15 19.5 16 17.5 15.5 12 12 12z"/><circle cx="5.5" cy="10" r="1.6"/><circle cx="9.5" cy="6.5" r="1.6"/><circle cx="14.5" cy="6.5" r="1.6"/><circle cx="18.5" cy="10" r="1.6"/>',
 park:'<circle cx="12" cy="9" r="6"/><path d="M12 15v6M9 21h6M9.5 9.5l2.5 2.5 3-4"/>',
 beach:'<circle cx="17" cy="6" r="3"/><path d="M2 14c3-3 6 3 10 0s7-3 10 0M2 19c3-3 6 3 10 0s7-3 10 0"/>',
 museum:'<path d="M3 9l9-6 9 6zM5 11v8M10 11v8M14 11v8M19 11v8M3 20.5h18"/>',
 flower:[0,72,144,216,288].map(a=>`<circle transform="rotate(${a} 12 12) translate(0 -5)" cx="12" cy="12" r="3.2"/>`).join('')+'<circle cx="12" cy="12" r="1.8"/>',
 market:'<path d="M3 9l2-5h14l2 5zM5 9v11h14V9M9 20v-6h6v6"/>',
 view:'<path d="M2 5l20-3M12 3.8v4"/><rect x="7" y="8" width="10" height="8" rx="2"/><path d="M7 12h10"/>',
 cafe:'<path d="M4 10h12v5c0 3-2.5 5-6 5s-6-2-6-5zM16 11h1.4a2.6 2.6 0 0 1 0 5H16M7 4c-1 1.5 1 2.5 0 4M11 4c-1 1.5 1 2.5 0 4"/>',
 camp:'<path d="M2 20L12 4l10 16zM12 12l3.5 8h-7z"/>',
 bike:'<circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l4-7h5l3 7M10 9l3 7H6M14 6h3"/>',
 food:'<path d="M3 12h18c0 5-3.5 8-9 8s-9-3-9-8zM14 3l5 8M17.5 3l4 7"/>'
};
window.thIcon=function(id){const f=_I[id];return f?`<svg class="tic" viewBox="0 0 24 24" ${_L} aria-hidden="true">${f}</svg>`:'';};
})();
