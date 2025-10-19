// меню + закрытие
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');
  if (btn && panel) {
    btn.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => panel.classList.remove('open')));
  }

  // умный курсор (на десктопе)
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    let x = window.innerWidth/2, y = window.innerHeight/2, tx = x, ty = y;
    const raf = () => { x += (tx - x)*0.18; y += (ty - y)*0.18; cursor.style.transform = `translate(${x-13}px,${y-13}px)`; requestAnimationFrame(raf); };
    raf();
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, {passive:true});
  }

  // слоган по словам + отражение
  const title = document.querySelector('.hero-title');
  if (title) {
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word'; span.textContent = w;
      span.style.setProperty('--d', (i * 260) + 'ms');
      title.appendChild(span);
      if (i < words.length - 1) title.appendChild(document.createTextNode(' '));
    });
    title.setAttribute('data-title', words.join(' '));
    const lastDelayMs = words.length * 260 + 900;
    document.documentElement.style.setProperty('--sub-delay', lastDelayMs + 'ms');
    document.documentElement.style.setProperty('--cta-delay', (lastDelayMs + 700) + 'ms');
  }

  // reveal секций
  const io = new IntersectionObserver((es)=>
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } })
  ,{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // вход страницы
  requestAnimationFrame(()=>document.body.classList.add('page-enter-done','hero-ready'));

  // плавные переходы
  document.querySelectorAll('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    const sameHost = href && !href.startsWith('http') && !a.hasAttribute('target');
    if (!sameHost) return;
    a.addEventListener('click', e=>{
      if (href.startsWith('#')) return;
      e.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(()=>{ window.location.href = href; }, 160);
    });
  });

  // параллакс
  const parallaxEls = document.querySelectorAll('.parallax');
  const upd = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach(el=>{
      const r = el.getBoundingClientRect();
      const center = (r.top + r.bottom)/2 - vh/2;
      const damp = 0.04;
      const shift = Math.max(-12, Math.min(12, -center * damp));
      el.style.setProperty('--py', shift.toFixed(1) + 'px');
    });

    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const k = Math.max(-6, Math.min(6, rect.top * 0.04));
        document.documentElement.style.setProperty('--hero-oy', k.toFixed(1) + 'px');
      }
    }
  };
  upd();
  window.addEventListener('scroll', upd, {passive:true});
  window.addEventListener('resize', upd);

  // skeleton -> loaded
  document.querySelectorAll('img.img-skel').forEach(img=>{
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', ()=>img.classList.add('loaded'));
  });

  // ripple координаты
  document.querySelectorAll('.ripple-btn').forEach(el=>{
    el.addEventListener('pointerdown', e=>{
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--rx', ((e.clientX - rect.left)/rect.width*100)+'%');
      el.style.setProperty('--ry', ((e.clientY - rect.top)/rect.height*100)+'%');
    }, {passive:true});
  });

  // модалка капель знаний
  const modal = document.getElementById('infoModal');
  const modalTitle = modal ? modal.querySelector('.modal-title') : null;
  const modalText = modal ? modal.querySelector('.modal-text') : null;
  const openModal = (t, txt) => {
    if (!modal) return;
    modalTitle.textContent = t; modalText.textContent = txt;
    modal.classList.add('show'); modal.setAttribute('aria-hidden','false');
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('show'); modal.setAttribute('aria-hidden','true');
  };
  document.querySelectorAll('.drop-info').forEach(b=>{
    b.addEventListener('click', ()=>{
      openModal(b.dataset.title || 'Информация', b.dataset.text || '');
    });
  });
  if (modal){
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
  }
});

// заглушка изображений
function fallback(img){
  img.onerror=null;
  img.src='data:image/svg+xml;utf8,'+encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="system-ui" font-size="28">Фото будет добавлено</text></svg>'
  );
}
