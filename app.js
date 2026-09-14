"use strict";

const WHATSAPP_NUMBER = "5541999625634";
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');

let lockedScrollY = 0;
function lockBodyScroll(){
  lockedScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.classList.add('menu-open');
}
function unlockBodyScroll(){
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.classList.remove('menu-open');
  window.scrollTo(0, lockedScrollY);
}
function closeMenu(){
  if(!menuBtn || !nav) return;
  if(menuBtn.getAttribute('aria-expanded') !== 'true') return;
  menuBtn.setAttribute('aria-expanded','false');
  nav.classList.remove('open');
  unlockBodyScroll();
}
if(menuBtn && nav){
  menuBtn.addEventListener('click',()=>{
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
    if(open) unlockBodyScroll(); else lockBodyScroll();
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('resize',()=>{ if(innerWidth>820) closeMenu(); });
}

const scrollProgress = document.querySelector('#scrollProgress');
const backToTop = document.querySelector('#backToTop');
function onScroll(){
  header?.classList.toggle('scrolled', scrollY > 18);
  backToTop?.classList.toggle('visible', scrollY > 600);
  if(scrollProgress){
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
backToTop?.addEventListener('click', () => window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));

document.querySelectorAll('.wa-link').forEach(link=>{
  const message = link.dataset.message || 'Olá! Vim pelo site do Canil Von Haus Sotter e gostaria de mais informações.';
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const yearEl = document.querySelector('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Rotação automática das fotos de capa (hero) de cada seção, quando houver mais de uma.
const HERO_SLIDE_INTERVAL = 2000;
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.hero-slideshow').forEach(wrap => {
    const slides = [...wrap.querySelectorAll('img')];
    if (slides.length < 2) return;
    let current = slides.findIndex(img => img.classList.contains('active'));
    if (current < 0) current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, HERO_SLIDE_INTERVAL);
  });
}

const revealItems = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  revealItems.forEach(el=>observer.observe(el));
}else{
  revealItems.forEach(el=>el.classList.add('visible'));
}

const sectionLinks = [...document.querySelectorAll('.main-nav a[href^="#"], .quick-nav a[href^="#"]')];
const sections = sectionLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window && sections.length){
  const navObserver = new IntersectionObserver((entries)=>{
    const active = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!active) return;
    sectionLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === `#${active.target.id}`));
    const quickNav = document.querySelector('.quick-nav');
    const activePill = document.querySelector(`.quick-nav a[href="#${active.target.id}"]`);
    if(quickNav && activePill){
      const navRect = quickNav.getBoundingClientRect();
      const pillRect = activePill.getBoundingClientRect();
      const alreadyVisible = pillRect.left >= navRect.left && pillRect.right <= navRect.right;
      if(!alreadyVisible) activePill.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    }
  },{rootMargin:'-25% 0px -65% 0px',threshold:[0,.2,.5]});
  sections.forEach(s=>navObserver.observe(s));
}

// Galeria/lightbox: abre as fotos das seções em tamanho maior ao clicar, com navegação entre elas.
(() => {
  const galleryImages = [...document.querySelectorAll(
    '.section-hero-image img, .structure-photo img'
  )];
  if (!galleryImages.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Visualização ampliada da imagem');
  lightbox.innerHTML = `
    <div class="image-lightbox__dialog">
      <button class="image-lightbox__close" type="button" aria-label="Fechar imagem">×</button>
      <div class="image-lightbox__image-wrap">
        <button class="image-lightbox__nav image-lightbox__prev" type="button" aria-label="Imagem anterior">‹</button>
        <img class="image-lightbox__img" alt="">
        <button class="image-lightbox__nav image-lightbox__next" type="button" aria-label="Próxima imagem">›</button>
      </div>
      <div class="image-lightbox__caption"></div>
      <div class="image-lightbox__counter" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(lightbox);

  const modalImg = lightbox.querySelector('.image-lightbox__img');
  const caption = lightbox.querySelector('.image-lightbox__caption');
  const counter = lightbox.querySelector('.image-lightbox__counter');
  const closeBtn = lightbox.querySelector('.image-lightbox__close');
  const prevBtn = lightbox.querySelector('.image-lightbox__prev');
  const nextBtn = lightbox.querySelector('.image-lightbox__next');
  let currentIndex = 0;
  let lastFocus = null;

  const getCaption = (img) => {
    const figureCaption = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
    return figureCaption || img.getAttribute('alt') || '';
  };

  const render = (index) => {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[currentIndex];
    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt || 'Imagem ampliada do Canil Von Haus Sotter';
    caption.textContent = getCaption(img);
    counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  };

  const open = (index) => {
    lastFocus = document.activeElement;
    render(index);
    lightbox.classList.add('open');
    lockBodyScroll();
    closeBtn.focus({preventScroll:true});
  };

  const close = () => {
    lightbox.classList.remove('open');
    unlockBodyScroll();
    modalImg.removeAttribute('src');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({preventScroll:true});
  };

  galleryImages.forEach((img, index) => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${getCaption(img) || 'Imagem'} — clique para ampliar`);
    img.addEventListener('click', () => open(index));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(index);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => render(currentIndex - 1));
  nextBtn.addEventListener('click', () => render(currentIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') render(currentIndex - 1);
    if (event.key === 'ArrowRight') render(currentIndex + 1);
  });
})();
