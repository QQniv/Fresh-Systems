document.addEventListener('DOMContentLoaded', () => {
  // меню
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');
  if (btn && panel) {
    btn.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => panel.classList.remove('open')));
  }

  // слоган по словам + данные для отражения
  const title = document.querySelector('.hero-title');
  if (title) {
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      span.style.setProperty('--d', (i * 260) + 'ms');
      title.appendChild(span);
      if (i < words.length - 1) title.appendChild(document.createTextNode(' '));
    });
    title.setAttribute('data-title', words.join(' ')); // для отражения
    const lastDelayMs = words.length * 260 + 900;
    document.documentElement.style.setProperty('--sub-delay', lastDelayMs + 'ms');
    document.documentElement.style.setProperty('--cta-delay', (lastDelayMs + 700) + 'ms');
  }

  // reveal секций
  const io = new IntersectionObserver((es)=>
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } })
  ,{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // плавный вход страницы
  requestAnimationFrame(()=>document.body.classList.add('page-enter-done','hero-ready'));

  // плавные переходы между страницами
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

  // лёгкий параллакс контента
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

    // параллакс фона геро-секции
    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        const k = Math.max(-6, Math.min(6, rect.top * 0.04));
        document.documentElement.style.setProperty('--hero-oy', k.toFixed(1) + 'px');
      }
    }
  };
  upd();
  window.addEventListener('scroll', upd, {passive:true});
  window.addEventListener('resize', upd);
});

// заглушка изображений (глобально)
function fallback(img){
  img.onerror=null;
  img.src='data:image/svg+xml;utf8,'+encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="system-ui" font-size="28">Фото будет добавлено</text></svg>'
  );
}
