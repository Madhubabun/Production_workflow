/* ==========================================================================
   stretcher3d.js : the TransPort T-300 built from Three.js primitives.
   Exposes window.Stretcher3D with: init, start, stop, setMode, setExplode,
   setPowered, setTheme, highlight, select, zoom, resetView, flyTo.
   Axes: x = length (head at -x, foot at +x), y = up, z = width. Units: metres.
   ========================================================================== */
(function () {
  'use strict';
  var T = window.THREE;
  var api = { ready: false };
  var el, opts, renderer, scene, camera, root, raycaster, pointer;
  var groups = [];          // every part group
  var meshes = [];          // every pickable mesh
  var props = {};           // scenery per mode
  var running = false, raf = 0, last = 0;
  var explode = 0, explodeT = 0, powered = true, mode = 'idea', hover = null, selected = null, selUntil = 0;
  var cam = { th: -0.95, ph: 1.12, r: 3.7 }, camT = { th: -0.95, ph: 1.12, r: 3.7 }, target, autoRotate = true;
  var theme = 'light';
  var INK = { light: 0x1d4e63, dark: 0xa9d6e6 };

  /* How each lifecycle "look" renders the parts. */
  var MODES = {
    idea:      { op: 0.03, edge: 1.0, col: null,     tint: 0xffffff, em: 0x000000, ei: 0,    edgeCol: 'ink',    cam: { th: -0.95, ph: 1.12, r: 3.7 } },
    creo:      { op: 1,    edge: 0.35, col: 0x9aa4ae, em: 0x000000, ei: 0,    edgeCol: 'ink',    cam: { th: -0.80, ph: 1.10, r: 3.1 } },
    windchill: { op: 1,    edge: 0.55, col: 0x86a9d8, em: 0x1e6fd9, ei: 0.38, edgeCol: 0x9cc4ff, cam: { th: -0.70, ph: 1.05, r: 3.8 } },
    released:  { op: 1,    edge: 0.45, col: 0x8fc7b0, em: 0x12925f, ei: 0.30, edgeCol: 0xa8f0d0, cam: { th: -0.60, ph: 1.05, r: 3.8 } },
    plant:     { op: 1,    edge: 0,    col: null,     em: 0x000000, ei: 0,    edgeCol: 'ink',    cam: { th: -0.55, ph: 1.08, r: 4.3 } },
    packaged:  { op: 1,    edge: 0,    col: null,     em: 0x000000, ei: 0,    edgeCol: 'ink',    cam: { th: 0.45, ph: 1.15, r: 4.6 } },
    hospital:  { op: 1,    edge: 0,    col: null,     em: 0x000000, ei: 0,    edgeCol: 'ink',    cam: { th: 0.55, ph: 1.15, r: 4.3 } },
    service:   { op: 1,    edge: 0,    col: null,     em: 0x000000, ei: 0,    edgeCol: 'ink',    cam: { th: 0.75, ph: 1.25, r: 3.1 } }
  };

  /* ---------------- builders ---------------- */
  function part(id, ex, opt) {
    var g = new T.Group();
    g.userData = { partId: id, ex: new T.Vector3(ex[0], ex[1], ex[2]), base: new T.Vector3(), opt: !!opt, s: 1 };
    root.add(g); groups.push(g); return g;
  }
  function add(g, geo, color, pos, rot) {
    var mat = new T.MeshStandardMaterial({ color: color, roughness: 0.55, metalness: 0.2, transparent: true });
    var m = new T.Mesh(geo, mat);
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
    var e = new T.LineSegments(new T.EdgesGeometry(geo, 28), new T.LineBasicMaterial({ color: INK[theme], transparent: true, opacity: 0 }));
    m.add(e);
    m.userData = { real: new T.Color(color), edge: e, partId: g.userData.partId, group: g };
    g.add(m); meshes.push(m); return m;
  }
  function box(g, c, w, h, d, pos, rot) { return add(g, new T.BoxGeometry(w, h, d), c, pos, rot); }
  function rod(g, c, a, b, r) {
    var A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]);
    var m = add(g, new T.CylinderGeometry(r, r, A.distanceTo(B), 10), c); // 10 sides: edges stay visible in the sketch look
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    return m;
  }
  function wheel(g, c, r, w, pos) { return add(g, new T.CylinderGeometry(r, r, w, 24), c, pos, [Math.PI / 2, 0, 0]); }

  function build() {
    var g, s, z, x;
    var STEEL = 0x3d4c5c, ALU = 0xb9c4ce, CHROME = 0xd5dce2, DARK = 0x222b33, BLUE = 0x5b6cff;

    // MC-FRM-1000 base frame weldment
    g = part('MC-FRM-1000', [0, 0, 0]);
    rod(g, STEEL, [-0.8, 0.2, -0.27], [0.8, 0.2, -0.27], 0.022);
    rod(g, STEEL, [-0.8, 0.2, 0.27], [0.8, 0.2, 0.27], 0.022);
    [-0.8, -0.55, 0.55, 0.8].forEach(function (xx) { rod(g, STEEL, [xx, 0.2, -0.3], [xx, 0.2, 0.3], 0.022); });

    // MC-CST-6000 castors (4 groups, same part number)
    [[-0.8, -0.3], [-0.8, 0.3], [0.8, -0.3], [0.8, 0.3]].forEach(function (p) {
      var sx = p[0] < 0 ? -1 : 1, sz = p[1] < 0 ? -1 : 1;
      g = part('MC-CST-6000', [sx * 0.32, -0.02, sz * 0.32]);
      g.userData.corner = p;
      rod(g, CHROME, [p[0], 0.2, p[1]], [p[0], 0.15, p[1]], 0.018);
      box(g, 0x5d6b78, 0.12, 0.05, 0.075, [p[0] + 0.02, 0.155, p[1]]);
      box(g, 0x5d6b78, 0.1, 0.09, 0.012, [p[0] + 0.03, 0.105, p[1] - 0.034]);
      box(g, 0x5d6b78, 0.1, 0.09, 0.012, [p[0] + 0.03, 0.105, p[1] + 0.034]);
      wheel(g, 0x2b3640, 0.1, 0.045, [p[0] + 0.035, 0.1, p[1]]);
      wheel(g, 0xaab4bd, 0.045, 0.05, [p[0] + 0.035, 0.1, p[1]]);
      box(g, 0xd9442b, 0.03, 0.02, 0.05, [p[0] - 0.045, 0.165, p[1]]);
    });

    // MC-BRK-6100 central brake linkage + pedal
    g = part('MC-BRK-6100', [0, -0.2, 0]);
    rod(g, 0xd9822b, [-0.8, 0.15, 0], [0.86, 0.15, 0], 0.011);
    rod(g, 0xd9822b, [-0.8, 0.15, -0.3], [-0.8, 0.15, 0.3], 0.011);
    rod(g, 0xd9822b, [0.8, 0.15, -0.3], [0.8, 0.15, 0.3], 0.011);
    box(g, 0xd03a2a, 0.09, 0.018, 0.1, [0.93, 0.15, 0.055], [0, 0, -0.25]);
    box(g, 0x2c9c5a, 0.09, 0.018, 0.1, [0.93, 0.15, -0.055], [0, 0, 0.25]);

    // MC-HYD-2000 hydraulic lift columns (x2)
    [-0.55, 0.55].forEach(function (xx) {
      g = part('MC-HYD-2000', [0, 0.22, 0]);
      rod(g, 0x8d99a6, [xx, 0.2, 0], [xx, 0.5, 0], 0.055);
      rod(g, CHROME, [xx, 0.45, 0], [xx, 0.75, 0], 0.036);
    });

    // MC-HYD-2100 foot pump pedal
    g = part('MC-HYD-2100', [0, 0, 0.42]);
    rod(g, 0x2f6f8f, [0.05, 0.2, 0.27], [0.05, 0.13, 0.46], 0.012);
    box(g, 0x2f6f8f, 0.16, 0.02, 0.09, [0.05, 0.125, 0.49]);

    // MC-FRM-1100 litter frame with deck
    g = part('MC-FRM-1100', [0, 0.5, 0]);
    rod(g, ALU, [-0.98, 0.76, -0.33], [0.98, 0.76, -0.33], 0.02);
    rod(g, ALU, [-0.98, 0.76, 0.33], [0.98, 0.76, 0.33], 0.02);
    [-0.98, -0.55, 0.55, 0.98].forEach(function (xx) { rod(g, ALU, [xx, 0.76, -0.33], [xx, 0.76, 0.33], 0.02); });
    box(g, 0xe7ecf0, 1.3, 0.015, 0.62, [0.31, 0.782, 0]);

    // MC-BKR-3100 backrest (tilted about its hinge)
    g = part('MC-BKR-3100', [-0.15, 0.78, 0]);
    g.position.set(-0.34, 0.782, 0); g.rotation.z = -0.52;
    box(g, 0xcfd8df, 0.62, 0.015, 0.62, [-0.31, 0, 0]);
    rod(g, ALU, [-0.6, -0.015, -0.3], [-0.6, -0.015, 0.3], 0.012);

    // MC-GSP-3200 gas spring
    g = part('MC-GSP-3200', [-0.1, 0.42, 0.3]);
    rod(g, DARK, [-0.22, 0.6, 0.12], [-0.44, 0.79, 0.12], 0.017);
    rod(g, CHROME, [-0.44, 0.79, 0.12], [-0.6, 0.925, 0.12], 0.008);

    // MC-MAT-5000 mattress (seat section + backrest section)
    g = part('MC-MAT-5000', [0, 1.02, 0]);
    box(g, BLUE, 1.3, 0.08, 0.6, [0.31, 0.83, 0]);
    g = part('MC-MAT-5000', [-0.15, 1.1, 0]);
    g.position.set(-0.34, 0.782, 0); g.rotation.z = -0.52;
    box(g, BLUE, 0.62, 0.08, 0.6, [-0.31, 0.048, 0]);

    // MC-RAL-4000 side rails (x2)
    [-0.37, 0.37].forEach(function (zz) {
      g = part('MC-RAL-4000', [0, 0.5, zz < 0 ? -0.45 : 0.45]);
      rod(g, CHROME, [-0.12, 1.03, zz], [0.62, 1.03, zz], 0.014);
      rod(g, CHROME, [-0.12, 0.9, zz], [0.62, 0.9, zz], 0.009);
      [-0.12, 0.125, 0.37, 0.62].forEach(function (xx) { rod(g, CHROME, [xx, 0.76, zz], [xx, 1.03, zz], 0.012); });
    });

    // MC-IVP-4500 IV pole
    g = part('MC-IVP-4500', [-0.25, 0.95, 0.25]);
    rod(g, CHROME, [-0.95, 0.76, 0.33], [-0.95, 1.42, 0.33], 0.014);
    rod(g, CHROME, [-0.95, 1.38, 0.33], [-0.95, 1.86, 0.33], 0.009);
    rod(g, CHROME, [-1.02, 1.86, 0.33], [-0.88, 1.86, 0.33], 0.006);
    rod(g, CHROME, [-0.95, 1.86, 0.26], [-0.95, 1.86, 0.4], 0.006);

    // MC-HDL-7000 push handles
    g = part('MC-HDL-7000', [-0.5, 0.5, 0]);
    [-0.24, 0.24].forEach(function (zz) { rod(g, CHROME, [-0.98, 0.76, zz], [-1.09, 1.06, zz], 0.014); });
    rod(g, DARK, [-1.09, 1.06, -0.26], [-1.09, 1.06, 0.26], 0.018);

    // --- optional powered drive module ---
    g = part('MC-DRV-8100', [0, 0, -0.75], true);          // motor wheel
    box(g, 0x48525c, 0.12, 0.1, 0.1, [0.12, 0.17, 0]);
    wheel(g, 0x1c2229, 0.09, 0.06, [0.12, 0.09, 0]);
    wheel(g, 0x3a78c2, 0.05, 0.065, [0.12, 0.09, 0]);

    g = part('MC-PCB-8200', [0, 0.18, -0.8], true);        // controller PCBA
    box(g, 0x1f8a4c, 0.18, 0.012, 0.13, [0.36, 0.235, 0]);
    box(g, 0x161a1d, 0.04, 0.012, 0.04, [0.33, 0.247, 0.02]);
    box(g, 0x161a1d, 0.025, 0.02, 0.05, [0.4, 0.25, -0.03]);
    box(g, 0xc9a227, 0.02, 0.016, 0.02, [0.3, 0.249, -0.04]);

    g = part('MC-BAT-8300', [-0.15, 0.1, -0.8], true);     // battery pack
    box(g, 0x2f3b33, 0.28, 0.11, 0.2, [-0.2, 0.285, 0]);
    box(g, 0xe2b93b, 0.2, 0.03, 0.202, [-0.2, 0.29, 0]);

    g = part('MC-HRN-8400', [-0.3, 0.1, -0.5], true);      // wiring harness
    var curve = new T.CatmullRomCurve3([
      new T.Vector3(0.27, 0.25, 0), new T.Vector3(0.0, 0.25, 0.08), new T.Vector3(-0.2, 0.3, 0.11),
      new T.Vector3(-0.6, 0.27, 0.2), new T.Vector3(-0.9, 0.5, 0.25), new T.Vector3(-1.0, 0.82, 0.24), new T.Vector3(-1.08, 1.04, 0.2)]);
    add(g, new T.TubeGeometry(curve, 48, 0.008, 8, false), 0xe08a1e);

    g = part('MC-HCT-8500', [-0.6, 0.6, 0.15], true);      // hand control
    box(g, 0x1565a8, 0.06, 0.045, 0.1, [-1.1, 1.085, 0.17]);
    box(g, 0x35c26b, 0.02, 0.012, 0.03, [-1.1, 1.112, 0.17]);

    groups.forEach(function (gr) { gr.userData.base.copy(gr.position); });
  }

  /* ---------------- scenery per lifecycle look ---------------- */
  function pmesh(group, geo, color, pos, opacity) {
    var m = new T.Mesh(geo, new T.MeshStandardMaterial({ color: color, roughness: 0.8, metalness: 0.05, transparent: true, opacity: 0, depthWrite: false }));
    m.material.userData.o = opacity == null ? 1 : opacity;
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    group.add(m); return m;
  }
  function labelTexture() {
    var c = document.createElement('canvas'); c.width = 512; c.height = 320;
    var x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 512, 320);
    x.fillStyle = '#0b3040'; x.font = 'bold 30px Arial'; x.fillText('MediCare Devices Ltd', 20, 44);
    x.font = '26px Arial'; x.fillText('TransPort T-300P  Stretcher', 20, 82);
    x.font = '20px Arial'; x.fillText('SWL 250 kg     REF MC-STR-3000', 20, 114);
    var seed = 7; for (var i = 0; i < 26; i++) for (var j = 0; j < 14; j++) { seed = (seed * 73 + 19) % 101; if (seed % 2 || i === 0 || j === 13) x.fillRect(20 + i * 6, 136 + j * 6, 6, 6); }
    x.font = '19px Consolas, monospace';
    x.fillText('(01)09999999300017', 196, 160); x.fillText('(11)250915', 196, 188); x.fillText('(21)T3P-250001', 196, 216);
    x.font = 'bold 22px Arial'; x.fillText('UDI', 196, 132);
    x.font = '15px Arial'; x.fillText('Training sample. Not a registered identifier.', 20, 300);
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; return t;
  }
  function buildProps() {
    var g, m;
    // windchill: orbiting data rings
    g = new T.Group(); props.windchill = g; props.released = g;
    [1.55, 1.75].forEach(function (r, i) {
      m = new T.Mesh(new T.TorusGeometry(r, 0.006, 6, 96), new T.MeshBasicMaterial({ color: 0x4d9bff, transparent: true, opacity: 0, depthWrite: false }));
      m.material.userData.o = 0.8; m.rotation.x = Math.PI / 2 + (i ? 0.25 : -0.2); m.position.y = 0.7; g.add(m);
    });
    // plant: bench, floor marking, bins
    g = new T.Group(); props.plant = g;
    pmesh(g, new T.BoxGeometry(2.9, 0.01, 1.5), 0xf2c230, [0, -0.012, 0], 0.9);
    pmesh(g, new T.BoxGeometry(2.74, 0.012, 1.34), 0x9aa7b0, [0, -0.01, 0], 1);
    pmesh(g, new T.BoxGeometry(1.4, 0.05, 0.55), 0x8b6b45, [0.2, 0.86, -1.25]);
    [[-0.45, -1.48], [0.85, -1.48], [-0.45, -1.02], [0.85, -1.02]].forEach(function (p) { pmesh(g, new T.BoxGeometry(0.05, 0.84, 0.05), 0x55616b, [p[0], 0.42, p[1]]); });
    pmesh(g, new T.BoxGeometry(0.22, 0.12, 0.18), 0x2a7fa8, [-0.2, 0.945, -1.25]);
    pmesh(g, new T.BoxGeometry(0.22, 0.12, 0.18), 0xd9822b, [0.1, 0.945, -1.25]);
    pmesh(g, new T.BoxGeometry(0.3, 0.3, 0.02), 0x1f2a33, [0.6, 1.15, -1.4]);
    // packaged: pallet, translucent carton, UDI label
    g = new T.Group(); props.packaged = g;
    pmesh(g, new T.BoxGeometry(2.5, 0.1, 1.05), 0x9c7a4d, [0, -0.06, 0]);
    pmesh(g, new T.BoxGeometry(2.4, 1.98, 0.96), 0xc79f6e, [-0.02, 0.99, 0], 0.5);
    m = new T.Mesh(new T.PlaneGeometry(0.62, 0.39), new T.MeshBasicMaterial({ map: labelTexture(), transparent: true, opacity: 0 }));
    m.material.userData.o = 1; m.position.set(0.55, 0.95, 0.485); g.add(m);
    m = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(2.4, 1.98, 0.96)), new T.LineBasicMaterial({ color: 0x7a5a30, transparent: true, opacity: 0 }));
    m.material.userData.o = 0.9; m.position.set(-0.02, 0.99, 0); g.add(m);
    // hospital: floor, wall with sign, blanket and pillow
    g = new T.Group(); props.hospital = g;
    pmesh(g, new T.BoxGeometry(4.2, 0.01, 2.8), 0xcfe3e6, [0, -0.012, -0.2]);
    pmesh(g, new T.BoxGeometry(4.2, 2.3, 0.04), 0xe4f0f1, [0, 1.15, -1.6]);
    pmesh(g, new T.BoxGeometry(0.4, 0.12, 0.02), 0x1b9c6b, [1.2, 1.7, -1.57]);
    pmesh(g, new T.BoxGeometry(0.12, 0.4, 0.02), 0x1b9c6b, [1.2, 1.7, -1.57]);
    pmesh(g, new T.BoxGeometry(0.95, 0.03, 0.58), 0xf7fafb, [0.45, 0.885, 0]);
    m = pmesh(g, new T.BoxGeometry(0.3, 0.07, 0.42), 0xffffff, [-0.72, 1.07, 0]); m.rotation.z = -0.52;
    // service: toolbox and a marker ring on the suspect castor
    g = new T.Group(); props.service = g;
    pmesh(g, new T.BoxGeometry(0.42, 0.2, 0.22), 0xc0392b, [1.25, 0.1, 0.75]);
    pmesh(g, new T.BoxGeometry(0.3, 0.03, 0.05), 0x30363b, [1.25, 0.23, 0.75]);
    m = new T.Mesh(new T.TorusGeometry(0.19, 0.012, 8, 48), new T.MeshBasicMaterial({ color: 0xff8a1e, transparent: true, opacity: 0, depthWrite: false }));
    m.material.userData.o = 1; m.position.set(0.835, 0.1, 0.3); m.userData.pulse = true; g.add(m);
    ['windchill', 'plant', 'packaged', 'hospital', 'service'].forEach(function (k) { props[k].visible = false; props[k].userData.w = 0; scene.add(props[k]); });
  }

  /* ---------------- per-frame update ---------------- */
  var tmpC;
  function update(dt, now) {
    var k = Math.min(1, dt * 5), M = MODES[mode];
    var inkCol = INK[theme];
    explodeT += (explode - explodeT) * k;
    var isService = mode === 'service';

    groups.forEach(function (g) {
      var u = g.userData, ex = explodeT;
      // in Service, the suspect castor (foot end, +z) is pulled out
      var extra = (isService && u.corner && u.corner[0] > 0 && u.corner[1] > 0) ? 0.55 : 0;
      g.position.set(u.base.x + u.ex.x * (ex + extra), u.base.y + u.ex.y * (ex + extra * 0.2), u.base.z + u.ex.z * (ex + extra));
      if (u.opt) { u.s += ((powered ? 1 : 0.001) - u.s) * k; g.scale.setScalar(u.s); g.visible = u.s > 0.01; }
    });
    root.position.y = explodeT * 0.26;

    meshes.forEach(function (m) {
      var mat = m.material, u = m.userData, hi = (hover && u.partId === hover) || (selected && u.partId === selected && now < selUntil);
      tmpC.set(M.col == null ? u.real.getHex() : M.col);
      if (M.col != null) tmpC.lerp(u.real, 0.12);
      mat.color.lerp(tmpC, k);
      mat.opacity += ((hi && M.op < 0.5 ? 0.35 : M.op) - mat.opacity) * k;
      mat.depthWrite = mat.opacity > 0.6;
      tmpC.set(hi ? 0x18c9b8 : M.em); mat.emissive.lerp(tmpC, k * 1.5);
      mat.emissiveIntensity += ((hi ? 0.7 : M.ei) - mat.emissiveIntensity) * k;
      var em = u.edge.material;
      em.opacity += ((hi ? 1 : M.edge) - em.opacity) * k;
      tmpC.set(hi ? 0x18c9b8 : (M.edgeCol === 'ink' ? inkCol : M.edgeCol)); em.color.lerp(tmpC, k);
      u.edge.visible = em.opacity > 0.02;
    });

    ['windchill', 'plant', 'packaged', 'hospital', 'service'].forEach(function (key) {
      var g = props[key], want = (props[mode] === g) ? 1 : 0;
      g.userData.w += (want - g.userData.w) * k;
      g.visible = g.userData.w > 0.01;
      if (!g.visible) return;
      g.traverse(function (o) {
        if (!o.material) return;
        var w = g.userData.w * o.material.userData.o;
        if (o.userData.pulse) { w *= 0.55 + 0.45 * Math.sin(now * 0.006); var sc = 1 + 0.12 * Math.sin(now * 0.006); o.scale.set(sc, sc, sc); }
        o.material.opacity = w; o.material.depthWrite = w > 0.9;
      });
    });
    if (props.windchill.visible) {
      props.windchill.children[0].rotation.z += dt * 0.5; props.windchill.children[1].rotation.z -= dt * 0.35;
      var rc = mode === 'released' ? 0x2fd08f : 0x4d9bff;
      props.windchill.children.forEach(function (o) { tmpC.set(rc); o.material.color.lerp(tmpC, k); });
    }

    if (autoRotate && !opts.reduced) camT.th += dt * 0.12;
    cam.th += (camT.th - cam.th) * k; cam.ph += (camT.ph - cam.ph) * k; cam.r += (camT.r - cam.r) * k;
    var sp = Math.sin(cam.ph);
    camera.position.set(target.x + cam.r * sp * Math.sin(cam.th), target.y + cam.r * Math.cos(cam.ph), target.z + cam.r * sp * Math.cos(cam.th));
    camera.lookAt(target);
  }
  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    update(dt, now);
    renderer.render(scene, camera);
  }

  /* ---------------- interaction ---------------- */
  function pick(e) {
    var r = el.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(meshes.filter(function (m) { return m.userData.group.visible; }), false);
    return hits.length ? hits[0].object.userData.partId : null;
  }
  function bind() {
    var down = null, moved = false;
    el.addEventListener('pointerdown', function (e) {
      down = { x: e.clientX, y: e.clientY, th: camT.th, ph: camT.ph }; moved = false; autoRotate = false;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* not capturable */ }
    });
    el.addEventListener('pointermove', function (e) {
      if (down) {
        var dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
        camT.th = down.th - dx * 0.008;
        camT.ph = Math.max(0.25, Math.min(1.52, down.ph - dy * 0.006));
        if (moved) { hover = null; opts.onHover && opts.onHover(null); }
      } else if (e.pointerType !== 'touch') {
        var id = pick(e);
        hover = id; el.style.cursor = id ? 'pointer' : '';
        opts.onHover && opts.onHover(id, e.clientX, e.clientY);
      }
    });
    el.addEventListener('pointerup', function (e) {
      if (down && !moved) { var id = pick(e); if (id) { opts.onHover && opts.onHover(null); opts.onPick && opts.onPick(id); } }
      down = null;
    });
    el.addEventListener('pointercancel', function () { down = null; });
    el.addEventListener('pointerleave', function () { if (!down) { hover = null; opts.onHover && opts.onHover(null); } });
    el.addEventListener('wheel', function (e) {
      e.preventDefault(); autoRotate = false;
      camT.r = Math.max(1.8, Math.min(9, camT.r * (e.deltaY > 0 ? 1.1 : 0.9)));
    }, { passive: false });
    if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener('resize', resize);
  }
  function resize() {
    var w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (!running && api.ready) { update(0.016, performance.now()); renderer.render(scene, camera); }
  }

  /* ---------------- public API ---------------- */
  api.init = function (container, o) {
    el = container; opts = o || {}; theme = opts.theme || 'light';
    if (!T) { el.innerHTML = '<p class="fallback">The 3D viewer could not load (Three.js is unavailable). The rest of the site works without it.</p>'; return; }
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      el.innerHTML = '<p class="fallback">This browser cannot show the 3D model (WebGL is unavailable). Use the Parts list instead.</p>'; return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = T.sRGBEncoding;
    el.appendChild(renderer.domElement);
    scene = new T.Scene();
    camera = new T.PerspectiveCamera(36, 1.6, 0.1, 50);
    target = new T.Vector3(0, 0.72, 0);
    scene.add(new T.HemisphereLight(0xffffff, 0x8899aa, 0.95));
    var d = new T.DirectionalLight(0xffffff, 0.75); d.position.set(3, 6, 4); scene.add(d);
    var d2 = new T.DirectionalLight(0xbfe0ff, 0.3); d2.position.set(-4, 3, -3); scene.add(d2);
    root = new T.Group(); scene.add(root);
    raycaster = new T.Raycaster(); pointer = new T.Vector2(); tmpC = new T.Color();
    build(); buildProps(); bind();
    api.ready = true; resize();
    meshes.forEach(function (m) { m.material.opacity = MODES[mode].op; m.userData.edge.material.opacity = MODES[mode].edge; });
    api.start();
  };
  api.start = function () { if (!api.ready || running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
  api.stop = function () { running = false; cancelAnimationFrame(raf); };
  api.setMode = function (id) {
    if (!MODES[id]) return; mode = id;
    var c = MODES[id].cam; camT.ph = c.ph; camT.r = c.r;
    // turn the shortest way to the preset angle
    var two = Math.PI * 2, diff = ((c.th - camT.th) % two + two * 1.5) % two - Math.PI; camT.th += diff;
  };
  api.setExplode = function (v) { explode = Math.max(0, Math.min(1, v)); };
  api.setPowered = function (v) { powered = !!v; };
  api.setTheme = function (t) { theme = t === 'dark' ? 'dark' : 'light'; };
  api.highlight = function (id) { hover = id; };
  api.select = function (id, fly) { selected = id; selUntil = performance.now() + 2600; if (fly) { camT.r = Math.min(camT.r, 4.2); } };
  api.zoom = function (f) { autoRotate = false; camT.r = Math.max(1.8, Math.min(9, camT.r * f)); };
  api.resetView = function () { var c = MODES[mode].cam; camT.th = c.th; camT.ph = c.ph; camT.r = c.r; };
  api.flyTo = function (c) { if (c.th != null) camT.th = c.th; if (c.ph != null) camT.ph = c.ph; if (c.r != null) camT.r = c.r; autoRotate = false; };
  window.Stretcher3D = api;
})();
