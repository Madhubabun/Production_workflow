// Validates the site data. Usage:  node tools/check.js .
// - loads data.js and data-terms.js
// - syntax-checks app.js and stretcher3d.js
// - confirms every [[term]], [[p:PART]] and [[s:N]] reference resolves
// - confirms related-term IDs, lane terms and system terms exist
// Exits with code 1 when a problem is found.
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = process.argv[2] || '.';
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['data.js', 'data-terms.js']) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
for (const f of ['app.js', 'stretcher3d.js']) new vm.Script(fs.readFileSync(path.join(dir, f), 'utf8'), { filename: f });
const MD = ctx.window.MD, terms = MD.terms, parts = new Set(MD.parts.map(p => p.id));
let bad = 0;
for (const m of JSON.stringify(MD).matchAll(/\[\[([^\]|"\[]+)(?:\|[^\]]+)?\]\]/g)) {
  const id = m[1];
  if (id.startsWith('p:')) { if (!parts.has(id.slice(2))) { console.log('missing part', id); bad++; } }
  else if (id.startsWith('s:')) { if (!(+id.slice(2) >= 1 && +id.slice(2) <= MD.stages.length)) { console.log('bad stage', id); bad++; } }
  else if (!terms[id]) { console.log('missing term', id); bad++; }
}
for (const t of Object.values(terms)) for (const r of t.rel) if (!terms[r]) { console.log('bad related term', t.id, '->', r); bad++; }
for (const p of MD.parts) for (const r of p.rel || []) if (!terms[r]) { console.log('bad part term', p.id, r); bad++; }
for (const l of MD.lanes) {
  if (!terms[l.term]) { console.log('bad lane term', l.term); bad++; }
  if (l.cells.length !== MD.stages.length) { console.log('lane needs one cell per stage', l.id); bad++; }
}
for (const s of MD.systems) if (!terms[s.term]) { console.log('bad system term', s.term); bad++; }
for (const k of Object.keys((MD.kitchen || {}).terms || {})) if (!terms[k]) { console.log('restaurant comparison for unknown term', k); bad++; }
for (const m of MD.modules || []) if (!terms[m.term]) { console.log('bad module term', m.term); bad++; }
console.log('terms:', Object.keys(terms).length, 'parts:', MD.parts.length, 'problems:', bad);
process.exit(bad ? 1 : 0);
