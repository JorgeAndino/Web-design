

'use strict';

// /* ---- CURSOR ---- */
// const cursor = document.getElementById('cursor');

// if (window.matchMedia('(pointer: fine)').matches) {
//   document.documentElement.style.cursor = 'none';

//   let cx = window.innerWidth / 2;
//   let cy = window.innerHeight / 2;

//   document.addEventListener('mousemove', e => {
//     cx = e.clientX;
//     cy = e.clientY;
//     cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
//   });

//   const hoverTargets = 'a, button, .work-item, .serv-item, input, select, textarea';
//   document.querySelectorAll(hoverTargets).forEach(el => {
//     el.addEventListener('mouseenter', () => cursor.classList.add('big'));
//     el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
//   });
// } else {
//   cursor.style.display = 'none';
// }

/* ---- NAV: STICKY ---- */
const nav = document.getElementById('nav');

const navObs = new IntersectionObserver(
  ([e]) => nav.classList.toggle('stuck', !e.isIntersecting),
  { rootMargin: '-80px 0px 0px 0px' }
);

const heroEl = document.getElementById('inicio');
if (heroEl) navObs.observe(heroEl);

/* ---- MOBILE MENU ---- */
const burger      = document.getElementById('burger');
const overlayMenu = document.getElementById('overlayMenu');
const overlayClose = document.getElementById('overlayClose');

function openMenu() {
  overlayMenu.classList.add('open');
  overlayMenu.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  // Animate burger to X
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = 'rotate(45deg) translate(0, 4px)';
  spans[1].style.transform = 'rotate(-45deg) translate(0, -4px)';
}

function closeMenu() {
  overlayMenu.classList.remove('open');
  overlayMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const spans = burger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.transform = '';
}

burger.addEventListener('click', openMenu);
overlayClose.addEventListener('click', closeMenu);

document.querySelectorAll('.overlay-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ---- PORTFOLIO FILTER ---- */
const filterBtns = document.querySelectorAll('.f-btn');
const workItems  = document.querySelectorAll('.work-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.f;

    workItems.forEach(item => {
      const cat = item.dataset.cat;
      const show = filter === 'all' || cat === filter;
      item.classList.toggle('hidden', !show);
      // Re-trigger subtle fade
      if (show) {
        item.style.opacity = '0';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity .35s ease';
          item.style.opacity = '1';
          setTimeout(() => item.style.transition = '', 400);
        });
      }
    });
  });
});

/* ---- SCROLL REVEAL ---- */
const revealEls = document.querySelectorAll('.reveal');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger sibling reveals inside grids and lists
function staggerReveal(containerSelector, childSelector) {
  document.querySelectorAll(containerSelector).forEach(container => {
    container.querySelectorAll(childSelector).forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });
}

staggerReveal('.work-grid', '.work-item');
staggerReveal('.serv-list', '.serv-item');
staggerReveal('.sobre-grid', '.reveal');
staggerReveal('.contact-grid', '.reveal');

revealEls.forEach(el => revealObs.observe(el));

/* ---- CONTACT FORM ---- */
const form   = document.getElementById('cForm');
const formOk = document.getElementById('formOk');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre  = form.nombre.value.trim();
    const email   = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !email || !mensaje) {
      shakeFeedback(form);
      return;
    }

    if (!validEmail(email)) {
      shakeFeedback(form.querySelector('#fe').closest('.field'));
      return;
    }

    const btn = form.querySelector('.send-btn');
    const btnText = btn.querySelector('span:first-child');
    btnText.textContent = 'Enviando…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btnText.textContent = 'Enviar mensaje';
      btn.disabled = false;
      formOk.classList.add('show');
      setTimeout(() => formOk.classList.remove('show'), 5000);
    }, 1200);
  });
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function shakeFeedback(el) {
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake .4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// Inject shake keyframes once
const shakeKf = document.createElement('style');
shakeKf.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(shakeKf);

/* ---- BACK TO TOP ---- */
document.querySelector('.up-btn')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- SMOOTH ANCHOR SCROLL (fallback for older browsers) ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
