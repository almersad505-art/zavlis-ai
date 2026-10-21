'use strict';
// Visual dashboard adapter; the accepted local tool engines remain unchanged.
const referenceBaseDraw = draw;
const referenceNames = ['Smart Match','Image Studio','Video Starter','Prompt Studio','Code Lab'];
const referenceArabic = ['المطابقة الذكية','استوديو الصور','مساعد الفيديو','مختبر البرومبتات','مختبر البرمجة'];
const iconPaths = {
 match:'<circle cx="9" cy="7" r="3"/><circle cx="18" cy="9" r="2.5"/><path d="M3 21v-3a6 6 0 0 1 12 0v3ZM16 15a4 4 0 0 1 6 3v3h-4"/>',
 image:'<rect x="3" y="3" width="20" height="20" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m5 21 6-8 4 4 3-5 4 9"/>',
 video:'<rect x="3" y="3" width="20" height="20" rx="5"/><path d="m11 8 7 5-7 5Z"/>',
 prompt:'<rect x="5" y="2" width="17" height="22" rx="3"/><path d="M10 7h7M10 12h9M10 17h6"/>',
 code:'<path d="m8 6-6 7 6 7m11-14 6 7-6 7m-4-17-4 21"/>',
 media:'<rect x="2" y="3" width="9" height="9" rx="2"/><rect x="15" y="3" width="9" height="9" rx="2"/><rect x="2" y="16" width="9" height="9" rx="2"/><path d="m17 16 7 4-7 4Z"/>',
 compare:'<rect x="3" y="4" width="8" height="18" rx="2"/><rect x="15" y="4" width="8" height="18" rx="2"/><path d="M6 9h2m10 0h2M6 14h2m10 0h2"/>',
 guide:'<path d="M4 3h15a3 3 0 0 1 3 3v17H7a3 3 0 0 1-3-3Zm0 15h18M9 7h8M9 11h6"/>',
 project:'<circle cx="13" cy="13" r="11"/><path d="m8 7 5 5 5-5m-5 5v7m-4 0h8"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m17 17 7 7"/>',
 globe:'<circle cx="13" cy="13" r="11"/><ellipse cx="13" cy="13" rx="5" ry="11"/><path d="M2 13h22"/>',
 sun:'<circle cx="13" cy="13" r="5"/><path d="M13 1v3m0 18v3M1 13h3m18 0h3M4 4l2 2m14 14 2 2M4 22l2-2M20 6l2-2"/>',
 user:'<circle cx="13" cy="8" r="4"/><path d="M5 24v-3a8 8 0 0 1 16 0v3Z"/>',
 trend:'<path d="m2 20 7-8 5 4 9-12m-7 0h7v7"/>'
};
const icon = (name,color='')=>`<span class="icon"${color?` style="--icon-color:${color}"`:''}><svg viewBox="0 0 26 26" aria-hidden="true">${iconPaths[name]||iconPaths.match}</svg></span>`;
const colors=['#51c8ff','#bb52fa','#e04680','#6953ff','#00d9bb'];
const destinations = '';
const featuredTools = [
 {name:'ChatGPT',desc:'Writing & Research',ar:'الكتابة والبحث',url:'https://chatgpt.com/',image:'chatgpt-clean.svg'},
 {name:'Midjourney',desc:'Image Generation',ar:'توليد الصور',url:'https://www.midjourney.com/',image:'midjourney-clean.svg'},
 {name:'Runway',desc:'Video Generation',ar:'توليد الفيديو',url:'https://runwayml.com/',mark:'R',bg:'#00a894'},
 {name:'Claude',desc:'Analysis & Writing',ar:'التحليل والكتابة',url:'https://claude.ai/',mark:'✳',bg:'#db785d'},
 {name:'Gemini',desc:'Multimodal AI',ar:'ذكاء متعدد الوسائط',url:'https://gemini.google.com/',image:'gemini.webp'},
 {name:'Canva',desc:'Design & Media',ar:'التصميم والوسائط',url:'https://www.canva.com/',image:'canva-clean.svg'}
];
const guideItems = [
 {title:'Choose the right AI tool',ar:'كيف تختار أداة الذكاء الاصطناعي المناسبة',href:'best-ai-for.html',icon:'match',photo:'guide-tool'},
 {title:'Build better prompts',ar:'ابدأ بصياغة أوامر واضحة وفعالة',href:'guides.html',icon:'prompt',photo:'guide-prompts'},
 {title:'AI for your next project',ar:'أدوات عملية للطلاب والأعمال',href:'for-business.html',icon:'code',photo:'guide-project'}
];
const toolLogo=t=>t.image?`<img src="assets/${t.image}" alt="${t.name}" width="36" height="36" loading="lazy">`:`<span class="tool-logo" style="--logo-bg:${t.bg}">${t.mark}</span>`;
let trendMode='tools';
const sessionOutputs=[];
function openDialog(title,nodes){$('dialogTitle').textContent=title;$('dialogBody').replaceChildren(...nodes);$('sessionDialog').showModal();}
function showProjects(){const text=document.createElement('p');text.textContent=lang==='ar'?'مخرجات هذه الجلسة فقط. تُحذف عند إعادة تحميل الصفحة؛ نزّل ما تريد الاحتفاظ به.':'Outputs from this session only. Reloading clears them; download anything you want to keep.';const list=document.createElement('ol');for(const output of sessionOutputs){const li=document.createElement('li');const title=document.createElement('strong');title.textContent=output.tool;const pre=document.createElement('pre');pre.className='output';pre.textContent=output.text;li.append(title,pre);list.append(li);}if(!sessionOutputs.length){const p=document.createElement('p');p.textContent=lang==='ar'?'لا توجد مخرجات بعد. اختر أداة وابدأ.':'No outputs yet. Choose a tool to begin.';list.append(p);}openDialog('My Projects / مشاريعي',[text,list]);}
function launchTool(index){mod=index;draw();$('studio').hidden=false;$('mediaLab').hidden=true;$('studio').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
function openMedia(){ $('studio').hidden=true;$('mediaLab').hidden=false;$('mediaLab').scrollIntoView({behavior:'smooth'});document.querySelectorAll('.nav .active').forEach(n=>n.classList.remove('active'));document.querySelector('[data-media]')?.classList.add('active');}
function renderTrending(){const toolsTab=$('trendTools'),guidesTab=$('trendGuides');toolsTab.classList.toggle('active',trendMode==='tools');guidesTab.classList.toggle('active',trendMode==='guides');toolsTab.setAttribute('aria-selected',String(trendMode==='tools'));guidesTab.setAttribute('aria-selected',String(trendMode==='guides'));$('trendingList').setAttribute('aria-labelledby',trendMode==='tools'?'trendTools':'trendGuides');if(trendMode==='tools'){const sora={name:'Sora',desc:'Video Generation · discontinued',ar:'توليد الفيديو · متوقف',url:'https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation',mark:'◎',bg:'#1f87e6'};const list=[sora,featuredTools[1],featuredTools[0],featuredTools[5],featuredTools[3]];$('trendingList').innerHTML=list.map((t,i)=>`<a class="trend-row" href="${t.url}" target="_blank" rel="noopener noreferrer"><span class="rank">${i+1}</span><span class="tool-title">${toolLogo(t)}</span><span class="trend-label"><b>${t.name}</b> – ${t.desc}<small>${t.ar}</small></span><span aria-hidden="true">→</span></a>`).join('');}else{$('trendingList').innerHTML=guideItems.map((g,i)=>`<a class="trend-row" href="${destinations+g.href}" target="_blank" rel="noopener noreferrer"><span class="rank">${i+1}</span>${icon(g.icon)}<span class="trend-label">${g.title}<small>${g.ar}</small></span><span aria-hidden="true">→</span></a>`).join('');}}
function filterCatalog(){const query=$('searchInput').value.trim().toLowerCase();const scope=$('searchScope').value;let count=0;document.querySelectorAll('#toolsGrid .toolcard,#guidesGrid .guide-card').forEach(card=>{const tool=card.classList.contains('toolcard');const relevant=scope==='all'||(scope==='tools'&&tool)||(scope==='guides'&&!tool);card.hidden=!relevant||!card.textContent.toLowerCase().includes(query);if(!card.hidden)count++;});$('searchEmpty').hidden=count>0;}
draw=function(){
 referenceBaseDraw();
 // Keep the visual left-to-right composition of the bilingual reference.
 $('dashboardLayout').setAttribute('dir',lang==='ar'?'rtl':'ltr');
 const navItem=(idx,key)=>`<button type="button" data-launch="${idx}" class="${mod===idx?'active':''}" aria-pressed="${mod===idx}">${icon(key,colors[idx])}<span>${referenceNames[idx]}<small>${referenceArabic[idx]}</small></span></button>`;
 $('sideNav').innerHTML=navItem(0,'match')+`<button type="button" data-media>${icon('media','#75beff')}<span>Media Lab<small>مركز الإنتاج</small></span></button>`+navItem(1,'image')+navItem(2,'video')+navItem(3,'prompt')+navItem(4,'code')+`<a href="${destinations}comparisons.html" target="_blank" rel="noopener noreferrer">${icon('compare','#54d4fa')}<span>Compare Tools<small>مقارنة الأدوات</small></span></a><a href="#guides">${icon('guide','#e7a75c')}<span>Guides<small>الأدلة</small></span></a><button type="button" id="projectsButton">${icon('project','#93baff')}<span>My Projects<small>مشاريعي</small></span></button>`;
 const navLinks=[['#home','Home','الرئيسية'],['#tools','AI Tools','أدوات الذكاء الاصطناعي'],[destinations+'comparisons.html','Compare','المقارنات'],['#guides','Guides','الأدلة'],[destinations+'for-students.html','For Students','للطلاب'],[destinations+'for-business.html','For Business','للأعمال'],[destinations+'about.html','About','حول']];
 document.querySelector('.topnav').innerHTML=navLinks.map(([url,en,ar])=>`<a href="${url}"${url.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}>${en}<small>${ar}</small></a>`).join('');
 $('eyebrow').innerHTML='<span>A smarter way to choose and use AI<small>طريقة أذكى لاختيار واستخدام الذكاء الاصطناعي</small></span>';
 $('heroTitle').innerHTML='Less guessing. <span class="accent">More doing.</span>';
 $('heroArabic').innerHTML='أفكارك اليوم... <em>نتائج</em> حقيقية غدًا';
 $('heroDesc').innerHTML='Find the best AI tools, prepare creative content, and get started.<span>ابحث عن الأدوات، وجهّز محتواك وخططك في مساحة واحدة.</span>';
 $('jump').innerHTML='<span>Try Smart Match<small>جرّب المطابقة الذكية</small></span> →';
 $('seeTools').innerHTML='<span>Explore Media Lab<small>استكشف مركز الإنتاج</small></span> →';
 $('jump').onclick=()=>launchTool(0);$('seeTools').onclick=openMedia;
 $('heroChips').innerHTML=[['image','Images','صور'],['video','Videos','فيديوهات'],['code','Code','برمجة'],['prompt','Write','كتابة']].map(([name,en,ar])=>`<span class="hero-chip">${icon(name)}<span>${en}<small>${ar}</small></span></span>`).join('');
 const shortEn=['Find the best AI tools for your task','Prepare stunning visual briefs','Turn your idea into a complete video plan','Create and improve prompts for any task','Generate and customize starter HTML'];
 const shortAr=['اعثر على الأدوات المناسبة لمهمتك','جهّز أوصافًا مميزة للصور','حوّل فكرتك إلى خطة فيديو متكاملة','أنشئ وحسّن البرومبتات لأي مهمة','أنشئ وعدّل كود البداية لموقعك'];
 $('moduleGrid').innerHTML=referenceNames.map((name,i)=>`<button type="button" class="module has-photo ${mod===i?'selected':''}" data-launch="${i}" aria-pressed="${mod===i}"><span class="card-photo"><img src="assets/cards/card-${['match','image','video','prompt','code'][i]}.webp" alt="" width="720" height="540" loading="lazy" decoding="async"></span><span class="glyph">${icon(['match','image','video','prompt','code'][i])}</span><b>${name}</b><span class="arabic">${referenceArabic[i]}</span><p>${shortEn[i]}<small>${shortAr[i]}</small></p></button>`).join('');
 $('toolsGrid').innerHTML=featuredTools.map(t=>`<article class="toolcard"><a href="${t.url}" target="_blank" rel="noopener noreferrer"><div class="tool-title">${toolLogo(t)}<h3>${t.name}</h3></div><p>${t.desc} &nbsp; →<small>${t.ar}</small></p></a></article>`).join('');
 $('guidesGrid').innerHTML=guideItems.map(g=>`<article class="guide-card"><a href="${destinations+g.href}" target="_blank" rel="noopener noreferrer"><div class="guide-art has-photo"><img src="assets/cards/${g.photo}.webp" alt="" width="960" height="540" loading="lazy" decoding="async"></div><h3>${g.title}</h3><p dir="rtl">${g.ar}</p></a></article>`).join('');
 $('searchIcon').innerHTML=icon('search');$('globeIcon').innerHTML=icon('globe');$('themeButton').innerHTML=icon('sun');$('profileButton').innerHTML=icon('user');$('createIcon').innerHTML=icon('match');$('trendIcon').innerHTML=icon('trend');
 document.querySelectorAll('[data-launch]').forEach(button=>button.onclick=()=>launchTool(Number(button.dataset.launch)));
 document.querySelector('[data-media]').onclick=openMedia;$('projectsButton').onclick=showProjects;
 $('locale').value=lang;$('langLabel').textContent=lang==='ar'?'لغة الواجهة':'Interface language';
 renderTrending();filterCatalog();
 document.title='Zavlis AI V3 — Creative Dashboard';
};
$('quickTask').addEventListener('input',()=>{$('quickCount').textContent=String($('quickTask').value.length);});
$('quickForm').addEventListener('submit',event=>{event.preventDefault();const topic=$('quickTask').value.trim();if(!topic)return;const budget=document.querySelector('input[name="quickBudget"]:checked').value;const outputLanguage=$('quickLanguage').value;launchTool(0);$('topic').value=topic;$('budget').value=budget;$('outputLang').value=outputLanguage;$('task').value=/video|فيديو/i.test(topic)?'video':/image|photo|thumbnail|صورة|صور|تصميم/i.test(topic)?'image':/code|website|برمج|موقع/i.test(topic)?'code':/research|بحث|مصادر/i.test(topic)?'research':'writing';$('form').requestSubmit();});
$('form').addEventListener('submit',()=>{if(last&&$('topic').value.trim()){sessionOutputs.unshift({tool:referenceNames[mod],text:last});if(sessionOutputs.length>10)sessionOutputs.pop();}});
$('searchForm').addEventListener('submit',event=>{event.preventDefault();filterCatalog();$( $('searchScope').value==='guides'?'guides':'tools').scrollIntoView({behavior:'smooth'});});
$('searchInput').addEventListener('input',filterCatalog);$('searchScope').addEventListener('change',filterCatalog);
$('trendTools').onclick=()=>{trendMode='tools';renderTrending();};$('trendGuides').onclick=()=>{trendMode='guides';renderTrending();};
$('themeButton').onclick=()=>{const light=document.body.classList.toggle('theme-light');$('themeButton').setAttribute('aria-pressed',String(light));};
$('profileButton').onclick=showProjects;$('dialogClose').onclick=()=>$('sessionDialog').close();
$('plansButton').onclick=()=>{const p=document.createElement('p');p.textContent='No paid plan or checkout is available in this version. The five local tools are free to use. / لا توجد خطة مدفوعة أو عملية شراء في هذه النسخة. الأدوات المحلية الخمس متاحة للاستخدام مجانًا.';openDialog('Plans / الخطط',[p]);};
$('locale').onchange=event=>{lang=event.target.value;draw();document.dispatchEvent(new Event('zavlis:locale'));};
lang='en';draw();$('studio').hidden=true;
