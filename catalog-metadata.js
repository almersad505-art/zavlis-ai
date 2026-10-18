(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ZavlisMetadata=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
function describe(tool,language){const ar=language==='ar',unknown=ar?'غير محدد':'Not specified';let price=typeof tool.price_from==='number'?(ar?'من ':'From ')+tool.price_from+' '+(tool.price_currency==='unknown'?'':tool.price_currency):unknown;const priceScope=ar&&tool.price_scope_ar!=='unknown'?tool.price_scope_ar:tool.price_scope;if(typeof tool.price_from==='number'&&priceScope)price+=' — '+priceScope;const support={yes:ar?'نعم':'Yes',partial:ar?'جزئي':'Partial',no:ar?'لا':'No',unknown};let arabic=support[tool.arabic_support]||unknown;const scope=ar?tool.arabicScopeAr||tool.arabicScope:tool.arabicScope;if(tool.arabic_support==='partial'&&scope)arabic+=' — '+scope;return{price,arabic};}
return{describe};
});
