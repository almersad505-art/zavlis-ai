'use strict';
// Suggestions never authorize ranking. Only this explicit confirmation step does.
const taskPickerIcons={voice:'🎙️',image:'🖼️',video:'🎬',design:'🎨',code:'💻',writing:'✍️',education:'📚',productivity:'📋',research:'🔎',music:'🎵',presentations:'📊',marketing:'📣',translation:'🌐',data:'🧮',automation:'⚙️'};
const taskPickerState={selected:new Set(),suggested:new Set(),confirmed:[],gridOpen:false,pending:false,timer:null};
const taskPicker=document.createElement('section');taskPicker.id='taskPicker';taskPicker.className='task-picker';taskPicker.setAttribute('data-clarity-mask','true');
const taskPickerHeading=document.createElement('h3');taskPickerHeading.id='taskPickerHeading';
const taskPickerStatus=document.createElement('p');taskPickerStatus.className='task-picker-status';taskPickerStatus.setAttribute('role','status');
const taskPickerChips=document.createElement('div');taskPickerChips.className='task-picker-chips';taskPickerChips.setAttribute('role','group');taskPickerChips.setAttribute('aria-labelledby','taskPickerHeading');
const taskPickerActions=document.createElement('div');taskPickerActions.className='task-picker-actions';
const taskPickerManual=document.createElement('button');taskPickerManual.type='button';taskPickerManual.id='chooseTasks';taskPickerManual.className='task-manual';taskPickerManual.setAttribute('aria-controls','taskPickerGrid');
const taskPickerConfirm=document.createElement('button');taskPickerConfirm.type='button';taskPickerConfirm.id='showConfirmedTools';taskPickerConfirm.className='btn';
const taskPickerShare=document.createElement('button');taskPickerShare.type='button';taskPickerShare.id='shareConfirmedTasks';taskPickerShare.className='task-share';
const taskPickerShareField=document.createElement('input');taskPickerShareField.type='url';taskPickerShareField.readOnly=true;taskPickerShareField.hidden=true;
const taskPickerGrid=document.createElement('div');taskPickerGrid.id='taskPickerGrid';taskPickerGrid.className='task-picker-grid';taskPickerGrid.hidden=true;
taskPickerActions.append(taskPickerManual,taskPickerConfirm,taskPickerShare);
taskPicker.append(taskPickerHeading,taskPickerStatus,taskPickerChips,taskPickerActions,taskPickerShareField,taskPickerGrid);
$('topic').closest('.field').after(taskPicker);
const taskPickerHero=document.createElement('button');taskPickerHero.id='chooseTasksHero';taskPickerHero.type='button';taskPickerHero.className='task-manual';taskPickerHero.textContent='اختر بنفسك / Choose yourself';$('jump').after(taskPickerHero);

function taskPickerClearOutput(){resetOutput();resetCards();$('result').hidden=true;}
function taskPickerWriteUrl(tasks){const value=ZavlisMatch.shareUrl(location.href,tasks);if(value!==location.href)history.replaceState(null,'',value);}
function taskPickerInvalidate(){taskPickerState.confirmed=[];taskPickerClearOutput();taskPickerShareField.hidden=true;taskPickerWriteUrl([]);}
function taskPickerChoice(id,grid){
 const definition=ZavlisMatch.subtaskDefinitions[id],button=document.createElement('button');button.type='button';button.className='task-choice';button.id=(grid?'taskGrid-':'taskChip-')+id;
 button.dataset.subtask=id;button.setAttribute('aria-pressed',String(taskPickerState.selected.has(id)));
 const ar=document.createElement('span'),en=document.createElement('small'),icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent=taskPickerIcons[definition.category];ar.textContent=definition.labels[1];en.textContent=definition.labels[0];ar.lang='ar';en.lang='en';button.append(icon,ar,en);
 button.addEventListener('click',()=>{
  clearTimeout(taskPickerState.timer);taskPickerState.pending=false;
  if(taskPickerState.selected.has(id))taskPickerState.selected.delete(id);else taskPickerState.selected.add(id);
  taskPickerState.suggested.add(id);taskPickerInvalidate();taskPickerRender();document.getElementById(button.id)?.focus({preventScroll:true});
 });
 return button;
}
function taskPickerRender(){
 taskPicker.hidden=mod!==0;
 for(const id of ['task','style']){const field=document.getElementById(id)?.closest('.field');if(field)field.hidden=mod===0;}
 if(mod!==0)return;
 $('produce').textContent='فهم الطلب / Understand request';
 taskPickerHeading.textContent=taskPickerState.suggested.size||taskPickerState.selected.size?'فهمت إنك تبي: / I understood you want:':'اختر وش تبي تسوي / Choose what you want to do';
 taskPickerStatus.textContent=taskPickerState.pending?'جارٍ فهم الطلب… / Understanding…':'عدّل المهام ثم اضغط «اعرض الأدوات». / Adjust tasks, then select Show tools.';
 taskPickerManual.textContent='اختر بنفسك / Choose yourself';taskPickerConfirm.textContent='اعرض الأدوات / Show tools';taskPickerShare.textContent='نسخ رابط المهام / Copy task link';
 taskPickerConfirm.disabled=taskPickerState.pending||taskPickerState.selected.size===0;taskPickerShare.disabled=taskPickerState.confirmed.length===0;taskPickerShareField.setAttribute('aria-label','رابط المهام المؤكدة / Confirmed task link');
 taskPickerChips.replaceChildren(...[...new Set([...taskPickerState.suggested,...taskPickerState.selected])].map(id=>taskPickerChoice(id,false)));
 taskPickerManual.setAttribute('aria-expanded',String(taskPickerState.gridOpen));taskPickerGrid.hidden=!taskPickerState.gridOpen;
 if(taskPickerState.gridOpen){
  const sections=[];
  for(const [category,names]of Object.entries(ZavlisMatch.labels)){
   const section=document.createElement('section');section.className='task-picker-category';section.setAttribute('role','group');
   const heading=document.createElement('h4');heading.id='taskCategory-'+category;heading.textContent=taskPickerIcons[category]+' '+names[1]+' / '+names[0];section.setAttribute('aria-labelledby',heading.id);section.append(heading);
   for(const [id,definition]of Object.entries(ZavlisMatch.subtaskDefinitions))if(definition.category===category)section.append(taskPickerChoice(id,true));
   sections.push(section);
  }
  taskPickerGrid.replaceChildren(...sections);
 }
}
function taskPickerInfer(){
 if(mod!==0)return;
 clearTimeout(taskPickerState.timer);taskPickerState.pending=false;taskPickerInvalidate();
 const inferred=ZavlisMatch.analyze($('topic').value),ids=[...inferred.subtasks];
 for(const category of inferred.tasks)if(!ids.some(id=>ZavlisMatch.subtaskDefinitions[id].category===category))ids.push(category+'.general');
 taskPickerState.selected=new Set(ZavlisMatch.cleanConfirmedTasks(ids));taskPickerState.suggested=new Set(taskPickerState.selected);
 taskPickerState.gridOpen=taskPickerState.selected.size===0;taskPickerRender();
}
function taskPickerOpenGrid(){
 clearTimeout(taskPickerState.timer);taskPickerState.pending=false;
 if(mod!==0||$('studio').hidden)launchTool(0);
 taskPickerState.gridOpen=true;taskPickerRender();taskPicker.scrollIntoView({behavior:'smooth',block:'start'});
}
function taskPickerShowTools(){
 clearTimeout(taskPickerState.timer);taskPickerState.pending=false;
 const confirmed=ZavlisMatch.cleanConfirmedTasks([...taskPickerState.selected]);if(!confirmed.length){taskPickerOpenGrid();return;}
 const outputLanguage=$('topic').value.trim()?ZavlisMatch.language($('topic').value):lang;
 const result=ZavlisMatch.match($('topic').value,ZAVLIS_TOOLS,{confirmedTasks:confirmed,budget:$('budget').value,language:outputLanguage,targetLanguage:$('topic').value.trim()&&typeof ZavlisMatch.targetLanguage==='function'?ZavlisMatch.targetLanguage($('topic').value):outputLanguage});
 taskPickerState.confirmed=[...confirmed];taskPickerClearOutput();last=ZavlisMatch.text(result);$('result').textContent=last;$('result').hidden=true;outputRevision++;
 matchSummary.hidden=false;matchSummary.dir=outputLanguage==='ar'?'rtl':'ltr';matchSummary.textContent=(outputLanguage==='ar'?'المهام المؤكدة: ':'Confirmed tasks: ')+confirmed.map(id=>ZavlisMatch.subtaskDefinitions[id].labels[outputLanguage==='ar'?1:0]).join(' + ')+(result.warnings.length?' — '+result.warnings.join(' '):'');
 resultCards.hidden=false;resultCards.dir=matchSummary.dir;resultCards.replaceChildren();
 for(const id of confirmed){
  const heading=document.createElement('h3');heading.dataset.matchSubtask=id;heading.textContent=ZavlisMatch.subtaskDefinitions[id].labels[outputLanguage==='ar'?1:0];resultCards.append(heading);
  for(const r of result.recommendations.filter(r=>r.subtask===id)){
   const card=makeCard(r.tool,r.reason,result.language,id.endsWith('.general')?null:id);card.dataset.matchTask=r.task;card.dataset.matchSubtask=id;card.dataset.rank=r.rank;card.dataset.score=r.score.total;resultCards.append(card);
  }
 }
 $('copy').disabled=!result.recommendations.length;$('download').disabled=!result.recommendations.length;taskPickerWriteUrl(confirmed);taskPickerShareField.value=location.href;taskPickerRender();
}
const taskPickerPreviousSubmit=$('form').onsubmit;
$('form').onsubmit=event=>{if(mod!==0){taskPickerPreviousSubmit(event);return;}event.preventDefault();taskPickerInfer();};
$('topic').addEventListener('input',()=>{if(mod!==0)return;clearTimeout(taskPickerState.timer);taskPickerState.pending=true;taskPickerInvalidate();taskPickerRender();taskPickerState.timer=setTimeout(taskPickerInfer,180);});
$('form').addEventListener('change',event=>{if(mod!==0||event.target===$('topic'))return;taskPickerInvalidate();taskPickerRender();});
taskPickerManual.addEventListener('click',taskPickerOpenGrid);taskPickerHero.addEventListener('click',taskPickerOpenGrid);taskPickerConfirm.addEventListener('click',taskPickerShowTools);
taskPickerShare.addEventListener('click',async()=>{if(!taskPickerState.confirmed.length)return;const url=ZavlisMatch.shareUrl(location.href,taskPickerState.confirmed);taskPickerShareField.value=url;try{await navigator.clipboard.writeText(url);taskPickerStatus.textContent='نُسخ الرابط / Link copied';}catch{taskPickerShareField.hidden=false;taskPickerShareField.select();taskPickerStatus.textContent='انسخ الرابط من الحقل / Copy the link from the field';}});
const taskPickerPreviousDraw=draw;draw=function(){if(mod!==0){clearTimeout(taskPickerState.timer);taskPickerState.pending=false;}taskPickerPreviousDraw();taskPickerRender();};
const taskPickerPreviousProduce=produce;produce=function(topic,style){return mod===0?(lang==='ar'?'أكد المهام ثم اضغط اعرض الأدوات.':'Confirm tasks, then select Show tools.'):taskPickerPreviousProduce(topic,style);};
function taskPickerRestoreUrl(){
 clearTimeout(taskPickerState.timer);taskPickerState.pending=false;
 const ids=ZavlisMatch.tasksFromUrl(location.href);taskPickerState.selected=new Set(ids);taskPickerState.suggested=new Set(ids);taskPickerState.confirmed=[];taskPickerState.gridOpen=ids.length===0;taskPickerShareField.hidden=true;
 if(new URL(location.href).searchParams.has('tasks')){launchTool(0);taskPickerClearOutput();taskPickerWriteUrl(ids);}
 taskPickerRender();
}
window.addEventListener('popstate',taskPickerRestoreUrl);taskPickerRestoreUrl();
