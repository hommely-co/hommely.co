/* Hommely market selector: which country's stores the product links open.
   The visitor's choice is saved on this device only. Nothing personal is sent anywhere. */
(function () {
  'use strict';
  var ES = (document.documentElement.lang || '').toLowerCase().indexOf('es') === 0;
  var MARKETS = {
    ca: { en: 'Canada', es: 'Canadá', amazon: 'Amazon.ca', host: 'www.amazon.ca', tag: 'hommely-20' },
    us: { en: 'United States', es: 'Estados Unidos', amazon: 'Amazon.com', host: 'www.amazon.com', tag: 'hommely01-20' },
    co: { en: 'Colombia', es: 'Colombia', amazon: 'Amazon.com', host: 'www.amazon.com', tag: 'hommely01-20',
          noteEn: 'Shopping from Colombia: product links open Amazon.com, where delivery to Colombia depends on each item and is confirmed at checkout. Hommely is also on the Éxito marketplace.',
          noteEs: 'Desde Colombia: los enlaces abren Amazon.com, donde el envío a Colombia depende de cada producto y se confirma al pagar. Hommely también está en el marketplace de Éxito.' },
    eu: { en: 'Europe', es: 'Europa', amazon: 'Amazon.com', host: 'www.amazon.com', tag: 'hommely01-20',
          noteEn: 'Shopping from Europe: we do not have verified European store links yet, so product links open Amazon.com. International delivery depends on each item and is confirmed at checkout.',
          noteEs: 'Desde Europa: aún no tenemos enlaces verificados de tiendas europeas, así que los enlaces abren Amazon.com. El envío internacional depende de cada producto y se confirma al pagar.' },
    xx: { en: 'Other country', es: 'Otro país', amazon: 'Amazon.com', host: 'www.amazon.com', tag: 'hommely01-20',
          noteEn: 'Product links open Amazon.com. International delivery depends on each item and is confirmed at checkout.',
          noteEs: 'Los enlaces abren Amazon.com. El envío internacional depende de cada producto y se confirma al pagar.' }
  };
  /* Retailers other than Amazon: where each one delivers, as stated by Hommely's own pages. */
  var STORES = [
    { re: /dysoncanada\.ca/, name: 'Dyson Canada', ships: ['ca'], en: 'Ships within Canada', es: 'Envía dentro de Canadá' },
    { re: /artika\.ca/, name: 'Artika', ships: ['ca', 'us'], en: 'Ships to Canada and the continental US', es: 'Envía a Canadá y EE. UU. continental' },
    { re: /well\.ca/, name: 'Well.ca', ships: ['ca'], en: 'Ships within Canada', es: 'Envía dentro de Canadá' },
    { re: /ca\.tru\.earth/, name: 'Tru Earth Canada', ships: ['ca'], en: 'Canadian store', es: 'Tienda canadiense' },
    { re: /giftcards\.com/, name: 'Giftcards.com', ships: ['us'], en: 'U.S. recipients only', es: 'Solo para destinatarios en EE. UU.' }
  ];
  var KW = {"B0BGCFBVDD":"personalized initial necklace","B0C1JK7SN5":"stackable rings set gold","B074NVZNF9":"gold charm bracelet women","B09T3FZML8":"emerald earrings","B0F8VKQKJT":"lip kit gift set","B0F1TQTKK4":"perfume discovery set","B08XY94FXM":"saffiano leather wallet men","B0D14BJ649":"minimalist leather strap watch men","B0DK8Q5119":"black onyx bracelet men","B0852VJ6RD":"electric arc lighter rechargeable long","B0095GOBGE":"mug warmer electric","B0F6F4W5JW":"digital meat thermometer instant read","B0BDF8CVBN":"motion sensor led closet light rechargeable","B09HQ2C2HR":"space saving hangers","B0CCJ2LQRS":"lazy susan turntable organizer dividers","B0B6GZQ7YM":"pan lid organizer rack adjustable","B09PYXDP1T":"roll up over sink dish drying rack","B07JD3WNWR":"stackable can rack organizer pantry","B0G5Y3LN8M":"robot vacuum mop self empty","B0DQLDBXWF":"smart water leak sensor","B09B8V1LZ3":"echo dot smart speaker","B0BXM37848":"fire tv stick 4k max","B0GVLNG9DZ":"winix 5530 air purifier","B0BYGRLRS1":"matter smart plug","B0CD7NT4Y9":"video doorbell","B0991Q94KP":"smart led strip lights app","B0DGXD6WVW":"sunrise alarm clock","B088NHSVJN":"wifi digital photo frame","B07Z5H4TF5":"temperature control smart mug","B09XXS48P8":"ecobee smart thermostat premium","B0DFY5TNFX":"gravity electric salt pepper grinder set","B0BHSXFTGH":"vegetable chopper with container","B0D1KQKZM2":"cosori air fryer 9 in 1","B0113UZJE2":"digital kitchen scale grams","B07FVQLBL3":"electric can opener hands free","B0B81ZJTBH":"herb keeper fridge container","B0FMDR8KG2":"titanium cutting board double sided","B08KXKVT4K":"vtopmart clear drawer organizer set 25","B0C7H999YC":"under sink organizer 2 tier sliding","B07HQMZ7HH":"bamboo drawer dividers expandable","B07CG2R9ST":"over door organizer clear pockets pantry","B07Q2SK4JQ":"cable management box","B074VPQCNL":"vacuum storage bags with hand pump","B0CNQZX4RK":"rotating makeup organizer 360","B07SYPLVTG":"hanging closet organizer shelves","B010RLCCL6":"coffee pod drawer organizer","B0BXW9YNGS":"heated throw blanket auto shut off","B0CTJGJL2T":"candle warmer lamp dimmable timer","B09987SS8L":"wearable blanket hoodie sherpa","B09J1FK7RK":"flameless candles remote timer real wax","B0DK73LWHN":"flame aroma diffuser","B0CQCHC24S":"boucle throw pillow covers","B07M84N6Z6":"3d moon lamp","B07WGQCC4C":"satin pajama set women long sleeve","B0BFCC18FS":"3 in 1 charging station","B0FFLSK4VH":"rechargeable fabric shaver lint remover","B0D63573CF":"bluetooth key finder tracker","B09R8HBFQ9":"under cabinet jar opener","B0CHJGG1GX":"reusable washable lint roller","B0C1Y8Z6VT":"magnetic phone car mount","B08HR2L8RZ":"door draft stopper under door","B01LND4F8K":"sneaker cleaning kit","B0DCDSF4DY":"rechargeable hand warmers","B089F9YDFC":"battery organizer storage with tester","B0CCSRSGVD":"heatless curling rod satin","B08CTB2H6T":"pavoi gold huggie hoop earrings","B07XXPHQZK":"laneige lip sleeping mask","B01EXQ582Q":"sol de janeiro bum bum cream","B0CYCFRZKD":"under eye patches hydrogel","B09YTB7VVY":"satin hair bows","B0B2RM68G2":"bio collagen overnight mask","B00T0C9XRK":"essence lash princess mascara","B0DT44TSM2":"pop mart labubu blind box","B0FQG8RW95":"airpods pro 3","B0CFPWLGF2":"kindle paperwhite 16gb","B0BXPF5D4T":"chunky knit throw blanket chenille","B0FLYDJHB4":"ray-ban meta smart glasses gen 2","B0D88SMLS2":"ninja slushi frozen drink maker","B0CP9Z56SW":"stanley quencher 40 oz","B0BWNZLQ69":"instax mini 12","B0BQZFVJTB":"needoh nice cube","B0BZRBHZV8":"bedsure heated throw blanket","B0BRMYHMS5":"medicube collagen wrapping mask","B07R5TN1NN":"mulberry silk pillowcase","B0CTNWBT1Z":"portable bluetooth speaker waterproof","B09YHJHT4R":"galaxy star projector night light","B0BZJ9WZ7H":"wooden train set","B00U26LT34":"building blocks set kids","B078Z4KFDR":"kids ok to wake clock","B0BPNML6TS":"bracelet making kit","B0GCBV6M3Y":"kpop demon hunters zoey singing doll","B07GCJMGWL":"christmas cozy socks","B0FSD4C4N9":"personalized new home ornament 2026","B09F6K15LP":"matching family christmas pajamas","B0F62X3D73":"custom photo blanket","B0BZNB9KG1":"engraved cutting board personalized","B0FSD5S3MQ":"custom pet ornament","B0B99T7QWB":"personalized name mug","B083JGYPZ4":"silicone stretch lids set","B0H6P3T649":"mini bag heat sealer","B097XYFC23":"clear stackable fridge organizer bins","B0FB98JQYZ":"cordless rechargeable mushroom table lamp","B00163U4LK":"jellycat amuseables","B00486TI3M":"catan on the road card game"};
  var KEY = 'hm_market';
  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function guess() {
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (/^America\/(Bogota)$/.test(tz)) return 'co';
    if (/^Europe\//.test(tz)) return 'eu';
    if (/^(America\/(New_York|Detroit|Kentucky|Indiana|Chicago|Menominee|North_Dakota|Denver|Boise|Phoenix|Los_Angeles|Anchorage|Juneau|Sitka|Metlakatla|Yakutat|Nome|Adak)|Pacific\/Honolulu)/.test(tz)) return 'us';
    return 'ca';
  }
  var saved = load(); var market = MARKETS[saved] ? saved : guess();
  function ga(n, p) { try { if (window.gtag) gtag('event', n, p); } catch (e) {} }
  function t(en, es) { return ES ? es : en; }

  var GENERIC = /^(check price( on amazon\.ca)?( →)?|choose a design|ver precio|elegir un diseño|search amazon\.(ca|com)|buy at .+|comprar en .+|buscar en .+)$/i;
  var ES_PAGES = ['shop', 'for-her', 'for-him', 'for-home', 'room-to-wow', 'christmas-gifts'];
  function nameFor(a) {
    var c = a.closest('[id^="hf-"],.card,.gift,.pick,.fcard,.srow,.hmr-card,article');
    var h = c && c.querySelector('h3,b,h4');
    return (h && h.textContent.trim()) || (a.getAttribute('aria-label') || '').trim();
  }
  function store(href) { for (var i = 0; i < STORES.length; i++) if (STORES[i].re.test(href)) return STORES[i]; return null; }

  function fix(a) {
    if (!a || !a.getAttribute) return;
    var orig = a.getAttribute('data-hm-ca') || a.getAttribute('href') || '';
    var M = MARKETS[market], generic = GENERIC.test((a.textContent || '').trim()) || a.hasAttribute('data-hm-label');
    if (/amazon\.ca\//.test(orig)) {
      if (!a.hasAttribute('data-hm-ca')) a.setAttribute('data-hm-ca', orig);
      var dp = orig.match(/amazon\.ca\/dp\/([A-Z0-9]{10})/), search = /amazon\.ca\/s\?/.test(orig), href = orig, label;
      if (market === 'ca') { label = dp ? t('Buy at Amazon.ca', 'Comprar en Amazon.ca') : t('Search Amazon.ca', 'Buscar en Amazon.ca'); }
      else {
        var q = '';
        if (dp && KW[dp[1]]) q = KW[dp[1]];
        else if (search) { var m = orig.match(/[?&]k=([^&]+)/); q = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : ''; }
        if (!q) q = nameFor(a) || 'home finds';
        href = 'https://' + M.host + '/s?k=' + encodeURIComponent(q).replace(/%20/g, '+') + '&tag=' + M.tag;
        label = t('Search ' + M.amazon, 'Buscar en ' + M.amazon);
      }
      if (a.getAttribute('href') !== href) a.setAttribute('href', href);
      if (generic) { a.setAttribute('data-hm-label', ''); if (a.textContent !== label) a.textContent = label; }
      return;
    }
    var s = store(orig);
    if (s && generic) {
      a.setAttribute('data-hm-label', '');
      var l = t('Buy at ' + s.name, 'Comprar en ' + s.name); if (a.textContent !== l) a.textContent = l;
    }
    if (s && a.hasAttribute('data-hm-label')) {
      var note = a.parentNode && a.parentNode.querySelector('.hm-ship');
      var out = s.ships.indexOf(market) < 0;
      if (out && !note) { note = document.createElement('span'); note.className = 'hm-ship'; a.insertAdjacentElement('afterend', note); }
      if (note) { note.textContent = out ? t(s.en, s.es) : ''; note.hidden = !out; }
    }
  }
  function pills() {
    var M = MARKETS[market];
    document.querySelectorAll('small,.pill,.retailer,.hm-src').forEach(function (el) {
      if (el.children.length) return;
      var tx = el.textContent; if (!/Amazon\.(ca|com)/.test(tx)) return;
      var n = tx.replace(/Amazon\.(ca|com)/, M.amazon); if (n !== tx) el.textContent = n;
    });
    /* Mark stock photos as style photos, so they are not mistaken for the exact product. */
    document.querySelectorAll('.photo img[src*="images.unsplash.com"],.hmr-card img[src*="images.unsplash.com"],.pick img[src*="images.unsplash.com"],.fcard img[src*="images.unsplash.com"]').forEach(function (img) {
      var box = img.parentNode; if (!box || box.querySelector(':scope > .hm-style')) return;
      if (box.tagName === 'ARTICLE') { var w = document.createElement('div'); w.className = 'hm-imgw'; box.insertBefore(w, img); w.appendChild(img); box = w; }
      if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
      var b = document.createElement('span'); b.className = 'hm-style'; b.textContent = t('Style photo', 'Foto de estilo');
      b.title = t('Shows the style and setting, not the exact product. Check the retailer listing for details.', 'Muestra el estilo y el ambiente, no el producto exacto. Revisa la ficha de la tienda.');
      box.appendChild(b);
    });
  }
  function all() {
    var l = document.querySelectorAll('a[href*="amazon."],a[data-hm-ca],a[href*="linksynergy"]');
    for (var i = 0; i < l.length; i++) fix(l[i]);
    pills(); banner();
  }

  /* The selector, placed in the top navigation on every page. */
  var CSS = '.hm-util{background:#1f2b33;color:#fff}.hm-tools{max-width:1180px;margin:0 auto;padding:5px clamp(16px,3vw,28px);display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap}.hm-mk{display:inline-flex;align-items:center;gap:6px;font:600 .78rem var(--body,system-ui);color:#e8e1d2;white-space:nowrap}.hm-mk select{font:600 .78rem var(--body,system-ui);padding:4px 8px;border-radius:999px;border:1px solid rgba(226,207,162,.55);background:rgba(255,255,255,.08);color:#fff;max-width:160px;cursor:pointer}.hm-mk select option{color:#24323c}.hm-mk select:focus-visible,.hm-lang:focus-visible{outline:2px solid #e2cfa2;outline-offset:2px}.hm-lang{font:700 .78rem var(--body,system-ui);color:#e2cfa2!important;text-decoration:underline;text-underline-offset:3px}.hm-ship{display:block;width:100%;margin-top:4px;font-size:.74rem;opacity:.75}.hm-mknote{max-width:1180px;margin:10px auto 0;padding:10px 16px;border-radius:12px;background:#f1ebe2;color:#24323c;font:500 .85rem/1.45 var(--body,system-ui)}.hm-mknote a{color:inherit;font-weight:700}.hm-style{position:absolute;left:8px;bottom:8px;font:700 .62rem/1 var(--body,system-ui);letter-spacing:.04em;text-transform:uppercase;background:rgba(36,50,60,.72);color:#fff;padding:4px 7px;border-radius:999px}.hm-imgw{position:relative}@media(max-width:1080px){.topbar .wrap{flex-wrap:wrap;justify-content:center;row-gap:0;gap:0}.brand{padding-block:6px 0}.nav{flex:1 1 100%;gap:2px 4px;flex-wrap:wrap;justify-content:center;padding-block:4px 10px}.nav a,.navdd summary{padding:6px 9px;font-size:.82rem}.navdd summary::after{margin-left:4px;width:5px;height:5px}.navdd{position:static}.ddp{left:50%;right:auto;transform:translateX(-50%);width:min(360px,calc(100vw - 24px));top:calc(100% - 2px)}}@media(max-width:600px){.hm-tools{justify-content:center}}';
  function ui() {
    var nav = document.querySelector('.topbar .nav'); if (!nav || document.getElementById('hm-mk')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var lab = document.createElement('label'); lab.className = 'hm-mk'; lab.id = 'hm-mk';
    var sp = document.createElement('span'); sp.textContent = t('Shop from', 'Comprar desde'); lab.appendChild(sp);
    var sel = document.createElement('select'); sel.setAttribute('aria-label', t('Choose the country you shop from', 'Elige el país desde el que compras'));
    Object.keys(MARKETS).forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = MARKETS[k][ES ? 'es' : 'en']; if (k === market) o.selected = true; sel.appendChild(o); });
    sel.addEventListener('change', function () { market = sel.value; save(market); ga('select_market', { market: market }); all(); });
    lab.appendChild(sel); var util = document.createElement('div'); util.className = 'hm-util'; var tools = document.createElement('div'); tools.className = 'hm-tools'; tools.appendChild(lab); util.appendChild(tools); var tb = document.querySelector('.topbar'); tb.parentNode.insertBefore(util, tb);
    var lg = document.createElement('a'); lg.className = 'hm-lang'; lg.target = '_top';
    var pth = location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
    if (ES) { var m = pth.match(/^\/es\/(.+)$/); lg.href = m ? '/' + m[1] : '/'; lg.textContent = 'English'; lg.lang = 'en'; }
    else { var k = pth.replace(/^\//, ''); lg.href = ES_PAGES.indexOf(k) >= 0 ? '/es/' + k : '/es'; lg.textContent = 'Español'; lg.lang = 'es'; }
    tools.appendChild(lg);
  }
  function banner() {
    var M = MARKETS[market], b = document.getElementById('hm-mknote'), tx = ES ? M.noteEs : M.noteEn;
    if (!tx) { if (b) b.remove(); return; }
    if (!b) { var bar = document.querySelector('.topbar'); if (!bar) return; b = document.createElement('div'); b.id = 'hm-mknote'; b.className = 'hm-mknote'; b.setAttribute('role', 'note'); bar.insertAdjacentElement('afterend', b); }
    b.textContent = tx;
    if (market === 'co') { b.appendChild(document.createTextNode(' ')); var a = document.createElement('a'); a.href = 'https://www.exito.com/marketplace/16795'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = t('Visit Hommely on Éxito ↗', 'Ver Hommely en Éxito ↗'); b.appendChild(a); }
  }
  ['click', 'auxclick', 'contextmenu', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { var a = e.target.closest && e.target.closest('a'); if (a) fix(a); }, true);
  });
  function start() {
    ui(); all();
    if (window.MutationObserver) { var q = 0; new MutationObserver(function () { if (q) return; q = 1; setTimeout(function () { q = 0; var l = document.querySelectorAll('a[href*="amazon.ca/"],a[href*="linksynergy"]:not([data-hm-label])'); for (var i = 0; i < l.length; i++) fix(l[i]); pills(); }, 60); }).observe(document.body, { childList: true, subtree: true }); }
  }
  window.HommelyMarket = { get: function () { return market; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
