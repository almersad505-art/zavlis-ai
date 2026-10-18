'use strict';
const assert=require('node:assert/strict');
const engine=require('../smart-match.js'),catalog=require('../data/tools.json');
const cases=require('./smart-match-cases.json');
const records=cases.map(test=>{
 const actual=engine.match(test.request,catalog,{budget:test.budget||'any'});
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
 const reversed=engine.match(test.request,[...catalog].reverse(),{budget:test.budget||'any'});
 assert.deepEqual(actual.recommendations.map(r=>r.tool.id),reversed.recommendations.map(r=>r.tool.id));
 return {id:test.id,status:'PASS',tasks:actual.tasks,tools:actual.recommendations.map(r=>({name:r.tool.name,task:r.task,score:r.score.total}))};
});
console.log(JSON.stringify({passed:records.length,records},null,2));
