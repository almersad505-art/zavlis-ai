'use strict';
const assert=require('node:assert/strict'),engine=require('../smart-match.js'),tools=require('../data/tools.json'),cases=require('./subtask-cases.json');
const records=cases.map(test=>{
 const proposed=engine.analyze(test.request);
 const result=engine.match(test.request,tools,{confirmedTasks:proposed.subtasks,budget:test.id===2?'free':'any',targetLanguage:test.id===6?'en':test.id===8?'ar':undefined});let status='PASS',error='';
 try{
  assert.deepEqual([...result.tasks].sort(),[...test.tasks].sort());
  assert.deepEqual([...result.subtasks].sort(),[...test.subtasks].sort());
  assert.equal(result.language,test.id===8?'en':'ar');
  for(const subtask of test.subtasks){
   const group=result.recommendations.filter(r=>r.subtask===subtask);
   assert.equal(group.length,3);
   assert.ok(group.every(r=>r.score.exactSubtask&&r.tool.subtasks.includes(subtask)),'Category-only fallback replaced a documented subtask');
   assert.ok(group.every(r=>r.score.components.task===50));
  }
  if(test.id===2)assert.equal(result.budget,'free');
  if(test.id===6)assert.equal(result.targetLanguage,'en');
 }catch(e){status='FAIL';error=e.message;}
 return {id:test.id,request:test.request,status,error,subtasks:result.subtasks,tools:result.recommendations.map(r=>({subtask:r.subtask,name:r.tool.name,score:r.score.total}))};
});
console.log('| # | الطلب | الفعلي: المهمة الفرعية ← الأدوات | النتيجة |');console.log('|---|---|---|---|');
for(const record of records){const groups=record.subtasks.map(id=>engine.subtaskDefinitions[id].labels[1]+' ← '+record.tools.filter(r=>r.subtask===id).map(r=>r.name).join('، '));console.log(`| ${record.id} | ${record.request} | ${groups.join('؛ ')} | ${record.status} |`);if(record.error)console.error(record.id+': '+record.error);}
process.exitCode=records.some(r=>r.status==='FAIL')?1:0;
