'use strict';
const assert=require('node:assert/strict'),engine=require('../smart-match.js'),tools=require('../data/tools.json');
const request='فيديو مع تعليق صوتي وصور';
assert.equal(engine.match(request,tools).recommendations.length,0,'Text must never authorize recommendations');
assert.equal(engine.match(request,tools).phase,'review');
const selected=['image.background_removal'];
const confirmed=engine.match(request,tools,{confirmedTasks:selected,budget:'any',language:'ar'});
assert.deepEqual(confirmed.tasks,['image']);assert.deepEqual(confirmed.subtasks,selected);
assert.ok(confirmed.recommendations.length>0);assert.ok(confirmed.recommendations.every(r=>r.subtask===selected[0]&&r.tool.subtasks.includes(selected[0])));
const changedText=engine.match('برمجة وموسيقى ووكيل تلقائي مجاني',tools,{confirmedTasks:selected,budget:'any',language:'ar'});
assert.deepEqual(changedText.recommendations.map(r=>[r.tool.id,r.score.total]),confirmed.recommendations.map(r=>[r.tool.id,r.score.total]),'Unconfirmed text must not affect ranking');
assert.equal(engine.match(request,tools,{confirmedTasks:[]}).recommendations.length,0);
assert.equal(engine.match(request,tools,{confirmedTasks:['__proto__','constructor','unknown.task']}).recommendations.length,0);
const link=engine.shareUrl('https://almersad505-art.github.io/zavlis-ai/',selected);
assert.deepEqual(engine.tasksFromUrl(link),selected);assert.ok(!link.includes(request));
assert.deepEqual(engine.tasksFromUrl('https://example.com/?tasks=image.background_removal,unknown.task,image.background_removal'),selected);
assert.deepEqual(engine.tasksFromUrl(engine.shareUrl(link,[])),[]);
for(const id of ['image.enhancement','voice.denoising','video.editing','video.summarization','music.lyrics','writing.formal_replies','writing.social_captions','productivity.task_organization']){
 assert.ok(engine.subtaskDefinitions[id]);
 const result=engine.match('',tools,{confirmedTasks:[id],language:'ar'});
 assert.ok(result.recommendations.length>0,'Missing documented tools: '+id);
 assert.ok(result.recommendations.every(r=>r.subtask===id&&r.tool.subtasks.includes(id)));
}
console.log('Confirmed-task gate, text independence, empty/invalid selection, share links and all new subtasks: PASS');
