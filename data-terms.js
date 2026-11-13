/* ==========================================================================
   data-terms.js : glossary terms, added to window.MD.terms.
   Each term has: name, category, one-line tip (hover), Simple explanation,
   everyday analogy, Expert detail, "In our stretcher" example, related terms.
   All examples are invented. Phase 3 grows this list past 150 terms.
   ========================================================================== */
(function () {
  var M = window.MD;
  function T(id, n, cat, tip, simple, analogy, expert, ex, rel) {
    M.terms[id] = { id: id, n: n, cat: cat, tip: tip, simple: simple, analogy: analogy, expert: expert, ex: ex, rel: rel ? rel.split(' ') : [] };
  }

  /* ---------------- Regulation ---------------- */
  T('fda', 'FDA', 'Regulation', `The US authority that decides whether medical devices may be sold in the United States.`,
    `The Food and Drug Administration is the US government body that protects patients. A company may sell a medical device in the US only if it follows FDA rules.`,
    `Like the road authority that sets the rules for cars and can order a recall.`,
    `US Food and Drug Administration; devices are regulated by its Center for Devices and Radiological Health under the Federal Food, Drug, and Cosmetic Act. Rules are published in Title 21 of the [[cfr]]. FDA inspects manufacturers against [[qmsr]] and receives adverse-event reports ([[complaint]] → eMDR).`,
    `MediCare Devices Ltd lists the T-300 with FDA and keeps its quality system ready for inspection. The powered variant needs more evidence than the manual one.`,
    'cfr qmsr cfr820 k510 device-class gudid');
  T('cfr', 'CFR', 'Regulation', `The US Code of Federal Regulations: the book of federal rules. Title 21 covers medical devices.`,
    `The official collection of US federal rules. Medical device rules are in "Title 21", so people say "21 CFR".`,
    `The rulebook of a sport: numbered chapters that everyone playing must follow.`,
    `Code of Federal Regulations. Relevant parts of Title 21: Part 11 (electronic records and signatures), Part 801 (labeling), Part 803 (medical device reporting), Part 806 (corrections and removals), Part 807 (registration, listing, 510(k)), Part 820 ([[qmsr]]), Part 830 ([[udi]]).`,
    `The T-300 label follows 21 CFR 801 and 830; approvals in Windchill follow [[part11]]; the quality system follows [[cfr820]].`,
    'fda cfr820 part11 qmsr');
  T('cfr820', '21 CFR 820', 'Regulation', `The US quality system rule for device makers. Since February 2026 it is called QMSR.`,
    `The part of US law that says how a device company must organise its work so devices are safe: how it designs, buys, builds, checks and fixes problems.`,
    `The hygiene rules for a restaurant kitchen: they are about how the kitchen is run, not about one dish.`,
    `21 CFR Part 820. Formerly the Quality System Regulation (QSR) with its own clauses (820.30 design controls, 820.100 CAPA, 820.181 DMR, 820.184 DHR). Amended into the [[qmsr]], effective 2 February 2026, which incorporates [[iso13485]]:2016 by reference and keeps a few FDA-specific additions.`,
    `The T-300 was designed under the old QSR wording (2024–2025) and is now produced under QMSR. Records called [[dhf]], [[dmr]] and [[dhr]] remain valid; new procedures use the ISO 13485 terms.`,
    'qmsr iso13485 dhf dmr dhr mdf fda');
  T('qmsr', 'QMSR', 'Regulation', `FDA's rule for how device companies run their quality system.`,
    `The current US quality rule for medical device makers. It says: follow the international standard ISO 13485, plus a few extra FDA points.`,
    `A country adopting the international driving rules instead of keeping its own slightly different ones.`,
    `Quality Management System Regulation: the amended 21 CFR Part 820, effective 2 February 2026. Incorporates [[iso13485]]:2016 by reference; adds requirements such as record control (820.35, including complaint and servicing record content and [[udi]]) and labeling / packaging controls (820.45). The terms DHF, DMR and DHR no longer appear in the rule; equivalent records are required through ISO 13485 clauses 4.2.3 ([[mdf]]), 7.3.10 and 7.5.1.`,
    `Auditors of the T-300 ask for the medical device file and the design and development file; MediCare maps these to its Windchill product structure and baselines.`,
    'cfr820 iso13485 mdf dhf dmr dhr fda');
  T('part11', '21 CFR Part 11', 'Regulation', `The US rule that makes electronic records and electronic signatures as trustworthy as paper and ink.`,
    `If a company signs and stores quality records on a computer instead of paper, this rule says how: every user has their own login, signing needs a password, and the system records who did what and when.`,
    `Online banking: you log in as yourself, confirm each payment again, and the bank keeps a statement nobody can edit.`,
    `Requires validated systems, secure computer-generated time-stamped [[audit-trail]]s, authority checks, record retention (11.10); signature manifestation with printed name, date/time and meaning (11.50); signature-record linking (11.70); unique signatures with two components such as user ID and password (11.100, 11.200). In Windchill this is met by configured workflows with e-signature tasks, audit logging, access control, and by computer system validation of the installation.`,
    `Each approver of promotion request PR-2025-0042 re-entered user ID and password; Windchill stored name, time and the meaning "Approval".`,
    'esign audit-trail promotion-request change-notice');
  T('esign', 'Electronic signature', 'Regulation', `Approving a record on screen by re-entering your login, which legally counts like a handwritten signature.`,
    `Instead of signing paper, the approver clicks "Approve" and types their user name and password again. The system stores who signed, when, and what the signature means.`,
    `Entering your PIN at a card terminal: it proves it was you, at that moment, agreeing to that amount.`,
    `Under [[part11]] an electronic signature must be unique to one person, use at least two components, and be permanently linked to the signed record with name, date/time and meaning. In Windchill: workflow task with signature enabled; signature data is recorded in the process history and can be printed on documents or drawings.`,
    `Daniel Okoro (Quality Engineer) signed PR-2025-0042 on 2025-03-07 16:03 UTC with the meaning "Approval: V&V complete, risks acceptable".`,
    'part11 audit-trail promotion-request');
  T('audit-trail', 'Audit trail', 'Regulation', `The automatic log of who changed or approved what, and when. It cannot be edited.`,
    `A diary the computer writes by itself. Every change and every approval is listed with the person and the time, and nobody can rub it out.`,
    `The "track changes" history of a document, if it could never be switched off.`,
    `Secure, computer-generated, time-stamped record of operator actions that create, modify or delete electronic records ([[part11]] 11.10(e)). In Windchill: iteration history, lifecycle history, workflow process history and security audit reports.`,
    `For MC-CST-6000 the history shows iterations A.1 and A.2 by Asha Verma, the promotion to Released on 2025-03-10, and every signer.`,
    'part11 esign iteration lifecycle-state');
  T('iso13485', 'ISO 13485', 'Regulation', `The international standard for a medical device company's quality management system.`,
    `A worldwide agreed checklist for how a medical device company should be run so that its products are consistently safe. Passing an audit against it earns a certificate.`,
    `A hygiene certificate on a restaurant door: it tells you the kitchen is run properly.`,
    `ISO 13485:2016, Medical devices — Quality management systems — Requirements for regulatory purposes. Key clauses: 4.2 documentation (4.2.3 [[mdf]]), 7.3 design and development, 7.4 purchasing, 7.5 production and service, 8.2.2 complaint handling, 8.3 nonconforming product, 8.5.2 corrective action. Basis for EU certification and incorporated into the US [[qmsr]].`,
    `MediCare's Plant 1000 is certified to ISO 13485. Stage pages on this site quote its clause numbers as audit evidence.`,
    'qmsr mdf eumdr capa nc');
  T('iso14971', 'ISO 14971', 'Regulation', `The international standard for managing the risks of a medical device.`,
    `The method for asking, in an organised way: what could hurt someone, how likely and how bad is it, and what do we do about it?`,
    `Child-proofing a home: walk through every room, list the dangers, fit the locks, then check again.`,
    `ISO 14971:2019. Process: risk management plan, risk analysis ([[hazard]] → hazardous situation → harm), risk evaluation, [[risk-control]], evaluation of overall residual risk, risk management review, production and post-production activities. Records form the [[risk-file]].`,
    `Hazard HAZ-007 "unintended movement" is analysed, controlled by the positive-lock brake, verified in VT-012 and watched in complaint data.`,
    'risk-file hazard risk-control dfmea pfmea');
  T('iec62366', 'IEC 62366', 'Regulation', `The standard for designing a medical device so people use it correctly and safely.`,
    `It makes the company study how real users handle the device, so that mistakes are designed out instead of blamed on the user.`,
    `Shaping a plug so it only fits the socket the right way round.`,
    `IEC 62366-1:2015 + A1:2020, usability engineering. Deliverables: use specification, user-interface characteristics related to safety, hazard-related use scenarios, formative evaluations, summative evaluation; kept in the usability engineering file and linked to the [[risk-file]].`,
    `The red/green brake indicator and the hold-to-run hand control came from formative studies; summative study VAL-003 confirmed them with 15 users.`,
    'validation iso14971 ifu user-need');
  T('iec60601', 'IEC 60601-1', 'Regulation', `The safety standard for medical electrical equipment.`,
    `A set of safety tests for any medical device that uses electricity: no shocks, no overheating, no dangerous moving parts, no tipping over.`,
    `The electrical safety test a kettle must pass, but far stricter because patients may be weak or unconscious.`,
    `IEC 60601-1 (edition 3.2): general requirements for basic safety and essential performance; collateral standards such as 60601-1-2 (EMC) and 60601-1-6 (usability). Clause 9 covers mechanical hazards including instability and unwanted movement; exact sub-clauses used for brake and stability tests should be confirmed with the test laboratory {V}.`,
    `Only the powered T-300P is electrical equipment. Test VT-044 at an accredited laboratory covers it; the manual T-300M uses the same mechanical tests as good practice.`,
    'iec62304 verification device-class');
  T('iec62304', 'IEC 62304', 'Regulation', `The standard for developing and maintaining software in medical devices.`,
    `Rules for writing device software carefully: plan it, test it, control every change.`,
    `Building regulations for the invisible part of the house: the wiring behind the walls.`,
    `IEC 62304:2006 + A1:2015, medical device software lifecycle processes; software safety classes A, B, C drive the required rigour. Released builds are configuration items linked to the hardware they run on.`,
    `Firmware FW-8200 v1.2.0 of the motor controller [[p:MC-PCB-8200]] is developed under IEC 62304 and released in Windchill together with the board.`,
    'iec60601 baseline traceability');
  T('eumdr', 'EU MDR', 'Regulation', `The European law for medical devices (Regulation 2017/745).`,
    `The rules a device must meet to carry the CE mark and be sold in the European Union.`,
    `A passport and visa for the product: without it, it cannot enter the market.`,
    `Regulation (EU) 2017/745. Requires classification (Annex VIII), general safety and performance requirements (Annex I), technical documentation (Annex II and III), [[udi]] and [[eudamed]] registration, post-market surveillance and vigilance. Higher classes need a [[notified-body]].`,
    `The T-300 is treated as a low-risk class under MDR {V}; MediCare signs an EU declaration of conformity and keeps the technical file built from the Windchill baseline.`,
    'notified-body eudamed udi device-class ifu');
  T('notified-body', 'Notified Body', 'Regulation', `An independent organisation authorised in the EU to check devices and quality systems before CE marking.`,
    `An official inspector, appointed by a European country, who audits the company and reviews the device file for higher-risk devices.`,
    `The independent test centre that inspects a car before it gets its roadworthiness sticker.`,
    `Conformity assessment body designated under [[eumdr]]. Audits the QMS ([[iso13485]]) and assesses technical documentation for class Is/Im/Ir, IIa, IIb and III devices. Class I non-sterile, non-measuring devices are self-declared.`,
    `MediCare's quality system is audited yearly by its notified body; the T-300 itself is self-declared if its class is confirmed as class I {V}.`,
    'eumdr iso13485 device-class');
  T('k510', '510(k)', 'Regulation', `A US submission showing a new device is as safe and effective as one already on the market.`,
    `For many medium-risk devices, the maker sends FDA a file comparing the new device with a similar existing one. FDA must clear it before sale.`,
    `Showing your new ladder is built like one that already passed inspection.`,
    `Premarket notification under section 510(k) of the FD&C Act and 21 CFR 807 subpart E; demonstrates substantial equivalence to a predicate device. Many class I and some class II device types are exempt.`,
    `Whether the T-300M and T-300P need a 510(k) or are exempt depends on their FDA product codes; Regulatory Affairs records the decision in DOC-REG-0006 {V}.`,
    'fda device-class');
  T('device-class', 'Device class (I / II / III)', 'Regulation', `The risk category of a device. Higher class means more evidence and more oversight.`,
    `Authorities sort devices by how much harm they could do. A bandage is class I; a pacemaker is class III. The class decides how much proof is needed.`,
    `Vehicle licence categories: a bicycle, a car and a heavy lorry need different levels of testing.`,
    `US: classes I, II, III under 21 CFR Parts 862–892. EU: classes I, IIa, IIb, III by the rules of [[eumdr]] Annex VIII. Class determines the conformity route ([[k510]], [[notified-body]] involvement).`,
    `Patient transport stretchers are in the lower risk classes. Adding a motor and battery brings in [[iec60601]] but does not by itself raise the class {V}.`,
    'k510 notified-body fda eumdr');
  T('udi', 'UDI', 'Regulation', `Unique Device Identification: a code on every device that identifies its model and its individual unit.`,
    `A barcode and number on the label that works like a passport number for the device. Hospitals and authorities can scan it to know exactly which product, batch and unit it is.`,
    `The number plate plus the chassis number of a car.`,
    `Composed of [[udi-di]] (device identifier: model and packaging level) and [[udi-pi]] (production identifier: lot, serial, manufacture or expiry date). Required by 21 CFR 830 and [[eumdr]] Article 27. Carrier in both machine-readable (AIDC) and human-readable form; device data submitted to [[gudid]] and [[eudamed]].`,
    `T-300P label: (01)09999999300017(11)250915(21)T3P-250001. The (01) part is the same on every T-300P; the (21) serial is unique.`,
    'udi-di udi-pi gudid eudamed');
  T('udi-di', 'UDI-DI', 'Regulation', `The fixed part of the UDI: it identifies the device model and package level.`,
    `The part of the code that says "this is a TransPort T-300P". It is the same on every unit of that model.`,
    `The model name of a phone.`,
    `Device Identifier, e.g. a GS1 GTIN. A new UDI-DI is required when a change creates a new model or version, for example a change that affects safety, performance or labeled characteristics. In Windchill it is typically an attribute of the finished-device part or managed in a UDI data set {V}.`,
    `T-300M and T-300P have different UDI-DIs; the shipping carton has its own. T-300P: (01)09999999300017 (invented prefix).`,
    'udi udi-pi gudid option-variant');
  T('udi-pi', 'UDI-PI', 'Regulation', `The variable part of the UDI: lot, serial number and dates of one unit.`,
    `The part of the code that says "this exact unit, built on this day".`,
    `The serial number on the back of the phone.`,
    `Production Identifier: lot/batch (10), serial (21), manufacturing date (11), expiry date (17) in GS1 application identifiers. Generated in production (SAP / MES) and printed at labeling.`,
    `(11)250915(21)T3P-250001 = built 15 September 2025, serial T3P-250001.`,
    'udi udi-di dhr');
  T('gudid', 'GUDID', 'Regulation', `FDA's public database of device identifiers.`,
    `The US online register where every device model's code and basic facts are listed, so anyone can look a device up.`,
    `A public phone book for medical devices.`,
    `Global Unique Device Identification Database (21 CFR 830 subpart E). The labeler submits DI records with attributes such as brand name, model, device count, MRI safety status, sterilisation. Public access through AccessGUDID.`,
    `Regulatory Affairs submits one GUDID record per T-300 variant before first US shipment.`,
    'udi udi-di fda eudamed');
  T('eudamed', 'EUDAMED', 'Regulation', `The European database for devices, makers, certificates and incidents.`,
    `The EU's online register: who makes which device, with which certificate, and what incidents were reported.`,
    `The European counterpart of the device phone book, with extra chapters.`,
    `European Database on Medical Devices under [[eumdr]] Article 33: modules for actor registration, UDI/device registration (Basic UDI-DI and UDI-DI), notified bodies and certificates, clinical investigations, vigilance, market surveillance. Mandatory use is being phased in module by module {V}.`,
    `MediCare registers the T-300 family under one Basic UDI-DI with a UDI-DI per variant.`,
    'udi eumdr gudid notified-body');
  T('ifu', 'IFU', 'Regulation', `Instructions for Use: the user manual that ships with the device.`,
    `The booklet that tells hospital staff how to use, clean and maintain the stretcher safely, including warnings.`,
    `The manual in the box of a new appliance, except that here it is a legally controlled part of the product.`,
    `Part of labeling (21 CFR 801; [[eumdr]] Annex I chapter III). Content includes intended purpose, warnings, residual risks, cleaning and maintenance. Controlled as a document and as a part in the packaging BOM; language variants are options.`,
    `IFU-T300 rev A warns: "Always apply the brake before patient transfer" (risk control RC-007c).`,
    'risk-control iec62366 udi');

  /* ---------------- Design controls ---------------- */
  T('dhf', 'DHF', 'Design controls', `Design History File: the collected proof of how the device was designed.`,
    `A folder that tells the story of the design: what was needed, what was drawn, how it was tested, who approved it.`,
    `The baby book of the product: every milestone, with dates and signatures.`,
    `Formerly required by 21 CFR 820.30(j). Under [[qmsr]] / [[iso13485]] 7.3.10 the equivalent is the design and development file. Contents: plans, [[design-input]]s, [[design-output]]s, [[design-review]] records, [[vv|V&V]], [[design-transfer]], design changes, [[risk-file]] references. In Windchill it is usually a structured set of documents, links and [[baseline]]s, not one file.`,
    `The T-300 DHF index DOC-DHF-0000 lists every plan, specification, test report and review record with its released revision.`,
    'dmr dhr mdf design-input design-output vv baseline');
  T('dmr', 'DMR', 'Design controls', `Device Master Record: the complete recipe for making the device.`,
    `Everything the factory needs to build the product the same way every time: drawings, parts list, build steps, inspection instructions, labels, packaging.`,
    `The master recipe in a bakery, including oven settings and how to box the cake.`,
    `Formerly 21 CFR 820.181; now part of the [[mdf|medical device file]] (ISO 13485 4.2.3). Contents: device specifications, production process specifications, quality assurance procedures, packaging and labeling specifications, installation and servicing procedures. Typically released [[ebom]] + [[mbom]] + process plans + specifications in Windchill, consumed by SAP and MES.`,
    `The T-300 DMR is the released structure of MC-STR-3000 with its drawings, MBOM, process plan and label artwork.`,
    'dhf dhr mdf mbom ebom');
  T('dhr', 'DHR', 'Design controls', `Device History Record: the proof of how one unit or batch was actually built.`,
    `The build diary of one stretcher: which parts went in, who assembled it, which tests it passed, which label it got.`,
    `The stamped service book of one particular car.`,
    `Formerly 21 CFR 820.184; now production records under ISO 13485 7.5.1 and [[qmsr]] 820.35. Contents: dates of manufacture, quantity, acceptance records, primary label and [[udi]], serial/lot. Usually generated in MES and SAP, not in Windchill.`,
    `DHR for serial T3P-250001 lists the castor lot, brake test result and the operator at each bench.`,
    'dmr dhf udi-pi mes nc');
  T('mdf', 'Medical Device File', 'Design controls', `ISO 13485's name for the file holding everything about a device type: description, specifications, procedures.`,
    `One organised file per product type that contains or points to everything needed to describe, make, check and service it.`,
    `The complete owner's file for a building: plans, materials, maintenance instructions.`,
    `[[iso13485]] clause 4.2.3. Contains or references: general description and intended use, labeling and [[ifu]], product specifications, manufacturing, packaging, storage, handling and distribution specifications, measuring and monitoring procedures, installation and servicing requirements. Under [[qmsr]] it takes the place of the [[dmr]].`,
    `For the T-300, Windchill's released product structure plus the document index DOC-MDF-0000 form the medical device file.`,
    'dmr dhf qmsr iso13485');
  T('user-need', 'User need', 'Design controls', `What the user wants, in the user's own words.`,
    `A plain statement of what nurses, porters or patients need the device to do.`,
    `"I want a car that fits my family": true, but not yet something an engineer can measure.`,
    `Input to design and development; validated at the end by [[validation]]. Each need has an ID, source and priority, and is traced to one or more [[design-input]]s.`,
    `UN-004: "The stretcher must stay put while a patient is moved on or off."`,
    'design-input validation traceability iec62366');
  T('design-input', 'Design input', 'Design controls', `A measurable requirement the design must meet.`,
    `A user need rewritten so it can be tested: a number, a limit, a yes/no check.`,
    `"Seats five, boot holds four suitcases": now the engineer can design and the tester can check.`,
    `[[iso13485]] 7.3.3: functional, performance, usability and safety requirements, applicable regulatory requirements and standards, outputs of risk management. Must be complete, unambiguous, verifiable and approved. Proven by [[verification]].`,
    `DI-012: "Brakes hold the loaded stretcher on a 10° incline with no creep for 5 minutes."`,
    'user-need design-output verification traceability');
  T('design-output', 'Design output', 'Design controls', `What the designers produce: drawings, models, specifications, the parts list.`,
    `The results of design work that tell the factory and suppliers exactly what to make.`,
    `The architect's finished plans and material list.`,
    `[[iso13485]] 7.3.4: must meet the inputs, give information for purchasing, production and service, contain or reference acceptance criteria, and specify characteristics essential for safe and proper use. Approved before release.`,
    `Drawing MC-BRK-6100.drw, the EBOM of MC-STR-3000 and purchase specification of the castor are design outputs.`,
    'design-input drawing ebom cad-document');
  T('vv', 'V&V', 'Design controls', `Verification and validation: the two kinds of proof that a design is right.`,
    `Two questions. Verification: did we build it to the requirements? Validation: is it what users really need?`,
    `Verification is checking the cake against the recipe. Validation is the guests enjoying it.`,
    `[[verification]] ([[iso13485]] 7.3.6) confirms outputs meet inputs. [[validation]] (7.3.7) confirms the device meets user needs and intended use, on representative product. Both need plans, methods, acceptance criteria and records.`,
    `VT-012 verifies the brake requirement; VAL-003 validates the stretcher with porters and nurses.`,
    'verification validation design-input user-need');
  T('verification', 'Verification', 'Design controls', `Testing that the design meets its written requirements.`,
    `Measuring the product against each requirement: does it hold 250 kg, does the brake hold on a slope?`,
    `Checking the cake against the recipe: right size, right ingredients.`,
    `[[iso13485]] 7.3.6. Performed to planned arrangements; records include method, acceptance criteria, sample-size rationale, results and conclusions. Also used to verify [[risk-control]] implementation and effectiveness ([[iso14971]] 7.2).`,
    `VT-012: 250 kg on a 10° incline for 5 minutes in all castor orientations. Result: pass, 0 mm creep.`,
    'vv validation design-input risk-control');
  T('validation', 'Validation', 'Design controls', `Proving with real users that the device meets their needs.`,
    `Letting the intended users try the finished design in realistic conditions to confirm it works for them and is safe.`,
    `A test drive by the family who will own the car.`,
    `[[iso13485]] 7.3.7: on representative product (initial production units or equivalent), with rationale for product selection; includes summative usability evaluation per [[iec62366]]. Must be complete before release for use.`,
    `VAL-003: 15 porters and nurses used pilot-build stretchers in a simulated ward; no use errors leading to harm.`,
    'vv verification user-need iec62366');
  T('design-review', 'Design review', 'Design controls', `A formal meeting where the design evidence is checked, including by someone independent.`,
    `At planned points, a group looks at the design and the test results and decides whether it may move on.`,
    `A second doctor's opinion before an operation.`,
    `[[iso13485]] 7.3.5: systematic reviews at suitable stages; participants include representatives of functions concerned and other specialist personnel (FDA has historically required an individual without direct responsibility for the stage). Records identify the design, participants and date.`,
    `Design review DR-03 on 2025-02-27 checked all V&V reports before promotion request PR-2025-0042 was raised.`,
    'promotion-request vv dhf');
  T('design-transfer', 'Design transfer', 'Design controls', `Handing the approved design over to manufacturing so it can be built correctly every time.`,
    `Turning the design into factory instructions and proving the factory can follow them.`,
    `A chef turning their own dish into a written recipe that any cook in the chain can repeat.`,
    `[[iso13485]] 7.3.8: procedures ensure design outputs are verified as suitable for manufacturing before becoming final production specifications, and that production capability can meet requirements. Covers [[mbom]], process plans, work instructions, process validation, training.`,
    `Stage 5 of the T-300: EBOM to MBOM for Plant 1000, process plan PP-T300-01, pilot build of 10 units.`,
    'mbom mpmlink dmr pfmea');
  T('traceability', 'Traceability', 'Design controls', `Being able to follow the chain from a need to its requirement, test, part, and built unit, and back.`,
    `Every item points to where it came from and where it went. From a complaint about a brake you can walk back to the lot of castors, the test and the original requirement.`,
    `A parcel tracking number: you can see every step of the journey.`,
    `Two kinds. Requirements traceability: [[user-need]] → [[design-input]] → [[design-output]] → [[verification]] / [[validation]], linked to [[hazard]]s and [[risk-control]]s. Product traceability ([[iso13485]] 7.5.9): lot/serial genealogy from supplier lot to shipped unit. Together they form the digital thread.`,
    `UN-004 → DI-012 → MC-CST-6000 + MC-BRK-6100 → VT-012 → castor lot → serial T3P-250001.`,
    'user-need design-input dhr udi-pi');

  /* ---------------- Risk ---------------- */
  T('risk-file', 'Risk management file', 'Risk', `The set of records showing every risk was identified, reduced and accepted.`,
    `The file that proves the company thought about what could go wrong, did something about it, and checked that it worked.`,
    `A safety inspection report for a playground, kept up to date for as long as the playground exists.`,
    `[[iso14971]] clause 4.5: plan, hazard analysis, risk evaluation, [[risk-control]] measures and their verification, residual-risk evaluation, risk management report, production and post-production information. Maintained for the life of the device. In Windchill: documents and/or structured data in Windchill Risk and Reliability {V}.`,
    `T-300 risk file: DOC-RMP-0002 plan, hazard analysis, [[dfmea]], [[pfmea]], risk management report DOC-RMR-0090.`,
    'iso14971 hazard risk-control dfmea pfmea');
  T('hazard', 'Hazard', 'Risk', `A potential source of harm.`,
    `Something that could hurt a person: a moving part, electricity, a stretcher that can roll.`,
    `A wet floor. It is not an injury yet, but it could cause one.`,
    `[[iso14971]] 3.4: potential source of harm. Analysis links hazard → sequence of events → hazardous situation → harm, with probability and severity estimates.`,
    `HAZ-007 Unintended movement: the stretcher rolls during patient transfer because a brake did not lock; harm: patient fall.`,
    'risk-control iso14971 dfmea risk-file');
  T('risk-control', 'Risk control', 'Risk', `A measure that reduces a risk: a design feature, a guard, or a warning.`,
    `What we do about a danger. Best is to design it out; next best is a guard or alarm; last is a warning in the manual.`,
    `For a hot stove: an auto-off switch, then a guard rail, then a "hot" sticker.`,
    `[[iso14971]] clause 7, priority order: inherently safe design and manufacture; protective measures in the device or process; information for safety and training. Each control is implemented, verified, and checked for new risks.`,
    `RC-007a positive-lock central brake (design); RC-007b red/green indicator (protective); RC-007c IFU warning (information).`,
    'hazard verification iso14971 ifu');
  T('dfmea', 'DFMEA', 'Risk', `Design Failure Mode and Effects Analysis: a table of how each part could fail and what happens then.`,
    `Engineers go through the design part by part and ask: how could this fail, what would it cause, how would we notice, and what prevents it?`,
    `A mechanic's pre-trip checklist written before the car is even built.`,
    `Bottom-up analysis per IEC 60812. Columns: item/function, failure mode, effect, cause, severity, occurrence, detection, RPN or action priority, design controls, actions. Complements top-down hazard analysis under [[iso14971]]; rows link to hazards, parts and [[verification]] tests.`,
    `DF-021: castor brake cam does not fully engage → stretcher rolls → S9 × O3 × D4 = RPN 108 → over-centre cam, verified by VT-012.`,
    'pfmea hazard risk-control risk-file');
  T('pfmea', 'PFMEA', 'Risk', `Process FMEA: how each manufacturing step could go wrong and how that is prevented or caught.`,
    `The same "what could fail?" exercise, but for the factory steps: a screw not tightened, a wrong label applied.`,
    `Checking a recipe for steps where a cook could easily slip, and adding a timer or a check.`,
    `Analysis per process operation: failure mode, effect, cause, current prevention and detection controls. Feeds the control plan, inspection characteristics and work instructions. Authored against the process plan in [[mpmlink]] or a risk tool {V}.`,
    `PF-031: brake linkage clamp screw under-torqued at bench B2 → brake slips → control: torque tool with electronic record.`,
    'dfmea mpmlink design-transfer');
  T('swl', 'Safe working load', 'Risk', `The maximum total load the device may carry in normal use.`,
    `The heaviest load the stretcher is designed and tested to carry safely: patient, mattress and accessories together.`,
    `The weight limit sign in a lift.`,
    `Stated on the label and in the [[ifu]]; verified by static and dynamic tests with a safety factor per the applicable standard ([[iec60601]] clause 9.8 for support systems {V}).`,
    `T-300 safe working load: 250 kg. Test VT-001 applies twice that for one minute.`,
    'verification design-input iec60601');
  T('biocompatibility', 'Biocompatibility', 'Risk', `Proof that materials touching the patient do not harm the body.`,
    `Materials that touch skin must not cause irritation, allergy or poisoning. This is shown by tests or by evidence about the material.`,
    `Checking that a watch strap does not give you a rash.`,
    `Biological evaluation per ISO 10993-1 within risk management; endpoints depend on contact type and duration (for intact skin: cytotoxicity, sensitisation, irritation). Evidence is linked to the material and supplier; a material change triggers re-evaluation.`,
    `The cover of mattress [[p:MC-MAT-5000]] has ISO 10993 reports from Calder Foam & Textiles on file.`,
    'reach rohs risk-file');
  T('rohs', 'RoHS', 'Risk', `EU rule limiting hazardous substances such as lead in electrical equipment.`,
    `A law that bans or limits certain harmful substances in electrical and electronic products.`,
    `An ingredients ban list for electronics.`,
    `Directive 2011/65/EU (RoHS 2) and amendments: limits on lead, mercury, cadmium, hexavalent chromium, PBB, PBDE and four phthalates; medical devices are in scope (category 8). Compliance data is collected per manufacturer part and rolled up the BOM.`,
    `Controller board [[p:MC-PCB-8200]] and harness carry supplier RoHS declarations linked to their manufacturer parts.`,
    'reach manufacturer-part aml');
  T('reach', 'REACH', 'Risk', `EU chemicals regulation: makers must know and declare substances of very high concern in their products.`,
    `A European law about chemicals. If a product contains certain worrying substances above a small limit, the maker must tell customers.`,
    `Allergen labelling on food.`,
    `Regulation (EC) 1907/2006. Article 33 requires communication when a Candidate List substance (SVHC) exceeds 0.1 % w/w in an article. Declarations are collected from suppliers and rolled up by part.`,
    `Calder Foam & Textiles supplies a REACH declaration for the mattress foam and cover.`,
    'rohs biocompatibility manufacturer-part');

  /* ---------------- Quality ---------------- */
  T('capa', 'CAPA', 'Quality', `Corrective and Preventive Action: finding the root cause of a problem and making sure it cannot return.`,
    `When something goes wrong, do more than fix the one case: find out why it happened and change things so it does not happen again.`,
    `Mopping the floor fixes the puddle. Repairing the leaking pipe is the CAPA.`,
    `[[iso13485]] 8.5.2 and 8.5.3. Steps: review nonconformities including complaints, determine causes, evaluate need for action, plan and implement, verify no adverse effect, review effectiveness. In Windchill: CAPA object in the quality management solution with investigation, action plan and effectiveness check {V}.`,
    `CAPA-2026-0017 "Castor brake fails to lock" (told in full in Phase 3) leads to a design change of the brake cam.`,
    'nc complaint scar change-request');
  T('nc', 'Nonconformance (NC)', 'Quality', `A record that a part or product does not meet its requirement.`,
    `When a part is found to be wrong, such as wrong size, damaged or failing a test, it is tagged, set aside and recorded so it cannot be used by mistake.`,
    `Putting a faulty item on the "do not use" shelf with a note saying why.`,
    `[[iso13485]] 8.3: identify, document, segregate, evaluate and disposition nonconforming product (use as is under concession, rework, return, scrap). Disposition by a material review board (MRB). May escalate to [[capa]] or [[scar]].`,
    `NC-2026-0113: 6 castors from lot NCW-L2604 below brake torque at incoming inspection.`,
    'capa scar dhr');
  T('complaint', 'Complaint', 'Quality', `Any report that a device already delivered had a problem.`,
    `When a hospital tells the maker something was wrong with the stretcher, by phone, e-mail or through a service engineer, that is a complaint and must be recorded and evaluated.`,
    `A customer telling the restaurant the food made them ill: it must be taken seriously and looked into.`,
    `[[iso13485]] 3.4 and 8.2.2: communication alleging deficiencies in identity, quality, durability, reliability, usability, safety or performance of a device released from the organisation's control. Each is evaluated for investigation need and for reportability (US MDR 21 CFR 803; EU vigilance under [[eumdr]]).`,
    `CMP-2026-0231: "Brake fails to lock on one castor", St. Aldwyn General Hospital (invented), serial T3P-250118.`,
    'capa nc udi-pi');
  T('scar', 'SCAR', 'Quality', `Supplier Corrective Action Request: formally asking a supplier to fix the cause of a problem.`,
    `When a bought part caused the trouble, the supplier is asked in writing to find the cause and prevent it from happening again.`,
    `Sending a faulty delivery back with a letter that says: tell us why, and how you will stop it.`,
    `Issued by Supplier Quality under purchasing controls ([[iso13485]] 7.4). Contains problem description, containment, root cause, corrective action and verification; tracked to closure and reflected in supplier rating.`,
    `SCAR-2026-0009 to Norvale Castor Works for brake cam moulding variation.`,
    'capa nc avl suma');

  /* ---------------- Change ---------------- */
  T('ccb', 'CCB', 'Change', `Change Control Board: the group that decides whether a proposed change goes ahead.`,
    `A small committee from engineering, quality, manufacturing, purchasing and regulatory that reviews each proposed change and says yes, no, or "more information".`,
    `A planning committee that must approve changes to a building before work starts.`,
    `Cross-functional review body for [[change-request]]s. Assesses technical, quality, regulatory, cost, stock and field impact; decides fast-track or full-track; assigns the [[change-notice]]. In Windchill it is a team role in the change workflow.`,
    `The T-300 CCB meets every Tuesday, chaired by Priya Nair (Change Admin).`,
    'change-request change-notice problem-report');
  T('problem-report', 'Problem Report', 'Change', `A Windchill record describing a problem with a released item.`,
    `Anyone can raise a hand and say "something is wrong with this part or document". The problem report records it.`,
    `Reporting a pothole to the council: you describe it; they decide what to do.`,
    `Windchill change object (also called change issue). States: Open → Under Review → Accepted / Rejected → Resolved. Lists affected objects; may be linked to a [[change-request]] or, for one-off deviations, a variance.`,
    `PRB-2026-0058: castor MC-CST-6000 brake cam does not lock reliably (raised from the CAPA).`,
    'change-request change-notice capa');
  T('change-request', 'Change Request', 'Change', `A formal proposal to change a released design or document, with its justification and impact.`,
    `The written case for a change: what should change, why, and what it will affect. The [[ccb]] decides on it.`,
    `A planning application: describe the change and its effects before anyone picks up a tool.`,
    `Windchill ECR. Carries affected objects, proposed solution, impact analysis (cost, stock, regulatory, risk file, validation), complexity (fast-track / full-track). Approved by the [[ccb]]; implemented by a [[change-notice]].`,
    `CR-2026-0044: revise the castor brake cam geometry and add a pedal travel stop.`,
    'problem-report change-notice ccb ecr-ecn');
  T('change-notice', 'Change Notice', 'Change', `The Windchill record that carries out an approved change and releases the new revisions.`,
    `The work order for a change. It lists the tasks, who does each one, and releases the new versions when all are done and approved.`,
    `The building permit plus the job list for the builders.`,
    `Windchill ECN. Contains [[change-task]]s with affected objects (old revisions) and resulting objects (new revisions). Approval of the notice releases the resulting objects, sets [[effectivity]], and triggers publication to ERP through [[esi]]. Requires [[esign|electronic signatures]].`,
    `CN-2026-0039 releases MC-CST-6000 revision B and MC-BRK-6100 revision B.`,
    'change-task change-request effectivity esi');
  T('change-task', 'Change Task', 'Change', `One piece of work inside a change notice, assigned to one person.`,
    `A single job within a change, such as "update the castor drawing", with an owner and a reviewer.`,
    `One line on the builders' job list.`,
    `Windchill change activity. Has assignee, reviewer, affected and resulting objects. The assignee revises the objects (A → B), makes the change, and completes the task; the reviewer checks it.`,
    `CT-1 of CN-2026-0039: Asha Verma revises MC-CST-6000.drw to revision B.`,
    'change-notice revision');
  T('ecr-ecn', 'ECR / ECN', 'Change', `Engineering Change Request and Engineering Change Notice: the traditional names for change request and change notice.`,
    `Older, widely used names. ECR = "we propose a change". ECN = "the change is approved and is being made".`,
    `Application and permit.`,
    `In Windchill the objects are named [[change-request]] and [[change-notice]]; SAP uses the engineering change master (ECM / change number). Many companies still say ECR, ECN or ECO.`,
    `ECR CR-2026-0044 → ECN CN-2026-0039 → SAP change number 500000391.`,
    'change-request change-notice');
  T('promotion-request', 'Promotion Request', 'Change', `A Windchill request to move a set of items to a new state, typically from In Work to Released.`,
    `The way to ask for first approval. The engineer gathers everything that belongs together and sends it to the approvers in one go.`,
    `Handing in a finished manuscript to be approved for printing.`,
    `Windchill object for state promotion without a change notice, used mainly for initial release. Holds promotion objects, target state, participants (reviewers, approvers) and can create a [[baseline]]. Later revisions of released data go through [[change-notice]].`,
    `PR-2025-0042 promoted 37 parts, 52 CAD documents and 24 documents of the T-300 to Released on 2025-03-10.`,
    'lifecycle-state baseline esign change-notice');

  /* ---------------- PLM ---------------- */
  T('plm', 'PLM', 'PLM', `Product Lifecycle Management: managing all product information from idea to retirement.`,
    `One place and one set of rules for everything known about a product, for its whole life: designs, parts lists, changes, approvals.`,
    `The product's complete medical record, kept from birth onwards.`,
    `Discipline and system class covering requirements, CAD data, BOMs, change, configuration, manufacturing process data, quality and service information. [[windchill]] is PTC's PLM system; it is the source of truth for product definition, while [[erp]] is the source of truth for transactions.`,
    `Everything about the T-300's definition lives in Windchill; orders, stock and costs live in SAP.`,
    'pdm windchill erp');
  T('pdm', 'PDM', 'PLM', `Product Data Management: the vault that stores and versions design files.`,
    `A secure library for design files. It keeps every version, shows who has a file open for editing, and stops two people overwriting each other.`,
    `A library where you sign a book out, and the library keeps every edition.`,
    `Core subset of [[plm]]: vaulting, [[checkin|check-in / check-out]], versioning, access control, CAD relationship management. In Windchill, delivered by [[pdmlink]].`,
    `The Creo files of the T-300 are vaulted in the PDMLink product "TransPort T-300".`,
    'plm pdmlink checkin cad-document');
  T('windchill', 'Windchill', 'PLM', `PTC's PLM system: the company's single source of truth for product data.`,
    `The central computer system where MediCare keeps every part, drawing, document, approval and change for the stretcher.`,
    `The land registry for product information: if it is not recorded there, it is not official.`,
    `PTC Windchill 13 (this site's reference release). Modules used here: [[pdmlink]], [[projectlink]], [[mpmlink]], [[suma|Supplier Management]], [[option-variant|Options and Variants]], change management, quality solutions, [[esi]]. Module names, packaging and licences vary by release {V}.`,
    `Every T-300 object has a Windchill number, version (A.3), state (Released) and history.`,
    'plm pdmlink projectlink mpmlink creo');
  T('pdmlink', 'PDMLink', 'PLM', `The core Windchill module for managing parts, documents, CAD data and changes.`,
    `The main part of Windchill: the vault and the rules for product data.`,
    `The main building of the library.`,
    `Provides Product and Library containers, [[wtpart]], [[wtdocument]], [[cad-document]] management, [[lifecycle-state|lifecycles]], workflows, change management, [[baseline]]s, visualisation.`,
    `The T-300 lives in a PDMLink Product; shared fasteners and bought items live in the Library "Standard Parts".`,
    'windchill projectlink wtpart');
  T('projectlink', 'ProjectLink', 'PLM', `The Windchill module for project plans, tasks and collaboration around product data.`,
    `A project workspace: the plan, the milestones, who does what, and a shared area where partners can see chosen data.`,
    `The site office of a building project: plans on the wall and a task list.`,
    `Windchill ProjectLink: projects with plan activities, milestones, deliverables linked to PDMLink objects, team roles, discussion, and controlled sharing of product data with internal and external members.`,
    `Project "T-300 NPD" has gate milestones G1–G5; the G3 "Design freeze" deliverable is the released baseline BL-0007.`,
    'windchill pdmlink baseline');
  T('mpmlink', 'MPMLink', 'PLM', `The Windchill module for manufacturing planning: MBOM, process plans, work instructions.`,
    `The part of Windchill where manufacturing engineers plan how the product is built in the factory.`,
    `Turning the architect's plans into the builder's sequence of work.`,
    `Windchill MPMLink: transformation of [[ebom]] to [[mbom]] with equivalence links, process plans with operations, work centres, tooling, time standards, and work instructions; publishes BOM and routing to ERP/MES via [[esi]]. Full detail in stage 5 (Phase 2).`,
    `Process plan PP-T300-01 for Plant 1000 lists the operations at benches B1–B4.`,
    'mbom ebom views design-transfer');
  T('suma', 'Supplier Management (SUMA)', 'Supplier', `The Windchill capability for recording which makers and vendors are approved for each bought part.`,
    `The part of Windchill that answers: who makes this bought part, and who are we allowed to buy it from?`,
    `A list of approved brands and approved shops for each item on a shopping list.`,
    `Windchill Supplier Management: [[manufacturer-part]]s and [[vendor-part]]s linked to the company's [[wtpart]], with [[aml]] / [[avl]] preference per sourcing context. Supplier organisations are managed as Windchill organisations {V}.`,
    `MC-CST-6000 is linked to NCW-200-TB-ESD from Norvale Castor Works (Preferred).`,
    'aml avl manufacturer-part vendor-part');
  T('creo', 'Creo', 'PLM', `PTC's 3D CAD software used to design the parts.`,
    `The program engineers use to build the stretcher in 3D on screen and to make the drawings.`,
    `A digital workbench and drawing board in one.`,
    `PTC Creo Parametric: parametric, feature-based modelling of parts (.prt), assemblies (.asm) and drawings (.drw); integrated with [[windchill]] through the embedded browser, [[workspace]] and [[checkin|check-in / check-out]].`,
    `MC-STR-3000.asm is the Creo top assembly of the T-300.`,
    'cad-document workspace drawing windchill wgm');
  T('wgm', 'Workgroup Manager', 'PLM', `The connector that lets non-Creo design tools save into Windchill.`,
    `A bridge program for other design tools, such as electronics CAD, so their files can also be stored and controlled in Windchill.`,
    `An adapter plug.`,
    `Windchill Workgroup Manager: client integrations for other MCAD and ECAD tools providing workspace, check-in/out and structure management. Creo itself has the integration built in. Supported tools and versions depend on the release {V}.`,
    `The schematic and layout of [[p:MC-PCB-8200]] are checked in through the ECAD Workgroup Manager.`,
    'creo cad-document workspace');
  T('workspace', 'Workspace', 'PLM', `A designer's private working area linked to Windchill.`,
    `Each engineer's personal desk in the system: the files they are working on, before they hand them in.`,
    `Your own desk in a shared office.`,
    `Windchill workspace: server-side and local cache of objects added or checked out; shows status (out of date, modified locally) and is the place for [[checkin|check-in]], check-out and compare.`,
    `Asha Verma's workspace "T300_brake" holds MC-BRK-6100.asm checked out to her.`,
    'checkin cad-document creo');
  T('checkin', 'Check-out / check-in', 'PLM', `Check-out reserves a file for editing. Check-in saves it back as a new version for everyone.`,
    `Taking a file out so only you can change it, then putting it back so everyone sees your update.`,
    `Borrowing a library book and returning it, with your notes added.`,
    `Check-out locks the latest [[iteration]] to one user; check-in creates the next iteration and releases the lock. Undo check-out discards changes.`,
    `After check-in, MC-BRK-6100.asm moved from A.4 to A.5.`,
    'iteration workspace pdm');
  T('cad-document', 'CAD Document', 'PLM', `The Windchill record that holds a CAD file (model, assembly or drawing).`,
    `The Windchill "envelope" around a 3D model or drawing file, with its version and status written on the outside.`,
    `A labelled folder holding one technical drawing.`,
    `EPMDocument in Windchill: holds CAD content, attributes mapped from CAD parameters, and CAD dependencies. Linked to a [[wtpart]] by owner, image or content association. Has its own [[revision]], [[iteration]] and [[lifecycle-state]].`,
    `MC-CST-6000.drw, version A.2, state Released.`,
    'wtpart drawing creo checkin');
  T('drawing', 'Drawing', 'PLM', `The 2D sheet with dimensions and tolerances that defines exactly how a part must be.`,
    `A flat technical picture of a part with all its sizes and allowed deviations. The factory and inspectors measure against it.`,
    `A tailor's pattern with every measurement written on it.`,
    `Creo .drw [[cad-document]] associated with its model. Carries dimensions, tolerances (GD&T), notes, critical characteristics and the title block with [[revision]] and signatures. A source-control drawing defines a bought part by interface and performance.`,
    `MC-CST-6000.drw fixes the castor mounting stem, load rating and minimum brake torque of 12 N·m.`,
    'cad-document design-output');
  T('family-table', 'Family table', 'PLM', `One Creo model that generates many sizes of the same kind of part.`,
    `A table that turns one design into a family, such as the same screw in ten lengths.`,
    `A clothing pattern with a size chart.`,
    `Creo family table: generic model plus instances driven by parameters and dimensions. In Windchill each instance is a CAD document linked to its generic.`,
    `Screws MC-FST-0412 and MC-FST-0413 are instances of fastener family tables.`,
    'creo cad-document');
  T('wtpart', 'WTPart', 'PLM', `The Windchill record for a part: the item itself, as opposed to its drawing or model.`,
    `The official entry for one item in the company catalogue: its number, name, status and what it is made of or used in.`,
    `A product card in a shop's catalogue. The photo (CAD) is attached, but the card is the item.`,
    `Windchill part object. Master (number, name, default unit) plus versions per [[views|view]] ([[revision]].[[iteration]]). Usage links to children form the BOM. Carries business attributes ([[make-buy|source]], classification) and links to [[cad-document]]s and [[wtdocument]]s. This is what goes to ERP.`,
    `WTPart MC-CST-6000, "Castor 200 mm with brake", A.2 (Design), Released, source Buy.`,
    'cad-document wtdocument ebom views');
  T('wtdocument', 'WTDocument', 'PLM', `The Windchill record for a general document such as a specification, plan or report.`,
    `A controlled office document in Windchill: it has a number, versions, a status and approvals.`,
    `A numbered, signed document in a filing system.`,
    `Windchill document object with primary content and attachments, soft types (Plan, Specification, Report, Procedure), [[revision]] / [[iteration]], [[lifecycle-state]]. Linked to parts as "described by" (version-specific) or "references" (latest).`,
    `DOC-VER-0112 rev A: brake hold test report, linked to MC-CST-6000 and MC-BRK-6100.`,
    'wtpart cad-document lifecycle-state');
  T('ebom', 'EBOM', 'BOM', `Engineering Bill of Materials: the parts list as engineering designed it.`,
    `The list of everything the stretcher is made of, arranged the way the designers think about it.`,
    `The ingredient list of a recipe, grouped by sauce, filling and topping.`,
    `[[wtpart]] structure in the Design [[views|view]], organised by function, usually derived from the CAD structure. Carries quantity, [[find-number]], [[alternate]]s / [[substitute]]s and [[option-variant|options]]. Upstream of the [[mbom]].`,
    `EBOM of MC-STR-3000: 14 top-level lines from the base frame (find no. 10) to the label set (140).`,
    'mbom sbom wtpart views find-number');
  T('mbom', 'MBOM', 'BOM', `Manufacturing Bill of Materials: the parts list rearranged for how the factory builds the product.`,
    `The same ingredients, regrouped in the order the factory uses them, plus factory-only items such as glue and packaging.`,
    `The recipe rewritten by station: prep table, oven, decorating.`,
    `[[wtpart]] structure in the Manufacturing [[views|view]], plant-specific, created from the [[ebom]] with [[mpmlink]]. Adds manufacturing assemblies, [[phantom]]s, consumables and packaging. Lines are allocated to operations. Full detail in stage 5 (Phase 2).`,
    `MBOM for Plant 1000 groups the castors and brake linkage into the sub-assembly "Chassis complete".`,
    'ebom sbom mpmlink views phantom');
  T('sbom', 'SBOM (Service BOM)', 'BOM', `Service Bill of Materials: the list of parts that can be replaced in the field.`,
    `The list a service engineer uses: which parts can be ordered as spares and which come as repair kits.`,
    `The spare-parts catalogue for a washing machine.`,
    `Part structure in a Service [[views|view]] defining serviceable items, spare kits and replacement relationships. In other contexts SBOM also means "software bill of materials"; on this site it means service BOM.`,
    `Service kit MC-KIT-6000 contains one castor, its fixing screw and thread-lock.`,
    'ebom mbom views');
  T('views', 'Views', 'BOM', `Different arrangements of the same product for different departments (Design, Manufacturing, Service).`,
    `The same product seen through different glasses: engineering's view, the factory's view, the service view.`,
    `A city shown as a street map, a metro map and a tourist map.`,
    `Windchill views (Design, Manufacturing, plant-specific child views, Service). A part can have a version per view; equivalence links connect upstream and downstream parts so changes can be detected and reconciled.`,
    `MC-STR-3000 exists as A.2 (Design) and A.1 (Manufacturing — Plant 1000).`,
    'ebom mbom sbom mpmlink');
  T('lifecycle-state', 'Lifecycle state', 'PLM', `The status of an item, such as In Work, Under Review, Released or Obsolete.`,
    `A label that tells everyone how far an item is: still being worked on, being checked, approved for use, or retired.`,
    `A traffic light for data: amber = in work, green = released, red = obsolete.`,
    `Each object type has a lifecycle template defining states, transitions and associated workflow and access rules. State changes occur by [[promotion-request]], [[change-notice]] or set-state action. Downstream systems normally receive only Released data.`,
    `MC-CST-6000 A: In Work (2024-11) → Under Review (2025-03-03) → Released (2025-03-10).`,
    'revision iteration promotion-request');
  T('revision', 'Revision', 'PLM', `A formally approved version of an item, shown by a letter: A, B, C.`,
    `Each time a released item is officially changed, it gets the next letter. Revision B replaces revision A.`,
    `Editions of a book: 1st edition, 2nd edition.`,
    `The major version label from the revision series. A new revision is created by "Revise", normally inside a [[change-task]]. Form, fit and function compatible changes revise the part; incompatible changes require a new part number.`,
    `The brake fix in 2026 makes MC-CST-6000 revision B.`,
    'iteration lifecycle-state change-notice');
  T('iteration', 'Iteration', 'PLM', `A saved working step within a revision, shown by a number after the letter: A.1, A.2.`,
    `Every time an engineer saves work into Windchill, the number after the dot goes up. These are work-in-progress steps.`,
    `Draft 1, draft 2, draft 3 of the same edition.`,
    `Minor version created at each [[checkin|check-in]]. A.3 = revision A, iteration 3. Only the latest iteration of a revision is normally released; earlier ones remain as history.`,
    `MC-BRK-6100.asm went through A.1 to A.5 before release.`,
    'revision checkin audit-trail');
  T('baseline', 'Baseline', 'PLM', `A frozen snapshot listing the exact versions of everything at a point in time.`,
    `A photograph of the whole product definition at an important moment, so you can always see exactly how it was.`,
    `A group photo: people change later, the photo does not.`,
    `Windchill managed baseline: a named, immutable collection of specific iterations of parts, documents and CAD documents. Used for design freeze, test configurations, submissions and audits.`,
    `BL-0007 "T-300 Design Freeze A", created 2025-03-10 with 113 objects.`,
    'promotion-request revision dhf');
  T('effectivity', 'Effectivity', 'BOM', `The date, serial number or lot from which a change applies in production.`,
    `The answer to "from when?". For example: the new castor is used from serial number T3P-260400 onwards.`,
    `"New timetable valid from 1 June."`,
    `Date, serial-number or lot effectivity assigned to part versions, usually on the [[change-notice]]; published to ERP where it becomes valid-from data on the BOM and change master. Determines which revision is built and when stock of the old revision is used up or scrapped.`,
    `MC-CST-6000 B effective from serial T3P-260400 (see the CAPA story in Phase 3).`,
    'change-notice revision esi');
  T('find-number', 'Find number', 'BOM', `The balloon number that links a BOM line to its position on the assembly drawing.`,
    `The small numbered bubble on an assembly drawing. The same number appears in the parts list so you can find the part in the picture.`,
    `The numbers on an exploded diagram in a furniture assembly leaflet.`,
    `Attribute of the part usage link; shown as balloon on the drawing. Corresponds to the item number in an SAP BOM.`,
    `Find number 100 on the T-300 assembly drawing is the castor, quantity 4.`,
    'line-number ebom ref-des');
  T('line-number', 'Line number', 'BOM', `The sequence number of a row in the BOM.`,
    `Simply the row number in the parts list, used to keep rows in order and to tell apart two rows with the same part.`,
    `Row numbers on a shopping list.`,
    `Attribute of the usage link that makes each occurrence unique and orders the BOM; important when the same part is used twice with different [[substitute]]s or options.`,
    `Line 30 and line 35 could both be an M8 screw, used in different places.`,
    'find-number ebom');
  T('ref-des', 'Reference designator', 'BOM', `The label that identifies each individual component position on a circuit board (R12, C7, U3).`,
    `On a circuit board every component position has its own name, printed next to it, so each resistor or chip can be identified.`,
    `Seat numbers in a theatre.`,
    `Attribute of part usage (occurrences) for electrical components; one per placed instance. Synchronised from ECAD through the Workgroup Manager and passed to ERP/MES for placement and repair.`,
    `On MC-PCB-8200, U3 is the motor driver IC and R12 a current-sense resistor.`,
    'find-number wgm ebom');
  T('alternate', 'Alternate part', 'BOM', `A replacement part that is interchangeable everywhere the original is used.`,
    `A second part that can stand in for the original in every product that uses it, with no restriction.`,
    `Two brands of the same battery size: either works in any device.`,
    `Defined on the part master, so it is global. Can be one-way or two-way. Must be fully equivalent in form, fit and function and verified as such. Contrast with [[substitute]], which is valid only in one assembly. In SAP this may map to alternative items or to interchangeable manufacturer parts.`,
    `MC-CST-6001 is an alternate for MC-CST-6000: same interface, rating and brake torque, verified with VT-012.`,
    'substitute aml wtpart');
  T('substitute', 'Substitute part', 'BOM', `A replacement part that is allowed only in one specific assembly.`,
    `A stand-in that is acceptable in one particular place, but not automatically anywhere else.`,
    `Using margarine instead of butter is fine in this cake recipe, but not in every recipe.`,
    `Defined on a part usage link, so it is valid only in that parent assembly. Used when equivalence depends on context. Contrast with [[alternate]], which is global.`,
    `MC-FST-0413 flange screw may replace MC-FST-0412 only inside the powered drive module MC-DRV-8000.`,
    'alternate ebom line-number');
  T('option-variant', 'Options and Variants', 'BOM', `Windchill's way of describing a product family with selectable options instead of separate BOMs.`,
    `One master parts list covers all versions of the stretcher. Ticking options, such as "powered" or "thicker mattress", produces the exact list for one version.`,
    `Ordering a car: one model, a list of options, and each choice changes what is built.`,
    `Windchill Options and Variants: option sets with options and choices, expressions assigned to parts and usages, option filters, and variant specifications that generate variant structures from an overloaded ("150 %") BOM.`,
    `Option DRIVE with choices MANUAL / POWERED; choosing POWERED includes MC-DRV-8000 and yields variant T-300P.`,
    'configurable-module udi-di ebom');
  T('configurable-module', 'Configurable module', 'BOM', `A part whose structure contains options and must be configured to get a buildable variant.`,
    `A parts list with choices still open. Once the choices are made, it becomes one specific product.`,
    `A menu "choose one starter, one main" before the order is placed.`,
    `[[wtpart]] flagged as configurable; holds the overloaded structure and option assignments. Variants are produced by applying a variant specification.`,
    `MC-STR-3000 is the configurable module; T-300M and T-300P are its variants.`,
    'option-variant ebom');
  T('phantom', 'Phantom', 'BOM', `A grouping in the BOM that is never stocked: its components are used directly at the next level.`,
    `A heading in the parts list that groups items for convenience. The factory never builds or stores it as a separate thing.`,
    `A folder on a desk: it organises papers but is not itself a document.`,
    `Phantom assembly: MRP passes requirements straight through to its components. Flag set in Windchill and mapped to the SAP special procurement key for phantom assemblies {V}.`,
    `"Brake fastener set" in the MBOM is a phantom: its screws are issued directly to bench B2.`,
    'mbom material-master');
  T('make-buy', 'Make / Buy', 'BOM', `Whether the company produces a part itself or purchases it.`,
    `Each item is marked: do we make it in our own factory, or buy it ready-made?`,
    `Baking the bread yourself or buying it from the bakery.`,
    `WTPart "source" attribute (Make, Buy). Drives the SAP procurement type in the [[material-master]] and whether a routing or a purchasing source is required. May differ per plant.`,
    `Base frame MC-FRM-1000 = Make; castor MC-CST-6000 = Buy.`,
    'material-master wtpart aml');

  /* ---------------- Supplier ---------------- */
  T('manufacturer-part', 'Manufacturer Part', 'Supplier', `The maker's own part number for an item we buy.`,
    `The original maker's catalogue number for a bought item. It is linked to our own part number.`,
    `The brand's own product code printed on the box.`,
    `Windchill Supplier Management object representing a manufacturer's item (MPN + manufacturer), linked to the company [[wtpart]] through the [[aml]]. Carries datasheets and compliance data.`,
    `NCW-200-TB-ESD by Norvale Castor Works is the manufacturer part for MC-CST-6000.`,
    'vendor-part aml suma');
  T('vendor-part', 'Vendor Part', 'Supplier', `The seller's part number for an item we buy, when the seller is not the maker.`,
    `If we buy through a distributor, the distributor has its own order number for the item. That is the vendor part.`,
    `The supermarket's own shelf code for a branded product.`,
    `Windchill object representing a distributor's item, linked to a [[manufacturer-part]] and listed on the [[avl]]. Maps to SAP purchasing info records and source lists.`,
    `Castor NCW-200-TB-ESD may be bought directly from Norvale or as vendor part DX-55120 from distributor Dextrin Industrial Supply.`,
    'manufacturer-part avl suma');
  T('aml', 'AML', 'Supplier', `Approved Manufacturer List: which makers' parts are approved for one of our part numbers.`,
    `For each bought part, the list of makers whose product has been checked and may be used.`,
    `A list of approved brands for a school uniform.`,
    `Links from [[wtpart]] to [[manufacturer-part]]s with a preference (Preferred, Approved, Do Not Use) per sourcing context. Approval rests on qualification evidence; changes to the AML are controlled changes.`,
    `AML of MC-CST-6000: Norvale NCW-200-TB-ESD (Preferred), Rollaxis RX-C200B (Approved), Quillon QW-200-LK (Do Not Use).`,
    'avl manufacturer-part suma alternate');
  T('avl', 'AVL', 'Supplier', `Approved Vendor List: which sellers we may buy an approved part from.`,
    `The list of companies we are allowed to place orders with for a given part.`,
    `A list of approved shops where the uniform may be bought.`,
    `Links to [[vendor-part]]s with preference, per sourcing context (often per plant). Based on supplier qualification under [[iso13485]] 7.4.1. Maps to SAP source lists and approved manufacturer parts.`,
    `For Plant 1000, MC-CST-6000 may be bought from Norvale Castor Works directly or from Dextrin Industrial Supply.`,
    'aml vendor-part suma scar');

  /* ---------------- ERP & factory ---------------- */
  T('erp', 'ERP', 'ERP & factory', `Enterprise Resource Planning: the business system for orders, stock, purchasing, production and finance.`,
    `The company's business engine: it knows what has been ordered, what is in stock, what must be bought and what it all costs.`,
    `The till, stockroom and order book of a shop, in one system.`,
    `System class for transactional processes. Receives released product definition from [[plm]] and executes planning (MRP), procurement, production, quality inspection, sales and service.`,
    `MediCare runs [[sap]] S/4HANA as its ERP.`,
    'sap plm material-master esi');
  T('sap', 'SAP S/4HANA', 'ERP & factory', `The ERP system MediCare uses for buying, planning, building and shipping.`,
    `The business system that orders the parts, schedules the factory and ships the stretchers.`,
    `The control room of the factory's logistics.`,
    `SAP S/4HANA modules referenced here: MM (materials management), PP (production planning), QM (quality management), SD (sales), PM/CS (service). Receives [[material-master]], BOM, routing and change master from Windchill through [[esi]].`,
    `Plant 1000 in SAP plans T-300 production and buys castors from the approved sources.`,
    'erp material-master esi mes');
  T('material-master', 'SAP Material Master', 'ERP & factory', `SAP's record for an item: the counterpart of a WTPart.`,
    `SAP's own card for each part, holding the business facts: how it is bought or made, stored, costed and inspected.`,
    `The stockroom's index card for an item.`,
    `Material master with views (Basic data, Purchasing, MRP, Work scheduling, Quality management, Accounting). Created or updated from the released [[wtpart]] via [[esi]]; plant-specific data is enriched in SAP.`,
    `Material MC-CST-6000: procurement type F (external), QM inspection active, planned delivery time 42 days.`,
    'wtpart sap esi make-buy');
  T('esi', 'ESI / ERP Connector', 'ERP & factory', `The Windchill integration that sends released parts, BOMs, routings and changes to ERP.`,
    `The automatic postal service between Windchill and SAP: when something is released, it is delivered to SAP without retyping.`,
    `A conveyor belt between two buildings.`,
    `Windchill Enterprise Systems Integration publishes parts, BOMs, process plans, documents and change notices to distribution targets (SAP plants). Triggered by release or change-notice resolution. PTC has offered more than one integration technology (middleware-based ESI, ERP Connector); which applies depends on release and licence {V}.`,
    `Release of CN-2026-0039 publishes MC-CST-6000 revision B with its effectivity to SAP Plant 1000.`,
    'sap material-master change-notice effectivity');
  T('mes', 'MES', 'ERP & factory', `Manufacturing Execution System: the shop-floor system that guides and records each build step.`,
    `The system at the benches. It shows the worker the instructions, collects test results and records which parts went into which stretcher.`,
    `A cooking app that shows one step at a time and ticks off each as done.`,
    `Executes production orders by operation and work centre, enforces sequence and data collection, records genealogy and results that form the [[dhr]], and reports confirmations to ERP.`,
    `At bench B2 the MES asks for the scanned castor lot and the brake test result before the order can move on.`,
    'dhr sap traceability');

  /* ---------------- General ---------------- */
  T('raci', 'RACI', 'General', `A table showing who is Responsible, Accountable, Consulted and Informed for each task.`,
    `A simple chart of who does a task, who has the final say, who must be asked, and who is told afterwards.`,
    `For a family dinner: who cooks, who decides the menu, who is asked about allergies, who is told the time.`,
    `R = performs the work; A = single owner who approves; C = two-way input before the decision; I = one-way notification after. Used here per stage; tasks marked with a pen need a [[part11]] [[esign|electronic signature]].`,
    `For "Approve release": Change Admin R, Quality and Regulatory A, Design and Manufacturing C.`,
    'esign ccb');
})();
