/* ==========================================================================
   MediCare Devices Ltd — TransPort T-300 stretcher learning site
   data.js : the single structured data object the whole UI renders from.
   ALL DATA IS INVENTED for training. No real company, person, supplier or
   device record is represented.

   Text markup used in strings:
     [[term-id]]            -> underlined glossary term (hover tip, click drawer)
     [[term-id|shown text]] -> same, with custom wording
     [[p:PART-NUMBER]]      -> link to a part
     [[s:3]]                -> link to a stage
     {V}                    -> small VERIFY badge (check for your Windchill/SAP release)
   Fields written as {s: "...", x: "..."} hold the Simple and Expert wording.
   ========================================================================== */
window.MD = {
  company: 'MediCare Devices Ltd',
  product: {
    name: 'TransPort T-300',
    kind: 'Hospital patient transport stretcher',
    top: 'MC-STR-3000',
    variants: [
      { code: 'T-300M', name: 'Manual', note: 'Pushed by hand. No electrical parts.' },
      { code: 'T-300P', name: 'Powered', note: 'Adds the powered drive module MC-DRV-8000 (motor, controller, battery, harness, hand control).' }
    ],
    udiDi: '(01)09999999300017',
    udiSample: '(01)09999999300017(11)250915(21)T3P-250001',
    swl: '250 kg',
    note: 'UDI values use a made-up company prefix and are not registered anywhere.'
  },

  /* People are invented. They appear on sample records and signatures. */
  people: {
    DE: 'Asha Verma', ME: 'Marco Rossi', QE: 'Daniel Okoro', RA: 'Lena Fischer', SC: 'Tom Becker',
    SQ: 'Mei Tanaka', CA: 'Priya Nair', PR: 'Carlos Mendes', SE: 'Hannah Lindqvist', CH: 'Omar Haddad', MG: 'Grace Whitfield'
  },

  roles: [
    { id: 'DE', name: 'Design Engineer', tip: 'Designs the parts in Creo and owns the engineering BOM.' },
    { id: 'ME', name: 'Manufacturing Engineer', tip: 'Decides how the stretcher is built: MBOM, process plan, work instructions.' },
    { id: 'QE', name: 'Quality Engineer', tip: 'Checks that design and production follow the quality system; owns risk file and CAPA work.' },
    { id: 'RA', name: 'Regulatory Affairs', tip: 'Makes sure the device may legally be sold: classification, submissions, UDI, reporting.' },
    { id: 'SC', name: 'Supply Chain / Purchasing', tip: 'Buys parts: sourcing, purchase orders, lead times.' },
    { id: 'SQ', name: 'Supplier Quality', tip: 'Qualifies suppliers and handles supplier problems (SCAR).' },
    { id: 'CA', name: 'Change Admin / CCB', tip: 'Runs the change process and the Change Control Board.' },
    { id: 'PR', name: 'Production / Plant', tip: 'Builds, inspects and packs the stretcher at the plant.' },
    { id: 'SE', name: 'Service Engineer', tip: 'Installs, maintains and repairs stretchers in hospitals.' },
    { id: 'CH', name: 'Complaint Handler', tip: 'Records and evaluates customer complaints, including whether authorities must be told.' },
    { id: 'MG', name: 'Management', tip: 'Provides resources, approves the plan and reviews the quality system.' }
  ],

  /* The systems that data packets travel between. */
  systems: [
    { id: 'creo', name: 'Creo', sub: '3D CAD', term: 'creo' },
    { id: 'wc', name: 'Windchill', sub: 'PLM', term: 'windchill' },
    { id: 'sap', name: 'SAP S/4HANA', sub: 'ERP', term: 'sap' },
    { id: 'mes', name: 'MES', sub: 'Shop floor', term: 'mes' },
    { id: 'sup', name: 'Supplier', sub: 'Purchased parts', term: 'avl' },
    { id: 'svc', name: 'Service', sub: 'Hospital & field', term: 'complaint' }
  ],

  /* Data packets. "st" lists the stages in which the packet is shown moving. */
  flows: [
    { from: 'wc', to: 'creo', label: 'Design inputs, start parts, templates', st: [1] },
    { from: 'creo', to: 'wc', label: 'CAD documents: models + drawings (check-in)', st: [2] },
    { from: 'creo', to: 'wc', label: 'CAD structure builds WTParts (EBOM)', st: [3] },
    { from: 'wc', to: 'sup', label: 'Released drawings + specs for quotation', st: [4] },
    { from: 'wc', to: 'mes', label: 'Process plan, work instructions', st: [5] },
    { from: 'wc', to: 'sap', label: 'Material masters, BOM, routing, change number', st: [6] },
    { from: 'sap', to: 'sup', label: 'Purchase orders', st: [6, 7] },
    { from: 'sup', to: 'sap', label: 'Goods receipt → inspection lots', st: [7] },
    { from: 'sap', to: 'mes', label: 'Production orders', st: [7] },
    { from: 'mes', to: 'sap', label: 'Confirmations, serial numbers, as-built record', st: [7, 8] },
    { from: 'sap', to: 'svc', label: 'Shipped serials + UDI, installed base', st: [8] },
    { from: 'svc', to: 'sap', label: 'Service orders, spare-part demand', st: [9] },
    { from: 'svc', to: 'wc', label: 'Complaints → CAPA → change request', st: [10] }
  ],

  /* Parallel lanes. One short line per stage (index 0 = stage 1). */
  lanes: [
    { id: 'projectlink', name: 'ProjectLink collaboration', term: 'projectlink', cells: [
      'Project "T-300 NPD" created: plan, milestones, team, shared folders.',
      'Design tasks assigned; work-in-progress CAD shared with the project team.',
      'BOM review actions tracked as project deliverables.',
      'Design-freeze gate: deliverables must be Released before the milestone closes.',
      'Manufacturing readiness tasks; plant team joins the project.',
      'ERP cut-over checklist tracked as project activities.',
      'Pilot-build issues logged and assigned.',
      'Launch-readiness gate: labels, IFU and registrations complete.',
      'Project closed; lessons learned stored for the next device.',
      'Improvement projects started for larger design changes.' ] },
    { id: 'suma', name: 'Supplier Management (AML / AVL)', term: 'suma', cells: [
      'Long-lead and high-risk bought parts identified (castors, hydraulics, battery).',
      'Supplier CAD and datasheets stored as manufacturer parts.',
      'Approved manufacturers (AML) linked to each bought WTPart.',
      'Supplier qualification evidence reviewed before release.',
      'Approved vendors (AVL) set per plant in the sourcing context.',
      'AML/AVL sent to SAP as source lists and info records.',
      'Incoming inspection results feed supplier scorecards.',
      'Packaging and label suppliers controlled the same way.',
      'Spare-part suppliers and obsolescence notices monitored.',
      'Supplier corrective action (SCAR) raised when a bought part is the cause.' ] },
    { id: 'risk', name: 'Risk management', term: 'risk-file', cells: [
      'Risk management plan and first hazard list written.',
      'DFMEA built alongside the design; risk controls become design features.',
      'Safety-critical parts flagged on the BOM.',
      'Risk controls verified; benefit-risk conclusion signed.',
      'PFMEA for the assembly process; control plan defined.',
      'Critical characteristics sent to SAP QM inspection plans.',
      'Process risk controls executed (torque checks, brake test).',
      'Residual risks disclosed in the IFU and on labels.',
      'Field data reviewed against risk estimates.',
      'Risk file updated when complaints show a new or more frequent hazard.' ] },
    { id: 'quality', name: 'Quality / QMS', term: 'iso13485', cells: [
      'Design and development plan approved; DHF opened.',
      'Design outputs controlled as documents; design reviews held.',
      'Document and BOM control by lifecycle state and revision.',
      'Verification and validation records; electronic signatures on release.',
      'Process validation (IQ/OQ/PQ) planned; design transfer checklist.',
      'Device master record content available in ERP and MES.',
      'DHR built per serial number; nonconformances go to MRB.',
      'Final release by quality; labels verified.',
      'Service records and complaints captured.',
      'CAPA opened, root cause fixed, effectiveness checked.' ] },
    { id: 'regulatory', name: 'Regulatory', term: 'eumdr', cells: [
      'Classification and regulatory strategy for US and EU.',
      'Applicable standards list (IEC 60601-1 for the powered version).',
      'UDI-DI planned per variant and packaging level.',
      'Technical documentation compiled; submission or self-declaration prepared.',
      'Labeling and IFU content confirmed for each market.',
      'Country-specific label variants controlled as BOM options.',
      'Registered manufacturing site; audit readiness.',
      'GUDID / EUDAMED device records submitted; declaration of conformity signed.',
      'Post-market surveillance plan running.',
      'Reportability decisions: eMDR (US) and vigilance (EU).' ] }
  ],

  /* ---------------------------------------------------------------------
     STAGES. Stages 1-4 carry full detail (Phase 1). Stages 5-10 carry the
     summary now and gain full detail pages in Phase 2.
     --------------------------------------------------------------------- */
  stages: [
    {
      n: 1, name: 'Idea & Requirements', short: 'Idea', mode: 'idea', sys: ['wc'], full: true,
      tagline: { s: 'Decide what the stretcher must do, for whom, and what could go wrong.',
                 x: 'Design planning, user needs, design inputs, first hazard analysis, regulatory strategy.' },
      purpose: {
        s: `Before anyone draws anything, the team writes down what nurses, porters and patients need, and turns each need into something that can be measured. It works like a recipe card written before cooking: if it is not on the card, it will not be in the dish. The team also lists what could hurt someone, so safety is designed in from the start.`,
        x: `Design and development planning and design inputs per [[iso13485]] clauses 7.3.2 and 7.3.3, which [[qmsr]] incorporates by reference. [[user-need]]s are captured and converted into verifiable [[design-input]]s. The risk management plan and preliminary hazard analysis follow [[iso14971]]; the use specification follows [[iec62366]]. Every record is a controlled [[wtdocument]] and becomes part of the [[dhf]] from day one.` },
      happens: {
        s: [
          `Marketing and clinical staff describe the idea: a stretcher that one porter can push with a patient of up to 250 kg, with a powered option for ramps.`,
          `Each wish becomes a numbered [[user-need]], and each need becomes one or more measurable [[design-input]]s. Example: "must stay put during transfer" becomes "brakes hold on a 10° slope at full load".`,
          `The team lists every [[hazard]] they can think of, such as the stretcher rolling away while a patient is moved onto it.`,
          `[[device-class|Device class]] and the route to market are decided for the US and the EU, because they set how much evidence is needed later.`,
          `A project is opened in [[projectlink]] so everyone sees the plan, the milestones and who owns what.` ],
        x: [
          `Product container "TransPort T-300" is created in [[pdmlink]] with team roles, folder structure and default [[lifecycle-state|lifecycle]] and workflow templates. A linked [[projectlink]] project holds the plan and gate deliverables.`,
          `Planning documents are authored as [[wtdocument]]s (subtype Plan / Specification) and routed for approval with [[esign|electronic signatures]].`,
          `Requirements are held either as structured requirement objects or as a controlled specification document. PTC's requirement tooling has changed names and products across releases {V}; what matters to an auditor is the [[traceability]] from [[user-need]] to [[design-input]] to [[verification]].`,
          `Preliminary hazard analysis records each [[hazard]], hazardous situation and harm with a planned [[risk-control]]. IDs (HAZ-007) are reused unchanged in the [[dfmea]], the test reports and, much later, in complaint trending.`,
          `Regulatory strategy: the manual stretcher is a low-risk device; the powered version adds [[iec60601]] electrical safety and [[iec62304]] software lifecycle evidence. Exact product codes and class per market must be confirmed by Regulatory Affairs {V}.` ] },
      objects: [
        ['Product container', 'PDMLink Product "TransPort T-300"', 'Holds every part, document and CAD file of the device; sets team and access rules.'],
        ['Project', 'ProjectLink Project "T-300 NPD"', 'Plan, milestones, deliverables linked to the product data.'],
        ['Plans and specifications', '[[wtdocument]]', 'In Work → Under Review → Released. Revision A, B, C…'],
        ['Requirements', 'Requirement objects or specification document {V}', 'Each has an ID, text, source, verification method, status.'],
        ['Hazard list', '[[risk-file|Risk file]] record / [[wtdocument]]', 'Living record: updated at every later stage.']
      ],
      qms: ['Design controls: planning and inputs', 'Risk management ([[iso14971]])', 'Usability engineering ([[iec62366]])', 'Document control', 'Regulatory strategy'],
      tables: [
        { t: 'User needs turned into design inputs', note: 'A user need is in the customer\'s words. A design input is measurable, so a test can prove it.',
          cols: ['User need', 'In the user\'s words', 'Design input', 'Measurable requirement', 'Proved by'],
          rows: [
            ['UN-001', 'One porter can move a heavy patient safely.', 'DI-001', '[[swl|Safe working load]] 250 kg.', 'VT-001 static load test'],
            ['UN-001', '', 'DI-002', 'Push force to start moving ≤ 160 N on level floor (manual); powered drive option for ramps.', 'VT-004 push-force test'],
            ['UN-004', 'The stretcher must stay put while a patient is moved on or off.', 'DI-012', 'Brakes hold the loaded stretcher on a 10° incline with no creep for 5 minutes.', 'VT-012 brake hold test'],
            ['UN-004', '', 'DI-013', 'Brake status visible from head and foot end (red = locked, green = free).', 'VT-013 inspection + usability'],
            ['UN-006', 'Height matches the bed for transfers.', 'DI-020', 'Height range 560–910 mm by foot pump.', 'VT-020 height cycle test'],
            ['UN-009', 'The patient can sit up.', 'DI-025', 'Backrest 0–70°, gas-spring assisted, cannot drop suddenly.', 'VT-025 backrest test'],
            ['UN-011', 'Easy to clean between patients.', 'DI-031', 'Surfaces resist listed disinfectants; mattress cover meets [[biocompatibility]] requirements.', 'VT-031 chemical resistance'],
            ['UN-014', 'Fluids travel with the patient.', 'DI-040', 'IV pole with 2 hooks, 2 kg per hook.', 'VT-040 hook load test']
          ] },
        { t: 'Preliminary hazard list (extract)', note: 'The same hazard IDs follow the stretcher through design, production and complaints.',
          cols: ['ID', 'Hazard', 'Hazardous situation', 'Possible harm', 'Planned risk control'],
          rows: [
            ['HAZ-003', 'Entrapment', 'Limb caught between side rail and litter frame.', 'Bruising, fracture', 'Gap dimensions designed to limits; rail latch.'],
            ['HAZ-007', 'Unintended movement', 'Brake not engaged or fails to lock during patient transfer.', 'Patient fall', 'RC-007a positive-lock central brake; RC-007b red/green indicator; RC-007c IFU warning.'],
            ['HAZ-011', 'Instability', 'Loaded stretcher tips on a slope or threshold.', 'Patient fall', 'Wide wheelbase, low centre of gravity; stability test at 10°.'],
            ['HAZ-015', 'Thermal / electrical energy', 'Battery overheats while charging (powered version).', 'Burn, fire', 'Battery management system cut-off; certified cells.'],
            ['HAZ-018', 'Pinch point', 'Fingers under the backrest as it lowers.', 'Finger injury', 'Damped gas spring; guarded hinge.']
          ] },
        { t: 'Planning documents opened in Windchill',
          cols: ['Number', 'Document', 'Type', 'Owner', 'State at end of stage'],
          rows: [
            ['DOC-PLN-0001', 'Design and Development Plan', '[[wtdocument]] / Plan', 'Design Engineer', 'Released, rev A'],
            ['DOC-RMP-0002', 'Risk Management Plan', '[[wtdocument]] / Plan', 'Quality Engineer', 'Released, rev A'],
            ['DOC-URS-0003', 'User Needs Specification', '[[wtdocument]] / Specification', 'Design Engineer', 'Released, rev A'],
            ['DOC-DIR-0004', 'Design Input Requirements', '[[wtdocument]] / Specification', 'Design Engineer', 'Released, rev A'],
            ['DOC-USE-0005', 'Use Specification', '[[wtdocument]] / Specification', 'Quality Engineer', 'Released, rev A'],
            ['DOC-REG-0006', 'Regulatory Strategy', '[[wtdocument]] / Plan', 'Regulatory Affairs', 'Released, rev A']
          ] }
      ],
      raci: { roles: ['DE', 'QE', 'RA', 'ME', 'MG'], rows: [
        ['Write user needs', 'DE:R QE:C RA:C MG:A', false],
        ['Approve design inputs', 'DE:R QE:A RA:C ME:C MG:I', true],
        ['Risk management plan and hazard list', 'DE:C QE:R RA:C MG:A', true],
        ['Regulatory strategy', 'DE:C QE:C RA:R MG:A', true],
        ['Design and development plan', 'DE:R QE:C RA:C ME:C MG:A', true]
      ] },
      evidence: [
        'Approved design and development plan with responsibilities and review points ([[iso13485]] 7.3.2).',
        'Design inputs that are complete, unambiguous and verifiable, with approval signatures (7.3.3).',
        'Risk management plan with acceptance criteria ([[iso14971]] clause 4.4).',
        'Use specification ([[iec62366]] clause 5.1).',
        '[[audit-trail|Audit trail]] of who approved each document and when ([[part11]]).'
      ],
      pitfalls: [
        'Requirements that cannot be tested ("easy to push") reach design review and have to be rewritten.',
        'User needs kept in slide decks or e-mail, so there is nothing to trace from later.',
        'Hazard IDs renumbered between documents, which breaks the link to the DFMEA and to complaint codes.',
        'Regulatory class decided late, after test plans were already written for the wrong standard set.'
      ],
      best: [
        'Give every need, input and hazard a permanent ID and never reuse it.',
        'Write the verification method next to each design input when the input is written.',
        'Create the Windchill product container, team and numbering scheme before the first document.',
        'Involve manufacturing and service now; their constraints are design inputs too.'
      ]
    },

    {
      n: 2, name: 'Design in Creo', short: 'Design', mode: 'creo', sys: ['creo', 'wc'], full: true,
      tagline: { s: 'Engineers build the stretcher as a 3D model and save it safely.',
                 x: 'CAD authoring, workspace check-in, CAD documents, drawings, design outputs, DFMEA.' },
      purpose: {
        s: `Engineers build every part of the stretcher on screen in 3D, then fit the parts together like a digital construction kit. Each time they save their work into the company vault, the vault keeps the old version too, so nothing is lost and everyone always opens the same latest file.`,
        x: `Design outputs are created per [[iso13485]] 7.3.4 in a form that can be verified against the design inputs. [[creo]] models, assemblies and [[drawing]]s are managed as [[cad-document]]s in [[windchill]] through the embedded Creo integration ([[workspace]], [[checkin|check-out / check-in]]). The [[dfmea]] is developed in parallel so that [[risk-control]]s are designed in.` },
      happens: {
        s: [
          `Each part is modelled in [[creo]]: frame tubes, the brake linkage, the backrest, the side rails.`,
          `Bought parts, such as the castors and the hydraulic columns, are placed using 3D models supplied by their makers.`,
          `Work is saved to [[windchill]] with [[checkin|check-in]]. Every save creates a new [[iteration]], so earlier versions can always be opened again.`,
          `Flat [[drawing]]s are made from the 3D models, with the dimensions and tolerances the factory will check.`,
          `While designing, the team asks "how could this part fail?" and records the answers in the [[dfmea]].` ],
        x: [
          `Designers work in a Windchill [[workspace]]; [[checkin|check-in]] creates [[iteration]]s A.1, A.2, A.3 of each [[cad-document]] in state In Work. Dependencies (assembly → part, drawing → model) are stored as CAD links.`,
          `Naming and numbering: the CAD file name equals the part number (MC-CST-6000.prt). Auto-association creates or links the owning [[wtpart]] at check-in, which is how the [[ebom]] in [[s:3]] gets built.`,
          `Bought components are modelled as envelope or supplier models and controlled by a source-control [[drawing]] that fixes interface dimensions and performance.`,
          `The controller board is designed in an ECAD tool and managed through the Windchill ECAD integration {V}; the board outline is exchanged with Creo. Controller firmware is developed under [[iec62304]].`,
          `Variants (manual / powered, two mattress options) are prepared as an overloaded "150 %" structure for [[option-variant|Options and Variants]]; size families of fasteners use [[family-table]]s.`,
          `[[dfmea]] rows reference hazard IDs from [[s:1]] and name the [[verification]] test that will prove each control.` ] },
      objects: [
        ['3D part / assembly', '[[cad-document]] (EPMDocument)', 'In Work; iterations A.1, A.2 …; one per .prt / .asm file.'],
        ['2D drawing', '[[cad-document]] of type Drawing', 'References its model; released together with it.'],
        ['Part record', '[[wtpart]] (auto-associated)', 'Created at first check-in; owner link to the CAD document.'],
        ['Specifications, calculations', '[[wtdocument]]', 'Described-by / reference links to the WTPart.'],
        ['Failure analysis', '[[dfmea]] in the [[risk-file]]', 'Windchill Risk and Reliability or a controlled document {V}.']
      ],
      qms: ['Design controls: design outputs', 'Risk management: [[dfmea]], risk controls', 'Document control (CAD data)', 'Design reviews', 'Software lifecycle ([[iec62304]]) for the drive controller'],
      tables: [
        { t: 'CAD documents in Windchill (extract)', note: 'A.3 means revision A, third saved iteration.',
          cols: ['CAD document', 'What it is', 'Version', 'State', 'Linked WTPart'],
          rows: [
            ['MC-STR-3000.asm', 'Top assembly of the whole stretcher', 'A.7', 'In Work', '[[p:MC-STR-3000]]'],
            ['MC-FRM-1000.asm', 'Base frame weldment', 'A.4', 'In Work', '[[p:MC-FRM-1000]]'],
            ['MC-FRM-1000.drw', 'Weld and machining drawing', 'A.3', 'In Work', '[[p:MC-FRM-1000]]'],
            ['MC-BRK-6100.asm', 'Central brake linkage and pedal', 'A.5', 'In Work', '[[p:MC-BRK-6100]]'],
            ['MC-CST-6000.prt', 'Castor, supplier envelope model', 'A.2', 'In Work', '[[p:MC-CST-6000]]'],
            ['MC-CST-6000.drw', 'Source-control drawing: interface, brake torque, load rating', 'A.2', 'In Work', '[[p:MC-CST-6000]]'],
            ['MC-DRV-8000.asm', 'Powered drive module', 'A.3', 'In Work', '[[p:MC-DRV-8000]]'],
            ['MC-PCB-8200 (ECAD)', 'Motor controller board: schematic + layout', 'A.2', 'In Work', '[[p:MC-PCB-8200]]']
          ] },
        { t: 'DFMEA rows (extract)', note: 'S = severity, O = occurrence, D = detection, each scored 1–10. RPN = S × O × D. Scores are sample values.',
          cols: ['Row', 'Part / function', 'Failure mode', 'Effect', 'S', 'O', 'D', 'RPN', 'Design control → verification'],
          rows: [
            ['DF-021', '[[p:MC-CST-6000]] / hold wheel locked', 'Brake cam does not fully engage', 'Stretcher rolls during transfer (HAZ-007)', '9', '3', '4', '108', 'Over-centre cam with positive stop; indicator → VT-012'],
            ['DF-022', '[[p:MC-BRK-6100]] / lock all four castors together', 'Linkage rod slips on hex shaft', 'One castor stays free (HAZ-007)', '9', '2', '4', '72', 'Hex drive, clamp screw with thread lock → VT-012, VT-014'],
            ['DF-034', '[[p:MC-GSP-3200]] / support backrest', 'Gas pressure lost', 'Backrest drops (HAZ-018)', '7', '3', '3', '63', 'Lock-out valve, damped descent → VT-025'],
            ['DF-040', '[[p:MC-HYD-2000]] / hold height', 'Seal leak, slow sink', 'Height changes during transfer', '6', '3', '2', '36', 'Seal specification, leak-down limit → VT-020'],
            ['DF-052', '[[p:MC-BAT-8300]] / store energy', 'Cell over-temperature', 'Fire (HAZ-015)', '9', '2', '3', '54', 'Battery management cut-off, certified cells → VT-044']
          ] },
        { t: 'Design outputs produced in this stage',
          cols: ['Output', 'Form', 'Where it lives'],
          rows: [
            ['3D models and assemblies', '[[cad-document]]', 'Windchill product "TransPort T-300"'],
            ['Drawings with tolerances and critical characteristics', '[[drawing]]', 'Windchill, linked to the model'],
            ['Purchase specifications for bought parts', '[[wtdocument]]', 'Linked to the bought [[wtpart]]'],
            ['Label and IFU drafts', '[[wtdocument]] / artwork', 'Windchill; finalised in [[s:8]]'],
            ['Firmware source and build record', 'Software repository + released build as [[wtdocument]] / part {V}', 'Linked to [[p:MC-PCB-8200]]']
          ] }
      ],
      raci: { roles: ['DE', 'QE', 'ME', 'SC', 'SQ'], rows: [
        ['Model parts and assemblies', 'DE:R QE:I ME:C', false],
        ['Create drawings', 'DE:R QE:C ME:C', false],
        ['DFMEA', 'DE:R QE:A ME:C SQ:C', true],
        ['Select bought components', 'DE:R QE:C SC:C SQ:C', false],
        ['Interim design review', 'DE:R QE:A ME:C SC:I', true]
      ] },
      evidence: [
        'Design outputs reference acceptance criteria and identify characteristics essential for safe use (7.3.4).',
        'Iteration history of each [[cad-document]] showing who changed what and when.',
        '[[dfmea]] with links to hazards and to verification tests.',
        'Design review minutes with attendees, including an independent reviewer (7.3.5).'
      ],
      pitfalls: [
        'Files kept on local disks for weeks; a late check-in overwrites nobody\'s work but surprises everyone.',
        'CAD file names that differ from part numbers, so auto-association creates duplicate WTParts.',
        'Supplier models checked in with thousands of internal features, slowing every assembly.',
        'Drawings released separately from their models and drifting out of step.'
      ],
      best: [
        'Check in at least daily; use the workspace compare status before starting work.',
        'Agree start parts, templates, parameters and the numbering rule before modelling.',
        'Model for the BOM you need: one CAD component per purchasable or makeable item.',
        'Mark critical-to-safety dimensions on the drawing so they flow to inspection plans later.'
      ]
    },

    {
      n: 3, name: 'Engineering BOM', short: 'EBOM', mode: 'windchill', sys: ['creo', 'wc'], full: true,
      tagline: { s: 'The 3D model becomes an official parts list.',
                 x: 'WTPart structure in the Design view: quantities, find numbers, alternates, variants, AML.' },
      purpose: {
        s: `The 3D model shows what the stretcher looks like. The parts list says what it is made of: every item, how many, and which revision. Windchill builds this list from the model and keeps the two in step. It is like the ingredient list for the recipe: the photo of the dish is not enough to go shopping.`,
        x: `The [[ebom]] is the [[wtpart]] structure in the Design [[views|view]]: usage links carry quantity, unit, [[find-number]], [[line-number]] and, for electronics, [[ref-des|reference designators]]. Parts carry business attributes that CAD files do not: [[make-buy|source]], default unit, [[lifecycle-state]], classification. [[alternate|Alternate]] and [[substitute|substitute]] parts, [[option-variant|options]] and the [[aml]] are defined here.` },
      happens: {
        s: [
          `Windchill reads the assembly and creates one part record ([[wtpart]]) for each component, with the right quantity.`,
          `Items that are not in the 3D model are added by hand: labels, grease, thread-lock, the instructions for use.`,
          `Each line is marked "make" or "buy" ([[make-buy]]).`,
          `Approved makers are linked to each bought part (the [[aml]]), so purchasing knows who may supply it.`,
          `Options are defined: manual or powered, standard or pressure-relief mattress.`,
          `The stretcher is now "managed in Windchill": every part has a number, an owner and a status.` ],
        x: [
          `"Build / Edit Associated Part Structure" derives the [[wtpart]] structure from the Creo assembly. The CAD structure and the part structure may differ on purpose: bulk items, labels and software exist only as parts.`,
          `Usage attributes: quantity and unit, [[find-number]] (balloon on the drawing), [[line-number]] (ordering in the BOM), [[ref-des|reference designators]] on [[p:MC-PCB-8200]].`,
          `[[alternate|Alternate]] parts are defined on the part master and are valid wherever the part is used. [[substitute|Substitute]] parts are defined on one usage link and are valid only in that parent assembly.`,
          `[[option-variant|Options and Variants]]: [[p:MC-STR-3000]] is a [[configurable-module]]; the option DRIVE = POWERED includes [[p:MC-DRV-8000]]. Variant specifications generate T-300M and T-300P.`,
          `[[suma|Supplier Management]]: each bought [[wtpart]] gets [[manufacturer-part]]s with an [[aml]] preference (Preferred / Approved / Do Not Use). [[vendor-part]]s and the [[avl]] follow per plant in [[s:5]].`,
          `Safety-critical parts carry a criticality attribute that drives inspection level and change-review rules.` ] },
      objects: [
        ['Part', '[[wtpart]] in Design view', 'In Work → Under Review → Released. Revision A.'],
        ['BOM line', 'Part usage link', 'Quantity, unit, find number, line number, reference designator.'],
        ['Interchangeable part', '[[alternate]] link (global)', 'One-way or two-way replacement.'],
        ['Context-specific replacement', '[[substitute]] link (per usage)', 'Valid only in the named assembly.'],
        ['Approved maker', '[[manufacturer-part]] + [[aml]]', 'Preference per sourcing context.'],
        ['Options', '[[option-variant|Option set, choices, expressions]]', 'Assigned to the product; filter the structure.']
      ],
      qms: ['Document and BOM control', 'Supplier management (approved sources)', 'Risk management: critical parts identified', 'Material compliance ([[rohs]], [[reach]]) data collection'],
      tables: [
        { t: 'EBOM of the TransPort T-300, Design view (top level)', note: 'Find numbers match the balloons on the assembly drawing.',
          cols: ['Find no.', 'Number', 'Name', 'Rev', 'Qty', 'Unit', 'Make / Buy', 'Note'],
          rows: [
            ['10', '[[p:MC-FRM-1000]]', 'Base frame weldment', 'A', '1', 'ea', 'Make', ''],
            ['20', '[[p:MC-FRM-1100]]', 'Litter frame with deck', 'A', '1', 'ea', 'Make', ''],
            ['30', '[[p:MC-HYD-2000]]', 'Hydraulic lift column', 'A', '2', 'ea', 'Buy', ''],
            ['40', '[[p:MC-HYD-2100]]', 'Foot pump pedal assembly', 'A', '1', 'ea', 'Buy', ''],
            ['50', '[[p:MC-BKR-3100]]', 'Backrest panel assembly', 'A', '1', 'ea', 'Make', ''],
            ['60', '[[p:MC-GSP-3200]]', 'Backrest gas spring', 'A', '1', 'ea', 'Buy', 'Safety-critical'],
            ['70', '[[p:MC-RAL-4000]]', 'Side rail assembly', 'A', '2', 'ea', 'Make', ''],
            ['80', '[[p:MC-IVP-4500]]', 'IV pole, telescopic', 'A', '1', 'ea', 'Buy', ''],
            ['90', '[[p:MC-MAT-5000]]', 'Mattress, 80 mm', 'A', '1', 'ea', 'Buy', 'Option MATTRESS = STD'],
            ['100', '[[p:MC-CST-6000]]', 'Castor 200 mm with brake', 'A', '4', 'ea', 'Buy', 'Safety-critical; alternate MC-CST-6001'],
            ['110', '[[p:MC-BRK-6100]]', 'Central brake linkage and pedal', 'A', '1', 'ea', 'Make', 'Safety-critical'],
            ['120', '[[p:MC-HDL-7000]]', 'Push handle assembly', 'A', '1', 'ea', 'Make', ''],
            ['130', '[[p:MC-DRV-8000]]', 'Powered drive module', 'A', '1', 'ea', 'Make', 'Option DRIVE = POWERED'],
            ['140', '[[p:MC-LBL-9000]]', 'Label set incl. UDI label', 'A', '1', 'set', 'Buy', 'Not in the 3D model']
          ] },
        { t: 'Alternate and substitute parts: the difference',
          note: 'Alternate = interchangeable everywhere the part is used. Substitute = allowed only in one named assembly.',
          cols: ['Type', 'Original part', 'Replacement', 'Where valid', 'Why'],
          rows: [
            ['[[alternate]]', 'MC-CST-6000 Castor 200 mm with brake', 'MC-CST-6001 Castor 200 mm with brake (second design, same interface and rating)', 'Every assembly that uses MC-CST-6000', 'Second source for supply security; fully verified to the same tests.'],
            ['[[substitute]]', 'MC-FST-0412 Screw M8×20, A2', 'MC-FST-0413 Flange screw M8×20, A2', 'Only in MC-DRV-8000 Powered drive module', 'Flange head is acceptable on the motor bracket but not on visible patient-side surfaces.']
          ] },
        { t: 'Options and variants',
          cols: ['Option', 'Choices', 'Effect on the structure'],
          rows: [
            ['DRIVE', 'MANUAL · POWERED', 'POWERED includes [[p:MC-DRV-8000]] and the electrical label set.'],
            ['MATTRESS', 'STD 80 mm · PRESSURE-RELIEF 120 mm', 'Selects MC-MAT-5000 or MC-MAT-5010.'],
            ['IVPOLE', 'FIXED · TELESCOPIC', 'Selects MC-IVP-4400 or MC-IVP-4500.'],
            ['REGION', 'US · EU', 'Selects label set and [[ifu]] language pack; drives [[udi-di]].']
          ] },
        { t: 'Approved manufacturer list for the castor (preview)', note: 'Vendor parts and plant-specific sourcing are added in stage 5.',
          cols: ['WTPart', 'Manufacturer part', 'Manufacturer (invented)', 'AML preference'],
          rows: [
            ['MC-CST-6000', 'NCW-200-TB-ESD', 'Norvale Castor Works', 'Preferred'],
            ['MC-CST-6000', 'RX-C200B', 'Rollaxis Components', 'Approved'],
            ['MC-CST-6000', 'QW-200-LK', 'Quillon Wheels', 'Do Not Use (failed brake torque qualification)']
          ] }
      ],
      raci: { roles: ['DE', 'ME', 'QE', 'SC', 'SQ', 'RA'], rows: [
        ['Build and maintain the EBOM', 'DE:R ME:C QE:I', false],
        ['Set make / buy', 'DE:C ME:R SC:C', false],
        ['Define alternates and substitutes', 'DE:R ME:C QE:A SC:C', true],
        ['Approve manufacturers (AML)', 'DE:C QE:A SC:C SQ:R', true],
        ['Define options and variants', 'DE:R ME:C RA:C', false],
        ['Flag safety-critical parts', 'DE:R QE:A', true]
      ] },
      evidence: [
        'Complete, revision-controlled BOM as part of the device master record / [[mdf|medical device file]].',
        'Evidence that every bought part has at least one approved source ([[iso13485]] 7.4.1).',
        'Rationale and verification for each [[alternate]] and [[substitute]].',
        'Link from safety-critical parts to their [[risk-control]] and [[dfmea]] rows.'
      ],
      pitfalls: [
        'Treating the CAD assembly as the BOM: labels, grease, firmware and packaging go missing.',
        'Using a substitute where an alternate was meant (or the reverse), so the wrong part becomes valid in the wrong place.',
        'Quantities typed by hand that no longer match the model after a design change.',
        'Bought parts released with no approved manufacturer, blocking purchasing at ERP handoff.'
      ],
      best: [
        'Keep CAD-driven lines CAD-driven; add non-modelled items as parts only.',
        'Review every alternate and substitute as a design decision with test evidence.',
        'Fill make / buy, unit and criticality before release; ERP needs them in stage 6.',
        'Design the option set early with manufacturing and regulatory, because options drive labels and UDI.'
      ]
    },

    {
      n: 4, name: 'Review & Release', short: 'Release', mode: 'released', sys: ['wc', 'sup'], full: true,
      tagline: { s: 'Independent people check the design, sign it, and freeze it.',
                 x: 'Design verification and validation, design review, promotion request, e-signatures, baseline.' },
      purpose: {
        s: `Before the factory may use the design, it has to be proven and signed off. Tests show the stretcher does what the requirements say. People who did not design it review the evidence. Then the design is frozen under "Released": from now on nobody can change it quietly; every change needs a formal request. It works like publishing a book: after printing, corrections go into a new edition.`,
        x: `[[verification]] and [[validation]] per [[iso13485]] 7.3.6 and 7.3.7 and formal [[design-review]] (7.3.5). A [[promotion-request]] moves the reviewed set of [[wtpart]]s, [[cad-document]]s and [[wtdocument]]s from In Work to Released through an approval workflow with [[part11]]-compliant [[esign|electronic signatures]]. A [[baseline]] records the exact released configuration. After release, modification is possible only through [[change-request]] and [[change-notice]].` },
      happens: {
        s: [
          `Prototype stretchers are tested against every [[design-input]]: load, brake hold, stability, cleaning, electrical safety for the powered version.`,
          `Nurses and porters try the stretcher in a simulated ward ([[validation]]) to confirm it meets their needs and is safe to use.`,
          `A [[design-review]] meeting checks the evidence. At least one reviewer is independent of the design team.`,
          `The lead engineer asks Windchill to release the whole set with a [[promotion-request]]. Quality, regulatory and manufacturing approve by [[esign|electronic signature]].`,
          `Windchill marks everything Released and takes a snapshot called a [[baseline]].`,
          `Released drawings and specifications can now go to suppliers for quotation.` ],
        x: [
          `Test protocols and reports are [[wtdocument]]s linked to the requirements they verify; the trace matrix (need → input → output → test → result) is generated or maintained as a controlled record ([[traceability]]).`,
          `The [[promotion-request]] collects promotion objects with dependents (parts, CAD, documents), validates that they share a valid target state, and starts the review / approval workflow. Reviewers act from their Windchill task list.`,
          `Approval tasks require re-authentication (user ID + password) and record the meaning of the signature, name, date and time ([[part11]] 11.50, 11.200). The workflow history and [[audit-trail]] are retained.`,
          `On approval the [[lifecycle-state]] becomes Released; access rules make released iterations read-only. A managed [[baseline]] "T-300 Design Freeze A" captures the exact iterations.`,
          `Released revision A is the starting point for [[design-transfer]] ([[s:5]]). Any later change follows [[problem-report]] → [[change-request]] → [[change-notice]], and produces revision B.`,
          `Regulatory compiles technical documentation from the released set: EU [[eumdr]] Annex II/III file; US route per classification ([[k510]] or exempt) {V}.` ] },
      objects: [
        ['Release request', '[[promotion-request]] PR-2025-0042', 'Open → Under Review → Approved (or Rejected).'],
        ['Parts, CAD, documents', '[[wtpart]], [[cad-document]], [[wtdocument]]', 'In Work → Under Review → Released, revision A.'],
        ['Snapshot', '[[baseline]] BL-0007 "T-300 Design Freeze A"', 'Immutable list of exact iterations.'],
        ['Test evidence', '[[wtdocument]] (Protocol, Report)', 'Released; linked to requirements.'],
        ['Review record', '[[design-review]] minutes', 'Released; lists attendees and actions.']
      ],
      qms: ['Design controls: verification, validation, design review', 'Document control and [[esign|electronic signatures]]', 'Risk management: verification of risk controls, benefit-risk conclusion', 'Usability: summative evaluation ([[iec62366]])', 'Regulatory: technical documentation'],
      tables: [
        { t: 'Verification and validation summary (extract)',
          cols: ['Test', 'Proves', 'Method', 'Result', 'Report'],
          rows: [
            ['VT-001', 'DI-001 safe working load 250 kg', 'Static load 2 × SWL, 1 min; no permanent deformation', 'Pass', 'DOC-VER-0101 A'],
            ['VT-012', 'DI-012 brake hold (RC-007a)', '250 kg on 10° incline, 5 min, all four castor orientations', 'Pass: 0 mm creep', 'DOC-VER-0112 A'],
            ['VT-014', 'Brake linkage endurance', '20 000 pedal cycles, then repeat VT-012', 'Pass', 'DOC-VER-0114 A'],
            ['VT-020', 'DI-020 height range and life', '10 000 full height cycles at 250 kg', 'Pass', 'DOC-VER-0120 A'],
            ['VT-025', 'DI-025 backrest', '5 000 cycles, drop test with lock released', 'Pass', 'DOC-VER-0125 A'],
            ['VT-031', 'DI-031 cleanability', '500 wipe cycles with each listed disinfectant', 'Pass', 'DOC-VER-0131 A'],
            ['VT-044', 'Electrical safety, powered version', '[[iec60601]] tests at an accredited laboratory', 'Pass', 'DOC-VER-0144 A'],
            ['VAL-003', 'User needs UN-001 to UN-014', 'Summative usability study, 15 porters and nurses, simulated ward', 'Pass: no use errors leading to harm', 'DOC-VAL-0203 A']
          ] },
        { t: 'Promotion request PR-2025-0042 (sample record)',
          cols: ['Field', 'Value'],
          rows: [
            ['Name', 'Release T-300 design, revision A'],
            ['Created', '2025-03-03 by Asha Verma (Design Engineer)'],
            ['Objects', '37 WTParts, 52 CAD documents, 24 documents'],
            ['From → to state', 'In Work → Released'],
            ['Baseline', 'BL-0007 "T-300 Design Freeze A"'],
            ['Status', 'Approved 2025-03-10']
          ] },
        { t: 'Electronic signatures on PR-2025-0042', note: 'Each signature needs user ID + password again at the moment of signing, and stores its meaning.',
          cols: ['Role', 'Signer (invented)', 'Meaning', 'Signed (UTC)'],
          rows: [
            ['Design Engineer', 'Asha Verma', 'Author: design is complete', '2025-03-03 14:12'],
            ['Manufacturing Engineer', 'Marco Rossi', 'Review: design can be manufactured', '2025-03-05 09:40'],
            ['Quality Engineer', 'Daniel Okoro', 'Approval: V&V complete, risks acceptable', '2025-03-07 16:03'],
            ['Regulatory Affairs', 'Lena Fischer', 'Approval: regulatory requirements met', '2025-03-10 10:21'],
            ['Change Admin', 'Priya Nair', 'Release: objects promoted, baseline created', '2025-03-10 11:02']
          ] },
        { t: 'Lifecycle states used on the T-300',
          cols: ['State', 'Meaning', 'Who may change the object'],
          rows: [
            ['In Work', 'Being created or edited.', 'Authors in the product team.'],
            ['Under Review', 'Locked while reviewers decide.', 'Nobody; reviewers approve or reject.'],
            ['Released', 'Approved for use by purchasing and production.', 'Nobody. A change notice creates the next revision.'],
            ['Obsolete', 'No longer to be used for new builds.', 'Nobody. Kept for history and service.']
          ] }
      ],
      raci: { roles: ['DE', 'QE', 'RA', 'ME', 'CA', 'MG'], rows: [
        ['Run verification tests', 'DE:R QE:A ME:I', true],
        ['Usability validation', 'DE:C QE:R RA:C MG:I', true],
        ['Design review', 'DE:R QE:A RA:C ME:C MG:I', true],
        ['Create promotion request', 'DE:R CA:C', false],
        ['Approve release', 'DE:C QE:A RA:A ME:C CA:R', true],
        ['Create baseline', 'CA:R DE:I QE:I', false],
        ['Compile technical documentation', 'DE:C QE:C RA:R MG:A', true]
      ] },
      evidence: [
        'Verification records showing outputs meet inputs, with method, acceptance criteria and result (7.3.6).',
        'Validation on representative product with intended users (7.3.7).',
        'Design review record including an independent reviewer (7.3.5).',
        'Signed approval of design outputs before release (7.3.4), with [[part11]] signature manifestation.',
        'Risk management report: all [[risk-control]]s implemented and verified ([[iso14971]] clause 9).',
        'Complete [[dhf]] / design and development file (7.3.10).'
      ],
      pitfalls: [
        'Promoting parts without their drawings or documents, leaving a half-released structure.',
        'Tests run on prototypes that differ from the released design, with no record of the differences.',
        'Signature workflows that route to a group mailbox; nobody can show who actually approved.',
        'No baseline taken, so "what exactly did we release?" cannot be answered a year later.'
      ],
      best: [
        'Use "collect dependents" on the promotion request and fix every warning before submitting.',
        'Record the tested configuration (baseline or serials) in every test report.',
        'Keep reviewer lists role-based in the workflow, with named deputies.',
        'Rehearse the release on a small sub-assembly before the full product.'
      ]
    },

    { n: 5, name: 'MBOM & Process Plan', short: 'MBOM', mode: 'plant', sys: ['wc', 'mes'], full: true,
      happens: {
        s: [
          `Manufacturing engineers take the released parts list and regroup it the way the factory builds: first the chassis with wheels and brake, then the lift, then the patient surface.`,
          `They add things only the factory needs, such as thread-lock, hydraulic oil and the packaging set. This is the [[mbom]].`,
          `They write the build recipe, called the [[process-plan]]: each step ([[operation]]), at which bench ([[station]]), with which tool and how long it takes.`,
          `Each step gets a picture-based [[work-instruction]] that the worker will see on screen.`,
          `They ask "what could go wrong at this step?" ([[pfmea]]) and add checks, such as a torque wrench that records every tightening.`,
          `A pilot batch of 10 stretchers proves the factory can build it right every time ([[process-validation]]).` ],
        x: [
          `In [[mpmlink]] the [[bom-transformer]] shows the [[ebom]] (Design view) upstream and the [[mbom]] (Manufacturing view, Plant 1000) downstream. Parts are carried over, regrouped into manufacturing assemblies, or added as new downstream parts; equivalence links keep both sides traceable so later engineering changes can be detected and reconciled.`,
          `Manufacturing-only items: [[phantom]] MC-PHN-0110 "Brake fastener set", [[consumable]]s (thread-lock, oil), the packaging [[kit]] MC-PKG-9100. Every EBOM line must be consumed in the MBOM; the transformer reports unallocated quantities.`,
          `[[process-plan]] PP-T300-01 holds a sequence of [[operation]]s. Each operation references a [[work-center]] (bench), allocated MBOM parts, [[tooling]], time standards, control characteristics and a [[work-instruction]] with 3D illustrations derived from the Creo model.`,
          `The [[pfmea]] is written per operation; its detection controls become the [[control-plan]] and later SAP QM / MES data-collection points.`,
          `[[suma|Supplier Management]]: [[vendor-part]]s and the [[avl]] are set in the [[sourcing-context]] "Plant 1000", because a vendor approved for one plant is not automatically approved for another.`,
          `[[design-transfer]] closes with [[process-validation]] (IQ / OQ / PQ) of special processes such as welding and powder coating, a pilot build, and a signed transfer checklist. MBOM and process plan are released by [[change-notice]] CN-2025-0012.` ] },
      objects: [
        ['Factory parts list', '[[wtpart]] structure in Manufacturing [[views|view]] (Plant 1000)', 'In Work → Released, version A.1 (Manufacturing).'],
        ['Build recipe', '[[process-plan]] PP-T300-01', 'In Work → Under Review → Released.'],
        ['Build step', '[[operation]] OP10 … OP80', 'Sequenced; holds parts, tools, time, instructions.'],
        ['Bench', '[[work-center]] B1 – B4, PK1', 'Plant resource; maps to SAP work centre.'],
        ['Tools and fixtures', '[[tooling]] (resource parts)', 'TL-0031 torque wrench, TR-02 brake test rig, FX-0012 chassis fixture.'],
        ['On-screen instruction', '[[work-instruction]]', 'Generated from the process plan; released with it.'],
        ['Approved sellers', '[[vendor-part]] + [[avl]] in [[sourcing-context]] Plant 1000', 'Preferred / Approved / Do Not Use.']
      ],
      qms: ['Design transfer ([[iso13485]] 7.3.8)', 'Production and process controls (7.5.1)', '[[process-validation|Process validation]] (7.5.6)', 'Risk management: [[pfmea]] and [[control-plan]]', 'Purchasing controls: approved vendors (7.4.1)', 'Training of operators'],
      tables: [
        { t: 'MBOM for Plant 1000 (Manufacturing view)', note: 'Compare with the EBOM in stage 3: same parts, regrouped by build order, plus factory-only items.',
          cols: ['Level', 'Number', 'Name', 'Qty', 'Type', 'Used at operation'],
          rows: [
            ['1', 'MC-MFG-0100', 'Chassis complete', '1', 'Manufacturing assembly (new in MBOM)', 'OP10'],
            ['2', '[[p:MC-FRM-1000]]', 'Base frame weldment', '1', 'From EBOM', 'OP10'],
            ['2', '[[p:MC-CST-6000]]', 'Castor 200 mm with brake', '4', 'From EBOM', 'OP10'],
            ['2', '[[p:MC-BRK-6100]]', 'Central brake linkage and pedal', '1', 'From EBOM', 'OP10'],
            ['2', 'MC-PHN-0110', 'Brake fastener set', '1', '[[phantom]]', 'OP10'],
            ['2', 'MC-CON-0007', 'Thread-lock, medium strength', '0.5 ml', '[[consumable]]', 'OP10'],
            ['1', 'MC-MFG-0200', 'Lift unit', '1', 'Manufacturing assembly', 'OP30'],
            ['2', '[[p:MC-HYD-2000]]', 'Hydraulic lift column', '2', 'From EBOM', 'OP30'],
            ['2', '[[p:MC-HYD-2100]]', 'Foot pump pedal assembly', '1', 'From EBOM', 'OP30'],
            ['1', 'MC-MFG-0300', 'Patient surface', '1', 'Manufacturing assembly', 'OP40, OP60'],
            ['2', '…', 'Litter frame, backrest, gas spring, rails, IV pole, mattress, handles', '', 'From EBOM', 'OP40, OP60'],
            ['1', '[[p:MC-DRV-8000]]', 'Powered drive module', '1', 'From EBOM, option DRIVE = POWERED', 'OP50'],
            ['1', '[[p:MC-LBL-9000]]', 'Label set incl. UDI label', '1', 'From EBOM', 'OP70'],
            ['1', 'MC-PKG-9100', 'Packaging set with IFU', '1', '[[kit]] (new in MBOM)', 'OP80']
          ] },
        { t: 'Process plan PP-T300-01 (Plant 1000, line L1)',
          cols: ['Operation', 'Bench', 'What is done', 'Tooling', 'Time', 'Check recorded'],
          rows: [
            ['OP10', 'B1', 'Fit castors and brake linkage to base frame', 'FX-0012 fixture, TL-0031 torque wrench', '14 min', 'Castor stem torque 25 N·m ×4; clamp screw 9 N·m'],
            ['OP20', 'B1', 'Brake function test', 'TR-02 brake test rig', '4 min', 'Holding torque ≥ 12 N·m on each castor; indicator red/green'],
            ['OP30', 'B2', 'Fit lift columns and foot pump, bleed', 'Bleed kit', '12 min', 'Leak-down ≤ 2 mm in 10 min at 250 kg'],
            ['OP40', 'B2', 'Fit litter frame, backrest and gas spring', 'TL-0031', '11 min', 'Backrest lock holds at 70°'],
            ['OP50', 'B3', 'Fit drive module and harness, load firmware (powered only)', 'Flash station FS-01', '16 min', 'Firmware FW-8200 v1.2.0 checksum'],
            ['OP60', 'B3', 'Fit rails, IV pole, handles, mattress', 'Hand tools', '9 min', 'Rail latch function'],
            ['OP70', 'B4', 'Final inspection, electrical safety test, apply labels', 'Safety tester ST-03, label printer', '10 min', 'Protective earth, leakage current; UDI scan matches order'],
            ['OP80', 'PK1', 'Pack with IFU and accessories', 'Carton fixture', '6 min', 'Packaging checklist; IFU language matches REGION']
          ] },
        { t: 'PFMEA rows (extract)', note: 'Each detection control becomes a data-collection point in MES.',
          cols: ['Row', 'Operation', 'What could go wrong', 'Effect', 'Prevention / detection'],
          rows: [
            ['PF-012', 'OP10', 'Castor stem under-torqued', 'Castor loosens in use', 'Electronic torque wrench; MES blocks the next step without 4 OK results'],
            ['PF-031', 'OP10', 'Brake clamp screw under-torqued or no thread-lock', 'Brake linkage slips: one castor stays free (HAZ-007)', 'Torque record; thread-lock dispense confirmed; 100 % test in OP20'],
            ['PF-044', 'OP70', 'Wrong label variant applied', 'Wrong UDI or language: mislabeling', 'Label printed from order data; scan-back verification'],
            ['PF-050', 'OP50', 'Wrong firmware version loaded', 'Unintended drive behaviour', 'Flash station reads version from the released BOM; checksum compare']
          ] },
        { t: 'Approved vendor list for the castor, sourcing context Plant 1000',
          cols: ['WTPart', 'Manufacturer part', 'Vendor (invented)', 'Vendor part', 'AVL preference'],
          rows: [
            ['MC-CST-6000', 'NCW-200-TB-ESD (Norvale Castor Works)', 'Norvale Castor Works, vendor 100231', 'NCW-200-TB-ESD', 'Preferred'],
            ['MC-CST-6000', 'NCW-200-TB-ESD (Norvale Castor Works)', 'Dextrin Industrial Supply, vendor 100415', 'DX-55120', 'Approved'],
            ['MC-CST-6000', 'RX-C200B (Rollaxis Components)', 'Rollaxis Components, vendor 100388', 'RX-C200B', 'Approved']
          ] }
      ],
      raci: { roles: ['ME', 'DE', 'QE', 'SC', 'SQ', 'PR', 'CA'], rows: [
        ['Create the MBOM from the EBOM', 'ME:R DE:C QE:I', false],
        ['Author process plan and work instructions', 'ME:R QE:C PR:C', false],
        ['PFMEA and control plan', 'ME:R DE:C QE:A PR:C', true],
        ['Approve vendors for the plant (AVL)', 'SC:C SQ:R QE:A', true],
        ['Process validation and pilot build', 'ME:R QE:A PR:R', true],
        ['Release MBOM and process plan', 'ME:R QE:A CA:R', true],
        ['Train operators', 'ME:C PR:R QE:I', false]
      ] },
      evidence: [
        'Design transfer record showing outputs verified as suitable for manufacturing ([[iso13485]] 7.3.8).',
        'Released [[mbom]], [[process-plan]] and [[work-instruction]]s under document control.',
        '[[process-validation|Process validation]] protocols and reports for special processes (7.5.6).',
        '[[pfmea]] and [[control-plan]] linked to operations.',
        'Calibration records for [[tooling]] that takes measurements (7.6).',
        'Operator training records for each work instruction (6.2).'
      ],
      pitfalls: [
        'MBOM typed again by hand in ERP, so it silently drifts away from engineering.',
        'An EBOM change arrives and nobody notices the MBOM is now out of date, because equivalence links were not maintained.',
        'Work instructions written as text documents with screenshots that are obsolete after the first design change.',
        'Vendors approved "globally" although only one plant qualified them.'
      ],
      best: [
        'Build the MBOM by transformation, never by copy; resolve every unallocated EBOM quantity.',
        'Allocate every MBOM line to an operation, so MES can issue parts by step.',
        'Derive work-instruction images from the released CAD so they update with it.',
        'Involve operators in the PFMEA; they know where slips happen.'
      ],
      tagline: { s: 'Plan how the factory will build it, step by step.', x: 'Design transfer: MBOM in the Manufacturing view, MPMLink process plan, work centres, PFMEA.' },
      purpose: {
        s: `Engineering's parts list is arranged by function. The factory needs it arranged by assembly order, plus the steps, benches and tools for each step. This stage rewrites the list for the factory and writes the build instructions.`,
        x: `[[design-transfer]]: the [[ebom]] is transformed into a plant-specific [[mbom]] in the Manufacturing [[views|view]] using [[mpmlink]]. A process plan with operations, work centres, tooling and work instructions is authored and linked to the MBOM. The [[pfmea]] and control plan are created. [[avl|Approved vendors]] are set per plant.` } },
    { n: 6, name: 'ERP Handoff (SAP)', short: 'ERP', mode: 'plant', sys: ['wc', 'sap', 'sup'], full: true,
      happens: {
        s: [
          `When manufacturing data is released in Windchill, a connector sends it to SAP automatically. Nobody retypes part numbers.`,
          `Each part becomes a [[material-master]] in SAP. The factory parts list becomes the SAP [[bom]] and the build recipe becomes the SAP [[routing]].`,
          `The message also says from when the data is valid ([[effectivity]]), for example "from 1 July 2025".`,
          `SAP staff add the business facts Windchill does not hold: prices, storage locations, planning rules.`,
          `SAP's planning run ([[mrp]]) can now work out what to buy and when.` ],
        x: [
          `Resolution of [[change-notice]] CN-2025-0012 triggers [[esi]] publication to the distribution target "SAP Plant 1000". Objects are sent in dependency order: parts, then BOMs, then process plan, all under one SAP change number.`,
          `Mapping: [[wtpart]] → [[material-master]] (basic data, plant view); [[make-buy|source]] → procurement type (E in-house, F external); [[phantom]] → special procurement key; [[mbom]] → [[bom]] (usage 1, production) with item numbers from [[find-number]]s; [[alternate]] / [[substitute]] → alternative item groups {V}; [[process-plan]] → [[routing]] with operations and work centres; CN → engineering change master with valid-from date.`,
          `[[aml]] / [[avl]] publish as manufacturer part numbers, approved manufacturer parts and source-list / info-record data, depending on the configured mapping {V}.`,
          `[[effectivity]]: date effectivity 2025-07-01 for first release. For later changes, serial or date effectivity decides when revision B replaces revision A in production, and [[supersession]] records which part replaces which for service.`,
          `Ownership rule: Windchill owns engineering attributes (description, unit, revision, structure). SAP owns logistics and finance attributes (MRP type, lot size, price, storage). A field must have exactly one owner.`,
          `Each publication is a transaction with a status (Succeeded / Failed) in the Enterprise Systems Transaction Log; failures are corrected and re-sent, never typed in manually.` ] },
      objects: [
        ['Trigger', '[[change-notice]] CN-2025-0012 (Resolved)', 'Release target; carries [[effectivity]].'],
        ['Destination', 'Distribution target "SAP Plant 1000"', 'One per plant / ERP client.'],
        ['Publication record', '[[esi]] transaction TX-000812', 'Pending → Succeeded / Failed, with message log.'],
        ['SAP result', '[[material-master]], [[bom]], [[routing]], change master 500000212', 'Created with valid-from 2025-07-01.']
      ],
      qms: ['Document and data control across systems', 'Change control: one change number in both systems', 'Purchasing controls: only approved sources reach ERP', 'Computer system validation of the interface ([[part11]], [[iso13485]] 4.1.6)'],
      tables: [
        { t: 'What Windchill sends and what it becomes in SAP',
          cols: ['Windchill', 'SAP S/4HANA', 'Example'],
          rows: [
            ['[[wtpart]] MC-CST-6000, revision A', '[[material-master]] MC-CST-6000, revision level A', 'Base unit EA, material type ROH (raw / bought)'],
            ['Source = Buy', 'Procurement type F', 'Triggers purchase requisitions'],
            ['Source = Make', 'Procurement type E', 'Triggers planned / production orders'],
            ['[[mbom]] of MC-STR-3000, Plant 1000', '[[bom]] usage 1, plant 1000', '6 top items, item numbers 0010–0060'],
            ['[[phantom]] MC-PHN-0110', 'Special procurement 50 (phantom assembly) {V}', 'Components issued directly'],
            ['[[process-plan]] PP-T300-01', '[[routing]] group 50001234', 'Operations 0010–0080'],
            ['[[work-center]] B1', 'Work centre B1-1000', 'Capacity and cost centre added in SAP'],
            ['[[change-notice]] CN-2025-0012', 'Engineering change master 500000212', 'Valid from 2025-07-01'],
            ['[[aml]] / [[avl]] for MC-CST-6000', 'Manufacturer parts, source list, info records', 'Vendor 100231 preferred']
          ] },
        { t: 'SAP material master for the castor (sample)', note: 'Grey area in real projects: who owns which field. Here the owner is stated.',
          cols: ['View', 'Field', 'Value', 'Owner'],
          rows: [
            ['Basic data', 'Material / description', 'MC-CST-6000 / Castor 200 mm with brake', 'Windchill'],
            ['Basic data', 'Base unit / revision level', 'EA / A', 'Windchill'],
            ['Purchasing', 'Purchasing group / planned delivery time', '012 / 42 days', 'SAP'],
            ['MRP', 'MRP type / lot size / safety stock', 'PD / EX / 80', 'SAP'],
            ['Quality management', 'Inspection type 01 active; certificate required', 'Yes; supplier certificate of conformity', 'SAP (from Windchill criticality)'],
            ['Accounting', 'Standard price', '€ 27.00', 'SAP']
          ] },
        { t: 'Effectivity and supersession explained with the castor',
          cols: ['Idea', 'Plain meaning', 'Example'],
          rows: [
            ['Date [[effectivity]]', 'The new data is used from a date.', 'T-300 BOM valid from 2025-07-01.'],
            ['Serial [[effectivity]]', 'The new revision is built from a serial number onwards.', 'Castor revision B from serial T3P-260400.'],
            ['Stock disposition', 'What happens to old-revision stock.', 'Use up, rework, or scrap: decided on the change notice.'],
            ['[[supersession]]', 'Which part replaces which for service and ordering.', 'MC-CST-6000 A is superseded by B; A must no longer be supplied as a spare.']
          ] },
        { t: 'Publication log (extract)',
          cols: ['Transaction', 'Object', 'Target', 'Status', 'Time (UTC)'],
          rows: [
            ['TX-000812-01', '63 parts', 'SAP Plant 1000', 'Succeeded', '2025-06-24 08:14'],
            ['TX-000812-02', 'BOM MC-STR-3000 (Manufacturing)', 'SAP Plant 1000', 'Succeeded', '2025-06-24 08:15'],
            ['TX-000812-03', 'Process plan PP-T300-01', 'SAP Plant 1000', 'Failed: work centre PK1-1000 does not exist', '2025-06-24 08:15'],
            ['TX-000812-03 (re-sent)', 'Process plan PP-T300-01', 'SAP Plant 1000', 'Succeeded after work centre was created', '2025-06-24 10:02']
          ] }
      ],
      raci: { roles: ['CA', 'ME', 'DE', 'SC', 'QE', 'PR'], rows: [
        ['Resolve change notice (triggers publication)', 'CA:R ME:C QE:A', true],
        ['Monitor and fix failed transactions', 'CA:R ME:C', false],
        ['Enrich material master (MRP, purchasing, costing)', 'SC:R ME:C PR:C', false],
        ['Maintain source lists and info records', 'SC:R QE:C', false],
        ['Set effectivity and stock disposition', 'CA:R ME:R SC:C QE:A', true],
        ['Activate QM inspection for critical parts', 'QE:R SC:C', false]
      ] },
      evidence: [
        'Proof that ERP holds the same released revision as PLM (reconciliation report).',
        'Validated interface: specification, test evidence, change control of the mapping.',
        'Change number traceable from [[change-notice]] to SAP change master.',
        'Transaction log showing every publication and the handling of failures.'
      ],
      pitfalls: [
        'Fields with two owners: someone "fixes" a description in SAP and the next publication overwrites it.',
        'Publishing parts before plant data exists (work centres, storage locations), causing failures.',
        'Manual corrections in SAP after a failed transaction, leaving the two systems different.',
        'Effectivity left blank, so SAP switches to the new revision immediately while old stock remains.'
      ],
      best: [
        'Agree one owner per attribute and document the mapping.',
        'Dry-run the first publication in a test client with the full structure.',
        'Treat every failed transaction as an incident: fix the cause, then re-send.',
        'Run a monthly PLM–ERP reconciliation of revisions and BOMs.'
      ],
      tagline: { s: 'Send the approved data to the business system that buys and plans.', x: 'ESI / ERP Connector publishes materials, BOM, routing and change number to SAP S/4HANA.' },
      purpose: {
        s: `The factory's business system, SAP, needs the released parts list and build steps so it can order parts and schedule work. Windchill sends them across automatically, so nobody retypes anything.`,
        x: `Release of a [[change-notice]] triggers [[esi]] to publish [[wtpart]]s as [[material-master]] records, the [[mbom]] as SAP BOM, the process plan as routing, and the change as an engineering change master with [[effectivity]]. [[sap]] MRP then creates purchase requisitions.` } },
    { n: 7, name: 'Production', short: 'Production', mode: 'plant', sys: ['sap', 'mes', 'sup'], full: true, mini: 'procurement',
      happens: {
        s: [
          `SAP works out which parts are missing ([[mrp]]) and purchasing orders them from approved suppliers ([[po|PO]]).`,
          `When castors arrive, the warehouse books them in ([[goods-receipt]]). They are not usable yet: a sample is tested first ([[inspection-lot]]).`,
          `Only after passing do the parts move to usable stock.`,
          `A [[production-order]] tells the factory to build 20 stretchers. At each bench the [[mes]] screen shows the step, and the worker scans the parts used.`,
          `Critical checks, such as screw torque and the brake test, are recorded automatically.`,
          `Each finished stretcher gets a serial number and its own build record ([[dhr]]). If anything is wrong, it is tagged and decided by a review board ([[nc|NC]], [[mrb]]).` ],
        x: [
          `Procurement: [[mrp]] creates purchase requisitions ([[pr|PR]]) from the production plan and BOM; the buyer converts them into purchase orders ([[po|PO]]) against the source list (AVL). The PO carries drawing revision and quality requirements (certificate of conformity).`,
          `[[goods-receipt]] posts stock into quality inspection and opens an [[inspection-lot]] (inspection type 01) in [[sap-qm]]. Characteristics come from the inspection plan, which derives from drawing critical characteristics. The usage decision releases stock to unrestricted use or blocks it.`,
          `[[production-order]]s are released to [[mes]]. Each [[operation]] is executed at its [[work-center]]; components are scanned ([[serial-lot|lot / serial]] genealogy), tool calibration is checked, and data collection is enforced before the step can be completed.`,
          `In-process and final inspection results, operator IDs, tool IDs and component lots form the [[dhr]] per serial number. Final release requires DHR review by quality.`,
          `Nonconforming material raises an [[nc]]; the [[mrb]] dispositions it (use as is with justification, rework, return to supplier, scrap). Repeated or serious NCs escalate to [[capa]] or [[scar]].`,
          `A temporary departure from the released definition needs an approved deviation / variance in Windchill before use {V}.` ] },
      objects: [
        ['Purchase need', '[[pr]] 0010045871 (SAP)', 'Created by MRP → converted to PO.'],
        ['Order to supplier', '[[po]] 4500012345 (SAP)', 'Open → goods received → invoiced.'],
        ['Incoming check', '[[inspection-lot]] 010000004711 ([[sap-qm]])', 'Created → results recorded → usage decision A (accept).'],
        ['Factory order', '[[production-order]] 1000234 (SAP → MES)', 'Released → confirmed → delivered to stock.'],
        ['Build record', '[[dhr]] per serial (MES + SAP)', 'Complete → reviewed → released.'],
        ['Problem record', '[[nc]] NC-2025-0031', 'Open → MRB disposition → closed.']
      ],
      qms: ['Purchasing and verification of purchased product ([[iso13485]] 7.4)', 'Production and service provision (7.5)', 'Identification and traceability (7.5.8, 7.5.9)', 'Monitoring and measurement of product (8.2.6)', 'Control of nonconforming product (8.3)', 'Calibration (7.6)'],
      tables: [
        { t: 'Procurement records for one castor delivery',
          cols: ['Step', 'Record', 'Key data', 'Date'],
          rows: [
            ['MRP run', 'Planned requirement', '80 × MC-CST-6000 for production order 1000234, plus safety stock', '2025-07-14'],
            ['[[pr]]', '0010045871', '400 × MC-CST-6000, plant 1000', '2025-07-14'],
            ['[[po]]', '4500012345', 'Norvale Castor Works (vendor 100231), 400 pcs, € 27.00, drawing rev A, certificate required', '2025-07-15'],
            ['Supplier ships', 'Delivery note NCW-DN-88231', 'Lot NCW-L2509, certificate of conformity attached', '2025-08-28'],
            ['[[goods-receipt]]', 'Material document 5000098812', '400 pcs to quality-inspection stock', '2025-09-02'],
            ['[[inspection-lot]]', '010000004711', 'Sample 13 of 400; brake holding torque 13.1–14.6 N·m (limit ≥ 12); stem diameter OK', '2025-09-03'],
            ['Usage decision', 'A — accepted', '400 pcs to unrestricted stock, batch NCW-L2509', '2025-09-03']
          ] },
        { t: 'Device history record, serial T3P-250001 (extract)', note: 'One of 20 units of production order 1000234.',
          cols: ['Operation', 'Bench / operator', 'Components scanned', 'Result recorded'],
          rows: [
            ['OP10', 'B1 / C. Mendes', 'Frame lot F-2508-03; castors lot NCW-L2509 ×4; brake linkage lot BR-2508-11', 'Stem torque 25.2 / 24.9 / 25.1 / 25.0 N·m; clamp 9.1 N·m; tool TL-0031 (cal. due 2025-12)'],
            ['OP20', 'B1 / C. Mendes', '—', 'Brake holding torque 13.4 / 13.9 / 13.2 / 14.1 N·m: pass'],
            ['OP30', 'B2 / operator 0217', 'Columns S/N HX-88120, HX-88121', 'Leak-down 0.6 mm: pass'],
            ['OP50', 'B3 / operator 0142', 'Battery S/N VP-250771; PCBA S/N TE-0034117', 'Firmware FW-8200 v1.2.0, checksum OK'],
            ['OP70', 'B4 / inspector 0305', 'Label set, UDI (21)T3P-250001', 'Electrical safety pass; UDI scan verified'],
            ['DHR review', 'Quality / D. Okoro', '—', 'Released for shipment 2025-09-16 (e-signature)']
          ] },
        { t: 'Nonconformance example',
          cols: ['Field', 'Value'],
          rows: [
            ['Record', 'NC-2025-0031'],
            ['Found at', 'OP60, bench B3, 2025-09-11'],
            ['Item', '[[p:MC-RAL-4000]] side rail, lot SR-2509-02, 3 pcs'],
            ['Defect', 'Scratches on top tube beyond cosmetic standard'],
            ['[[mrb]] disposition', 'Rework: re-polish per work instruction WI-RW-014; re-inspect'],
            ['Closed', '2025-09-12 by D. Okoro (Quality) with e-signature']
          ] }
      ],
      raci: { roles: ['SC', 'SQ', 'QE', 'PR', 'ME'], rows: [
        ['Convert requisitions to purchase orders', 'SC:R SQ:I', false],
        ['Goods receipt', 'PR:R SC:I', false],
        ['Incoming inspection and usage decision', 'QE:A SQ:C PR:R', true],
        ['Assemble per work instruction', 'PR:R ME:C', false],
        ['In-process and final inspection', 'PR:R QE:A', true],
        ['NC disposition (MRB)', 'QE:A ME:R SQ:C PR:C', true],
        ['DHR review and product release', 'QE:R PR:C', true]
      ] },
      evidence: [
        'Purchasing records naming the approved supplier and requirements (7.4.2).',
        'Incoming inspection records with acceptance criteria and results (7.4.3).',
        'Complete [[dhr]]: dates, quantities, acceptance records, labels, [[udi]], serials (7.5.1, QMSR 820.35).',
        'Traceability from finished serial to component lots (7.5.9).',
        'Calibration status of measuring tools at time of use (7.6).',
        '[[nc]] records with disposition, justification and authorisation (8.3).'
      ],
      pitfalls: [
        'Parts used from quality-inspection stock before the usage decision.',
        'Lots not scanned at the bench, so genealogy has holes exactly where a recall needs it.',
        'NCs closed as "use as is" without a documented justification.',
        'Operators working from printed, outdated instructions.'
      ],
      best: [
        'Make scanning easier than not scanning: labels at point of use, MES blocks on missing data.',
        'Derive inspection characteristics from the drawing, not from a separate hand-made list.',
        'Review NC trends weekly; three similar NCs are a CAPA candidate.',
        'Keep pilot-build learnings flowing back as change requests.'
      ],
      tagline: { s: 'Parts arrive, get inspected, and the stretcher is built and tested at the bench.', x: 'Procurement, incoming inspection, assembly by operation in MES, in-process and final inspection, DHR.' },
      purpose: {
        s: `Bought parts arrive and are checked. Workers assemble the stretcher at benches following on-screen instructions, and each finished stretcher gets its own serial number and test record.`,
        x: `Purchase orders, goods receipt and inspection lots in [[sap]]; production orders executed in [[mes]] by operation and work centre. Serial and lot genealogy forms the [[dhr]]. Nonconforming material is handled through [[nc]] records.` } },
    { n: 8, name: 'Packaging, Labeling, UDI & Market', short: 'Pack & UDI', mode: 'packaged', sys: ['mes', 'sap', 'svc'], full: true,
      happens: {
        s: [
          `The finished stretcher is packed with its instruction booklet ([[ifu]]), quick guide and accessories. The packaging is a parts list of its own ([[packaging-bom]]).`,
          `A label is printed with the maker, model, safe load, warnings and the [[udi]] code. It is scanned back to prove the right label is on the right stretcher.`,
          `Before the first sale, the model is registered in the official databases ([[gudid]] in the US, [[eudamed]] in the EU), and the company signs a [[doc|declaration of conformity]].`,
          `Quality gives the final release. The warehouse ships the stretcher, and the system remembers which serial number went to which hospital ([[installed-base]]).` ],
        x: [
          `[[packaging-bom]] MC-PKG-9100 is a released structure (carton, corner protectors, bag, [[ifu]], quick guide, accessories). Packaging is validated for transport (drop / vibration testing) and is part of the [[mdf|medical device file]].`,
          `[[labeling]]: artwork is a controlled document linked to the label part; variable data ([[udi-pi]]: serial, manufacturing date) is merged at print from the production order. QMSR 820.45 and [[iso13485]] 7.5.1 require inspection of label accuracy before release: here a scan-back in OP70.`,
          `[[udi]]: one [[udi-di]] per variant and per packaging level. DI attributes are submitted to [[gudid]] and [[eudamed]] before placing on the market; PTC offers a UDI solution for assembling and submitting the data set {V}.`,
          `Regulatory release: EU [[doc|declaration of conformity]] and CE mark under [[eumdr]]; US establishment registration and device listing, plus [[k510]] clearance where required {V}.`,
          `Distribution ([[iso13485]] 7.5.11, 7.5.9.2): delivery, batch / serial and consignee are recorded so every unit can be located for a [[fsca|field action]]. Battery packs ship under dangerous-goods rules.`,
          `The shipped serial with its as-built configuration creates the [[installed-base]] record used by service in [[s:9]].` ] },
      objects: [
        ['Packaging list', '[[packaging-bom]] MC-PKG-9100 ([[wtpart]] structure)', 'Released, revision A.'],
        ['Label and IFU artwork', '[[wtdocument]] / artwork linked to [[p:MC-LBL-9000]]', 'Released; language variants by REGION option.'],
        ['UDI data set', 'UDI record per [[udi-di]] {V}', 'Draft → Submitted → Published.'],
        ['Conformity', '[[doc|Declaration of conformity]] DOC-DOC-0301', 'Released, signed by Regulatory and Management.'],
        ['Shipment', 'SAP delivery 80004567', 'Picked → packed → goods issue.'],
        ['Unit in the field', '[[installed-base]] record per serial', 'Created at goods issue.']
      ],
      qms: ['Labeling and packaging controls (QMSR 820.45; [[iso13485]] 7.5.1)', 'Preservation of product (7.5.11)', 'Identification and traceability, distribution records (7.5.8, 7.5.9)', 'Regulatory: [[udi]], registration, [[doc|declaration of conformity]]', 'Product release (8.2.6)'],
      tables: [
        { t: 'Packaging BOM MC-PKG-9100',
          cols: ['Number', 'Item', 'Qty', 'Note'],
          rows: [
            ['MC-PKG-9110', 'Shipping carton, triple-wall, printed', '1', 'Carries shipping-level UDI'],
            ['MC-PKG-9120', 'Corner protector, foam', '8', ''],
            ['MC-PKG-9130', 'Dust bag, PE', '1', ''],
            ['IFU-T300', 'Instructions for use, language pack per REGION', '1', 'Revision A; controlled document'],
            ['MC-PKG-9140', 'Quick guide card', '1', 'Brake and height controls'],
            ['MC-PKG-9150', 'Battery charger with mains lead (powered only)', '1', 'Option DRIVE = POWERED']
          ] },
        { t: 'What the UDI label says', note: 'All identifiers are invented.',
          cols: ['On the label', 'Meaning', 'Value'],
          rows: [
            ['Manufacturer', 'Who is legally responsible', 'MediCare Devices Ltd'],
            ['REF', 'Catalogue / model number', 'MC-STR-3000 · T-300P'],
            ['(01)', '[[udi-di]]: model and package level', '09999999300017'],
            ['(11)', 'Date of manufacture', '250915 = 15 September 2025'],
            ['(21)', 'Serial number ([[udi-pi]])', 'T3P-250001'],
            ['Symbols', 'Safe working load, read the IFU, CE mark, medical device', '250 kg · IFU · CE · MD']
          ] },
        { t: 'UDI-DI per variant and packaging level',
          cols: ['Item', 'UDI-DI (invented)', 'Why it is separate'],
          rows: [
            ['T-300M, single unit', '(01)09999999300000', 'Different model: no electrical parts'],
            ['T-300P, single unit', '(01)09999999300017', 'Powered variant'],
            ['T-300P, shipping carton', '(01)19999999300014', 'Higher packaging level gets its own DI']
          ] },
        { t: 'Database record for the T-300P (extract)',
          cols: ['Field', 'Value'],
          rows: [
            ['Brand / model', 'TransPort / T-300P'],
            ['Device description', 'Hospital patient transport stretcher, powered drive'],
            ['Production identifiers on label', 'Serial number, manufacturing date'],
            ['Single use / sterile', 'No / No'],
            ['Contains batteries', 'Yes (LiFePO4)'],
            ['Submitted', 'GUDID and EUDAMED, 2025-08-20, by Lena Fischer (Regulatory)']
          ] },
        { t: 'First shipment',
          cols: ['Step', 'Record', 'Detail'],
          rows: [
            ['Final release', 'DHR review', 'Serials T3P-250001 to -250020 released 2025-09-16'],
            ['Delivery', '80004567', '6 units to St. Aldwyn General Hospital (invented)'],
            ['Goods issue', '2025-09-18', 'Serials and consignee recorded: distribution record'],
            ['Installed base', 'Equipment records', 'One per serial, with as-built configuration']
          ] }
      ],
      raci: { roles: ['RA', 'QE', 'PR', 'ME', 'SC', 'MG'], rows: [
        ['Approve label and IFU content', 'RA:A QE:C ME:C', true],
        ['Assign and register UDI-DI', 'RA:R QE:I', true],
        ['Print and verify labels', 'PR:R QE:A', false],
        ['Pack per packaging instruction', 'PR:R ME:C', false],
        ['Declaration of conformity', 'RA:R QE:C MG:A', true],
        ['Final product release', 'QE:R PR:C', true],
        ['Ship and record distribution', 'SC:R PR:R QE:I', false]
      ] },
      evidence: [
        'Label inspection record before release, including [[udi]] accuracy.',
        'Approved label and [[ifu]] revisions matching what was shipped.',
        '[[gudid]] / [[eudamed]] submission confirmations.',
        'Signed [[doc|declaration of conformity]] and technical documentation.',
        'Distribution records: consignee, quantity, serials, date.',
        'Packaging validation report.'
      ],
      pitfalls: [
        'A design change that needed a new UDI-DI but kept the old one.',
        'IFU revised in the document system but the old revision still in the packaging kit.',
        'Label templates edited at the printer instead of through change control.',
        'Distribution records that cannot be searched by serial when a recall starts.'
      ],
      best: [
        'Manage labels and IFU as parts in the BOM with revisions and effectivity.',
        'Add "UDI-DI impact?" as a mandatory question on every change request.',
        'Print variable data straight from order data; verify by scan.',
        'Test the recall drill once a year: find every unit of one lot within hours.'
      ],
      tagline: { s: 'Box it, label it with its unique ID, register it, ship it.', x: 'Packaging BOM, label and IFU control, UDI assignment, GUDID / EUDAMED registration, distribution.' },
      purpose: {
        s: `Each stretcher is packed with its instructions and gets a label carrying a unique code, like a passport number. The code is registered with the authorities so any stretcher can be traced.`,
        x: `Packaging BOM and label artwork are released parts. The [[udi]] label carries [[udi-di]] and [[udi-pi]]; device records are submitted to [[gudid]] and [[eudamed]]. Final quality release precedes shipment; installed-base records are created.` } },
    { n: 9, name: 'Service', short: 'Service', mode: 'hospital', sys: ['svc', 'sap'], full: true, mini: 'service',
      happens: {
        s: [
          `A service engineer unpacks and checks the stretcher at the hospital, then trains the staff who will use it.`,
          `Every year the stretcher gets a check-up: brakes, hydraulics, battery.`,
          `If something breaks, the hospital calls. A service job is opened, the right spare part is sent, and the engineer repairs it and writes down what was done.`,
          `Spare parts come from an approved list ([[sbom|service BOM]]). Some come as ready-made repair sets ([[spare-kit]]).`,
          `Repairs in the first two years are free under [[warranty]]. Units sent back to the factory travel under a return number ([[rma]]).`,
          `Years later, parts may stop being made ([[obsolescence]]), and one day the model is retired ([[eol]]).` ],
        x: [
          `Installation and user training are documented per serial ([[iso13485]] 7.5.3 where installation requirements apply). The [[installed-base]] record holds as-built and, after repairs, as-maintained configuration.`,
          `The [[sbom]] (Service view) defines [[service-part]]s, [[spare-kit]]s and replacement rules; [[supersession]] chains tell service which revision replaces which. Service procedures and the maintenance schedule are controlled documents.`,
          `[[field-service]] orders in SAP record symptom, cause, parts consumed (with lot / serial), labour and tests after repair. Servicing records must be analysed as a quality data source; any service report that meets complaint criteria is handled as a [[complaint]] (ISO 13485 7.5.4, QMSR 820.35).`,
          `[[warranty]] claims and [[rma]] returns are linked to the serial; returned parts go to failure analysis. [[refurbishment]] restores a used unit to specification under a controlled procedure without changing its intended purpose.`,
          `Field improvements are communicated by [[service-bulletin]]; safety-related ones are a [[fsca]].`,
          `[[obsolescence]] notices from suppliers trigger a [[ltb|last-time buy]] or a redesign through change control. [[eol]] is planned: last order date, end of service, spare-part commitment, and disposal information (battery take-back).` ] },
      objects: [
        ['Unit in the field', '[[installed-base]] / equipment record per serial', 'Installed → in service → retired.'],
        ['Spare-parts list', '[[sbom]] (Service view) in Windchill', 'Released; follows design changes by [[supersession]].'],
        ['Repair set', '[[spare-kit]] MC-KIT-6000', 'Released, revision A.'],
        ['Service job', 'Service order SO-2026-0412 (SAP)', 'Open → in process → completed.'],
        ['Return', '[[rma]] RMA-2026-0077', 'Authorised → received → analysed → closed.'],
        ['Field information', '[[service-bulletin]] SB-T300-001', 'Released; distribution tracked.']
      ],
      qms: ['Installation and servicing ([[iso13485]] 7.5.3, 7.5.4)', 'Servicing records as input to complaint handling', 'Post-market surveillance ([[pms]])', 'Traceability of spare parts', 'Obsolescence and end-of-life management'],
      tables: [
        { t: 'Service BOM and spare kits (extract)',
          cols: ['Service item', 'Contains', 'Replaces / note', 'Typical job time'],
          rows: [
            ['MC-KIT-6000 Castor service kit', '1 × [[p:MC-CST-6000]], fixing screw, thread-lock capsule', 'Fits all four positions', '20 min'],
            ['MC-KIT-6100 Brake linkage kit', 'Clamp screws ×4, pedal pads, hex-bar bushes', 'For [[p:MC-BRK-6100]]', '35 min'],
            ['MC-KIT-3200 Gas spring kit', '1 × [[p:MC-GSP-3200]], clips', '', '15 min'],
            ['MC-KIT-2000 Lift column exchange', '1 × [[p:MC-HYD-2000]] (exchange unit), seals', 'Old unit returned under RMA', '45 min'],
            ['MC-KIT-8300 Battery pack', '1 × [[p:MC-BAT-8300]]', 'Dangerous-goods shipment; old pack to take-back', '10 min'],
            ['MC-MAT-5000 Mattress', 'Sold as single [[service-part]]', '', '2 min']
          ] },
        { t: 'Maintenance schedule (from the service manual)',
          cols: ['Interval', 'Check', 'Limit'],
          rows: [
            ['Before each use (user)', 'Brake holds, indicator shows red', 'No rolling when pushed'],
            ['Yearly (service)', 'Brake holding torque on each castor', '≥ 12 N·m'],
            ['Yearly', 'Hydraulic leak-down', '≤ 2 mm in 10 min at 250 kg'],
            ['Yearly (powered)', 'Electrical safety test, battery capacity', 'Per [[iec60601]] recurrent test; ≥ 80 % capacity'],
            ['Every 5 years', 'Replace gas spring', 'Preventive']
          ] },
        { t: 'Service order sample',
          cols: ['Field', 'Value'],
          rows: [
            ['Order', 'SO-2026-0412, opened 2026-05-04'],
            ['Customer / unit', 'St. Aldwyn General Hospital (invented) / serial T3P-250118'],
            ['Reported', '"Brake does not lock on one wheel"'],
            ['Found', 'Foot-end right castor: brake cam not fully engaging'],
            ['Action', 'Replaced castor with kit MC-KIT-6000 (castor lot NCW-L2601); brake torque after repair 13.6 N·m'],
            ['Engineer', 'Hannah Lindqvist, completed 2026-05-06'],
            ['Follow-up', 'Meets complaint criteria → complaint CMP-2026-0231; removed castor returned under RMA-2026-0077']
          ] },
        { t: 'Warranty, returns, refurbishment, end of life',
          cols: ['Topic', 'Rule for the T-300'],
          rows: [
            ['[[warranty]]', '24 months from installation; battery 12 months. Claims recorded against the serial.'],
            ['[[rma]]', 'No return without an RMA number; decontamination certificate required before shipping.'],
            ['[[refurbishment]]', 'Factory process RF-T300: inspect, replace wear parts, full final test (OP20, OP70), new DHR entry; original serial and UDI kept.'],
            ['[[obsolescence]]', 'Supplier notice PCN-2027-014: motor driver IC on [[p:MC-PCB-8200]] ends production.'],
            ['[[ltb|Last-time buy]]', '1 800 pieces ordered to cover production and 7 years of service while a redesign is qualified.'],
            ['[[eol]]', 'Announce last order date; supply spares 7 years after last sale; disposal instructions and battery take-back in the IFU.']
          ] }
      ],
      raci: { roles: ['SE', 'CH', 'QE', 'SC', 'DE', 'RA'], rows: [
        ['Install and train users', 'SE:R QE:I', false],
        ['Maintain the service BOM and kits', 'SE:C DE:R QE:C SC:C', true],
        ['Perform and record service', 'SE:R', false],
        ['Screen service reports for complaints', 'SE:R CH:A QE:C', false],
        ['Analyse returned parts', 'QE:R DE:C SE:C', false],
        ['Issue service bulletins', 'SE:R DE:C QE:A RA:C', true],
        ['Manage obsolescence and last-time buy', 'SC:R DE:R QE:C', false]
      ] },
      evidence: [
        'Installation and training records per serial.',
        'Service records with date, serial / [[udi]], work done, parts used, test results, and the person servicing (QMSR 820.35).',
        'Evidence that service reports were evaluated as possible complaints.',
        'Controlled service manual and [[sbom]] at the correct revision.',
        'Records of spare-part lots installed, for traceability.'
      ],
      pitfalls: [
        'Service reports that describe a failure but are never forwarded as complaints.',
        'Spare parts of a superseded revision still on the shelf and fitted in the field.',
        'As-maintained configuration not updated, so nobody knows which units got the fix.',
        'Obsolescence discovered only when a purchase order is rejected.'
      ],
      best: [
        'Derive the service BOM from the EBOM so design changes flow to spares automatically.',
        'Give engineers a mobile form with mandatory symptom / cause / part-lot fields.',
        'Monitor component lifecycle notices for all bought electronics.',
        'Review service data monthly with quality: it is the earliest signal you have.'
      ],
      tagline: { s: 'In the hospital: installation, training, maintenance and repairs.', x: 'Installed base, service BOM, spare parts and kits, service orders, warranty, RMA.' },
      purpose: {
        s: `The stretcher works in the hospital for years. Service engineers install it, train staff, maintain it and repair it with approved spare parts, and record every job.`,
        x: `The [[sbom]] defines serviceable items and spare kits. Service orders, spare-part consumption and repair records are linked to the serial number and feed post-market surveillance.` } },
    { n: 10, name: 'Feedback: Complaint → CAPA → Change', short: 'Feedback', mode: 'service', sys: ['svc', 'wc'], full: true,
      happens: {
        s: [
          `A hospital reports that a brake did not lock. That report is a [[complaint]] and must be written down the same day.`,
          `First question: could someone have been seriously hurt? If yes, the authorities must be told within a fixed time ([[emdr]] in the US, [[vigilance]] in the EU).`,
          `The returned part is examined to find the real cause, not only the symptom.`,
          `A [[capa]] fixes the cause for good: here, a better brake cam and an extra check in the factory.`,
          `The fix goes through the same controlled route as the original design: [[problem-report]] → [[change-request]] → [[change-notice]], with new tests and signatures.`,
          `Stretchers already in hospitals are covered too, by a [[service-bulletin]] or, if safety demands it, a [[fsca|field safety corrective action]].`,
          `Months later the company checks that the problem has really stopped. Only then is the case closed.` ],
        x: [
          `[[complaint]] intake records event, device ([[udi]], serial), patient involvement and reporter; evaluation decides investigation need and reportability: US MDR under 21 CFR 803 ([[emdr]], generally 30 calendar days, 5 work days in defined cases); EU [[vigilance]] under [[eumdr]] Art. 87 (15 days for serious incidents; 10 for death or unanticipated serious deterioration; 2 for serious public-health threat). Confirm current timelines with Regulatory {V}.`,
          `Investigation uses the [[dhr]], component genealogy, returned-part analysis and similar-complaint search. Nonconforming stock is contained by [[nc]] / [[mrb]].`,
          `[[capa]] ([[iso13485]] 8.5.2): root cause, action plan, verification that actions do not adversely affect the device, effectiveness criteria. Supplier-caused issues raise a [[scar]].`,
          `Design change through Windchill change management: [[problem-report]] → [[change-request]] (impact on [[risk-file]], V&V, regulatory filings, [[udi-di]], stock, field) → [[ccb]] → [[change-notice]] with [[change-task]]s. Resulting revisions carry [[effectivity]] and publish to SAP via [[esi]].`,
          `Field action decision under [[iso14971]] risk assessment: [[service-bulletin]] for improvements; [[fsca]] / recall with field safety notice and authority reporting (21 CFR 806; EU MDR Art. 89) when risk requires.`,
          `[[pms|Post-market surveillance]] trends complaints, service data and NCs against the risk file estimates; results feed management review and the periodic PMS report.`,
          `The full step-by-step story with a sample record at every step arrives in Phase 3.` ] },
      objects: [
        ['Customer report', '[[complaint]] CMP-2026-0231', 'Open → Under Evaluation → Investigation → Closed.'],
        ['Authority report', '[[emdr]] / [[vigilance]] report (if reportable)', 'Decision documented either way.'],
        ['Containment', '[[nc]] NC-2026-0113 + [[mrb]]', 'Open → dispositioned → closed.'],
        ['Root-cause fix', '[[capa]] CAPA-2026-0017', 'Open → Investigation → Implementation → Effectiveness check → Closed.'],
        ['Change chain', '[[problem-report]] PRB-2026-0058 → [[change-request]] CR-2026-0044 → [[change-notice]] CN-2026-0039', 'Each with its own workflow and signatures.'],
        ['Supplier action', '[[scar]] SCAR-2026-0009', 'Issued → response → verified → closed.'],
        ['Field communication', '[[service-bulletin]] SB-T300-004', 'Released; completion tracked per serial.']
      ],
      qms: ['Complaint handling ([[iso13485]] 8.2.2)', 'Reporting to regulatory authorities (8.2.3)', 'Control of nonconforming product (8.3), including after delivery (8.3.3)', 'Corrective and preventive action (8.5.2, 8.5.3)', 'Design and development changes (7.3.9)', 'Post-market surveillance and management review'],
      tables: [
        { t: 'Where feedback comes from',
          cols: ['Source', 'Example', 'Goes to'],
          rows: [
            ['Customer complaints', '"Brake fails to lock on one castor"', '[[complaint]] record'],
            ['Service reports', 'Castor replaced on 3 units in one month', 'Screened for complaints; trend'],
            ['Production NCs', 'Castor lot below brake torque at incoming inspection', '[[nc]], possibly [[scar]]'],
            ['Supplier notices', 'Process change or obsolescence', 'Change control'],
            ['Audits and reviews', 'Audit finding on torque records', '[[capa]]'],
            ['Literature, similar devices, authorities', 'Safety notice on a comparable brake', '[[pms]] review, risk file']
          ] },
        { t: 'The closed loop for the brake problem (summary)', note: 'Every ID here reappears in the Phase 3 story.',
          cols: ['Step', 'Record', 'Owner (invented)', 'Date'],
          rows: [
            ['Complaint received', 'CMP-2026-0231', 'Omar Haddad (Complaint Handler)', '2026-05-06'],
            ['Reportability decision', 'Not reportable: no injury, malfunction assessed; decision signed', 'Lena Fischer (Regulatory)', '2026-05-08'],
            ['Containment', 'NC-2026-0113: castor lot NCW-L2604 blocked', 'Daniel Okoro (Quality)', '2026-05-11'],
            ['CAPA opened', 'CAPA-2026-0017', 'Daniel Okoro', '2026-05-12'],
            ['Supplier action', 'SCAR-2026-0009 to Norvale Castor Works', 'Mei Tanaka (Supplier Quality)', '2026-05-14'],
            ['Change', 'PRB-2026-0058 → CR-2026-0044 → CN-2026-0039', 'Asha Verma / Priya Nair', '2026-05-20 to 2026-07-03'],
            ['New revision effective', 'MC-CST-6000 B and MC-BRK-6100 B from serial T3P-260400', 'Marco Rossi (Manufacturing)', '2026-07-13'],
            ['Field', 'SB-T300-004: inspect and replace castors of lots NCW-L2510 / L2604', 'Hannah Lindqvist (Service)', '2026-07-20'],
            ['Effectiveness check', 'No recurrence in 3 months and 400 units', 'Daniel Okoro', '2026-10-19']
          ] },
        { t: 'Service bulletin or field safety corrective action?',
          cols: ['', '[[service-bulletin]]', '[[fsca]] / recall'],
          rows: [
            ['When', 'Improvement or low risk; done at next service', 'Risk of serious harm; needs prompt action'],
            ['Who decides', 'Quality + Service, with risk assessment', 'Quality + Regulatory + Management, with risk assessment'],
            ['Customer message', 'Bulletin to service organisation', 'Field safety notice to every affected customer'],
            ['Authorities', 'Not normally notified', 'Reported (US 21 CFR 806; EU MDR Art. 89) {V}'],
            ['Tracking', 'Completion per serial', 'Completion per serial, effectiveness checks, authority close-out']
          ] }
      ],
      raci: { roles: ['CH', 'RA', 'QE', 'DE', 'SQ', 'CA', 'SE', 'MG'], rows: [
        ['Record and evaluate the complaint', 'CH:R QE:C RA:C', false],
        ['Reportability decision', 'CH:C RA:R QE:C MG:I', true],
        ['Investigation and root cause', 'QE:R DE:R SQ:C SE:C', false],
        ['CAPA plan approval', 'QE:R DE:C MG:A', true],
        ['Supplier corrective action', 'SQ:R QE:A', true],
        ['Change request decision (CCB)', 'CA:R DE:C QE:A RA:C', true],
        ['Field action decision', 'QE:R RA:R SE:C MG:A', true],
        ['Effectiveness check and closure', 'QE:R CH:I MG:I', true]
      ] },
      evidence: [
        'Complaint records with evaluation, investigation (or documented reason for none) and reply.',
        'Documented reportability decision for every complaint, with timeline compliance.',
        '[[capa]] records: cause, actions, verification, effectiveness.',
        'Design change records including risk file update and V&V (7.3.9).',
        'Field action records: affected serials, completion status, authority correspondence.',
        '[[pms]] report and management review minutes showing trend analysis.'
      ],
      pitfalls: [
        'Fixing the single unit and closing the complaint without asking "why did it happen?".',
        'Reportability decided late because the clock was thought to start at investigation end, not at awareness.',
        'CAPA closed when actions are done, before effectiveness is shown.',
        'Design changed but stock, spares and field units forgotten.'
      ],
      best: [
        'Link records end to end: complaint → CAPA → change → effectivity → field action.',
        'Start the reportability clock at the first awareness and document it.',
        'Define effectiveness criteria when the CAPA is opened.',
        'Feed every confirmed failure mode back into the DFMEA / PFMEA occurrence scores.'
      ],
      tagline: { s: 'Problems from the field come back and make the design better.', x: 'Complaint handling, reportability, CAPA, change control closing the loop to design and production.' },
      purpose: {
        s: `If something goes wrong in a hospital, it is recorded, investigated and fixed at the root, and the fix flows back into the design, the factory and the stretchers already in use.`,
        x: `[[complaint]] intake and reportability assessment, investigation, [[capa]], then [[problem-report]] → [[change-request]] → [[change-notice]] with [[effectivity]]; supplier [[scar]] where applicable; effectiveness check before closure.` } }
  ],

  /* ---------------------------------------------------------------------
     PARTS. One record per WTPart. "lvl" is the indent level in the BOM.
     Phase 2 adds the full digital thread (AVL, POs, lots, service history).
     --------------------------------------------------------------------- */
  parts: [
    { id: 'MC-STR-3000', name: 'TransPort T-300 stretcher', lvl: 0, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Assembly', sup: 'MediCare Devices Ltd, Plant 1000', crit: 'Finished device', lead: '—', cost: '—',
      s: 'The complete stretcher: everything below is a part of it.', x: 'Top-level configurable module. Variants T-300M and T-300P are generated from it with options.', rel: ['configurable-module', 'option-variant', 'ebom', 'udi-di'] },
    { id: 'MC-FRM-1000', name: 'Base frame weldment', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Steel S355 tube, powder-coated', sup: 'In-house welding; tube from Arden Tube & Profile', crit: 'Structural', lead: '10 days', cost: '€ 148',
      s: 'The steel chassis near the floor. The wheels and lifting columns bolt onto it.', x: 'Welded per drawing MC-FRM-1000.drw; weld procedure qualified; coating thickness is an inspection characteristic.', rel: ['make-buy', 'drawing', 'wtpart'] },
    { id: 'MC-FRM-1100', name: 'Litter frame with deck', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Aluminium 6061-T6, HPL deck panel', sup: 'In-house', crit: 'Structural', lead: '8 days', cost: '€ 121',
      s: 'The upper frame the patient lies on. It carries the mattress, rails and backrest.', x: 'Carries the safe-working-load path to the lift columns. Entrapment gaps to the side rails are critical dimensions (HAZ-003).', rel: ['swl', 'hazard', 'drawing'] },
    { id: 'MC-HYD-2000', name: 'Hydraulic lift column', lvl: 1, qty: 2, rev: 'A', state: 'Released', mb: 'Buy', mat: 'Steel / chrome rod, hydraulic oil', sup: 'Helixa Hydraulics', crit: 'Safety-related', lead: '35 days', cost: '€ 96',
      s: 'Two telescopic legs that raise and lower the patient surface when the foot pump is pressed.', x: 'Source-control drawing fixes stroke 350 mm, load rating and leak-down limit. DFMEA row DF-040.', rel: ['manufacturer-part', 'aml', 'dfmea'] },
    { id: 'MC-HYD-2100', name: 'Foot pump pedal assembly', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'Steel, rubber pad', sup: 'Helixa Hydraulics', crit: 'Standard', lead: '35 days', cost: '€ 34',
      s: 'The pedal a porter pumps with a foot to raise the stretcher.', x: 'Supplied matched to the lift columns; pedal force is a design input (usability).', rel: ['design-input', 'iec62366'] },
    { id: 'MC-BKR-3100', name: 'Backrest panel assembly', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Aluminium frame, HPL panel', sup: 'In-house', crit: 'Standard', lead: '8 days', cost: '€ 58',
      s: 'The hinged section that lets the patient sit up.', x: 'Hinge guarded against pinch (HAZ-018). Angle range 0–70° verified in VT-025.', rel: ['hazard', 'verification'] },
    { id: 'MC-GSP-3200', name: 'Backrest gas spring', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'Steel, nitrogen charge', sup: 'Brightspan Gas Springs', crit: 'Safety-critical', lead: '28 days', cost: '€ 22',
      s: 'A sealed strut, like the one that holds a car boot open. It takes the weight of the backrest so it moves gently.', x: 'Lockable gas spring 600 N with damped descent; DFMEA row DF-034; lot-traceable.', rel: ['dfmea', 'risk-control', 'aml'] },
    { id: 'MC-RAL-4000', name: 'Side rail assembly', lvl: 1, qty: 2, rev: 'A', state: 'Released', mb: 'Make', mat: 'Stainless steel 304 tube', sup: 'In-house', crit: 'Safety-related', lead: '8 days', cost: '€ 47',
      s: 'Fold-down rails on both sides that stop the patient rolling off.', x: 'Gap dimensions control entrapment (HAZ-003). Latch force verified.', rel: ['hazard', 'risk-control'] },
    { id: 'MC-IVP-4500', name: 'IV pole, telescopic', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'Stainless steel 304', sup: 'Arden Tube & Profile', crit: 'Standard', lead: '21 days', cost: '€ 19',
      s: 'The pole that holds drip bags above the patient.', x: 'Option IVPOLE = TELESCOPIC. Hook load 2 × 2 kg verified in VT-040.', rel: ['option-variant', 'verification'] },
    { id: 'MC-MAT-5000', name: 'Mattress, 80 mm', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'PU foam, PU-coated polyester cover', sup: 'Calder Foam & Textiles', crit: 'Patient-contact', lead: '30 days', cost: '€ 64',
      s: 'The padded surface the patient lies on, with a wipe-clean cover.', x: 'Patient-contact material: biocompatibility evidence per ISO 10993, flammability, REACH declaration. Option MATTRESS = STD.', rel: ['biocompatibility', 'reach', 'option-variant'] },
    { id: 'MC-CST-6000', name: 'Castor 200 mm with brake', lvl: 1, qty: 4, rev: 'A', state: 'Released', mb: 'Buy', mat: 'PA6 housing, PU tread, steel bearing', sup: 'Norvale Castor Works (preferred), Rollaxis Components (approved)', crit: 'Safety-critical', lead: '42 days', cost: '€ 27',
      alt: [{ id: 'MC-CST-6001', name: 'Castor 200 mm with brake, second design', why: 'Interchangeable everywhere: same interface, load rating and brake torque; verified with VT-012.' }],
      s: 'One of four swivelling wheels. Each has a built-in brake that the central pedal locks.', x: 'Source-control drawing: load rating 150 kg per castor, brake holding torque ≥ 12 N·m, ESD-conductive tread. DFMEA row DF-021, hazard HAZ-007, risk control RC-007a.', rel: ['alternate', 'aml', 'manufacturer-part', 'dfmea', 'hazard'] },
    { id: 'MC-BRK-6100', name: 'Central brake linkage and pedal', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Steel hex bar 11 mm, zinc-plated; PA pedal', sup: 'In-house', crit: 'Safety-critical', lead: '6 days', cost: '€ 39',
      s: 'One pedal and a rod system that lock all four wheels at once. Red means locked, green means free.', x: 'Hex shaft drives the castor brake cams. DFMEA row DF-022. Indicator colour is risk control RC-007b.', rel: ['risk-control', 'dfmea', 'verification'] },
    { id: 'MC-HDL-7000', name: 'Push handle assembly', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Stainless steel 304, TPE grips', sup: 'In-house', crit: 'Standard', lead: '6 days', cost: '€ 31',
      s: 'The handles a porter holds to push and steer.', x: 'Handle height is a usability design input. Carries the hand control on the powered variant.', rel: ['iec62366', 'design-input'] },
    { id: 'MC-DRV-8000', name: 'Powered drive module', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Make', mat: 'Assembly', sup: 'In-house assembly', crit: 'Safety-related', lead: '12 days', cost: '€ 612', opt: 'DRIVE = POWERED',
      sub: [{ id: 'MC-FST-0413', forPart: 'MC-FST-0412', name: 'Flange screw M8×20 in place of screw M8×20', why: 'Allowed only inside this module, on the motor bracket.' }],
      s: 'An optional motor unit under the frame that helps the porter on ramps and long corridors.', x: 'Optional assembly included by option DRIVE = POWERED. Makes the device electrical equipment: IEC 60601-1 applies.', rel: ['option-variant', 'substitute', 'iec60601'] },
    { id: 'MC-DRV-8100', name: 'Drive motor wheel', lvl: 2, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: '24 V BLDC hub motor, PU tyre', sup: 'Kestrel Motion Drives', crit: 'Safety-related', lead: '56 days', cost: '€ 210', opt: 'DRIVE = POWERED',
      s: 'A fifth wheel with a motor inside that drives the stretcher.', x: '24 V brushless hub motor 250 W with electromagnetic holding brake.', rel: ['manufacturer-part', 'aml'] },
    { id: 'MC-PCB-8200', name: 'Motor controller PCBA', lvl: 2, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'FR-4 board assembly, RoHS', sup: 'Tessera Electronics', crit: 'Safety-related', lead: '49 days', cost: '€ 118', opt: 'DRIVE = POWERED',
      s: 'The electronic board that controls the motor speed, like a dimmer for the motor.', x: 'ECAD-managed assembly; BOM lines carry reference designators (R12, C7, U3). Firmware FW-8200 v1.2.0 developed under IEC 62304.', rel: ['ref-des', 'iec62304', 'rohs'] },
    { id: 'MC-BAT-8300', name: 'Battery pack 24 V', lvl: 2, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'LiFePO4 cells, 20 Ah, with BMS', sup: 'Voltaris Power Systems', crit: 'Safety-critical', lead: '63 days', cost: '€ 189', opt: 'DRIVE = POWERED',
      s: 'The rechargeable battery that powers the motor.', x: 'Battery management system cut-off is the risk control for HAZ-015; DFMEA row DF-052. Transport classified as dangerous goods (UN 38.3 test summary required).', rel: ['hazard', 'risk-control', 'dfmea'] },
    { id: 'MC-HRN-8400', name: 'Wiring harness', lvl: 2, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'Cu cable, halogen-free insulation', sup: 'Tessera Electronics', crit: 'Standard', lead: '35 days', cost: '€ 41', opt: 'DRIVE = POWERED',
      s: 'The bundle of cables joining battery, controller, motor and hand control.', x: 'Harness drawing with connector pin-out; routed in Creo cabling.', rel: ['drawing', 'rohs'] },
    { id: 'MC-HCT-8500', name: 'Hand control', lvl: 2, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'ABS housing, membrane keypad', sup: 'Tessera Electronics', crit: 'Safety-related', lead: '35 days', cost: '€ 54', opt: 'DRIVE = POWERED',
      s: 'The thumb control on the push handle: forward, reverse, and it stops when released.', x: 'Hold-to-run control (releases = stop) is a usability-derived risk control.', rel: ['iec62366', 'risk-control'] },
    { id: 'MC-LBL-9000', name: 'Label set incl. UDI label', lvl: 1, qty: 1, rev: 'A', state: 'Released', mb: 'Buy', mat: 'Polyester film, permanent adhesive', sup: 'Pinecrest Packaging & Print', crit: 'Regulatory', lead: '14 days', cost: '€ 3', nomodel: true,
      s: 'The stickers on the stretcher: maker, model, safe load, warnings and the unique device code.', x: 'Label artwork is a controlled document; UDI carrier is a GS1 DataMatrix. REGION option selects the set.', rel: ['udi', 'udi-di', 'udi-pi', 'ifu'] }
  ],

  /* Lifecycle "looks" of the 3D model. */
  modes: [
    { id: 'idea', name: 'Idea sketch', tip: 'Only a sketch exists: lines on paper.' },
    { id: 'creo', name: 'Creo CAD', tip: 'A grey 3D model built by engineers.' },
    { id: 'windchill', name: 'In Windchill', tip: 'Every part is now a managed record: the blue glow.' },
    { id: 'released', name: 'Released', tip: 'Approved and frozen: green means safe to build from.' },
    { id: 'plant', name: 'Plant bench', tip: 'Real materials, assembled at the bench.' },
    { id: 'packaged', name: 'Packed + UDI', tip: 'Boxed with its UDI label, ready to ship.' },
    { id: 'hospital', name: 'In hospital', tip: 'In daily use on the ward.' },
    { id: 'service', name: 'Service', tip: 'Back for repair: the castor brake is being checked.' }
  ],

  /* ---------------------------------------------------------------------
     MINI-FLOWS: two short animated walkthroughs (Phase 2).
     --------------------------------------------------------------------- */
  miniFlows: {
    procurement: { title: 'Procurement flow: how a castor gets into stock', term: 'po', steps: [
      { l: 'MRP run', sys: 'SAP', t: `SAP compares the build plan with stock and finds castors are short ([[mrp]]).`, r: '80 castors needed for order 1000234; lead time 42 days' },
      { l: 'Purchase requisition', sys: 'SAP', t: `An internal request to buy is created ([[pr|PR]]).`, r: 'PR 0010045871 · 400 × MC-CST-6000' },
      { l: 'Purchase order', sys: 'SAP → Supplier', t: `The buyer turns it into a binding order to an approved vendor ([[po|PO]], [[avl]]).`, r: 'PO 4500012345 · Norvale Castor Works · drawing rev A' },
      { l: 'Supplier ships', sys: 'Supplier', t: `The supplier makes and ships the lot with a certificate of conformity.`, r: 'Lot NCW-L2509 · delivery note NCW-DN-88231' },
      { l: 'Goods receipt', sys: 'SAP', t: `The warehouse books the delivery in. It is not usable yet ([[goods-receipt]]).`, r: 'Material doc 5000098812 · 400 pcs to inspection stock' },
      { l: 'Incoming inspection', sys: 'SAP QM', t: `A sample is measured against the drawing ([[inspection-lot]]).`, r: 'Lot 010000004711 · 13 pcs · brake torque 13.1–14.6 N·m · accept' },
      { l: 'Stock', sys: 'SAP', t: `The castors move to usable stock, with their lot number kept for [[traceability]].`, r: '400 pcs unrestricted · batch NCW-L2509' } ] },
    service: { title: 'Service flow: from a hospital call to feedback', term: 'field-service', steps: [
      { l: 'Field issue', sys: 'Hospital', t: `A nurse reports that one brake does not lock.`, r: 'St. Aldwyn General Hospital · serial T3P-250118' },
      { l: 'Service order', sys: 'SAP', t: `A service job is opened against that serial number ([[field-service]]).`, r: 'SO-2026-0412 · opened 2026-05-04' },
      { l: 'Spare part', sys: 'SAP', t: `The right repair set is picked from the service parts list ([[spare-kit]], [[sbom]]).`, r: 'MC-KIT-6000 Castor service kit · castor lot NCW-L2601' },
      { l: 'Repair', sys: 'On site', t: `The engineer replaces the castor and tests the brake.`, r: 'Brake torque after repair 13.6 N·m (limit ≥ 12)' },
      { l: 'Record', sys: 'SAP', t: `What was found and done is recorded; the unit's history is updated ([[installed-base]]).`, r: 'Completed 2026-05-06 by H. Lindqvist · removed part under RMA-2026-0077' },
      { l: 'Feedback', sys: 'Windchill', t: `The report meets complaint criteria, so it becomes a [[complaint]] and may lead to [[capa]].`, r: 'CMP-2026-0231 → CAPA-2026-0017' } ] }
  },

  /* ---------------------------------------------------------------------
     THREADS: the digital thread of each part (Phase 2), keyed by part number.
     Missing fields fall back to sensible text generated in app.js.
     find = find number in the EBOM; mb = MBOM line / operation / bench.
     --------------------------------------------------------------------- */
  threads: {
    'MC-STR-3000': { un: 'UN-001 to UN-014: all user needs', di: 'All design inputs DI-001 to DI-040', haz: 'All hazards in the risk file', rc: 'All risk controls; overall residual risk accepted in DOC-RMR-0090', vt: 'Full V&V set; summative usability VAL-003', mb: 'Top of the MBOM for Plant 1000; all operations OP10–OP80', aml: 'Finished device: made in-house at Plant 1000', po: 'Production order 1000234 (20 units)', insp: 'Final inspection OP70; DHR review by Quality', lot: 'Serials T3P-250001 to T3P-250020', svc: 'Whole unit: installed base record per serial; refurbishment process RF-T300', hist: 'CMP-2026-0231 (brake) → CAPA-2026-0017', comp: 'EU MDR declaration of conformity DOC-DOC-0301; RoHS and REACH roll-up complete' },
    'MC-FRM-1000': { find: '10', un: 'UN-001 One porter can move a heavy patient safely', di: 'DI-001 Safe working load 250 kg', haz: 'HAZ-011 Instability / structural failure', rc: 'Weld design with safety factor; wide wheelbase', vt: 'VT-001 static load 2 × SWL: pass', mb: 'Under MC-MFG-0100 Chassis complete · OP10 · bench B1', aml: 'Made in-house; steel tube from Arden Tube & Profile (approved)', po: 'Production order for weldments; tube PO 4500012102', insp: 'Weld visual + coating thickness per control plan', lot: 'Frame lot F-2508-03 recorded in the DHR', svc: 'Not a field-replaceable part; frame damage → unit returned under RMA', hist: 'None', comp: 'RoHS not applicable (mechanical); REACH declared; coating free of hexavalent chromium' },
    'MC-FRM-1100': { find: '20', un: 'UN-001 Safe transport of a heavy patient', di: 'DI-001 Safe working load 250 kg', haz: 'HAZ-003 Entrapment between rail and frame', rc: 'Gap dimensions controlled on the drawing', vt: 'VT-001 static load; VT-003 gap gauge check: pass', mb: 'Under MC-MFG-0300 Patient surface · OP40 · bench B2', aml: 'Made in-house; aluminium profile from Arden Tube & Profile', po: 'Production order for frames', insp: 'Gap dimensions measured on first article and per lot', lot: 'Frame lot LF-2508-02', svc: 'Not field-replaceable', hist: 'None', comp: 'REACH declared' },
    'MC-HYD-2000': { find: '30', un: 'UN-006 Height matches the bed for transfers', di: 'DI-020 Height range 560–910 mm by foot pump', haz: 'Unintended lowering during transfer', rc: 'Seal specification and leak-down limit; lowering valve needs deliberate action', vt: 'VT-020 10 000 height cycles at 250 kg: pass', mb: 'Under MC-MFG-0200 Lift unit · OP30 · bench B2', aml: [['HX-350-25', 'Helixa Hydraulics', 'Preferred']], avl: 'Helixa Hydraulics direct, vendor 100177', po: 'PO 4500012290, 60 pcs', insp: 'Inspection lot: stroke, leak-down on 5 of 60', lot: 'Serial-tracked: HX-88120, HX-88121 in T3P-250001', svc: 'MC-KIT-2000 Lift column exchange (old unit back under RMA)', hist: 'None', comp: 'REACH declared; hydraulic oil safety data sheet on file' },
    'MC-HYD-2100': { find: '40', un: 'UN-006 Height adjustment without bending or hand tools', di: 'DI-021 Pedal force ≤ 250 N; reachable from both sides', haz: 'Use error: lowering instead of raising', rc: 'Separate pump and release pedals with symbols', vt: 'VT-021 pedal force; usability VAL-003', mb: 'Under MC-MFG-0200 Lift unit · OP30 · bench B2', aml: [['HX-FP-12', 'Helixa Hydraulics', 'Preferred']], avl: 'Helixa Hydraulics direct, vendor 100177', po: 'PO 4500012290 (same order as columns)', insp: 'Visual and function sample', lot: 'Lot HXP-2508', svc: 'Service part, single item', hist: 'None', comp: 'REACH declared' },
    'MC-BKR-3100': { find: '50', un: 'UN-009 The patient can sit up', di: 'DI-025 Backrest 0–70°, cannot drop suddenly', haz: 'HAZ-018 Pinch point under the backrest', rc: 'Guarded hinge; damped descent', vt: 'VT-025 5 000 cycles and drop test: pass', mb: 'Under MC-MFG-0300 Patient surface · OP40 · bench B2', aml: 'Made in-house', po: 'Production order for sub-assemblies', insp: 'In-process: lock holds at 70°', lot: 'Lot BK-2508-05', svc: 'Service part, single item', hist: 'None', comp: 'REACH declared' },
    'MC-GSP-3200': { find: '60', un: 'UN-009 The patient can sit up, with little effort from staff', di: 'DI-025 Backrest gas-spring assisted, lockable', haz: 'HAZ-018 Backrest drops', rc: 'Lock-out valve and damped descent (DFMEA DF-034)', vt: 'VT-025 cycle and drop test: pass', mb: 'Under MC-MFG-0300 Patient surface · OP40 · bench B2', aml: [['BG-L600-D', 'Brightspan Gas Springs', 'Preferred'], ['SL-600LK', 'Stratolift Components', 'Approved']], avl: 'Brightspan direct, vendor 100264', po: 'PO 4500012301, 100 pcs', insp: 'Inspection lot: force 600 N ± 5 % on 8 of 100', lot: 'Lot BG-2507-B', svc: 'MC-KIT-3200 Gas spring kit; preventive replacement every 5 years', hist: 'None', comp: 'REACH declared' },
    'MC-RAL-4000': { find: '70', un: 'UN-003 The patient must not roll off during transport', di: 'DI-008 Side rails lock upright; gaps within entrapment limits', haz: 'HAZ-003 Entrapment', rc: 'Gap limits; positive latch', vt: 'VT-008 rail load and latch test: pass', mb: 'Under MC-MFG-0300 Patient surface · OP60 · bench B3', aml: 'Made in-house; tube from Arden Tube & Profile', po: 'Production order for rails', insp: 'Cosmetic and latch function', lot: 'Lot SR-2509-02 (see NC-2025-0031: scratches, reworked)', svc: 'Service part, single item per side', hist: 'NC-2025-0031 cosmetic rework', comp: 'REACH declared' },
    'MC-IVP-4500': { find: '80', un: 'UN-014 Fluids travel with the patient', di: 'DI-040 IV pole with 2 hooks, 2 kg per hook', haz: 'Pole or bag falls on patient', rc: 'Hook shape; telescopic lock', vt: 'VT-040 hook load test: pass', mb: 'Under MC-MFG-0300 Patient surface · OP60 · bench B3', aml: [['AT-IV-T2', 'Arden Tube & Profile', 'Preferred']], avl: 'Arden direct, vendor 100198', po: 'PO 4500012102', insp: 'Sample: lock function', lot: 'Lot AT-2508-IV', svc: 'Service part, single item', hist: 'None', comp: 'REACH declared' },
    'MC-MAT-5000': { find: '90', un: 'UN-011 Easy to clean between patients', di: 'DI-031 Surfaces resist listed disinfectants; cover biocompatible', haz: 'Skin irritation; infection through damaged cover', rc: 'Biocompatible, welded-seam cover; cleaning instructions in IFU', vt: 'VT-031 500 wipe cycles per disinfectant: pass; ISO 10993 reports', mb: 'Under MC-MFG-0300 Patient surface · OP60 · bench B3', aml: [['CF-M80-PU', 'Calder Foam & Textiles', 'Preferred']], avl: 'Calder direct, vendor 100305', po: 'PO 4500012344, 40 pcs', insp: 'Inspection lot: dimensions, seam, certificate check', lot: 'Lot CF-2508-M', svc: 'Service part; most frequently replaced item', hist: 'None', comp: 'Biocompatibility ISO 10993-5/-10/-23 on file; REACH declared; flammability certificate' },
    'MC-CST-6000': { find: '100', un: 'UN-004 The stretcher must stay put while a patient is moved on or off', di: 'DI-012 Brakes hold on a 10° incline at 250 kg, no creep for 5 minutes', haz: 'HAZ-007 Unintended movement during patient transfer → patient fall', rc: 'RC-007a positive-lock brake cam (DFMEA DF-021)', vt: 'VT-012 brake hold: pass, 0 mm creep; VT-014 endurance 20 000 cycles', mb: 'Under MC-MFG-0100 Chassis complete · OP10 fit (25 N·m) and OP20 brake test · bench B1', aml: [['NCW-200-TB-ESD', 'Norvale Castor Works', 'Preferred'], ['RX-C200B', 'Rollaxis Components', 'Approved'], ['QW-200-LK', 'Quillon Wheels', 'Do Not Use']], avl: 'Norvale direct (vendor 100231, preferred); Dextrin Industrial Supply (vendor 100415, vendor part DX-55120); Rollaxis direct (vendor 100388)', po: 'PO 4500012345 to Norvale: 400 pcs, lot NCW-L2509', insp: 'Inspection lot 010000004711: 13 of 400, brake torque 13.1–14.6 N·m, accepted', lot: 'Lot NCW-L2509 in serials T3P-250001 to -250020; lot NCW-L2510 in T3P-250118', svc: 'MC-KIT-6000 Castor service kit; yearly brake torque check ≥ 12 N·m', hist: 'CMP-2026-0231 → NC-2026-0113 → CAPA-2026-0017 → SCAR-2026-0009 → CN-2026-0039: revision B from serial T3P-260400', comp: 'REACH declared; ESD-conductive tread certificate; RoHS not applicable' },
    'MC-BRK-6100': { find: '110', un: 'UN-004 The stretcher must stay put; staff can see the brake state', di: 'DI-013 Brake status visible from head and foot end (red / green)', haz: 'HAZ-007 Unintended movement: one castor stays free', rc: 'RC-007a hex drive with clamp screw and thread-lock; RC-007b red / green indicator', vt: 'VT-012, VT-013 indicator inspection, VT-014 endurance: pass', mb: 'Under MC-MFG-0100 Chassis complete · OP10 (clamp screw 9 N·m, thread-lock) · bench B1', aml: 'Made in-house; hex bar from Arden Tube & Profile', po: 'Production order for brake linkage, lot BR-2508-11', insp: 'In-process: 100 % brake test in OP20 on rig TR-02', lot: 'Lot BR-2508-11 in T3P-250001', svc: 'MC-KIT-6100 Brake linkage kit', hist: 'CAPA-2026-0017: pedal travel stop added, revision B', comp: 'REACH declared; zinc plating free of hexavalent chromium' },
    'MC-HDL-7000': { find: '120', un: 'UN-002 Comfortable to push and steer for staff of different heights', di: 'DI-005 Handle height 950–1 100 mm', haz: 'Strain injury to staff', rc: 'Handle geometry from usability study', vt: 'VAL-003 summative usability', mb: 'Under MC-MFG-0300 Patient surface · OP60 · bench B3', aml: 'Made in-house; grips bought', po: 'Production order', insp: 'Visual', lot: 'Lot HD-2508-01', svc: 'Grips available as service part', hist: 'None', comp: 'REACH declared (grip material)' },
    'MC-DRV-8000': { find: '130', un: 'UN-001 One porter can move a heavy patient, also on ramps', di: 'DI-002 Powered drive option; speed ≤ 5 km/h; stops when control is released', haz: 'Unintended powered movement', rc: 'Hold-to-run control; electromagnetic holding brake; firmware safety class B', vt: 'VT-044 IEC 60601-1; VT-046 stop distance: pass', mb: 'Own line in the MBOM (option DRIVE = POWERED) · OP50 · bench B3', aml: 'Assembled in-house from bought components', po: 'Production order 1000233 (sub-assembly)', insp: 'Function test after firmware load', lot: 'Module serial DM-250771', svc: 'Components replaced individually; firmware update by service tool', hist: 'None', comp: 'RoHS compliant (roll-up); IEC 60601-1 test report DOC-VER-0144' },
    'MC-DRV-8100': { find: '10 (in MC-DRV-8000)', un: 'UN-001 Powered help on ramps', di: 'DI-002 Drive force for 250 kg on a 6° ramp', haz: 'Unintended movement; overheating', rc: 'Holding brake; thermal cut-out', vt: 'VT-046 ramp and stop test: pass', mb: 'Under MC-DRV-8000 · OP50 · bench B3', aml: [['KM-HUB-250-24', 'Kestrel Motion Drives', 'Preferred']], avl: 'Kestrel direct, vendor 100342', po: 'PO 4500012310, 30 pcs', insp: 'Inspection lot: no-load current, brake release', lot: 'Serial-tracked', svc: 'Service part, single item', hist: 'None', comp: 'RoHS declared; REACH declared' },
    'MC-PCB-8200': { find: '20 (in MC-DRV-8000)', un: 'UN-001 Smooth, controllable powered drive', di: 'DI-003 Speed control with soft start; safe state on fault', haz: 'Unintended powered movement from electronic or software fault', rc: 'Watchdog, dual-channel enable; firmware under IEC 62304', vt: 'VT-044 electrical safety and EMC; software verification report', mb: 'Under MC-DRV-8000 · OP50 (firmware FW-8200 v1.2.0) · bench B3', aml: [['TE-MC24-R2', 'Tessera Electronics', 'Preferred']], avl: 'Tessera direct, vendor 100356', po: 'PO 4500012322, 30 pcs', insp: 'Certificate + functional test report per board', lot: 'Serial-tracked: TE-0034117 in T3P-250001', svc: 'Exchange part; firmware version recorded at service', hist: 'Obsolescence PCN-2027-014 (motor driver IC): last-time buy', comp: 'RoHS compliant with listed exemptions; REACH declared' },
    'MC-BAT-8300': { find: '30 (in MC-DRV-8000)', un: 'UN-001 A full shift of powered use on one charge', di: 'DI-004 Capacity 20 Ah; charge in 4 h', haz: 'HAZ-015 Battery overheats: burn, fire', rc: 'Battery management system cut-off; certified cells (DFMEA DF-052)', vt: 'VT-044; cell certificates; UN 38.3 test summary', mb: 'Under MC-DRV-8000 · OP50 · bench B3', aml: [['VP-LFP-24-20', 'Voltaris Power Systems', 'Preferred']], avl: 'Voltaris direct, vendor 100371', po: 'PO 4500012330, 30 pcs (dangerous goods shipment)', insp: 'Inspection lot: voltage, capacity sample, certificate check', lot: 'Serial-tracked: VP-250771 in T3P-250001', svc: 'MC-KIT-8300 Battery pack; 12-month warranty; take-back at end of life', hist: 'None', comp: 'Battery regulation labeling; RoHS declared; UN 38.3 summary on file' },
    'MC-HRN-8400': { find: '40 (in MC-DRV-8000)', un: 'UN-001 Reliable powered drive', di: 'DI-006 Connectors keyed; cable protected from pinching', haz: 'Short circuit; wrong connection at service', rc: 'Keyed connectors; routing in frame', vt: 'VT-044 electrical safety', mb: 'Under MC-DRV-8000 · OP50 · bench B3', aml: [['TE-HRN-T300', 'Tessera Electronics', 'Preferred']], avl: 'Tessera direct, vendor 100356', po: 'PO 4500012322', insp: 'Continuity test certificate per lot', lot: 'Lot TE-H-2508', svc: 'Service part, single item', hist: 'None', comp: 'RoHS declared; halogen-free insulation' },
    'MC-HCT-8500': { find: '50 (in MC-DRV-8000)', un: 'UN-002 Simple control a porter can use without looking', di: 'DI-007 Hold-to-run thumb control: release = stop', haz: 'Use error: unintended drive', rc: 'Hold-to-run; guarded button (usability-derived)', vt: 'VAL-003 summative usability; VT-046', mb: 'Under MC-DRV-8000 · OP50 · bench B3', aml: [['TE-HC-2B', 'Tessera Electronics', 'Preferred']], avl: 'Tessera direct, vendor 100356', po: 'PO 4500012322', insp: 'Function sample', lot: 'Lot TE-HC-2508', svc: 'Service part, single item', hist: 'None', comp: 'RoHS declared' },
    'MC-LBL-9000': { find: '140', un: 'UN-013 Staff can identify the device and its limits at a glance', di: 'DI-050 Labels durable for device life; UDI readable', haz: 'Overload or misuse from missing information', rc: 'RC-007c brake warning; SWL label; IFU reference', vt: 'VT-050 label durability (rub and disinfectant): pass', mb: 'Own line in the MBOM · OP70 (print, apply, scan back) · bench B4', aml: [['PP-LS-T300', 'Pinecrest Packaging & Print', 'Preferred']], avl: 'Pinecrest direct, vendor 100402', po: 'PO 4500012350 (blank label stock)', insp: 'Artwork revision check; print quality grade', lot: 'Label stock lot PP-2508-L; UDI printed per serial', svc: 'Replacement label set on request, tied to serial', hist: 'None', comp: 'UDI per 21 CFR 830 and EU MDR; symbols per ISO 15223-1' }
  },

  terms: {}
};
