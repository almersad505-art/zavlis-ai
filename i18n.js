'use strict';
// Zavlis i18n layer for the dashboard homepage.
// The markup pairs English and Arabic copy side by side; this layer tags each
// half with data-l="en" / data-l="ar" so only the active language is shown,
// mirrors the layout for Arabic, and remembers the visitor's choice.
(() => {
  const AR = /[؀-ۿ]/;
  const LAT = /[A-Za-z]/;
  const KEY = 'zavlis-lang';
  const SKIP = '#matchCards,#matchSummary,#result,textarea,input,select,script,style,svg,code,pre,[data-i18n-skip]';
  const SEP = /(\s+[\/·|]\s+|\n\s*\n|\n)/;
  const names = new Set(['zavlis', 'zavlis ai', 'ai', 'pro', 'pdf', 'usd', 'seo', 'en', 'ui', 'ux', 'api', 'gpt', 'html', 'css', 'js']);
  try { (window.ZAVLIS_TOOLS || []).forEach(t => { names.add(String(t.name).toLowerCase()); }); } catch (e) { /* catalog optional */ }

  const strip = t => t.replace(/[\s\d.,:;!?()[\]\-–—→←↗↓+%$#&@'"|/·•*™®✳🔥👑]+/g, ' ').trim().toLowerCase();
  const neutral = t => { const s = strip(t); return !s || names.has(s) || s.split(/\s+/).every(w => names.has(w) || !LAT.test(w) && !AR.test(w)); };
  const foreignLatin = t => (t.match(/[A-Za-z][A-Za-z0-9.+'-]*/g) || []).some(w => !names.has(w.toLowerCase()));

  function pureClass(t) {
    if (!t.trim()) return 'n';
    const a = AR.test(t), l = LAT.test(t);
    if (a && !l) return 'ar';
    if (l && !a) return neutral(t) ? 'n' : 'en';
    return a && !foreignLatin(t) ? 'ar' : 'mix';
  }

  function cls(node) {
    if (node.nodeType === 3) { const c = pureClass(node.nodeValue); return c === 'mix' ? 'n' : c; }
    if (node.nodeType !== 1) return 'n';
    if (node.dataset.l) return node.dataset.l;
    if (node.matches('br,img')) return 'n';
    if (node.matches(SKIP)) return 'skip';
    return pureClass(node.textContent);
  }

  // Split "English / عربي", "English · عربي" or line-separated pairs inside one text node.
  function splitText(node) {
    const parts = node.nodeValue.split(SEP);
    if (parts.length < 3) return;
    const kinds = parts.map((p, i) => (i % 2 ? 'sep' : pureClass(p)));
    if (!kinds.includes('ar') || !kinds.includes('en') || kinds.includes('mix')) return;
    const frag = document.createDocumentFragment();
    parts.forEach((p, i) => {
      const k = kinds[i];
      if (k === 'sep') {
        const prev = kinds.slice(0, i).reverse().find(x => x === 'ar' || x === 'en');
        const next = kinds.slice(i + 1).find(x => x === 'ar' || x === 'en');
        if (prev && next && prev !== next) { const s = document.createElement('span'); s.dataset.l = 'sep'; s.textContent = p; frag.append(s); }
        else frag.append(p);
      } else if (k === 'ar' || k === 'en') { const s = document.createElement('span'); s.dataset.l = k; s.textContent = p; frag.append(s); }
      else frag.append(p);
    });
    node.replaceWith(frag);
  }

  function tag(node, l) {
    if (node.nodeType === 3) { const s = document.createElement('span'); s.dataset.l = l; node.replaceWith(s); s.append(node); return; }
    node.dataset.l = l;
  }

  function walk(el) {
    if (!el || el.nodeType !== 1 || el.matches(SKIP)) return;
    for (const c of [...el.childNodes]) if (c.nodeType === 3 && AR.test(c.nodeValue) && LAT.test(c.nodeValue)) splitText(c);
    const kids = [...el.childNodes].map(c => [c, cls(c)]);
    const paired = kids.some(k => k[1] === 'ar') && kids.some(k => k[1] === 'en');
    if (paired) for (const [c, k] of kids) if ((k === 'ar' || k === 'en') && !(c.nodeType === 1 && c.dataset.l)) tag(c, k);
    for (const [c] of kids) if (c.nodeType === 1 && (!c.dataset.l || c.dataset.l === 'mix')) walk(c);
  }

  // JS may later rewrite a tagged element in the other language; untag it so it is re-evaluated.
  function revalidate(root) {
    const parents = new Set();
    root.querySelectorAll('[data-l="en"],[data-l="ar"]').forEach(e => {
      const now = pureClass(e.textContent);
      if (now !== e.dataset.l) { delete e.dataset.l; if (e.parentElement) parents.add(e.parentElement); }
    });
    parents.forEach(walk);
  }

  // Attributes and <option> text cannot hide halves, so swap their text instead.
  function pairOf(text) {
    const parts = String(text || '').split(/\s+\/\s+|\n\s*\n/);
    if (parts.length !== 2) return null;
    const [x, y] = parts.map(p => p.trim());
    const cx = pureClass(x), cy = pureClass(y);
    if (cx === 'en' && cy === 'ar') return { en: x, ar: y };
    if (cx === 'ar' && cy === 'en') return { en: y, ar: x };
    return null;
  }
  function attrs(root) {
    const l = lang();
    root.querySelectorAll('[placeholder],[aria-label],[title],option').forEach(e => {
      if (e.closest('#locale')) return;
      for (const a of e.tagName === 'OPTION' ? ['text'] : ['placeholder', 'aria-label', 'title']) {
        const store = 'i18n' + a.replace(/-./g, m => m[1].toUpperCase());
        let pair = e.dataset[store] ? JSON.parse(e.dataset[store]) : null;
        if (!pair) {
          const v = a === 'text' ? e.text : e.getAttribute(a);
          pair = pairOf(v);
          if (!pair) continue;
          e.dataset[store] = JSON.stringify(pair);
        }
        if (a === 'text') { if (e.text !== pair[l]) e.text = pair[l]; }
        else if (e.getAttribute(a) !== pair[l]) e.setAttribute(a, pair[l]);
      }
    });
  }

  // Forward arrows point left in Arabic.
  function arrows(root) {
    const from = lang() === 'ar' ? '→' : '←', to = lang() === 'ar' ? '←' : '→';
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = it.nextNode())) if (n.nodeValue.includes(from) && !(n.parentElement && n.parentElement.closest('#result,textarea'))) n.nodeValue = n.nodeValue.split(from).join(to);
  }

  const sel = () => document.getElementById('locale');
  const lang = () => (sel() && sel().value === 'ar' ? 'ar' : 'en');

  let busy = false;
  function process(root) {
    busy = true;
    try { const r = root || document.body; revalidate(r); walk(r); attrs(r.querySelectorAll ? r : document); arrows(r); }
    finally { observer.takeRecords(); busy = false; }
  }

  function apply(l) {
    const html = document.documentElement;
    html.lang = l; html.dir = l === 'ar' ? 'rtl' : 'ltr'; html.dataset.ui = l;
    try { localStorage.setItem(KEY, l); } catch (e) { /* storage optional */ }
    try {
      const url = new URL(location.href);
      if (url.searchParams.get('lang') !== l) { url.searchParams.set('lang', l); history.replaceState(history.state, '', url.href); }
    } catch (e) { /* URL update optional */ }
    const q = document.getElementById('quickLanguage');
    if (q && !q.dataset.touched) q.value = l;
    process();
  }

  function initial() {
    let l = null;
    try { l = new URL(location.href).searchParams.get('lang'); } catch (e) { /* ignore */ }
    if (l !== 'ar' && l !== 'en') { try { l = localStorage.getItem(KEY); } catch (e) { l = null; } }
    if (l !== 'ar' && l !== 'en') l = /^ar\b/i.test(navigator.language || '') ? 'ar' : 'en';
    return l;
  }

  let queued = null;
  const observer = new MutationObserver(records => {
    if (busy) return;
    for (const r of records) {
      const targets = r.type === 'characterData' ? [r.target.parentElement] : [...r.addedNodes].map(n => (n.nodeType === 1 ? n : n.parentElement));
      for (const t of targets) if (t) { queued = queued || new Set(); queued.add(t); }
    }
    if (queued && !queued.raf) queued.raf = requestAnimationFrame(() => { const set = queued; queued = null; for (const el of set) if (el && el.isConnected) process(el.parentElement || el); });
  });

  function start() {
    const s = sel();
    if (!s) return;
    s.addEventListener('change', () => apply(lang()));
    document.getElementById('quickLanguage')?.addEventListener('change', e => { e.target.dataset.touched = '1'; });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    const l = initial();
    if (s.value !== l) { s.value = l; s.dispatchEvent(new Event('change', { bubbles: true })); }
    else apply(l);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
