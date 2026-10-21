'use strict';
// Builds one static, search-friendly page per task in English and Arabic from the live catalogue.
// Run after any data update:  node scripts/build-task-pages.cjs
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = global;
require(path.join(root, 'subtasks.js'));
const M = require(path.join(root, 'smart-match.js'));
const catalog = require(path.join(root, 'data/tools.json'));
const BASE = 'https://almersad505-art.github.io/zavlis-ai/';
const DATE = new Date().toISOString().slice(0, 10);
const DEF = M.subtaskDefinitions;
const CAT_ORDER = ['writing', 'voice', 'video', 'image', 'design', 'presentations', 'marketing', 'translation', 'research', 'education', 'productivity', 'music', 'data', 'code', 'automation'];

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = id => id.endsWith('.general') ? id.split('.')[0] : id.replace(/[._]/g, '-');
const isGeneral = id => id.endsWith('.general');
const label = (id, ar) => isGeneral(id) ? M.labels[DEF[id].category][ar ? 1 : 0] : DEF[id].labels[ar ? 1 : 0];
const arDigits = (s, ar) => ar ? String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(s);
const active = catalog.filter(t => t.active !== false && /^https:\/\//.test(t.url || ''));
const arV = t => ['yes', 'partial', 'no'].includes(t.arabic_support) ? t.arabic_support : 'unknown';

const T = {
  en: {
    dir: 'ltr', other: 'ar', otherName: 'العربية', home: 'Home', all: 'All tasks',
    title: l => `Best AI tools for ${l.toLowerCase()} — honest picks | Zavlis AI`,
    h1: l => `AI tools for ${l.toLowerCase()}`,
    desc: (l, n) => `${n} AI tools for ${l.toLowerCase()}, ranked by an open score. See prices, free plans and whether each tool really supports Arabic.`,
    lede: 'Ranked by our open score: fits the task 50%, budget 20%, language 20%, specialist 10%. Nobody pays to rank, and affiliate links never change the order.',
    checked: d => `Data checked against official sources. Page built ${d}.`,
    picks: 'Top picks', others: 'Other tools for this task', none: 'No other tools in our catalogue for this task yet.',
    ar: { yes: 'Supports Arabic', partial: 'Partial Arabic support', no: 'No Arabic support', unknown: 'Arabic not verified yet' },
    price: 'Price', free: 'Free plan', freeV: { yes: 'Yes', trial: 'Trial only', no: 'No', unknown: 'Not verified' }, unknownPrice: 'Not specified',
    visit: 'Official site', srcP: 'price source', srcA: 'Arabic source',
    ctaH: 'Have a more specific job?', ctaP: 'Describe it in your own words and the engine splits it into steps and picks a tool for each one.', cta: 'Open the matching engine',
    faqH: 'Quick answers', qAr: l => `Which AI tools for ${l.toLowerCase()} support Arabic?`, qFree: l => `Is there a free AI tool for ${l.toLowerCase()}?`,
    aAr: names => names.length ? `In our catalogue: ${names.join(', ')}. Check each tool's Arabic note above for limits.` : 'None of the tools we list for this task has confirmed Arabic support yet.',
    aFree: names => names.length ? `Yes: ${names.join(', ')} offer a free plan. Limits apply; check the official site.` : 'We have not confirmed a free plan for the tools on this page.',
    hubTitle: 'AI tools by task — honest picks | Zavlis AI', hubH1: 'Find AI tools by task', hubP: n => `${n} tasks, each with ranked tools, prices and an honest Arabic-support check.`,
    tools: n => `${n} tools`, footer: 'Prices and features change often. Check the official site before you subscribe.'
  },
  ar: {
    dir: 'rtl', other: 'en', otherName: 'English', home: 'الرئيسية', all: 'كل المهام',
    title: l => `أفضل أدوات الذكاء الاصطناعي في ${l} — ترشيحات صادقة | Zavlis AI`,
    h1: l => `أدوات الذكاء الاصطناعي في ${l}`,
    desc: (l, n) => `${n} أدوات ذكاء اصطناعي في ${l}، مرتبة بتقييم مفتوح. شوف الأسعار والخطط المجانية وهل كل أداة تدعم العربي فعلًا.`,
    lede: 'مرتبة بتقييمنا المفتوح: مطابقة المهمة ٥٠٪، الميزانية ٢٠٪، اللغة ٢٠٪، التخصص ١٠٪. ما أحد يدفع عشان يتقدّم، وروابط العمولة ما تغيّر الترتيب أبدًا.',
    checked: d => `البيانات متحقق منها من المصادر الرسمية. آخر تحديث للصفحة ${d}.`,
    picks: 'أفضل الترشيحات', others: 'أدوات ثانية لهذي المهمة', none: 'ما فيه أدوات ثانية لهذي المهمة في دليلنا للحين.',
    ar: { yes: 'تدعم العربية', partial: 'دعم جزئي للعربية', no: 'لا تدعم العربية', unknown: 'لم نتحقق من العربية بعد' },
    price: 'السعر', free: 'خطة مجانية', freeV: { yes: 'نعم', trial: 'تجربة فقط', no: 'لا', unknown: 'لم نتحقق' }, unknownPrice: 'غير محدد',
    visit: 'الموقع الرسمي', srcP: 'مصدر السعر', srcA: 'مصدر العربية',
    ctaH: 'مهمتك أدق من كذا؟', ctaP: 'اكتبها بكلامك، والمحرك يقسمها خطوات ويختار أداة لكل خطوة.', cta: 'افتح محرك الترشيح',
    faqH: 'إجابات سريعة', qAr: l => `أي أدوات ${l} تدعم العربية؟`, qFree: l => `هل فيه أداة مجانية في ${l}؟`,
    aAr: names => names.length ? `في دليلنا: ${names.join('، ')}. راجع ملاحظة العربية لكل أداة فوق لمعرفة الحدود.` : 'ولا أداة من أدوات هذي المهمة مؤكد دعمها للعربية للحين.',
    aFree: names => names.length ? `نعم: ${names.join('، ')} فيها خطة مجانية بحدود معينة. تأكد من الموقع الرسمي.` : 'ما تأكدنا من خطة مجانية للأدوات في هذي الصفحة.',
    hubTitle: 'أدوات الذكاء الاصطناعي حسب المهمة — ترشيحات صادقة | Zavlis AI', hubH1: 'لقِ أداة الذكاء الاصطناعي حسب مهمتك', hubP: n => `${n} مهمة، لكل وحدة أدوات مرتبة وأسعار وتحقق صادق من دعم العربية.`,
    tools: n => `${n} أداة`, footer: 'الأسعار والمزايا تتغير كثيرًا. تأكد من الموقع الرسمي قبل الاشتراك.'
  }
};

function freeOf(t, sub) { const s = sub && t.subtask_free_tier && t.subtask_free_tier[sub]; return (s && s !== 'unknown' ? s : t.free_tier) || 'unknown'; }
function toolsFor(id) { return isGeneral(id) ? active.filter(t => t.tasks.includes(DEF[id].category)) : active.filter(t => (t.subtasks || []).includes(id)); }

function head(lang, title, desc, url, altUrl, jsonld) {
  const L = T[lang];
  return `<!doctype html>
<html lang="${lang}" dir="${L.dir}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#FBF6EC">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="clarity-project-id" content="yytrv421ps">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${lang}" href="${url}"><link rel="alternate" hreflang="${L.other}" href="${altUrl}"><link rel="alternate" hreflang="x-default" href="${lang === 'en' ? url : altUrl}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Zavlis AI"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}assets/og-zavlis.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="../../assets/zavlis-mark.svg">
<link rel="stylesheet" href="../tasks.css?v=1"><link rel="stylesheet" href="../../analytics.css">
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>
</head>
<body>`;
}

function top(lang, altHref) {
  const L = T[lang];
  return `<header class="bar"><div class="wrap">
<a class="brand" href="../../index.html?lang=${lang}"><img src="../../assets/zavlis-mark.svg" alt=""><span>Zavlis <b>AI</b></span></a>
<nav><a href="index.html">${L.all}</a><a href="../../index.html?lang=${lang}">${L.home}</a><a class="lang" href="${altHref}" hreflang="${L.other}" lang="${L.other}">${L.otherName}</a></nav>
</div></header>`;
}

function foot(lang) {
  return `<footer class="foot"><div class="wrap"><p>${esc(T[lang].footer)}</p><p><a href="../../about.html">About · من نحن</a> · <a href="../../score-methodology.html">Scoring · منهجية التقييم</a> · <a href="../../affiliate-disclosure.html">Affiliate disclosure · الإفصاح</a> · <a href="../../privacy.html">Privacy · الخصوصية</a></p></div></footer>
<script src="../../analytics.js"></script>
</body>
</html>
`;
}

function card(t, rank, lang, sub) {
  const L = T[lang], ar = lang === 'ar', v = arV(t), f = freeOf(t, sub);
  const scope = ar ? (t.arabicScopeAr || t.arabicScope) : t.arabicScope;
  const priceText = typeof t.price_from === 'number' ? (ar ? (t.price_scope_ar || t.price_scope) : t.price_scope) : L.unknownPrice;
  const links = [`<a class="go" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${L.visit} ↗</a>`];
  if (t.priceSource && /^https:/.test(t.priceSource)) links.push(`<a href="${esc(t.priceSource)}" target="_blank" rel="noopener noreferrer">${L.srcP}</a>`);
  if (t.arabicSource && /^https:/.test(t.arabicSource) && v !== 'unknown') links.push(`<a href="${esc(t.arabicSource)}" target="_blank" rel="noopener noreferrer">${L.srcA}</a>`);
  return `<article class="pick">
<span class="rank">${arDigits(rank, ar)}</span>
<div class="body"><h3>${esc(t.name)}</h3>
<p class="ar ar-${v}"><i aria-hidden="true"></i><b>${L.ar[v]}</b>${scope && v !== 'unknown' ? ' — ' + esc(scope) : ''}</p>
<p><b>${L.price}:</b> <bdi>${esc(priceText)}</bdi></p>
<p><b>${L.free}:</b> ${L.freeV[f] || L.freeV.unknown}</p>
<p class="links">${links.join(' · ')}</p></div>
</article>`;
}

function taskPage(id, lang) {
  const L = T[lang], ar = lang === 'ar', lbl = label(id, ar), s = slug(id);
  const url = `${BASE}tasks/${lang}/${s}.html`, alt = `${BASE}tasks/${L.other}/${s}.html`;
  const r = M.match('', catalog, { confirmedTasks: [id], language: lang, targetLanguage: lang });
  const picks = r.recommendations.map(x => x.tool);
  const pool = toolsFor(id);
  const others = pool.filter(t => !picks.includes(t) && !(ar && t.arabic_support === 'no')).sort((a, b) => a.name.localeCompare(b.name));
  const all = [...picks, ...others];
  const arNames = all.filter(t => arV(t) === 'yes').map(t => t.name);
  const freeNames = all.filter(t => freeOf(t, isGeneral(id) ? null : id) === 'yes').map(t => t.name);
  const qa = [[L.qAr(lbl), L.aAr(arNames)], [L.qFree(lbl), L.aFree(freeNames)]];
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'ItemList', name: L.h1(lbl), itemListElement: picks.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, url: t.url })) },
    { '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Zavlis AI', item: BASE }, { '@type': 'ListItem', position: 2, name: L.all, item: `${BASE}tasks/${lang}/index.html` }, { '@type': 'ListItem', position: 3, name: lbl, item: url }] }
  ] };
  const html = head(lang, L.title(lbl), L.desc(lbl, arDigits(all.length, ar)), url, alt, jsonld) + top(lang, `../${L.other}/${s}.html`) + `
<main class="wrap">
<p class="crumbs"><a href="../../index.html?lang=${lang}">Zavlis AI</a> / <a href="index.html">${L.all}</a> / ${esc(lbl)}</p>
<h1>${esc(L.h1(lbl))}</h1>
<p class="lede">${esc(L.lede)}</p>
<p class="checked">${esc(L.checked(arDigits(DATE, ar)))}</p>
<section><h2>${L.picks}</h2>
${picks.map((t, i) => card(t, i + 1, lang, isGeneral(id) ? null : id)).join('\n')}
</section>
<aside class="cta"><h2>${L.ctaH}</h2><p>${L.ctaP}</p><a class="btn" href="../../index.html?lang=${lang}&amp;tasks=${encodeURIComponent(id)}#studio">${L.cta}</a></aside>
<section><h2>${L.others}</h2>
${others.length ? `<ul class="others">${others.map(t => `<li><a href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${esc(t.name)}</a> <span class="ar-${arV(t)}"><i aria-hidden="true"></i>${L.ar[arV(t)]}</span></li>`).join('')}</ul>` : `<p>${L.none}</p>`}
</section>
<section class="faq"><h2>${L.faqH}</h2>
${qa.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
</section>
</main>` + foot(lang);
  return { html, url, count: all.length };
}

function hub(lang, ids) {
  const L = T[lang], ar = lang === 'ar';
  const url = `${BASE}tasks/${lang}/index.html`, alt = `${BASE}tasks/${L.other}/index.html`;
  const byCat = {}; ids.forEach(id => (byCat[DEF[id].category] ||= []).push(id));
  const jsonld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: L.hubH1, url };
  const html = head(lang, L.hubTitle, L.hubP(ids.length), url, alt, jsonld) + top(lang, `../${L.other}/index.html`) + `
<main class="wrap">
<h1>${L.hubH1}</h1>
<p class="lede">${esc(L.hubP(arDigits(ids.length, ar)))}</p>
<div class="hub">
${CAT_ORDER.filter(c => byCat[c]).map(c => `<section><h2>${esc(M.labels[c][ar ? 1 : 0])}</h2><ul>${byCat[c].sort((a, b) => isGeneral(a) - isGeneral(b)).map(id => `<li><a href="${slug(id)}.html">${esc(label(id, ar))}</a> <span>${T[lang].tools(arDigits(toolsFor(id).length, ar))}</span></li>`).join('')}</ul></section>`).join('\n')}
</div>
</main>` + foot(lang);
  return { html, url };
}

const ids = Object.keys(DEF).filter(id => toolsFor(id).length > 0);
const urls = [];
for (const lang of ['en', 'ar']) {
  const dir = path.join(root, 'tasks', lang); fs.mkdirSync(dir, { recursive: true });
  for (const id of ids) { const p = taskPage(id, lang); fs.writeFileSync(path.join(dir, slug(id) + '.html'), p.html); urls.push(p.url); }
  const h = hub(lang, ids); fs.writeFileSync(path.join(dir, 'index.html'), h.html); urls.push(h.url);
}
// Sitemap: keep existing entries, replace task entries.
const smPath = path.join(root, 'sitemap.xml');
const existing = (fs.readFileSync(smPath, 'utf8').match(/<loc>[^<]+<\/loc>/g) || []).map(x => x.slice(5, -6)).filter(u => !u.includes('/tasks/'));
const sm = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + [...existing, ...urls].map(u => `<url><loc>${u}</loc></url>`).join('') + '</urlset>\n';
fs.writeFileSync(smPath, sm);
console.log(JSON.stringify({ tasks: ids.length, pages: urls.length, sitemap: existing.length + urls.length }));
