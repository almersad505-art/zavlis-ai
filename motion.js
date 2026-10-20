'use strict';
// Zavlis motion layer: Lenis smooth scrolling + subtle GSAP reveals.
// Content is never hidden unless the animation libraries loaded and motion is allowed.
(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap) return;
  const gsap = window.gsap;
  const hasST = !!window.ScrollTrigger;
  if (hasST) gsap.registerPlugin(window.ScrollTrigger);
  const rtl = () => document.documentElement.dir === 'rtl';

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  let lenis = null;
  if (window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
      if (hasST) lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      window.zavlisLenis = lenis;
    } catch (e) { lenis = null; }
  }

  // Hero entrance.
  const hero = document.querySelectorAll('.hero-content > *:not([hidden])');
  if (hero.length) gsap.from(hero, { y: 18, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' });
  const chips = document.querySelectorAll('.hero-chip');
  if (chips.length) gsap.from(chips, { x: () => (rtl() ? -24 : 24), opacity: 0, duration: 0.6, stagger: 0.08, delay: 0.25, ease: 'power2.out', clearProps: 'transform,opacity' });

  // Scroll reveals for cards below the fold only; anything already visible stays put.
  function reveal(selector) {
    if (!hasST) return;
    const items = [...document.querySelectorAll(selector)].filter(el => !el.dataset.revealed && el.offsetParent && el.getBoundingClientRect().top > window.innerHeight * 0.9);
    if (!items.length) return;
    items.forEach(el => { el.dataset.revealed = '1'; });
    gsap.set(items, { opacity: 0, y: 22 });
    window.ScrollTrigger.batch(items, {
      start: 'top 92%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out', clearProps: 'transform,opacity' })
    });
  }
  const targets = '.module, .toolcard, .guide-card, .section-head, .rail-card';
  window.addEventListener('load', () => { reveal(targets); if (hasST) window.ScrollTrigger.refresh(); });

  // Safety net: never leave a card invisible (e.g. if a trigger is skipped after a re-render).
  setInterval(() => {
    document.querySelectorAll('[data-revealed="1"]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === '0') gsap.to(el, { opacity: 1, y: 0, duration: 0.4, clearProps: 'transform,opacity' });
    });
  }, 1500);

  // Smart Match results: stagger cards in when they appear.
  const cards = document.getElementById('matchCards');
  if (cards) {
    new MutationObserver(records => {
      const added = records.flatMap(r => [...r.addedNodes]).filter(n => n.nodeType === 1 && n.matches('article, .match-card, [data-tool], div'));
      if (added.length) gsap.from(added, { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity' });
    }).observe(cards, { childList: true });
  }

  // Keep ScrollTrigger positions right after language/layout changes.
  document.getElementById('locale')?.addEventListener('change', () => { if (hasST) setTimeout(() => window.ScrollTrigger.refresh(), 300); });
  window.addEventListener('resize', () => { if (hasST) window.ScrollTrigger.refresh(); });
})();
