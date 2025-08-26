/* Hydro Bot enhanced interactions */
(function(){
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

  // Loader
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if(loader){ setTimeout(() => loader.classList.add('hide'), 200); }
  });

  // Mobile nav toggle
  const toggle = $('.nav-toggle');
  const nav = $('#nav-links');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Year
  $$('[data-year]').forEach(s => s.textContent = new Date().getFullYear());

  // Back to top
  const back = $('#backToTop');
  if(back){
    const onScroll = () => {
      if(window.scrollY > 400) back.classList.add('show');
      else back.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    back.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    onScroll();
  }

  // Reveal on scroll
  const reveals = $$('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.15});
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Simple lightbox
  function setupLightbox(){
    const items = $$('.gallery-item');
    if(!items.length) return;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<div class="lb-wrapper"><img alt=""><div class="caption"></div></div>';
    document.body.appendChild(lb);

    const img = $('img', lb);
    const caption = $('.caption', lb);

    function open(src, text){
      img.src = src;
      caption.textContent = text || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    }
    function close(){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      img.src = '';
    }

    lb.addEventListener('click', (e) => {
      if(e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') close();
    });

    items.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        open(a.getAttribute('href'), a.getAttribute('data-caption'));
      });
    });
  }
  setupLightbox();

  // Tilt effect (subtle)
  function setupTilt(){
    const tiltEls = $$('.tilt');
    tiltEls.forEach(el => {
      let rect;
      function updateRect(){ rect = el.getBoundingClientRect(); }
      updateRect();
      window.addEventListener('resize', updateRect);

      el.addEventListener('mousemove', (e) => {
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * 6;
        const ry = (x - 0.5) * 6;
        el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }
  setupTilt();
})();
