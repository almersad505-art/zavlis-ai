
(() => {
'use strict';
const id=document.querySelector('meta[name="clarity-project-id"]').content.trim();
// Track only the published site, never local previews or copies of this file.
if(!/^[a-z0-9]{4,32}$/i.test(id)||location.protocol!=='https:'||location.hostname!=='almersad505-art.github.io'||!location.pathname.startsWith('/zavlis-ai/'))return;
const key='zavlis.analytics-consent.v1.'+id;
let choice=null,started=false;
try{choice=localStorage.getItem(key);}catch{}
const panel=document.createElement('section');panel.className='analytics-panel';
const message=document.createElement('p');
const actions=document.createElement('div');actions.className='actions';
const accept=document.createElement('button');accept.type='button';accept.className='btn';
const decline=document.createElement('button');decline.type='button';decline.className='btn secondary';
const preferences=document.createElement('button');preferences.type='button';preferences.className='analytics-preferences';
actions.append(accept,decline);panel.append(message,actions);
function localize(){const ar=document.documentElement.lang==='ar';panel.setAttribute('aria-label',ar?'تفضيلات إحصاءات الزيارة':'Visit analytics preferences');message.textContent=ar?'هل تسمح بإحصاءات الزيارة عبر Microsoft Clarity؟ تُسجّل النقرات والتمرير وبيانات الجهاز مع إخفاء محتوى مساحة العمل. الرفض لا يؤثر على استخدام الأدوات.':'Allow Microsoft Clarity visit analytics? Clicks, scrolling and device information are recorded with workspace content masked. Declining does not affect the tools.';accept.textContent=ar?'السماح بالإحصاءات':'Allow analytics';decline.textContent=ar?'رفض التتبع':'Decline tracking';preferences.textContent=ar?'تفضيلات الإحصاءات':'Analytics preferences';}
function start(){if(started)return;started=true;window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments);};window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'});const script=document.createElement('script');script.async=true;script.src='https://www.clarity.ms/tag/'+encodeURIComponent(id);script.referrerPolicy='strict-origin-when-cross-origin';document.head.append(script);}
function decide(value){choice=value;try{localStorage.setItem(key,value);}catch{}panel.hidden=true;if(value==='granted')start();else if(started){window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'denied'});location.reload();}}
accept.addEventListener('click',()=>decide('granted'));decline.addEventListener('click',()=>decide('denied'));
preferences.addEventListener('click',()=>{panel.hidden=false;localize();decline.focus();});
localize();document.body.append(panel);(document.getElementById('contextRail')||document.body).append(preferences);panel.hidden=choice==='granted'||choice==='denied';if(choice==='granted')start();document.addEventListener('zavlis:locale',localize);
})();

new MutationObserver(()=>document.dispatchEvent(new Event('zavlis:locale'))).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
