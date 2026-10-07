/* Text stays in this page until the visitor opens WhatsApp. */
(() => {
  const config = window.RITELINDO_CONFIG || {};
  const validNumber = /^\d{8,15}$/.test(config.whatsappNumber || '');
  const dialog = document.querySelector('#contact-dialog'), preview = document.querySelector('#message-preview'), continueLink = document.querySelector('#continue-wa');
  const defaultMessage = config.defaultMessage || 'Halo Ritelindo, saya ingin konsultasi gratis paket rak toko dan layout 3D.';
  let lastTrigger, placement = 'floating';
  const waUrl = message => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  function syncLink() {
    const canContinue = validNumber && preview.value.trim().length > 0;
    continueLink.setAttribute('aria-disabled', String(!canContinue));
    if (canContinue) { continueLink.href = waUrl(preview.value.trim()); continueLink.target = '_blank'; continueLink.rel = 'noopener noreferrer'; }
    else { continueLink.removeAttribute('href'); continueLink.removeAttribute('target'); }
    document.querySelector('#wa-contact-notice').textContent = !validNumber ? 'Nomor WhatsApp resmi belum diisi pada demo ini. Pesan bisa disalin sementara.' : !preview.value.trim() ? 'Tulis pesan sebelum melanjutkan.' : '';
  }
  function showContact(message, trigger, source = 'floating') {
    lastTrigger = trigger; placement = source; preview.value = message;
    document.querySelector('#copy-status').textContent = ''; syncLink(); if (!dialog.open) dialog.showModal();
  }
  preview.addEventListener('input', syncLink);
  continueLink.addEventListener('click', event => {
    if (!validNumber || !preview.value.trim()) { event.preventDefault(); return; }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'whatsapp_click', cta_placement: placement });
  });
  document.querySelectorAll('[data-wa]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showContact(link.dataset.message || defaultMessage, link, link.dataset.placement); }));
  document.querySelector('.wa-launcher').addEventListener('click', event => showContact(defaultMessage, event.currentTarget));
  document.addEventListener('ritelindo:consult', event => showContact(event.detail.message, event.detail.trigger, event.detail.placement));
  document.querySelector('#consultation-form').addEventListener('submit', event => {
    event.preventDefault(); const form = new FormData(event.currentTarget), lines = [defaultMessage];
    if (form.get('business')) lines.push(`Jenis usaha: ${form.get('business')}`);
    if (String(form.get('location')).trim()) lines.push(`Lokasi: ${String(form.get('location')).trim()}`);
    if (String(form.get('size')).trim()) lines.push(`Ukuran ruang: ${String(form.get('size')).trim()}`);
    lines.push(`Rencana: ${form.get('need')}`); showContact(lines.join('\n'), event.currentTarget.querySelector('button[type="submit"]'), 'form');
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    const returnTarget = lastTrigger?.getClientRects().length ? lastTrigger : document.querySelector('.menu-button');
    returnTarget?.focus();
  });
  dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(preview.value); document.querySelector('#copy-status').textContent = 'Pesan berhasil disalin.'; }
    catch { preview.focus(); preview.select(); document.querySelector('#copy-status').textContent = 'Pilih teks pesan, lalu salin secara manual.'; }
  });
  const start = document.querySelector('#start-planner');
  start.addEventListener('click', async () => {
    start.disabled = true; document.querySelector('#planner-load-status').textContent = 'Menyiapkan ruang 3D…';
    try { const planner = await import('./planner.js'); planner.initPlanner(); }
    catch { start.disabled = false; document.querySelector('#planner-load-status').textContent = 'Simulasi belum bisa dibuka. Muat ulang halaman lalu coba lagi.'; }
  });
  const menuButton = document.querySelector('.menu-button'), mobileNav = document.querySelector('#mobile-nav'), menuBackdrop = document.querySelector('.menu-backdrop');
  const menuBackground = document.querySelectorAll('main, .footer, .mobile-sticky, .wa-launcher');
  function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Buka menu navigasi');
    menuButton.querySelector('.menu-label').textContent = 'Menu';
    mobileNav.hidden = true; menuBackdrop.hidden = true; document.body.classList.remove('menu-open');
    menuBackground.forEach(element => { element.inert = false; });
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    if (menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); return; }
    menuButton.setAttribute('aria-expanded', 'true'); menuButton.setAttribute('aria-label', 'Tutup menu navigasi');
    menuButton.querySelector('.menu-label').textContent = 'Tutup';
    mobileNav.hidden = false; menuBackdrop.hidden = false; document.body.classList.add('menu-open');
    menuBackground.forEach(element => { element.inert = true; });
    const boundary = document.querySelector('.header').getBoundingClientRect().bottom + 100;
    const currentSection = [...document.querySelectorAll('main section[id]')].reverse().find(section => section.getBoundingClientRect().top <= boundary);
    mobileNav.querySelectorAll('[data-route]').forEach(link => {
      if (link.dataset.route === currentSection?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
  menuBackdrop.addEventListener('click', () => closeMenu(true));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true); });
  matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  const routes = { '': 'main', 'simulasi-3d': 'planner-workspace', 'pilihan-rak': 'solusi', layanan: 'layanan', 'cara-pesan': 'proses', konsultasi: 'konsultasi', pertanyaan: 'faq' };
  const base = new URL('./', document.baseURI);
  function revealSection(id, focus = false, instant = false) {
    const section = document.getElementById(id);
    if (!section) return;
    closeMenu();
    section.scrollIntoView({ block: 'start', behavior: instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    if (focus) {
      const target = section.querySelector('h1, h2, h3') || section;
      target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('[data-route]:not([data-wa])').forEach(link => link.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); const url = new URL(link.getAttribute('href'), base);
    history.pushState({}, '', url.pathname); revealSection(link.dataset.route, true);
  }));
  function restoreRoute() {
    const slug = location.pathname.replace(/\/$/, '').split('/').pop();
    revealSection(routes[slug] || 'main', false, true);
  }
  addEventListener('popstate', restoreRoute);
  if (location.hash) {
    const id = location.hash.slice(1), slug = Object.keys(routes).find(key => routes[key] === id) || (id === 'simulator' ? 'simulasi-3d' : '');
    history.replaceState({}, '', new URL(slug, base).pathname); requestAnimationFrame(() => revealSection(id));
  } else {
    const initialRoute = location.pathname.replace(/\/$/, '').split('/').pop();
    if (initialRoute && Object.hasOwn(routes, initialRoute)) requestAnimationFrame(restoreRoute);
  }
  const navLinks = document.querySelectorAll('.desktop-nav [data-route], .mobile-nav [data-route]');
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) navLinks.forEach(link => {
      if (link.dataset.route === entry.target.id || (entry.target.id === 'simulator' && link.dataset.route === 'planner-workspace')) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  document.querySelectorAll('.faq-list details').forEach(details => details.addEventListener('toggle', () => {
    if (details.open) document.querySelectorAll('.faq-list details').forEach(other => { if (other !== details) other.open = false; });
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();
  const header = document.querySelector('.header');
  let headerFrame = 0;
  function syncHeader() { headerFrame = 0; header.classList.toggle('header-scrolled', window.scrollY > 24); }
  addEventListener('scroll', () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(syncHeader);
  }, { passive: true });
  addEventListener('pageshow', syncHeader);
  syncHeader();
  if(new URLSearchParams(location.search).has('product')) start.click();
  import('./scroll-motion.js').then(module => module.initScrollMotion()).catch(() => {});
})();
