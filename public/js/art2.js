/* 첫 화면·계절·숙소 그림 v2: 은은한 톤 그라데이션 + 가는 선 아이콘 (이미지 교체는 이 파일만 수정) */
let _n=0;
const _rd=(w,h,y,o)=>`M0 ${y+o[0]} C${w*.22} ${y+o[1]} ${w*.38} ${y+o[2]} ${w*.55} ${y+o[3]} S${w*.85} ${y+o[4]} ${w} ${y+o[5]} V${h} H0Z`;
const _ln='fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
function _sc(w,h,stops,glow,hills,icon,pos){const id='a2_'+(_n++);
 return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${pos||'xMidYMid slice'}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".25" y2="1">${stops.map((c,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient><radialGradient id="${id}r"><stop offset="0" stop-color="${glow[3]}" stop-opacity=".95"/><stop offset="1" stop-color="${glow[3]}" stop-opacity="0"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/><circle cx="${glow[0]}" cy="${glow[1]}" r="${glow[2]}" fill="url(#${id}r)"/>${hills.map(([y,o,f,op])=>`<path d="${_rd(w,h,y,o)}" fill="${f}" opacity="${op}"/>`).join('')}${icon||''}</svg>`;}
/* 아이콘 (80x92 기준 타일용) */
const _ic={
 blossom:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${c[2]||1})" ${_ln} opacity=".95"><circle r="2.2"/>${[0,72,144,216,288].map(a=>`<path transform="rotate(${a})" d="M0 -3 C-7 -9 -6 -17 0 -19 C6 -17 7 -9 0 -3Z"/>`).join('')}</g>`,
 sail:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${c[2]||1})" ${_ln}><path d="M0 -20 V4 M0 -20 C9 -12 11 -4 10 2 H0 M-2 -14 C-9 -8 -11 -3 -10 2 H-2"/><path d="M-14 8 H14 L10 13 H-10Z"/></g>`,
 leaf:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${.62*(c[2]||1)})" ${_ln} stroke-width="2.4"><path transform="translate(-40 -34)" d="M40 12 L44 23 L55 19 L51 31 L63 33 L54 41 L59 52 L47 48 L45 60 L40 53 L35 60 L33 48 L21 52 L26 41 L17 33 L29 31 L25 19 L36 23Z"/><path d="M0 26 V38"/></g>`,
 flake:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${c[2]||1})" ${_ln}>${[0,60,120].map(a=>`<path transform="rotate(${a})" d="M0 -17 V17 M-4 -12 L0 -16 L4 -12 M-4 12 L0 16 L4 12"/>`).join('')}</g>`,
 plane:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${c[2]||1})" ${_ln}><path d="M-15 -2 L15 -13 L7 14 L0 5Z M0 5 L15 -13"/></g>`,
 tent:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${c[2]||1})" ${_ln}><path d="M-22 14 L0 -14 L22 14Z M0 -14 V14 M-8 14 L0 2 L8 14"/></g>`,
 house:c=>`<g transform="translate(${c[0]} ${c[1]}) scale(${c[2]||1})" ${_ln}><path d="M-18 -2 L0 -16 L18 -2 M-14 -4 V14 H14 V-4 M-5 14 V4 H5 V14"/></g>`};
HOME_HERO=_sc(360,140,['#FFE7D1','#F2AE8C','#B96A86','#473B72'],[290,56,80,'#FFF1D6'],[[80,[8,-4,6,-2,8,2],'#8B5E8E',.55],[96,[6,10,0,6,-2,4],'#5E4A86',.75],[112,[4,-2,6,2,-4,2],'#3A3566',.95]],'','xMidYMax slice');
ST_HERO=HOME_HERO;
SEASON_ART={
 spring:_sc(80,92,['#FCEFF2','#F5CAD6','#E8A2BA'],[60,18,34,'#FFFFFF'],[[64,[0,-6,2,-3,4,0],'#C9DCC0',.9],[76,[2,-2,4,0,-3,2],'#9DBEA0',.95]],_ic.blossom([34,28,.75])),
 summer:_sc(80,92,['#D8F0F5','#7CC6DA','#2F88AA'],[60,18,30,'#FFF6CC'],[[58,[0,-3,2,-1,3,0],'#5CB4CF',.8],[70,[2,-2,1,2,-2,1],'#3D9BBE',.9],[80,[0,2,-2,1,-2,0],'#25789F',.95]],_ic.sail([34,28,.75])),
 autumn:_sc(80,92,['#FDE8CB','#E9A870','#B8532F'],[58,16,30,'#FFF2D2'],[[62,[0,-8,4,-4,6,-2],'#D2824F',.85],[74,[3,-3,5,0,-4,2],'#A5472B',.95]],_ic.leaf([36,28,.75])),
 winter:_sc(80,92,['#E6EDF9','#9AAFD6','#43598A'],[58,16,30,'#FFFFFF'],[[64,[2,-8,2,-4,4,0],'#C9D6EC',.9],[76,[0,-4,3,0,-3,2],'#7F94C0',.95]],_ic.flake([36,28,.75]))};
SEASON_BANNER={
 spring:_sc(360,84,['#FCEFF2','#F5CAD6','#E8A2BA'],[300,24,70,'#FFFFFF'],[[56,[0,-8,2,-4,4,0],'#C9DCC0',.9],[68,[2,-2,4,0,-3,2],'#9DBEA0',.95]],_ic.blossom([62,30]),'xMidYMax slice'),
 summer:_sc(360,84,['#D8F0F5','#7CC6DA','#2F88AA'],[300,24,70,'#FFF6CC'],[[52,[0,-3,2,-1,3,0],'#5CB4CF',.8],[64,[2,-2,1,2,-2,1],'#3D9BBE',.9],[74,[0,2,-2,1,-2,0],'#25789F',.95]],_ic.sail([62,32]),'xMidYMax slice'),
 autumn:_sc(360,84,['#FDE8CB','#E9A870','#B8532F'],[300,22,70,'#FFF2D2'],[[56,[0,-12,6,-6,8,-2],'#D2824F',.85],[68,[3,-3,5,0,-4,2],'#A5472B',.95]],_ic.leaf([62,32]),'xMidYMax slice'),
 winter:_sc(360,84,['#E6EDF9','#9AAFD6','#43598A'],[300,22,70,'#FFFFFF'],[[58,[2,-12,2,-6,4,0],'#C9D6EC',.9],[70,[0,-4,3,0,-3,2],'#7F94C0',.95]],_ic.flake([62,32]),'xMidYMax slice')};
ST_ART={stay:_sc(80,48,['#FBE9D6','#EDB58B','#C67A52'],[60,10,26,'#FFF3DC'],[[36,[0,-3,2,0,-2,0],'#B8694A',.6]],_ic.house([30,22])),
 camp:_sc(80,48,['#DDEFE1','#8EC3A0','#3F8A68'],[60,10,26,'#F4FFE8'],[[36,[0,-3,2,0,-2,0],'#2F6F55',.7]],_ic.tent([30,24]))};
HOME_ART.quick=`<svg viewBox="0 0 48 40" aria-hidden="true"><circle cx="24" cy="20" r="19" fill="#fff" opacity=".22"/><g transform="translate(24 20) scale(.8)" ${_ln}><path d="M-15 -2 L15 -13 L7 14 L0 5Z M0 5 L15 -13"/></g></svg>`;
HOME_ART.stays=_sc(360,84,['#1E3A4C','#2E5E66','#4F8478'],[300,18,60,'#E8F4E4'],[[58,[0,-6,4,-2,4,0],'#1B3A44',.8],[70,[2,-2,5,0,-3,2],'#142C36',.95]],`<g transform="translate(300 52)" ${_ln}><path d="M-22 14 L0 -14 L22 14Z M0 -14 V14 M-8 14 L0 2 L8 14"/></g>`,'xMidYMax slice');
