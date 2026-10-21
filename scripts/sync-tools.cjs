'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),tools=JSON.parse(fs.readFileSync(path.join(root,'data/tools.json'),'utf8')),engine=require('../smart-match.js'),ids=new Set();
const fields=['name','category','tasks','subtasks','keywords_ar','keywords_en','free_tier','arabic_support','price_from','url','source_url','last_checked'];
for(const tool of tools){
if(!tool.id||ids.has(tool.id))throw Error('Missing/duplicate ID: '+tool.id);ids.add(tool.id);
for(const f of fields)if(tool[f]===null||tool[f]===undefined||tool[f]==='')throw Error('Use explicit unknown: '+tool.id+' '+f);
for(const f of ['category','tasks','keywords_ar','keywords_en'])if(!Array.isArray(tool[f])||!tool[f].length)throw Error('Empty array: '+tool.id+' '+f);
for(const k of [...tool.category,...tool.tasks])if(!engine.labels[k])throw Error('Invalid category/task: '+k);
if(!Array.isArray(tool.subtasks)||!tool.subtasks.length)throw Error('Subtask tags required: '+tool.id);
for(const subtask of tool.subtasks){const definition=engine.subtaskDefinitions[subtask];if(!definition||!tool.category.includes(definition.category))throw Error('Invalid subtask: '+tool.id+' '+subtask);if(!tool.subtask_sources[subtask])throw Error('Subtask source required: '+tool.id+' '+subtask);}
if(!['yes','no','trial','unknown'].includes(tool.free_tier)||!['yes','partial','no','unknown'].includes(tool.arabic_support))throw Error('Invalid enum: '+tool.id);
if(tool.price_from!=='unknown'&&!(typeof tool.price_from==='number'&&Number.isFinite(tool.price_from)&&tool.price_from>=0))throw Error('Price must be numeric or unknown');
for(const f of ['url','source_url'])if(new URL(tool[f]).protocol!=='https:')throw Error('HTTPS required');
if(tool.affiliateUrl&&new URL(tool.affiliateUrl).protocol!=='https:')throw Error('HTTPS affiliate required');
for(const f of ['free_tier','arabic_support','price_from'])if(tool[f]!=='unknown'&&(!tool.evidence[f]||tool.evidence[f]==='unknown'))throw Error('Missing official evidence: '+tool.id+' '+f);
if(!/^\d{4}-\d{2}-\d{2}$/.test(tool.last_checked))throw Error('Invalid check date');
if(!fs.existsSync(path.join(root,tool.logo)))throw Error('Missing icon: '+tool.id);
}
if(tools.filter(t=>t.active!==false).length<150)throw Error('150 active tools required');
for(const k of Object.keys(engine.labels))if(!tools.some(t=>t.category.includes(k)&&t.active!==false))throw Error('Missing category: '+k);
fs.writeFileSync(path.join(root,'tools-data.js'),'window.ZAVLIS_TOOLS = '+JSON.stringify(tools)+';\n');
console.log('Validated and synchronized '+tools.length+' tools across 15 categories.');
