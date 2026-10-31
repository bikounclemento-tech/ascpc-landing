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
      deliverable: 'Calibrage ABC/XYZ, réduction des stocks dormants & ruptures',
      checkboxVal: 'Gestion des Stocks & Entrepôts'
    },
    transport: {
      name: 'Transport, Flotte & Distribution',
      deliverable: 'Optimisation du coût au km, schémas de tournées & contrats transporteurs',
      checkboxVal: 'Transport & Distribution'
    },
    customs: {
      name: 'Transit, Douane & Opérations Portuaires',
      deliverable: 'Réduction des surestaries, fluidité documentaire & conformité CEMAC',
      checkboxVal: 'Transit, Douane & Opérations Portuaires'
    },
    warehouse: {
      name: 'Entreposage & Manutention Lean',
      deliverable: 'Réimplantation (slotting), 5S, productivité & fiabilité d’inventaire',
      checkboxVal: 'Gestion des Stocks & Entrepôts'
    },
    kpi: {
      name: 'Modélisation Décisionnelle & Tableaux de Bord',
      deliverable: 'Cockpit KPI exécutif (OTIF, TCO, rotation) & rituel S&OP',
      checkboxVal: 'Modélisation & Tableaux de bord KPI'
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

    const sum = vals.stock + vals.transport + vals.customs + vals.warehouse + vals.kpi; // 5 to 25
    const score100 = Math.round((sum / 25) * 100);

    if (scoreEl) scoreEl.textContent = String(score100);

    // Find lowest scoring domain(s)
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
     4. INTERACTIVE 20-DAY EXPERT PROGRAM CURRICULUM EXPLORER (B2C)
     ========================================================================== */
  const curriculumData = {
    '1': {
      tag: 'BLOC 01 • JOURS 01 À 05 (5 JOURS)',
      title: "Architecture Supply Chain, Planification S&OP & Stratégie d'Approvisionnement",
      desc: "Maîtriser la chaîne de valeur globale, structurer le processus Sales & Operations Planning (PIC/PDP), sécuriser le sourcing international et optimiser les contrats fournisseurs.",
      items: [
        "Construction complète d'un plan directeur S&OP et modèle de prévision de la demande",
        "Matrice d'évaluation fournisseurs, calcul du TCO d'achat et négociation logistique",
        "Étude de cas réel : fiabilisation des approvisionnements industriels en zone CEMAC"
      ]
    },
    '2': {
      tag: 'BLOC 02 • JOURS 06 À 10 (5 JOURS)',
      title: "Ingénierie des Stocks, Gestion des Entrepôts (WMS) & Lean Logistics",
      desc: "Optimiser le fonds de roulement par une gestion scientifique des stocks et transformer la productivité des entrepôts grâce aux outils Lean Logistics.",
      items: [
        "Paramétrage des stocks de sécurité, point de commande et segmentation ABC/XYZ sous Excel",
        "Audit d'entrepôt : adressage (slotting), réduction des déplacements, 5S et fiabilité d'inventaire",
        "Simulation terrain : élimination des 8 gaspillages logistiques (Muda) et réduction des coûts de stockage"
      ]
    },
    '3': {
      tag: 'BLOC 03 • JOURS 11 À 15 (5 JOURS)',
      title: "Gestion des Transports, Opérations Portuaires, Transit & Douane",
      desc: "Maîtriser les opérations d'import/export, les Incoterms 2020, le dédouanement en Afrique centrale et de l'Ouest, et la rentabilité des flottes de transport.",
      items: [
        "Dossiers pratiques de transit et dédouanement : maîtrise des délais portuaires et élimination des surestaries",
        "Dimensionnement de flotte, calcul du coût de revient kilométrique et gestion de la sous-traitance transport",
        "Sécurisation des corridors régionaux (Douala–N'Djamena, Douala–Bangui, corridors ouest-africains)"
      ]
    },
    '4': {
      tag: 'BLOC 04 • JOURS 16 À 20 (5 JOURS)',
      title: "Audit SCOR, Modélisation Décisionnelle, Tableaux de Bord & Soutenance",
      desc: "Concevoir des tableaux de bord exécutifs, conduire un diagnostic SCOR de bout en bout et présenter un plan de transformation chiffré devant le jury ASCPC.",
      items: [
        "Création d'un cockpit de pilotage Supply Chain (OTIF, Taux de service, Rotation, Coût logistique / CA)",
        "Méthodologie complète d'audit SCOR (Plan, Source, Make, Deliver, Return, Enable)",
        "Projet final d'application professionnelle + lancement du Coaching Individuel Post-Formation"
      ]
    }
  };

  const curriculumTabs = document.querySelectorAll('.curriculum-tab');
  const modTag = document.getElementById('mod-tag');
  const modTitle = document.getElementById('mod-title');
  const modDesc = document.getElementById('mod-desc');
  const modList = document.getElementById('mod-list');

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
    });
  });

  /* ==========================================================================
     5. DUAL CONVERSION TRACK SWITCHER (B2B vs B2C)
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

  // Any link/button with [data-switch-track] switches to the right form
  document.querySelectorAll('[data-switch-track]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetTrack = trigger.getAttribute('data-switch-track');
      if (targetTrack) {
        switchConversionTrack(targetTrack);
      }
    });
  });

  // Transfer Simulator Diagnostic into B2B Form
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
     6. FORM SUBMISSIONS (B2B & B2C) + EXECUTIVE SUMMARY & MEMORANDUM
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
      const mailtoUrl = `mailto:contact@ascpc-consulting.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
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
        // Fallback selection
      }
    });
  }

  if (confResetBtn) {
    confResetBtn.addEventListener('click', () => {
      switchConversionTrack(activeTrack);
    });
  }

  /* ==========================================================================
     7. DOWNLOADABLE EXECUTIVE MEMORANDUM (.TXT)
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
     8. SCROLL REVEAL OBSERVER & DYNAMIC YEAR
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
      { threshold: 0.12 }
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

