(() => {
  'use strict';

  const PRODUCT_LIST = Array.isArray(window.NEXORA_PRODUCTS) ? window.NEXORA_PRODUCTS : [];
  const CART_KEY = 'nexora-gaming-cart-v2';
  const formatMoney = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const normalizeSearch = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const findProduct = id => PRODUCT_LIST.find(product => product.id === id);

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(value) ? value.filter(item => findProduct(item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
    } catch (_error) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    catch (_error) { showToast('O navegador não permitiu salvar a sacola nesta sessão.'); }
    updateCartCounts(cart);
  }
  function updateCartCounts(cart = readCart()) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(node => { node.textContent = String(count); });
    document.querySelectorAll('[data-cart-item-count]').forEach(node => { node.textContent = String(count); });
    document.querySelectorAll('.cart-link').forEach(link => { link.setAttribute('aria-label', `Abrir sacola, ${count} ${count === 1 ? 'item' : 'itens'}`); });
  }
  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2900);
  }
  function addToCart(id) {
    const product = findProduct(id);
    if (!product) return showToast('Não foi possível encontrar esse item.');
    const cart = readCart();
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, quantity: 1 });
    saveCart(cart);
    showToast(`${product.name} foi adicionado à sua sacola.`);
  }

  const FAVORITES_KEY = 'nexora-favorites-v6';
  function readFavorites() {
    try {
      const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
      return Array.isArray(value) ? [...new Set(value.filter(id => findProduct(id)))] : [];
    } catch (_error) { return []; }
  }
  function writeFavorites(favorites) {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }
    catch (_error) { showToast('O navegador não permitiu salvar sua lista nesta sessão.'); }
    syncFavoriteControls(favorites);
  }
  function syncFavoriteControls(favorites = readFavorites()) {
    document.querySelectorAll('[data-favorite-count]').forEach(node => { node.textContent = String(favorites.length); });
    document.querySelectorAll('.favorites-link').forEach(link => { link.setAttribute('aria-label', `Ver favoritos, ${favorites.length} ${favorites.length === 1 ? 'item salvo' : 'itens salvos'}`); });
    document.querySelectorAll('[data-favorite-toggle]').forEach(button => {
      const favorite = favorites.includes(button.dataset.favoriteToggle);
      button.classList.toggle('is-active', favorite);
      button.setAttribute('aria-pressed', String(favorite));
      button.setAttribute('aria-label', `${favorite ? 'Remover' : 'Salvar'} ${findProduct(button.dataset.favoriteToggle)?.name || 'produto'} ${favorite ? 'dos' : 'nos'} favoritos`);
      const icon = button.querySelector('[data-favorite-icon]');
      if (icon) icon.textContent = favorite ? '♥' : '♡';
      const label = button.querySelector('[data-favorite-label]');
      if (label) label.textContent = favorite ? 'Salvo' : 'Salvar';
    });
  }
  function prepareFavoriteButtons(scope = document) {
    scope.querySelectorAll('[data-product-card][data-id]').forEach(card => {
      if (card.querySelector('[data-favorite-toggle]')) return;
      const button = document.createElement('button');
      button.className = 'favorite-toggle';
      button.type = 'button';
      button.dataset.favoriteToggle = card.dataset.id;
      button.setAttribute('aria-pressed', 'false');
      button.innerHTML = '<span data-favorite-icon aria-hidden="true">♡</span>';
      card.insertBefore(button, card.firstElementChild);
    });
    syncFavoriteControls();
  }

  function buildProductCard(product) {
    const oldPrice = product.oldPrice ? `<del>${formatMoney(product.oldPrice)}</del>` : '';
    const searchText = normalizeSearch(`${product.name} ${product.categoryLabel} ${product.summary}`);
    return `<article class="product-card glass-panel" data-product-card data-id="${escapeHtml(product.id)}" data-category="${escapeHtml(product.category)}" data-price="${product.price}" data-search="${escapeHtml(searchText)}">
      <a class="product-visual" href="/produto?slug=${encodeURIComponent(product.slug)}" aria-label="Ver detalhes de ${escapeHtml(product.name)}"><span class="product-badge">${escapeHtml(product.badge)}</span><img src="${escapeHtml(product.image)}" alt="Ilustração do produto ${escapeHtml(product.name)}" loading="lazy"></a>
      <div class="product-info"><p class="product-category">${escapeHtml(product.categoryLabel)}</p><h3><a href="/produto?slug=${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a></h3><p class="product-description">${escapeHtml(product.summary)}</p><div class="product-price">${oldPrice}<strong>${formatMoney(product.price)}</strong></div><div class="product-actions"><a class="text-link" href="/produto?slug=${encodeURIComponent(product.slug)}">Detalhes <span aria-hidden="true">↗</span></a><button class="add-button" type="button" data-add-to-cart="${escapeHtml(product.id)}"><span aria-hidden="true">＋</span> Sacola</button></div></div>
    </article>`;
  }

  prepareFavoriteButtons();
  document.addEventListener('click', event => {
    const favoriteButton = event.target.closest('[data-favorite-toggle]');
    if (favoriteButton) {
      const id = favoriteButton.dataset.favoriteToggle;
      const favorites = readFavorites();
      const updated = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
      writeFavorites(updated);
      if (animeEngine && !reduceMotionPreference) animeEngine.animate(favoriteButton, { scale: [.78, 1], duration: 430, ease: 'outBack' });
      const favoritesGrid = document.querySelector('[data-favorites-grid]');
      if (favoritesGrid) renderFavoritesPage();
      showToast(updated.includes(id) ? 'Produto salvo nos favoritos.' : 'Produto removido dos favoritos.');
      return;
    }
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
      addToCart(addButton.dataset.addToCart);
      if (animeEngine && !reduceMotionPreference) animeEngine.animate(addButton, { scale: [.92, 1], duration: 420, ease: 'outBack' });
    }
  });

  // Menu responsivo e estado ativo da rota.
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('is-open');
    }));
  }
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    if (link.getAttribute('data-nav-link') === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Catálogo: pesquisa, filtros por categoria e leitura do parâmetro ?categoria=.
  const catalog = document.querySelector('[data-catalog]');
  if (catalog) {
    const cards = Array.from(catalog.querySelectorAll('[data-product-card]'));
    const searchInput = document.querySelector('[data-product-search]');
    const filters = Array.from(document.querySelectorAll('[data-filter]'));
    const resultCount = document.querySelector('[data-results-count]');
    const emptyResults = document.querySelector('[data-empty-results]');
    const sortControl = document.querySelector('[data-product-sort]');
    const priceLimit = document.querySelector('[data-price-limit]');
    const priceLabel = document.querySelector('[data-price-limit-label]');
    const params = new URLSearchParams(window.location.search);
    let category = params.get('categoria') || 'all';
    if (!filters.some(button => button.dataset.filter === category)) category = 'all';
    let searchTerm = '';

    function applyFilters() {
      let visible = 0;
      cards.forEach(card => {
        const matchCategory = category === 'all' || card.dataset.category === category;
        const matchSearch = normalizeSearch(card.dataset.search || '').includes(searchTerm);
        const matchPrice = !priceLimit || Number(card.dataset.price || findProduct(card.dataset.id)?.price || 0) <= Number(priceLimit.value);
        const show = matchCategory && matchSearch && matchPrice;
        card.hidden = !show;
        if (show) visible += 1;
      });
      filters.forEach(button => {
        const active = button.dataset.filter === category;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (resultCount) resultCount.textContent = `${visible} ${visible === 1 ? 'item' : 'itens'}`;
      if (emptyResults) emptyResults.hidden = visible !== 0;
      if (priceLimit && priceLabel) priceLabel.textContent = `Até ${formatMoney(Number(priceLimit.value))}`;
      if (sortControl) {
        const mode = sortControl.value;
        cards.sort((a, b) => {
          const productA = findProduct(a.dataset.id);
          const productB = findProduct(b.dataset.id);
          if (!productA || !productB) return 0;
          if (mode === 'price-asc') return productA.price - productB.price;
          if (mode === 'price-desc') return productB.price - productA.price;
          if (mode === 'name') return productA.name.localeCompare(productB.name, 'pt-BR');
          return PRODUCT_LIST.indexOf(productA) - PRODUCT_LIST.indexOf(productB);
        });
        cards.forEach(card => catalog.appendChild(card));
      }
    }
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter || 'all';
      applyFilters();
    }));
    if (searchInput) searchInput.addEventListener('input', () => {
      searchTerm = normalizeSearch(searchInput.value.trim());
      applyFilters();
    });
    if (sortControl) sortControl.addEventListener('change', applyFilters);
    if (priceLimit) priceLimit.addEventListener('input', applyFilters);
    applyFilters();
  }

  // Página de detalhe compartilhada, servida pela rota /produto?slug=...
  const detailMount = document.querySelector('[data-product-detail]');
  if (detailMount) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    const product = PRODUCT_LIST.find(item => item.slug === slug);
    const crumb = document.querySelector('[data-product-breadcrumb]');
    if (!product) {
      detailMount.innerHTML = '<div class="not-found-card glass-panel"><span class="eyebrow">ITEM NÃO ENCONTRADO</span><h2>Este produto saiu de órbita.</h2><p class="page-lead">Confira o catálogo e escolha outro favorito.</p><a class="button button-primary" href="/produtos">Voltar ao catálogo ↗</a></div>';
    } else {
      document.title = `${product.name} | Nexora Gaming`;
      if (crumb) crumb.textContent = product.name;
      const oldPrice = product.oldPrice ? `<del>${formatMoney(product.oldPrice)}</del>` : '';
      const features = product.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('');
      const related = PRODUCT_LIST.filter(item => item.id !== product.id && item.category === product.category).slice(0, 3);
      const relatedItems = related.length ? related : PRODUCT_LIST.filter(item => item.id !== product.id).slice(0, 3);
      detailMount.innerHTML = `<div class="product-detail-layout"><div class="detail-art glass-panel"><img src="${product.image}" alt="Ilustração do produto ${escapeHtml(product.name)}"></div><section class="detail-content"><span class="eyebrow">${escapeHtml(product.categoryLabel.toUpperCase())} · NEXORA SELECT</span><h1>${escapeHtml(product.name)}</h1><p>${escapeHtml(product.description)}</p><div class="detail-price">${oldPrice}<strong>${formatMoney(product.price)}</strong></div><div class="detail-actions"><button class="add-button" type="button" data-add-to-cart="${product.id}"><span aria-hidden="true">＋</span> Adicionar à sacola</button><button class="detail-save" type="button" data-favorite-toggle="${product.id}" aria-pressed="false"><span data-favorite-icon aria-hidden="true">♡</span> <span data-favorite-label>Salvar</span></button><a class="button button-glass" href="/setup">Planejar meu setup ↗</a></div><ul class="detail-features">${features}</ul><p class="detail-note">Projeto escolar demonstrativo. Produto e preço fictícios; nenhuma transação será realizada.</p></section></div><section class="detail-related" aria-labelledby="related-title"><div class="section-heading"><div><span class="eyebrow">CONTINUE EXPLORANDO</span><h2 id="related-title">Também pode combinar.</h2></div><a class="text-link heading-link" href="/produtos">Ver catálogo <span aria-hidden="true">→</span></a></div><div class="product-grid">${relatedItems.map(buildProductCard).join('')}</div></section>`;
      prepareFavoriteButtons(detailMount);
    }
  }

  // Renderiza a sacola. As quantidades são persistidas apenas no navegador atual.
  const cartMount = document.querySelector('[data-cart-items]');
  if (cartMount) {
    const emptyPanel = document.querySelector('[data-cart-empty]');
    const subtitle = document.querySelector('[data-cart-subtitle]');
    const subtotalNode = document.querySelector('[data-cart-subtotal]');
    const totalNode = document.querySelector('[data-cart-total]');
    function renderCart() {
      const cart = readCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cart.reduce((sum, item) => sum + findProduct(item.id).price * item.quantity, 0);
      cartMount.innerHTML = cart.map(item => {
        const product = findProduct(item.id);
        return `<article class="cart-item" data-cart-id="${product.id}"><a class="cart-item-art" href="/produto?slug=${product.slug}" aria-label="Ver ${escapeHtml(product.name)}"><img src="${product.image}" alt=""></a><div class="cart-item-info"><h3><a href="/produto?slug=${product.slug}">${escapeHtml(product.name)}</a></h3><p>${escapeHtml(product.categoryLabel)}</p><div class="cart-item-price">${formatMoney(product.price * item.quantity)}</div><div class="cart-item-controls"><button class="quantity-button" type="button" data-quantity="-1" data-id="${product.id}" aria-label="Diminuir quantidade de ${escapeHtml(product.name)}">−</button><span class="quantity-value">${item.quantity}</span><button class="quantity-button" type="button" data-quantity="1" data-id="${product.id}" aria-label="Aumentar quantidade de ${escapeHtml(product.name)}">＋</button><button class="remove-button" type="button" data-remove-item="${product.id}">Remover</button></div></div><div class="cart-item-trailing"><strong>${formatMoney(product.price * item.quantity)}</strong></div></article>`;
      }).join('');
      if (emptyPanel) emptyPanel.hidden = count !== 0;
      cartMount.hidden = count === 0;
      if (subtitle) subtitle.textContent = `${count} ${count === 1 ? 'item selecionado' : 'itens selecionados'}`;
      if (subtotalNode) subtotalNode.textContent = formatMoney(subtotal);
      if (totalNode) totalNode.textContent = formatMoney(subtotal);
      updateCartCounts(cart);
      cartMount.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', () => {
        const delta = Number(button.dataset.quantity);
        const id = button.dataset.id;
        const updated = readCart().map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0);
        saveCart(updated); renderCart();
      }));
      cartMount.querySelectorAll('[data-remove-item]').forEach(button => button.addEventListener('click', () => {
        saveCart(readCart().filter(item => item.id !== button.dataset.removeItem));
        showToast('Item removido da sacola.'); renderCart();
      }));
    }
    renderCart();
    window.addEventListener('storage', event => {
      if (event.key === CART_KEY) renderCart();
    });
    const checkout = document.querySelector('[data-demo-checkout]');
    if (checkout) checkout.addEventListener('click', () => showToast(readCart().length ? 'Demonstração concluída! Nenhuma compra real foi realizada.' : 'Sua sacola está vazia. Explore o catálogo primeiro.'));
  }

  // Formulários de demonstração: mostram retorno visual e não enviam dados.
  function attachDemoForm(form, feedbackSelector, message) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const feedback = feedbackSelector ? document.querySelector(feedbackSelector) : null;
      if (feedback) feedback.textContent = message;
      form.reset();
      showToast(message);
    });
  }
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) attachDemoForm(contactForm, '[data-contact-feedback]', 'Mensagem validada na demonstração. Nenhum dado foi enviado.');
  document.querySelectorAll('[data-demo-form]').forEach(form => attachDemoForm(form, '[data-form-feedback]', 'Cadastro demonstrativo concluído. Nenhum dado foi enviado.'));

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function renderFavoritesPage() {
    const grid = document.querySelector('[data-favorites-grid]');
    if (!grid) return;
    const favorites = readFavorites().map(findProduct).filter(Boolean);
    const empty = document.querySelector('[data-favorites-empty]');
    const clearButton = document.querySelector('[data-clear-favorites]');
    const count = document.querySelector('[data-favorites-page-count]');
    grid.innerHTML = favorites.map(buildProductCard).join('');
    grid.hidden = favorites.length === 0;
    if (empty) empty.hidden = favorites.length !== 0;
    if (clearButton) clearButton.hidden = favorites.length === 0;
    if (count) count.textContent = `${favorites.length} ${favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}`;
    prepareFavoriteButtons(grid);
  }
  renderFavoritesPage();
  window.addEventListener('storage', event => {
    if (event.key === FAVORITES_KEY) {
      syncFavoriteControls();
      renderFavoritesPage();
    }
    if (event.key === CART_KEY) updateCartCounts();
  });
  const clearFavoritesButton = document.querySelector('[data-clear-favorites]');
  if (clearFavoritesButton) clearFavoritesButton.addEventListener('click', () => {
    writeFavorites([]);
    renderFavoritesPage();
    showToast('Sua lista de favoritos foi limpa.');
  });

  function setupSetupPlanner() {
    const planner = document.querySelector('[data-setup-planner]');
    if (!planner) return;
    const presets = {
      arena: ['wave-control', 'pulse-air', 'aurora-x', 'horizon-27'],
      creator: ['breeze-mic', 'horizon-27', 'cloud-buds', 'nimbus-75'],
      explorer: ['neon-rift', 'verdant-odyssey', 'aurora-x', 'orbita-s']
    };
    const profile = planner.querySelector('[data-setup-profile]');
    const budget = planner.querySelector('[data-setup-budget]');
    const budgetLabel = planner.querySelector('[data-setup-budget-label]');
    const optionList = planner.querySelector('[data-setup-options]');
    const totalNode = planner.querySelector('[data-setup-total]');
    const remainingNode = planner.querySelector('[data-setup-remaining]');
    const progress = planner.querySelector('[data-setup-progress]');
    const message = planner.querySelector('[data-setup-message]');
    const addButton = planner.querySelector('[data-add-setup]');
    if (!profile || !budget || !optionList || !addButton) return;

    function updateTotal() {
      const chosen = Array.from(optionList.querySelectorAll('[data-setup-choice]:checked')).map(input => findProduct(input.value)).filter(Boolean);
      const total = chosen.reduce((sum, product) => sum + product.price, 0);
      const limit = Number(budget.value);
      const remaining = limit - total;
      const percent = Math.min(100, limit > 0 ? total / limit * 100 : 0);
      if (budgetLabel) budgetLabel.textContent = formatMoney(limit);
      if (totalNode) totalNode.textContent = formatMoney(total);
      if (remainingNode) remainingNode.textContent = formatMoney(Math.abs(remaining));
      if (progress) {
        progress.style.setProperty('--setup-progress', `${percent}%`);
        progress.setAttribute('aria-valuenow', String(Math.round(percent)));
      }
      const overBudget = remaining < 0;
      if (message) {
        message.textContent = overBudget
          ? `A seleção ultrapassa seu limite em ${formatMoney(Math.abs(remaining))}. Ajuste o orçamento ou os itens.`
          : chosen.length ? `Dentro do limite. Você ainda tem ${formatMoney(remaining)} disponíveis.` : 'Escolha os itens que quer incluir no seu setup.';
        message.classList.toggle('is-over-budget', overBudget);
      }
      addButton.disabled = !chosen.length || overBudget;
      addButton.setAttribute('aria-disabled', String(addButton.disabled));
    }

    function renderOptions(reset = true) {
      const ids = presets[profile.value] || presets.arena;
      optionList.innerHTML = ids.map((id, index) => {
        const product = findProduct(id);
        if (!product) return '';
        return `<label class="setup-option glass-panel"><input type="checkbox" data-setup-choice value="${escapeHtml(id)}" ${reset && index < 2 ? 'checked' : ''}><span class="setup-option-art"><img src="${escapeHtml(product.image)}" alt="" loading="lazy"></span><span class="setup-option-copy"><span class="setup-option-category">${escapeHtml(product.categoryLabel)}</span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.summary)}</small></span><span class="setup-option-price">${formatMoney(product.price)}</span></label>`;
      }).join('');
      updateTotal();
    }

    profile.addEventListener('change', () => renderOptions(true));
    budget.addEventListener('input', updateTotal);
    optionList.addEventListener('change', updateTotal);
    addButton.addEventListener('click', () => {
      const selected = Array.from(optionList.querySelectorAll('[data-setup-choice]:checked')).map(input => input.value);
      const cart = readCart();
      selected.forEach(id => {
        const item = cart.find(entry => entry.id === id);
        if (item) item.quantity += 1;
        else cart.push({ id, quantity: 1 });
      });
      saveCart(cart);
      showToast(`${selected.length} ${selected.length === 1 ? 'item adicionado' : 'itens adicionados'} à sacola.`);
    });
    renderOptions(true);
  }
  setupSetupPlanner();

  // Theme preference is saved locally and follows the device until the user chooses a mode.
  function setupThemeMode() {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;
    const root = document.documentElement;
    const icon = toggle.querySelector('[data-theme-icon]');
    const label = toggle.querySelector('[data-theme-label]');
    const meta = document.querySelector('meta[name="theme-color"]');
    const storageKey = 'nexora-theme-v6';
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
    let savedTheme = null;
    try { savedTheme = localStorage.getItem(storageKey) || localStorage.getItem('nexora-theme-v5'); } catch (_error) { /* Storage can be disabled. */ }

    function applyTheme(theme, save = true) {
      const dark = theme === 'dark';
      root.dataset.theme = dark ? 'dark' : 'light';
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
      if (icon) icon.textContent = dark ? '☀' : '☾';
      if (label) label.textContent = dark ? 'Claro' : 'Escuro';
      if (meta) meta.content = dark ? '#07111f' : '#d8f8fb';
      if (save) {
        try { localStorage.setItem(storageKey, dark ? 'dark' : 'light'); } catch (_error) { /* Keep the current-page choice. */ }
      }
    }

    applyTheme(savedTheme || (systemPreference.matches ? 'dark' : 'light'), Boolean(savedTheme));
    toggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    window.addEventListener('storage', event => {
      if (event.key === storageKey && (event.newValue === 'dark' || event.newValue === 'light')) applyTheme(event.newValue, false);
    });
    if (!savedTheme && typeof systemPreference.addEventListener === 'function') {
      systemPreference.addEventListener('change', event => applyTheme(event.matches ? 'dark' : 'light', false));
    }
  }

  // NEXORA V6 motion system — Anime.js timelines with CSS and observer fallbacks.
  const reduceMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animeEngine = window.anime && typeof window.anime.animate === 'function' ? window.anime : null;

  function setupV6Motion() {
    const progressBar = document.querySelector('[data-scroll-progress]');
    const canBuildTimeline = animeEngine && typeof animeEngine.createTimeline === 'function';
    const heroIntro = Boolean(canBuildTimeline && !reduceMotionPreference && document.querySelector('.hero-copy'));
    if (heroIntro) document.body.classList.add('anime-ready');
    let scrollTicking = false;
    const updateProgress = () => {
      if (!progressBar) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
      progressBar.style.setProperty('--scroll-progress', `${progress}%`);
      progressBar.style.width = `${progress}%`;
      scrollTicking = false;
    };
    updateProgress();
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    // Staggered reveal of meaningful page regions and product cards.
    const revealSelectors = [
      '.hero-copy > *', '.hero-proof', '.trust-strip > div', '.section-heading',
      '.product-card', '.category-tile', '.category-detail', '.value-card',
      '.support-card', '.faq-item', '.promo-banner', '.about-showcase', '.team-card',
      '.experience-copy > *', '.experience-window', '.contact-form-card', '.studio-card', '.setup-option', '.detail-related',
      '.contact-aside-card', '.cart-items-panel', '.cart-summary',
      '.product-detail-layout > *', '.not-found-card', '.info-note', '.offer-callout'
    ];
    const revealElements = [];
    revealSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (heroIntro && (element.closest('.hero-copy') || element.classList.contains('hero-visual'))) return;
        if (!revealElements.includes(element)) revealElements.push(element);
      });
    });
    revealElements.forEach((element, index) => {
      element.setAttribute('data-reveal', '');
      element.dataset.revealDelay = String(Math.min((index % 6) * 58, 290));
    });

    if (reduceMotionPreference || !('IntersectionObserver' in window)) {
      revealElements.forEach(element => element.classList.add('is-revealed'));
    } else {
      document.body.classList.add('motion-ready');
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          revealObserver.unobserve(element);
          const delay = Number(element.dataset.revealDelay || 0);
          if (animeEngine) {
            animeEngine.animate(element, {
              opacity: [0, 1],
              y: [28, 0],
              duration: 780,
              delay,
              ease: 'outExpo',
              onComplete: () => element.classList.add('is-revealed')
            });
          } else {
            element.style.setProperty('--reveal-delay', `${delay}ms`);
            element.classList.add('is-revealed');
          }
        });
      }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
      revealElements.forEach(element => revealObserver.observe(element));
    }

    if (heroIntro) {
      const intro = animeEngine.createTimeline({ defaults: { duration: 780, ease: 'outExpo' } });
      intro
        .add('.hero-copy .eyebrow-pill', { opacity: [0, 1], y: [20, 0] })
        .add('.hero-copy h1', { opacity: [0, 1], y: [38, 0] }, '-=590')
        .add('.hero-copy .hero-lead', { opacity: [0, 1], y: [24, 0] }, '-=620')
        .add('.hero-copy .hero-actions', { opacity: [0, 1], y: [20, 0] }, '-=640')
        .add('.hero-proof', { opacity: [0, 1], y: [18, 0] }, '-=590')
        .add('.hero-visual', { opacity: [0, 1], scale: [.92, 1] }, '-=680');
    }

    // Mouse-position highlights recreate a soft, responsive glass sheen.
    const spotlightElements = document.querySelectorAll('.product-card, .category-tile, .category-detail, .support-card, .value-card, .glass-panel');
    spotlightElements.forEach(element => {
      element.addEventListener('pointermove', event => {
        if (event.pointerType && event.pointerType !== 'mouse') return;
        const rect = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
        element.style.setProperty('--pointer-x', `${x}px`);
        element.style.setProperty('--pointer-y', `${y}px`);
        if (element.classList.contains('product-card') && !reduceMotionPreference) {
          const rotateY = ((x / Math.max(rect.width, 1)) - 0.5) * 3.2;
          const rotateX = (0.5 - (y / Math.max(rect.height, 1))) * 3.2;
          element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
          element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        }
      }, { passive: true });
      element.addEventListener('pointerleave', () => {
        element.style.removeProperty('--tilt-x');
        element.style.removeProperty('--tilt-y');
      }, { passive: true });
    });

    // Small button ripple. The animation is decorative and ignored by assistive tech.
    if (!reduceMotionPreference) {
      document.querySelectorAll('.button, .add-button, .filter-chip, .cart-link, .theme-toggle').forEach(button => {
        button.addEventListener('pointerdown', event => {
          if (event.pointerType && event.pointerType !== 'mouse') return;
          const rect = button.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.className = 'tap-ripple';
          ripple.setAttribute('aria-hidden', 'true');
          ripple.style.left = `${event.clientX - rect.left}px`;
          ripple.style.top = `${event.clientY - rect.top}px`;
          button.appendChild(ripple);
          ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        });
      });
    }

    // Tiny first-load entrance flourish for the brand mark.
    const mark = document.querySelector('.brand-mark');
    if (mark && !reduceMotionPreference) {
      if (animeEngine) animeEngine.animate(mark, { scale: [.82, 1], rotate: ['-8deg', 0], duration: 650, ease: 'outBack', delay: 80 });
      else mark.classList.add('brand-mark--enter');
    }

    // Escape closes the mobile navigation to improve keyboard usability.
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuToggle && nav && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        nav.classList.remove('is-open');
        menuToggle.focus();
      }
    });
  }

  setupThemeMode();
  setupV6Motion();

  // A small, original ambient soundtrack synthesized in the browser.
  // It starts only after an explicit click, as browsers block autoplay audio.
  function setupAmbientMusic() {
    const dock = document.createElement('aside');
    dock.className = 'music-dock';
    dock.setAttribute('aria-label', 'Trilha ambiente Nexora');
    dock.innerHTML = `
      <div class="music-dock-copy"><span class="music-kicker">NEXORA SOUND</span><span class="music-status" data-music-status aria-live="polite">Trilha pausada</span></div>
      <button class="music-toggle" type="button" data-music-toggle aria-pressed="false" aria-label="Ativar trilha ambiente">
        <span class="music-icon" aria-hidden="true">♫</span><span data-music-label>Ouvir</span>
      </button>
      <label class="music-volume"><span class="sr-only">Volume da trilha ambiente</span><input data-music-volume type="range" min="0" max="0.35" step="0.01" value="0.13" aria-label="Volume da trilha ambiente"></label>`;
    document.body.appendChild(dock);

    const toggle = dock.querySelector('[data-music-toggle]');
    const label = dock.querySelector('[data-music-label]');
    const status = dock.querySelector('[data-music-status]');
    const volume = dock.querySelector('[data-music-volume]');
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let context = null;
    let masterGain = null;
    let phraseTimer = 0;
    let isPlaying = false;

    function setPlaying(playing) {
      isPlaying = playing;
      toggle.setAttribute('aria-pressed', String(playing));
      toggle.setAttribute('aria-label', playing ? 'Pausar trilha ambiente' : 'Ativar trilha ambiente');
      label.textContent = playing ? 'Pausar' : 'Ouvir';
      status.textContent = playing ? 'Trilha ativa · volume baixo' : 'Trilha pausada';
      dock.classList.toggle('is-playing', playing);
    }

    function playTone(frequency, startAt, duration, loudness, type = 'sine') {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      envelope.gain.setValueAtTime(0.0001, startAt);
      envelope.gain.linearRampToValueAtTime(loudness, startAt + 0.35);
      envelope.gain.setValueAtTime(loudness, Math.max(startAt + 0.36, startAt + duration - 0.6));
      envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(envelope);
      envelope.connect(masterGain);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.04);
    }

    function schedulePhrase() {
      const now = context.currentTime + 0.05;
      [130.81, 164.81, 196].forEach(note => playTone(note, now, 7.8, 0.012));
      [261.63, 392, 329.63, 523.25, 392, 329.63, 293.66, 440].forEach((note, index) => {
        playTone(note, now + index * 0.76, 2.55, 0.032);
      });
    }

    toggle.addEventListener('click', async () => {
      if (isPlaying) {
        window.clearInterval(phraseTimer);
        phraseTimer = 0;
        masterGain.gain.setTargetAtTime(0.0001, context.currentTime, 0.18);
        setPlaying(false);
        window.setTimeout(() => { if (!isPlaying && context.state === 'running') context.suspend(); }, 650);
        return;
      }
      if (!AudioContextClass) {
        status.textContent = 'Áudio indisponível neste navegador';
        return;
      }
      if (!context) {
        context = new AudioContextClass();
        masterGain = context.createGain();
        masterGain.gain.value = 0.0001;
        masterGain.connect(context.destination);
      }
      try {
        await context.resume();
        masterGain.gain.cancelScheduledValues(context.currentTime);
        masterGain.gain.setTargetAtTime(Number(volume.value), context.currentTime, 0.35);
        schedulePhrase();
        phraseTimer = window.setInterval(schedulePhrase, 8200);
        setPlaying(true);
      } catch (_error) {
        status.textContent = 'Não foi possível iniciar o áudio';
      }
    });

    volume.addEventListener('input', () => {
      if (masterGain && isPlaying) masterGain.gain.setTargetAtTime(Number(volume.value), context.currentTime, 0.08);
    });
  }

  setupAmbientMusic();

  updateCartCounts();
})();
