'use strict';
// V4's accepted dashboard copy, frozen independently from the running DOM.
const approvedV4='Find the best AI tools, prepare creative content, and get started.ابحث عن الأدوات، وجهّز محتواك وخططك في مساحة واحدة.';
const historicalArabic='اكتشف أدوات الذكاء الاصطناعي المناسبة، وأنشئ أوامر احترافية للصور، وخططًا للفيديو، وقوالب برمجية تساعدك على تحويل أفكارك إلى خطوات عملية.';
function verify(actual,{language,width}){
 const failures=[];
 if(actual.scroll>actual.width)failures.push('Horizontal overflow');
 if(actual.titleBottom>actual.descriptionTop)failures.push('Title overlaps description');
 if(language==='ar'&&width<=700&&parseFloat(actual.font)>38)failures.push('Mobile title exceeds historical limit');
 if(actual.description!==approvedV4)failures.push('V4 copy differs');
 return {status:failures.length?'FAIL':'PASS',failures,historicalTextOnlyMismatch:language==='ar'&&actual.description!==historicalArabic&&actual.description===approvedV4};
}
module.exports={approvedV4,historicalArabic,verify};
