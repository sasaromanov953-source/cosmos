(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(typeof gsap === 'undefined'){ return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---- Lenis smooth scroll, synced with GSAP ticker/ScrollTrigger ---- */
  if(typeof Lenis !== 'undefined' && !reduced){
    var lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if(id.length > 1 && document.querySelector(id)){
          e.preventDefault();
          lenis.scrollTo(id, { offset: -8 });
        }
      });
    });
  }

  /* ---- split hero headline into masked word reveals ---- */
  function splitWords(root){
    Array.prototype.forEach.call(root.childNodes, function(node){
      if(node.nodeType === 3){
        var words = node.textContent.split(/(\s+)/).filter(function(w){ return w.length; });
        var frag = document.createDocumentFragment();
        words.forEach(function(w){
          if(/^\s+$/.test(w)){ frag.appendChild(document.createTextNode(w)); return; }
          var wrap = document.createElement('span');
          wrap.className = 'word';
          var inner = document.createElement('span');
          inner.textContent = w;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
        });
        root.replaceChild(frag, node);
      } else if(node.nodeType === 1){
        splitWords(node);
      }
    });
  }
  var h1 = document.querySelector('.hero-copy h1');
  if(h1) splitWords(h1);

  /* ---- hero entrance choreography ---- */
  var heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  heroTl
    .from('.hero-copy .eyebrow', { opacity: 0, y: 14, duration: 0.5 })
    .from('.hero h1 .word > span', { yPercent: 115, rotate: 4, duration: 1, stagger: 0.045 }, '-=0.15')
    .from('.hero-copy .lede', { opacity: 0, y: 22, duration: 0.7 }, '-=0.55')
    .from('.hero-actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
    .from('.hero-hint', { opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-photo', { opacity: 0, scale: 1.15, duration: 1.5, ease: 'power3.out' }, '-=1.3');

  /* ---- hero parallax on scroll (stronger, multi-layer) ---- */
  if(!reduced){
    gsap.to('.hero-photo', {
      yPercent: 18,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
    gsap.to('.hero-copy', {
      yPercent: -26,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }

  /* ---- stage viewport: cinematic "dive in" pin + scale on scroll ---- */
  if(!reduced && window.innerWidth > 760){
    gsap.fromTo('#stageViewport',
      { scale: 0.88, opacity: 0, filter: 'blur(6px)' },
      {
        scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'none',
        scrollTrigger: { trigger: '#stageViewport', start: 'top 95%', end: 'top 35%', scrub: 0.5 }
      }
    );
  } else {
    gsap.from('#stageViewport', {
      opacity: 0, scale: 0.97, duration: 1,
      scrollTrigger: { trigger: '#stageViewport', start: 'top 85%' }
    });
  }

  /* ---- grid cards: pronounced staggered rise+scale on scroll ---- */
  ['.moon-card', '.sun-images .sun-img-card', '.beyond-card'].forEach(function(sel){
    var els = document.querySelectorAll(sel);
    if(!els.length) return;
    gsap.set(els, { opacity: 0, y: 46, scale: 0.94 });
    ScrollTrigger.batch(els, {
      start: 'top 90%',
      onEnter: function(batch){
        gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', overwrite: true });
      }
    });
  });
})();
