// Products menu (DL-128, 2026-10-27). Turns the nav's plain "Products" link into the Sierra-style panel: opens on hover
// or click, closes on leaving the header, Escape or a click outside. One list of products, used on every page.
(() => {
  const link = document.querySelector('.top nav a.nav-prod');
  if (!link) return;
  const base = link.getAttribute('href').replace(/products\.html.*$/, '');
  const P = [
    ['Capture', 'Compass', 'CRM with AI', 'Your enquiries, followed up for you.', 'compass'],
    ['Organise', 'Harbour', 'Document management', 'Your paperwork, filed for you.', 'harbour'],
    ['Find', 'Lighthouse', 'Information retrieval', 'The right information, found when it’s needed.', 'lighthouse'],
    ['Assist', 'Helm', 'Personal AI assistant', 'The one you talk to. It knows what the others are doing.', 'helm'],
  ];
  const arr = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const mega = document.createElement('div');
  mega.className = 'mega'; mega.id = 'mega'; mega.setAttribute('role', 'region'); mega.setAttribute('aria-label', 'Products');
  mega.innerHTML = `<div class="mt"><div><h2>Products</h2><p>Four products, built in your own database and owned by you.</p></div>
    <a class="all" href="${base}products.html">See all products ${arr}</a></div>
    <div class="cols">${P.map(([st, n, c, l, k]) => `<div><p class="st">${st}</p><a href="${base}products.html#${k}"><span class="pn">${n}</span><span class="pc">${c}</span><span class="pl">${l}</span></a></div>`).join('')}</div>
    <div class="mb"><span><b>Included with every product:</b> aftercare, monthly notes, and your data kept in your own accounts.</span><a href="${base}products.html#systems">Built into systems: Broker Desk →</a></div>`;
  const row = link.closest('.row');
  row.style.position = 'relative';
  row.appendChild(mega);
  link.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>');
  link.setAttribute('aria-expanded', 'false'); link.setAttribute('aria-controls', 'mega');
  const set = o => { mega.classList.toggle('open', o); link.setAttribute('aria-expanded', o); };
  const hover = matchMedia('(hover: hover)').matches;
  if (hover) link.addEventListener('mouseenter', () => set(true));
  // A first click opens the panel; a click while it is open follows the link to the Products page
  link.addEventListener('click', e => { if (!mega.classList.contains('open')) { e.preventDefault(); set(true); } });
  link.closest('.top').addEventListener('mouseleave', () => set(false));
  row.querySelectorAll('nav a:not(.nav-prod), .cta, .logo').forEach(a => a.addEventListener('mouseenter', () => set(false)));
  document.addEventListener('click', e => { if (!mega.contains(e.target) && e.target !== link && !link.contains(e.target)) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  window.__menu = set;
  if (location.hash === '#menu') set(true);
})();
