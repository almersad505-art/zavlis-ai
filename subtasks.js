(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZavlisSubtasks=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const definitions={
  'voice.transcription':{category:'voice',labels:['Transcription','تفريغ نصي'],ar:['أفرّغ','أفرغ','تفريغ','فرغ التسجيل'],en:['transcription','transcribe','speech to text']},
  'voice.voiceover':{category:'voice',labels:['Voiceover','تعليق صوتي'],ar:['تعليق صوتي','بصوت عربي','بودكاست'],en:['voiceover','narration','text to speech']},
  'voice.cloning':{category:'voice',labels:['Voice cloning','استنساخ صوت'],ar:['استنساخ صوت','استنسخ صوت','نسخ صوتي'],en:['voice cloning','clone voice']},
  'image.generation':{category:'image',labels:['Image generation','توليد صور'],ar:['توليد صور','انشئ صورة','صور'],en:['generate image','image generation','images']},
  'image.background_removal':{category:'image',labels:['Background removal','إزالة خلفية'],ar:['أشيل الخلفية','اشيل الخلفية','إزالة خلفية','احذف الخلفية'],en:['remove background','background removal']},
  'image.editing':{category:'image',labels:['Image editing / enhancement','تحرير وتحسين الصور'],ar:['اعدل صوري','تحسين صورة','تحرير صور','ارفع الدقة'],en:['edit photo','enhance image','upscale']},
  'video.generation':{category:'video',labels:['Video generation','توليد فيديو'],ar:['فيديو','مقطع','توليد فيديو'],en:['video generation','generate video','video']},
  'video.editing':{category:'video',labels:['Video editing','مونتاج'],ar:['مونتاج','قص الفيديو','تعديل فيديو'],en:['video editing','edit video','trim video']},
  'video.subtitles':{category:'video',labels:['Subtitles / caption translation','ترجمة وكابشن'],ar:['ترجمة على الفيديو','كابشن','ترجمة الفيديو','ترجمة وكابشن'],en:['subtitles','video captions','caption video']},
  'video.avatar':{category:'video',labels:['Talking avatar','أفاتار متكلم'],ar:['افاتار','أفاتار متكلم','شخصية تتكلم'],en:['talking avatar','avatar video']},
  'design.social_posts':{category:'design',labels:['Social post design','بوستات سوشال'],ar:['بوست','بوست تويتر','تصميم منشورات'],en:['social post design','social graphic','design a post']},
  'design.logos':{category:'design',labels:['Logos','شعارات'],ar:['شعار','شعارات','هوية براند'],en:['logo','brand identity']},
  'design.ui':{category:'design',labels:['UI design','واجهات UI'],ar:['واجهة','واجهات','تصميم تطبيق'],en:['ui','ux','wireframe']},
  'code.assistant':{category:'code',labels:['Developer assistant','مساعد مبرمجين'],ar:['كود','مساعد مبرمجين','بايثون','تصحيح خطأ'],en:['coding assistant','debug','python','code']},
  'code.no_code':{category:'code',labels:['No-code website builder','بناء مواقع بدون كود'],ar:['بدون برمجة','بدون كود','متجر','متجري'],en:['no-code','no code','without coding','store builder']},
  'writing.resume':{category:'writing',labels:['Resume writing','سيرة ذاتية'],ar:['سيرة ذاتية','سيرتي','سي في'],en:['resume','curriculum vitae','cv']},
  'writing.email':{category:'writing',labels:['Email drafting','كتابة إيميلات'],ar:['ايميلات','إيميل','ايميل','بريد إلكتروني'],en:['write email','email drafting']},
  'writing.articles':{category:'writing',labels:['Articles','مقالات'],ar:['مقال','مقالات','مدونة'],en:['article','blog','essay']},
  'writing.proofreading':{category:'writing',labels:['Proofreading','تدقيق'],ar:['تدقيق','إملاء','قواعد','صحح النص'],en:['proofread','grammar','spelling']},
  'education.study':{category:'education',labels:['Study / quizzes','مذاكرة واختبارات'],ar:['أذاكر','اذاكر','مذاكرة','اختبار','اختبار القدرات'],en:['study','quiz','exam','flashcards','test prep']},
  'productivity.email_automation':{category:'productivity',labels:['Email automation / replies','إيميلات وردود تلقائية'],ar:['ايميلات','رد تلقائي','ارد تلقائي','ردود تلقائية'],en:['email automation','auto reply','automatic email replies']},
  'research.documents':{category:'research',labels:['Document analysis / summaries','بحث وتلخيص مستندات'],ar:['تحليل ملف','لخص pdf','تلخيص مستند'],en:['pdf','document analysis','document summary']}
 };
 for(const [category,ar]of Object.entries({voice:'صوت',image:'صور',video:'فيديو',design:'تصميم',code:'برمجة',writing:'كتابة',education:'تعليم',productivity:'إنتاجية',research:'بحث ودراسة',music:'موسيقى',presentations:'عروض تقديمية',marketing:'تسويق',translation:'ترجمة',data:'بيانات وجداول',automation:'أتمتة ووكلاء'}))definitions[category+'.general']={category,labels:[category+' — general',ar+' — عام'],ar:[],en:[]};
 const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
 function detect(text){
  const s=normalize(text).replace(/(?:بدون|دون)\s+(تعليق صوتي|صوت|موسيقي|فيديو|صور)|\bwithout\s+(voiceover|voice|narration|music|video|images?)\b/g,' '),found=[];
  const add=id=>{if(!found.includes(id))found.push(id);};
  if(/transcri|speech.to.text|افرغ|تفريغ|فرغ (?:الحلقه|التسجيل)|الصوت (?:الي|ل)نص/.test(s))add('voice.transcription');
  if(/voice.?over|narration|text.to.speech|تعليق صوتي|بصوت|صوت عربي/.test(s)||(/بودكاست|podcast/.test(s)&&/اسوي|انشئ|create|make|record/.test(s)))add('voice.voiceover');
  if(/voice clon|clon.{0,12}voice|استنساخ.{0,8}صوت|استنسخ.{0,8}صوت|نسخ صوت/.test(s))add('voice.cloning');
  if(/(?:اشيل|شيل|ازاله|احذف|حذف).{0,12}خلفي|(?:remove|remov(?:e|ing)|erase).{0,18}background|background remov/.test(s))add('image.background_removal');
  else if(/(?:اعدل|عدل|تحرير|تحسين).{0,8}صور|ارفع الدقه|upscal|enhanc.{0,10}(?:image|photo)|edit.{0,10}(?:image|photo)/.test(s))add('image.editing');
  if(/subtitles?|كابشن|ترجم[هت].{0,15}فيديو|video captions?/.test(s))add('video.subtitles');
  if(/مونتاج|قص الفيديو|تعديل فيديو|video edit|edit.{0,8}video|trim.{0,8}video/.test(s))add('video.editing');
  if(/افاتار|avatar|شخصيه تتكلم/.test(s))add('video.avatar');
  if(/بوست(?!ر)|تصميم منشورات|social (?:post|graphic)|design.{0,8}(?:post|tweet)/.test(s))add('design.social_posts');
  if(/شعار|هويه براند|\blogos?\b|brand identity/.test(s))add('design.logos');
  if(/واجه[هات]|\b(?:ui|ux|wireframe)\b/.test(s))add('design.ui');
  if(/بدون (?:برمجه|كود)|\bno[ -]?code\b|without coding|(?:ابني|بناء|انشئ|اسوي|build|create).{0,25}(?:متجر|موقع|website|store)/.test(s))add('code.no_code');
  else if(/\b(code|coding|debug|python|javascript|api|react)\b|كود|بايثون|مبرمج|تصحيح خطا/.test(s))add('code.assistant');
  if(/سيره ذاتيه|سيرتي|سي في|\b(resume|cv)\b|curriculum vitae/.test(s))add('writing.resume');
  const email=/ايميل|بريد الكتروني|\bemails?\b/.test(s),automatic=/تلقائ|تلقاي|اوتوماتيك|automat|auto[ -]?repl/.test(s);
  if(email&&automatic)add('productivity.email_automation');else if(email)add('writing.email');
  if(/مقال|مدون|\b(articles?|blogs?|essays?)\b/.test(s))add('writing.articles');
  if(/تدقيق|املا|قواعد|صحح النص|proofread|grammar|spelling/.test(s))add('writing.proofreading');
  if(/اذاكر|مذاكر|اختبار|\b(study|quiz|quizzes|exam|flashcards)\b|test prep/.test(s))add('education.study');
  if(/\bpdf\b|(?:حلل|لخص|تلخيص|تحليل).{0,15}(?:ملف|مستند)|document (?:analysis|summary)|summari.{0,12}document/.test(s))add('research.documents');
  return found;
 }
 return {definitions,detect};
});
