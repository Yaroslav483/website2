document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.choose__tab');
  const panels = document.querySelectorAll('.choose__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  const thumbs = document.querySelectorAll('.gallery-thumb');
  const mainImg = document.getElementById('gallery-main');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (mainImg) mainImg.src = thumb.src;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  /* ---- Gallery Arrows ---- */
  const prevBtn = document.querySelector('.gallery__arrow--prev');
  const nextBtn = document.querySelector('.gallery__arrow--next');

  if (prevBtn && nextBtn && thumbs.length > 0) {
    let currentIdx = 0;

    function showThumb(idx) {
      thumbs.forEach(t => t.classList.remove('active'));
      thumbs[idx].classList.add('active');
      if (mainImg) mainImg.src = thumbs[idx].src;
      currentIdx = idx;
    }

    prevBtn.addEventListener('click', () => {
      const prev = (currentIdx - 1 + thumbs.length) % thumbs.length;
      showThumb(prev);
    });

    nextBtn.addEventListener('click', () => {
      const next = (currentIdx + 1) % thumbs.length;
      showThumb(next);
    });
  }

 

  const filterTags = document.querySelectorAll('.filter-tag');
  const filterBodies = document.querySelectorAll('.filter-body');
  const filterMakes = document.querySelectorAll('.filter-make');

  const cardsGrid = document.querySelector('.cards-grid');
  const cards = cardsGrid ? Array.from(cardsGrid.querySelectorAll('.car-card')) : [];

  const filterSelect = document.querySelector('.filter-select');
  const minInput = document.querySelector('.filter-input[placeholder="Min"], .filter-input[placeholder="Мин"]');
  const maxInput = document.querySelector('.filter-input[placeholder="Max"], .filter-input[placeholder="Макс"]');
  const dealsInput = document.getElementById('all-deals');


  const helper = {
    text(el) {
      return (el?.textContent || '').trim();
    },
    normalize(value) {
      return (value || '').toString().trim().toLowerCase();
    }
  };

  const makeOptions = Array.from(filterMakes)
    .map(btn => helper.text(btn.querySelector('span')))
    .filter(Boolean);

  function getCardName(card) {
    return helper.text(card.querySelector('.car-card__name'));
  }

  function getCardPriceUAH(card) {
    const raw = helper.text(card.querySelector('.car-card__price'));
    const num = raw.replace(/[^0-9]/g, '');
    return num ? Number(num) : NaN;
  }

  function getCardBodyType(card) {
    if (card.dataset?.body) return card.dataset.body;

    const specs = card.querySelector('.car-card__specs');
    if (!specs) return null;
    const spans = specs.querySelectorAll('span');
    return spans.length ? helper.text(spans[spans.length - 1]) : null;
  }

  function getCardMake(card) {
    if (card.dataset?.make) return card.dataset.make;

    const name = getCardName(card);
    if (!name) return null;

    const normalizedName = helper.normalize(name);
    return makeOptions.find(make => normalizedName.startsWith(helper.normalize(make))) || null;
  }

  function getActiveBodyType() {
    const activeBtn = Array.from(filterBodies).find(b => b.classList.contains('active'));
    if (!activeBtn) return null;

    return activeBtn.dataset.body ||
      activeBtn?.querySelector('img')?.getAttribute('alt')?.trim() ||
      helper.text(activeBtn);
  }



  function getActiveMakes() {
    return Array.from(filterMakes)
      .filter(b => b.classList.contains('active'))
      .map(b => helper.text(b.querySelector('span')))
      .filter(Boolean);
  }

  function getActiveLifestyles() {
    return Array.from(filterTags)
      .filter(b => b.classList.contains('active'))
      .map(b => helper.text(b));
  }

 
  function matchesLifestyles(card) {
    const active = getActiveLifestyles();

    if (active.length === 0) return true;

    const data = (card.dataset?.lifestyles || '').toString();
    if (data) {
      const cardLifestyles = data
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

      return active.some(a => cardLifestyles.includes(helper.normalize(a)));
    }

    
    return false;
  }





  function matchesPrice(card) {
    const minRaw = (minInput?.value ?? '').toString().trim();
    const maxRaw = (maxInput?.value ?? '').toString().trim();

    if (minRaw === '' && maxRaw === '') return true;

    const price = getCardPriceUAH(card);
    if (Number.isNaN(price)) return false;

   
    const min = minRaw === '' ? NaN : Number(minRaw);
    const max = maxRaw === '' ? NaN : Number(maxRaw);

    const minOk = Number.isNaN(min) ? true : price >= min;
    const maxOk = Number.isNaN(max) ? true : price <= max;


    return minOk && maxOk;
  }

  function matchesDeals(card) {
    if (!dealsInput?.checked) return true;

    return card.dataset?.deal !== 'false' && Boolean(card.querySelector('.car-card__badge'));
  }

  function matchesMakes(card) {
    const active = getActiveMakes();
    if (active.length === 0) return true;

    const make = getCardMake(card);
   
    if (!make) return false;

    return active.includes(make);
  }


  function normalizeBodyType(str) {
    return helper.normalize(str);
  }

  function matchesBody(card) {
    const activeBody = getActiveBodyType();
    if (!activeBody) return true;

    const cardBody = getCardBodyType(card);
    return normalizeBodyType(cardBody) === normalizeBodyType(activeBody);
  }


  function sortCards() {
    if (!filterSelect || cards.length === 0) return;

    const value = (filterSelect.value || '').trim();

    const getPrice = c => getCardPriceUAH(c);
    const getYear = c => Number(helper.text(c.querySelector('.car-card__year')));

    const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');

    if (value === 'Price: Low to High') {
      visibleCards.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (value === 'Price: High to Low') {
      visibleCards.sort((a, b) => getPrice(b) - getPrice(a));
    } else if (value === 'Newest') {
      visibleCards.sort((a, b) => getYear(b) - getYear(a));
    }

    
    visibleCards.forEach(c => cardsGrid.appendChild(c));
    cards
      .filter(c => c.style.display === 'none')
      .forEach(c => cardsGrid.appendChild(c));

  }

  function applyAll() {
    if (!cardsGrid || cards.length === 0) return;

    cards.forEach(card => {
      const ok =
        matchesBody(card) &&
        matchesPrice(card) &&
        matchesLifestyles(card) &&
        matchesDeals(card) &&
        matchesMakes(card);

      card.style.display = ok ? '' : 'none';

    });

    sortCards();
  }

  filterBodies.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBodies.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyAll();
    });
  });


  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      applyAll();
    });
  });

  filterMakes.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      applyAll();
    });
  });

  minInput?.addEventListener('input', applyAll);
  maxInput?.addEventListener('input', applyAll);
  dealsInput?.addEventListener('change', applyAll);
  filterSelect?.addEventListener('change', applyAll);

  applyAll();

});

