'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),tools=JSON.parse(fs.readFileSync(path.join(root,'data/tools.json'),'utf8'));
const tasks=new Set(['video','voice','image','writing','code','design','music']),ids=new Set();
for(const tool of tools){
 if(!tool.id||ids.has(tool.id))throw Error('Missing or duplicate tool ID');ids.add(tool.id);
 if(!tool.name||!Array.isArray(tool.tasks)||!tool.tasks.length||tool.tasks.some(t=>!tasks.has(t)))throw Error('Invalid tool: '+tool.id);
 for(const field of ['officialUrl','affiliateUrl'])if(tool[field]&&new URL(tool[field]).protocol!=='https:')throw Error('HTTPS required: '+tool.id+' '+field);
 if(tool.price&&!tool.priceSource)throw Error('Price requires a source: '+tool.id);
 if(tool.arabic!==null&&typeof tool.arabic!=='boolean')throw Error('Unknown Arabic support must be null: '+tool.id);
 if(tool.arabic!==null&&!tool.arabicSource)throw Error('Arabic support requires a source: '+tool.id);
 if(!fs.existsSync(path.join(root,tool.logo)))throw Error('Missing local icon: '+tool.id);
}
if(tools.length<50)throw Error('At least 50 tools are required');
fs.writeFileSync(path.join(root,'tools-data.js'),'window.ZAVLIS_TOOLS = '+JSON.stringify(tools,null,2)+';\n');
console.log('Validated and synchronized '+tools.length+' tools.');
