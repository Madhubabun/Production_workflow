# Stretcher Lifecycle Journey

An interactive learning website that follows one medical device, the fictional **TransPort T-300 hospital patient transport stretcher** from **MediCare Devices Ltd**, through its whole life:

Idea → 3D CAD (Creo) → Windchill → review and release → manufacturing plan → SAP → production → packaging / UDI → market → service → complaint / CAPA feedback.

Live site: https://madhubabun.github.io/Production_workflow/

It is written for engineering teams, new joiners and non-technical readers. Everything is explained in plain language, with expert depth one click away.

> **All data is invented.** Every company, person, supplier, part number, record and UDI value is made up for training. Items marked `VERIFY` depend on your Windchill / SAP release, licences or configuration.

## Features

**Available now (Phase 1)**

- "Start here" welcome with a 30-second explanation
- Animated journey map of the 10 stages, with five parallel lanes (ProjectLink, Supplier Management, Risk, Quality, Regulatory)
- 3D stretcher built from Three.js primitives: orbit, zoom, explode view, hover tooltips, click a part for details, optional powered drive module
- Lifecycle looks for the 3D model: idea sketch → Creo CAD → managed in Windchill → released → plant bench → packed with UDI label → in hospital → service
- Animated data packets between Creo, Windchill, SAP, MES, supplier and service
- Hover and click on everything: each term has a one-line tooltip and a drawer with Simple / Expert / In our stretcher / Related tabs
- Global Simple / Expert switch, light / dark mode, keyboard accessible
- Full stage pages for stages 1–4: purpose, what happens, Windchill objects and states, sample tables (requirements, hazards, DFMEA, EBOM, alternates vs substitutes, AML, V&V, promotion request, e-signatures), RACI with Part 11 signature markers, audit evidence, pitfalls, best practices
- Parts and BOM page, searchable A–Z glossary (99 terms so far)

**Planned**

- Phase 2: full pages for stages 5–10, procurement and service animations, "follow a part" digital thread
- Phase 3: brake complaint → CAPA story, role views, QMS module map, 150+ glossary terms, guided "Play the journey" tour

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | Design tokens (light / dark) and all styling |
| `data.js` | The single data object `window.MD`: product, roles, systems, flows, lanes, stages, parts |
| `data-terms.js` | Glossary terms, added to `MD.terms` |
| `stretcher3d.js` | Procedural 3D stretcher and lifecycle looks |
| `app.js` | Renders the UI from the data: map, drawer, pages, routing |

No build step and no backend. The only external dependency is Three.js r128 from cdnjs.

## Editing content

All content lives in `data.js` and `data-terms.js`. Text markup:

- `[[term-id]]` or `[[term-id|shown text]]` links a glossary term
- `[[p:MC-CST-6000]]` links a part, `[[s:3]]` links a stage
- `{V}` shows a VERIFY badge
- `{ s: "...", x: "..." }` holds Simple and Expert wording

## Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000/
