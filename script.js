const $=s=>document.querySelector(s);
const art=$('#art'),log=$('#log'),lis=[...document.querySelectorAll('#steps li')],go=$('#go'),rel=$('#rel');
let ver=1,busy=false;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const say=(t,c)=>{log.insertAdjacentHTML('beforeend',`<div class="${c||''}">${t}</div>`);log.scrollTop=log.scrollHeight};
const setStage=n=>{art.className='stage-art s'+n};
go.onclick=async()=>{
  if(busy)return;busy=true;go.disabled=true;go.style.opacity=.6;
  const bug=$('#bug').checked,next=(ver+0.1).toFixed(1);
  lis.forEach(l=>l.className='');log.innerHTML='';
  rel.textContent=`release v${next} · planting`;
  setStage(0);
  const msgs=[
    ['commit a1f3c9e pushed. Lint, format and secret scan pass.'],
    ['image built from cache in 41s. Signed and pushed to registry.'],
    bug?['test <u>checkout_total</u> failed. A bug sneaked in.']:['212 tests pass. 0 critical vulnerabilities.'],
    ['canary 5% healthy → 25% → 100%. Release is live.'],
    ['customers pay a visit. Traffic hums at 200 OK, p95 28ms.']
  ];
  for(let i=0;i<5;i++){
    lis[i].classList.add('on');await wait(500);
    if(i===2&&bug){
      lis[i].className='fail';say('✕ '+msgs[i][0],'bad');
      art.classList.add('wilt');await wait(1100);
      say('↺ gate closed. Nothing reached users. Rolling back…','bad');
      await wait(900);art.className='stage-art s5';
      lis.forEach(l=>l.className='done');
      say(`<b>safe</b> v${ver.toFixed(1)} is still blooming. Fix the bug and try again.`);
      rel.textContent=`release v${ver.toFixed(1)} · blooming (v${next} rolled back)`;
      busy=false;go.disabled=false;go.style.opacity=1;return;
    }
    setStage(i+1);await wait(700);
    lis[i].className='done';say(`<b>✓ ${['seed','sprout','sapling','bloom','pollinate'][i]}</b> ${msgs[i][0]}`);
  }
  ver=+next;rel.textContent=`release v${ver.toFixed(1)} · blooming`;
  busy=false;go.disabled=false;go.style.opacity=1;
};
/* lens toggle */
const sunB=$('#lens-sun'),soilB=$('#lens-soil'),sunP=$('#pane-sun'),soilP=$('#pane-soil');
function lens(soil){
  sunP.hidden=soil;soilP.hidden=!soil;
  sunB.classList.toggle('on',!soil);soilB.classList.toggle('on',soil);
  sunB.setAttribute('aria-selected',!soil);soilB.setAttribute('aria-selected',soil);
}
sunB.onclick=()=>lens(false);soilB.onclick=()=>lens(true);

/* backend roots: simplified, sculpted cubic-bezier root system (soil_v3) */
const NS='http://www.w3.org/2000/svg',rg=$('#rg'),labels=$('#labels'),nodesG=$('#nodes'),dbEl=$('#db'),crownEl=$('#crown'),
  slog=$('#slog'),srel=$('#srel'),gbtn=$('#grow'),bl=[...document.querySelectorAll('#bsteps li')];
let all=[],instant=false;
function path(d,w,stage,delay=0){
  const el=document.createElementNS(NS,'path');
  el.setAttribute('d',d);el.setAttribute('pathLength',1);
  el.setAttribute('class','rt');
  el.setAttribute('stroke-width',w);
  if(instant)el.style.transition='none';
  else{el.style.transitionDelay=delay+'s';el.style.transitionDuration='.8s'}
  rg.appendChild(el);
  const b={w,el,stage};all.push(b);return b;
}
function pearl(x,y,delay=0,r=3.6){
  const c=document.createElementNS(NS,'circle');
  c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r);
  c.setAttribute('class','pearl');
  if(instant)c.style.transition='none';
  else c.style.transitionDelay=delay+'s';
  nodesG.appendChild(c);
}
function reveal(){
  void rg.getBoundingClientRect();
  rg.querySelectorAll('.rt:not(.go)').forEach(e=>e.classList.add('go'));
  nodesG.querySelectorAll('.pearl:not(.go)').forEach(e=>e.classList.add('go'));
}
function label(txt,x,y,anchor){
  const t=document.createElementNS(NS,'text');t.textContent=txt;t.setAttribute('x',x);t.setAttribute('y',y);
  t.setAttribute('text-anchor',anchor||'start');t.setAttribute('class','tag-l');
  if(instant)t.style.transition='none';
  labels.appendChild(t);void t.getBoundingClientRect();t.classList.add('go');
}
const builders=[
  ()=>{ // 1 taproot
    path('M200 44 C196 105 204 168 200 230',6.5,1,0);
    dbEl.classList.add('go');
  },
  ()=>{ // 2 main roots (4 graceful S-curved boughs, staggered)
    path('M198 96 C156 98 128 134 78 144',4.5,2,0);
    path('M202 110 C244 112 272 148 322 158',4.5,2,.18);
    path('M199 160 C166 164 142 194 106 208',3.8,2,.36);
    path('M201 172 C234 176 256 204 292 216',3.8,2,.54);
  },
  ()=>{ // 3 root crown (collar + 2 shallow surface roots)
    crownEl.classList.add('go');
    path('M196 47 C162 49 132 58 96 62',3.2,3,0);
    path('M204 47 C238 49 268 58 304 62',3.2,3,.2);
  },
  ()=>{ // 4 lateral roots (secondary & tertiary forks within domain silhouette)
    [
      ['M162 51 C146 62 128 72 106 78',2.3,0],
      ['M122 58 C104 66 86 72 68 75',2.0,.05],
      ['M238 51 C254 62 272 72 294 78',2.3,.1],
      ['M278 58 C296 66 314 72 332 75',2.0,.15],
      ['M164 104 C144 94 118 90 92 94',2.3,.2],
      ['M142 114 C126 134 108 150 84 162',2.5,.25],
      ['M112 130 C94 122 76 120 58 124',2.1,.3],
      ['M114 140 C102 154 88 166 70 174',2.0,.35],
      ['M236 118 C256 108 282 104 308 108',2.3,.4],
      ['M258 128 C274 148 292 164 316 176',2.5,.45],
      ['M288 144 C306 136 324 134 342 138',2.1,.5],
      ['M286 154 C298 168 310 178 326 186',2.0,.55],
      ['M172 170 C152 162 130 162 108 168',2.2,.6],
      ['M154 180 C142 198 126 214 106 226',2.4,.65],
      ['M130 195 C114 208 96 216 78 220',2.0,.7],
      ['M228 180 C248 172 270 172 292 178',2.2,.75],
      ['M246 192 C258 208 274 222 294 234',2.4,.8],
      ['M270 205 C286 216 304 224 322 228',2.0,.85],
      ['M199 196 C182 206 166 220 150 234',2.2,.9],
      ['M201 202 C218 212 232 222 246 234',2.2,.95]
    ].forEach(([d,w,dl])=>path(d,w,4,dl));
  },
  ()=>{ // 5 root hairs (abundant fine capillary wisps + golden cache pearls)
    [
      ['M174 49 C164 42 152 40 142 42',.01],
      ['M140 55 C130 48 118 46 108 48',.02],
      ['M108 60 C96 54 84 53 74 56',.04],
      ['M144 62 C136 70 126 76 116 79',.05],
      ['M126 68 C116 76 104 82 92 84',.06],
      ['M88 71 C76 78 64 82 54 83',.08],
      ['M226 49 C236 42 248 40 258 42',.09],
      ['M260 55 C270 48 282 46 292 48',.1],
      ['M292 60 C304 54 316 53 326 56',.12],
      ['M256 62 C264 70 274 76 284 79',.13],
      ['M274 68 C284 76 296 82 308 84',.14],
      ['M312 71 C324 78 336 82 346 83',.16],
      ['M178 99 C168 88 156 82 144 82',.18],
      ['M150 96 C138 86 126 82 114 84',.19],
      ['M130 93 C118 85 106 83 96 86',.2],
      ['M118 92 C106 100 94 104 82 104',.22],
      ['M152 108 C142 118 130 124 118 126',.23],
      ['M80 121 C68 116 58 116 48 120',.24],
      ['M96 138 C82 132 68 132 56 136',.26],
      ['M92 140 C80 148 68 152 56 154',.28],
      ['M124 132 C114 144 102 150 90 152',.3],
      ['M98 154 C86 164 74 168 62 170',.32],
      ['M86 166 C76 176 66 182 54 184',.34],
      ['M222 113 C232 102 244 96 256 96',.36],
      ['M250 110 C262 100 274 96 286 98',.37],
      ['M270 107 C282 99 294 97 304 100',.38],
      ['M282 106 C294 114 306 118 318 118',.4],
      ['M248 122 C258 132 270 138 282 140',.41],
      ['M320 135 C332 128 344 126 354 129',.42],
      ['M304 152 C318 146 332 146 344 150',.44],
      ['M308 154 C320 162 332 166 344 168',.46],
      ['M276 146 C286 158 298 164 310 166',.48],
      ['M302 168 C312 175 322 178 332 179',.5],
      ['M310 178 C316 186 322 192 330 195',.52],
      ['M146 164 C134 156 122 154 110 158',.54],
      ['M124 165 C112 172 100 176 88 178',.56],
      ['M164 174 C154 184 142 190 130 192',.57],
      ['M122 199 C108 192 96 192 84 196',.58],
      ['M138 198 C128 210 116 218 104 220',.6],
      ['M120 216 C110 226 98 232 86 234',.62],
      ['M96 214 C84 222 72 226 62 228',.64],
      ['M254 174 C266 166 278 164 290 168',.66],
      ['M276 175 C288 182 300 186 312 188',.68],
      ['M236 184 C246 194 258 200 270 202',.69],
      ['M278 209 C292 202 304 202 316 206',.7],
      ['M262 208 C272 220 284 228 296 230',.72],
      ['M280 224 C290 234 302 240 314 242',.74],
      ['M304 222 C316 230 328 234 338 236',.76],
      ['M198 128 C182 134 170 144 160 154',.78],
      ['M202 138 C218 144 230 154 240 164',.8],
      ['M176 212 C164 222 152 228 138 230',.82],
      ['M164 222 C156 234 146 242 134 246',.84],
      ['M224 216 C236 224 248 230 260 232',.86],
      ['M234 224 C242 234 252 240 264 242',.88],
      ['M199 214 C188 222 178 232 170 242',.9],
      ['M201 214 C210 220 218 228 224 236',.92]
    ].forEach(([d,dl])=>path(d,1.3,5,dl));
    [
      [96,62,.1,3.5],[304,62,.12,3.5],[68,75,.15,3],[332,75,.17,3],
      [92,94,.2,3.2],[308,108,.22,3.2],[58,124,.25,3.2],[342,138,.27,3.2],
      [78,144,.3,4],[322,158,.32,4],[84,162,.35,3.5],[316,176,.37,3.5],
      [70,174,.4,3],[326,186,.42,3],[106,208,.45,3.8],[292,216,.47,3.8],
      [78,220,.5,3.2],[322,228,.52,3.2],[106,226,.55,3.5],[294,234,.57,3.5],
      [150,234,.6,3.4],[246,234,.62,3.4],[170,242,.65,3],[224,236,.67,3]
    ].forEach(([x,y,dl,r])=>pearl(x,y,dl,r));
  }
];
const bmsgs=[
  'Tables, constraints and indexes set. Migration 0001 applied. Everything else hangs off this.',
  'Orders, users and billing modelled. Rules live in one place, not in routes.',
  'Typed REST and GraphQL endpoints, JWT auth, validation and rate limits. This is where the roots meet the trunk and everything passes up to the frontend.',
  'Job queue online. Emails, webhooks and exports spread out underground, off the request path.',
  'Redis cache, read replica, tracing and circuit breakers. Fine roots everywhere.'
];
const names=['taproot','main roots','root crown','lateral roots','root hairs'];
const bsay=(t,c)=>{slog.insertAdjacentHTML('beforeend',`<div class="${c||''}">${t}</div>`);slog.scrollTop=slog.scrollHeight};
let rooting=false;
function clearRoots(){all=[];rg.innerHTML='';labels.innerHTML='';nodesG.innerHTML='';dbEl.classList.remove('go');crownEl.classList.remove('go')}
/* first impression: fully grown, like the blooming plant in Sunlight */
function showGrown(){
  instant=true;clearRoots();
  builders.forEach(b=>b());reveal();
  bl.forEach(l=>l.className='done');
  instant=false;
}
async function growRoots(){
  if(rooting)return;rooting=true;gbtn.disabled=true;gbtn.style.opacity=.6;
  const slow=$('#slow').checked;
  clearRoots();
  bl.forEach(l=>l.className='');slog.innerHTML='';
  srel.textContent='backend · planting';
  for(let i=0;i<5;i++){
    bl[i].classList.add('on');await wait(350);
    builders[i]();reveal();
    await wait(i===4?1800:1300);
    if(i===2&&slow){
      bl[i].className='fail';
      bsay('✕ <u>GET /orders</u> runs an unindexed query. Pool exhausted, p99 4.2s.','bad');
      all.filter(b=>b.stage<=2).forEach(b=>{b.el.classList.add('strain');b.el.setAttribute('stroke-width',(b.w*.45).toFixed(1))});
      await wait(1700);
      bsay('↺ added composite index, query timeout and pool limit. Roots relax…','bad');
      await wait(900);
      all.filter(b=>b.stage<=2).forEach(b=>{b.el.classList.remove('strain');b.el.setAttribute('stroke-width',b.w)});
      await wait(700);
      bsay('<b>fixed</b> p99 down to 38ms. Growth continues.');
    }
    bl[i].className='done';bsay(`<b>✓ ${names[i]}</b> ${bmsgs[i]}`);
  }
  srel.textContent='backend · rooted and resilient';
  rooting=false;gbtn.disabled=false;gbtn.style.opacity=1;
}
gbtn.onclick=growRoots;
showGrown();
document.querySelectorAll('.bed .t').forEach(b=>b.onclick=()=>{
  const o=b.parentElement.classList.toggle('open');b.textContent=o?'Show less':'Read more'});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));

