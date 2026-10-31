/* Hommely recommendations + instant search. Everything stays on the visitor's device (localStorage). */
(function () {
  var C = window.HMC; if (!C) return;
  var P = C.p, byCode = {}; P.forEach(function (p) { byCode[p.c] = p; });
  function get(k, d) { try { var v = localStorage.getItem('hm_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem('hm_' + k, JSON.stringify(v)); } catch (e) {} }
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p); } catch (e) {} }
  var path = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
  if (path === '404' || path === 'thanks') return;

  /* 1. Learn from what the visitor opens: product clicks on any page */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[rel~="sponsored"], a[href*="amazon."], a[href*="linksynergy"]');
    if (!a) return;
    var host = a.closest('[id^="hf-"]'), code = host ? host.id.toUpperCase() : null;
    if (!code) { var c = a.closest('.fcard,.gift,.pick,.card,.srow,.hmr-card'); var el = c && c.querySelector('.code,.fcode,.scode,[data-code]'); if (el) code = (el.getAttribute('data-code') || el.textContent).trim(); }
    var href = a.getAttribute('href') || '', store = /amazon\.com/.test(href) ? 'amazon.com' : /amazon\./.test(href) ? 'amazon.ca' : /mid=53166/.test(href) ? 'well.ca' : /mid=54255/.test(href) ? 'tru earth' : /mid=53929/.test(href) ? 'artika' : /linksynergy/.test(href) ? 'rakuten' : 'other';
    ga('affiliate_click', { item_id: code || '', retailer: store, page: path || 'home', link_url: href.split('?')[0] });
    if (!code || !byCode[code]) return;
    var r = get('seen', []); r = [code].concat(r.filter(function (x) { return x !== code; })).slice(0, 12); set('seen', r);
    var m = get('int', {}), k = byCode[code].k; m[k] = (m[k] || 0) + 3; set('int', m);
    ga('product_click', { code: code, category: k });
  }, true);

  /* 2. Scoring */
  var GOES = { kitchen: ['organize', 'gifts'], organize: ['kitchen', 'solvers'], cozy: ['solvers', 'love'], solvers: ['cozy', 'smart'], smart: ['solvers', 'cozy'], love: ['gifts', 'cozy'], gifts: ['love', 'cozy'] };
  var POPULAR = ['HF-C09', 'HF-C06', 'HF-K05', 'HF-S07', 'HF-K10', 'HF-O03', 'HF-L10', 'HF-S03', 'HF-C02', 'HF-A01'];
  var pageCat = (function () {
    var m = { 'clever-kitchen': 'kitchen', 'kitchen-gadgets-worth-buying': 'kitchen', 'organize-everything': 'organize', 'small-kitchen-organization': 'organize', 'fridge-organization-reset': 'organize', 'declutter-before-the-holidays': 'organize', 'cozy-home': 'cozy', 'cozy-winter-living-room': 'cozy', 'slow-canadian-winter': 'cozy', 'best-heated-blanket-canada': 'cozy', 'is-a-candle-warmer-lamp-worth-it': 'cozy', 'everyday-problem-solvers': 'solvers', 'winter-proof-your-home': 'solvers', 'how-to-stop-a-draft-under-a-door': 'solvers', 'canadian-winter-essentials': 'solvers', 'home-but-smarter': 'smart', 'smart-home-starter-kit': 'smart', 'black-friday-without-regret': 'smart', 'love-found': 'love', 'gifts-for-her-under-50': 'love', 'christmas-gifts': 'gifts', 'stocking-stuffers-under-25': 'gifts', 'gifts-for-him': 'gifts', 'secret-santa-gifts-under-30': 'gifts', 'gifts-under-50-canada': 'gifts', 'made-in-canada-gifts': 'gifts', 'greener-home': 'organize' };
    return m[path] || null;
  })();
  var onPage = {}; [].slice.call(document.querySelectorAll('[id^="hf-"]')).forEach(function (n) { onPage[n.id.toUpperCase()] = 1; });
  var seen = get('seen', []), interest = get('int', {});
  function pick(score, n, exclude) {
    return P.filter(function (p) { return !exclude[p.c]; }).map(function (p, i) { return { p: p, s: score(p) + ((i * 7919 + new Date().getDate()) % 100) / 1000 }; })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, n).map(function (x) { return x.p; });
  }
  var used = {}; Object.keys(onPage).forEach(function (k) { used[k] = 1; });
  var rows = [];
  if (pageCat) {
    var goes = GOES[pageCat] || [];
    var g = pick(function (p) { return (goes.indexOf(p.k) === 0 ? 3 : goes.indexOf(p.k) === 1 ? 2 : 0) + (POPULAR.indexOf(p.c) >= 0 ? 1 : 0); }, 4, used);
    g.forEach(function (p) { used[p.c] = 1; }); rows.push({ t: 'Goes well with this', d: 'Finds that pair well with this page.', items: g, id: 'goes' });
  }
  var top = 0, best = null; for (var k in interest) if (interest[k] > top) { top = interest[k]; best = k; }
  if (best && top >= 4) {
    var f = pick(function (p) { return (interest[p.k] || 0) + (seen.indexOf(p.c) >= 0 ? -50 : 0); }, 4, used);
    f.forEach(function (p) { used[p.c] = 1; }); rows.push({ t: 'Picked for you', d: 'Based on the pages and finds you have opened on this device.', items: f, id: 'foryou' });
  } else {
    var pp = POPULAR.filter(function (c) { return byCode[c] && !used[c]; }).slice(0, 4).map(function (c) { return byCode[c]; });
    pp.forEach(function (p) { used[p.c] = 1; }); rows.push({ t: 'Editors\u2019 top picks', d: 'The finds we recommend most often.', items: pp, id: 'popular' });
  }
  var rv = seen.filter(function (c) { return byCode[c]; }).slice(0, 4).map(function (c) { return byCode[c]; });
  if (rv.length) rows.push({ t: 'Recently viewed', d: 'Pick up where you left off.', items: rv, id: 'recent' });

  /* 3. Render */
  var css = '.hmr{max-width:1180px;margin:0 auto;padding:30px clamp(16px,3vw,28px) 10px}.hmr h2{font-family:var(--display,Georgia,serif);font-size:clamp(1.5rem,3vw,2rem);font-weight:600}.hmr .d{font-size:.86rem;color:var(--muted,#5a6670);margin:4px 0 14px}.hmr-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:26px}.hmr-card{background:var(--card,#fffdf7);border:1px solid var(--line,#e6dfcd);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}.hmr-card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:#e7eadc}.hmr-card .b{padding:10px 12px 12px;display:flex;flex-direction:column;gap:6px;flex:1}.hmr-card b{font-size:.95rem;line-height:1.2}.hmr-card small{font:700 .7rem ui-monospace,Menlo,monospace;color:var(--olive-d,#3f4a2c)}.hmr-card .x{display:flex;gap:6px;margin-top:auto;flex-wrap:wrap}.hmr-card .x a{font:600 .78rem var(--body,system-ui);padding:7px 11px;border-radius:999px;text-decoration:none;border:2px solid var(--slate,#587487)}.hmr-card .x a.buy{background:var(--slate,#587487);color:#fff}.hmr-card .x a.more{color:var(--slate,#587487)}@media(max-width:760px){.hmr-row{grid-template-columns:1fr 1fr}}' +
    '#hms-btn{flex:none;margin-left:auto;background:rgba(255,255,255,.1);border:1px solid rgba(226,207,162,.5);color:#fff;border-radius:999px;padding:7px 14px;font:600 .84rem var(--body,system-ui);cursor:pointer;white-space:nowrap}#hms{position:fixed;inset:0;z-index:80;background:rgba(36,50,60,.55);display:none;align-items:flex-start;justify-content:center;padding:8vh 16px}#hms.on{display:flex}#hms .box{background:var(--cream,#faf6ec);width:min(680px,100%);border-radius:20px;padding:18px;max-height:80vh;overflow:auto;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)}#hms input{width:100%;font:500 1.1rem var(--body,system-ui);padding:14px 16px;border:2px solid var(--gold,#b8975f);border-radius:14px;background:#fff;color:#24323c}#hms ul{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:6px}#hms li a{display:grid;grid-template-columns:52px 1fr;gap:12px;align-items:center;padding:8px;border-radius:12px;text-decoration:none;color:#24323c}#hms li a:hover,#hms li a:focus{background:#efe7d6;outline:none}#hms li img{width:52px;height:52px;object-fit:cover;border-radius:10px;background:#e7eadc}#hms li .pg{width:52px;height:52px;border-radius:10px;background:#2b3a45;color:#e2cfa2;display:grid;place-items:center;font-size:1.3rem}#hms li small{display:block;color:#5a6670;font-size:.8rem}#hms .hint{font-size:.8rem;color:#5a6670;margin-top:8px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function card(p) {
    var a = document.createElement('article'); a.className = 'hmr-card';
    a.innerHTML = '<img alt="" loading="lazy"><div class="b"><small data-code=""></small><b></b><div class="x"><a class="buy" target="_blank" rel="noopener sponsored">Check price</a><a class="more" target="_top">Read more</a></div></div>';
    a.querySelector('img').src = p.i; a.querySelector('img').alt = p.n; a.querySelector('small').textContent = p.c; a.querySelector('small').setAttribute('data-code', p.c);
    a.querySelector('b').textContent = p.n; a.querySelector('.buy').href = p.a; a.querySelector('.more').href = p.u.replace('https://hommely.co', '');
    return a;
  }
  var anchor = document.querySelector('.trust') || document.querySelector('footer');
  if (anchor && rows.length) {
    var box = document.createElement('section'); box.className = 'hmr'; box.setAttribute('aria-label', 'Recommendations');
    rows.forEach(function (r) {
      if (!r.items.length) return;
      var h = document.createElement('h2'); h.textContent = r.t; var d = document.createElement('p'); d.className = 'd'; d.textContent = r.d;
      var row = document.createElement('div'); row.className = 'hmr-row'; row.setAttribute('data-row', r.id); r.items.forEach(function (p) { row.appendChild(card(p)); });
      box.appendChild(h); box.appendChild(d); box.appendChild(row);
    });
    anchor.parentNode.insertBefore(box, anchor);
  }

  /* 4. Instant search (products, Find Codes and guides) */
  var bar = document.querySelector('.topbar .wrap');
  if (bar) {
    var b = document.createElement('button'); b.id = 'hms-btn'; b.type = 'button'; b.textContent = '🔍 Search'; b.setAttribute('aria-label', 'Search Hommely'); bar.appendChild(b);
    var ov = document.createElement('div'); ov.id = 'hms'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Search Hommely');
    ov.innerHTML = '<div class="box"><input type="search" placeholder="Search finds, guides or a Find Code (e.g. HF-C06)" aria-label="Search"><ul></ul><p class="hint">Tip: type a problem, like "cold", "drawer" or "gift for her".</p></div>';
    document.body.appendChild(ov);
    var inp = ov.querySelector('input'), ul = ov.querySelector('ul');
    var SYN = { cold: 'heated warm draft blanket hand warmers throw', warm: 'heated blanket throw cozy', gift: 'gift', her: 'earrings lip beauty necklace', him: 'wallet watch speaker', drawer: 'drawer organizer dividers', closet: 'closet hangers shelves', light: 'lamp light candle', kitchen: 'kitchen chopper thermometer', fridge: 'fridge bins herb', draft: 'draft door', candle: 'candle warmer flameless' };
    function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function run() {
      var q = norm(inp.value.trim()); ul.innerHTML = ''; if (!q) return;
      var terms = q.split(/\s+/); terms.slice().forEach(function (w) { if (SYN[w]) terms = terms.concat(SYN[w].split(' ')); });
      function sc(text) { var t = norm(text), s = 0; terms.forEach(function (w) { if (w.length > 1 && t.indexOf(w) >= 0) s++; }); return s; }
      var res = [];
      P.forEach(function (p) { var s = sc(p.n + ' ' + p.w + ' ' + p.k) * 2 + (norm(p.c) === q ? 100 : 0); if (s) res.push({ s: s, p: p }); });
      C.g.forEach(function (g) { var s = sc(g.n + ' ' + g.d) * 2 + 1; if (s > 1) res.push({ s: s, g: g }); });
      res.sort(function (a, b) { return b.s - a.s; }).slice(0, 10).forEach(function (r) {
        var li = document.createElement('li'), a = document.createElement('a'); a.target = '_top';
        if (r.p) { a.href = r.p.u.replace('https://hommely.co', ''); a.innerHTML = '<img alt=""><span><b></b><small></small></span>'; a.querySelector('img').src = r.p.i; a.querySelector('b').textContent = r.p.n; a.querySelector('small').textContent = r.p.c + ' · ' + r.p.w; }
        else { a.href = r.g.u; a.innerHTML = '<span class="pg">📖</span><span><b></b><small></small></span>'; a.querySelector('b').textContent = r.g.n; a.querySelector('small').textContent = r.g.d; }
        li.appendChild(a); ul.appendChild(li);
      });
      if (!ul.children.length) ul.innerHTML = '<li style="padding:8px;color:#5a6670">No matches yet. Try "gift", "cozy" or "kitchen".</li>';
    }
    var tmr; inp.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(function () { run(); ga('search', { search_term: inp.value }); }, 250); });
    function open() { ov.classList.add('on'); inp.focus(); }
    function close() { ov.classList.remove('on'); }
    b.addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') { e.preventDefault(); open(); } });
  }

  /* 5. Label partner products and measure views and sign-ups */
  var bcss = document.createElement('style'); bcss.textContent = '.hm-src{display:inline-block;font:700 .66rem/1 var(--body,system-ui);letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#5a6670);border:1px solid var(--line,#e6dfcd);border-radius:999px;padding:4px 8px;margin:4px 0 0;align-self:flex-start;width:max-content;max-width:100%}.hm-src.own{color:#fff;background:var(--olive,#5f6b47);border-color:var(--olive,#5f6b47)}'; document.head.appendChild(bcss);
  function storeOf(h) { return /amazon\./.test(h) ? 'Amazon.ca' : /mid=53166/.test(h) ? 'Well.ca' : /mid=54255/.test(h) ? 'Tru Earth' : /mid=53929/.test(h) ? 'Artika' : 'partner'; }
  function label() {
    [].slice.call(document.querySelectorAll('.card,.fcard,.pick,.srow,.gift,.hmr-card')).forEach(function (c) {
      if (c.querySelector('.hm-src')) return;
      var a = c.querySelector('a[rel~="sponsored"],a[href*="amazon."],a[href*="linksynergy"]'); if (!a) return;
      var s = document.createElement('span'); s.className = 'hm-src'; s.textContent = 'Partner retailer · ' + storeOf(a.getAttribute('href') || '');
      s.title = 'Sold by an independent retailer. Hommely may earn a commission.';
      var h = c.querySelector('h3,h2,b'); if (h) h.parentNode.insertBefore(s, h.nextSibling); else a.parentNode.appendChild(s);
      if (h && getComputedStyle(h.parentNode).display.indexOf('flex') < 0) s.style.display = 'table';
    });
  }
  label(); setTimeout(label, 1500);
  if ('IntersectionObserver' in window) {
    var viewed = {};
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; var n = e.target, code = (n.id || '').toUpperCase() || ((n.querySelector('.code,.fcode,.scode,[data-code]') || {}).textContent || '').trim();
      if (!code || viewed[code] || !byCode[code]) return; viewed[code] = 1; io.unobserve(n);
      ga('view_item', { currency: 'CAD', items: [{ item_id: code, item_name: byCode[code].n, item_category: byCode[code].k, affiliation: 'Partner retailer' }] });
    }); }, { threshold: 0.6 });
    setTimeout(function () { [].slice.call(document.querySelectorAll('[id^="hf-"],.fcard,.hmr-card')).forEach(function (n) { io.observe(n); }); }, 1600);
  }
  [].slice.call(document.querySelectorAll('form[name="newsletter"],form[name="shop-waitlist"]')).forEach(function (f) {
    f.addEventListener('submit', function () { ga('sign_up', { method: f.getAttribute('name') }); });
  });
})();
