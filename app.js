document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. Theme Switcher Logic
     ========================================================================== */
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || 'light';
  
  htmlElement.setAttribute('data-theme', initialTheme);
  
  if(themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.classList.add('theme-transitioning');
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      setTimeout(() => {
        htmlElement.classList.remove('theme-transitioning');
      }, 800);
    });
  }

  /* ==========================================================================
     2. Preloader Logic (Optimize Edildi - Gerçek Yüklemeye Duyarlı)
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const percentText = document.getElementById('preloader-percent');
  const appWrapper = document.getElementById('app-wrapper');
  const preloaderBird = document.getElementById('preloader-bird');
  
  let currentPercent = 0;
  let isLoaded = false;

  window.addEventListener('load', () => {
    isLoaded = true;
  });
  
  const updatePreloader = () => {
    // Sayfa yüklendiyse yapay beklemeyi tamamen atla ve doğrudan kapat
    if (isLoaded) {
      currentPercent = 100;
    } else {
      currentPercent += 2; // Daha hızlı artsın
    }
    
    if (currentPercent > 100) currentPercent = 100;
    
    if (percentText) percentText.textContent = currentPercent.toString().padStart(2, '0');
    
    if (preloaderBird) {
      preloaderBird.style.opacity = (currentPercent / 100).toString();
    }
    
    if (currentPercent < 100) {
      // Yüklenmemişse standart animasyon döngüsü (requestAnimationFrame ile daha performanslı)
      requestAnimationFrame(() => setTimeout(updatePreloader, 10));
    } else {
      // Yüzde 100 olunca yapay gecikme olmadan hemen kaldır
      if(preloader) {
        preloader.style.opacity = '0';
        preloader.style.transform = 'translateY(-100%)';
        setTimeout(() => { preloader.style.display = 'none'; }, 300); // Sadece CSS transition süresi kadar bekle
      }
      if(appWrapper) {
        appWrapper.style.visibility = 'visible';
        appWrapper.style.opacity = '1';
      }
    }
  };
  
  if (preloader) updatePreloader();

  /* ==========================================================================
     3. Global 4-City World Clocks Widget (Bellek Sızıntısı Giderildi)
     ========================================================================== */
  const clockElements = {
    IST: document.getElementById('time-ist'),
    LON: document.getElementById('time-lon'),
    NYC: document.getElementById('time-nyc'),
    TYO: document.getElementById('time-tyo')
  };
  
  const timezones = {
    IST: { zone: 'Europe/Istanbul', el: clockElements.IST },
    LON: { zone: 'Europe/London', el: clockElements.LON },
    NYC: { zone: 'America/New_York', el: clockElements.NYC },
    TYO: { zone: 'Asia/Tokyo', el: clockElements.TYO }
  };

  // Formatter'lar döngü dışında bir kez yaratılır
  const formatters = {};
  Object.keys(timezones).forEach(key => {
    formatters[key] = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezones[key].zone,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  });
  
  const updateClocks = () => {
    const now = new Date();
    Object.keys(timezones).forEach(key => {
      if (timezones[key].el) {
        timezones[key].el.textContent = formatters[key].format(now);
      }
    });
  };
  
  updateClocks();
  setInterval(updateClocks, 1000);

  /* ==========================================================================
     4. Navigation Drawer & Manifesto Drawer Controls
     ========================================================================== */
  const menuTrigger = document.getElementById('menu-trigger');
  const menuDrawer = document.getElementById('menu-drawer');
  const menuTextOpen = document.querySelector('.menu-text-open');
  const menuTextClose = document.querySelector('.menu-text-close');
  
  const manifestoDrawer = document.getElementById('manifesto-drawer');
  const manifestoClose = document.getElementById('manifesto-close');
  const aboutBtnTr = document.getElementById('about-btn-tr');
  const aboutBtnEn = document.getElementById('about-btn-en');
  const aboutLink = document.querySelector('[data-action="about"]');
  const scrollGalleryLink = document.querySelector('[data-action="scroll-gallery"]');
  
  const termsDrawer = document.getElementById('terms-drawer');
  const termsClose = document.getElementById('terms-close');
  const termsTriggers = document.querySelectorAll('.js-terms-trigger');
  
  const privacyDrawer = document.getElementById('privacy-drawer');
  const privacyClose = document.getElementById('privacy-close');
  const privacyTriggers = document.querySelectorAll('.js-privacy-trigger');
  
  const navW = document.querySelector('.nav-w');

  if(menuTrigger) {
    menuTrigger.addEventListener('click', () => {
      const isOpen = menuDrawer.classList.toggle('open');
      navW.classList.toggle('menu-active', isOpen);
      menuTextOpen.style.display = isOpen ? 'none' : 'block';
      menuTextClose.style.display = isOpen ? 'block' : 'none';
    });
  }
  
  const openManifesto = () => {
    if(manifestoDrawer) manifestoDrawer.classList.add('open');
    if(menuDrawer) menuDrawer.classList.remove('open');
    if(navW) navW.classList.remove('menu-active');
    if(menuTextOpen) menuTextOpen.style.display = 'block';
    if(menuTextClose) menuTextClose.style.display = 'none';
  };

  const openTerms = () => {
    if(termsDrawer) termsDrawer.classList.add('open');
    if(menuDrawer) menuDrawer.classList.remove('open');
    if(navW) navW.classList.remove('menu-active');
    if(menuTextOpen) menuTextOpen.style.display = 'block';
    if(menuTextClose) menuTextClose.style.display = 'none';
  };

  const openPrivacy = () => {
    if(privacyDrawer) privacyDrawer.classList.add('open');
    if(menuDrawer) menuDrawer.classList.remove('open');
    if(navW) navW.classList.remove('menu-active');
    if(menuTextOpen) menuTextOpen.style.display = 'block';
    if(menuTextClose) menuTextClose.style.display = 'none';
  };
  
  if(aboutBtnTr) aboutBtnTr.addEventListener('click', openManifesto);
  if(aboutBtnEn) aboutBtnEn.addEventListener('click', openManifesto);
  if(aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      openManifesto();
    });
  }
  
  if(manifestoClose) {
    manifestoClose.addEventListener('click', () => {
      manifestoDrawer.classList.remove('open');
    });
  }

  termsTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openTerms();
    });
  });

  if(termsClose) {
    termsClose.addEventListener('click', () => {
      termsDrawer.classList.remove('open');
    });
  }

  privacyTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openPrivacy();
    });
  });

  if(privacyClose) {
    privacyClose.addEventListener('click', () => {
      privacyDrawer.classList.remove('open');
    });
  }

  // Close manifesto, terms, or privacy when clicking outside the drawer
  document.addEventListener('click', (e) => {
    if (manifestoDrawer && manifestoDrawer.classList.contains('open')) {
      const clickedInside = manifestoDrawer.contains(e.target);
      const clickedTrigger = (aboutBtnTr && aboutBtnTr.contains(e.target)) ||
                             (aboutBtnEn && aboutBtnEn.contains(e.target)) ||
                             (aboutLink && aboutLink.contains(e.target));
      if (!clickedInside && !clickedTrigger) {
        manifestoDrawer.classList.remove('open');
      }
    }
    if (termsDrawer && termsDrawer.classList.contains('open')) {
      const clickedInside = termsDrawer.contains(e.target);
      let clickedTrigger = false;
      termsTriggers.forEach(trig => {
        if (trig.contains(e.target)) clickedTrigger = true;
      });
      if (!clickedInside && !clickedTrigger) {
        termsDrawer.classList.remove('open');
      }
    }
    if (privacyDrawer && privacyDrawer.classList.contains('open')) {
      const clickedInside = privacyDrawer.contains(e.target);
      let clickedTrigger = false;
      privacyTriggers.forEach(trig => {
        if (trig.contains(e.target)) clickedTrigger = true;
      });
      if (!clickedInside && !clickedTrigger) {
        privacyDrawer.classList.remove('open');
      }
    }
  });

  if(scrollGalleryLink) {
    scrollGalleryLink.addEventListener('click', () => {
      if(menuDrawer) menuDrawer.classList.remove('open');
      if(navW) navW.classList.remove('menu-active');
      if(menuTextOpen) menuTextOpen.style.display = 'block';
      if(menuTextClose) menuTextClose.style.display = 'none';
    });
  }

  /* ==========================================================================
     5. 14-Step Presentation Deck & Video Player Logic
     ========================================================================== */
  const stepsData = {
    1: { 
      titleTr: 'Giriş ve Vizyon', 
      titleEn: 'Introduction and Vision', 
      phase: 'workflows', 
      phaseTagTr: 'Otonom Süreçler', 
      phaseTagEn: 'Autonomous Processes', 
      tagClass: 'red-tag', 
      descTr: 'Şirketlerin verimsiz manuel operasyonlardan akıllı, otonom iş akışlarına geçiş vizyonunun incelenmesi.',
      descEn: 'We explore the vision of companies transitioning from inefficient manual operations to smart, autonomous workflows.',
      detailsTr: [
        "Manuel süreçlerin adım adım otonom sistemlere evrimi",
        "İnsan ve yapay zeka ajanlarının hibrid iş birliği modeli",
        "7/24 kesintisiz, dinamik ve ölçeklenebilir operasyon altyapısı"
      ],
      detailsEn: [
        "Step-by-step evolution of manual tasks into autonomous workflows",
        "Hybrid collaboration model between humans and intelligent AI agents",
        "24/7 continuous, dynamic, and scalable operational infrastructure"
      ]
    },
    2: { 
      titleTr: 'Geleneksel SOP Analizi', 
      titleEn: 'Traditional SOP Analysis', 
      phase: 'workflows', 
      phaseTagTr: 'Otonom Süreçler', 
      phaseTagEn: 'Autonomous Processes', 
      tagClass: 'red-tag', 
      descTr: 'Mevcut standart operasyon prosedürlerinin (SOP) analizi yapılarak hangi süreçlerin yapay zekaya devredilebileceğinin tespit edilmesi.',
      descEn: 'By analyzing existing standard operating procedures (SOPs), we identify which processes can be delegated to artificial intelligence.',
      detailsTr: [
        "Mevcut departman SOP dokümanlarının derinlemesine taranması",
        "Tekrarlayan adımların ve bilişsel sürtünme noktalarının tespiti",
        "Detaylı otonomizasyon uygunluk ve fizibilite raporlaması"
      ],
      detailsEn: [
        "In-depth scanning of existing departmental SOP documentation",
        "Mapping repetitive steps and key cognitive friction points",
        "Detailed automation feasibility scoring and ROI analysis"
      ]
    },
    3: { 
      titleTr: 'Otonom Modelleme', 
      titleEn: 'Autonomous Modeling', 
      phase: 'workflows', 
      phaseTagTr: 'Otonom Süreçler', 
      phaseTagEn: 'Autonomous Processes', 
      tagClass: 'red-tag', 
      descTr: 'Süreçlerin, yapay zeka ajanlarının anlayabileceği mantıksal karar ağaçlarına ve akış şemalarına dönüştürülmesi aşaması.',
      descEn: 'The phase of converting processes into logical decision trees and flowcharts that AI agents can comprehend.',
      detailsTr: [
        "İş adımlarının mantıksal karar ağaçlarına (Decision Trees) dökülmesi",
        "İstisnai durumlar ve beklenmedik senaryo yollarının tasarımı",
        "Ajanlar için gerekli bilişsel yetenek setlerinin tanımlanması"
      ],
      detailsEn: [
        "Mapping workflow steps into structured decision trees",
        "Designing logic gates for exception handling and edge cases",
        "Defining the required cognitive skillsets for each automated agent"
      ]
    },
    4: { 
      titleTr: 'İş Akışı Optimizasyonu', 
      titleEn: 'Workflow Optimization', 
      phase: 'workflows', 
      phaseTagTr: 'Otonom Süreçler', 
      phaseTagEn: 'Autonomous Processes', 
      tagClass: 'red-tag', 
      descTr: 'Akışların simüle edilmesi, darboğazların tespiti ve en yüksek hız için süreç optimizasyon parametrelerinin ayarlanması.',
      descEn: 'Simulation of workflows, detection of bottlenecks, and adjustment of process optimization parameters for maximum speed.',
      detailsTr: [
        "Süreçlerdeki hantal ve gereksiz onay adımlarının elenmesi",
        "İş akışının simüle edilerek olası tıkanıklıkların çözülmesi",
        "Maksimum işlem hızı için paralel görev akışlarının kurgulanması"
      ],
      detailsEn: [
        "Eliminating redundant and slow manual approval steps",
        "Simulating processes to identify and resolve throughput issues",
        "Structuring parallel task execution for maximum operational speed"
      ]
    },
    5: { 
      titleTr: 'Yapay Zeka Ajan Seçimi', 
      titleEn: 'AI Agent Selection', 
      phase: 'agents', 
      phaseTagTr: 'Yapay Zeka Ajanları', 
      phaseTagEn: 'AI Agents', 
      tagClass: 'green-tag', 
      descTr: 'Departman bazlı ihtiyaçlar için en uygun bilişsel yeteneklere sahip akıllı yapay zeka ajan modellerinin belirlenmesi.',
      descEn: 'Determination of the intelligent AI agent models with the most suitable cognitive capabilities for department-based needs.',
      detailsTr: [
        "Göreve özel LLM / LMM model mimarilerinin belirlenmesi",
        "İşlem hızı, maliyet ve doğruluk dengesinin kurulması",
        "Gelişmiş bilgi tabanı (RAG) yeteneğine sahip ajanların seçimi"
      ],
      detailsEn: [
        "Selecting task-specific LLM / LMM model architectures",
        "Balancing execution speed, API costs, and precision metrics",
        "Choosing agents with advanced retrieval-augmented generation (RAG)"
      ]
    },
    6: { 
      titleTr: 'Bilişsel Görev Dağılımı', 
      titleEn: 'Cognitive Task Allocation', 
      phase: 'agents', 
      phaseTagTr: 'Yapay Zeka Ajanları', 
      phaseTagEn: 'AI Agents', 
      tagClass: 'green-tag', 
      descTr: 'Belirli süreç sorumluluklarının ilgili yapay zeka asistanlarına atanması ve karar yetki sınırlarının tanımlanması.',
      descEn: 'Assignment of specific process responsibilities to relevant AI assistants and definition of decision-making authority boundaries.',
      detailsTr: [
        "Karmaşık işlerin otonom alt görevlere (sub-tasks) bölünmesi",
        "Ajanların yetki, karar ve eylem sınırlarının netleştirilmesi",
        "Veri erişim seviyeleri ve rol tanımlarının yapılması"
      ],
      detailsEn: [
        "Deconstructing complex goals into modular, actionable sub-tasks",
        "Defining clear agent authorization and decision boundaries",
        "Assigning explicit data access levels and role definitions"
      ]
    },
    7: { 
      titleTr: 'Ajanlar Arası İletişim', 
      titleEn: 'Inter-Agent Communication', 
      phase: 'agents', 
      phaseTagTr: 'Yapay Zeka Ajanları', 
      phaseTagEn: 'AI Agents', 
      tagClass: 'green-tag', 
      descTr: 'Farklı otonom ajanların birbiriyle veri paylaşabilmesi ve ortaklaşa iş yürütebilmesi için iletişim protokollerinin kurulması.',
      descEn: 'Establishing communication protocols for different autonomous agents to share data and collaborate on tasks.',
      detailsTr: [
        "Çoklu ajan (Multi-agent) iş birliği protokollerinin kurulması",
        "Ajanlar arası ortak hafıza (Shared Memory) yapısının entegrasyonu",
        "Standart veri formatı ile güvenli ve hızlı veri transferi"
      ],
      detailsEn: [
        "Establishing collaborative multi-agent communication protocols",
        "Integrating shared memory systems for historical context retention",
        "Standardizing data formats for secure, rapid inter-agent transfer"
      ]
    },
    8: { 
      titleTr: 'İş Gücü Entegrasyonu', 
      titleEn: 'Workforce Integration', 
      phase: 'agents', 
      phaseTagTr: 'Yapay Zeka Ajanları', 
      phaseTagEn: 'AI Agents', 
      tagClass: 'green-tag', 
      descTr: 'Otonom yapay zeka ajan iş gücü ile insan çalışanlar arasındaki onay mekanizmalarının ve ortak çalışma arayüzlerinin entegre edilmesi.',
      descEn: 'Integration of approval mechanisms and collaboration interfaces between the autonomous AI agent workforce and human employees.',
      detailsTr: [
        "İnsan-etkileşimli (Human-in-the-loop) ara onay ekranları",
        "Kritik ve yüksek riskli işlemler için insan denetimi (Oversight)",
        "Ekiplerin ajan performanslarını izleyeceği kontrol paneli"
      ],
      detailsEn: [
        "Integrating intuitive Human-in-the-loop (HITL) approval interfaces",
        "Enforcing human oversight locks on high-risk transaction thresholds",
        "Deploying tracking dashboards for staff to monitor agent queues"
      ]
    },
    9: { 
      titleTr: 'API ve Bağlantı Altyapısı', 
      titleEn: 'API & Connectivity Infrastructure', 
      phase: 'integration', 
      phaseTagTr: 'Süreç Entegrasyonu', 
      phaseTagEn: 'Process Integration', 
      tagClass: 'blue-tag', 
      descTr: 'Ajanların kurumsal yazılımlara erişebilmesi için gerekli güvenli API bağlantı katmanlarının oluşturulması.',
      descEn: 'Creation of the secure API connection layers required for agents to access corporate software.',
      detailsTr: [
        "Kurumsal ERP, CRM ve özel yazılım API entegrasyonları",
        "Güvenli token, kimlik doğrulama ve API anahtarı yönetimi",
        "Yüksek hızlı RESTful ve GraphQL veri iletişim katmanı"
      ],
      detailsEn: [
        "Integrating enterprise ERP, CRM, and bespoke system APIs",
        "Enforcing secure token validation and active credential rotation",
        "Building low-latency RESTful and GraphQL data pipe layers"
      ]
    },
    10: { 
      titleTr: 'Veri Ambarı Entegrasyonu', 
      titleEn: 'Data Warehouse Integration', 
      phase: 'integration', 
      phaseTagTr: 'Süreç Entegrasyonu', 
      phaseTagEn: 'Process Integration', 
      tagClass: 'blue-tag', 
      descTr: 'Şirket içi veri ambarları ve bulut veritabanlarının, otonom ajanların anlık sorgular yapabilmesi için güvenli bir şekilde bağlanması.',
      descEn: 'Secure connection of internal data warehouses and cloud databases for autonomous agents to perform real-time queries.',
      detailsTr: [
        "Veri ambarlarına (DWH) güvenli okuma ve yazma yetkisi",
        "Vektör veritabanları (Vector DB) ile anlamsal veri entegrasyonu",
        "Anlık veri senkronizasyonu ile güncel veri erişimi"
      ],
      detailsEn: [
        "Configuring secure read/write permissions for databases",
        "Connecting Vector Databases for semantic context storage",
        "Establishing real-time data sync loops across storage instances"
      ]
    },
    11: { 
      titleTr: 'Güvenlik ve İzin Protokolleri', 
      titleEn: 'Security & Permission Protocols', 
      phase: 'integration', 
      phaseTagTr: 'Süreç Entegrasyonu', 
      phaseTagEn: 'Process Integration', 
      tagClass: 'blue-tag', 
      descTr: 'Veri sızıntılarını prevent etmek amacıyla ajanların yetki alanlarının kısıtlanması, şifreleme ve kurumsal uyumluluk kurallarının uygulanması.',
      descEn: 'Restricting agent authorization boundaries, encryption, and enforcing corporate compliance rules to prevent data leaks.',
      detailsTr: [
        "Bölgesel veri kanunlarına (KVKK / GDPR) tam uyumluluk",
        "Uçtan uca şifreleme (Encryption at rest & in transit) protokolü",
        "Periyodik sızma testleri ve otonom güvenlik denetim kayıtları"
      ],
      detailsEn: [
        "Enforcing absolute compliance with KVKK and GDPR regulations",
        "Enabling end-to-end encryption for data at rest and in transit",
        "Scheduling automatic penetration checks and security audit logs"
      ]
    },
    12: { 
      titleTr: 'Verim ve Metrik İzleme', 
      titleEn: 'Performance & Metric Monitoring', 
      phase: 'analytics', 
      phaseTagTr: 'Operasyonel Analitik', 
      phaseTagEn: 'Operational Analytics', 
      tagClass: 'yellow-tag', 
      descTr: 'Otonom hale gelen süreçlerin hız, maliyet ve doğruluk oranlarının anlık olarak göstergelerle takip edilmesi.',
      descEn: 'Real-time tracking of the speed, cost, and accuracy rates of automated processes through indicators.',
      detailsTr: [
        "Süreç tamamlama hızlarının (Cycle Time) anlık takibi",
        "Ajan işlem hata oranları ve doğruluk yüzdelerinin izlenmesi",
        "Yapay zeka kaynak maliyeti ve ROI grafiklerinin takibi"
      ],
      detailsEn: [
        "Real-time tracking of workflow cycle times and transaction counts",
        "Monitoring agent success rates, accuracy percentages, and failures",
        "Analyzing operational compute costs against ROI improvements"
      ]
    },
    13: { 
      titleTr: 'Hata Yönetimi ve Loglama', 
      titleEn: 'Error Management & Logging', 
      phase: 'analytics', 
      phaseTagTr: 'Operasyonel Analitik', 
      phaseTagEn: 'Operational Analytics', 
      tagClass: 'yellow-tag', 
      descTr: 'Süreçlerde yaşanabilecek aksaklıkların otomatik olarak tespit edilip loglanması ve insan yöneticilere anında bildirim gönderilmesi altyapısı.',
      descEn: 'Infrastructure for automatically detecting and logging issues in processes and sending instant notifications to human managers.',
      detailsTr: [
        "Ajan bazlı beklenmedik hata ve istisnaların tespiti",
        "Çözülemeyen krizlerde insan yöneticilere anlık bildirim",
        "Geriye dönük denetlenebilir detaylı işlem loglama (Audit Trail)"
      ],
      detailsEn: [
        "Automatically flagging unexpected agent syntax or logic issues",
        "Escalating unresolved issues instantly to human supervisors",
        "Maintaining fully inspectable audit trails for past transactions"
      ]
    },
    14: { 
      titleTr: 'Sürekli Otonom Gelişim', 
      titleEn: 'Continuous Autonomous Evolution', 
      phase: 'analytics', 
      phaseTagTr: 'Operasyonel Analitik', 
      phaseTagEn: 'Operational Analytics', 
      tagClass: 'yellow-tag', 
      descTr: 'Analitik veriler doğrultusunda sistemin kendi kendini güncelleyerek zamanla daha verimli kararlar almasını sağlayan optimizasyon döngüsü.',
      descEn: 'An optimization cycle that allows the system to self-update in line with analytical data to make more efficient decisions over time.',
      detailsTr: [
        "Hatalardan ders alan otonom geribildirim döngüleri",
        "Performans analizi ile ajan modellerinin ince ayar (Fine-tune) tespiti",
        "Öğrenilen metotlarla operasyonel maliyetlerin zamanla düşmesi"
      ],
      detailsEn: [
        "Developing self-improving feedback loops from historical errors",
        "Identifying targets for model fine-tuning based on performance logs",
        "Lowering computational overhead dynamically via learned strategies"
      ]
    }
  };

  const stepNavButtons = document.querySelectorAll('.step-nav-btn');
  const deckVideo = document.getElementById('deck-video');
  const deckVideoSource = document.getElementById('deck-video-source');
  
  const deckTitleTr = document.getElementById('deck-title-tr');
  const deckTitleEn = document.getElementById('deck-title-en');
  const deckDescTr = document.getElementById('deck-desc-tr');
  const deckDescEn = document.getElementById('deck-desc-en');
  const deckPhaseTagTr = document.getElementById('deck-phase-tag-tr');
  const deckPhaseTagEn = document.getElementById('deck-phase-tag-en');
  const deckStepTagTr = document.getElementById('deck-step-tag-tr');
  const deckStepTagEn = document.getElementById('deck-step-tag-en');
  const deckDetailsTr = document.getElementById('deck-details-tr');
  const deckDetailsEn = document.getElementById('deck-details-en');
  
  const loadStep = (stepNumber) => {
    const data = stepsData[stepNumber];
    if (!data) return;
    
    stepNavButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-step') === stepNumber.toString());
    });
    
    if(deckTitleTr) deckTitleTr.textContent = data.titleTr;
    if(deckTitleEn) deckTitleEn.textContent = data.titleEn;
    if(deckDescTr) deckDescTr.textContent = data.descTr;
    if(deckDescEn) deckDescEn.textContent = data.descEn;
    
    if(deckStepTagTr) deckStepTagTr.textContent = `Adım ${stepNumber.toString().padStart(2, '0')} / 14`;
    if(deckStepTagEn) deckStepTagEn.textContent = `Step ${stepNumber.toString().padStart(2, '0')} / 14`;
    
    if(deckPhaseTagTr) {
      deckPhaseTagTr.textContent = data.phaseTagTr;
      deckPhaseTagTr.className = `deck-phase-tag ${data.tagClass}`;
    }
    if(deckPhaseTagEn) {
      deckPhaseTagEn.textContent = data.phaseTagEn;
      deckPhaseTagEn.className = `deck-phase-tag ${data.tagClass}`;
    }
    
    if (deckVideoSource && deckVideo) {
      deckVideoSource.setAttribute('src', `assets/videos/${stepNumber}-sayfa.webm`);
      deckVideo.load();
      deckVideo.play().catch(() => {});
    }

    if (deckDetailsTr && data.detailsTr) {
      deckDetailsTr.innerHTML = data.detailsTr.map(item => `<li>${item}</li>`).join('');
    }
    if (deckDetailsEn && data.detailsEn) {
      deckDetailsEn.innerHTML = data.detailsEn.map(item => `<li>${item}</li>`).join('');
    }
  };
  
  stepNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadStep(parseInt(btn.getAttribute('data-step')));
    });
  });

  // Initialize first step details on load
  loadStep(1);

  /* ==========================================================================
     6. Interactive Flywheel & Filtering Logic
     ========================================================================== */
  const flywheelSegments = document.querySelectorAll('.flywheel-segment');
  const flywheelInfoCard = document.getElementById('flywheel-info-card');
  
  const infoCardTitleTr = document.getElementById('info-card-title-tr');
  const infoCardTitleEn = document.getElementById('info-card-title-en');
  const infoCardDescTr = document.getElementById('info-card-desc-tr');
  const infoCardDescEn = document.getElementById('info-card-desc-en');
  
  const flywheelData = {
    workflows: { 
      titleTr: 'OTONOM SÜREÇLER', 
      titleEn: 'AUTONOMOUS PROCESSES', 
      descTr: 'İş akışlarının analiz edilip otonom SOP\'lara dönüştürülmesi (Adım 1 - 4).', 
      descEn: 'Analysis of workflows and conversion into autonomous SOPs (Steps 1 - 4).',
      colorClass: 'workflows', 
      steps: [1, 2, 3, 4] 
    },
    agents: { 
      titleTr: 'YAPAY ZEKA AJANLARI', 
      titleEn: 'AI AGENTS', 
      descTr: 'Bilişsel iş yükünü üstlenen, akıl yürütebilen akıllı yapay zeka asistanları (Adım 5 - 8).', 
      descEn: 'Intelligent AI assistants that take on cognitive workloads and possess reasoning capabilities (Steps 5 - 8).',
      colorClass: 'agents', 
      steps: [5, 6, 7, 8] 
    },
    integration: { 
      titleTr: 'SÜREÇ ENTEGRASYONU', 
      titleEn: 'PROCESS INTEGRATION', 
      descTr: 'Farklı yazılım, API ve kurumsal sistemlerin kusursuz koordinasyonu (Adım 9 - 11).', 
      descEn: 'Seamless coordination of different software, APIs, and corporate systems (Steps 9 - 11).',
      colorClass: 'integration', 
      steps: [9, 10, 11] 
    },
    analytics: { 
      titleTr: 'OPERASYONEL ANALİTİK', 
      titleEn: 'OPERATIONAL ANALYTICS', 
      descTr: 'Verimliliği anlık olarak ölçen ve sürekli optimize eden veri motoru (Adım 12 - 14).', 
      descEn: 'Data engine that measures efficiency in real-time and continuously optimizes (Steps 12 - 14).',
      colorClass: 'analytics', 
      steps: [12, 13, 14] 
    }
  };
  
  const resetFlywheelInfo = () => {
    if(infoCardTitleTr) infoCardTitleTr.textContent = 'OTONOM EKOSİSTEM';
    if(infoCardTitleEn) infoCardTitleEn.textContent = 'AUTONOMOUS ECOSYSTEM';
    if(infoCardDescTr) infoCardDescTr.textContent = 'Çarktaki bölümlere tıklayarak veya üzerine gelerek kurumsal otonom süreçleri keşfedin. Tıkladığınızda ilgili aşama sunumları listelenecektir.';
    if(infoCardDescEn) infoCardDescEn.textContent = 'Discover corporate autonomous processes by clicking or hovering on the wheel segments. Clicking will list the related phase presentations.';
    if(flywheelInfoCard) flywheelInfoCard.className = 'flywheel-info-card';
  };
  
  const clearStepFilters = () => {
    stepNavButtons.forEach(btn => btn.classList.remove('filtered-out'));
  };
  
  const applyStepFilters = (phaseKey) => {
    if(!flywheelData[phaseKey]) return;
    const allowedSteps = flywheelData[phaseKey].steps;
    
    stepNavButtons.forEach(btn => {
      const stepVal = parseInt(btn.getAttribute('data-step'));
      if (allowedSteps.includes(stepVal)) {
        btn.classList.remove('filtered-out');
      } else {
        btn.classList.add('filtered-out');
      }
    });
    loadStep(allowedSteps[0]);
  };
  
  flywheelSegments.forEach(segment => {
    const phaseKey = segment.getAttribute('data-segment');
    const data = flywheelData[phaseKey];
    
    segment.addEventListener('mouseenter', () => {
      if (data && flywheelInfoCard) {
        if(infoCardTitleTr) infoCardTitleTr.textContent = data.titleTr;
        if(infoCardTitleEn) infoCardTitleEn.textContent = data.titleEn;
        if(infoCardDescTr) infoCardDescTr.textContent = data.descTr;
        if(infoCardDescEn) infoCardDescEn.textContent = data.descEn;
        flywheelInfoCard.className = `flywheel-info-card ${data.colorClass}`;
      }
    });
    
    segment.addEventListener('mouseleave', () => {
      const activeSeg = document.querySelector('.flywheel-segment.active');
      if (activeSeg) {
        const activeData = flywheelData[activeSeg.getAttribute('data-segment')];
        if (activeData) {
          if(infoCardTitleTr) infoCardTitleTr.textContent = activeData.titleTr;
          if(infoCardTitleEn) infoCardTitleEn.textContent = activeData.titleEn;
          if(infoCardDescTr) infoCardDescTr.textContent = activeData.descTr;
          if(infoCardDescEn) infoCardDescEn.textContent = activeData.descEn;
          flywheelInfoCard.className = `flywheel-info-card ${activeData.colorClass}`;
        }
      } else {
        resetFlywheelInfo();
      }
    });
    
    segment.addEventListener('click', () => {
      const isActive = segment.classList.contains('active');
      flywheelSegments.forEach(s => s.classList.remove('active'));
      
      if (!isActive) {
        segment.classList.add('active');
        applyStepFilters(phaseKey);
        const deckSection = document.getElementById('presentation-deck');
        if (deckSection) deckSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        clearStepFilters();
        resetFlywheelInfo();
      }
    });
    
    segment.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        segment.click();
      }
    });
  });

  const drawerSectionLinks = document.querySelectorAll('.nav-links-list a[data-section]');
  drawerSectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute('data-section');
      
      if(menuDrawer) menuDrawer.classList.remove('open');
      if(navW) navW.classList.remove('menu-active');
      if(menuTextOpen) menuTextOpen.style.display = 'block';
      if(menuTextClose) menuTextClose.style.display = 'none';
      
      const matchingSegment = document.querySelector(`.flywheel-segment[data-segment="${sectionName}"]`);
      if (matchingSegment) {
        flywheelSegments.forEach(s => s.classList.remove('active'));
        matchingSegment.classList.add('active');
        
        const data = flywheelData[sectionName];
        if(data && flywheelInfoCard) {
          if(infoCardTitleTr) infoCardTitleTr.textContent = data.titleTr;
          if(infoCardTitleEn) infoCardTitleEn.textContent = data.titleEn;
          if(infoCardDescTr) infoCardDescTr.textContent = data.descTr;
          if(infoCardDescEn) infoCardDescEn.textContent = data.descEn;
          flywheelInfoCard.className = `flywheel-info-card ${data.colorClass}`;
        }
        
        applyStepFilters(sectionName);
        const deckSection = document.getElementById('presentation-deck');
        if (deckSection) deckSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================================================
     7. Infographics Lightbox Zoom Gallery Logic & Global Keydown
     ========================================================================== */
  const infographicCards = document.querySelectorAll('.infographic-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  infographicCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgPath = card.getAttribute('data-image');
      if (imgPath && lightboxImg && lightboxModal) {
        lightboxImg.setAttribute('src', imgPath);
        lightboxModal.classList.add('show');
      }
    });
  });
  
  const closeLightbox = () => {
    if(lightboxModal) lightboxModal.classList.remove('show');
  };
  
  if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  
  if(lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper') || e.target.id === 'lightbox-img') {
        closeLightbox();
      }
    });
  }
  
  // Tek bir Global ESC dinleyicisi tüm açık pencereleri (menü, manifesto, lightbox, demo) kapatır
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('show')) closeLightbox();
      if (demoModal && demoModal.classList.contains('open')) closeDemoModal();
      if (manifestoDrawer) manifestoDrawer.classList.remove('open');
      if (termsDrawer) termsDrawer.classList.remove('open');
      if (privacyDrawer) privacyDrawer.classList.remove('open');
      if (menuDrawer) menuDrawer.classList.remove('open');
      if (navW) navW.classList.remove('menu-active');
      if (menuTextOpen) menuTextOpen.style.display = 'block';
      if (menuTextClose) menuTextClose.style.display = 'none';
    }
  });

  /* ==========================================================================
     8. Subpage Navigation Helpers (Cross-Page Links & URL Params)
     ========================================================================== */
  const closeMenuLink = document.querySelector('[data-action="close-menu"]');
  if (closeMenuLink) {
    closeMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      if(menuDrawer) menuDrawer.classList.remove('open');
      if(navW) navW.classList.remove('menu-active');
      if(menuTextOpen) menuTextOpen.style.display = 'block';
      if(menuTextClose) menuTextClose.style.display = 'none';
    });
  }

  // URL search parameter handler for landing page anchors
  const urlParams = new URLSearchParams(window.location.search);
  const sectionParam = urlParams.get('section');
  const actionParam = urlParams.get('action');

  if (actionParam === 'about') {
    // Open manifesto after preloader completes (approx 1200ms)
    setTimeout(() => {
      openManifesto();
    }, 1200);
  } else if (actionParam === 'demo') {
    // Open demo modal after preloader completes (approx 1200ms)
    setTimeout(() => {
      openDemoModal();
    }, 1200);
  } else if (sectionParam) {
    // Click active segment after preloader completes
    setTimeout(() => {
      const matchingSegment = document.querySelector(`.flywheel-segment[data-segment="${sectionParam}"]`);
      if (matchingSegment) {
        matchingSegment.click();
      }
    }, 1200);
  }

  /* ==========================================================================
     9. Demo Request Modal Logic
     ========================================================================== */
  const demoModal = document.getElementById('demo-modal');
  const demoClose = document.getElementById('demo-close');
  const demoTriggers = document.querySelectorAll('.js-demo-trigger');
  const demoForm = document.getElementById('demo-form');
  const demoSuccessMsg = document.getElementById('demo-success-msg');

  const openDemoModal = (e) => {
    if (demoModal) {
      if (e) e.preventDefault();
      demoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDemoModal = () => {
    if (demoModal) {
      demoModal.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (demoForm) demoForm.style.display = 'block';
        if (demoSuccessMsg) demoSuccessMsg.style.display = 'none';
        if (demoForm) demoForm.reset();
      }, 300);
    }
  };

  demoTriggers.forEach(trig => {
    trig.addEventListener('click', openDemoModal);
  });

  if (demoClose) {
    demoClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeDemoModal();
    });
  }

  if (demoModal) {
    const backdrop = demoModal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeDemoModal);
    }
  }

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Mock request simulation with smooth UI transitions
      demoForm.style.display = 'none';
      if (demoSuccessMsg) demoSuccessMsg.style.display = 'block';
      setTimeout(() => {
        closeDemoModal();
      }, 3500);
    });
  }

});