/* ==========================================================================
   app.js : renders the whole UI from window.MD (data.js + data-terms.js).
   Sections: helpers · rich text · tooltip · drawer · home (welcome, map,
   stage panel, packets, viewer controls) · pages (stage, parts, glossary) ·
   routing · boot.
   ========================================================================== */
(function () {
  'use strict';
  var MD = window.MD;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  var state = { level: store.get('md-level', 'simple'), stage: 1, route: 'home', gq: '', role: store.get('md-role', ''), capaStep: 0, mf: 'All', mq: '', product: store.get('md-product', 'stretcher') === 'bike' ? 'bike' : 'stretcher' };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var partById = {}; MD.parts.forEach(function (p) { partById[p.id] = p; });
  var roleById = {}; MD.roles.forEach(function (r) { roleById[r.id] = r; });
  var bikeById = {}; MD.bike.parts.forEach(function (p) { bikeById[p.id] = p; });
  function anyPart(id) { return partById[id] || bikeById[id] || { id: id, name: id, s: '' }; }
  function isBike() { return state.product === 'bike'; }
  function prodParts() { return isBike() ? MD.bike.parts : MD.parts.filter(function (p) { return p.lvl > 0; }); }
  function curStory() { return isBike() ? MD.bike.story : MD.story; }

  /* ---------------- helpers ---------------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function lv(o) { return (o && typeof o === 'object' && !Array.isArray(o) && ('s' in o)) ? (state.level === 'expert' ? o.x : o.s) : o; }
  var VERIFY = '<span class="verify" data-tip="Check this for your Windchill / SAP release, licences and configuration.">VERIFY</span>';

  /* Turns [[term]], [[term|text]], [[p:PART]], [[s:3]] and {V} into interactive HTML. */
  function rich(s) {
    if (s == null) return '';
    return esc(s).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (m, id, txt) {
      if (id.indexOf('p:') === 0) {
        var p = partById[id.slice(2)];
        if (!p) return txt || id.slice(2);
        return '<button type="button" class="term plink" data-part="' + p.id + '" data-tip="' + esc(p.name + ' — ' + p.s) + '">' + (txt || p.id) + '</button>';
      }
      if (id.indexOf('s:') === 0) {
        var st = MD.stages[+id.slice(2) - 1];
        return '<a href="#stage-' + st.n + '" data-tip="' + esc(lv(st.tagline)) + '">' + (txt || 'stage ' + st.n + ' (' + st.short + ')') + '</a>';
      }
      var t = MD.terms[id];
      if (!t) return txt || id;
      return '<button type="button" class="term" data-term="' + id + '" data-tip="' + esc(t.n + ' — ' + t.tip) + '">' + (txt || t.n) + '</button>';
    }).replace(/\{V\}/g, VERIFY);
  }
  function termBtn(id, cls) {
    var t = MD.terms[id]; if (!t) return '';
    return '<button type="button" class="' + (cls || 'chip') + '" data-term="' + id + '" data-tip="' + esc(t.tip) + '">' + esc(t.n) + '</button>';
  }
  function table(t, cls) {
    var h = '<div class="table-scroll"><table class="' + (cls || '') + '">';
    if (t.t) h += '<caption>' + rich(t.t) + '</caption>';
    h += '<thead><tr>' + t.cols.map(function (c) { return '<th scope="col">' + rich(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    h += t.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + rich(c) + '</td>'; }).join('') + '</tr>'; }).join('');
    h += '</tbody></table></div>';
    if (t.note) h += '<p class="tnote">' + rich(t.note) + '</p>';
    return h;
  }

  /* ---------------- 3D pictures of parts inside drawers and pages ---------------- */
  // Which parts does a piece of text talk about? Looks for part numbers such as MC-CST-6000.
  function partsIn(text, extra) {
    var ids = [];
    (String(text || '').match(/MC-[A-Z]{3}-\d{4}/g) || []).concat(extra || []).forEach(function (id) {
      if (partById[id] && !partById[id].nomodel && id !== 'MC-STR-3000' && ids.indexOf(id) < 0) ids.push(id);
    });
    return ids.slice(0, 5);
  }
  // A figure that is filled with a rendered picture by hydrateSnaps(). ids = [] shows the whole stretcher.
  // o.look = lifecycle look, o.ex = exploded amount 0..1, o.cap = caption text.
  function snapFig(ids, o) {
    ids = ids || []; o = o || {};
    var cap = o.cap ? esc(o.cap) : (ids.length
      ? 'Highlighted: ' + ids.map(function (id) { return '<button type="button" class="term plink" data-part="' + id + '" data-tip="' + esc(anyPart(id).name) + '">' + esc(anyPart(id).name) + '</button>'; }).join(', ')
      : 'The whole ' + esc(MD.product.name) + ' stretcher');
    return '<figure class="pfig" data-snap="' + ids.join(',') + '" data-look="' + (o.look || '') + '" data-ex="' + (o.ex || 0) + '" data-prod="' + (o.prod || 'stretcher') + '"><img alt="" hidden><figcaption>' + cap + '</figcaption></figure>';
  }
  function hydrateSnaps(root) {
    $$('.pfig[data-snap]', root).forEach(function (f) {
      var ids = f.getAttribute('data-snap'), img = $('img', f);
      var url = window.Stretcher3D && window.Stretcher3D.snapshot ? window.Stretcher3D.snapshot(ids ? ids.split(',') : [], 0, 0, f.getAttribute('data-look') || '', +f.getAttribute('data-ex') || 0, f.getAttribute('data-prod') || 'stretcher') : null;
      if (!url) { f.hidden = true; return; }
      img.src = url; img.hidden = false;
      img.alt = '3D picture of the stretcher' + (ids ? ' with these parts in colour: ' + ids.split(',').map(function (id) { return anyPart(id).name; }).join(', ') : '');
    });
  }

  /* ---------------- the restaurant picture: one comparison used everywhere ---------------- */
  function kitchenNote(text) { return text ? '<p class="kitchen-note"><b>In the restaurant</b>' + esc(text) + '</p>' : ''; }
  function analogyHtml(t) {
    var k = MD.kitchen.terms[t.id];
    return k ? '<div class="analogy kitchen"><b>In the restaurant</b>' + esc(k) + '</div>' : '<div class="analogy"><b>Everyday analogy</b>' + rich(t.analogy) + '</div>';
  }

  /* Stage icons: simple line drawings, 24 x 24. */
  var ICON = {
    1: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.300 1 2.100h5c0-.8.4-1.600 1-2.100A6 6 0 0 0 12 3z"/>',
    2: '<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9L12 3zM12 12l8-4.500M12 12v9M12 12L4 7.500"/>',
    3: '<path d="M5 4h6v4H5zM13 10h6v4h-6zM13 17h6v4h-6zM8 8v11h5M8 12h5"/>',
    4: '<path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6l7-3zM9 12l2.200 2.200L15.500 10"/>',
    5: '<path d="M3 21V10l6 4v-4l6 4V5h6v16H3zM7 17h2M12 17h2M17 17h1"/>',
    6: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
    7: '<path d="M3 20h18M5 20v-8h14v8M9 12V8h6v4M12 8V4M10 4h4"/>',
    8: '<path d="M3 8l9-4 9 4v9l-9 4-9-4V8zM3 8l9 4 9-4M12 12v9M14 15.500l4-1.800"/>',
    9: '<path d="M14.500 5.500a4 4 0 0 0-5.200 5.200L3.500 16.500l2 2 1.500-.5.5-1.500 1.500-.5.500-1.500 1.800-1.800a4 4 0 0 0 5.200-5.200l-2.500 2.500-2-2 2.500-2.500z"/>',
    10: '<path d="M20 12a8 8 0 0 1-14 5.300M4 12a8 8 0 0 1 14-5.300M18 3v4h-4M6 21v-4h4"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + '</svg>'; }

  /* ---------------- tooltip ---------------- */
  var tipEl = $('#tip');
  function showTip(text, x, y) {
    tipEl.textContent = text; tipEl.hidden = false;
    var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    var left = Math.min(Math.max(8, x - w / 2), window.innerWidth - w - 8);
    var top = y - h - 12; if (top < 8) top = y + 18;
    tipEl.style.left = left + 'px'; tipEl.style.top = top + 'px';
  }
  function hideTip() { tipEl.hidden = true; }
  function tipFor(el) {
    var r = el.getBoundingClientRect();
    showTip(el.getAttribute('data-tip'), r.left + r.width / 2, r.top);
  }
  document.addEventListener('mouseover', function (e) { var el = e.target.closest && e.target.closest('[data-tip]'); if (el) tipFor(el); });
  document.addEventListener('mouseout', function (e) { var el = e.target.closest && e.target.closest('[data-tip]'); if (el) hideTip(); });
  document.addEventListener('focusin', function (e) { var el = e.target.closest && e.target.closest('[data-tip]'); if (el) tipFor(el); });
  document.addEventListener('focusout', hideTip);
  window.addEventListener('scroll', hideTip, true);

  /* ---------------- drawer ---------------- */
  var drawer = $('#drawer'), scrim = $('#scrim'), lastFocus = null, dTabsData = [];
  function openDrawer(o) {
    if (drawer.hidden) lastFocus = document.activeElement;
    $('#dKicker').textContent = o.kicker || '';
    $('#dTitle').textContent = o.title;
    $('#dSub').innerHTML = o.sub || '';
    dTabsData = o.tabs;
    $('#dTabs').innerHTML = o.tabs.map(function (t, i) {
      return '<button type="button" role="tab" data-dtab="' + i + '" aria-selected="false">' + esc(t.label) + '</button>';
    }).join('');
    drawer.hidden = false; scrim.hidden = false;
    var start = o.start != null ? o.start : (state.level === 'expert' && o.tabs.length > 1 && o.expertTab != null ? o.expertTab : 0);
    selectTab(start);
    $('#dClose').focus();
    hideTip();
  }
  function selectTab(i) {
    $$('#dTabs button').forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    var body = $('#dBody'); body.innerHTML = dTabsData[i].html; body.scrollTop = 0; hydrateSnaps(body);
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true; scrim.hidden = true;
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
  }
  $('#dClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab' && !drawer.hidden) { // keep focus inside the drawer
      var f = $$('button, a[href], input', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  function stagesUsing(test) { return MD.stages.filter(function (s) { return test(JSON.stringify(s)); }); }
  function stageChips(list) {
    return list.map(function (s) { return '<a class="chip" href="#stage-' + s.n + '" data-close="1">Stage ' + s.n + ' · ' + esc(s.short) + '</a>'; }).join('');
  }

  function openTerm(id) {
    var t = MD.terms[id]; if (!t) return;
    var used = stagesUsing(function (j) { return j.indexOf('[[' + id + ']]') >= 0 || j.indexOf('[[' + id + '|') >= 0; });
    var parts = MD.parts.filter(function (p) { return p.rel && p.rel.indexOf(id) >= 0; });
    var extra = '';
    if (id === 'alternate' || id === 'substitute') {
      extra = '<h3>The difference in one look</h3><div class="diff"><div><b>Alternate part</b>Interchangeable <em>everywhere</em> the original is used. Set once on the part itself.<br>Example: castor MC-CST-6001 for MC-CST-6000.</div><div><b>Substitute part</b>Allowed <em>only in one named assembly</em>. Set on that BOM line.<br>Example: screw MC-FST-0413 for MC-FST-0412, only in MC-DRV-8000.</div></div>';
    }
    openDrawer({
      kicker: t.cat, title: t.n, sub: esc(t.tip), expertTab: 1,
      tabs: [
        { label: 'Simple', html: '<p>' + rich(t.simple) + '</p>' + analogyHtml(t) + extra },
        { label: 'Expert', html: '<p>' + rich(t.expert) + '</p>' + extra },
        { label: 'In our stretcher', html: '<p>' + rich(t.ex) + '</p>' + snapFig(partsIn(t.ex, parts.slice(0, 3).map(function (p) { return p.id; }))) + '<p class="tnote">Sample data, invented for training.</p>' },
        { label: 'Related', html:
          (t.rel.length ? '<h3>Connected terms</h3><div class="rel">' + t.rel.map(function (r) { return termBtn(r); }).join('') + '</div>' : '') +
          (used.length ? '<h3>Used in stages</h3><div class="rel">' + stageChips(used) + '</div>' : '') +
          (parts.length ? '<h3>Parts where it matters</h3><div class="rel">' + parts.map(function (p) { return '<button type="button" class="chip" data-part="' + p.id + '">' + esc(p.name) + '</button>'; }).join('') + '</div>' : '') }
      ]
    });
  }

  function critPill(c) {
    var cls = /critical/i.test(c) ? 'crit' : (/related|contact|Structural/i.test(c) ? 'warn' : '');
    return '<span class="pill ' + cls + '">' + esc(c) + '</span>';
  }
  function openPart(id) {
    if (bikeById[id]) { openBikePart(id); return; }
    var p = partById[id]; if (!p) return;
    var parent = null, idx = MD.parts.indexOf(p);
    for (var i = idx - 1; i >= 0; i--) { if (MD.parts[i].lvl < p.lvl) { parent = MD.parts[i]; break; } }
    var kids = [];
    for (var k = idx + 1; k < MD.parts.length && MD.parts[k].lvl > p.lvl; k++) { if (MD.parts[k].lvl === p.lvl + 1) kids.push(MD.parts[k]); }
    var used = stagesUsing(function (j) { return j.indexOf(p.id) >= 0; });
    var altHtml = '<h3>' + rich('[[alternate|Alternate parts]] (interchangeable everywhere)') + '</h3>' +
      (p.alt ? p.alt.map(function (a) { return '<p><span class="mono">' + a.id + '</span> ' + esc(a.name) + '. ' + esc(a.why) + '</p>'; }).join('') : '<p class="tnote">None defined.</p>') +
      '<h3>' + rich('[[substitute|Substitute parts]] (only in this assembly)') + '</h3>' +
      (p.sub ? p.sub.map(function (a) { return '<p><span class="mono">' + a.id + '</span> ' + esc(a.name) + '. ' + esc(a.why) + '</p>'; }).join('') : '<p class="tnote">None defined.</p>');
    openDrawer({
      kicker: 'Part · ' + p.id, title: p.name, expertTab: 1,
      sub: critPill(p.crit) + ' <span class="pill">' + esc(p.mb) + '</span> <span class="pill ok">Rev ' + p.rev + ' · ' + esc(p.state) + '</span>' + (p.opt ? ' <span class="pill">Option ' + esc(p.opt) + '</span>' : ''),
      tabs: [
        { label: 'Simple', html: '<p>' + rich(p.s) + '</p>' + (p.nomodel ? '' : snapFig(p.id === 'MC-STR-3000' ? [] : [p.id])) + (p.nomodel ? '<p class="notice">This item is in the parts list but not in the 3D model. Labels, grease and software are typical examples.</p>' : '') +
          '<p><button type="button" class="btn ghost" data-show3d="' + p.id + '">Show it on the 3D stretcher</button></p>' },
        { label: 'Expert', html: '<p>' + rich(p.x) + '</p><dl class="kv">' +
          '<dt>Number</dt><dd class="mono">' + p.id + '</dd>' +
          '<dt>Revision / state</dt><dd>' + p.rev + ' · ' + esc(p.state) + '</dd>' +
          '<dt>' + rich('[[make-buy]]') + '</dt><dd>' + esc(p.mb) + '</dd>' +
          '<dt>Material</dt><dd>' + esc(p.mat) + '</dd>' +
          '<dt>Supplier(s)</dt><dd>' + esc(p.sup) + '</dd>' +
          '<dt>Lead time</dt><dd>' + esc(p.lead) + '</dd>' +
          '<dt>Cost (sample)</dt><dd>' + esc(p.cost) + '</dd>' +
          '<dt>Criticality</dt><dd>' + esc(p.crit) + '</dd>' +
          '<dt>Quantity</dt><dd>' + p.qty + (parent ? ' per ' + parent.id : '') + '</dd></dl>' },
        { label: 'In the BOM', html:
          '<dl class="kv"><dt>Used in</dt><dd>' + (parent ? rich('[[p:' + parent.id + ']]') + ' ' + esc(parent.name) : 'Top level: this is the finished device') + '</dd>' +
          '<dt>Contains</dt><dd>' + (kids.length ? kids.map(function (c) { return rich('[[p:' + c.id + ']]') + ' ' + esc(c.name); }).join('<br>') : 'No lower-level parts listed') + '</dd></dl>' + altHtml +
          '<p><button type="button" class="btn" data-trace-pick="' + p.id + '">Follow this part\'s journey</button></p>' },
        { label: 'Related', html:
          (p.rel ? '<h3>Connected terms</h3><div class="rel">' + p.rel.map(function (r) { return termBtn(r); }).join('') + '</div>' : '') +
          (used.length ? '<h3>Appears in stages</h3><div class="rel">' + stageChips(used) + '</div>' : '') }
      ]
    });
    if (window.Stretcher3D) window.Stretcher3D.select(p.id);
  }

  function openLane(id, focusStage) {
    var l = MD.lanes.filter(function (x) { return x.id === id; })[0]; if (!l) return;
    var t = MD.terms[l.term];
    var rows = l.cells.map(function (c, i) {
      return '<tr' + (i + 1 === focusStage ? ' style="background:var(--soft)"' : '') + '><td><a href="#stage-' + (i + 1) + '" data-close="1">' + (i + 1) + ' · ' + esc(MD.stages[i].short) + '</a></td><td>' + rich(c) + '</td></tr>';
    }).join('');
    openDrawer({
      kicker: 'Parallel lane', title: l.name,
      sub: 'Runs alongside all 10 stages. ' + (t ? esc(t.tip) : ''),
      tabs: [
        { label: 'Stage by stage', html: '<div class="table-scroll"><table><thead><tr><th>Stage</th><th>What happens in this lane</th></tr></thead><tbody>' + rows + '</tbody></table></div>' },
        { label: 'Related', html: '<div class="rel">' + termBtn(l.term) + '</div>' }
      ]
    });
  }

  /* ---------------- HOME: welcome ---------------- */
  function renderWelcome() {
    var p = MD.product;
    $('#welcome').innerHTML =
      '<div><div class="kicker">Start here · 30-second explanation</div>' +
      '<h1>How a hospital stretcher gets from an idea to a patient</h1>' +
      '<p class="lead">A medical device is more than metal and wheels. Before the ' + esc(p.name) + ' stretcher reaches a ward, it is designed in 3D, turned into an official parts list, checked and signed off, planned for the factory, bought, built, tested, labelled with a unique code and shipped. After that it is serviced for years, and every problem reported from a hospital flows back to improve the design.</p>' +
      '<p class="lead">' + (state.level === 'expert'
        ? rich('This site follows one product through [[creo]], [[windchill]] 13, [[sap]] and [[mes]] under [[qmsr]], [[iso13485]], [[iso14971]] and [[eumdr]], with sample objects, states, records and audit evidence at each step.')
        : 'This site follows one stretcher through all 10 stages. Every underlined word explains itself: hover for one line, click for the full story.') + '</p>' +
      '<p class="lead">' + esc(MD.kitchen.intro) + ' <a href="#kitchen">See the restaurant picture</a>.</p>' +
      '<div class="w-actions"><button type="button" class="btn" data-play>▶ Play the journey</button><a class="btn ghost" href="#story">Read ' + esc(MD.story.name) + '\'s story</a><button type="button" class="btn ghost" data-go-stage="1">Begin at stage 1</button><a class="btn ghost" href="#trace">Follow a part</a><a class="btn ghost" href="#glossary">Open the glossary</a></div></div>' +
      '<div class="how"><h3>How to use this page</h3><ol>' +
      '<li><span><b>Pick a stage</b> on the journey map. The 3D stretcher changes its look to match: sketch, CAD model, managed in Windchill, built, packed, in use.</span></li>' +
      '<li><span><b>Hover or click anything underlined</b>, such as ' + rich('[[udi]] or [[ebom]]') + ', and any part of the 3D model.</span></li>' +
      '<li><span><b>Switch Simple / Expert</b> at the top to change how deep every text goes.</span></li>' +
      '</ol><p class="tnote">Company, people, suppliers and all numbers are invented for training.</p></div>';
  }

  /* ---------------- HOME: journey map ---------------- */
  function renderMap() {
    var N = MD.stages.length, pts = [], H = 180;
    for (var i = 0; i < N; i++) pts.push([50 + 100 * i, i % 2 === 0 ? 39 : 95]);
    function pathTo(n) {
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var k = 1; k < n; k++) { var a = pts[k - 1], b = pts[k]; d += ' C' + (a[0] + 50) + ' ' + a[1] + ' ' + (b[0] - 50) + ' ' + b[1] + ' ' + b[0] + ' ' + b[1]; }
      return d;
    }
    var h = '<svg class="map-path" viewBox="0 0 1000 ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="mapGrad" x1="0" x2="1" y1="0" y2="0">' + MD.stages.map(function (s, i) { return '<stop offset="' + (i / (N - 1)) + '" stop-color="var(--s' + s.n + ')"/>'; }).join('') + '</linearGradient></defs><path class="base" d="' + pathTo(N) + '"/><path class="done" d="' + pathTo(state.stage) + '"/><path class="flow" d="' + pathTo(N) + '"/></svg>';
    h += '<div class="map-corner">Meanwhile, 5 teams work alongside ↓</div>';
    MD.stages.forEach(function (s, i) {
      var cls = 'node' + (s.n === state.stage ? ' on' : (s.n < state.stage ? ' passed' : '')) + (state.role && !roleInStage(state.role, s) ? ' dim' : '');
      h += '<div class="node-cell ' + (i % 2 === 0 ? 'up' : 'down') + '" style="--c:var(--s' + s.n + ')"><button type="button" class="' + cls + '" data-stage-sel="' + s.n + '" aria-pressed="' + (s.n === state.stage) + '" data-tip="' + esc(lv(s.tagline)) + '">' +
        '<span class="node-ic">' + icon(s.n) + '<span class="node-n">' + s.n + '</span></span>' +
        '<span class="node-name">' + esc(s.short) + '</span></button></div>';
    });
    MD.lanes.forEach(function (l, li) {
      var lc = ' style="--c:var(--s' + [7, 2, 10, 4, 6][li % 5] + ')"';
      h += '<button type="button"' + lc + ' class="lane-name" data-lane="' + l.id + '" data-tip="' + esc((MD.terms[l.term] || {}).tip || '') + '"><i class="lane-ic">' + laneIcon(l.id) + '</i><span class="lane-t"><span>' + esc((MD.laneInfo[l.id] || {}).plain || l.name) + '</span><small>' + esc(l.name) + '</small></span></button>';
      l.cells.forEach(function (c, i) {
        h += '<button type="button"' + lc + ' class="lane-cell' + (i + 1 === state.stage ? ' on' : '') + '" data-lane="' + l.id + '" data-lane-stage="' + (i + 1) + '" data-tip="' + esc(c) + '" aria-label="' + esc(l.name + ', stage ' + (i + 1) + ': ' + c) + '"><em>' + esc(((MD.laneInfo[l.id] || {}).short || [])[i] || '') + '</em></button>';
      });
    });
    $('#map').innerHTML = h;
  }

  /* ---------------- HOME: stage panel ---------------- */
  function sysChip(id) {
    var s = MD.systems.filter(function (x) { return x.id === id; })[0];
    return '<button type="button" class="chip" data-term="' + s.term + '" data-tip="' + esc((MD.terms[s.term] || {}).tip || s.sub) + '">' + esc(s.name) + '</button>';
  }
  function renderStagePanel() {
    var s = MD.stages[state.stage - 1];
    var h = '<div><div class="kicker">Stage ' + s.n + ' of ' + MD.stages.length + '</div><h2>' + esc(s.name) + '</h2></div>' +
      '<p class="tag">' + rich(lv(s.tagline)) + '</p><p>' + rich(lv(s.purpose)) + '</p>' + kitchenNote(MD.kitchen.stages[s.n - 1]) +
      roleTasksHtml(s) + '<div class="sp-sec"><h3>Systems involved</h3><div class="sys-row">' + s.sys.map(sysChip).join('') + '</div></div>' +
      '<div class="w-actions"><a class="btn" href="#stage-' + s.n + '">Open the stage ' + s.n + ' page</a>' +
      (s.n < MD.stages.length ? '<button type="button" class="btn ghost" data-stage-sel="' + (s.n + 1) + '">Next stage →</button>' : '') + '</div>' +
      '';
    $('#stagePanel').innerHTML = h; $('#stagePanel').style.setProperty('--c', 'var(--s' + s.n + ')');
  }

  /* ---------------- HOME: data packets between systems ---------------- */
  var pk = { raf: 0, items: [] };
  function renderPackets() {
    var W = 1000, sx = {}, n = MD.systems.length;
    MD.systems.forEach(function (s, i) { sx[s.id] = 90 + i * ((W - 180) / (n - 1)); });
    var flows = MD.flows.filter(function (f) { return f.st.indexOf(state.stage) >= 0; });
    var nf = flows.length, rowH = 22, labelZone = nf * rowH + 8, maxLift = 44 + (nf - 1) * 20;
    var y = labelZone + maxLift * 0.75 + 34, Hh = y + 40;   // y = top edge + 22 of the system boxes
    var active = {}; flows.forEach(function (f) { active[f.from] = active[f.to] = 1; });
    var svg = '<svg viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Data flow between systems for stage ' + state.stage + '">';
    flows.forEach(function (f, i) {
      // each packet gets its own arc height and its own label row, so labels never collide
      var a = sx[f.from], b = sx[f.to], lift = 44 + i * 20, mid = Math.max(190, Math.min(W - 190, (a + b) / 2));
      var d = 'M' + a + ' ' + (y - 22) + ' Q' + (a + b) / 2 + ' ' + (y - 22 - lift * 1.500) + ' ' + b + ' ' + (y - 22);
      svg += '<path class="pk-arc" id="pkp' + i + '" d="' + d + '"/>' +
        '<text class="pk-lbl" x="' + mid + '" y="' + (16 + i * rowH) + '">' + (i + 1) + ' · ' + esc(f.label) + '</text>' +
        '<g id="pkd' + i + '" transform="translate(' + a + ' ' + (y - 22) + ')"><circle class="pk-dot" r="10"/><text class="pk-num" y="4">' + (i + 1) + '</text></g>';
    });
    MD.systems.forEach(function (s) {
      svg += '<g class="pk-node' + (active[s.id] ? ' on' : '') + '" data-term="' + s.term + '" tabindex="0" role="button" aria-label="' + esc(s.name + ', ' + s.sub) + '">' +
        '<rect x="' + (sx[s.id] - 66) + '" y="' + (y - 22) + '" width="132" height="46" rx="10"/>' +
        '<text x="' + sx[s.id] + '" y="' + (y - 3) + '">' + esc(s.name) + '</text><text class="sub" x="' + sx[s.id] + '" y="' + (y + 14) + '">' + esc(s.sub) + '</text></g>';
    });
    svg += '</svg>';
    $('#packets').innerHTML = svg;
    var name = function (id) { return MD.systems.filter(function (x) { return x.id === id; })[0].name; };
    $('#pkHint').textContent = 'Stage ' + state.stage + ' · ' + MD.stages[state.stage - 1].short;
    $('#pkList').innerHTML = flows.map(function (f, i) { return '<li><span class="arrow">' + (i + 1) + ' · ' + esc(name(f.from)) + ' → ' + esc(name(f.to)) + '</span><span>' + esc(f.label) + '</span></li>'; }).join('');
    pk.items = flows.map(function (f, i) { var p = $('#pkp' + i); return { path: p, dot: $('#pkd' + i), len: p.getTotalLength(), off: i * 0.350 }; });
    if (reduced) pk.items.forEach(function (it) { var pt = it.path.getPointAtLength(it.len * 0.500); it.dot.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')'); });
  }
  function tickPackets(ts) {
    pk.raf = requestAnimationFrame(tickPackets);
    if (reduced || state.route !== 'home') return;
    pk.items.forEach(function (it) {
      var t = ((ts / 2600) + it.off) % 1, e = t < 0.500 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var pt = it.path.getPointAtLength(it.len * e);
      it.dot.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
      it.dot.setAttribute('opacity', t > 0.920 ? (1 - t) / 0.080 : 1);
    });
  }

  /* ---------------- HOME: viewer controls ---------------- */
  function renderViewerControls() {
    $('#modes').innerHTML = MD.modes.map(function (m) {
      return '<button type="button" class="chip" data-mode="' + m.id + '" aria-pressed="false" data-tip="' + esc(m.tip) + '">' + esc(m.name) + '</button>';
    }).join('');
    $('#partChips').innerHTML = prodParts().map(function (p) {
      return '<button type="button" class="chip' + (p.opt ? ' opt' : '') + '" data-part="' + p.id + '" data-hl="' + p.id + '" data-tip="' + esc(p.id + ' — ' + p.s) + '">' + esc(p.name) + '</button>';
    }).join('');
  }
  function setMode(id) {
    var m = MD.modes.filter(function (x) { return x.id === id; })[0]; if (!m) return;
    $$('#modes .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === id ? 'true' : 'false'); });
    $('#modeBadge').textContent = modeText(m);
    if (window.Stretcher3D) window.Stretcher3D.setMode(id);
  }
  function selectStage(n, scroll) {
    state.stage = Math.max(1, Math.min(MD.stages.length, n));
    renderMap(); renderLaneNow(); renderStagePanel(); renderPackets();
    setMode(MD.stages[state.stage - 1].mode);
    if (scroll) { var el = $('.two'); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
  }

  /* ---------------- PAGES ---------------- */
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map(function (it, i) {
      return (i ? '<span aria-hidden="true">›</span>' : '') + (it[1] ? '<a href="' + it[1] + '">' + esc(it[0]) + '</a>' : '<span aria-current="page">' + esc(it[0]) + '</span>');
    }).join('') + '</nav>';
  }
  function progress(n) {
    return '<nav class="progress" aria-label="Stage progress">' + MD.stages.map(function (s, i) {
      return (i ? '<span class="bar"></span>' : '') + '<a href="#stage-' + s.n + '" style="--c:var(--s' + s.n + ')" class="' + (s.n === n ? 'on' : (s.n < n ? 'passed' : '')) + '" data-tip="' + esc(s.n + ' · ' + s.name) + '"' + (s.n === n ? ' aria-current="step"' : '') + '>' + s.n + '</a>';
    }).join('') + '</nav>';
  }
  function raciTable(r) {
    var h = '<div class="table-scroll"><table class="raci"><thead><tr><th scope="col">Activity</th>' +
      r.roles.map(function (id) { return '<th scope="col"' + (id === state.role ? ' class="me"' : '') + ' data-tip="' + esc(roleById[id].name + ' — ' + roleById[id].tip) + '">' + id + '</th>'; }).join('') + '</tr></thead><tbody>';
    r.rows.forEach(function (row) {
      var map = {}; row[1].split(' ').forEach(function (kv) { var a = kv.split(':'); map[a[0]] = a[1]; });
      h += '<tr' + (state.role && r.roles.indexOf(state.role) >= 0 && !map[state.role] ? ' class="dimrow"' : '') + '><td>' + esc(row[0]) + (row[2] ? ' <span class="sig" data-tip="Approval needs a 21 CFR Part 11 electronic signature.">✍ e-signature</span>' : '') + '</td>' +
        r.roles.map(function (id) { return '<td class="c ' + (map[id] || '') + (id === state.role ? ' me' : '') + '">' + (map[id] || '·') + '</td>'; }).join('') + '</tr>';
    });
    h += '</tbody></table></div><p class="legend"><span><b>R</b> does the work</span><span><b>A</b> final approval</span><span><b>C</b> consulted</span><span><b>I</b> informed</span><span>' +
      r.roles.map(function (id) { return id + ' = ' + roleById[id].name; }).join(' · ') + '</span></p>';
    return h;
  }
  function list(arr) { return '<ul class="bul">' + arr.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>'; }

  function renderStagePage(n) {
    var s = MD.stages[n - 1], name = function (id) { return MD.systems.filter(function (x) { return x.id === id; })[0].name; };
    var flows = MD.flows.filter(function (f) { return f.st.indexOf(n) >= 0; });
    var h = crumbs([['Journey', '#home'], ['Stage ' + n + ' · ' + s.name]]) + progress(n) +
      '<header class="page-head" style="--c:var(--s' + n + ')"><div class="kicker">Stage ' + n + ' of ' + MD.stages.length + ' · ' + (state.level === 'expert' ? 'Expert view' : 'Simple view') + '</div><h1>' + esc(s.name) + '</h1><p class="tag">' + rich(lv(s.tagline)) + '</p>' +
      '<div class="w-actions"><button type="button" class="btn ghost" data-go-stage="' + n + '">See the stretcher at this stage</button></div></header>';
    h += '<section class="sec"><h2>Purpose</h2><p class="prose">' + rich(lv(s.purpose)) + '</p>' + kitchenNote(MD.kitchen.stages[n - 1]) + '</section>';
    if (!s.full) {
      h += '<section class="sec"><p class="notice">This stage shows its summary now. The full page with sample tables, Windchill objects, RACI, compliance evidence, pitfalls and best practices arrives in Phase 2.</p></section>';
    } else {
      h += '<section class="sec"><h2>What happens to our stretcher</h2>' + list(lv(s.happens)) + '</section>';
      if (s.mini) h += '<section class="sec">' + miniHtml(s.mini) + '</section>';
      h += '<section class="sec"><h2>Windchill objects and lifecycle states</h2>' + table({ cols: ['What', 'Windchill object', 'States and notes'], rows: s.objects }) + '</section>';
      h += '<section class="sec"><h2>Sample data</h2>' + s.tables.map(function (t) { return table(t); }).join('') + '</section>';
      h += '<div class="cols2"><section class="sec"><h2>Quality system processes involved</h2>' + list(s.qms) + '</section>' +
        '<section class="sec"><h2>Data flow between systems</h2>' + (flows.length ? '<ul class="pk-list">' + flows.map(function (f) { return '<li><span class="arrow">' + esc(name(f.from)) + ' → ' + esc(name(f.to)) + '</span><span>' + esc(f.label) + '</span></li>'; }).join('') + '</ul>' : '<p>No system-to-system transfer at this stage.</p>') +
        '<p class="tnote">' + rich('Nothing reaches [[sap]] or [[mes]] before release. Until then, data stays inside [[windchill]].') + '</p></section></div>';
      h += '<section class="sec"><h2>' + rich('Who does what ([[raci]])') + '</h2>' + raciTable(s.raci) + '</section>';
      h += '<section class="sec"><h2>Compliance evidence an auditor asks for</h2>' + list(s.evidence) + '</section>';
      h += '<div class="cols2"><section class="sec"><h2>Pitfalls seen in real projects</h2>' + list(s.pitfalls) + '</section><section class="sec"><h2>Best practices</h2>' + list(s.best) + '</section></div>';
    }
    h += '<nav class="page-nav" aria-label="Previous and next stage">' +
      (n > 1 ? '<a class="btn ghost" href="#stage-' + (n - 1) + '">← Stage ' + (n - 1) + ' · ' + esc(MD.stages[n - 2].short) + '</a>' : '<span></span>') +
      (n < MD.stages.length ? '<a class="btn" href="#stage-' + (n + 1) + '">Stage ' + (n + 1) + ' · ' + esc(MD.stages[n].short) + ' →</a>' : '<a class="btn" href="#home">Back to the journey</a>') + '</nav>';
    return h;
  }

  function renderPartsPage() {
    var h = crumbs([['Journey', '#home'], ['Parts & BOM']]) +
      '<header class="page-head"><div class="kicker">Engineering BOM · Design view</div><h1>Parts of the ' + esc(MD.product.name) + '</h1>' +
      '<p class="tag">' + rich(state.level === 'expert'
        ? 'The released [[ebom]] of [[p:MC-STR-3000]] at revision A. Select a row for attributes, [[alternate]] and [[substitute]] parts.'
        : 'Everything the stretcher is made of. Select a row to see what the part does and where it comes from.') + '</p></header>';
    h += '<section class="sec"><div class="table-scroll"><table><thead><tr><th>Number</th><th>Name</th><th>Qty</th><th>Rev</th><th>Make / Buy</th><th>Material</th><th>Supplier (invented)</th><th>Criticality</th><th>Lead time</th><th>Journey</th></tr></thead><tbody>' +
      MD.parts.map(function (p) {
        return '<tr class="rowbtn" data-part="' + p.id + '"><td class="mono ind' + p.lvl + '"><button type="button" class="term plink" data-part="' + p.id + '">' + p.id + '</button></td><td>' + esc(p.name) + (p.opt ? ' <span class="pill">' + esc(p.opt) + '</span>' : '') + '</td><td>' + p.qty + '</td><td>' + p.rev + '</td><td>' + esc(p.mb) + '</td><td>' + esc(p.mat) + '</td><td>' + esc(p.sup) + '</td><td>' + critPill(p.crit) + '</td><td>' + esc(p.lead) + '</td><td><button type="button" class="chip" data-trace-pick="' + p.id + '">Follow</button></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="tnote">Indented rows belong to the assembly above them. Costs and lead times are sample values.</p></section>';
    h += '<section class="sec"><h2>Product variants</h2>' + table({ cols: ['Variant', 'Name', 'What is different'], rows: MD.product.variants.map(function (v) { return [v.code, v.name, v.note]; }) }) +
      '<p class="tnote">' + rich('Variants are generated from one [[configurable-module]] with [[option-variant]]. See [[s:3]].') + '</p></section>';
    return h;
  }

  function renderGlossaryPage() {
    var ids = Object.keys(MD.terms).sort(function (a, b) { return MD.terms[a].n.toLowerCase() < MD.terms[b].n.toLowerCase() ? -1 : 1; });
    var h = crumbs([['Journey', '#home'], ['Glossary']]) +
      '<header class="page-head"><div class="kicker">' + ids.length + ' terms and growing</div><h1>Glossary</h1><p class="tag">Every term used on this site. Hover for one line; select for Simple, Expert, an example from our stretcher, and related terms.</p></header>' +
      '<div class="g-tools"><label class="sr" for="gq">Filter terms</label><input id="gq" type="search" placeholder="Filter, e.g. BOM, signature, supplier" value="' + esc(state.gq) + '" autocomplete="off"><div class="az" id="az"></div></div><div id="gList" style="display:flex;flex-direction:column;gap:18px"></div>';
    return h;
  }
  function fillGlossary() {
    var q = state.gq.trim().toLowerCase();
    var ids = Object.keys(MD.terms).filter(function (id) {
      var t = MD.terms[id]; return !q || (t.n + ' ' + t.tip + ' ' + t.cat + ' ' + id).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return MD.terms[a].n.toLowerCase() < MD.terms[b].n.toLowerCase() ? -1 : 1; });
    var groups = {};
    ids.forEach(function (id) { var L = MD.terms[id].n.charAt(0).toUpperCase(); if (/[0-9]/.test(L)) L = '#'; (groups[L] = groups[L] || []).push(id); });
    var letters = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    $('#az').innerHTML = letters.map(function (L) { return groups[L] ? '<a href="#" data-letter="' + L + '">' + L + '</a>' : '<span>' + L + '</span>'; }).join('');
    $('#gList').innerHTML = ids.length ? letters.filter(function (L) { return groups[L]; }).map(function (L) {
      return '<section><h2 class="g-letter" id="gl-' + (L === '#' ? 'num' : L) + '">' + L + '</h2><div class="g-grid" style="margin-top:10px">' + groups[L].map(function (id) {
        var t = MD.terms[id];
        return '<button type="button" class="g-item" data-term="' + id + '"><span class="cat">' + esc(t.cat) + '</span><b>' + esc(t.n) + '</b><small>' + esc(t.tip) + '</small></button>';
      }).join('') + '</div></section>';
    }).join('') : '<p class="notice">No term matches "' + esc(state.gq) + '". Try a shorter word.</p>';
  }

  /* ---------------- MINI-FLOWS (procurement, service) ---------------- */
  var miniState = {};
  function miniHtml(id) {
    var f = MD.miniFlows[id];
    return '<div class="mini" data-mini="' + id + '"><div class="card-h"><h3>' + esc(f.title) + '</h3>' +
      '<button type="button" class="chip" data-mini-play aria-label="Pause or play this animation">Pause</button></div>' +
      '<ol class="mini-steps">' + f.steps.map(function (s, i) {
        return '<li><button type="button" data-mini-step="' + i + '"><b>' + (i + 1) + '</b><span>' + esc(s.l) + '</span><small>' + esc(s.sys) + '</small></button></li>';
      }).join('') + '</ol><div class="mini-cap"></div></div>';
  }
  function miniShow(el) {
    var id = el.getAttribute('data-mini'), f = MD.miniFlows[id];
    var st = miniState[id] || (miniState[id] = { i: 0, play: !reduced });
    $$('.mini-steps li', el).forEach(function (li, k) { li.className = k === st.i ? 'on' : (k < st.i ? 'done' : ''); });
    var s = f.steps[st.i];
    $('.mini-cap', el).innerHTML = '<p><b>Step ' + (st.i + 1) + ' of ' + f.steps.length + ' · ' + esc(s.l) + '.</b> ' + rich(s.t) + '</p><p class="rec"><span>Sample record</span>' + esc(s.r) + '</p>';
    $('[data-mini-play]', el).textContent = st.play ? 'Pause' : 'Play';
  }
  function initMinis() { $$('.mini').forEach(miniShow); }
  setInterval(function () {
    $$('.mini').forEach(function (el) {
      if (el.offsetParent === null) return;
      var st = miniState[el.getAttribute('data-mini')]; if (!st || !st.play) return;
      st.i = (st.i + 1) % MD.miniFlows[el.getAttribute('data-mini')].steps.length; miniShow(el);
    });
  }, 2800);

  /* ---------------- TRACER: follow one part through its digital thread ---------------- */
  var trace = { part: store.get('md-trace', 'MC-CST-6000'), timer: 0 };
  function threadSteps(p) {
    var th = MD.threads[p.id] || {}, buy = p.mb === 'Buy', idx = MD.parts.indexOf(p), parent = null;
    for (var i = idx - 1; i >= 0; i--) { if (MD.parts[i].lvl < p.lvl) { parent = MD.parts[i]; break; } }
    var isAsm = idx + 1 < MD.parts.length && MD.parts[idx + 1].lvl > p.lvl || /assembly|weldment|frame|module/i.test(p.name);
    var amlHtml = Array.isArray(th.aml)
      ? '<div class="table-scroll"><table><thead><tr><th>Manufacturer part</th><th>Manufacturer</th><th>AML preference</th></tr></thead><tbody>' +
        th.aml.map(function (a) { return '<tr><td class="mono">' + esc(a[0]) + '</td><td>' + esc(a[1]) + '</td><td>' + esc(a[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
        (th.avl ? '<p>' + rich('[[avl|Approved vendors]] for Plant 1000: ') + esc(th.avl) + '.</p>' : '')
      : '<p>' + esc(th.aml || 'Made in-house: no manufacturer list needed.') + '</p>';
    return [
      { st: 1, k: 'User need', term: 'user-need', t: th.un },
      { st: 1, k: 'Design input', term: 'design-input', t: th.di },
      { st: 1, k: 'Hazard', term: 'hazard', t: th.haz },
      { st: 2, k: 'Risk control', term: 'risk-control', t: th.rc },
      { st: 2, k: 'Creo model and drawing', term: 'cad-document', t: p.nomodel ? 'No 3D model: label artwork ART-LBL-9000 is the controlled design output, revision ' + p.rev + ', Released.' : p.id + (isAsm ? '.asm' : '.prt') + ' and ' + p.id + '.drw, revision ' + p.rev + ', Released.' },
      { st: 3, k: 'WTPart in the EBOM', term: 'wtpart', t: p.id + ', revision ' + p.rev + ', ' + p.state + (th.find ? ' · find number ' + th.find : '') + ' · quantity ' + p.qty + (parent ? ' in ' + parent.id : ' (top level)') + '.' },
      { st: 4, k: 'Verification test', term: 'verification', t: th.vt },
      { st: 5, k: 'MBOM line, operation and bench', term: 'mbom', t: th.mb },
      { st: 6, k: 'SAP material', term: 'material-master', t: 'Material ' + p.id + ' · plant 1000 · procurement type ' + (buy ? 'F (bought)' : 'E (made in-house)') + ' · revision level ' + p.rev + (/critical|related|contact/i.test(p.crit) ? ' · quality inspection active' : '') + '.' },
      { st: 5, k: 'Manufacturer and vendor parts (AML / AVL)', term: 'aml', html: amlHtml },
      { st: 7, k: buy ? 'Purchase order and supplier' : 'Production order', term: buy ? 'po' : 'production-order', t: th.po },
      { st: 7, k: buy ? 'Incoming inspection' : 'In-process inspection', term: 'inspection-lot', t: th.insp },
      { st: 7, k: 'Production lot / serial in the DHR', term: 'dhr', t: th.lot },
      { st: 8, k: 'UDI', term: 'udi', t: 'Built into a stretcher labelled ' + MD.product.udiSample + '. The stretcher serial leads back to this part\'s lot through the DHR.' },
      { st: 9, k: 'Service part / spare kit', term: 'service-part', t: th.svc },
      { st: 10, k: 'Complaints and CAPA history', term: 'capa', t: th.hist }
    ];
  }
  function renderTracePage() {
    var p = partById[trace.part] || partById['MC-CST-6000'], th = MD.threads[p.id] || {}, steps = threadSteps(p);
    var h = crumbs([['Journey', '#home'], ['Follow a part']]) +
      '<header class="page-head" style="--c:var(--s7)"><div class="kicker">Digital thread</div><h1>Follow one part through its whole journey</h1>' +
      '<p class="tag">' + rich(state.level === 'expert'
        ? 'Pick a part. The thread shows its [[traceability]] chain: requirement, risk, design, test, manufacturing, sourcing, production record, [[udi]], service and feedback.'
        : 'Pick a part. See where it came from, why it exists, who makes it, how it is checked, and what happened to it later.') + '</p></header>';
    h += '<section class="sec"><h2>Choose a part</h2><div class="chips">' + MD.parts.map(function (x) {
      return '<button type="button" class="chip' + (x.opt ? ' opt' : '') + '" data-trace-pick="' + x.id + '" aria-pressed="' + (x.id === p.id) + '" data-tip="' + esc(x.id) + '">' + esc(x.name) + '</button>';
    }).join('') + '</div></section>';
    h += '<div class="trace-grid"><section class="sec trace-sum"><div><div class="kicker">' + p.id + '</div><h2 style="font-size:1.3rem">' + esc(p.name) + '</h2></div>' +
      (p.nomodel ? '' : snapFig(p.id === 'MC-STR-3000' ? [] : [p.id])) +
      '<p>' + rich(lv({ s: p.s, x: p.x })) + '</p><dl class="kv">' +
      '<dt>Revision / state</dt><dd>' + p.rev + ' · ' + esc(p.state) + '</dd>' +
      '<dt>Material</dt><dd>' + esc(p.mat) + '</dd>' +
      '<dt>' + rich('[[make-buy]]') + '</dt><dd>' + esc(p.mb) + '</dd>' +
      '<dt>Supplier(s)</dt><dd>' + esc(p.sup) + '</dd>' +
      '<dt>' + rich('[[aml|Approved manufacturers]]') + '</dt><dd>' + (Array.isArray(th.aml) ? th.aml.map(function (a) { return esc(a[1] + ' ' + a[0] + ' (' + a[2] + ')'); }).join('<br>') : esc(th.aml || '—')) + '</dd>' +
      '<dt>' + rich('[[alternate|Alternate parts]]') + '</dt><dd>' + (p.alt ? p.alt.map(function (a) { return '<span class="mono">' + a.id + '</span> ' + esc(a.name); }).join('<br>') : 'None') + '</dd>' +
      '<dt>' + rich('[[substitute|Substitute parts]]') + '</dt><dd>' + (p.sub ? p.sub.map(function (a) { return '<span class="mono">' + a.id + '</span> ' + esc(a.name) + ' (only in ' + p.id + ')'; }).join('<br>') : 'None') + '</dd>' +
      '<dt>Lead time</dt><dd>' + esc(p.lead) + '</dd><dt>Cost (sample)</dt><dd>' + esc(p.cost) + '</dd>' +
      '<dt>Criticality</dt><dd>' + critPill(p.crit) + '</dd>' +
      '<dt>' + rich('[[material-compliance|Compliance]]') + '</dt><dd>' + esc(th.comp || '—') + '</dd></dl>' +
      '<div class="diff"><div><b>Alternate</b>Interchangeable everywhere the part is used.</div><div><b>Substitute</b>Allowed only in one named assembly.</div></div>' +
      '<p><button type="button" class="btn ghost" data-show3d="' + p.id + '">Show it on the 3D stretcher</button></p></section>';
    h += '<section class="sec"><div class="card-h"><h2>Its digital thread</h2><button type="button" class="chip" data-trace-replay>Replay</button></div>' +
      '<div class="map-scroll"><div class="trace-rail" id="traceRail">' + MD.stages.map(function (s) {
        return '<a href="#stage-' + s.n + '" class="trace-node" data-rail="' + s.n + '" style="--c:var(--s' + s.n + ')" data-tip="' + esc(s.n + ' · ' + s.name) + '">' + icon(s.n) + '<span>' + esc(s.short) + '</span></a>';
      }).join('') + '</div></div><ol class="thread" id="thread">' + steps.map(function (s, i) {
        return '<li style="--c:var(--s' + s.st + ')" data-st="' + s.st + '"><span class="th-n">' + (i + 1) + '</span><div><h3>' + rich('[[' + s.term + '|' + s.k + ']]') + ' <a class="th-stage" href="#stage-' + s.st + '">Stage ' + s.st + ' · ' + esc(MD.stages[s.st - 1].short) + '</a></h3>' +
          (s.html || '<p>' + esc(s.t || 'No record for this part.') + '</p>') + '</div></li>';
      }).join('') + '</ol></section></div>';
    return h;
  }
  function playTrace() {
    clearInterval(trace.timer);
    var items = $$('#thread li'), rail = $$('#traceRail .trace-node'), i = 0;
    function light(n) {
      items.forEach(function (li, k) { li.classList.toggle('lit', k < n); });
      var seen = {}; items.slice(0, n).forEach(function (li) { seen[li.getAttribute('data-st')] = 1; });
      rail.forEach(function (a) { a.classList.toggle('lit', !!seen[a.getAttribute('data-rail')]); a.classList.toggle('now', n > 0 && n <= items.length && items[n - 1].getAttribute('data-st') === a.getAttribute('data-rail')); });
    }
    if (reduced) { light(items.length); return; }
    light(0);
    trace.timer = setInterval(function () { i++; light(i); if (i >= items.length) clearInterval(trace.timer); }, 320);
  }

  /* =====================================================================
     PHASE 3
     ===================================================================== */

  /* ---------------- lanes made easy: icons + "what the 5 teams do now" cards ---------------- */
  var LANE_ICON = {
    projectlink: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.300 2.700-6 6-6s6 2.700 6 6M17 11a3 3 0 1 0 0-6M21 20c0-2.800-1.700-5-4-5.700"/>',
    suma: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    risk: '<path d="M12 3l10 18H2L12 3zM12 10v5M12 18v.500"/>',
    quality: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    regulatory: '<path d="M6 3h9l4 4v14H6zM15 3v4h4M9 14l2 2 4-4"/>'
  };
  function laneIcon(id) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (LANE_ICON[id] || '') + '</svg>'; }
  function renderLaneNow() {
    var box = $('#laneNow'); if (!box) return;
    var s = MD.stages[state.stage - 1];
    box.innerHTML = '<h3>At stage ' + s.n + ' · ' + esc(s.short) + ', the 5 teams are doing this</h3><div class="lane-cards">' +
      MD.lanes.map(function (l, li) {
        var info = MD.laneInfo[l.id] || {};
        return '<button type="button" class="lane-card" data-lane="' + l.id + '" data-lane-stage="' + s.n + '" style="--c:var(--s' + [7, 2, 10, 4, 6][li % 5] + ')">' +
          '<span class="lc-head"><i class="lane-ic">' + laneIcon(l.id) + '</i><span><b>' + esc(info.plain || l.name) + '</b><small>' + esc(l.name) + '</small></span></span>' +
          '<span class="lc-now">' + esc(l.cells[s.n - 1]) + '</span>' +
          '<span class="lc-what">' + esc(info.what || '') + ' ' + esc(MD.kitchen.lanes[l.id] ? 'In the restaurant: ' + MD.kitchen.lanes[l.id] : (info.like || '')) + '</span></button>';
      }).join('') + '</div>';
  }

  /* ---------------- role filter ---------------- */
  function roleLetter(roleId, row) {
    var m = new RegExp('(?:^| )' + roleId + ':([RACI])').exec(row[1]); return m ? m[1] : '';
  }
  function roleInStage(roleId, s) { return !!(s.raci && s.raci.rows.some(function (r) { return roleLetter(roleId, r); })); }
  function roleTasks(roleId) {
    var out = [];
    MD.stages.forEach(function (s) { (s.raci ? s.raci.rows : []).forEach(function (r) { var v = roleLetter(roleId, r); if (v) out.push({ st: s.n, act: r[0], v: v, sig: !!r[2] && (v === 'R' || v === 'A') }); }); });
    return out;
  }
  var RACI_WORD = { R: 'Does the work', A: 'Final approval', C: 'Consulted', I: 'Informed' };
  function roleTasksHtml(s) {
    if (!state.role) return '';
    var list = roleTasks(state.role).filter(function (t) { return t.st === s.n; }), r = roleById[state.role];
    return '<div class="sp-sec role-box"><h3>Your tasks here as ' + esc(r.name) + '</h3>' + (list.length
      ? '<ul class="bul">' + list.map(function (t) { return '<li>' + esc(t.act) + ' <span class="pill">' + t.v + ' · ' + RACI_WORD[t.v] + '</span>' + (t.sig ? ' <span class="sig">✍ e-signature</span>' : '') + '</li>'; }).join('') + '</ul>'
      : '<p class="tnote">No direct task at this stage. You may still be informed of results.</p>') + '</div>';
  }
  function setRole(id) {
    state.role = roleById[id] ? id : ''; store.set('md-role', state.role);
    var sel = $('#roleSel'); if (sel) sel.value = state.role;
    var y = window.scrollY; route(); window.scrollTo(0, y);
  }
  function isHomeRoute() { var h = (location.hash || '#home').slice(1); return !/^(stage-\d+|parts|glossary|trace|capa|roles|modules|story|kitchen|boms)$/.test(h); }

  /* ---------------- ROLES page ---------------- */
  function renderRolesPage() {
    var id = state.role || 'DE', r = roleById[id], info = MD.roleInfo[id] || { screens: [], deliv: [] }, tasks = roleTasks(id);
    var sigs = tasks.filter(function (t) { return t.sig; });
    var h = crumbs([['Journey', '#home'], ['Roles']]) +
      '<header class="page-head" style="--c:var(--s8)"><div class="kicker">Role view</div><h1>Who does what</h1>' +
      '<p class="tag">Pick a role to see only its tasks, approvals, screens and deliverables. The choice also highlights that role on the journey map and in every RACI table.</p></header>';
    h += '<section class="sec"><h2>Choose a role</h2><div class="chips">' + MD.roles.map(function (x) {
      return '<button type="button" class="chip" data-role-pick="' + x.id + '" aria-pressed="' + (x.id === state.role) + '" data-tip="' + esc(x.tip) + '">' + esc(x.name) + '</button>';
    }).join('') + (state.role ? '<button type="button" class="chip" data-role-pick="">Show everyone</button>' : '') + '</div>' +
      (state.role ? '' : '<p class="tnote">No role chosen yet: showing the Design Engineer as an example.</p>') + '</section>';
    h += '<section class="sec"><div><div class="kicker">' + id + '</div><h2 style="font-size:1.3rem">' + esc(r.name) + '</h2></div><p class="prose">' + rich(info.what || r.tip) + '</p>' +
      '<div class="map-scroll"><div class="trace-rail">' + MD.stages.map(function (s) {
        return '<a href="#stage-' + s.n + '" class="trace-node' + (roleInStage(id, s) ? ' lit' : '') + '" style="--c:var(--s' + s.n + ')" data-tip="' + esc(s.n + ' · ' + s.name) + '">' + icon(s.n) + '<span>' + esc(s.short) + '</span></a>';
      }).join('') + '</div></div><p class="tnote">Coloured stages are where this role has a task.</p></section>';
    h += '<section class="sec"><h2>Tasks and approvals</h2><div class="table-scroll"><table><thead><tr><th>Stage</th><th>Activity</th><th>Part</th><th>Electronic signature</th></tr></thead><tbody>' +
      tasks.map(function (t) { return '<tr><td><a href="#stage-' + t.st + '">' + t.st + ' · ' + esc(MD.stages[t.st - 1].short) + '</a></td><td>' + esc(t.act) + '</td><td><span class="pill">' + t.v + ' · ' + RACI_WORD[t.v] + '</span></td><td>' + (t.sig ? '<span class="sig">✍ signs under Part 11</span>' : '—') + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="tnote">' + rich('This role gives ' + sigs.length + ' approvals that need a [[part11]] [[esign|electronic signature]]: user ID and password are entered again at the moment of signing.') + '</p></section>';
    var dayRows = MD.days[id] || [];
    if (dayRows.length) h += '<section class="sec"><h2>A day in the life of ' + esc(MD.people[id]) + ', ' + esc(r.name) + '</h2><ol class="day">' + dayRows.map(function (d) {
      return '<li><span class="day-t">' + esc(d[0]) + '</span><div><h3>' + esc(d[1]) + (d[4] ? ' <span class="sig" data-tip="Signs electronically: user ID and password are entered again.">✍ signs</span>' : '') + '</h3><p>' + esc(d[2]) + '</p><p class="tnote">Screen: ' + esc(d[3]) + '</p></div></li>';
    }).join('') + '</ol><p class="tnote">An invented but typical day. Names are made up.</p></section>';
    h += '<div class="cols2"><section class="sec"><h2>Screens this role works in</h2>' + list(info.screens) + '</section><section class="sec"><h2>What this role delivers</h2>' + list(info.deliv) + '</section></div>';
    var matrix = '<div class="table-scroll"><table class="raci"><thead><tr><th>Stage</th><th>Activity</th>' + MD.roles.map(function (x) { return '<th' + (x.id === id ? ' class="me"' : '') + ' data-tip="' + esc(x.name) + '">' + x.id + '</th>'; }).join('') + '</tr></thead><tbody>';
    MD.stages.forEach(function (s) { (s.raci ? s.raci.rows : []).forEach(function (row) {
      matrix += '<tr' + (roleLetter(id, row) ? '' : ' class="dimrow"') + '><td>' + s.n + '</td><td>' + esc(row[0]) + (row[2] ? ' <span class="sig" data-tip="Needs a Part 11 electronic signature">✍</span>' : '') + '</td>' +
        MD.roles.map(function (x) { var v = roleLetter(x.id, row); return '<td class="c ' + v + (x.id === id ? ' me' : '') + '">' + (v || '·') + '</td>'; }).join('') + '</tr>';
    }); });
    h += '<section class="sec"><h2>' + rich('Full [[raci]] table for the whole lifecycle') + '</h2>' + matrix + '</tbody></table></div>' +
      '<p class="legend"><span><b>R</b> does the work</span><span><b>A</b> final approval</span><span><b>C</b> consulted</span><span><b>I</b> informed</span><span>✍ needs an electronic signature</span><span>' + MD.roles.map(function (x) { return x.id + ' = ' + x.name; }).join(' · ') + '</span></p></section>';
    return h;
  }

  /* ---------------- MODULE MAP page ---------------- */
  var MOD_ST = { OOTB: ['Standard', 'ok', 'Available in core Windchill; still needs configuration and validation.'], 'Add-on': ['Add-on module', '', 'A separately licensed PTC module or solution.'], Config: ['Configured', 'warn', 'Built from standard objects by company-specific configuration.'], Outside: ['Outside Windchill', 'crit', 'Normally handled in another system.'] };
  function renderModulesPage() {
    return crumbs([['Journey', '#home'], ['Module map']]) +
      '<header class="page-head" style="--c:var(--s5)"><div class="kicker">QMS and medical modules</div><h1>Which system does which quality job?</h1>' +
      '<p class="tag">' + rich('Each row is one quality process. It shows where it lives in [[windchill]], which records it uses, and its counterpart in [[sap]]. Module names and licences change between releases, so most rows carry a ') + VERIFY + ' badge.</p></header>' +
      '<section class="sec"><div class="g-tools"><label class="sr" for="mq">Filter processes</label><input id="mq" type="search" placeholder="Filter, e.g. CAPA, UDI, supplier" value="' + esc(state.mq) + '" autocomplete="off"><div class="chips" id="modChips"></div></div>' +
      '<div class="table-scroll"><table><thead><tr><th>QMS process</th><th>Windchill module</th><th>Key objects</th><th>SAP counterpart</th><th>How it is delivered</th></tr></thead><tbody id="modBody"></tbody></table></div>' +
      '<p class="legend">' + Object.keys(MOD_ST).map(function (k) { return '<span><b>' + MOD_ST[k][0] + '</b>: ' + MOD_ST[k][2] + '</span>'; }).join('') + '</p></section>';
  }
  function fillModules() {
    var q = state.mq.trim().toLowerCase();
    $('#modChips').innerHTML = ['All'].concat(Object.keys(MOD_ST)).map(function (k) {
      return '<button type="button" class="chip" data-mod-filter="' + k + '" aria-pressed="' + (state.mf === k) + '">' + (k === 'All' ? 'All' : MOD_ST[k][0]) + '</button>';
    }).join('');
    var rows = MD.modules.filter(function (m) { return (state.mf === 'All' || m.st === state.mf) && (!q || (m.p + m.wc + m.obj + m.sap + m.note).toLowerCase().indexOf(q) >= 0); });
    $('#modBody').innerHTML = rows.length ? rows.map(function (m) {
      var st = MOD_ST[m.st];
      return '<tr><td><b>' + rich('[[' + m.term + '|' + m.p + ']]') + '</b></td><td>' + rich(m.wc) + '</td><td>' + rich(m.obj) + '</td><td>' + rich(m.sap) + '</td><td><span class="pill ' + st[1] + '">' + st[0] + '</span><br><span class="tnote">' + rich(m.note) + '</span></td></tr>';
    }).join('') : '<tr><td colspan="5">No process matches this filter.</td></tr>';
  }

  /* ---------------- CAPA STORY page ---------------- */
  function renderCapaPage() {
    var c = MD.capa;
    return crumbs([['Journey', '#home'], ['CAPA story']]) +
      '<header class="page-head" style="--c:var(--s10)"><div class="kicker">Closed-loop scenario · ' + c.steps.length + ' steps</div><h1>"' + esc(c.title) + '"</h1>' +
      '<p class="tag">' + (state.level === 'expert'
        ? rich('From [[complaint]] intake through [[capa]], change control and field action to closure, with the sample record created at every step.')
        : 'One real-life style story, step by step: a hospital reports a problem, and the company finds the cause, fixes the design, the factory and the stretchers already in use. Each step shows the record that proves it happened.') + '</p></header>' +
      '<div class="capa-grid"><nav class="sec capa-nav" aria-label="Steps of the story"><ol id="capaList">' + c.steps.map(function (s, i) {
        return '<li><button type="button" data-capa-step="' + i + '" style="--c:var(--s' + s.st + ')"><b>' + (i + 1) + '</b><span>' + esc(s.k) + '<small>' + esc(s.rec.id.split(' / ')[0]) + '</small></span></button></li>';
      }).join('') + '</ol></nav><section class="sec" id="capaDetail" aria-live="polite"></section></div>';
  }
  function fillCapa(focus) {
    var c = MD.capa, n = c.steps.length, i = Math.max(0, Math.min(n - 1, state.capaStep)), s = c.steps[i], r = s.rec;
    state.capaStep = i;
    $$('#capaList li').forEach(function (li, k) { li.className = k === i ? 'on' : (k < i ? 'done' : ''); });
    var h = '<div style="--c:var(--s' + s.st + ')"><div class="kicker">Step ' + (i + 1) + ' of ' + n + ' · ' + esc(r.opened) + '</div><h2 style="font-size:1.4rem">' + rich('[[' + s.term + '|' + s.k + ']]') + '</h2></div>' +
      '<div class="capa-bar" role="img" aria-label="Step ' + (i + 1) + ' of ' + n + '"><i style="width:' + ((i + 1) / n * 100) + '%"></i></div>' +
      '<p class="prose">' + rich(lv({ s: s.s, x: s.x })) + '</p>' + (state.level === 'expert' ? '' : '<p class="tnote">Switch to Expert at the top for clauses and system detail.</p>') +
      (s.parts && s.parts.length ? snapFig(s.parts) : '') +
      '<div class="record"><div class="rec-head"><div><span class="rec-type">' + esc(r.type) + '</span><b class="mono">' + esc(r.id) + '</b></div><span class="pill ok">' + esc(r.status) + '</span></div>' +
      '<dl class="kv"><dt>System</dt><dd>' + esc(r.sys) + '</dd><dt>Opened</dt><dd>' + esc(r.opened) + '</dd>' + (r.closed ? '<dt>Closed</dt><dd>' + esc(r.closed) + '</dd>' : '') + '<dt>Owner</dt><dd>' + esc(r.owner) + '</dd>' +
      r.f.map(function (kv) { return '<dt>' + esc(kv[0]) + '</dt><dd>' + esc(kv[1]) + '</dd>'; }).join('') + '</dl>' +
      '<div class="table-scroll"><table><caption>✍ Electronic signatures</caption><thead><tr><th>Role</th><th>Signer (invented)</th><th>Meaning</th><th>Signed (UTC)</th></tr></thead><tbody>' +
      r.sig.map(function (g) { return '<tr><td>' + esc(g[0]) + '</td><td>' + esc(g[1]) + '</td><td>' + esc(g[2]) + '</td><td class="mono">' + esc(g[3]) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="rel">' + termBtn(s.term) + '<a class="chip" href="#stage-' + s.st + '">Stage ' + s.st + ' · ' + esc(MD.stages[s.st - 1].short) + '</a></div>' +
      '<nav class="page-nav" aria-label="Previous and next step">' +
      (i > 0 ? '<button type="button" class="btn ghost" data-capa-step="' + (i - 1) + '">← ' + esc(c.steps[i - 1].k) + '</button>' : '<span></span>') +
      (i < n - 1 ? '<button type="button" class="btn" data-capa-step="' + (i + 1) + '">' + esc(c.steps[i + 1].k) + ' →</button>' : '<a class="btn" href="#home">Back to the journey</a>') + '</nav>';
    var d = $('#capaDetail'); d.innerHTML = h; hydrateSnaps(d);
    if (focus) { d.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
  }
  document.addEventListener('keydown', function (e) {
    if (state.route !== 'capa' || !drawer.hidden || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { state.capaStep++; fillCapa(); }
    if (e.key === 'ArrowLeft') { state.capaStep--; fillCapa(); }
  });
  document.addEventListener('keydown', function (e) {
    if (state.route !== 'story' || !drawer.hidden || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') { story.i++; fillStory(); }
    if (e.key === 'ArrowLeft') { story.i--; fillStory(); }
  });

  /* ---------------- PLAY THE JOURNEY: guided tour ---------------- */
  var tour = { on: false, playing: false, i: 1, speed: 1, elapsed: 0, last: 0, raf: 0, DUR: 10000 };
  function tourOpen() {
    if (!isHomeRoute()) { location.hash = '#home'; setTimeout(tourOpen, 80); return; }
    tour.on = true; $('#tour').hidden = false; document.body.classList.add('touring');
    tour.playing = false; tour.spoken = false; tourVoiceBtn();
    tourGo(1); tourPlay(true);
    var m = $('.two'); if (m) m.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });   // keep the 3D stretcher in view
    cancelAnimationFrame(tour.raf); tour.last = performance.now(); tour.raf = requestAnimationFrame(tourTick);
    $('#tPlay').focus();
  }
  function tourVoiceBtn() {
    var b = $('#tVoice'); b.hidden = !voice.ok;
    b.textContent = voice.on ? '🔊' : '🔇'; b.setAttribute('aria-label', voice.on ? 'Mute narration' : 'Turn narration on');
  }
  function tourSpeak() {
    tour.spoken = false; tour.fallback = false;
    var t0 = performance.now();
    var ok = say(MD.tour[tour.i - 1], tour.speed, function () { if (performance.now() - t0 < 1000) tour.fallback = true; else tour.spoken = true; });
    if (!ok) tour.fallback = true;   // no voice available: fall back to the timer
  }
  function tourGo(n) {
    tour.i = Math.max(1, Math.min(MD.stages.length, n)); tour.elapsed = 0;
    selectStage(tour.i);
    var ex = (tour.i === 3 || tour.i === 5) ? 55 : 0, sl = $('#explode');   // open the model up while the parts list is explained
    sl.value = ex; if (window.Stretcher3D) window.Stretcher3D.setExplode(ex / 100);
    var s = MD.stages[tour.i - 1];
    $('#tourCap').innerHTML = '<b style="--c:var(--s' + s.n + ')">' + s.n + ' · ' + esc(s.name) + '</b>' + esc(MD.tour[tour.i - 1]);
    $('#tJump').value = tour.i;
    $('#tourDots').innerHTML = MD.stages.map(function (x) { return '<i style="--c:var(--s' + x.n + ')" class="' + (x.n === tour.i ? 'on' : (x.n < tour.i ? 'done' : '')) + '"></i>'; }).join('');
    tour.estimate = MD.tour[tour.i - 1].length * 62;
    if (tour.playing) tourSpeak(); else { hush(); tour.spoken = false; }
  }
  function tourPlay(on) {
    tour.playing = on; var b = $('#tPlay');
    b.textContent = on ? '⏸' : '▶'; b.setAttribute('aria-label', on ? 'Pause' : 'Play');
    if (on) { if (!tour.spoken) { tour.elapsed = 0; tourSpeak(); } } else hush();
  }
  function tourClose() {
    tour.on = false; tour.playing = false; cancelAnimationFrame(tour.raf); hush();
    $('#tour').hidden = true; document.body.classList.remove('touring');
    var sl = $('#explode'); sl.value = 0; if (window.Stretcher3D) window.Stretcher3D.setExplode(0);
  }
  function tourTick(ts) {
    if (!tour.on) return;
    tour.raf = requestAnimationFrame(tourTick);
    var dt = Math.min(1500, ts - tour.last); tour.last = ts;   // generous cap so a throttled tab still advances
    var voiced = voice.ok && voice.on && !tour.fallback;
    if (tour.playing) {
      tour.elapsed += dt * tour.speed;
      if (!reduced && window.Stretcher3D && window.Stretcher3D.orbit) window.Stretcher3D.orbit(dt / 1000 * 0.160 * tour.speed);
      // with narration, wait for the voice to finish; without it, use the timer
      var done = voiced ? ((tour.spoken && tour.elapsed >= 3000) || tour.elapsed >= Math.max(14000, tour.estimate * 2.2)) : tour.elapsed >= tour.DUR;
      if (done) { if (tour.i < MD.stages.length) tourGo(tour.i + 1); else { tourPlay(false); tour.spoken = true; } }
    }
    var frac = voiced ? Math.min(0.97, tour.elapsed / Math.max(1, tour.estimate)) : Math.min(1, tour.elapsed / tour.DUR);
    $('#tourFill').style.width = (((tour.i - 1) + frac) / MD.stages.length * 100) + '%';
  }
  document.addEventListener('keydown', function (e) {
    if (!tour.on || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 'Escape') tourClose();
  });

  /* =====================================================================
     PHASE 4: voice, story mode, restaurant view, how BOMs are made
     ===================================================================== */
  var voice = { ok: ('speechSynthesis' in window) && typeof window.SpeechSynthesisUtterance !== 'undefined', on: store.get('md-voice', '1') === '1', tok: 0 };
  // Reads text aloud with the browser's own voice. Returns false when no voice is available.
  function say(text, rate, done) {
    if (!voice.ok || !voice.on) return false;
    try {
      var tok = ++voice.tok; window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.rate = Math.max(0.7, Math.min(1.6, rate || 1)); u.lang = 'en-GB';
      u.onend = u.onerror = function () { if (tok === voice.tok && done) done(); };
      window.speechSynthesis.speak(u); return true;
    } catch (e) { return false; }
  }
  function hush() { voice.tok++; if (voice.ok) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } } }

  /* ---------------- PRODUCT SWITCH: stretcher or bicycle (Phase 5) ---------------- */
  function prodSwitchHtml() {
    return '<div class="prod-switch"><span class="lbl">Study with</span><div class="seg" role="group" aria-label="Product to study">' +
      '<button type="button" data-product="stretcher" aria-pressed="' + !isBike() + '">Stretcher</button>' +
      '<button type="button" data-product="bike" aria-pressed="' + isBike() + '">Bicycle</button></div></div>';
  }
  function modeText(m) {
    if (isBike() && m.id === 'hospital') return 'On the road · In daily use.';
    if (isBike() && m.id === 'service') return 'Workshop · Back for a repair.';
    return m.name + ' · ' + m.tip;
  }
  function renderProdHome() {
    var box = $('#prodHome'); if (!box) return;
    box.innerHTML = prodSwitchHtml() + (isBike() ? '<p class="tnote">You are looking at the bicycle, a simpler product. The looks work the same way; the 10 stages and their records still tell the stretcher\'s story.</p>' : '');
    $('#v3dH').textContent = isBike() ? 'The bicycle at this stage' : 'The stretcher at this stage';
    var chk = $('#powered'); if (chk) chk.closest('label').hidden = isBike();
  }
  function setProduct(p) {
    state.product = p === 'bike' ? 'bike' : 'stretcher'; store.set('md-product', state.product);
    if (window.Stretcher3D && window.Stretcher3D.setProduct) window.Stretcher3D.setProduct(state.product);
    renderViewerControls(); renderProdHome(); story.i = 0;
    var y = window.scrollY; route(); window.scrollTo(0, y);
  }
  function curBoms() {
    if (!isBike()) { return { intro: MD.boms.intro, order: MD.boms.order, compare: MD.boms.compare, castor: MD.boms.castor, followIds: ['MC-CST-6000'] }; }
    var b = MD.bike.boms; return { intro: b.intro, order: MD.boms.order, compare: b.compare, castor: b.follow, followIds: b.followIds };
  }
  // one BOM description; the bicycle only overrides what differs from the stretcher
  function bomOf(id) {
    var base = MD.boms.list[id]; if (!isBike()) return base;
    var o = {}, k, over = MD.bike.boms.list[id] || {};
    for (k in base) o[k] = base[k];
    for (k in over) o[k] = over[k];
    return o;
  }
  function openBikePart(id) {
    var p = bikeById[id], where = [];
    ['ebom', 'mbom', 'sbom', 'pbom'].forEach(function (b) {
      var rows = (MD.bike.boms.list[b] || {}).tree || [];
      rows.forEach(function (r, i) { if (r[1] === id) { var par = ''; for (var k = i - 1; k >= 0; k--) { if (rows[k][0] < r[0]) { par = rows[k][2]; break; } } where.push([MD.boms.list[b].name, r[2], par]); } });
    });
    openDrawer({ kicker: 'Bicycle part · ' + id, title: p.name, sub: '<span class="pill">' + esc(p.mb) + '</span> <span class="pill ok">Quantity ' + p.qty + '</span>',
      tabs: [
        { label: 'Simple', html: '<p>' + esc(p.s) + '</p>' + snapFig([id], { prod: 'bike' }) + '<p class="tnote">The bicycle is a practice product: invented, and much simpler than the stretcher.</p>' },
        { label: 'In the lists', html: '<p>The same part appears in several parts lists, each arranged for a different job.</p><div class="table-scroll"><table><thead><tr><th>List</th><th>Shown as</th><th>Sits under</th></tr></thead><tbody>' +
          where.map(function (w) { return '<tr><td>' + esc(w[0]) + '</td><td>' + esc(w[1]) + '</td><td>' + esc(w[2] || '—') + '</td></tr>'; }).join('') + '</tbody></table></div><p><a class="btn ghost" href="#boms" data-close="1">See how each list is made</a></p>' }
      ] });
    if (window.Stretcher3D) window.Stretcher3D.select(id);
  }

  /* ---------------- STORY MODE ---------------- */
  var story = { i: 0, read: false };
  function renderStoryPage() {
    return crumbs([['Journey', '#home'], ['Story']]) +
      '<header class="page-head" style="--c:var(--s1)"><div class="kicker">Story mode · no jargon</div><h1>The life of ' + esc(curStory().name) + (isBike() ? ' the bicycle' : ' the stretcher') + '</h1>' +
      '<p class="tag">Ten pages, one picture each. Read it yourself or let it be read to you. No technical words needed.</p>' + prodSwitchHtml() + '</header>' +
      '<section class="sec story" id="storyBox" aria-live="polite"></section>';
  }
  function fillStory() {
    var P = curStory().pages; story.i = Math.max(0, Math.min(P.length - 1, story.i));
    var p = P[story.i], s = MD.stages[p.st - 1], i = story.i;
    $('#storyBox').innerHTML = '<div class="story-grid" style="--c:var(--s' + p.st + ')">' +
      snapFig([], { look: p.look, prod: state.product, cap: curStory().name + ' on page ' + (i + 1) }) +
      '<div class="story-text"><div class="kicker">Page ' + (i + 1) + ' of ' + P.length + '</div><h2>' + esc(p.h) + '</h2><p class="story-p">' + esc(p.t) + '</p>' +
      kitchenNote(MD.kitchen.stages[p.st - 1]) +
      '<p class="tnote">Professionals call this <a href="#stage-' + s.n + '">stage ' + s.n + ' · ' + esc(s.name) + '</a>.</p>' +
      '<div class="story-dots">' + P.map(function (x, k) { return '<button type="button" data-story-step="' + k + '" class="' + (k === i ? 'on' : (k < i ? 'done' : '')) + '" style="--c:var(--s' + x.st + ')" aria-label="Page ' + (k + 1) + ': ' + esc(x.h) + '"></button>'; }).join('') + '</div>' +
      '<div class="w-actions">' + (i > 0 ? '<button type="button" class="btn ghost" data-story-step="' + (i - 1) + '">← Back</button>' : '') +
      (voice.ok ? '<button type="button" class="btn ghost" data-story-read>' + (story.read ? '⏸ Stop reading' : '🔊 Read it to me') + '</button>' : '') +
      (i < P.length - 1 ? '<button type="button" class="btn" data-story-step="' + (i + 1) + '">Next page →</button>' : '<a class="btn" href="#home">See the full journey</a>') + '</div></div></div>';
    hydrateSnaps($('#storyBox'));
    if (story.read) storySpeak(); else hush();
  }
  function storySpeak() {
    var P = curStory().pages, p = P[story.i], t0 = performance.now();
    var ok = say(p.h + '. ' + p.t, 1, function () {
      if (performance.now() - t0 < 1000 || !story.read || state.route !== 'story') return;
      if (story.i < P.length - 1) setTimeout(function () { if (story.read && state.route === 'story') { story.i++; fillStory(); } }, 700);
      else { story.read = false; fillStory(); }
    });
    if (!ok) story.read = false;
  }

  /* ---------------- RESTAURANT VIEW ---------------- */
  function renderKitchenPage() {
    var K = MD.kitchen, ids = Object.keys(K.terms).filter(function (id) { return MD.terms[id]; });
    return crumbs([['Journey', '#home'], ['Restaurant view']]) +
      '<header class="page-head" style="--c:var(--s2)"><div class="kicker">One picture for everything</div><h1>Think of a restaurant</h1><p class="tag">' + esc(K.intro) + '</p></header>' +
      '<section class="sec"><h2>The 10 stages, twice</h2><div class="table-scroll"><table><thead><tr><th>Stage</th><th>With the stretcher</th><th>In the restaurant</th></tr></thead><tbody>' +
      MD.stages.map(function (s) { return '<tr><td><a href="#stage-' + s.n + '"><b>' + s.n + ' · ' + esc(s.short) + '</b></a></td><td>' + esc(s.tagline.s) + '</td><td>' + esc(K.stages[s.n - 1]) + '</td></tr>'; }).join('') + '</tbody></table></div></section>' +
      '<section class="sec"><h2>The five teams, in the restaurant</h2><div class="table-scroll"><table><thead><tr><th>Team</th><th>In the restaurant</th></tr></thead><tbody>' +
      MD.lanes.map(function (l) { return '<tr><td><b>' + esc((MD.laneInfo[l.id] || {}).plain || l.name) + '</b><br><span class="tnote">' + esc(l.name) + '</span></td><td>' + esc(K.lanes[l.id] || '') + '</td></tr>'; }).join('') + '</tbody></table></div></section>' +
      '<section class="sec"><h2>Technical words and their restaurant twins</h2><p class="tnote">Select a word for the full explanation.</p><div class="g-grid">' +
      ids.map(function (id) { return '<button type="button" class="g-item" data-term="' + id + '"><b>' + esc(MD.terms[id].n) + '</b><small>' + esc(K.terms[id]) + '</small></button>'; }).join('') + '</div></section>';
  }

  /* ---------------- HOW EACH BOM IS MADE ---------------- */
  var BOM_TAG = { 'new': ['Added in this list', 'warn'], group: ['Group made for this list', ''] };
  function bomTree(rows) {
    return '<ul class="bom-tree">' + rows.map(function (r) {
      var tag = BOM_TAG[r[3]];
      return '<li class="lv' + r[0] + (r[3] ? ' t-' + r[3] : '') + '"><span class="mono">' + esc(r[1]) + '</span><span>' + esc(r[2]) + '</span>' + (tag ? '<span class="pill ' + tag[1] + '">' + tag[0] + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  function renderBomsPage() {
    var B = curBoms(), box = function (id, extra) { var b = bomOf(id); return '<button type="button" class="bf" data-scroll="bom-' + id + '" style="--c:var(--s' + b.c + ')"><b>' + esc(b.name) + '</b><small>' + esc(b.q) + '</small>' + (extra || '') + '</button>'; };
    var h = crumbs([['Journey', '#home'], ['How BOMs are made']]) +
      '<header class="page-head" style="--c:var(--s3)"><div class="kicker">Parts lists explained</div><h1>How each BOM is made</h1><p class="tag">' + esc(B.intro) + '</p>' + prodSwitchHtml() + '</header>';
    h += '<section class="sec"><h2>One set of parts, several lists</h2><div class="bom-flow"><span class="bf plain" style="--c:var(--s2)"><b>3D model</b><small>Built in Creo</small></span><i>→</i>' + box('ebom') + '<i>→</i>' + box('mbom') + '<i>→</i>' + box('sapbom') + '</div>' +
      '<div class="bom-flow"><span class="bf-note">The EBOM also feeds</span><i>→</i>' + box('sbom') + '<span class="bf-note">and the packaging list goes into the MBOM</span><i>←</i>' + box('pbom') + '</div>' +
      '<p class="tnote">Select a box to jump to it.</p></section>';
    B.order.forEach(function (id) {
      var b = bomOf(id);
      h += '<section class="sec bom-sec" id="bom-' + id + '" style="--c:var(--s' + b.c + ')"><div class="bom-head"><div><div class="kicker">' + esc(b.q) + '</div><h2 style="font-size:1.35rem">' + rich('[[' + b.term + '|' + b.name + ']]') + '</h2></div><a class="chip" href="#stage-' + b.st + '">Stage ' + b.st + ' · ' + esc(MD.stages[b.st - 1].short) + '</a></div>' +
        '<p class="prose">' + esc(b.plain) + '</p>' + kitchenNote(b.kitchen) +
        (b.pics && b.pics.length ? '<div class="bom-pics">' + b.pics.map(function (p) { return snapFig(p.ids || [], { look: p.look, ex: p.ex, cap: p.cap, prod: state.product }); }).join('') + '</div>' : '') +
        '<div class="cols2"><div><h3 class="sub">How it is made</h3><ol class="bul">' + b.how.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
        '<dl class="kv" style="margin-top:12px"><dt>Made by</dt><dd>' + esc(b.who) + '</dd><dt>Made from</dt><dd>' + esc(b.from) + '</dd><dt>Lives in</dt><dd>' + esc(b.sys) + '</dd></dl></div>' +
        '<div><h3 class="sub">What it looks like</h3>' + bomTree(b.tree) + '</div></div></section>';
    });
    h += '<section class="sec"><h2>Side by side</h2><div class="table-scroll"><table><thead><tr><th></th><th>Engineering BOM</th><th>Manufacturing BOM</th><th>Service BOM</th></tr></thead><tbody>' +
      B.compare.map(function (r) { return '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<div class="cols2"><div>' + snapFig(B.followIds, { prod: state.product }) + '</div><p class="notice">' + rich(B.castor.replace('MC-CST-6000', '[[p:MC-CST-6000]]')) + '</p></div></section>';
    return h;
  }

  /* ---------------- routing ---------------- */
  function route() {
    var hsh = (location.hash || '#home').slice(1), page = $('#page'), home = $('#home');
    var m = /^stage-(\d+)$/.exec(hsh), n = m ? +m[1] : 0;
    closeDrawer();
    if (m && n >= 1 && n <= MD.stages.length) { state.route = 'stage'; state.stage = n; page.innerHTML = renderStagePage(n); }
    else if (hsh === 'parts') { state.route = 'parts'; page.innerHTML = renderPartsPage(); }
    else if (hsh === 'glossary') { state.route = 'glossary'; page.innerHTML = renderGlossaryPage(); fillGlossary(); }
    else if (hsh === 'trace') { state.route = 'trace'; page.innerHTML = renderTracePage(); playTrace(); }
    else if (hsh === 'story') { state.route = 'story'; page.innerHTML = renderStoryPage(); fillStory(); }
    else if (hsh === 'kitchen') { state.route = 'kitchen'; page.innerHTML = renderKitchenPage(); }
    else if (hsh === 'boms') { state.route = 'boms'; page.innerHTML = renderBomsPage(); }
    else if (hsh === 'capa') { state.route = 'capa'; page.innerHTML = renderCapaPage(); fillCapa(); }
    else if (hsh === 'roles') { state.route = 'roles'; page.innerHTML = renderRolesPage(); }
    else if (hsh === 'modules') { state.route = 'modules'; page.innerHTML = renderModulesPage(); fillModules(); }
    else { state.route = 'home'; }
    if (!isHomeRoute() && tour.on) tourClose();
    if (hsh !== 'trace') clearInterval(trace.timer);
    if (hsh !== 'story') { story.read = false; if (!tour.on) hush(); }
    initMinis();
    if (state.route !== 'home') hydrateSnaps(page);
    var isHome = state.route === 'home';
    home.hidden = !isHome; page.hidden = isHome;
    $$('.nav a').forEach(function (a) { var on = a.getAttribute('data-nav') === state.route; if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (window.Stretcher3D) { if (isHome) window.Stretcher3D.start(); else window.Stretcher3D.stop(); }
    if (isHome) selectStage(state.stage); else window.scrollTo(0, 0);
    document.title = 'Stretcher Lifecycle Journey';
  }
  function rerender() { renderWelcome(); route(); }

  function setLevel(l) {
    state.level = l; store.set('md-level', l);
    $$('[data-level]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-level') === l ? 'true' : 'false'); });
    var y = window.scrollY; rerender(); window.scrollTo(0, y);
  }
  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(t, save) {
    document.documentElement.setAttribute('data-theme', t);
    if (save) store.set('md-theme', t);
    if (window.Stretcher3D) window.Stretcher3D.setTheme(t);
  }

  /* ---------------- events (delegated) ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-dtab]'))) { selectTab(+el.getAttribute('data-dtab')); return; }
    if ((el = t.closest('[data-close]'))) { closeDrawer(); }
    if ((el = t.closest('[data-show3d]'))) {
      var pid = el.getAttribute('data-show3d'); closeDrawer();
      if (state.route !== 'home') location.hash = '#home';
      setTimeout(function () { if (window.Stretcher3D) window.Stretcher3D.select(pid, true); var v = $('.viewer-card'); if (v) v.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }, 60);
      return;
    }
    if ((el = t.closest('[data-trace-pick]'))) {
      trace.part = el.getAttribute('data-trace-pick'); store.set('md-trace', trace.part); closeDrawer();
      if (location.hash === '#trace') { var sy = window.scrollY; route(); window.scrollTo(0, sy); } else location.hash = '#trace';
      return;
    }
    if ((el = t.closest('[data-trace-replay]'))) { playTrace(); return; }
    if ((el = t.closest('[data-product]'))) { setProduct(el.getAttribute('data-product')); return; }
    if ((el = t.closest('[data-play]'))) { tourOpen(); return; }
    if ((el = t.closest('[data-story-step]'))) { story.i = +el.getAttribute('data-story-step'); fillStory(); return; }
    if ((el = t.closest('[data-story-read]'))) { story.read = !story.read; if (story.read) { voice.on = true; store.set('md-voice', '1'); } fillStory(); return; }
    if ((el = t.closest('[data-scroll]'))) { var tg = document.getElementById(el.getAttribute('data-scroll')); if (tg) tg.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); return; }
    if ((el = t.closest('#tVoice'))) { voice.on = !voice.on; store.set('md-voice', voice.on ? '1' : '0'); tourVoiceBtn(); if (voice.on && tour.playing) { tour.elapsed = 0; tourSpeak(); } else hush(); return; }
    if ((el = t.closest('[data-capa-step]'))) { state.capaStep = +el.getAttribute('data-capa-step'); fillCapa(true); return; }
    if ((el = t.closest('[data-role-pick]'))) { setRole(el.getAttribute('data-role-pick')); return; }
    if ((el = t.closest('[data-mod-filter]'))) { state.mf = el.getAttribute('data-mod-filter'); fillModules(); return; }
    if ((el = t.closest('[data-mini-step]'))) { var mEl = el.closest('.mini'), ms = miniState[mEl.getAttribute('data-mini')]; ms.i = +el.getAttribute('data-mini-step'); ms.play = false; miniShow(mEl); return; }
    if ((el = t.closest('[data-mini-play]'))) { var mEl2 = el.closest('.mini'), ms2 = miniState[mEl2.getAttribute('data-mini')]; ms2.play = !ms2.play; miniShow(mEl2); return; }
    if ((el = t.closest('[data-term]'))) { e.preventDefault(); openTerm(el.getAttribute('data-term')); return; }
    if ((el = t.closest('[data-lane]'))) { openLane(el.getAttribute('data-lane'), +el.getAttribute('data-lane-stage') || 0); return; }
    if ((el = t.closest('[data-part]'))) { openPart(el.getAttribute('data-part')); return; }
    if ((el = t.closest('[data-stage-sel]'))) { selectStage(+el.getAttribute('data-stage-sel')); return; }
    if ((el = t.closest('[data-go-stage]'))) {
      state.stage = +el.getAttribute('data-go-stage');
      if (state.route !== 'home') location.hash = '#home'; else selectStage(state.stage);
      setTimeout(function () { var m = $('#mapH'); if (m) m.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }, 60);
      return;
    }
    if ((el = t.closest('[data-mode]'))) { setMode(el.getAttribute('data-mode')); return; }
    if ((el = t.closest('[data-level]'))) { setLevel(el.getAttribute('data-level')); return; }
    if ((el = t.closest('[data-letter]'))) { e.preventDefault(); var L = el.getAttribute('data-letter'); var g = $('#gl-' + (L === '#' ? 'num' : L)); if (g) g.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); return; }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('g[data-term]')) { e.preventDefault(); openTerm(e.target.getAttribute('data-term')); }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'gq') { state.gq = e.target.value; fillGlossary(); }
    if (e.target.id === 'mq') { state.mq = e.target.value; fillModules(); }
    if (e.target.id === 'explode' && window.Stretcher3D) window.Stretcher3D.setExplode(+e.target.value / 100);
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'powered' && window.Stretcher3D) window.Stretcher3D.setPowered(e.target.checked);
    if (e.target.id === 'roleSel') setRole(e.target.value);
    if (e.target.id === 'tSpeed') tour.speed = +e.target.value;
    if (e.target.id === 'tJump') tourGo(+e.target.value);
  });
  $('#q').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    state.gq = e.target.value; e.target.value = '';
    if (location.hash === '#glossary') route(); else location.hash = '#glossary';
  });
  // highlight a part in 3D while hovering / focusing its chip
  ['mouseover', 'focusin'].forEach(function (ev) { document.addEventListener(ev, function (e) { var el = e.target.closest && e.target.closest('[data-hl]'); if (el && window.Stretcher3D) window.Stretcher3D.highlight(el.getAttribute('data-hl')); }); });
  ['mouseout', 'focusout'].forEach(function (ev) { document.addEventListener(ev, function (e) { var el = e.target.closest && e.target.closest('[data-hl]'); if (el && window.Stretcher3D) window.Stretcher3D.highlight(null); }); });
  $('#themeBtn').addEventListener('click', function () { setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); });
  $('#zIn').addEventListener('click', function () { if (window.Stretcher3D) window.Stretcher3D.zoom(0.850); });
  $('#zOut').addEventListener('click', function () { if (window.Stretcher3D) window.Stretcher3D.zoom(1.180); });
  $('#zReset').addEventListener('click', function () { if (window.Stretcher3D) window.Stretcher3D.resetView(); });
  window.addEventListener('hashchange', route);

  /* ---------------- boot ---------------- */
  var savedTheme = store.get('md-theme', '');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  $$('[data-level]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-level') === state.level ? 'true' : 'false'); });
  renderViewerControls();
  if (window.Stretcher3D) {
    window.Stretcher3D.init($('#stage3d'), {
      theme: currentTheme(), reduced: reduced,
      onHover: function (id, x, y) {
        if (!id) { hideTip(); return; }
        var p = anyPart(id); if (p) showTip(p.name + ' · ' + p.id + ' — click for details', x, y - 6);
      },
      onPick: function (id) { openPart(id); }
    });
  }
  // follow the theme the host or operating system chooses
  new MutationObserver(function () { if (window.Stretcher3D) window.Stretcher3D.setTheme(currentTheme()); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', function () { if (window.Stretcher3D) window.Stretcher3D.setTheme(currentTheme()); }); }
  $('#minis').innerHTML = miniHtml('procurement') + miniHtml('service');
  $('#roleSel').innerHTML = '<option value="">Everyone</option>' + MD.roles.map(function (r) { return '<option value="' + r.id + '"' + (r.id === state.role ? ' selected' : '') + '>' + esc(r.name) + '</option>'; }).join('');
  $('#tJump').innerHTML = MD.stages.map(function (s) { return '<option value="' + s.n + '">' + s.n + ' · ' + esc(s.short) + '</option>'; }).join('');
  ['tPrev', 'tNext', 'tPlay', 'tClose'].forEach(function (id) { $('#' + id).addEventListener('click', function () { if (id === 'tPrev') tourGo(tour.i - 1); else if (id === 'tNext') tourGo(tour.i + 1); else if (id === 'tPlay') tourPlay(!tour.playing); else tourClose(); }); });
  if (isBike() && window.Stretcher3D && window.Stretcher3D.setProduct) { window.Stretcher3D.setProduct('bike'); renderViewerControls(); }
  renderProdHome();
  renderWelcome();
  route();
  pk.raf = requestAnimationFrame(tickPackets);
})();
