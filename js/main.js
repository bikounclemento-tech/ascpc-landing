/**
 * ASCPC SARL — AFRICA SUPPLY CHAIN PERFORMANCE CONSULTING
 * Interactive Front-End Logic (Vanilla ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. STICKY HEADER & MOBILE MENU DRAWER
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 24) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const closeMobileMenu = () => {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileDrawer.classList.remove('is-open');
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileDrawer.setAttribute('aria-hidden', String(isExpanded));
      mobileDrawer.classList.toggle('is-open', !isExpanded);
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ==========================================================================
     2. REGIONAL CORRIDOR MAP FILTER (DOUALA • CEMAC • AFRIQUE DE L'OUEST)
     ========================================================================== */
  const corridorCard = document.querySelector('.corridor-card');
  const corridorTabs = document.querySelectorAll('.corridor-tab');
  const corridorDesc = document.getElementById('corridor-zone-description');

  const zoneData = {
    all: {
      title: 'Hub Principal : Douala & Kribi — Rayonnement Pan-Régional',
      desc: "Point névralgique du commerce maritime, portuaire et des corridors d'approvisionnement vers l'hinterland (Tchad, RCA, Congo, Gabon, Guinée Équatoriale) et les grands marchés d'Afrique de l'Ouest."
    },
    cemac: {
      title: 'Zone CEMAC & Afrique Centrale (Cameroun, Gabon, Congo, Tchad, RCA, Guinée Éq.)',
      desc: "Maîtrise pointue des corridors Douala–N'Djamena et Douala–Bangui, des opérations portuaires (PAD/PAK), des procédures douanières CEMAC et de la distribution multi-sites."
    },
    west: {
      title: "Afrique de l'Ouest (Côte d'Ivoire, Sénégal, Bénin, Togo, Nigéria...)",
      desc: "Accompagnement des groupes industriels, distributeurs et opérateurs logistiques ouest-africains sur l'audit SCOR, le Lean Logistics et la formation certifiante des équipes."
    }
  };

  corridorTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const zone = tab.getAttribute('data-zone') || 'all';

      corridorTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      if (corridorCard) {
        corridorCard.classList.remove('zone-cemac', 'zone-west');
        if (zone === 'cemac') corridorCard.classList.add('zone-cemac');
        if (zone === 'west') corridorCard.classList.add('zone-west');
      }

      if (corridorDesc && zoneData[zone]) {
        corridorDesc.innerHTML = `
          <div class="corridor-stat">
            <span class="corridor-stat__title">${zoneData[zone].title}</span>
            <span class="corridor-stat__desc">${zoneData[zone].desc}</span>
          </div>
        `;
      }
    });
  });

  /* ==========================================================================
     3. INTERACTIVE SCOR & LEAN DIAGNOSTIC SIMULATOR
     ========================================================================== */
  const sliders = {
    stock: document.getElementById('sim-stock'),
    transport: document.getElementById('sim-transport'),
    customs: document.getElementById('sim-customs'),
    warehouse: document.getElementById('sim-warehouse'),
    kpi: document.getElementById('sim-kpi')
  };

  const labels = {
    stock: document.getElementById('sim-stock-val'),
    transport: document.getElementById('sim-transport-val'),
    customs: document.getElementById('sim-customs-val'),
    warehouse: document.getElementById('sim-warehouse-val'),
    kpi: document.getElementById('sim-kpi-val')
  };

  const scoreEl = document.getElementById('sim-total-score');
  const statusBadgeEl = document.getElementById('sim-status-badge');
  const savingsRangeEl = document.getElementById('sim-savings-range');
  const priorityFocusEl = document.getElementById('sim-priority-focus');
  const deliverableFocusEl = document.getElementById('sim-deliverable-focus');
  const recommendationEl = document.getElementById('sim-recommendation-text');
  const transferBtn = document.getElementById('sim-transfer-btn');

  const domainMeta = {
    stock: {
      name: 'Gestion des Stocks & Immobilisation',
      deliverable: 'Calibrage ABC/XYZ, réduction des stocks dormants & ruptures'
    },
    transport: {
      name: 'Transport, Flotte & Distribution',
      deliverable: 'Optimisation du coût au km, schémas de tournées & contrats transporteurs'
    },
    customs: {
      name: 'Transit, Douane & Opérations Portuaires',
      deliverable: 'Réduction des surestaries, fluidité documentaire & conformité CEMAC'
    },
    warehouse: {
      name: 'Entreposage & Manutention Lean',
      deliverable: 'Réimplantation (slotting), 5S, productivité & fiabilité d’inventaire'
    },
    kpi: {
      name: 'Modélisation Décisionnelle & Tableaux de Bord',
      deliverable: 'Cockpit KPI exécutif (OTIF, TCO, rotation) & rituel S&OP'
    }
  };

  const updateSimulator = () => {
    if (!sliders.stock) return;

    const vals = {
      stock: parseInt(sliders.stock.value, 10),
      transport: parseInt(sliders.transport.value, 10),
      customs: parseInt(sliders.customs.value, 10),
      warehouse: parseInt(sliders.warehouse.value, 10),
      kpi: parseInt(sliders.kpi.value, 10)
    };

    Object.keys(vals).forEach((key) => {
      if (labels[key]) {
        labels[key].textContent = `${vals[key]} / 5`;
      }
    });

    const sum = vals.stock + vals.transport + vals.customs + vals.warehouse + vals.kpi;
    const score100 = Math.round((sum / 25) * 100);

    if (scoreEl) scoreEl.textContent = String(score100);

    const sortedDomains = Object.entries(vals).sort((a, b) => a[1] - b[1]);
    const weakestKey = sortedDomains[0][0];
    const secondWeakestKey = sortedDomains[1][0];

    const primaryMeta = domainMeta[weakestKey];
    const secondaryMeta = domainMeta[secondWeakestKey];

    if (priorityFocusEl) {
      priorityFocusEl.textContent = `${primaryMeta.name} & ${secondaryMeta.name}`;
    }
    if (deliverableFocusEl) {
      deliverableFocusEl.textContent = `Livrable clé : ${primaryMeta.deliverable}`;
    }

    if (score100 <= 45) {
      if (statusBadgeEl) statusBadgeEl.textContent = 'Urgence Opérationnelle • Fort Gisement ROI';
      if (savingsRangeEl) savingsRangeEl.textContent = '18 % – 28 %';
      if (recommendationEl) {
        recommendationEl.textContent =
          `Score de maturité (${score100}/100) : Vos flux présentent une exposition importante aux surcoûts opérationnels. Un Audit SCOR & Lean Logistics complet est recommandé en priorité sur « ${primaryMeta.name} » pour générer des gains rapides dès les 90 premiers jours.`;
      }
    } else if (score100 <= 72) {
      if (statusBadgeEl) statusBadgeEl.textContent = "Potentiel d'Optimisation Élevé";
      if (savingsRangeEl) savingsRangeEl.textContent = '10 % – 18 %';
      if (recommendationEl) {
        recommendationEl.textContent =
          `Score de maturité (${score100}/100) : Vos fondamentaux existent mais manquent de synchronisation. L'intervention ASCPC permettra de structurer vos processus autour de « ${primaryMeta.name} » et de déployer des tableaux de bord décisionnels fiables.`;
      }
    } else {
      if (statusBadgeEl) statusBadgeEl.textContent = 'Maturité Avancée • Excellence Fine';
      if (savingsRangeEl) savingsRangeEl.textContent = '6 % – 12 %';
      if (recommendationEl) {
        recommendationEl.textContent =
          `Score de maturité (${score100}/100) : Votre Supply Chain est déjà structurée. Nous recommandons un accompagnement ciblé de modélisation décisionnelle S&OP et la montée en compétences certifiante de vos cadres (Programme Expert 20 Jours).`;
      }
    }
  };

  Object.values(sliders).forEach((input) => {
    if (input) {
      input.addEventListener('input', updateSimulator);
    }
  });
  updateSimulator();

  /* ==========================================================================
     4. INTERACTIVE 5-MODULE CURRICULUM EXPLORER (2 MOIS / 8 SEMAINES • 3 SÉANCES/SEM.)
     ========================================================================== */
  const curriculumData = {
    '1': {
      tag: 'MODULE 1 (M1) • RÉFÉRENTIEL ZONE CEMAC / UEMOA',
      title: 'Gouvernance & Pilotage Opérationnel de la Supply Chain',
      desc: "Synchronisation des flux physiques, d'information et financiers (P2P, O2C, SCOR), gestion avancée des stocks, Lean Warehousing (5S) et économie du transport en Afrique.",
      pdf: 'assets/programmes/ASCPC-Module-1-Gouvernance-Pilotage-Supply-Chain.pdf',
      pdfLabel: 'Télécharger le PDF du Module 1',
      items: [
        '<strong>01–02 :</strong> Architecture Métier & Flux (P2P, O2C, SCOR) & Gestion Avancée des Stocks (Pareto ABC/XYZ)',
        "<strong>03–04 :</strong> Modèles EOQ & Calculateur (Formule de Wilson, aléa portuaire/douanier) & Excellence en Entrepôt (5S)",
        "<strong>05–06 :</strong> Matrice Analytique des KPI (grilles d'alerte rouge) & Économie du Transport / TCO en Afrique",
        "<strong>07–08 :</strong> Grille d'Audit ASCPC en 10 points clés & Études de Cas réels (Douala, Abidjan)"
      ]
    },
    '2': {
      tag: 'MODULE 2 (M2) • ACHETER & DÉDOUANER POUR GAGNER (CEMAC / CEDEAO)',
      title: 'Achats Stratégiques, Transit & Douane, Incoterms 2020 & Assurances',
      desc: "Maîtriser le Coût Total de Détention (TCO), le passage FOB à CIF, la correspondance des régimes douaniers (IM4, IM5, IM8, DAU, BESC/CTN) et les assurances maritimes ICC.",
      pdf: 'assets/programmes/ASCPC-Module-2-Achats-Strategiques-Transit-Douane-Incoterms.pdf',
      pdfLabel: 'Télécharger le PDF du Module 2',
      items: [
        '<strong>01–02 :</strong> Achats Stratégiques & TCO + Incoterms 2020, transfert de risque & valeur en douane',
        '<strong>03–04 :</strong> Calculateur TCO & Douane (FOB à CIF) + Régimes IM4/IM5/IM8, DAU, BESC/CTN & Corridors',
        "<strong>05–06 :</strong> Assurances Maritimes ICC (Clauses A, B, C) & Tableaux de bord Achats/Transit (OTIF, Surestaries)",
        "<strong>07–08 :</strong> Grille d'Audit Achats/Transit (10 axes) & Cas Pratiques Corrigés (Douala, Abidjan, Libreville, Dakar, Pointe-Noire)"
      ]
    },
    '3': {
      tag: 'MODULE 3 (M3) • CONSTRUCTION BUDGÉTAIRE, RENTABILITÉ & SÉCURISATION',
      title: 'Piloter la Performance par les Chiffres : Budget, Finance & Contrôle Interne Logistique',
      desc: "Construire le budget logistique de A à Z (OPEX/CAPEX, ABB), arbitrer entre flotte interne et 3PL, optimiser le BFR et verrouiller le contrôle interne contre la fraude.",
      pdf: 'assets/programmes/ASCPC-Module-3-Budget-Finance-Controle-Interne-Logistique.pdf',
      pdfLabel: 'Télécharger le PDF du Module 3',
      items: [
        '<strong>01–02 :</strong> Construction du Budget Logistique (ABB, OPEX vs CAPEX) & Simulateur Budget Flotte / Point Mort 3PL',
        "<strong>03–04 :</strong> Finance & Rentabilité (PRL, DSI, BFR) & Contrôle Interne (matrice 3-Way Match, lutte fraude carburant)",
        "<strong>05–06 :</strong> Analyse des Écarts Financiers (Volume, Prix, Efficience) & Tableaux de Bord / KPIs Directeurs",
        "<strong>07–08 :</strong> Grille d'Audit Interne & Finance (10 axes) + Cas Corrigés A-Z (Gabon, RCI, Sénégal, Cameroun/RCA, Mali, Congo, Tchad)"
      ]
    },
    '4': {
      tag: 'MODULE 4 (M4) • RÉSEAUX LOGISTIQUES, MULTIMODAL & DOUANES',
      title: 'Optimisation des Réseaux Logistiques, Transport Multimodal & Conformité Douanière',
      desc: "Concevoir un réseau d'entrepôts optimal (méthode du centre de gravité), piloter le transport multimodal (Route-Fer-Fleuve-Air) et sécuriser les procédures SYDONIA.",
      pdf: 'assets/programmes/ASCPC-Module-4-Reseaux-Logistiques-Transport-Multimodal-Douane.pdf',
      pdfLabel: 'Télécharger le PDF du Module 4',
      items: [
        "<strong>01–02 :</strong> Conception de Réseau Logistique & Simulateur du Centre de Gravité / Coûts Corridors",
        "<strong>03–04 :</strong> Transport Multimodal en Afrique (Douala-Bangui/N'Djamena, Abidjan-Bamako) & Douanes SYDONIA",
        "<strong>05–06 :</strong> Analyse Mathématique des Écarts Transport & Tableaux de Bord Réseau (OTIF, Lead Time, Remplissage)",
        "<strong>07–08 :</strong> Grille d'Audit Réseau & Douanes + Cas Réels Corridors Transfrontaliers (Douala, Abidjan, Dakar, Pointe-Noire, Cotonou)"
      ]
    },
    '5': {
      tag: 'MODULE IV AVANCÉ • RÉFÉRENTIEL SCM EXPERT (AFRIQUE CENTRALE & OUEST)',
      title: 'Audit Logistique Complet, Planification, Exécution & Transition Écologique',
      desc: "Maîtriser l'investigation d'audit (SIPOC, Diagramme Spaghetti, traque du coulage), rédiger un Rapport d'Audit DG avec plan cash 30/60/90j, déployer S&OP/MRP et l'écologistique.",
      pdf: 'assets/programmes/ASCPC-Module-5-Audit-Logistique-Complet-Planification-Transition-Ecologique.pdf',
      pdfLabel: 'Télécharger le PDF du Module Avancé (Audit & ESG)',
      items: [
        "<strong>01–03 :</strong> Cadre d'Audit SIPOC, Audit Entrepôt (Diagramme Spaghetti Douala) & Audit Stocks (BFR 200M FCFA Abidjan)",
        "<strong>04–05 :</strong> Audit Flotte (Dakar-Bamako) & Rapport d'Audit Directeur Général (-103M FCFA & plan cash 30/60/90 jours)",
        '<strong>06–07 :</strong> Planification Stratégique (PIC/S&OP, PDP/MPS, CBN/MRP, DRP, VMI) & Exécution WMS/TMS/Kanban',
        "<strong>08–09 :</strong> Diagnostic VSM & Projets ERP (Bamako) + Écologistique, Empreinte CO₂, Reverse Logistics (N'Djamena) & ESG"
      ]
    }
  };

  const curriculumTabs = document.querySelectorAll('.curriculum-tab');
  const modTag = document.getElementById('mod-tag');
  const modTitle = document.getElementById('mod-title');
  const modDesc = document.getElementById('mod-desc');
  const modList = document.getElementById('mod-list');
  const modPdfLink = document.getElementById('mod-pdf-link');
  const modPdfLabel = document.getElementById('mod-pdf-label');

  curriculumTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const modId = tab.getAttribute('data-module') || '1';
      const data = curriculumData[modId];
      if (!data) return;

      curriculumTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      if (modTag) modTag.textContent = data.tag;
      if (modTitle) modTitle.textContent = data.title;
      if (modDesc) modDesc.textContent = data.desc;
      if (modList) {
        modList.innerHTML = data.items.map((item) => `<li>${item}</li>`).join('');
      }
      if (modPdfLink) {
        modPdfLink.setAttribute('href', data.pdf);
      }
      if (modPdfLabel) {
        modPdfLabel.textContent = data.pdfLabel;
      }
    });
  });

  // Pack Download of all 5 PDFs
  const downloadAllPdfsBtn = document.getElementById('download-all-pdfs-btn');
  if (downloadAllPdfsBtn) {
    downloadAllPdfsBtn.addEventListener('click', () => {
      const pdfFiles = [
        'assets/programmes/ASCPC-Module-1-Gouvernance-Pilotage-Supply-Chain.pdf',
        'assets/programmes/ASCPC-Module-2-Achats-Strategiques-Transit-Douane-Incoterms.pdf',
        'assets/programmes/ASCPC-Module-3-Budget-Finance-Controle-Interne-Logistique.pdf',
        'assets/programmes/ASCPC-Module-4-Reseaux-Logistiques-Transport-Multimodal-Douane.pdf',
        'assets/programmes/ASCPC-Module-5-Audit-Logistique-Complet-Planification-Transition-Ecologique.pdf'
      ];
      pdfFiles.forEach((fileUrl, idx) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileUrl.split('/').pop() || `ASCPC-Module-${idx + 1}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, idx * 350);
      });
    });
  }

  /* ==========================================================================
     5. INTERACTIVE TEAM CAROUSEL (SLIDING BLOCK)
     ========================================================================== */
  const teamViewport = document.getElementById('team-carousel-viewport');
  const teamPrevBtn = document.getElementById('team-prev-btn');
  const teamNextBtn = document.getElementById('team-next-btn');
  const teamDots = document.querySelectorAll('.team-dot');

  if (teamViewport) {
    const getScrollStep = () => {
      const card = teamViewport.querySelector('.team-card');
      return card ? card.offsetWidth + 24 : 360;
    };

    if (teamPrevBtn) {
      teamPrevBtn.addEventListener('click', () => {
        teamViewport.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
    }

    if (teamNextBtn) {
      teamNextBtn.addEventListener('click', () => {
        teamViewport.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });
    }

    teamDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide') || '0', 10);
        teamViewport.scrollTo({ left: idx * getScrollStep(), behavior: 'smooth' });
      });
    });

    teamViewport.addEventListener(
      'scroll',
      () => {
        const maxScroll = teamViewport.scrollWidth - teamViewport.clientWidth;
        if (maxScroll <= 0) return;
        const progress = teamViewport.scrollLeft / maxScroll;
        const activeDotIndex = Math.min(
          teamDots.length - 1,
          Math.round(progress * (teamDots.length - 1))
        );
        teamDots.forEach((d, idx) => {
          d.classList.toggle('is-active', idx === activeDotIndex);
        });
      },
      { passive: true }
    );

    // Mouse Drag-to-Scroll Support
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    teamViewport.addEventListener('mousedown', (e) => {
      isDown = true;
      teamViewport.classList.add('is-dragging');
      startX = e.pageX - teamViewport.offsetLeft;
      scrollLeftStart = teamViewport.scrollLeft;
    });

    const stopDragging = () => {
      isDown = false;
      teamViewport.classList.remove('is-dragging');
    };

    teamViewport.addEventListener('mouseleave', stopDragging);
    teamViewport.addEventListener('mouseup', stopDragging);

    teamViewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - teamViewport.offsetLeft;
      const walk = (x - startX) * 1.4;
      teamViewport.scrollLeft = scrollLeftStart - walk;
    });
  }

  /* ==========================================================================
     6. DUAL CONVERSION TRACK SWITCHER (B2B vs B2C)
     ========================================================================== */
  const tabBtnB2B = document.getElementById('tab-btn-b2b');
  const tabBtnB2C = document.getElementById('tab-btn-b2c');
  const panelB2B = document.getElementById('panel-b2b');
  const panelB2C = document.getElementById('panel-b2c');
  const confirmationBox = document.getElementById('form-confirmation');

  const switchConversionTrack = (track) => {
    if (!tabBtnB2B || !tabBtnB2C || !panelB2B || !panelB2C) return;

    if (confirmationBox) confirmationBox.hidden = true;

    if (track === 'b2c') {
      tabBtnB2B.classList.remove('is-active');
      tabBtnB2B.setAttribute('aria-selected', 'false');
      tabBtnB2C.classList.add('is-active');
      tabBtnB2C.setAttribute('aria-selected', 'true');

      panelB2B.hidden = true;
      panelB2B.classList.remove('is-active');
      panelB2C.hidden = false;
      panelB2C.classList.add('is-active');
    } else {
      tabBtnB2C.classList.remove('is-active');
      tabBtnB2C.setAttribute('aria-selected', 'false');
      tabBtnB2B.classList.add('is-active');
      tabBtnB2B.setAttribute('aria-selected', 'true');

      panelB2C.hidden = true;
      panelB2C.classList.remove('is-active');
      panelB2B.hidden = false;
      panelB2B.classList.add('is-active');
    }
  };

  if (tabBtnB2B) tabBtnB2B.addEventListener('click', () => switchConversionTrack('b2b'));
  if (tabBtnB2C) tabBtnB2C.addEventListener('click', () => switchConversionTrack('b2c'));

  document.querySelectorAll('[data-switch-track]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetTrack = trigger.getAttribute('data-switch-track');
      if (targetTrack) {
        switchConversionTrack(targetTrack);
      }
    });
  });

  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      switchConversionTrack('b2b');
      const score = scoreEl ? scoreEl.textContent : '48';
      const priority = priorityFocusEl ? priorityFocusEl.textContent : '';
      const savings = savingsRangeEl ? savingsRangeEl.textContent : '';
      const msgField = document.getElementById('b2b-message');

      if (msgField) {
        msgField.value =
          `[Pré-Diagnostic SCOR ASCPC : Indice de maturité ${score}/100 | Gisement estimé : ${savings}]\n` +
          `Priorités identifiées : ${priority}.\n` +
          `Nous souhaitons échanger avec un consultant ASCPC pour cadrer un audit de performance chiffré.`;
      }

      const conversionSection = document.getElementById('parcours-conversion');
      if (conversionSection) {
        conversionSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ==========================================================================
     7. FORM SUBMISSIONS (B2B & B2C) + EXECUTIVE SUMMARY & MEMORANDUM
     ========================================================================== */
  const formB2B = document.getElementById('form-b2b');
  const formB2C = document.getElementById('form-b2c');
  const confTitle = document.getElementById('conf-title');
  const confDesc = document.getElementById('conf-desc');
  const confSummary = document.getElementById('conf-summary');
  const confMailtoBtn = document.getElementById('conf-mailto-btn');
  const confCopyBtn = document.getElementById('conf-copy-btn');
  const confResetBtn = document.getElementById('conf-reset-btn');

  let activeTrack = 'b2b';

  const showConfirmation = (track, subject, bodyText, titleText, descText) => {
    activeTrack = track;
    if (panelB2B) panelB2B.hidden = true;
    if (panelB2C) panelB2C.hidden = true;
    if (!confirmationBox) return;

    confirmationBox.hidden = false;
    if (confTitle) confTitle.textContent = titleText;
    if (confDesc) confDesc.textContent = descText;
    if (confSummary) confSummary.textContent = bodyText;

    if (confMailtoBtn) {
      const mailtoUrl = `mailto:africasupplychainperformanceco@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      confMailtoBtn.setAttribute('href', mailtoUrl);
    }

    confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (formB2B) {
    formB2B.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formB2B.checkValidity()) {
        formB2B.reportValidity();
        return;
      }

      const formData = new FormData(formB2B);
      const company = formData.get('company');
      const sector = formData.get('sector');
      const name = formData.get('name');
      const region = formData.get('region');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const scopes = formData.getAll('scopes').join(', ') || 'Audit global SCOR & Lean Logistics';
      const message = formData.get('message') || 'Demande de cadrage méthodologique.';

      const summary = [
        '==========================================================',
        'DEMANDE D’AUDIT & CONSEIL B2B — ASCPC SARL (DOUALA)',
        '==========================================================',
        `Entreprise         : ${company}`,
        `Secteur d'activité : ${sector}`,
        `Décideur / Contact : ${name}`,
        `Zone d'intervention: ${region}`,
        `Email professionnel: ${email}`,
        `Téléphone / Direct : ${phone}`,
        `Périmètres ciblés  : ${scopes}`,
        '----------------------------------------------------------',
        'CONTEXTE & OBJECTIFS :',
        `${message}`,
        '=========================================================='
      ].join('\n');

      showConfirmation(
        'b2b',
        `[ASCPC B2B] Demande d'Audit & Conseil — ${company}`,
        summary,
        `Dossier B2B structuré pour ${company}`,
        "Votre cahier de liaison est prêt. Vous pouvez l'envoyer directement à la direction d'ASCPC SARL ou copier ce récapitulatif officiel."
      );
    });
  }

  if (formB2C) {
    formB2C.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formB2C.checkValidity()) {
        formB2C.reportValidity();
        return;
      }

      const formData = new FormData(formB2C);
      const name = formData.get('name');
      const role = formData.get('role');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const format = formData.get('format');
      const funding = formData.get('funding');
      const goal = formData.get('goal') || 'Candidature au Programme Expert 20 Jours (70% Pratique / 30% Méthode).';

      const summary = [
        '==========================================================',
        'CANDIDATURE ACADÉMIE B2C — PROGRAMME EXPERT 20 JOURS ASCPC',
        '==========================================================',
        `Candidat(e)        : ${name}`,
        `Poste / Profil     : ${role}`,
        `Email              : ${email}`,
        `Téléphone/WhatsApp : ${phone}`,
        `Format choisi      : ${format}`,
        `Financement        : ${funding}`,
        `Inclus             : Coaching individuel post-formation & Réseau Alumni`,
        '----------------------------------------------------------',
        'OBJECTIFS PROFESSIONNELS :',
        `${goal}`,
        '=========================================================='
      ].join('\n');

      showConfirmation(
        'b2c',
        `[ASCPC Académie 20 Jours] Candidature — ${name}`,
        summary,
        `Candidature enregistrée pour ${name}`,
        "Votre dossier de pré-inscription au Programme Expert de 20 jours est prêt. Transmettez-le en un clic à notre équipe pédagogique."
      );
    });
  }

  if (confCopyBtn && confSummary) {
    confCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(confSummary.textContent || '');
        const originalText = confCopyBtn.textContent;
        confCopyBtn.textContent = '✓ Récapitulatif copié !';
        setTimeout(() => {
          confCopyBtn.textContent = originalText;
        }, 2500);
      } catch {
        // Fallback
      }
    });
  }

  if (confResetBtn) {
    confResetBtn.addEventListener('click', () => {
      switchConversionTrack(activeTrack);
    });
  }

  /* ==========================================================================
     8. DOWNLOADABLE EXECUTIVE MEMORANDUM (.TXT)
     ========================================================================== */
  const downloadMemoBtn = document.getElementById('download-memo-btn');
  if (downloadMemoBtn) {
    downloadMemoBtn.addEventListener('click', () => {
      const memoContent = [
        '========================================================================',
        'AFRICA SUPPLY CHAIN PERFORMANCE CONSULTING SARL (ASCPC)',
        '« L’Excellence Opérationnelle au Service de la Performance Supply Chain en Afrique »',
        '========================================================================',
        '',
        '1. PRÉSENTATION DU CABINET',
        '--------------------------',
        'Siège social      : Douala, Cameroun',
        'Fondateur & Gérant: François SII MATIP',
        'Zones couvertes   : Afrique Centrale, Zone CEMAC & Afrique de l’Ouest',
        'Mission           : Améliorer la performance des organisations grâce à la maîtrise',
        '                    des flux logistiques, à l’optimisation des coûts et au',
        '                    développement des compétences.',
        '',
        '2. PÔLE ENTREPRISES (B2B) — CONSEIL & AUDIT DE PERFORMANCE',
        '----------------------------------------------------------',
        '• Audit et diagnostic de performance Supply Chain (Approches SCOR & Lean Logistics)',
        '• Optimisation des coûts logistiques et opérationnels (Livrables concrets & chiffrés)',
        '• Analyse des stocks, transports, entrepôts, transit et douane',
        '• Accompagnement stratégique et plans de transformation',
        '• Modélisation décisionnelle et tableaux de bord (KPI, S&OP)',
        '',
        '3. PÔLE PROFESSIONNELS (B2C) — FORMATION CERTIFIANTE',
        '----------------------------------------------------',
        '• Programme Expert de 20 jours (Certifiant)',
        '• Pédagogie Learning by Doing : 70 % de pratique et 30 % d’apports méthodologiques',
        '• Format Executive Evening & Weekend (adapté aux professionnels en activité)',
        '• Coaching individuel post-formation et intégration au Réseau Alumni ASCPC',
        '',
        '4. NOS 4 PILIERS & ENGAGEMENTS',
        '------------------------------',
        'I.   Excellence et pragmatisme (Solutions applicables sur le terrain)',
        'II.  Intégrité et transparence (Résultats mesurables)',
        'III. Rigueur et conformité (Qualité des livrables)',
        'IV.  Confidentialité absolue (Accompagnement sur mesure)',
        '',
        'Contact : contact@ascpc-consulting.com | Douala, Cameroun',
        '========================================================================'
      ].join('\n');

      const blob = new Blob([memoContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Memorandum-Executif-ASCPC-SARL.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /* ==========================================================================
     9. SCROLL REVEAL OBSERVER & DYNAMIC YEAR
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
