'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'data/tools.json');
const tools=JSON.parse(fs.readFileSync(file,'utf8')),taxonomy=require('../subtasks.js');
if(!tools.some(t=>t.id==='rezi'))tools.push({id:'rezi',name:'Rezi',category:['writing'],tasks:['writing'],keywords_ar:['سيرة ذاتية'],keywords_en:['resume','cv'],free_tier:'unknown',arabic_support:'unknown',price_from:'unknown',url:'https://www.rezi.ai/',source_url:'https://www.rezi.ai/',last_checked:'2026-10-18',evidence:{capabilities:'https://www.rezi.ai/',free_tier:'unknown',arabic_support:'unknown',price_from:'unknown'},general_purpose:false,arabic_tasks:[],price_currency:'unknown',active:true,affiliateUrl:'',logo:'assets/tool-monograms/rezi.svg',logoKind:'initials placeholder, not official logo',capabilities:['prose']});
const get=id=>{const tool=tools.find(t=>t.id===id);if(!tool)throw Error('Unknown tool '+id);return tool;};
for(const tool of tools){tool.subtasks=[];tool.subtask_sources={};}
function tag(ids,subtask,source){
 const definition=taxonomy.definitions[subtask];
 for(const id of ids.split(',')){
  const tool=get(id);if(!tool.tasks.includes(definition.category))tool.tasks.push(definition.category);
  if(!tool.category.includes(definition.category))tool.category.push(definition.category);
  if(!tool.subtasks.includes(subtask))tool.subtasks.push(subtask);
  tool.subtask_sources[subtask]=source||tool.evidence.capabilities||tool.source_url;
  tool.keywords_ar=[...new Set([...tool.keywords_ar,...definition.ar])];
  tool.keywords_en=[...new Set([...tool.keywords_en,...definition.en])];
 }
}
// Specific tags are grounded in vendor pages; a broad category is never evidence
// of an unverified subtask. Unknown subtasks retain an explicit general tag.
tag('elevenlabs','voice.transcription','https://elevenlabs.io/speech-to-text');
tag('deepgram','voice.transcription','https://deepgram.com/product/speech-to-text');
tag('descript','voice.transcription','https://www.descript.com/transcription');
for(const tool of tools.filter(t=>t.active!==false&&t.capabilities.includes('voiceover')))tag(tool.id,'voice.voiceover');
tag('elevenlabs','voice.cloning','https://elevenlabs.io/voice-cloning');
tag('murf','voice.cloning','https://murf.ai/api/docs/voices-styles/instant-voice-cloning');
tag('photoroom','image.background_removal','https://www.photoroom.com/tools/background-remover');
tag('canva','image.background_removal','https://www.canva.com/features/background-remover/');
tag('firefly','image.background_removal','https://www.adobe.com/express/feature/image/remove-background');
for(const id of ['runway','pika','luma','midjourney','firefly','ideogram','leonardo','recraft','krea'])tag(id,'image.generation');
for(const id of ['photoroom','magnific','recraft','firefly'])tag(id,'image.editing');
for(const id of ['runway','pika','luma','invideo','firefly','leonardo','krea','fliki'])tag(id,'video.generation');
for(const id of ['veed','capcut','descript'])tag(id,'video.editing');
tag('veed','video.subtitles','https://www.veed.io/tools/auto-subtitle-generator-online');
tag('capcut','video.subtitles','https://www.capcut.com/tools/auto-caption-generator');
tag('descript','video.subtitles','https://www.descript.com/transcription');
tag('heygen','video.avatar','https://www.heygen.com/');
tag('synthesia','video.avatar','https://www.synthesia.io/');
tag('canva','design.social_posts','https://www.canva.com/social-media/');
for(const id of ['designer','predis-ai','adcreative-ai'])tag(id,'design.social_posts');
for(const id of ['brandmark','logoai','canva'])tag(id,'design.logos');
tag('figma','design.ui','https://www.figma.com/ai/');
tag('uizard','design.ui','https://uizard.io/');
tag('relume','design.ui','https://www.relume.ai/pricing');
for(const id of ['github-copilot','cursor','replit'])tag(id,'code.assistant');
for(const id of ['bolt','lovable','v0','framer'])tag(id,'code.no_code');
tag('hyperwrite','writing.resume','https://www.hyperwriteai.com/aitools/resume-generator');
tag('canva','writing.resume','https://www.canva.com/ai-resume-builder/');
tag('rezi','writing.resume','https://www.rezi.ai/');
for(const id of ['jasper','writesonic','hyperwrite'])tag(id,'writing.articles');
for(const tool of tools.filter(t=>t.capabilities.includes('proofreading')&&!t.general_purpose))tag(tool.id,'writing.proofreading');
tag('writer','writing.email','https://support.writer.com/articles/2664880799-how-to-use-writer-agent');
tag('lindy','writing.email','https://www.lindy.ai/ai-email-writer');
tag('lindy','productivity.email_automation','https://www.lindy.ai/tools/ai-email-assistant');
tag('zapier-ai','productivity.email_automation','https://zapier.com/automation/use-case/using-ai-automatically-respond-to-incoming-emails-or-messages');
tag('taskade','productivity.email_automation','https://www.taskade.com/agents/productivity/auto-email-responder');
for(const id of ['knowt','khanmigo','schoolai','questionwell'])tag(id,'education.study');
for(const id of ['notebooklm','scholarcy','chatpdf'])tag(id,'research.documents');
tag('designer','image.enhancement','https://www.microsoft.com/en-us/microsoft-365/microsoft-designer');
tag('magnific','image.enhancement');
tag('photoroom','image.enhancement','https://www.photoroom.com/');
tag('krisp','voice.denoising','https://krisp.ai/');
tag('descript','voice.denoising','https://www.descript.com/studio-sound');
tag('veed','voice.denoising','https://www.veed.io/tools/remove-background-noise-from-audio');
tag('notebooklm','video.summarization','https://support.google.com/notebooklm/answer/16164461?hl=en');
tag('suno','music.lyrics','https://suno.com/');
tag('udio','music.lyrics','https://help.udio.com/en/articles/10716221-create-a-song-with-your-own-lyrics');
tag('hyperwrite','writing.formal_replies','https://www.hyperwriteai.com/aitools');
tag('lindy','writing.formal_replies','https://www.lindy.ai/ai-email-writer');
tag('writer','writing.formal_replies','https://support.writer.com/articles/2664880799-how-to-use-writer-agent');
tag('copy-ai','writing.social_captions','https://www.copy.ai/tools');
tag('motion','productivity.task_organization','https://www.usemotion.com/');
tag('taskade','productivity.task_organization','https://www.taskade.com/');
// The official product notice supersedes old synthesis capability descriptions.
const retired=get('resemble');retired.active=false;retired.status='Voice synthesis product no longer available';retired.statusAr='منتج توليد الصوت لم يعد متاحًا';retired.statusSource='https://www.resemble.ai/product-notice';
retired.subtasks=[];retired.subtask_sources={};
for(const tool of tools){
 for(const category of tool.category){if(!tool.subtasks.some(id=>taxonomy.definitions[id]?.category===category))tool.subtasks.push(category+'.general');}
 tool.subtask_sources=Object.fromEntries(tool.subtasks.map(id=>[id,tool.subtask_sources[id]||tool.evidence.capabilities||tool.source_url]));
 tool.arabic_subtasks=[];
 if(tool.arabic_support==='partial'&&(tool.arabic_tasks||[]).includes('voice')&&tool.subtasks.includes('voice.voiceover'))tool.arabic_subtasks.push('voice.voiceover');
 if(tool.id==='veed')tool.arabic_subtasks.push('video.subtitles');
 if(tool.id==='firefly')tool.arabic_subtasks.push('image.generation');
 if(tool.id==='notebooklm')tool.arabic_subtasks.push('research.documents');
 if(tool.id==='framer')tool.arabic_subtasks.push('code.no_code');
 tool.subtask_free_tier=Object.fromEntries(tool.subtasks.map(id=>[id,'unknown']));
}
get('photoroom').subtask_free_tier['image.background_removal']='yes';
get('firefly').subtask_free_tier['image.background_removal']='yes';
fs.writeFileSync(file,JSON.stringify(tools,null,2)+'\n');
fs.writeFileSync(path.join(root,'data/subtasks.json'),JSON.stringify(taxonomy.definitions,null,2)+'\n');
fs.writeFileSync(path.join(root,'assets/tool-monograms/rezi.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#10294a"/><text x="24" y="30" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#83d8ff">RZ</text></svg>');
