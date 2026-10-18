(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZavlisMetadata=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 function describe(tool,language){
  const ar=language==='ar',unknown=ar?'غير محدد':'Not specified';
  const price=typeof tool.price==='string'&&tool.price.trim()?(ar?tool.priceAr||tool.price:tool.price):unknown;
  let arabic=unknown;
  if(tool.arabic===true||tool.arabic===false){
   arabic=tool.arabic?(ar?'نعم':'Yes'):(ar?'غير مدعوم رسميًا':'Not officially supported');
   const scope=ar?tool.arabicScopeAr||tool.arabicScope:tool.arabicScope;
   if(scope)arabic+=' — '+scope;
  }
  return {price,arabic};
 }
 return {describe};
});
