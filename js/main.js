/* ===================================================
   RAFA PRINT PACK — Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================
  // 1. GLOBAL SCROLL HANDLER (Consolidated)
  // ========================
  const scrollBtn = document.querySelector('.scroll-to-top');
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header logic (Sticky & Hide/Show)
    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }

    // Scroll to Top visibility
    if (scrollBtn) {
      if (scrollY > 500) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // ========================
  // 2. MEGA MENU (Desktop hover + Mobile toggle)
  // ========================
  const navItems = document.querySelectorAll('.nav-item.has-mega');
  const isMobile = () => window.innerWidth <= 1024;

  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');

    // Desktop: hover
    item.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      navItems.forEach(ni => ni.classList.remove('active'));
      item.classList.add('active');
    });

    item.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      item.classList.remove('active');
    });

    // Mobile: click toggle
    link.addEventListener('click', (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      const wasActive = item.classList.contains('active');
      navItems.forEach(ni => ni.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Close mega menu on outside click (desktop)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-mega')) {
      navItems.forEach(ni => ni.classList.remove('active'));
    }
  });

  // ========================
  // 3. HAMBURGER MENU
  // ========================
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  function toggleMobileNav() {
    const isOpen = mainNav.classList.contains('open');
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
    
    // Scroll lock
    const scrollVal = !isOpen ? 'hidden' : '';
    document.body.style.overflow = scrollVal;
    document.documentElement.style.overflow = scrollVal;
    
    // Force header to scrolled (white bg) when overlay menu is open
    if (!isOpen) {
      header.classList.add('scrolled');
    } else {
      // Restore header state based on scroll position
      if (window.scrollY <= 100) {
        header.classList.remove('scrolled');
      }
      // Close all active submenus
      navItems.forEach(ni => ni.classList.remove('active'));
    }
  }

  hamburger.addEventListener('click', toggleMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', toggleMobileNav);

  // Close mobile nav on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mainNav.classList.contains('open')) {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      navItems.forEach(ni => ni.classList.remove('active'));
      // Restore header based on scroll
      if (window.scrollY <= 100) {
        header.classList.remove('scrolled');
      }
    }
  });

  // ========================
  // 4. HERO PARALLAX EFFECT
  // ========================
  const heroSection = document.querySelector('.hero');
  const floatingProducts = document.querySelectorAll('.floating-product');

  if (heroSection && floatingProducts.length > 0) {
    let mouseX = 0;
    let mouseY = 0;
    let parallaxTicking = false;

    function updateParallax() {
      floatingProducts.forEach((product, index) => {
        const speed = (index + 1) * 8;
        const translateX = mouseX * speed;
        const translateY = mouseY * speed;
        product.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });
      parallaxTicking = false;
    }

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      floatingProducts.forEach(product => {
        product.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // ========================
  // 4. SEARCH TOGGLE
  // ========================
  const navSearch = document.querySelector('.nav-search');
  const searchToggle = document.querySelector('.search-toggle');
  const searchInput = document.querySelector('.search-container input');

  if (searchToggle && navSearch) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = navSearch.classList.contains('active');
      
      // Close other active menus if needed
      if (typeof navItems !== 'undefined') {
        navItems.forEach(ni => ni.classList.remove('active'));
      }
      
      navSearch.classList.toggle('active');
      
      if (!isActive) {
        setTimeout(() => searchInput.focus(), 300);
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navSearch.contains(e.target) && navSearch.classList.contains('active')) {
        navSearch.classList.remove('active');
      }
    });

    // Prevent closing when clicking inside search input
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
      searchContainer.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  // ========================
  // 5. COUNTER SECTIONS (Home only)
  // ========================
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = Date.now();

      function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      }

      updateCounter();
    });

    countersAnimated = true;
  }

  // ========================
  // 6. TESTIMONIAL CAROUSEL
  // ========================
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let autoPlayTimer = null;

  function goToSlide(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    if (!slides.length) return;
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetAutoPlay();
    });
  });

  function autoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlay();
  }

  if (track) autoPlay();

  // ========================
  // 7. SCROLL REVEAL ANIMATIONS
  // ========================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    // Force transform origin for smoother reveal scaling if needed
    el.style.transformOrigin = 'center bottom';
    revealObserver.observe(el);
  });

  // Counter observer
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }

  // ========================
  // 8. SCROLL TO TOP
  // ========================
  // Re-attach scroll button click (Scroll visibility handled globally above)
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================
  // 9. SMOOTH ANCHOR SCROLL
  // ========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        if (mainNav.classList.contains('open')) {
          toggleMobileNav();
        }
      }
    });
  });
  // ========================
  // 10. HOVER VIDEO ACCORDION
  // ========================
  const hvPanels = document.querySelectorAll('.hv-panel');
  const hvDots = document.querySelectorAll('.hv-dot');
  let hvAutoTimer = null;
  let hvPaused = false;

  function activatePanel(index) {
    hvPanels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('hv-panel-active', isActive);
      const video = panel.querySelector('.hv-video');
      if (video) {
        if (isActive) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
      // Reset progress bar animation
      const bar = panel.querySelector('.hv-progress-bar');
      if (bar) {
        bar.style.transition = 'none';
        bar.style.width = '0';
        if (isActive) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.transition = 'width 5s linear';
              bar.style.width = '100%';
            });
          });
        }
      }
    });
    hvDots.forEach((dot, i) => {
      dot.classList.toggle('hv-dot-active', i === index);
    });
  }

  if (hvPanels.length > 0) {
    // Hover interaction
    hvPanels.forEach((panel, i) => {
      panel.addEventListener('mouseenter', () => {
        hvPaused = true;
        activatePanel(i);
      });
    });

    const accordion = document.querySelector('.hover-video-accordion');
    if (accordion) {
      accordion.addEventListener('mouseleave', () => {
        hvPaused = false;
      });
    }

    // Dot click
    hvDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        activatePanel(i);
      });
    });

    // Auto-rotate every 5 seconds
    let hvCurrentIndex = 0;
    function hvAutoRotate() {
      hvAutoTimer = setInterval(() => {
        if (hvPaused) return;
        hvCurrentIndex = (hvCurrentIndex + 1) % hvPanels.length;
        activatePanel(hvCurrentIndex);
      }, 5000);
    }
    hvAutoRotate();

    // Start first panel video
    activatePanel(0);
  }

  // ========================
  // 11. HERO CAROUSEL
  // ========================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDotsIndicator = document.querySelectorAll('.hero-dot');
  let currentHeroSlide = 0;
  let heroAutoTimer = null;

  function goToHeroSlide(index) {
    if (!heroSlides.length || !heroDotsIndicator.length) return;
    
    // Remove active from all
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDotsIndicator.forEach(dot => dot.classList.remove('active'));

    // Set new current
    currentHeroSlide = index;
    if (currentHeroSlide >= heroSlides.length) currentHeroSlide = 0;
    if (currentHeroSlide < 0) currentHeroSlide = heroSlides.length - 1;

    // Add active
    heroSlides[currentHeroSlide].classList.add('active');
    heroDotsIndicator[currentHeroSlide].classList.add('active');
  }

  if (heroSlides.length > 0) {
    // Click on dots
    heroDotsIndicator.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToHeroSlide(index);
        resetHeroTimer();
      });
    });

    function startHeroTimer() {
      heroAutoTimer = setInterval(() => {
        goToHeroSlide(currentHeroSlide + 1);
      }, 6000);
    }

    function resetHeroTimer() {
      if (heroAutoTimer) clearInterval(heroAutoTimer);
      startHeroTimer();
    }

    startHeroTimer();
  }

  // ========================
  // 12. CURRENT YEAR
  // ========================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ========================
  // 13. FAQ ACCORDION
  // ========================
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Optional: Close other open questions in the same group
      const parentSection = item.closest('.faq-group-content');
      if (parentSection) {
        parentSection.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      }
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ---------- SISTER CONCERNS VIDEO INTERACTION ---------- */
  const concernCards = document.querySelectorAll('.concern-glass-card');
  
  concernCards.forEach(card => {
    const video = card.querySelector('.concern-video');
    if (!video) return;

    // Desktop Hover
    card.addEventListener('mouseenter', () => {
      video.play().catch(error => console.log("Video play prevented:", error));
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
    });

    // Mobile/Click Toggle
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking the website link
      if (e.target.closest('.concern-website-btn')) return;

      if (video.paused) {
        // Pause all other videos first
        document.querySelectorAll('.concern-video').forEach(v => v.pause());
        video.play().catch(error => console.log("Video play prevented:", error));
      } else {
        video.pause();
      }
    });
  });

});
