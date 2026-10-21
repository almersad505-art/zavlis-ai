(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./subtasks.js'):root.ZavlisSubtasks);if(typeof module==='object'&&module.exports)module.exports=api;else root.ZavlisMatch=api;})(typeof globalThis!=='undefined'?globalThis:this,(Subtasks)=>{
'use strict';
const labels={video:['Video','فيديو'],voice:['Voice / narration','صوت وتعليق صوتي'],image:['Images','صور'],writing:['Writing','كتابة'],code:['Coding','برمجة'],design:['Design / logos','تصميم وشعارات'],music:['Music','موسيقى'],presentations:['Presentations','عروض تقديمية'],research:['Research / study','بحث ودراسة'],productivity:['Productivity / meetings','إنتاجية واجتماعات'],marketing:['Marketing / social media','تسويق وسوشال'],translation:['Translation','ترجمة'],education:['Education / children','تعليم وأطفال'],data:['Data / spreadsheets','بيانات وجداول'],automation:['Automation / agents','أتمتة ووكلاء']};
const weights=Object.freeze({task:50,budget:20,language:20,specialization:10});
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
// Task vocabulary contains no provider IDs or fixed recommendation lists.
const rules={
video:/\b(videos?|reels?|shorts?|animation|animate|footage|films?|clips?)\b|فيديو|فديو|ريلز|مقطع(?: قصير| مرئي| اعلاني|(?=\s|$))|تحريك|انيميشن/,
voice:/\b(voice(?:[ -]?over)?|narration|narrator|dubbing|dub|tts|text.to.speech|podcasts?|audiobook)\b|تعليق صوتي|صوت(?:ي|يه)?|فويس|دبلج|بودكاست|كتاب مسموع/,
image:/\b(images?|photos?|pictures?|thumbnails?|illustrations?|portraits?|renders?)\b|صور|صوره|رسوم(?!ي)|(?:^|\s)[اي]?رسم(?:ه|ات|ها|لي)?(?=\s|$)|لوحه فنيه|بورتريه|مصغره/,
writing:/\b(articles?|blogs?|essays?|copywriting|summari[sz]e|summar(?:y|ies)|stories|story|novel|captions?|proofread|grammar|emails?|letters?)\b|مقال|تلخيص|لخص|قصه|روايه|تدقيق|قواعد|املا|سيناريو|(?:^|\s)نص(?:\s|ا\s|$)|رسال[هت]|صياغ|وصف منتج/,
code:/\b(code|coding|programming|python|javascript|html|css|sql|debug|bugs?|api|react|website|web app)\b|برمج|كود|تطبيق|موقع|بايثون|جافا|اصلاح خطا/,
design:/\b(design|layout|logos?|brand(?:ing)?|posters?|wireframe|ui|ux)\b|تصميم|صمم|شعار|هويه|براند|بوستر|واجهه/,
music:/\b(music|soundtrack|melody|songs?|compose|instrumental|beats?|vocal removal)\b|موسيق|لحن|اغني|اغان|مقطوعه|توزيع موسيقي|فصل (?:الغناء|الالات)/,
presentations:/\b(presentations?|slides?|powerpoint|pitch deck)\b|عرض تقديمي|عروض تقديميه|شرائح|بوربوينت|برزنتيشن/,
research:/\b(research|literature review|academic|citations?|scientific papers?|study sources|pdf)\b|بحث علمي|بحوث|ابحاث|مراجع|مصادر موثوقه|دراسه علميه|اوراق علميه|ورقه علميه|مراجعه ادبيات|ملف pdf/,
productivity:/\b(meetings?|minutes|action items|calendar|scheduling|schedule|productivity|notes)\b|اجتماع|محضر|تقويم|جدول مواعيد|جدوله|اداره المهام|انتاجيه|ملاحظات/,
marketing:/\b(marketing|social media|social posts?|instagram|linkedin|seo|ads?|advertising|campaign)\b|تسويق|سوشال|منشورات|انستقرام|انستغرام|لينكدان|اعلانات|حمله اعلانيه|تحسين محركات/,
translation:/\b(translat(?:e|ion|ing)|locali[sz](?:e|ation)|multilingual)\b|ترجم|ترجمه|تعريب|توطين/,
education:/\b(teaching|teacher|lesson|tutor|children|kids?|child|quiz|flashcards|homework|learning|math)\b|تعليم|تعلم|طفل|اطفال|درس|دروس|اختبار مدرسي|اسئله للطلاب|بطاقات مذاكره|رياضيات|واجب/,
data:/\b(data|spreadsheet|excel|sheets|csv|charts?|analytics|formulas?|pivot tables?)\b|بيانات|اكسل|اكسيل|جداول|جدول بيانات|شيت|معادلات|صيغ حسابيه|تحليل المبيعات|رسم بياني|رسوم بيانيه|ميزانيه|مصاريف|مصروفات/,
automation:/\b(automat(?:e|ion|ing)|workflows?|agents?|integrat(?:e|ion)|connect apps)\b|اتمت|اوتوميشن|وكيل|وكلاء|سير عمل|ربط التطبيقات|اربط|يربط/
};
function language(text){return /[\u0621-\u063a\u0641-\u064a\u066e-\u066f\u0671-\u06d3]/.test(text)?'ar':'en';}
// Arabic is needed when the request is written in Arabic OR asks for Arabic output in another language ("Arabic voiceover", "for an Arab audience").
function targetLanguageOf(text){const t=String(text||'');return language(t)==='ar'||/\b(arabic|arab|khaleeji)\b/i.test(t)?'ar':'en';}
function extractBase(text){let value=normalize(text);value=value.replace(/\b(without|no)\s+(music|video|voiceover)\s+(?:or|and)\s+(music|video|voiceover)\b/g,'$1 $2 without $3');const excluded=new Set();value=value.replace(/\b(?:without|no)\s+(voice[ -]?over|voice|narration|music|video|images?|design|code)\b|(?:بدون|دون|من غير)\s+(تعليق صوتي|موسيقي|صوت|فيديو|صور|كود)/g,(full,en,ar)=>{for(const [task,re]of Object.entries(rules))if(re.test(en||ar))excluded.add(task);return ' ';});value=value.replace(/عن التسويق|about marketing/g,' ');if(/ربط التطبيقات|يربط التطبيقات|اربط التطبيقات|connect apps/.test(value))value=value.replace(/التطبيقات|apps/g,' ');const found=new Set(Object.keys(rules).filter(k=>!excluded.has(k)&&rules[k].test(value)));if(found.has('design')&&(found.has('video')||found.has('image')||found.has('presentations'))&&!/\b(logo|brand|ui|ux|layout|poster)\b|شعار|هويه|واجهه|بوستر/.test(value))found.delete('design');if(found.has('writing')&&found.has('productivity')&&!/\b(article|blog|story|novel|email)\b|مقال|قصه|روايه|رساله/.test(value))found.delete('writing');if(found.has('writing')&&found.has('education')&&/قصه|story|novel/.test(value)&&!/جهز درس|سوي درس|حضّر درس|prepare a lesson|teach|help kids/.test(value))found.delete('education');if(!found.size&&/\b(write|writing)\b|اكتب|كتابه/.test(value)&&!excluded.has('writing'))found.add('writing');return Object.keys(labels).filter(k=>found.has(k));}
function contains(text,keyword){const key=normalize(keyword);if(!key)return false;return /^[a-z0-9 -]+$/.test(key)?(' '+text.replace(/[^a-z0-9 -]/g,' ')+' ').includes(' '+key+' '):text.includes(key);}
function requestedLanguage(text,uiLanguage){const s=normalize(text);if(/\b(?:arabic|saudi)\b|بالعربي|عربي|عربيه|سعودي/.test(s))return'ar';if(/\bin english\b|بالانجليزي|انجليزي/.test(s))return'en';return uiLanguage;}
function intentFor(task,request){const s=normalize(request);if(task==='automation'&&/connect apps|integrat|ربط التطبيقات|يربط التطبيقات|اربط التطبيقات/.test(s))return'integrations';if(task==='code')return /debug|bugs?|python|خطا|بايثون/.test(s)?'debug':'code';if(task==='writing')return /fiction|novel|story|قصه|روايه/.test(s)?'fiction':/proofread|grammar|تدقيق|قواعد|املا/.test(s)?'proofreading':'prose';if(task==='design')return /logo|brand|شعار|هويه|براند/.test(s)?'logo':'design';if(task==='productivity')return /calendar|schedul|تقويم|جدوله|مواعيد/.test(s)?'scheduling':'meeting_notes';if(task==='music')return /vocal removal|فصل الغناء|فصل الالات/.test(s)?'music_edit':'music_generation';if(task==='voice')return'voiceover';if(task==='research')return /pdf|document|ملف|لخص|summari/.test(s)?'document_study':'academic';if(task==='education')return /child|kids|tutor|homework|flashcard|طفل|اطفال|واجب|بطاقات/.test(s)?'tutoring':'lesson_planning';if(task==='marketing')return /seo|محركات/.test(s)?'seo':'social';if(task==='data')return /excel|spreadsheet|sheets|formula|اكسل|اكسيل|جداول|شيت|معادل|صيغ/.test(s)?'spreadsheets':'data';return task;}
function analyze(text){
 const detected=Subtasks.detect(text),tasks=new Set(extractBase(text));
 for(const id of detected)tasks.add(Subtasks.definitions[id].category);
 const has=id=>detected.includes(id);
 const writingExplicit=detected.some(id=>id.startsWith('writing.'));
 if((has('voice.transcription')||has('research.documents'))&&!writingExplicit)tasks.delete('writing');
 if(has('video.subtitles')){tasks.delete('translation');if(!writingExplicit)tasks.delete('writing');}
 if(has('productivity.email_automation')){tasks.delete('writing');if(!/workflow|اتمت|سير عمل/.test(normalize(text)))tasks.delete('automation');}
 if(has('design.social_posts')&&!/marketing|تسويق/.test(normalize(text)))tasks.delete('marketing');
 if(has('image.editing')&&!/marketing|تسويق|حمله|اعلان|منشور|\bposts?\b/.test(normalize(text)))tasks.delete('marketing');
 const defaults={voice:'voice.voiceover',video:'video.generation',image:'image.generation',code:'code.assistant'};
 for(const task of tasks){if(!detected.some(id=>Subtasks.definitions[id].category===task))detected.push(defaults[task]||task+'.general');}
 return {tasks:Object.keys(labels).filter(task=>tasks.has(task)),subtasks:detected.filter(id=>tasks.has(Subtasks.definitions[id].category))};
}
function extract(text){return analyze(text).tasks;}
function freeTierFor(tool,subtask){return subtask?(tool.subtask_free_tier?.[subtask]||'unknown'):tool.free_tier;}
function score(tool,task,request,options={}){
 if(!Array.isArray(tool.tasks)||!tool.tasks.includes(task))return null;
 const subtask=options.subtask||null,exactSubtask=!!subtask&&(tool.subtasks||[]).includes(subtask);
 const intent=intentFor(task,request);
 if(!subtask&&!options.confirmedOnly&&!(tool.capabilities||tool.tasks).includes(intent)&&!tool.general_purpose)return null;
 const budget=options.budget||'any',ar=options.targetLanguage==='ar',freeTier=freeTierFor(tool,subtask);
 const hits=[...(tool.keywords_ar||[]),...(tool.keywords_en||[])].filter(k=>contains(normalize(request),k)).length;
 let budgetFit=budget==='any'?1:0;
 if(budget==='free')budgetFit=freeTier==='yes'?1:freeTier==='trial'?0.25:0;
 if(budget==='low')budgetFit=freeTier==='yes'?1:!subtask&&typeof tool.price_from==='number'&&tool.price_currency==='USD'&&tool.price_from<=20?1:freeTier==='trial'?0.25:0;
 const documented=tool.arabic_support==='yes'||(subtask?(tool.arabic_subtasks||[]).includes(subtask):(tool.arabic_tasks||[]).includes(task));
 const languageFit=ar?(documented?(tool.arabic_support==='yes'?1:0.5):0):0.5;
 const specialist=tool.general_purpose!==true&&(exactSubtask||tool.tasks.length<3);
 const specialization=specialist?Math.min(1,0.5/Math.max(1,tool.tasks.length)+Math.min(hits,2)*0.25):0;
 const components={task:weights.task*(subtask&&!exactSubtask?0.5:1),budget:weights.budget*budgetFit,language:weights.language*languageFit,specialization:weights.specialization*specialization};
 return {total:Math.round(Object.values(components).reduce((a,b)=>a+b,0)*100)/100,components,specialist,intent,subtask,exactSubtask,matchLevel:subtask?(exactSubtask?'subtask':'category'):'category'};
}
function match(text,catalog,options={}){
 const request=String(text||''),lang=['ar','en'].includes(options.language)?options.language:language(request);
 const confirmed=Array.isArray(options.confirmedTasks);
 const selected=cleanConfirmedTasks(options.confirmedTasks);
 const analysis=confirmed?{subtasks:selected,tasks:Object.keys(labels).filter(task=>selected.some(id=>Subtasks.definitions[id].category===task))}:analyze(request);
 const {tasks,subtasks}=analysis,warnings=[],recommendations=[];
 const budget=['free','low','any'].includes(options.budget)?options.budget:'any';
 const targetLanguage=['ar','en'].includes(options.targetLanguage)?options.targetLanguage:targetLanguageOf(request);
 if(!confirmed)return {request,language:lang,targetLanguage,tasks,subtasks,recommendations,alternatives:[],warnings,budget,weights,confirmed:false,phase:'review'};
 const scoringRequest=selected.map(id=>Subtasks.definitions[id].labels.join(' ')).join(' ');
 for(const task of tasks){
  const groups=subtasks.filter(id=>Subtasks.definitions[id].category===task);
  for(const subtask of groups.length?groups:[null]){
   const general=subtask?.endsWith('.general');
   const candidates=catalog.filter(tool=>tool.active!==false&&/^https:\/\//.test(tool.url||'')&&(general?tool.tasks.includes(task):tool.subtasks?.includes(subtask))).map(tool=>({tool,score:score(tool,task,scoringRequest,{budget,targetLanguage,subtask:general?null:subtask,confirmedOnly:true})})).filter(r=>r.score);
   // Arabic requests: hide tools documented as not supporting Arabic when enough alternatives exist.
   if(targetLanguage==='ar'){const usable=candidates.filter(r=>r.tool.arabic_support!=='no');if(usable.length>=1)candidates.splice(0,candidates.length,...usable);}
   candidates.sort((a,b)=>Number(b.score.exactSubtask)-Number(a.score.exactSubtask)||Number(b.score.specialist)-Number(a.score.specialist)||b.score.total-a.score.total||a.tool.name.localeCompare(b.tool.name,'en',{sensitivity:'base'})||String(a.tool.id).localeCompare(String(b.tool.id)));
   const taskLabel=subtask?Subtasks.definitions[subtask].labels[lang==='ar'?1:0]:labels[task][lang==='ar'?1:0];
   for(const [index,r]of candidates.slice(0,3).entries()){
    const ar=lang==='ar',notes=[];
    if(subtask&&!r.score.exactSubtask)notes.push(ar?'مطابقة فئة فقط؛ هذه المهمة الفرعية غير موثقة للأداة':'Category-only match; this subtask is not documented for this tool');
    if(budget!=='any'&&freeTierFor(r.tool,subtask)!=='yes')notes.push(ar?'المجانية لهذه المهمة/الميزانية غير مؤكدة':'free/low-budget eligibility for this subtask is not confirmed');
    if(targetLanguage==='ar'&&r.score.components.language===0)notes.push(ar?'دعم العربية لهذه المهمة غير محدد':'Arabic support for this task is not specified');
    const reason=(ar?`${taskLabel} — نقاط المطابقة ${r.score.total}/100. `:`${taskLabel} — match score ${r.score.total}/100. `)+(ar?'حسب المهمة والميزانية واللغة والتخصص؛ ليست نتيجة اختبار أداء.':'Based on task, budget, language and specialization; not a performance benchmark.')+(notes.length?' '+notes.join('؛ ')+'.':'');
    recommendations.push({...r,task,subtask,rank:index+1,reason});
   }
   if(candidates.length<3)warnings.push(lang==='ar'?`المتاح للمهمة ${taskLabel}: ${candidates.length} فقط.`:`Only ${candidates.length} documented tools for ${taskLabel}.`);
  }
 }
 if(!tasks.length)warnings.push(lang==='ar'?'حدد المطلوب إنشاؤه أو تحليله أو ترجمته لتحديد المهمة.':'Specify what you want to create, analyze, translate or automate.');
 return {request,language:lang,targetLanguage,tasks,subtasks,recommendations,alternatives:[],warnings,budget,weights,confirmed:true,phase:'results'};
}
function cleanConfirmedTasks(value){return Array.isArray(value)?[...new Set(value.filter(id=>typeof id==='string'&&Object.hasOwn(Subtasks.definitions,id)))]:[];}
function tasksFromUrl(value){try{return cleanConfirmedTasks((new URL(value)).searchParams.get('tasks')?.split(',')||[]);}catch{return [];}}
function shareUrl(value,tasks){const url=new URL(value),clean=cleanConfirmedTasks(tasks);if(clean.length)url.searchParams.set('tasks',clean.join(','));else url.searchParams.delete('tasks');url.hash='studio';return url.href;}
function text(result){
 const ar=result.language==='ar';
 return [(ar?'الطلب: ':'Request: ')+result.request,(ar?'المهام: ':'Tasks: ')+result.tasks.map(task=>labels[task][ar?1:0]).join(' + '),...result.recommendations.map(r=>`${r.rank}. ${r.tool.name}\n${r.reason}\n${r.tool.url}`),...result.warnings].join('\n\n');
}

return{normalize,language,targetLanguage:targetLanguageOf,extract,match,text,score,labels,weights,analyze,subtaskDefinitions:Subtasks.definitions,cleanConfirmedTasks,tasksFromUrl,shareUrl};
});
