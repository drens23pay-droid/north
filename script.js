const header = document.getElementById('header');
const heroImg = document.getElementById('heroImg');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  if (heroImg) heroImg.style.transform = `scale(1.04) translateY(${y * 0.25}px)`;
});

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

const tourData = {
  ballenas: {
    title: 'Avistamiento de Ballenas',
    badge: 'Jul - Oct',
    img: 'assets/ballenas.jpg',
    desc: 'El tour inicia a las 6:30 a.m. en el Muelle de Los Órganos. Tras el embarque y las instrucciones de seguridad, navegamos hasta el punto de avistamiento donde las ballenas jorobadas regalan saltos, coletazos y los primeros juegos de sus crías. Regreso al muelle alrededor de las 10 a.m.',
    includes: ['Entradas al muelle', 'Chalecos salvavidas', 'Trasbordo marítimo', 'Tripulación capacitada', 'Fotos y videos con GoPro'],
    shared: 'S/ 120 / persona',
    private: 'S/ 2200 total (hasta 20 pers.)'
  },
  tortugas: {
    title: 'Nado con Tortugas',
    badge: 'Todo el año',
    img: 'assets/tortugas.jpg',
    desc: 'Nado responsable junto a tortugas marinas en su hábitat natural, cerca del muelle artesanal de Los Órganos. Una experiencia ideal para conectar con la naturaleza y observar de cerca una de las especies más queridas del océano.',
    includes: ['Entradas al muelle', 'Chalecos salvavidas', 'Trasbordo marítimo', 'Tripulación capacitada', 'Fotos y videos con GoPro', 'No incluye visores'],
    shared: 'S/ 40 / persona',
    private: 'S/ 600 total (hasta 20 pers.)'
  },
  yakupark: {
    title: 'Aventura Yakupark',
    badge: 'Familiar',
    img: 'assets/gallery6.jpeg',
    desc: 'Parque acuático inflable en el mar, ideal para compartir en familia. Toboganes, saltos y juegos flotantes con toda la seguridad de nuestro equipo.',
    includes: ['Chalecos salvavidas', 'Tripulación capacitada', 'Acceso a los juegos inflables'],
    shared: 'Consultar',
    private: 'Consultar'
  },
  velero: {
    title: 'Aventura en Velero',
    badge: 'Atardecer',
    img: 'assets/velero.jpg',
    desc: 'Navega la costa de Los Órganos disfrutando de la puesta de sol a bordo de un velero, en un recorrido tranquilo pensado para disfrutar del paisaje marino.',
    includes: ['Chalecos salvavidas', 'Tripulación capacitada', 'Fotos del recorrido'],
    shared: 'Consultar',
    private: 'Consultar'
  }
};

const modal = document.getElementById('tourModal');
const modalImg = document.getElementById('modalImg');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalIncludes = document.getElementById('modalIncludes');
const modalPriceShared = document.getElementById('modalPriceShared');
const modalPricePrivate = document.getElementById('modalPricePrivate');

function openTourModal(key) {
  const data = tourData[key];
  if (!data) return;
  modalImg.src = data.img;
  modalImg.alt = data.title;
  modalBadge.textContent = data.badge;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalIncludes.innerHTML = data.includes.map(i => `<li>${i}</li>`).join('');
  modalPriceShared.textContent = data.shared;
  modalPricePrivate.textContent = data.private;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTourModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.tour-card').forEach(card => {
  card.addEventListener('click', () => openTourModal(card.dataset.tour));
});
document.getElementById('modalClose').addEventListener('click', closeTourModal);
document.getElementById('modalBackdrop').addEventListener('click', closeTourModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeTourModal(); });

const galeriaGrid = document.getElementById('galeriaGrid');
if (galeriaGrid) {
  const galeriaItems = Array.from(galeriaGrid.querySelectorAll('.g-item'));

  function columnsForWidth(w) {
    if (w < 560) return 1;
    if (w < 960) return 2;
    return 3;
  }

  function layoutGaleria() {
    const cols = columnsForWidth(galeriaGrid.offsetWidth);
    galeriaGrid.innerHTML = '';
    const colEls = [];
    const colHeights = [];
    for (let i = 0; i < cols; i++) {
      const col = document.createElement('div');
      col.className = 'galeria__col';
      galeriaGrid.appendChild(col);
      colEls.push(col);
      colHeights.push(0);
    }
    const colWidth = galeriaGrid.offsetWidth / cols;

    // Place tallest photos first so the greedy shortest-column pick balances better.
    const withHeights = galeriaItems.map(item => {
      const img = item.querySelector('img');
      const ratio = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 1.3;
      return { item, height: colWidth / ratio };
    }).sort((a, b) => b.height - a.height);

    withHeights.forEach(({ item, height }) => {
      let shortest = 0;
      for (let i = 1; i < cols; i++) {
        if (colHeights[i] < colHeights[shortest]) shortest = i;
      }
      colEls[shortest].appendChild(item);
      colHeights[shortest] += height + 18;
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutGaleria, 200);
  });

  const galeriaImgs = galeriaItems.map(item => item.querySelector('img'));
  Promise.all(galeriaImgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = res; img.onerror = res; })))
    .then(layoutGaleria);
}
