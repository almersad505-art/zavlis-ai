(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZavlisMatch=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const labels={video:['Video','فيديو'],voice:['Voice / narration','صوت وتعليق'],image:['Images','صور'],writing:['Writing','كتابة'],code:['Code','برمجة'],design:['Design','تصميم'],music:['Music','موسيقى']};
 const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
 const rules={
  video:/\b(video|videos|reels?|shorts?|animation|animate|footage|film|clip)\b|فيديو|فديو|ريلز|مقطع مرئي|تحريك|انيميشن/,
  voice:/\b(voice(?:over)?|narration|narrator|dubbing|dub|speech|tts|podcast|spoken|audio\s*book)\b|تعليق صوتي|صوت|دبلج|نطق|بودكاست|كتاب مسموع|قراءه مسموعه/,
  image:/\b(images?|photos?|pictures?|thumbnails?|illustrations?|portraits?|renders?)\b|صور|صوره|رسوم|رسم|بورتريه|مصغره/,
  writing:/\b(write|writing|article|blog|essay|copywriting|summari[sz]e|summary|script|caption|meeting|minutes|research|pdf|translate|translation)\b|اكتب|كتاب[هة]|مقال|تلخيص|لخص|(?:^|\s)نص(?:\s|ا\s|$)|سيناريو|محضر|اجتماع|بحث|مصادر|رسال[هة]|صياغ|ترجم/,
  code:/\b(code|coding|programming|python|javascript|html|css|sql|app|website|debug|bug|api|react)\b|برمج|كود|تطبيق|موقع|بايثون|جافا|اصلاح خطا/,
  design:/\b(design|layout|logo|brand|presentation|slides|poster|wireframe|ui|ux)\b|تصميم|صمم|شعار|هوي[هة]|عرض تقديمي|شرائح|بوستر|واجه[هة]/,
  music:/\b(music|soundtrack|melody|song|songs|compose|instrumental|beat)\b|موسيق|لحن|اغني|اغان|مقطوع[هة]|توزيع موسيقي/
 };
 const preferred={video:['runway','pika','luma'],voice:['elevenlabs','murf','speechify'],image:['midjourney','firefly','ideogram'],writing:['chatgpt','claude','gemini'],code:['github-copilot','cursor','replit'],design:['canva','figma','framer'],music:['suno','aiva','soundraw']};
 function language(text){return /[\u0621-\u063a\u0641-\u064a\u066e-\u066f\u0671-\u06d3]/.test(text)?'ar':'en';}
 function extract(text){let value=normalize(text);const excluded=new Set();const negative=/\b(?:without|no)\s+(voiceover|voice|narration|music|video|images?|design|code)\b|(?:بدون|دون)\s+(تعليق صوتي|موسيقي|صوت|فيديو|صور)/g;value=value.replace(negative,(full,en,ar)=>{const term=en||ar;for(const [task,re]of Object.entries(rules))if(re.test(term))excluded.add(task);return '';});return Object.keys(rules).filter(task=>!excluded.has(task)&&rules[task].test(value));}
 function match(text,catalog,options={}){
  const lang=language(text),tasks=extract(text),budget=options.budget||(/\bfree\b|مجاني/i.test(text)?'free':'any'),used=new Set(),warnings=[],recommendations=[],alternatives=[];
  for(const task of tasks){const candidates=catalog.filter(t=>t.tasks.includes(task)&&t.officialUrl&&t.active!==false);const priorities=preferred[task];candidates.sort((a,b)=>{const rank=t=>{const index=priorities.indexOf(t.id);return index<0?100:index;};return rank(a)-rank(b)||a.id.localeCompare(b.id);});
   // Prefer a confirmed free tier when requested; unknown prices never become a free claim.
   const free=candidates.filter(t=>t.freeTier===true);const pool=budget==='free'&&free.length?free:candidates;
   const tool=pool.find(t=>!used.has(t.id))||candidates.find(t=>!used.has(t.id));if(!tool){warnings.push(lang==='ar'?`لا توجد أداة مستقلة موثقة للمهمة: ${labels[task][1]}`:`No separate documented tool for ${task}`);continue;}used.add(tool.id);
   if(budget==='free'&&tool.freeTier!==true)warnings.push(lang==='ar'?`لم تثبت خطة مجانية لـ ${tool.name}.`:`A free tier for ${tool.name} is not verified.`);
   recommendations.push({tool,task,reason:lang==='ar'?`لتنفيذ جزء ${labels[task][1]} من طلبك؛ هذا ترشيح حسب تصنيف المهمة وليس اختبار أداء.`:`For the ${labels[task][0].toLowerCase()} part of your request; category-based matching, not a performance benchmark.`});
   alternatives.push(...pool.filter(t=>t.id!==tool.id).slice(0,2).map(t=>({tool:t,task})));
  }
  if(!tasks.length)warnings.push(lang==='ar'?'حدد ما تريد إنشاءه: فيديو، صوت، صورة، كتابة، كود، تصميم أو موسيقى.':'Specify video, voice, images, writing, code, design or music.');
  return {request:String(text),language:lang,tasks,recommendations,alternatives,warnings,budget};
 }
 function text(result){const ar=result.language==='ar';return [(ar?'الطلب: ':'Request: ')+result.request,(ar?'المهام: ':'Tasks: ')+result.tasks.map(t=>labels[t][ar?1:0]).join(' + '),...result.recommendations.map(r=>`${r.tool.name}\n${r.reason}\n${r.tool.officialUrl}`),...(result.alternatives.length?[(ar?'بدائل حسب المهمة، غير مختبرة:':'Category alternatives, not benchmarked:'),...result.alternatives.map(r=>`${r.tool.name} (${labels[r.task][ar?1:0]})\n${r.tool.officialUrl}`)]:[]),...result.warnings].join('\n\n');}
 return {language,extract,match,text,labels};
});
