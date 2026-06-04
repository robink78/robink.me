document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. Theme Switcher Logic
     ========================================================================== */
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  htmlElement.setAttribute('data-theme', initialTheme);
  
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

  /* ==========================================================================
     2. Preloader Counter Logic
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const percentText = document.getElementById('preloader-percent');
  const appWrapper = document.getElementById('app-wrapper');
  const preloaderBird = document.getElementById('preloader-bird');
  
  let currentPercent = 0;
  
  const updatePreloader = () => {
    // 1'er 1'er artış yaparak 100 adımda tamamlanmasını sağlıyoruz
    currentPercent += 1;
    
    percentText.textContent = currentPercent.toString().padStart(2, '0');
    
    // Kuşun şeffaflığını yüklenme yüzdesine göre senkronize olarak arttırıyoruz
    if (preloaderBird) {
      preloaderBird.style.opacity = (currentPercent / 100).toString();
    }
    
    if (currentPercent < 100) {
      // Her adım ortalama 35ms sürer -> 100 adım * 35ms = 3500ms (3.5 Saniye)
      setTimeout(updatePreloader, Math.floor(Math.random() * 18) + 26);
    } else {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transform = 'translateY(-100%)';
        
        appWrapper.style.visibility = 'visible';
        appWrapper.style.opacity = '1';
        
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1200);
      }, 500);
    }
  };
  
  updatePreloader();

  /* ==========================================================================
     3. Global 4-City World Clocks Widget
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
  
  const updateClocks = () => {
    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    Object.keys(timezones).forEach(key => {
      try {
        options.timeZone = timezones[key].zone;
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        timezones[key].el.textContent = formatter.format(now);
      } catch (err) {
        console.error(`Clock error for ${key}:`, err);
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
  const aboutBtn = document.getElementById('about-btn');
  const aboutLink = document.querySelector('[data-action="about"]');
  const scrollGalleryLink = document.querySelector('[data-action="scroll-gallery"]');
  
  const navW = document.querySelector('.nav-w');

  // Toggle Fullscreen Menu Drawer
  menuTrigger.addEventListener('click', () => {
    const isOpen = menuDrawer.classList.toggle('open');
    navW.classList.toggle('menu-active', isOpen);
    if (isOpen) {
      menuTextOpen.style.display = 'none';
      menuTextClose.style.display = 'block';
    } else {
      menuTextOpen.style.display = 'block';
      menuTextClose.style.display = 'none';
    }
  });
  
  // Slide out Manifesto Panel
  const openManifesto = () => {
    manifestoDrawer.classList.add('open');
    menuDrawer.classList.remove('open');
    navW.classList.remove('menu-active');
    menuTextOpen.style.display = 'block';
    menuTextClose.style.display = 'none';
  };
  
  aboutBtn.addEventListener('click', openManifesto);
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    openManifesto();
  });
  
  manifestoClose.addEventListener('click', () => {
    manifestoDrawer.classList.remove('open');
  });

  // Scroll to gallery link in menu
  scrollGalleryLink.addEventListener('click', () => {
    menuDrawer.classList.remove('open');
    navW.classList.remove('menu-active');
    menuTextOpen.style.display = 'block';
    menuTextClose.style.display = 'none';
  });
  
  // Close drawers with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      manifestoDrawer.classList.remove('open');
      menuDrawer.classList.remove('open');
      navW.classList.remove('menu-active');
      menuTextOpen.style.display = 'block';
      menuTextClose.style.display = 'none';
    }
  });

  /* ==========================================================================
     5. 14-Step Presentation Deck & Video Player Logic
     ========================================================================== */
  
  // 14 Steps Presentation Metadata
  const stepsData = {
    1: {
      title: 'Giriş ve Vizyon',
      phase: 'workflows',
      phaseTag: 'Otonom Süreçler',
      tagClass: 'red-tag',
      desc: 'Şirketlerin verimsiz manuel operasyonlardan akıllı, otonom iş akışlarına geçiş vizyonunu inceliyoruz. Temel entegrasyon süreçlerinin mimari başlangıç noktası.'
    },
    2: {
      title: 'Geleneksel SOP Analizi',
      phase: 'workflows',
      phaseTag: 'Otonom Süreçler',
      tagClass: 'red-tag',
      desc: 'Mevcut standart operasyon prosedürlerinin (SOP) analizi yapılarak hangi süreçlerin yapay zekaya devredilebileceği tespit edilir.'
    },
    3: {
      title: 'Otonom Modelleme',
      phase: 'workflows',
      phaseTag: 'Otonom Süreçler',
      tagClass: 'red-tag',
      desc: 'Süreçlerin yapay zeka ajanlarının anlayabileceği mantıksal karar ağaçlarına ve akış şemalarına dönüştürülmesi aşaması.'
    },
    4: {
      title: 'İş Akışı Optimizasyonu',
      phase: 'workflows',
      phaseTag: 'Otonom Süreçler',
      tagClass: 'red-tag',
      desc: 'Akışların simüle edilmesi, darboğazların tespiti ve en yüksek hız için süreç optimizasyon parametrelerinin ayarlanması.'
    },
    5: {
      title: 'Yapay Zeka Ajan Seçimi',
      phase: 'agents',
      phaseTag: 'Yapay Zeka Ajanları',
      tagClass: 'green-tag',
      desc: 'Departman bazlı ihtiyaçlar için en uygun bilişsel yeteneklere sahip akıllı yapay zeka ajan modellerinin belirlenmesi.'
    },
    6: {
      title: 'Bilişsel Görev Dağılımı',
      phase: 'agents',
      phaseTag: 'Yapay Zeka Ajanları',
      tagClass: 'green-tag',
      desc: 'Belirli süreç sorumluluklarının ilgili yapay zeka asistanlarına atanması ve karar yetki sınırlarının tanımlanması.'
    },
    7: {
      title: 'Ajanlar Arası İletişim',
      phase: 'agents',
      phaseTag: 'Yapay Zeka Ajanları',
      tagClass: 'green-tag',
      desc: 'Farklı otonom ajanların birbiriyle veri paylaşabilmesi ve ortaklaşa iş yürütebilmesi için iletişim protokollerinin kurulması.'
    },
    8: {
      title: 'İş Gücü Entegrasyonu',
      phase: 'agents',
      phaseTag: 'Yapay Zeka Ajanları',
      tagClass: 'green-tag',
      desc: 'Otonom yapay zeka ajan iş gücü ile insan çalışanlar arasındaki onay mekanizmalarının ve ortak çalışma arayüzlerinin entegre edilmesi.'
    },
    9: {
      title: 'API ve Bağlantı Altyapısı',
      phase: 'integration',
      phaseTag: 'Süreç Entegrasyonu',
      tagClass: 'blue-tag',
      desc: 'Ajanların kurumsal yazılımlara (ERP, CRM, Slack) erişebilmesi için gerekli güvenli API bağlantı katmanlarının oluşturulması.'
    },
    10: {
      title: 'Veri Ambarı Entegrasyonu',
      phase: 'integration',
      phaseTag: 'Süreç Entegrasyonu',
      tagClass: 'blue-tag',
      desc: 'Şirket içi veri ambarları ve bulut veritabanlarının, otonom ajanların anlık sorgular yapabilmesi için güvenli bir şekilde bağlanması.'
    },
    11: {
      title: 'Güvenlik ve İzin Protokolleri',
      phase: 'integration',
      phaseTag: 'Süreç Entegrasyonu',
      tagClass: 'blue-tag',
      desc: 'Veri sızıntılarını önlemek amacıyla ajanların yetki alanlarının kısıtlanması, şifreleme ve kurumsal uyumluluk kurallarının uygulanması.'
    },
    12: {
      title: 'Verim ve Metrik İzleme',
      phase: 'analytics',
      phaseTag: 'Operasyonel Analitik',
      tagClass: 'yellow-tag',
      desc: 'Otonom hale gelen süreçlerin hız, maliyet ve doğruluk oranlarının anlık olarak göstergelerle takip edilmesi.'
    },
    13: {
      title: 'Hata Yönetimi ve Loglama',
      phase: 'analytics',
      phaseTag: 'Operasyonel Analitik',
      tagClass: 'yellow-tag',
      desc: 'Süreçlerde yaşanabilecek aksaklıkların otomatik tespit edilip loglanması ve insan yöneticilere anında bildirim gönderilmesi altyapısı.'
    },
    14: {
      title: 'Sürekli Otonom Gelişim',
      phase: 'analytics',
      phaseTag: 'Operasyonel Analitik',
      tagClass: 'yellow-tag',
      desc: 'Analitik veriler doğrultusunda sistemin kendi kendini güncelleyerek zamanla daha verimli kararlar almasını sağlayan optimizasyon döngüsü.'
    }
  };

  const stepNavButtons = document.querySelectorAll('.step-nav-btn');
  const deckVideo = document.getElementById('deck-video');
  const videoSource = document.getElementById('video-source');
  const deckTitle = document.getElementById('deck-title');
  const deckDesc = document.getElementById('deck-desc');
  const deckPhaseTag = document.getElementById('deck-phase-tag');
  const deckStepTag = document.getElementById('deck-step-tag');
  
  // Select and load a specific presentation step
  const loadStep = (stepNumber) => {
    const data = stepsData[stepNumber];
    if (!data) return;
    
    // Update active nav button
    stepNavButtons.forEach(btn => {
      if (btn.getAttribute('data-step') === stepNumber.toString()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update text content
    deckTitle.textContent = data.title;
    deckDesc.textContent = data.desc;
    deckStepTag.textContent = `Adım ${stepNumber.toString().padStart(2, '0')} / 14`;
    
    // Update Phase Tag
    deckPhaseTag.textContent = data.phaseTag;
    deckPhaseTag.className = `deck-phase-tag ${data.tagClass}`;
    
    // Update Video elements
    const videoPath = `assets/videos/${stepNumber}-sayfa.mp4`;
    const posterPath = `assets/images/page${stepNumber}_1_Im1.jpg`;
    
    deckVideo.setAttribute('poster', posterPath);
    videoSource.setAttribute('src', videoPath);
    
    // Reload and play video
    deckVideo.load();
    deckVideo.play().catch(e => {
      // Auto-play might be blocked by browser policies if not muted, this catch handles it safely.
      console.log('Video autoplay interrupted or requires mute:', e);
    });
  };
  
  // Set up step navigation click listeners
  stepNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'));
      loadStep(step);
    });
  });

  /* ==========================================================================
     6. Interactive Flywheel & Filtering Logic
     ========================================================================== */
  const flywheelSegments = document.querySelectorAll('.flywheel-segment');
  const flywheelInfoCard = document.getElementById('flywheel-info-card');
  const infoCardTitle = document.getElementById('info-card-title');
  const infoCardDesc = document.getElementById('info-card-desc');
  
  const flywheelData = {
    workflows: {
      title: 'OTONOM SÜREÇLER',
      desc: 'İş akışlarının analiz edilmesi ve otonom SOP\'lar haline dönüştürülmesi (Adım 1 - 4).',
      colorClass: 'workflows',
      steps: [1, 2, 3, 4]
    },
    agents: {
      title: 'YAPAY ZEKA AJANLARI',
      desc: 'Bilişsel iş yükünü üstlenen, akıl yürütebilen akıllı yapay zeka asistanları (Adım 5 - 8).',
      colorClass: 'agents',
      steps: [5, 6, 7, 8]
    },
    integration: {
      title: 'SÜREÇ ENTEGRASYONU',
      desc: 'Farklı yazılım, API ve kurumsal sistemlerin kusursuz koordinasyonu (Adım 9 - 11).',
      colorClass: 'integration',
      steps: [9, 10, 11]
    },
    analytics: {
      title: 'OPERASYONEL ANALİTİK',
      desc: 'Verimliliği anlık olarak ölçen ve sürekli optimize eden veri motoru (Adım 12 - 14).',
      colorClass: 'analytics',
      steps: [12, 13, 14]
    }
  };
  
  const resetFlywheelInfo = () => {
    infoCardTitle.textContent = 'OTONOM EKOSİSTEM';
    infoCardDesc.textContent = 'Çarktaki bölümlere tıklayarak veya üzerine gelerek kurumsal otonom süreçleri keşfedin. Tıkladığınızda ilgili aşama sunumları listelenecektir.';
    flywheelInfoCard.className = 'flywheel-info-card';
  };
  
  // Clear step filtering and show all 14 steps
  const clearStepFilters = () => {
    stepNavButtons.forEach(btn => {
      btn.classList.remove('filtered-out');
    });
  };
  
  // Apply step filtering based on flywheel selection
  const applyStepFilters = (phaseKey) => {
    const allowedSteps = flywheelData[phaseKey].steps;
    
    stepNavButtons.forEach(btn => {
      const stepVal = parseInt(btn.getAttribute('data-step'));
      if (allowedSteps.includes(stepVal)) {
        btn.classList.remove('filtered-out');
      } else {
        btn.classList.add('filtered-out');
      }
    });
    
    // Automatically load the first step in this filtered phase
    loadStep(allowedSteps[0]);
  };
  
  flywheelSegments.forEach(segment => {
    const phaseKey = segment.getAttribute('data-segment');
    const data = flywheelData[phaseKey];
    
    // Hover Enter
    segment.addEventListener('mouseenter', () => {
      if (data) {
        infoCardTitle.textContent = data.title;
        infoCardDesc.textContent = data.desc;
        flywheelInfoCard.className = 'flywheel-info-card';
        flywheelInfoCard.classList.add(data.colorClass);
      }
    });
    
    // Hover Leave
    segment.addEventListener('mouseleave', () => {
      const activeSeg = document.querySelector('.flywheel-segment.active');
      if (activeSeg) {
        const activeKey = activeSeg.getAttribute('data-segment');
        const activeData = flywheelData[activeKey];
        if (activeData) {
          infoCardTitle.textContent = activeData.title;
          infoCardDesc.textContent = activeData.desc;
          flywheelInfoCard.className = 'flywheel-info-card';
          flywheelInfoCard.classList.add(activeData.colorClass);
        }
      } else {
        resetFlywheelInfo();
      }
    });
    
    // Click to filter steps
    segment.addEventListener('click', () => {
      const isActive = segment.classList.contains('active');
      
      // Clear previous active states
      flywheelSegments.forEach(s => s.classList.remove('active'));
      
      if (!isActive) {
        segment.classList.add('active');
        applyStepFilters(phaseKey);
        
        // Scroll down to the presentation deck section smoothly
        const deckSection = document.getElementById('presentation-deck');
        if (deckSection) {
          deckSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        clearStepFilters();
        resetFlywheelInfo();
      }
    });
    
    // Keyboard accessibility
    segment.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        segment.click();
      }
    });
  });

  // Connect drawer link clicks directly to flywheel trigger & scrolling
  const drawerSectionLinks = document.querySelectorAll('.nav-links-list a[data-section]');
  drawerSectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute('data-section');
      
      menuDrawer.classList.remove('open');
      navW.classList.remove('menu-active');
      menuTextOpen.style.display = 'block';
      menuTextClose.style.display = 'none';
      
      const matchingSegment = document.querySelector(`.flywheel-segment[data-segment="${sectionName}"]`);
      if (matchingSegment) {
        // Trigger active class
        flywheelSegments.forEach(s => s.classList.remove('active'));
        matchingSegment.classList.add('active');
        
        // Info card state
        const data = flywheelData[sectionName];
        infoCardTitle.textContent = data.title;
        infoCardDesc.textContent = data.desc;
        flywheelInfoCard.className = 'flywheel-info-card';
        flywheelInfoCard.classList.add(data.colorClass);
        
        applyStepFilters(sectionName);
        
        const deckSection = document.getElementById('presentation-deck');
        if (deckSection) {
          deckSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ==========================================================================
     7. Infographics Lightbox Zoom Gallery Logic
     ========================================================================== */
  const infographicCards = document.querySelectorAll('.infographic-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  infographicCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgPath = card.getAttribute('data-image');
      if (imgPath) {
        lightboxImg.setAttribute('src', imgPath);
        lightboxModal.classList.add('show');
      }
    });
  });
  
  const closeLightbox = () => {
    lightboxModal.classList.remove('show');
  };
  
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox clicking on background
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });
  
  // Close lightbox on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
      closeLightbox();
    }
  });
});
