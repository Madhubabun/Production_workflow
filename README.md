# Stretcher Lifecycle Journey

An interactive learning website that follows one medical device, the fictional **TransPort T-300 hospital patient transport stretcher** from **MediCare Devices Ltd**, through its whole life:

Idea → 3D CAD (Creo) → Windchill → review and release → manufacturing plan → SAP → production → packaging / UDI → market → service → complaint / CAPA feedback.

Live site: https://madhubabun.github.io/Production_workflow/

It is written for engineering teams, new joiners and non-technical readers. Everything is explained in plain language, with expert depth one click away.

> **All data is invented.** Every company, person, supplier, part number, record and UDI value is made up for training. Items marked `VERIFY` depend on your Windchill / SAP release, licences or configuration.

## Features

- "Start here" welcome with a 30-second explanation
- **Story mode**: the stretcher's life as a 10-page picture book with no jargon, which the browser can read aloud
- **Restaurant view**: one everyday comparison (a restaurant putting a new dish on the menu) used across stages, teams and terms
- **How BOMs are made**: engineering, manufacturing, SAP, service and packaging parts lists explained side by side, each with 3D pictures, the steps that create it and its tree
- **A day in the life**: for each of the 11 roles, a short timeline of a working day with the screens used and what gets signed
- **Study with a bicycle**: switch the 3D viewer, the story and the BOM page to a simpler second product (the regulated journey stays with the stretcher)
- **Play the journey**: a guided tour that walks through all 10 stages with spoken narration (with a mute button), while the 3D stretcher changes its look. Play / pause, previous / next, speed, jump to stage, progress bar
- Animated journey map of the 10 stages. Underneath, five teams work alongside (teamwork, suppliers, safety risks, quality checks, legal approval), each with a plain-language label per stage and example cards
- 3D stretcher built from Three.js primitives: orbit, zoom, explode view, hover tooltips, click a part for details, optional powered drive module
- Lifecycle looks for the 3D model: idea sketch → Creo CAD → managed in Windchill → released → plant bench → packed with UDI label → in hospital → service
- Animated data packets between Creo, Windchill, SAP, MES, supplier and service
- Hover and click on everything: each term has a one-line tooltip and a drawer with Simple / Expert / In our stretcher / Related tabs. "In our stretcher" shows a 3D picture with the relevant parts highlighted
- Global Simple / Expert switch, light / dark mode, keyboard accessible
- Full pages for all 10 stages: purpose, what happens, Windchill objects and states, sample tables, RACI with Part 11 signature markers, audit evidence, data flow, pitfalls, best practices
- Animated mini-journeys: procurement (MRP → PR → PO → supplier → goods receipt → incoming inspection → stock) and service (field issue → service order → spare part → repair → record → feedback)
- **Follow a part**: pick any part and see its 16-step digital thread, with attributes, approved manufacturers, alternates and substitutes
- **CAPA story**: "Brake fails to lock on one castor" in 15 steps from complaint intake to closure, with a sample record (ID, dates, owner, status, signatures) at every step
- **Roles**: choose one of 11 roles to see its tasks, approvals, screens and deliverables, a full RACI table, and which approvals need Part 11 electronic signatures. The choice also highlights that role across the site
- **Module map**: QMS process | Windchill module | key objects | SAP counterpart | how it is delivered, with VERIFY badges
- Parts and BOM page, searchable A–Z glossary with 160 terms

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `styles.css` | Design tokens (light / dark) and all styling |
| `data.js` | The single data object `window.MD`: product, roles, systems, flows, lanes, stages, parts, mini-flows, part threads, tour narration, role info, module map, CAPA story |
| `data-terms.js` | Glossary terms, added to `MD.terms` |
| `stretcher3d.js` | Procedural 3D stretcher and bicycle, lifecycle looks, part pictures |
| `app.js` | Renders the UI from the data: map, drawer, pages, routing |
| `tools/check.js` | Checks the data: run `node tools/check.js .` before pushing |
| `HANDOFF.md` | Brief, decisions, data model and how to continue the work (for developers and AI models) |

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
