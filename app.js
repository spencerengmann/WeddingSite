const cover=document.getElementById('cover'),invitation=document.getElementById('invitation'),opener=document.getElementById('open');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let opening=false,openingTimer,fadeTimer;
function showInvitation(animate=true){
 if(opening)return;opening=true;opener.setAttribute('aria-expanded','true');
 const duration=animate&&!reduced.matches?2400:0;
 invitation.hidden=false;window.scrollTo(0,0);
 if(duration){document.body.classList.add('opening-invitation');cover.classList.add('opening');fadeTimer=setTimeout(()=>{cover.classList.add('fading');invitation.classList.add('shown');},duration-700);}
 else invitation.classList.add('shown');
 openingTimer=setTimeout(()=>{cover.hidden=true;document.body.classList.remove('opening-invitation');document.getElementById('names').focus({preventScroll:true});},duration);
}
opener.addEventListener('click',()=>showInvitation());
document.getElementById('skip').addEventListener('click',event=>{event.preventDefault();showInvitation(false);});
document.getElementById('replay').addEventListener('click',()=>{clearTimeout(openingTimer);clearTimeout(fadeTimer);invitation.hidden=true;invitation.classList.remove('shown');cover.hidden=false;cover.classList.remove('opening','fading');document.body.classList.remove('opening-invitation');opening=false;opener.setAttribute('aria-expanded','false');window.scrollTo(0,0);opener.focus({preventScroll:true});});
if(window.location.hash&&document.getElementById(window.location.hash.slice(1))){showInvitation(false);setTimeout(()=>document.getElementById(window.location.hash.slice(1)).scrollIntoView(),80);}
function updateCountdown(){
 const wedding=new Date('2026-11-28T00:00:00-07:00').getTime(),remaining=Math.max(0,wedding-Date.now());
 document.getElementById('days').textContent=Math.floor(remaining/86400000);
 document.getElementById('hours').textContent=String(Math.floor(remaining/3600000)%24).padStart(2,'0');
 document.getElementById('minutes').textContent=String(Math.floor(remaining/60000)%60).padStart(2,'0');
 if(!remaining)document.getElementById('countdown-title').textContent=new Date().getTime()<wedding+86400000?'TODAY IS OUR WEDDING DAY':'OUR FOREVER BEGAN ON NOVEMBER 28, 2026';
}
updateCountdown();setInterval(updateCountdown,30000);
if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(element=>{element.classList.add('pending');observer.observe(element);});}
const photos=[...document.querySelectorAll('.gallery-photo')],lightbox=document.getElementById('lightbox');let activePhoto=0;
function renderPhoto(){const photo=photos[activePhoto];document.getElementById('large-photo').src=photo.dataset.full;document.getElementById('large-photo').alt=photo.querySelector('img').alt;document.getElementById('photo-caption').textContent=photo.dataset.caption;document.getElementById('photo-index').textContent=`${activePhoto+1} / ${photos.length}`;}
function movePhoto(direction){activePhoto=(activePhoto+direction+photos.length)%photos.length;renderPhoto();}
photos.forEach((photo,index)=>photo.addEventListener('click',()=>{activePhoto=index;renderPhoto();lightbox.showModal();document.body.classList.add('modal-open');}));
document.getElementById('close-photo').addEventListener('click',()=>lightbox.close());
document.getElementById('previous-photo').addEventListener('click',()=>movePhoto(-1));
document.getElementById('next-photo').addEventListener('click',()=>movePhoto(1));
lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');photos[activePhoto].focus({preventScroll:true});});
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();movePhoto(-1);}if(event.key==='ArrowRight'){event.preventDefault();movePhoto(1);}});
let touchStart;lightbox.addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX;},{passive:true});lightbox.addEventListener('touchend',event=>{const distance=event.changedTouches[0].clientX-touchStart;if(Math.abs(distance)>65)movePhoto(distance<0?1:-1);},{passive:true});
document.getElementById('share').addEventListener('click',async()=>{
 const url=new URL('./',window.location.href).href,status=document.getElementById('share-status');status.textContent='';
 try{if(navigator.share){await navigator.share({title:'Spencer & Nana Yaa · Our Wedding',text:'Celebrate with us on November 28, 2026 in South Jordan, Utah.',url});}else if(navigator.clipboard){await navigator.clipboard.writeText(url);status.textContent='Link copied. Paste it into your message.';}else{status.textContent='Copy this link: '+url;}}catch(error){if(error.name!=='AbortError')status.textContent='Copy this link: '+url;}
});
const photoRail=document.querySelector('.gallery-grid');
document.getElementById('gallery-back').addEventListener('click',()=>photoRail.scrollBy({left:-photoRail.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'}));
document.getElementById('gallery-forward').addEventListener('click',()=>photoRail.scrollBy({left:photoRail.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'}));
