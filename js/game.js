// Playground game: "Squash the bugs". A cannon fires patches at UX bugs climbing the edge of the page.
// Edit TYPES (bug kinds, labels, speed, points) and TIERS (end-screen copy) to make it yours.
const TYPES={
  tap:{label:"Tiny tap target",r:13,speed:120,hp:1,pts:20},
  contrast:{label:"Low contrast",r:19,speed:80,hp:1,pts:10},
  text:{label:"Wall of text",r:15,speed:55,hp:2,pts:25,seg:4},
  icon:{label:"Mystery icon",r:19,speed:90,hp:1,pts:10},
  spinner:{label:"Endless spinner",r:21,speed:70,hp:1,pts:15}
};
const TIERS=[[0,"Bug spotted.","Every audit starts somewhere."],[60,"Good catch.","You would flag these in a design review."],[150,"Heuristic evaluator.","Nothing ships on your watch."],[300,"Chief exterminator.","Please review my next release."]];
const LIVES=3;
const C={o:"#E8743B",b:"#3F5C9A",y:"#F2C94C",k:"#1d1d1f"};
let G=null;
function gameHTML(){return`<div class="gm" id="gm"><div class="gm-stage" id="gstage" tabindex="0" role="application" aria-label="Bug squashing game. Aim with the mouse or the up and down arrow keys, fire with click or space."><canvas id="gcv" aria-hidden="true"></canvas>
<div class="gm-hud"><div><span>Score</span><b id="gs">0</b></div><div><span>Best</span><b id="gb">0</b></div><div><span>Releases left</span><b id="gl" aria-label="lives"></b></div><div class="gm-st" id="gst"></div></div>
<div class="gm-over on" id="gover"><div class="gm-card"><p class="mono" id="gk">Playground</p><h2 id="gh">Squash the bugs.</h2><p id="gp">Usability bugs are climbing the edge of this page. Aim the cannon with your mouse, click to fire. Lead your shots. Don't let three reach the top.</p><p class="gm-keys">Touch: tap to aim and fire. Keyboard: up/down arrows to aim, space to fire.</p><button class="btn p" id="gstart">Start</button></div></div></div>
<p class="sr" id="glive" aria-live="polite"></p></div>`}
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const eOut=t=>1-Math.pow(1-t,3),eBack=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(h,t)=>{const[a,b,c]=hex(h);return`rgb(${Math.round(lerp(a,255,t))},${Math.round(lerp(b,255,t))},${Math.round(lerp(c,255,t))})`};
function initGame(){const root=document.getElementById('gm');if(!root)return;if(G)G.stop();
const $=id=>document.getElementById(id),stage=$('gstage'),cv=$('gcv'),ctx=cv.getContext('2d');
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W=0,H=0,dpr=1,raf=0,last=0,clock=0;
const st={on:false,score:0,lives:LIVES,streak:0,best:0,fixed:0,shots:0,hits:0,maxStreak:0,t:0,spawnIn:.6,bugs:[],balls:[],parts:[],texts:[],ang:-.18,angD:-.18,cool:0,recoil:0,pulse:0,flash:0};
try{st.best=+localStorage.getItem('uxbest2')||0}catch(e){}
$('gb').textContent=st.best;
const say=t=>{$('glive').textContent=t};
function size(){const r=stage.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
size();
const WALL=()=>W-16,GROUND=()=>H-22,cannon=()=>({x:Math.min(80,W*.09),y:GROUND()-34});
function aimAt(px,py){const c=cannon();st.ang=clamp(Math.atan2(py-c.y,px-c.x),-1.35,.15)}
function fire(){if(!st.on||st.cool>0)return;const c=cannon(),L=62,a=st.angD;st.cool=.3;st.recoil=1;st.flash=1;st.shots++;
const mx=c.x+Math.cos(a)*L,my=c.y+Math.sin(a)*L;
st.balls.push({x:mx,y:my,vx:Math.cos(a)*1700,vy:Math.sin(a)*1700,hit:false,trail:[]});
for(let i=0;i<5;i++)st.parts.push({k:'puff',x:mx,y:my,vx:Math.cos(a)*(40+Math.random()*90)+(Math.random()-.5)*50,vy:Math.sin(a)*(40+Math.random()*90)-20-Math.random()*30,life:.7,max:.7,r:4,g:16+Math.random()*10,c:'#9aa0b4'});
for(let i=0;i<7;i++)st.parts.push({k:'dot',x:mx,y:my,vx:Math.cos(a)*(260+Math.random()*320)+(Math.random()-.5)*170,vy:Math.sin(a)*(260+Math.random()*320)+(Math.random()-.5)*170,life:.28,max:.28,s:1.8,c:C.y})}
function spawn(){const keys=Object.keys(TYPES),k=keys[Math.floor(Math.random()*keys.length)],T=TYPES[k],lvl=st.t/18,off=18+Math.random()*70;
st.bugs.push({k,T,x:WALL()-T.r-off,y:H+40,base:WALL()-T.r-off,amp:6+Math.random()*(k==='icon'?26:14),ph:Math.random()*6.28,hp:T.hp,v:T.speed*(1+lvl*.12)*(.9+Math.random()*.2),flash:0,pop:0,age:0})}
function burst(b){const cols=[C.o,C.y,C.b,'#F6B58A'];st.parts.push({k:'ring',x:b.x,y:b.y,life:.55,max:.55,r:b.T.r*.6,g:b.T.r*3.2,c:C.b});st.parts.push({k:'ring',x:b.x,y:b.y,life:.4,max:.4,r:b.T.r*.4,g:b.T.r*2,c:C.o});
for(let i=0;i<22;i++){const a=Math.random()*6.28,s=60+Math.random()*280;st.parts.push({k:'dot',x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-70,life:.55+Math.random()*.5,max:1,s:1.6+Math.random()*3.2,c:cols[i%4]})}}
function text(x,y,s,c){st.texts.push({x,y,s,c,life:1})}
function setLives(){const n=Math.max(0,st.lives);$('gl').innerHTML=[...Array(LIVES)].map((_,i)=>`<i class="${i<n?'':'off'}"></i>`).join('')}
function setStreak(){$('gst').textContent=st.streak>=2?'Streak ×'+st.streak:''}
function bugPts(b){if(b.k==='text'){const a=[];for(let i=0;i<b.T.seg;i++)a.push({x:b.x+Math.sin(b.ph-i*.6)*4,y:b.y+i*16});return a}return[{x:b.x,y:b.y}]}
function update(dt){st.t+=dt;st.cool=Math.max(0,st.cool-dt);
for(const b of st.bugs){b.age+=dt;b.y-=b.v*dt*Math.min(1,b.age*3);b.ph+=dt*3;b.x=b.base+Math.sin(b.ph)*b.amp*.6;b.flash=Math.max(0,b.flash-dt*5);b.pop=Math.max(0,b.pop-dt*5)}
st.spawnIn-=dt;if(st.spawnIn<=0){spawn();st.spawnIn=Math.max(.5,1.7-st.t*.022)*(.8+Math.random()*.4)}
for(const q of st.balls){q.x+=q.vx*dt;q.y+=q.vy*dt;q.trail.push({x:q.x,y:q.y});if(q.trail.length>12)q.trail.shift();
for(const b of st.bugs){if(q.hit||b.dead)continue;const R=b.T.r+12;let h=false;for(const p of bugPts(b)){if(Math.hypot(q.x-p.x,q.y-p.y)<R){h=true;break}}
if(h){q.hit=true;st.hits++;b.hp--;b.flash=1;b.pop=1;for(let i=0;i<5;i++)st.parts.push({k:'dot',x:q.x,y:q.y,vx:(Math.random()-.5)*220-60,vy:(Math.random()-.5)*220,life:.3,max:.3,s:2,c:C.o});
if(b.hp<=0){b.dead=true;st.fixed++;st.streak++;st.maxStreak=Math.max(st.maxStreak,st.streak);const pt=b.T.pts+Math.min(st.streak-1,5)*2;st.score+=pt;burst(b);text(b.x-34,b.y-6,'Fixed +'+pt,C.b);$('gs').textContent=st.score;setStreak()}else{text(b.x-22,b.y-6,'Hit',C.o)}}}
if(!q.hit&&(q.x>W+20||q.y<-20||q.y>H+20||q.x<-20)){q.hit=true;if(st.streak>0){st.streak=0;setStreak()}}}
st.balls=st.balls.filter(q=>!q.hit);
for(const b of st.bugs){if(!b.dead&&b.y<-14){b.dead=true;st.lives--;st.streak=0;setStreak();setLives();st.pulse=1;text(WALL()-170,26,'Shipped to production',C.o);say('A bug shipped. '+st.lives+' releases left.')}}
st.bugs=st.bugs.filter(b=>!b.dead);
for(const p of st.parts){p.life-=dt;if(p.k==='dot'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=520*dt;p.vx*=1-1.2*dt}else if(p.k==='puff'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-2.2*dt;p.vy*=1-2.2*dt}}
st.parts=st.parts.filter(p=>p.life>0);
for(const t of st.texts){t.y-=46*dt*Math.max(.15,t.life);t.life-=dt*1.05}st.texts=st.texts.filter(t=>t.life>0);
if(st.lives<=0)end()}
function tick(dt){clock+=dt;st.recoil*=Math.exp(-dt*13);st.flash=Math.max(0,st.flash-dt*9);st.pulse=Math.max(0,st.pulse-dt*1.6);st.angD+=(st.ang-st.angD)*Math.min(1,dt*20)}
/* ---------- drawing ---------- */
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function pill(txt,x,y,col,alpha){ctx.save();ctx.globalAlpha=alpha;ctx.font='600 12px "Libre Franklin",system-ui,sans-serif';const w=ctx.measureText(txt).width+16;
ctx.shadowColor='rgba(29,29,31,.14)';ctx.shadowBlur=10;ctx.shadowOffsetY=3;ctx.fillStyle='rgba(255,255,255,.96)';rr(x-w,y-11,w,22,11);ctx.fill();ctx.shadowColor='transparent';ctx.strokeStyle=col;ctx.globalAlpha=alpha*.55;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=alpha;ctx.fillStyle=col;ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText(txt,x-8,y+.5);ctx.restore()}
function ball(x,y,r,c1,c2){const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r*1.05);g.addColorStop(0,c1);g.addColorStop(1,c2);return g}
function legs(r,t,pairs,col,len,w){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';
for(let i=0;i<pairs;i++){const hy=-r*.55+i*(r*1.1/(pairs-1||1));for(const s of[-1,1]){const ph=t*2.4+i*2.1+(s>0?Math.PI:0),lift=Math.sin(ph),fx=s*(r*.8+len),fy=hy+Math.cos(ph)*5,kx=s*(r*.7+len*.55),ky=hy-4-Math.max(0,lift)*5;
ctx.beginPath();ctx.moveTo(s*r*.55,hy);ctx.quadraticCurveTo(kx,ky,fx,fy);ctx.stroke()}}}
function antennae(r,t,col){ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.lineCap='round';const sw=Math.sin(t*2)*2.5;for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*r*.22,-r*.85);ctx.quadraticCurveTo(s*(r*.45+sw),-r*1.35,s*(r*.8+sw*1.4),-r*1.6);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(s*(r*.8+sw*1.4),-r*1.6,1.5,0,6.28);ctx.fill()}}
function eyes(r){for(const s of[-1,1]){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s*r*.3,-r*.5,r*.19,0,6.28);ctx.fill();ctx.fillStyle=C.k;ctx.beginPath();ctx.arc(s*r*.3,-r*.56,r*.09,0,6.28);ctx.fill()}}
const PAL={tap:['#8FB0E8','#3F5C9A'],contrast:['#F1F1F3','#C4C4CB'],icon:['#C9B5EC','#7E63AE'],spinner:['#7a7a86','#34343c'],text:['#B9D6A4','#6E9A58']};
function drawBug(b){const r=b.T.r,t=b.ph,k=b.k,[c1,c2]=PAL[k],fl=b.flash,sc=eBack(clamp(b.age/.45,0,1))*(1+.16*b.pop),al=clamp(b.age/.25,0,1);
ctx.save();ctx.globalAlpha=al;ctx.translate(b.x,b.y);ctx.scale(sc,sc);
const edge='rgba(29,29,31,.78)',F=c=>fl>0?mix(c.startsWith('#')?c:'#ffffff',.45+fl*.4):c;
const shadow=()=>{ctx.shadowColor='rgba(29,29,31,.2)';ctx.shadowBlur=12;ctx.shadowOffsetY=4};const noshadow=()=>{ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0};
if(k==='text'){const n=b.T.seg;for(let i=n-1;i>=0;i--){ctx.save();ctx.translate(Math.sin(t-i*.6)*4,i*16);shadow();ctx.fillStyle=ball(0,0,r*.8,F(i%2?'#CFE3BF':c1),F(i%2?'#7FA66A':c2));ctx.strokeStyle=edge;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,r*.8,0,6.28);ctx.fill();noshadow();ctx.stroke();
ctx.strokeStyle='rgba(29,29,31,.35)';ctx.lineWidth=1.2;ctx.lineCap='round';for(let j=-1;j<=1;j++){ctx.beginPath();ctx.moveTo(-6,j*3.6);ctx.lineTo(j===1?2:6,j*3.6);ctx.stroke()}ctx.restore()}
ctx.translate(Math.sin(t)*4,-3);shadow();ctx.fillStyle=ball(0,0,r*.92,F('#C6DFB2'),F('#5F8C4B'));ctx.strokeStyle=edge;ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(0,0,r*.92,0,6.28);ctx.fill();noshadow();ctx.stroke();antennae(r*.9,t,edge);eyes(r*.9);
ctx.restore();pill(b.T.label+(b.hp>1?'  ×2':''),b.x-r-12,b.y+9,C.o,al);return}
legs(r,t,k==='tap'?3:4,edge,k==='tap'?8:12,1.3);
if(k==='icon'){const f=Math.sin(t*3.2)*.22;for(const s of[-1,1]){ctx.save();ctx.scale(s,1);ctx.rotate(f);shadow();ctx.fillStyle=F('#E2D8F6');ctx.globalAlpha=al*.85;ctx.strokeStyle=edge;ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(r*.95,-5,r*1,r*.72,.5,0,6.28);ctx.fill();noshadow();ctx.stroke();ctx.globalAlpha=al;ctx.strokeStyle='rgba(126,99,174,.35)';ctx.beginPath();ctx.moveTo(r*.3,-3);ctx.quadraticCurveTo(r*1,-8,r*1.6,-10);ctx.stroke();ctx.restore()}}
shadow();ctx.fillStyle=ball(0,-1,r,F(c1),F(c2));ctx.strokeStyle=edge;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(0,0,r*(k==='tap'?.76:.82),r,0,0,6.28);ctx.fill();noshadow();ctx.stroke();
if(k==='contrast'){ctx.fillStyle='rgba(255,255,255,.75)';for(const[x,y,q]of[[-6,-4,3],[6,-2,2.6],[-4,8,2.4],[5,9,3]]){ctx.beginPath();ctx.arc(x,y,q,0,6.28);ctx.fill()}ctx.strokeStyle='rgba(120,120,128,.55)';ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(0,r);ctx.stroke()}
if(k==='icon'){ctx.fillStyle='rgba(255,255,255,.95)';ctx.font='700 17px "Libre Franklin",system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',0,4)}
if(k==='spinner'){ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(0,6,8,0,6.28);ctx.stroke();ctx.strokeStyle=C.y;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,6,8,b.ph*4,b.ph*4+1.9);ctx.stroke()}
if(k==='tap'){ctx.strokeStyle='rgba(232,116,59,.8)';ctx.lineWidth=1.1;ctx.setLineDash([2.5,3.5]);ctx.lineDashOffset=-t*6;ctx.beginPath();ctx.arc(0,0,r+6,0,6.28);ctx.stroke();ctx.setLineDash([])}
antennae(r,t,edge);eyes(r);ctx.restore();pill(b.T.label,b.x-r-12,b.y+2,k==='contrast'?'#85858d':C.o,al)}
function drawCannon(){const c=cannon(),L=62,rec=st.recoil*11;ctx.save();ctx.translate(c.x,c.y);
// carriage
ctx.shadowColor='rgba(29,29,31,.2)';ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle=C.k;ctx.beginPath();ctx.moveTo(-36,34);ctx.lineTo(36,34);ctx.quadraticCurveTo(32,10,18,2);ctx.lineTo(-18,2);ctx.quadraticCurveTo(-32,10,-36,34);ctx.closePath();ctx.fill();ctx.shadowColor='transparent';
// barrel
ctx.save();ctx.rotate(st.angD);ctx.translate(-rec,0);const g=ctx.createLinearGradient(0,-13,0,13);g.addColorStop(0,'#7B97D1');g.addColorStop(.35,C.b);g.addColorStop(1,'#26396a');ctx.fillStyle=g;rr(-6,-13,L+8,26,8);ctx.fill();
ctx.fillStyle='rgba(255,255,255,.28)';rr(2,-9,L-8,3,1.5);ctx.fill();ctx.fillStyle=C.o;rr(L-6,-13,8,26,3);ctx.fill();ctx.fillStyle='rgba(29,29,31,.55)';ctx.beginPath();ctx.ellipse(L+2,0,2.4,8,0,0,6.28);ctx.fill();ctx.restore();
// wheel
ctx.fillStyle='#fff';ctx.strokeStyle=C.k;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,16,22,0,6.28);ctx.fill();ctx.stroke();ctx.lineWidth=1.2;ctx.strokeStyle='rgba(29,29,31,.35)';for(let i=0;i<6;i++){const a=i*1.0472+clock*0;ctx.beginPath();ctx.moveTo(Math.cos(a)*5,16+Math.sin(a)*5);ctx.lineTo(Math.cos(a)*19,16+Math.sin(a)*19);ctx.stroke()}ctx.fillStyle=C.o;ctx.beginPath();ctx.arc(0,16,5,0,6.28);ctx.fill();
ctx.restore();
if(st.flash>0){const mx=c.x+Math.cos(st.angD)*(L+6),my=c.y+Math.sin(st.angD)*(L+6),g2=ctx.createRadialGradient(mx,my,0,mx,my,34);g2.addColorStop(0,`rgba(255,236,170,${.9*st.flash})`);g2.addColorStop(1,'rgba(242,201,76,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(mx,my,34,0,6.28);ctx.fill()}
// aim guide
const x0=c.x+Math.cos(st.angD)*(L+22),y0=c.y+Math.sin(st.angD)*(L+22),x1=c.x+Math.cos(st.angD)*W*.7,y1=c.y+Math.sin(st.angD)*W*.7,gg=ctx.createLinearGradient(x0,y0,x1,y1);gg.addColorStop(0,'rgba(63,92,154,.4)');gg.addColorStop(1,'rgba(63,92,154,0)');
ctx.strokeStyle=gg;ctx.lineWidth=1.5;ctx.setLineDash([2,9]);ctx.lineCap='round';ctx.lineDashOffset=-clock*14;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.setLineDash([])}
function drawWall(){const x=WALL(),sh=still?0:Math.sin(clock*70)*2.5*st.pulse*st.pulse;ctx.save();ctx.translate(sh,0);
const bg=ctx.createLinearGradient(x-26,0,x+16,0);bg.addColorStop(0,'rgba(244,244,246,0)');bg.addColorStop(1,'rgba(244,244,246,1)');ctx.fillStyle=bg;ctx.fillRect(x-26,0,W-x+26+4,H);
if(st.pulse>0){const pg=ctx.createLinearGradient(x-60,0,x+6,0);pg.addColorStop(0,'rgba(232,116,59,0)');pg.addColorStop(1,`rgba(232,116,59,${.35*st.pulse})`);ctx.fillStyle=pg;ctx.fillRect(x-60,0,66,H)}
const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#EDEBA8');g.addColorStop(.5,'#F4A877');g.addColorStop(1,'#A9B6D6');ctx.fillStyle=g;ctx.fillRect(x,0,4,H);
ctx.strokeStyle='rgba(29,29,31,.16)';ctx.lineWidth=1;const off=(clock*18)%40;for(let y=-40+off;y<H;y+=40){ctx.beginPath();ctx.moveTo(x+8,y);ctx.lineTo(x+12,y);ctx.stroke()}ctx.restore()}
function drawBg(){ctx.fillStyle='rgba(29,29,31,.09)';for(let x=24;x<W;x+=32)for(let y=24;y<GROUND();y+=32){ctx.fillRect(x,y,1.4,1.4)}
const g=ctx.createLinearGradient(0,GROUND()-60,0,GROUND());g.addColorStop(0,'rgba(63,92,154,0)');g.addColorStop(1,'rgba(63,92,154,.06)');ctx.fillStyle=g;ctx.fillRect(0,GROUND()-60,W,60);
ctx.strokeStyle='rgba(29,29,31,.22)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,GROUND()+.5);ctx.lineTo(W,GROUND()+.5);ctx.stroke()}
function draw(){ctx.clearRect(0,0,W,H);drawBg();drawWall();for(const b of st.bugs)drawBug(b);
for(const q of st.balls){const n=q.trail.length;for(let i=0;i<n;i++){const p=q.trail[i],f=(i+1)/n;ctx.fillStyle=`rgba(232,116,59,${.28*f})`;ctx.beginPath();ctx.arc(p.x,p.y,1.5+5.5*f,0,6.28);ctx.fill()}
const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,16);g.addColorStop(0,'rgba(232,116,59,.45)');g.addColorStop(1,'rgba(232,116,59,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,16,0,6.28);ctx.fill();ctx.fillStyle=ball(q.x,q.y,7,'#FFD0AE',C.o);ctx.beginPath();ctx.arc(q.x,q.y,7,0,6.28);ctx.fill();ctx.strokeStyle='rgba(29,29,31,.6)';ctx.lineWidth=1.1;ctx.stroke()}
for(const p of st.parts){const f=clamp(p.life/p.max,0,1);if(p.k==='dot'){ctx.globalAlpha=f;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(.4+.6*f),0,6.28);ctx.fill()}
else if(p.k==='ring'){const e=eOut(1-f);ctx.globalAlpha=f*.7;ctx.strokeStyle=p.c;ctx.lineWidth=1+2*f;ctx.beginPath();ctx.arc(p.x,p.y,p.r+p.g*e,0,6.28);ctx.stroke()}
else{ctx.globalAlpha=f*.35;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r+p.g*(1-f),0,6.28);ctx.fill()}}ctx.globalAlpha=1;
for(const t of st.texts){const a=clamp(t.life*1.4,0,1),sc=1+.18*Math.max(0,t.life-.8)*5;ctx.save();ctx.globalAlpha=a;ctx.translate(t.x,t.y);ctx.scale(sc,sc);ctx.fillStyle=t.c;ctx.font='700 15px "Libre Franklin",system-ui,sans-serif';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(t.s,0,0);ctx.restore()}
drawCannon()}
function loop(ts){if(!document.body.contains(root)){stop();return}raf=requestAnimationFrame(loop);const dt=Math.min(.05,(ts-last)/1000||0);last=ts;tick(dt);if(st.on&&!document.hidden)update(dt);else for(const p of st.parts){p.life-=dt}draw()}
function stop(){cancelAnimationFrame(raf);raf=0;st.on=false;removeEventListener('resize',size)}
function end(){st.on=false;const tier=[...TIERS].reverse().find(t=>st.score>=t[0]),nb=st.score>st.best&&st.score>0;if(nb){st.best=st.score;try{localStorage.setItem('uxbest2',st.best)}catch(e){}}
$('gb').textContent=st.best;const acc=st.shots?Math.round(st.hits/st.shots*100):0;
$('gk').textContent=nb?'New best':'Three bugs shipped';$('gh').textContent=tier[1]+' '+st.score+' pts';
$('gp').textContent=tier[2]+' Fixed '+st.fixed+', accuracy '+acc+'%, best streak '+st.maxStreak+'.';
$('gstart').textContent='Play again';$('gover').classList.add('on');$('gstart').focus({preventScroll:true});say('Game over. '+st.score+' points.')}
function start(){Object.assign(st,{on:true,score:0,lives:LIVES,streak:0,fixed:0,shots:0,hits:0,maxStreak:0,t:0,spawnIn:.6,bugs:[],balls:[],parts:[],texts:[],cool:0});
$('gs').textContent=0;setLives();setStreak();$('gover').classList.remove('on');stage.focus({preventScroll:true});say('Go')}
const pt=e=>{const r=stage.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
stage.addEventListener('pointermove',e=>{const[x,y]=pt(e);aimAt(x,y)});
stage.addEventListener('pointerdown',e=>{if(e.target.closest('.gm-over'))return;const[x,y]=pt(e);aimAt(x,y);if(e.pointerType!=='mouse')st.angD=st.ang;fire();e.preventDefault()});
stage.addEventListener('keydown',e=>{if(!st.on)return;if(e.key===' '||e.key==='Enter'){fire();e.preventDefault()}else if(e.key==='ArrowUp'){st.ang=Math.max(-1.35,st.ang-.07);e.preventDefault()}else if(e.key==='ArrowDown'){st.ang=Math.min(.15,st.ang+.07);e.preventDefault()}});
$('gstart').onclick=start;addEventListener('resize',size);
setLives();raf=requestAnimationFrame(loop);
G={stop};root.__st=st}
