(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(typeof gsap === 'undefined'){ return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---- Lenis smooth scroll, synced with GSAP ticker/ScrollTrigger ---- */
  if(typeof Lenis !== 'undefined' && !reduced){
    var lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
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

  /* ---- hero entrance choreography ---- */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-copy .eyebrow', { opacity: 0, y: 14, duration: 0.6 })
    .from('.hero-copy h1', { opacity: 0, y: 26, duration: 0.85 }, '-=0.35')
    .from('.hero-copy .lede', { opacity: 0, y: 18, duration: 0.7 }, '-=0.45')
    .from('.hero-actions', { opacity: 0, y: 14, duration: 0.6 }, '-=0.4')
    .from('.hero-hint', { opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-photo', { opacity: 0, scale: 0.96, duration: 1 }, '-=0.9');

  /* ---- hero parallax on scroll ---- */
  if(!reduced){
    gsap.to('.hero-photo', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-copy', {
      yPercent: -10,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---- stage viewport: gentle scale-in as it enters view ---- */
  gsap.from('#stageViewport', {
    opacity: 0, scale: 0.97, duration: 1,
    scrollTrigger: { trigger: '#stageViewport', start: 'top 85%' }
  });
})();
