'use strict';
const assert=require('node:assert/strict');
const engine=require('../smart-match.js'),catalog=require('../data/tools.json');
const cases=require('./smart-match-cases.json');
const records=cases.map(test=>{
 const suggested=engine.match(test.request,catalog,{budget:test.budget||'any'});
 assert.equal(suggested.recommendations.length,0,'No recommendations before confirmation: '+test.request);
 const actual=engine.match(test.request,catalog,{budget:test.budget||'any',confirmedTasks:suggested.subtasks});
 assert.equal(actual.confirmed,true,test.request);
 assert.deepEqual([...actual.tasks].sort(),[...test.expectedTasks].sort(),test.request);
 assert.equal(actual.language,test.language,test.request);
 for(const task of test.expectedTasks){
  const group=actual.recommendations.filter(r=>r.task===task);
  assert.equal(group.length,3,test.request);
  assert.equal(new Set(group.map(r=>r.tool.id)).size,3);
  assert.ok(group.every(r=>r.tool.active!==false&&r.tool.tasks.includes(task)));
  let generalSeen=false;
  for(const r of group){if(!r.score.specialist)generalSeen=true;else assert.ok(!generalSeen,'General tool leads a specialist');}
 }
 const reversed=engine.match(test.request,[...catalog].reverse(),{budget:test.budget||'any',confirmedTasks:suggested.subtasks});
 assert.deepEqual(actual.recommendations.map(r=>r.tool.id),reversed.recommendations.map(r=>r.tool.id));
 return {id:test.id,status:'PASS',tasks:actual.tasks,tools:actual.recommendations.map(r=>({name:r.tool.name,task:r.task,score:r.score.total}))};
});
// Arabic output asked for in an English request must exclude tools with no Arabic support.
for(const [request,expected] of [['Transcribe my Arabic meeting','ar'],['A product video with an Arabic voiceover','ar'],['Ads for an Arab audience','ar'],['Transcribe my podcast episode','en'],['أفرّغ اجتماع','ar']]){
 assert.equal(engine.targetLanguage(request),expected,'targetLanguage: '+request);
 const s=engine.match(request,catalog);
 const r=engine.match(request,catalog,{confirmedTasks:s.subtasks});
 assert.equal(r.targetLanguage,expected,'match targetLanguage: '+request);
 if(expected==='ar')assert.ok(r.recommendations.every(x=>x.tool.arabic_support!=='no'),'No Arabic-unsupported tools for: '+request);
 records.push({id:'TL-'+request,status:'PASS',targetLanguage:r.targetLanguage,tools:r.recommendations.map(x=>x.tool.name)});
}
// "Translate my website" is translation, not coding.
for(const [request,expected] of [['أبي أترجم موقعي للعربي',['translation.website']],['translate my website to Arabic',['translation.website']],['ترجم لي هذا النص للإنجليزي',['translation.general']],['debug my python code',['code.assistant']],['ابغا اسوي امر برمبت',['writing.prompts']],['I want to write a prompt',['writing.prompts']]]){
 assert.deepEqual(engine.match(request,catalog).subtasks,expected,'intent: '+request);
 records.push({id:'IN-'+request,status:'PASS',subtasks:expected});
}
console.log(JSON.stringify({passed:records.length,records},null,2));
