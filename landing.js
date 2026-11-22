/* Presentation layer: existing engines, consent and catalog remain untouched. */
'use strict';
const landingPreviousDraw = draw;
/* One language at a time: i18n.css hides the inactive [data-l] half. */
const landingPair=(ar,en)=>`<span data-l="ar" lang="ar" dir="rtl">${ar}</span><span data-l="en" lang="en" dir="ltr">${en}</span>`;
const landingScene=document.querySelector('.hero > .landing-scene')||document.createElement('div');if(!landingScene.isConnected){landingScene.className='landing-scene';landingScene.innerHTML='<img class="oasis" src="assets/oasis-terrace.webp" alt="شرفة عربية تطل على واحة وقت الغروب / Arabian terrace overlooking an oasis at sunset" width="1200" height="800"><div class="glass-shell"><nav class="glass-nav" aria-label="Task categories"></nav><div class="glass-main"></div></div>';document.querySelector('.hero').append(landingScene);}
landingScene.querySelector('.glass-main').append($('studio'));
const landingBrand=document.querySelector('.brand');document.querySelector('.top').prepend(landingBrand);
/* Header and sections are pre-rendered in index.html (no layout shift); create them only if missing. */
const landingNav=document.querySelector('.top > .landing-nav')||document.createElement('nav');if(!landingNav.isConnected){landingNav.className='landing-nav';landingNav.dataset.i18nSkip='';document.querySelector('.top').insertBefore(landingNav,document.querySelector('.top-controls'));}
const landingStart=document.querySelector('.top-controls > .landing-start')||document.createElement('button');if(!landingStart.isConnected){landingStart.type='button';landingStart.className='landing-start';landingStart.dataset.i18nSkip='';document.querySelector('.top-controls').append(landingStart);}
const landingBenefits=document.querySelector('.hero-content > .landing-benefits')||document.createElement('div');if(!landingBenefits.isConnected){landingBenefits.className='landing-benefits';landingBenefits.dataset.i18nSkip='';document.querySelector('.hero-content').append(landingBenefits);}
const landingServices=document.querySelector('section.landing-services')||document.createElement('section');if(!landingServices.isConnected){landingServices.className='landing-services';landingServices.dataset.i18nSkip='';$('moduleGrid').before(landingServices);}
const landingStats=document.querySelector('section.landing-stats')||document.createElement('section');if(!landingStats.isConnected){landingStats.className='landing-stats';landingStats.dataset.i18nSkip='';landingServices.after(landingStats);}
if($('moduleGrid').nextElementSibling!==$('tools'))$('tools').before($('moduleGrid'));
$('moduleGrid').classList.add('legacy-workspaces');
const landingHow=$('how-we-rank')||document.createElement('section');if(!landingHow.isConnected){landingHow.id='how-we-rank';landingHow.className='landing-how';landingHow.dataset.i18nSkip='';landingStats.after(landingHow);}
const landingCategories=[['video','▶','فيديو','Video'],['image','▧','صور','Images'],['voice','♫','صوت','Audio'],['writing','✎','كتابة','Writing'],['design','◇','تصميم','Design'],['all','⊞','المزيد','More']];
function landingOpen(category){
 if(mod!==0){mod=0;draw();}
 $('studio').hidden=false;taskPickerState.gridOpen=true;taskPickerRender();
 if(category&&category!=='all')document.getElementById('taskCategory-'+category)?.scrollIntoView({block:'nearest',behavior:'smooth'});
 else $('topic').focus({preventScroll:true});
}
/* Rewrite only when content changes: pre-rendered text keeps its first paint (LCP) and never jumps. */
const landingSet=(el,html)=>{const t=document.createElement('template');t.innerHTML=html;if(el.innerHTML!==t.innerHTML)el.innerHTML=html;};
function landingPaint(){
 const ar=lang==='ar';document.body.classList.add('landing');document.body.classList.add('theme-light');
 document.title=ar?'Zavlis AI — دليل صادق لأدوات الذكاء الاصطناعي':'Zavlis AI — An honest guide to AI tools';
 landingSet(landingNav,[['#home','الرئيسية','Home'],['#tools','الأدوات','Tools'],['comparisons.html','المقارنات','Compare'],['#how-we-rank','كيف نرتّب','How we rank'],['#guides','الأدلة','Guides'],['about.html','عن زافليس','About']].map(([href,a,e])=>`<a href="${href}">${landingPair(a,e)}</a>`).join(''));
 for(const id of ['eyebrow','heroTitle','heroArabic','heroDesc','jump','seeTools'])$(id).dataset.i18nSkip='';
 landingSet($('eyebrow'),landingPair('دليل صادق لأدوات الذكاء الاصطناعي','An honest guide to AI tools'));
 landingSet($('heroTitle'),landingPair('اكتب مهمتك،<br><em>ونرشّح لك الأداة</em>','Your task.<br><em>The right AI tool.</em>'));
 $('heroArabic').hidden=true;
 landingSet($('heroDesc'),landingPair('من الكتابة إلى الصور والفيديو — اكتشف الأدوات المناسبة، راجع المهام المقترحة، ثم اختر ما يناسبك.','From writing to images and video — describe your task, confirm what you need, and find suitable tools.'));
 landingSet($('jump'),landingPair('ابدأ مجانًا ←','Get Started Free'));$('jump').onclick=()=>{$('topic').focus();$('studio').scrollIntoView({block:'center',behavior:'smooth'});};
 landingSet($('seeTools'),landingPair('كيف نرتّب','How we rank'));$('seeTools').onclick=()=>landingHow.scrollIntoView({behavior:'smooth'});
 landingSet(landingStart,landingPair('ابدأ الآن ←','Get Started'));landingStart.onclick=$('jump').onclick;
 landingSet(landingBenefits,[['مجاني وبدون تسجيل','Free, no registration'],['عربي وإنجليزي','Arabic & English'],['بدون ترتيب مدفوع','No paid ranking'],['من المصادر الرسمية','Official sources']].map(([a,e])=>`<div><b aria-hidden="true">✓</b>${landingPair(a,e)}</div>`).join(''));
 landingSet(landingScene.querySelector('.glass-nav'),landingCategories.map(([category,i,a,e])=>`<button type="button" data-category="${category}"><i aria-hidden="true">${i}</i>${landingPair(a,e)}</button>`).join(''));
 landingScene.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>landingOpen(b.dataset.category));
 const serviceCategories=[['all','◉','المساعد الذكي','AI Tool Finder'],['image','▧','أدوات الصور','Image Tools'],['video','▶','أدوات الفيديو','Video Tools'],['writing','✎','كتابة المحتوى','Content Writing'],['research','▤','تحليل الملفات','File Analysis'],['all','⊞','المزيد من الأدوات','More Tools']];
 landingSet(landingServices,serviceCategories.map(([category,i,a,e],index)=>`<button type="button" data-category="${category}"><i aria-hidden="true">${i}</i>${landingPair(a,e)}<p>${landingPair(['اعثر على الأداة المناسبة لمهمتك','توليد وتحرير وتحسين الصور','أدوات تحول فكرتك إلى فيديو','مقالات ومنشورات وسكربتات','تلخيص وفهم المستندات','استكشف كل أنواع المهام'][index],['Find suitable tools for your task','Generate, edit and enhance images','Turn your ideas into video plans','Articles, posts and scripts','Summarize and understand files','Explore all task categories'][index])}</p><span class="service-arrow" aria-hidden="true">${ar?'←':'→'}</span></button>`).join(''));
 landingServices.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{landingOpen(b.dataset.category);$('studio').scrollIntoView({block:'center',behavior:'smooth'});});
 const activeTools=ZAVLIS_TOOLS.filter(t=>t.active!==false);
 const count=activeTools.length,tasks=new Set(activeTools.flatMap(t=>t.tasks)),arabic=activeTools.filter(t=>t.arabic_support==='yes').length;
 landingSet(landingStats,`<div>${landingPair('اختيار أوضح. قرار بيدك.','Clarity in every choice.')}<p>${landingPair('أرقام محسوبة مباشرة من بيانات الدليل، وليست إحصاءات زوار.','Counts calculated directly from our catalog, not visitor statistics.')}</p></div>`+[[count,'أداة في الدليل','Tools in the catalog'],[tasks.size,'نوع مهمة','Task types'],[arabic,'تدعم العربية بالكامل','Full Arabic support']].map(([n,a,e])=>`<div class="stat"><strong>${n}</strong>${landingPair(a,e)}</div>`).join(''));
 landingSet(landingHow,`<h2>${landingPair('كيف نرتّب الأدوات؟','How do we rank tools?')}</h2><p>${landingPair('اكتب مهمتك، راجع المهام الفرعية وأكّدها، ثم اعرض الأدوات. النقاط: مطابقة المهمة 50%، الميزانية 20%، اللغة 20%، التخصص 10%. لا توجد أولوية مدفوعة؛ وقد تكون بعض بيانات السعر أو اللغة غير محددة.','Describe your request, review and confirm its subtasks, then show tools. Scoring: task fit 50%, budget 20%, language 20%, specialization 10%. No paid placement. Some price or language information may be unknown.')}</p>`);
 $('studio').hidden=false;$('studio').classList.toggle('other-mode',mod!==0);
}
draw=function(){landingPreviousDraw();landingPaint();};
landingPaint();

if(!taskPickerState.selected.size){taskPickerState.gridOpen=false;taskPickerRender();$('result').hidden=true;}

// Render output in the normal page flow, outside the tilted glass workspace.
const landingResults=$('landing-results')||document.createElement('section');if(!landingResults.isConnected){landingResults.id='landing-results';landingResults.className='landing-results';landingResults.setAttribute('aria-label','نتائج الأدوات / Tool results');document.querySelector('.hero').after(landingResults);}
landingResults.append($('result').parentElement);
function landingRevealResults(){
 if(mod!==0)landingResults.classList.add('local-output');
 else landingResults.classList.remove('local-output');
 if(mod!==0||!resultCards.hidden)requestAnimationFrame(()=>landingResults.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
}
taskPickerConfirm.addEventListener('click',landingRevealResults);
$('form').addEventListener('submit',()=>{if(mod!==0)landingRevealResults();});
$('form').addEventListener('input',()=>landingResults.classList.remove('local-output'));
