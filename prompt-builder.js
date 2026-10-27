'use strict';
// Rule-based prompt builder for Smart Match. No network calls, no invented facts:
// it restructures the user's own request into a clear prompt template.
(function(){
 const ROLES={
  'design.ui':['senior UI/UX designer','مصمم واجهات UI/UX أول'],
  'design.logos':['brand identity designer','مصمم هوية بصرية وشعارات'],
  'design':['visual designer','مصمم بصري'],
  'image.generation':['AI image art director','مخرج فني لصور الذكاء الاصطناعي'],
  'image':['image editing specialist','متخصص تحرير صور'],
  'video':['video director and editor','مخرج ومحرر فيديو'],
  'voice':['audio producer','منتج صوتي'],
  'code.assistant':['senior software engineer','مهندس برمجيات أول'],
  'code':['senior software engineer','مهندس برمجيات أول'],
  'automation':['AI agents and automation engineer','مهندس وكلاء ذكاء اصطناعي وأتمتة'],
  'writing.articles':['professional content writer','كاتب محتوى محترف'],
  'writing.email':['professional business writer','كاتب مراسلات احترافي'],
  'writing.resume':['career coach and resume writer','خبير سير ذاتية ومستشار مهني'],
  'writing.proofreading':['meticulous editor and proofreader','محرر ومدقق لغوي دقيق'],
  'writing':['professional writer','كاتب محترف'],
  'marketing':['performance marketing strategist','خبير تسويق رقمي'],
  'research':['careful researcher','باحث دقيق'],
  'education':['experienced teacher','معلم خبير'],
  'data':['data analyst','محلل بيانات'],
  'music':['music producer and composer','منتج ومؤلف موسيقي'],
  'presentations':['presentation designer','مصمم عروض تقديمية'],
  'translation':['professional translator','مترجم محترف'],
  'productivity':['productivity consultant','مستشار إنتاجية']
 };
 const DELIVERABLES={
  'design.ui':[['Screen and page structure (sitemap / user flow).','هيكل الشاشات والصفحات (خريطة الموقع ومسار المستخدم).'],['A design system: color palette with HEX codes, typography, spacing scale and core components.','نظام تصميم: لوحة ألوان بأكواد HEX، والخطوط، ومقاييس المسافات، والمكونات الأساسية.'],['A description of every screen with its states (empty, loading, error, success).','وصف كل شاشة مع حالاتها (فارغة، تحميل، خطأ، نجاح).'],['Production-ready code for the main screen if requested.','كود جاهز للشاشة الرئيسية إذا طُلب.']],
  'automation':[['Agent components: chat panel, task/steps timeline, tool-call log, status and approval controls.','مكونات الوكيل: لوحة محادثة، خط زمني للمهام والخطوات، سجل استدعاء الأدوات، حالة التشغيل، وأزرار الموافقة.'],['How the agent reports progress, asks for approval and handles errors.','كيف يعرض الوكيل تقدمه ويطلب الموافقة ويتعامل مع الأخطاء.']],
  'code':[['Complete, runnable code with no placeholders.','كود كامل قابل للتشغيل بدون أجزاء ناقصة.'],['Setup and run instructions.','تعليمات التثبيت والتشغيل.']],
  'design.logos':[['3 distinct logo concepts, each with idea, symbol, typography and colors (HEX).','3 أفكار شعار مختلفة، لكل فكرة: المفهوم والرمز والخط والألوان (HEX).'],['Usage notes: small sizes, single-color version, light and dark backgrounds.','ملاحظات الاستخدام: الأحجام الصغيرة، نسخة بلون واحد، الخلفيات الفاتحة والداكنة.']],
  'design':[['Visual direction: layout, colors (HEX), typography and key elements.','الاتجاه البصري: التخطيط والألوان (HEX) والخطوط والعناصر الأساسية.']],
  'image':[['Subject, composition, lighting, style, colors and aspect ratio — each stated explicitly.','الموضوع والتكوين والإضاءة والنمط والألوان ونسبة الأبعاد — كل عنصر بشكل صريح.']],
  'video':[['A scene-by-scene script with duration, visuals, voiceover and on-screen text for each scene.','سيناريو مشهد بمشهد مع المدة والمرئيات والتعليق الصوتي والنص الظاهر لكل مشهد.']],
  'writing':[['An outline first, then the full text.','مخطط أولًا ثم النص كاملًا.']],
  'marketing':[['Target audience, key message, channel and a clear call to action.','الجمهور المستهدف والرسالة الأساسية والقناة ودعوة واضحة لاتخاذ إجراء.']],
  'presentations':[['Slide-by-slide outline: title, key points and suggested visual per slide.','مخطط شريحة بشريحة: العنوان والنقاط الأساسية والمرئي المقترح لكل شريحة.']],
  'research':[['Findings with sources, separating evidence from assumptions.','النتائج مع مصادرها، مع فصل الأدلة عن الافتراضات.']],
  'education':[['Explanation in simple steps, examples, and a short quiz with answers.','شرح بخطوات بسيطة وأمثلة واختبار قصير مع الإجابات.']],
  'data':[['Method, formulas or code used, and a clear summary of results.','الطريقة والمعادلات أو الكود المستخدم وملخص واضح للنتائج.']]
 };
 const QUALITIES=[
  [/فخم|فاخر|راقي|luxur|premium|elegant/i,['Luxury feel: restrained refined palette, generous whitespace, elegant typography, precise details — no clutter or generic stock look.','طابع فاخر: لوحة ألوان محدودة وراقية، مساحات واسعة، خطوط أنيقة، وتفاصيل دقيقة — بدون زحمة أو مظهر قالب جاهز.']],
  [/احتراف|professional|pro\b/i,['Professional, production-ready quality: full consistency in spacing, type and components.','جودة احترافية جاهزة للاستخدام الفعلي: اتساق كامل في المسافات والخطوط والمكونات.']],
  [/ذكي|ذكية|smart|intelligent/i,['Smart behavior: contextual suggestions, clear thinking/loading states and helpful feedback messages.','سلوك ذكي: اقتراحات حسب السياق، حالات تفكير وتحميل واضحة، ورسائل توضيحية مفيدة.']],
  [/بسيط|بسيطة|minimal|clean/i,['Minimal and clean: one clear focus per screen, no unnecessary elements.','بساطة ووضوح: تركيز واحد واضح في كل شاشة، بدون عناصر غير ضرورية.']],
  [/حديث|عصري|modern/i,['Modern current design conventions.','أسلوب عصري يتبع اتجاهات التصميم الحالية.']],
  [/سريع|fast|quick/i,['Optimized for speed and quick task completion.','محسّن للسرعة وإنجاز المهمة بأقل خطوات.']],
  [/جوال|موبايل|mobile|app|تطبيق/i,['Mobile-first and responsive.','يبدأ بتصميم الجوال ومتجاوب مع كل الشاشات.']]
 ];
 const PREFIX_EN=/^\s*(?:please\s+)?(?:(?:write|give|create|make|generate)\s+(?:me\s+)?|i\s+(?:want|need)\s+)?(?:a\s+|an\s+)?prompts?\s+(?:for|to|about|that)\s+(?:a\s+|an\s+)?/i;
 const PREFIX=/^\s*(?:(?:ابغ|ابغى|أبغى|ابي|أبي|ابى|أبى|اريد|أريد|بغيت|ودي|عطني|اعطني|أعطني|اكتب لي|اكتبلي|سو لي|سوي لي|ممكن)\s+)?(?:برو?مبت|بروبمت|prompt|أمر|امر)\s*(?:عن|حول|ل|لـ|عشان|for|to)?\s*/i;
 function clean(request){
  const text=String(request||'').trim().replace(/\s+/g,' ');
  const stripped=text.replace(PREFIX_EN,'').replace(PREFIX,'').trim();
  return stripped.length>=4?stripped:text;
 }
 function pick(map,ids){
  const out=[],seen=new Set();
  for(const id of ids){
   const category=id.split('.')[0];
   for(const key of [id,category]){if(map[key]&&!seen.has(key)){seen.add(key);out.push(map[key]);break;}}
  }
  return out;
 }
 function build(opts){
  const request=String(opts&&opts.request||'').trim();
  const ar=(opts&&opts.language)!=='en';const i=ar?1:0;
  const ids=((opts&&opts.subtasks)||[]).filter(id=>id!=='writing.prompts');
  const task=clean(request);
  const roles=pick(ROLES,ids).map(r=>ar?r[1]:(/^[aeiou]/i.test(r[0])?'an ':'a ')+r[0]);
  const roleLine=roles.length?roles.join(ar?' و':' and '):(ar?'خبير في المجال المطلوب':'an expert in the relevant field');
  const visual=ids.some(id=>/^(design|code|automation|presentations)\b/.test(id));
  const reqs=QUALITIES.filter(([re])=>re.test(request)).map(([,v])=>v[i]);
  if(/[؀-ۿ]/.test(request))reqs.push(visual?(ar?'دعم كامل للعربية واتجاه RTL في الواجهة.':'Full Arabic and RTL support in the interface.'):(ar?'عربية سليمة وواضحة.':'Clear, correct Arabic.'));
  const deliver=[].concat(...pick(DELIVERABLES,ids)).map(d=>d[i]);
  if(!deliver.length)deliver.push(ar?'مخرج منظم بعناوين واضحة وخطوات تالية مرقمة.':'A structured result with clear headings and numbered next steps.');
  const L=ar?{you:'أنت',task:'## المهمة',req:'## المتطلبات',out:'## المخرجات المطلوبة',rules:'## الضوابط',fill:'## أكمل هذي المعلومات قبل الإرسال (اختياري)',lang:'لغة الرد: العربية.'}:{you:'You are',task:'## Task',req:'## Requirements',out:'## Deliverables',rules:'## Rules',fill:'## Fill these in before sending (optional)',lang:'Response language: English.'};
  const rules=ar?['لا تختلق معلومات أو أرقامًا أو مصادر.','إذا نقصتك معلومة أساسية، اسأل سؤالًا واحدًا فقط، وإلا اذكر افتراضاتك بوضوح وكمّل.','قدّم أفضل نسخة مباشرة، ثم اقترح تحسينين اختياريين.']:['Do not invent facts, numbers or sources.','If essential information is missing, ask one question only; otherwise state your assumptions and continue.','Deliver the best version directly, then suggest two optional improvements.'];
  const fill=visual?(ar?['اسم المنتج أو المشروع: [   ]','الجمهور المستهدف: [   ]','المنصة: [ويب / جوال / سطح المكتب]','ألوان أو هوية موجودة: [   ]']:['Product or project name: [   ]','Target audience: [   ]','Platform: [web / mobile / desktop]','Existing colors or brand: [   ]']):(ar?['الجمهور المستهدف: [   ]','النبرة: [رسمية / ودية / تسويقية]','الطول أو الحجم: [   ]','أي معلومات أو مصادر عندك: [   ]']:['Target audience: [   ]','Tone: [formal / friendly / persuasive]','Length or size: [   ]','Any facts or sources you have: [   ]']);
  const lines=[`${L.you} ${roleLine}.`,'',L.task,task,''];
  if(reqs.length)lines.push(L.req,...reqs.map(r=>'- '+r),'');
  lines.push(L.out,...deliver.map((d,n)=>(n+1)+'. '+d),'',L.rules,...rules.map(r=>'- '+r),'- '+L.lang,'',L.fill,...fill.map(f=>'- '+f));
  return lines.join('\n');
 }
 window.ZavlisPrompt={build,clean};
})();
