
'use strict';

/* ---- ELEMENTOS ---- */
const masonry    = document.getElementById('masonry');
const noResults  = document.getElementById('noResults');
const catCount   = document.getElementById('catCount');
const filterBtns = document.querySelectorAll('.cat-filters .f-btn');

const lightbox   = document.getElementById('lightbox');
const lbBackdrop = document.getElementById('lbBackdrop');
const lbClose    = document.getElementById('lbClose');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');
const lbImgWrap  = document.getElementById('lbImgWrap');
const lbCat      = document.getElementById('lbCat');
const lbTitle    = document.getElementById('lbTitle');
const lbDesc     = document.getElementById('lbDesc');
const lbYear     = document.getElementById('lbYear');

let allItems     = Array.from(document.querySelectorAll('.m-item'));
let visibleItems = [...allItems];  // items visibles tras filtro
let currentIndex = 0;              // índice en visibleItems

/* ---- CONTADOR ---- */
function updateCount() {
  const n = visibleItems.length;
  catCount.textContent = `— ${n} ${n === 1 ? 'pieza' : 'piezas'}`;
}
updateCount();

/* ---- FILTROS ---- */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.f;
    visibleItems = [];

    allItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;
      if (match) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity .35s ease';
          item.style.opacity = '1';
          setTimeout(() => item.style.transition = '', 400);
        });
        visibleItems.push(item);
      } else {
        item.classList.add('hidden');
      }
    });

    noResults.classList.toggle('show', visibleItems.length === 0);
    updateCount();
  });
});

/* ---- LIGHTBOX: ABRIR ---- */
function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.hidden = false;
  lightbox.classList.add('open');
  lbBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function renderLightbox() {
  const item = visibleItems[currentIndex];
  if (!item) return;

  const title   = item.dataset.title    || '';
  const year    = item.dataset.year     || '';
  const catLbl  = item.dataset.catLabel || item.dataset.cat || '';
  const desc    = item.dataset.desc     || '';

  // Imagen: busca un <img> dentro de .m-img; si no, usa el placeholder
  const srcImg = item.querySelector('.m-img img');

if (srcImg) {
    lbImgWrap.innerHTML = `<img src="${srcImg.src}" alt="${title}" style="max-width:92vw;max-height:90svh;width:auto;height:auto;display:block;" />`;
  } else {
    // Toma el color del gradiente del placeholder
    const mImg = item.querySelector('.m-img');
    const c1 = getComputedStyle(mImg).getPropertyValue('--c1').trim() || '#eae6e0';
    const c2 = getComputedStyle(mImg).getPropertyValue('--c2').trim() || '#d0cab8';
    const sym = mImg.querySelector('span')?.textContent || '◻';
    lbImgWrap.innerHTML = `
      <div class="lb-placeholder-bg" style="background:linear-gradient(145deg,${c1},${c2});width:100%;height:100%;position:absolute;inset:0;"></div>
      <div class="lb-placeholder">${sym}</div>
    `;
  }

  lbCat.textContent   = catLbl;
  lbTitle.textContent = title;
  lbDesc.textContent  = desc;
  lbYear.textContent  = year;

  // Deshabilitar botones en los extremos
  lbPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
  lbPrev.disabled      = currentIndex === 0;
  lbNext.style.opacity = currentIndex === visibleItems.length - 1 ? '0.3' : '1';
  lbNext.disabled      = currentIndex === visibleItems.length - 1;
}

/* ---- LIGHTBOX: CERRAR ---- */
function closeLightbox() {
  lightbox.classList.remove('open');
  lbBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightbox.hidden = true; }, 400);
}

/* ---- LIGHTBOX: NAVEGAR ---- */
function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    renderLightbox();
  }
}

function goNext() {
  if (currentIndex < visibleItems.length - 1) {
    currentIndex++;
    renderLightbox();
  }
}

/* ---- EVENTOS ---- */

// Clic en cada item
allItems.forEach((item, _) => {
  item.addEventListener('click', () => {
    const idx = visibleItems.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', goPrev);
lbNext.addEventListener('click', goNext);

// Teclado
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   goPrev();
  if (e.key === 'ArrowRight')  goNext();
});

// Swipe táctil en el lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
});

/* ---- BACK TO TOP (catálogo) ---- */
document.querySelector('.cat-main .up-btn')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- REVEAL al scroll ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

allItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = `opacity .55s ${i * 50}ms ease, transform .55s ${i * 50}ms ease`;
  revealObs.observe(item);
});
