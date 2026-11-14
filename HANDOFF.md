# Project handoff: Stretcher Lifecycle Journey

Give this file to any AI model or developer who continues the work. It holds the brief, the decisions made along the way, how the code is organised, and how to change it safely.

- Repository: `Madhubabun/Production_workflow` (public), branch `main`
- Live site (GitHub Pages, deploys on every push to `main`): https://madhubabun.github.io/Production_workflow/

## 1. What this is

An interactive learning website that shows how a medical device, a hospital patient transport stretcher, travels from idea → 3D CAD (Creo) → Windchill → approvals → manufacturing plan → SAP → production → packaging / UDI → market → service → complaint / CAPA feedback.

**Audience:** an engineering team, new joiners and non-technical people. A beginner must understand everything; expert depth is one click away.

**Subject-matter stance:** written as a senior PTC Windchill 13 + Creo + SAP S/4HANA + medical device QMS architect (FDA QMSR / 21 CFR 820, 21 CFR Part 11, ISO 13485, ISO 14971, IEC 62366, IEC 60601-1, EU MDR, UDI / GUDID / EUDAMED).

## 2. Hard rules (do not break these)

1. **Plain HTML + CSS + JS.** No build step, no backend, no framework. Must work directly on GitHub Pages.
2. **Only external dependency:** Three.js r128 from `cdnjs.cloudflare.com`. No external fonts, images or other libraries.
3. **Data-driven:** all content lives in the data files; the UI renders from it. Add content by editing data, not by hard-coding text in `app.js`.
4. **Everything is invented.** Fictional company "MediCare Devices Ltd". No real company, employee, customer or supplier names. The repo is public.
5. **Consistency:** the same part numbers, revisions, suppliers, lots, record IDs, dates and UDI values everywhere. Check existing data before inventing a new number.
6. **Mark uncertainty:** module names, licences and version-specific behaviour get a `{V}` (VERIFY) badge.
7. **Edit files in place.** Do not rewrite whole files.
8. **Accessible and responsive:** keyboard focus, readable contrast, light and dark mode, no horizontal page scroll at phone width (wide tables scroll inside their own container).
9. **No console errors** before any push. Test, then commit and push to `main` with a clear message.
10. **Plain language first.** The owner asked several times for simpler explanations with pictures and examples. Prefer a picture or a concrete example over a definition.

## 3. Decisions the owner made during the build

- **Look:** colourful, aimed at a young audience. One colour per stage (`--s1` … `--s10`), gradient hero and buttons. This replaced the original "calm blues and teals" idea.
- **Pictures everywhere:** drawers and pages show a rendered 3D picture of the relevant parts ("In our stretcher", part details, tracer, CAPA story, BOM page, story).
- **Parallel lanes made easy:** plain names (Teamwork & plan, Suppliers, Safety risks, Quality checks, Legal approval), a short label in every cell, and example cards under the map. No anonymous dots.
- **One everyday comparison:** a restaurant putting a new dish on the menu. Use it for any new explanation instead of inventing a new analogy.
- **Layman features:** story mode with read-aloud, voice narration in the tour, "a day in the life" per role, "How BOMs are made" with pictures.
- **Second product:** a bicycle, for the easy pages only (3D viewer, story, BOM page). The regulated 10-stage journey, records, tracer and CAPA story stay with the stretcher.

## 4. Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell: header, nav, home sections, drawer, tooltip, tour bar. Loads the scripts in order. |
| `styles.css` | Design tokens (light / dark) and all styling. Later phases are appended at the bottom under "Phase N" comments. |
| `data.js` | `window.MD`: the single data object (see section 5). |
| `data-terms.js` | Glossary terms, added to `MD.terms` through the helper `T(...)`. |
| `stretcher3d.js` | Procedural 3D models (stretcher and bicycle), lifecycle looks, orbit controls, picture snapshots. Exposes `window.Stretcher3D`. |
| `app.js` | Everything else: rich text, tooltip, drawer, home page, all other pages, routing, tour, voice. |
| `tools/check.js` | Validation script (see section 8). |
| `README.md` | Public description of the site. |
| `.nojekyll` | Tells GitHub Pages not to process the files. |

## 5. Data model (`window.MD` in `data.js`)

| Key | Content |
| --- | --- |
| `company`, `product`, `people`, `roles`, `systems` | Basics. `people` maps role ID to an invented name. |
| `flows` | Data packets between systems; `st` lists the stages where each is shown. |
| `lanes`, `laneInfo` | The five parallel lanes: one line per stage, plus plain name, meaning and short cell labels. |
| `stages` | 10 stages. Each: `tagline`, `purpose`, `happens`, `objects`, `qms`, `tables`, `raci`, `evidence`, `pitfalls`, `best`, optional `mini`. |
| `parts` | 20 stretcher parts (one per WTPart) with attributes, alternates (`alt`) and substitutes (`sub`). |
| `threads` | Digital thread per part number, used by "Follow a part". |
| `miniFlows` | Procurement and service mini-animations. |
| `tour` | Narration for "Play the journey", one caption per stage. |
| `story` | Story mode pages (stretcher "Stella"). |
| `kitchen` | The restaurant comparison: per stage, per lane, per term. |
| `days` | "A day in the life" per role: `[time, title, text, screen, signs?]`. |
| `boms` | "How BOMs are made": EBOM, MBOM, SAP BOM, Service BOM, Packaging BOM, each with steps, pictures and a tree. |
| `bike` | The bicycle: parts, story ("Billy") and BOM overrides. Missing BOM fields fall back to `MD.boms`. |
| `roleInfo` | Per role: description, screens, deliverables. Tasks are derived from stage RACI rows. |
| `modules` | QMS / module map rows. |
| `capa` | The 15-step story "Brake fails to lock on one castor", each step with a sample record and signatures. |
| `modes` | Names of the 3D lifecycle looks. |
| `terms` | Filled by `data-terms.js`. |

### Text markup inside data strings

- `[[term-id]]` or `[[term-id|shown text]]` → underlined glossary term (hover tooltip, click opens the drawer)
- `[[p:MC-CST-6000]]` → link to a part
- `[[s:3]]` → link to a stage
- `{V}` → VERIFY badge
- `{ s: "...", x: "..." }` → Simple and Expert wording; the global switch picks one

Tip: when a term name is long and sits inside brackets, use the custom-text form, for example `([[po|PO]])`.

### RACI rows

`['Activity', 'DE:R QE:A ME:C', true]` — the third value marks an approval that needs a Part 11 electronic signature. Role IDs: DE, ME, QE, RA, SC, SQ, CA, PR, SE, CH, MG.

### Adding a glossary term

In `data-terms.js`: `T(id, name, category, tip, simple, analogy, expert, example, 'related ids separated by spaces')`. Add a line to `MD.kitchen.terms` if the restaurant comparison fits.

## 6. Key invented data (keep consistent)

- Product: TransPort T-300, top part `MC-STR-3000`; variants T-300M (manual) and T-300P (powered). Safe working load 250 kg.
- UDI sample: `(01)09999999300017(11)250915(21)T3P-250001` (made-up prefix).
- Plant 1000, benches B1–B4 and PK1, process plan `PP-T300-01`, operations OP10–OP80.
- Timeline: design released 2025-03-10 (`PR-2025-0042`, baseline `BL-0007`); first production September 2025 (order `1000234`, serials `T3P-250001` to `-250020`); complaint `CMP-2026-0231` on 2026-05-06 (serial `T3P-250118`, castor lot `NCW-L2510`); `CAPA-2026-0017`; `NC-2026-0113` (lot `NCW-L2604`); `SCAR-2026-0009`; `PRB-2026-0058` → `CR-2026-0044` → `CN-2026-0039`; revision B effective from serial `T3P-260400` (2026-07-13); bulletin `SB-T300-004`; closure 2026-10-26.
- Suppliers (invented): Norvale Castor Works, Rollaxis Components, Quillon Wheels, Helixa Hydraulics, Brightspan Gas Springs, Calder Foam & Textiles, Arden Tube & Profile, Kestrel Motion Drives, Tessera Electronics, Voltaris Power Systems, Pinecrest Packaging & Print, Dextrin Industrial Supply.
- Bicycle: CityRide B-200, part numbers `BK-...`.

## 7. How the app works

- **Routing:** plain hash names only: `#home`, `#stage-1` … `#stage-10`, `#parts`, `#boms`, `#trace`, `#capa`, `#roles`, `#modules`, `#story`, `#kitchen`, `#glossary`. The function `route()` renders the page; `isHomeRoute()` holds the list of non-home routes, so add new routes in both places and in the nav in `index.html`.
- **Home** (`#home`) is a persistent section containing the 3D canvas; other pages render into `#page`.
- **Events** are delegated from `document` using `data-*` attributes (`data-term`, `data-part`, `data-stage-sel`, `data-lane`, `data-product`, `data-play`, …).
- **Drawer:** `openDrawer({ kicker, title, sub, tabs: [{ label, html }] })`.
- **3D pictures:** put `snapFig(ids, { look, ex, cap, prod })` into any HTML string, then call `hydrateSnaps(container)` after inserting it (the drawer and `route()` already do). `ids = []` shows the whole product.
- **`Stretcher3D` API:** `init`, `start`, `stop`, `setMode`, `setExplode`, `setPowered`, `setTheme`, `setProduct`, `highlight`, `select`, `zoom`, `resetView`, `flyTo`, `orbit`, `snapshot(ids, w, h, look, explode, product)`.
- **Lifecycle looks:** `idea`, `creo`, `windchill`, `released`, `plant`, `packaged`, `hospital`, `service`.
- **Voice:** `say(text, rate, done)` and `hush()` wrap the browser's speech synthesis; both degrade silently when no voice exists.
- **Remembered in the browser** (wrapped in try / catch): level, theme, role, product, traced part, voice on / off.

## 8. How to test and ship

1. Serve the folder: `python -m http.server 8000`, then open `http://localhost:8000/`.
2. Run the checker: `node tools/check.js .` It loads the data, confirms every `[[...]]` reference and related-term ID exists, and syntax-checks `app.js` and `stretcher3d.js`. It must report `problems: 0`.
3. In the browser: open every route, switch Simple / Expert, light / dark, and phone width. The console must be empty.
4. Commit and push to `main`. GitHub Pages updates within about a minute. After pushing, hard-reload the live site, because browsers cache the script files.

## 9. Things that bit during the build

- A CSS `display` rule overrides the `hidden` attribute. `styles.css` has `[hidden] { display: none !important; }`; keep it.
- When replacing a string in code, check it does not also occur inside a helper you just added.
- Cylinders need few sides (10) so their edges show in the sketch look.
- Background or throttled tabs run animation frames slowly; the tour uses real elapsed time and has a time-out so it never stalls.
- Speech synthesis may be silent or blocked in some embedded viewers; never make progress depend on it alone.
- The bicycle reuses the stretcher's scenery. Hospital and service scenery are hidden for the bicycle.

## 10. Open points and ideas

- **Regulatory review:** the CAPA story records the brake complaint as "not reportable" with a rationale. A real Regulatory Affairs lead should confirm that is the lesson wanted.
- **VERIFY items:** Windchill module names, licences and SAP mappings must be checked against the actual release.
- **Supplier and people names** are invented but were not checked against real companies.
- **Navigation** has ten items and wraps on narrower screens; a grouped menu would be tidier.
- Ideas not built: "You decide" challenges, a quiz with badges per stage, a build-the-stretcher drag game, "what if?" switches, before / after pictures, a two-minute version, a plain-words mode that swaps the jargon itself, a search that also finds parts and records.

## 11. Prompt to start a new session

Copy this, then attach or point to the repository:

> You are continuing an existing project: an interactive, data-driven learning website about how a hospital stretcher travels from idea to CAD, Windchill, SAP, production, UDI, service and CAPA. Read `HANDOFF.md` first and follow its hard rules: plain HTML / CSS / JS with no build step, Three.js r128 from cdnjs as the only dependency, all content in `data.js` and `data-terms.js`, everything invented and consistent, edit files in place, keep it understandable to a non-technical reader with pictures and the restaurant comparison, test with `node tools/check.js .` and in a browser with no console errors, then commit and push to `main`. My request is: …
