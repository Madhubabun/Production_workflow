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

    { n: 5, name: 'MBOM & Process Plan', short: 'MBOM', mode: 'plant', sys: ['wc', 'mes'], full: false,
      tagline: { s: 'Plan how the factory will build it, step by step.', x: 'Design transfer: MBOM in the Manufacturing view, MPMLink process plan, work centres, PFMEA.' },
      purpose: {
        s: `Engineering's parts list is arranged by function. The factory needs it arranged by assembly order, plus the steps, benches and tools for each step. This stage rewrites the list for the factory and writes the build instructions.`,
        x: `[[design-transfer]]: the [[ebom]] is transformed into a plant-specific [[mbom]] in the Manufacturing [[views|view]] using [[mpmlink]]. A process plan with operations, work centres, tooling and work instructions is authored and linked to the MBOM. The [[pfmea]] and control plan are created. [[avl|Approved vendors]] are set per plant.` } },
    { n: 6, name: 'ERP Handoff (SAP)', short: 'ERP', mode: 'plant', sys: ['wc', 'sap', 'sup'], full: false,
      tagline: { s: 'Send the approved data to the business system that buys and plans.', x: 'ESI / ERP Connector publishes materials, BOM, routing and change number to SAP S/4HANA.' },
      purpose: {
        s: `The factory's business system, SAP, needs the released parts list and build steps so it can order parts and schedule work. Windchill sends them across automatically, so nobody retypes anything.`,
        x: `Release of a [[change-notice]] triggers [[esi]] to publish [[wtpart]]s as [[material-master]] records, the [[mbom]] as SAP BOM, the process plan as routing, and the change as an engineering change master with [[effectivity]]. [[sap]] MRP then creates purchase requisitions.` } },
    { n: 7, name: 'Production', short: 'Production', mode: 'plant', sys: ['sap', 'mes', 'sup'], full: false,
      tagline: { s: 'Parts arrive, get inspected, and the stretcher is built and tested at the bench.', x: 'Procurement, incoming inspection, assembly by operation in MES, in-process and final inspection, DHR.' },
      purpose: {
        s: `Bought parts arrive and are checked. Workers assemble the stretcher at benches following on-screen instructions, and each finished stretcher gets its own serial number and test record.`,
        x: `Purchase orders, goods receipt and inspection lots in [[sap]]; production orders executed in [[mes]] by operation and work centre. Serial and lot genealogy forms the [[dhr]]. Nonconforming material is handled through [[nc]] records.` } },
    { n: 8, name: 'Packaging, Labeling, UDI & Market', short: 'Pack & UDI', mode: 'packaged', sys: ['mes', 'sap', 'svc'], full: false,
      tagline: { s: 'Box it, label it with its unique ID, register it, ship it.', x: 'Packaging BOM, label and IFU control, UDI assignment, GUDID / EUDAMED registration, distribution.' },
      purpose: {
        s: `Each stretcher is packed with its instructions and gets a label carrying a unique code, like a passport number. The code is registered with the authorities so any stretcher can be traced.`,
        x: `Packaging BOM and label artwork are released parts. The [[udi]] label carries [[udi-di]] and [[udi-pi]]; device records are submitted to [[gudid]] and [[eudamed]]. Final quality release precedes shipment; installed-base records are created.` } },
    { n: 9, name: 'Service', short: 'Service', mode: 'hospital', sys: ['svc', 'sap'], full: false,
      tagline: { s: 'In the hospital: installation, training, maintenance and repairs.', x: 'Installed base, service BOM, spare parts and kits, service orders, warranty, RMA.' },
      purpose: {
        s: `The stretcher works in the hospital for years. Service engineers install it, train staff, maintain it and repair it with approved spare parts, and record every job.`,
        x: `The [[sbom]] defines serviceable items and spare kits. Service orders, spare-part consumption and repair records are linked to the serial number and feed post-market surveillance.` } },
    { n: 10, name: 'Feedback: Complaint → CAPA → Change', short: 'Feedback', mode: 'service', sys: ['svc', 'wc'], full: false,
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

  terms: {}
};
