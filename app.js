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
  var state = { level: store.get('md-level', 'simple'), stage: 1, route: 'home', gq: '' };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var partById = {}; MD.parts.forEach(function (p) { partById[p.id] = p; });
  var roleById = {}; MD.roles.forEach(function (r) { roleById[r.id] = r; });

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
    var body = $('#dBody'); body.innerHTML = dTabsData[i].html; body.scrollTop = 0;
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
        { label: 'Simple', html: '<p>' + rich(t.simple) + '</p><div class="analogy"><b>Everyday analogy</b>' + rich(t.analogy) + '</div>' + extra },
        { label: 'Expert', html: '<p>' + rich(t.expert) + '</p>' + extra },
        { label: 'In our stretcher', html: '<p>' + rich(t.ex) + '</p><p class="tnote">Sample data, invented for training.</p>' },
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
        { label: 'Simple', html: '<p>' + rich(p.s) + '</p>' + (p.nomodel ? '<p class="notice">This item is in the parts list but not in the 3D model. Labels, grease and software are typical examples.</p>' : '') +
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
      '<div class="w-actions"><button type="button" class="btn" data-go-stage="1">Begin at stage 1</button><a class="btn ghost" href="#trace">Follow a part</a><a class="btn ghost" href="#glossary">Open the glossary</a></div></div>' +
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
    h += '<div class="map-corner">Parallel lanes ↓</div>';
    MD.stages.forEach(function (s, i) {
      var cls = 'node' + (s.n === state.stage ? ' on' : (s.n < state.stage ? ' passed' : ''));
      h += '<div class="node-cell ' + (i % 2 === 0 ? 'up' : 'down') + '" style="--c:var(--s' + s.n + ')"><button type="button" class="' + cls + '" data-stage-sel="' + s.n + '" aria-pressed="' + (s.n === state.stage) + '" data-tip="' + esc(lv(s.tagline)) + '">' +
        '<span class="node-ic">' + icon(s.n) + '<span class="node-n">' + s.n + '</span></span>' +
        '<span class="node-name">' + esc(s.short) + '</span></button></div>';
    });
    MD.lanes.forEach(function (l, li) {
      var lc = ' style="--c:var(--s' + [7, 2, 10, 4, 6][li % 5] + ')"';
      h += '<button type="button"' + lc + ' class="lane-name" data-lane="' + l.id + '" data-tip="' + esc((MD.terms[l.term] || {}).tip || '') + '"><span>' + esc(l.name) + '</span></button>';
      l.cells.forEach(function (c, i) {
        h += '<button type="button"' + lc + ' class="lane-cell' + (i + 1 === state.stage ? ' on' : '') + '" data-lane="' + l.id + '" data-lane-stage="' + (i + 1) + '" data-tip="' + esc(c) + '" aria-label="' + esc(l.name + ', stage ' + (i + 1) + ': ' + c) + '"><i></i></button>';
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
      '<p class="tag">' + rich(lv(s.tagline)) + '</p><p>' + rich(lv(s.purpose)) + '</p>' +
      '<div class="sp-sec"><h3>Systems involved</h3><div class="sys-row">' + s.sys.map(sysChip).join('') + '</div></div>' +
      '<div class="sp-sec"><h3>Alongside, in the parallel lanes</h3><ul class="sp-list">' +
      MD.lanes.map(function (l) { return '<li><b>' + rich('[[' + l.term + '|' + l.name + ']]') + '</b><span>' + rich(l.cells[s.n - 1]) + '</span></li>'; }).join('') + '</ul></div>' +
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
    $('#partChips').innerHTML = MD.parts.filter(function (p) { return p.lvl > 0; }).map(function (p) {
      return '<button type="button" class="chip' + (p.opt ? ' opt' : '') + '" data-part="' + p.id + '" data-hl="' + p.id + '" data-tip="' + esc(p.id + ' — ' + p.s) + '">' + esc(p.name) + '</button>';
    }).join('');
  }
  function setMode(id) {
    var m = MD.modes.filter(function (x) { return x.id === id; })[0]; if (!m) return;
    $$('#modes .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === id ? 'true' : 'false'); });
    $('#modeBadge').textContent = m.name + ' · ' + m.tip;
    if (window.Stretcher3D) window.Stretcher3D.setMode(id);
  }
  function selectStage(n, scroll) {
    state.stage = Math.max(1, Math.min(MD.stages.length, n));
    renderMap(); renderStagePanel(); renderPackets();
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
      r.roles.map(function (id) { return '<th scope="col" data-tip="' + esc(roleById[id].name + ' — ' + roleById[id].tip) + '">' + id + '</th>'; }).join('') + '</tr></thead><tbody>';
    r.rows.forEach(function (row) {
      var map = {}; row[1].split(' ').forEach(function (kv) { var a = kv.split(':'); map[a[0]] = a[1]; });
      h += '<tr><td>' + esc(row[0]) + (row[2] ? ' <span class="sig" data-tip="Approval needs a 21 CFR Part 11 electronic signature.">✍ e-signature</span>' : '') + '</td>' +
        r.roles.map(function (id) { return '<td class="c ' + (map[id] || '') + '">' + (map[id] || '·') + '</td>'; }).join('') + '</tr>';
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
    h += '<section class="sec"><h2>Purpose</h2><p class="prose">' + rich(lv(s.purpose)) + '</p></section>';
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

  /* ---------------- routing ---------------- */
  function route() {
    var hsh = (location.hash || '#home').slice(1), page = $('#page'), home = $('#home');
    var m = /^stage-(\d+)$/.exec(hsh), n = m ? +m[1] : 0;
    closeDrawer();
    if (m && n >= 1 && n <= MD.stages.length) { state.route = 'stage'; state.stage = n; page.innerHTML = renderStagePage(n); }
    else if (hsh === 'parts') { state.route = 'parts'; page.innerHTML = renderPartsPage(); }
    else if (hsh === 'glossary') { state.route = 'glossary'; page.innerHTML = renderGlossaryPage(); fillGlossary(); }
    else if (hsh === 'trace') { state.route = 'trace'; page.innerHTML = renderTracePage(); playTrace(); }
    else { state.route = 'home'; }
    if (hsh !== 'trace') clearInterval(trace.timer);
    initMinis();
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
    if (e.target.id === 'explode' && window.Stretcher3D) window.Stretcher3D.setExplode(+e.target.value / 100);
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'powered' && window.Stretcher3D) window.Stretcher3D.setPowered(e.target.checked);
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
        var p = partById[id]; if (p) showTip(p.name + ' · ' + p.id + ' — click for details', x, y - 6);
      },
      onPick: function (id) { openPart(id); }
    });
  }
  // follow the theme the host or operating system chooses
  new MutationObserver(function () { if (window.Stretcher3D) window.Stretcher3D.setTheme(currentTheme()); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if (window.matchMedia) { var mq = window.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', function () { if (window.Stretcher3D) window.Stretcher3D.setTheme(currentTheme()); }); }
  $('#minis').innerHTML = miniHtml('procurement') + miniHtml('service');
  renderWelcome();
  route();
  pk.raf = requestAnimationFrame(tickPackets);
})();
