// Router and interactions.
const app=document.getElementById('app'),sw=document.getElementById('sweep');
function route(first){const h=location.hash.replace(/^#\/?/,''),[a,b]=h.split('/');
let html,key=a||'';
if(a=='projects'&&b){const p=P.find(x=>x.slug==b);html=p?detail(p):R[404]();}
else html=(R[key]||R[404])();
const go=()=>{app.innerHTML=html;scrollTo(0,0);document.title=(key||'Home')+' — Portfolio';document.querySelectorAll('.links a').forEach(l=>l.classList.toggle('on',l.dataset.r==key||(l.dataset.r===''&&key==='projects')));bind();if(!first)app.focus({preventScroll:true})};
if(first||matchMedia('(prefers-reduced-motion:reduce)').matches){go();return}
sw.classList.add('on');setTimeout(()=>{go();sw.classList.remove('on')},280)}
let typeTimer;
function typeIntro(){clearInterval(typeTimer);const el=document.querySelector('.intro');if(!el)return;
const lines=el.innerHTML.split(/<br\s*\/?>/i),full=lines.join(' ');
el.innerHTML='<span class="sr">'+full+'</span><span aria-hidden="true">'+lines.map(l=>l.split(' ').map(w=>'<span class="w">'+[...w].map(c=>'<span class="c">'+c+'</span>').join('')+'</span>').join(' ')).join('<br>')+'</span>';
const cs=[...el.querySelectorAll('.c')];
if(matchMedia('(prefers-reduced-motion:reduce)').matches){cs.forEach(c=>c.classList.add('on'));return}
const caret=document.createElement('span');caret.className='caret';let i=0;
typeTimer=setInterval(()=>{if(i>=cs.length){clearInterval(typeTimer);setTimeout(()=>caret.remove(),1500);return}
cs[i].classList.add('on');cs[i].after(caret);i++},32)}
function bind(){typeIntro();initGame();
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-pressed',x==b));document.querySelectorAll('.pcard').forEach(c=>{c.classList.toggle('h',!(b.dataset.f=='all'||c.dataset.c.split(' ').includes(b.dataset.f)))})});
document.querySelectorAll('.cn').forEach(n=>{const s=()=>{document.querySelectorAll('.cn').forEach(x=>x.classList.remove('on'));n.classList.add('on');document.getElementById('sk').innerHTML=`<h3>${n.dataset.k}</h3><p>${SK[n.dataset.k]}</p>`};n.onclick=s;n.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();s()}}});
document.querySelectorAll('.exp[style*="span"]').forEach(e=>{let sx,sy,ox=0,oy=0,d=0;e.onpointerdown=ev=>{if(ev.target.closest('button'))return;d=1;sx=ev.clientX-ox;sy=ev.clientY-oy;e.setPointerCapture(ev.pointerId);e.style.cursor='grabbing';e.style.zIndex=5};e.onpointermove=ev=>{if(!d)return;ox=ev.clientX-sx;oy=ev.clientY-sy;e.style.transform=`translate(${ox}px,${oy}px)`};e.onpointerup=()=>{d=0;e.style.cursor='grab'}})}
addEventListener('hashchange',()=>route(false));route(true);
const nav=document.getElementById('nav'),lk=document.getElementById('lk'),mb=document.getElementById('mb');
mb.onclick=()=>{const o=lk.classList.toggle('o');mb.setAttribute('aria-expanded',o)};lk.onclick=()=>{lk.classList.remove('o');mb.setAttribute('aria-expanded',false)};
