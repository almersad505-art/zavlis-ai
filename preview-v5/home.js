(()=>{
  const root=document.documentElement, body=document.body;
  const toggle=document.getElementById('language-toggle');
  const menu=document.getElementById('menu-toggle');
  const nav=document.getElementById('mc-nav');
  let lang='en';
  const applyLang=(next)=>{
    lang=next;
    root.lang=lang; root.dir=lang==='ar'?'rtl':'ltr';
    body.setAttribute('dir',root.dir);
    document.querySelectorAll('[data-en][data-ar]').forEach(el=>{el.textContent=el.dataset[lang]});
    document.querySelectorAll('[data-workspace]').forEach(el=>{el.href=lang==='ar'?'workspace-ar.html':'workspace-en.html'});
    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(el=>{el.placeholder=el.dataset[lang+'Placeholder']});
    toggle.querySelector('span').textContent=lang==='ar'?'🇸🇦':'🇬🇧';
    toggle.querySelector('b').textContent=lang==='ar'?'العربية':'EN';
    document.title=lang==='ar'?'Zavlis AI — اعثر على أداة AI المناسبة':'Zavlis AI — Find the right AI tool';
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content=lang==='ar'?'اكتشف أدوات AI المراجعة وقارن الخيارات واستخدم Finder لاختيار الأداة المناسبة.':'Discover reviewed AI tools, compare options, and use a free local Tool Finder to match your task.';
    try{sessionStorage.setItem('youcanai-language',lang)}catch{}
    update();
  };
  toggle?.addEventListener('click',()=>applyLang(lang==='en'?'ar':'en'));
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open))});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const input=document.getElementById('tool-search');
  const cards=[...document.querySelectorAll('[data-tool-card]')];
  const buttons=[...document.querySelectorAll('[data-filter]')];
  const plan=document.getElementById('plan-filter');
  const arabic=document.getElementById('arabic-filter');
  const type=document.getElementById('type-filter');
  const count=document.getElementById('result-count');
  const empty=document.getElementById('empty-state');
  let task='all';
  const norm=s=>(s||'').toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').trim();
  const concepts=[[/presentation|عرض/i,['design']],[/video|فيديو/i,['video']],[/pdf|summari|تلخيص|research|بحث|مصادر/i,['research']],[/design|image|تصميم|صور/i,['design','images']],[/coding|code|كود|برمج/i,['coding']],[/voice|audio|صوت/i,['audio']],[/writing|write|كتاب/i,['writing']],[/student|study|دراس|طلاب/i,['study']],[/business|اعمال|أعمال/i,['business']]];
  function update(){
    if(!input||!cards.length)return;
    const q=norm(input.value), inferred=[...new Set(concepts.flatMap(([re,t])=>re.test(q)?t:[]))]; let n=0;
    for(const c of cards){const tasks=c.dataset.tasks.split(' '),plans=c.dataset.plan.split(' '), text=norm(c.dataset.search+' '+c.textContent); const search=!q||(inferred.length?inferred.some(t=>tasks.includes(t)):text.includes(q)); const ok=search&&(task==='all'||tasks.includes(task))&&(plan?.value==='all'||plans.includes(plan?.value))&&(arabic?.value==='all'||c.dataset.arabic===arabic?.value)&&(type?.value==='all'||c.dataset.type===type?.value); c.hidden=!ok; if(ok)n++;}
    if(count)count.textContent=lang==='ar'?`${n} أدوات مطابقة`:`${n} matching tools`;
    if(empty)empty.hidden=n>0;
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{task=b.dataset.filter;buttons.forEach(x=>x.classList.toggle('active',x===b));update();document.getElementById('tools')?.scrollIntoView({behavior:'smooth',block:'start'})}));
  input?.addEventListener('input',update); [plan,arabic,type].forEach(x=>x?.addEventListener('change',update));
  document.getElementById('search-form')?.addEventListener('submit',e=>{e.preventDefault();update();document.getElementById('tools')?.scrollIntoView({behavior:'smooth',block:'start'})});
  document.getElementById('reset-finder')?.addEventListener('click',()=>{task='all'; input.value=''; buttons.forEach(b=>b.classList.toggle('active',b.dataset.filter==='all')); [plan,arabic,type].forEach(x=>{if(x)x.value='all'}); update()});
  const more=document.getElementById('more-filters'), panel=document.getElementById('more-panel'); more?.addEventListener('click',()=>{panel.hidden=!panel.hidden});
  try{const saved=sessionStorage.getItem('youcanai-language'); if(saved==='ar') applyLang('ar')}catch{}
  update();
})();
