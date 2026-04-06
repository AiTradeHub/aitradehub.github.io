/**
 * AITradeHub — main.js (complete overhaul)
 * Pure Vanilla JS, IIFE pattern, no external dependencies.
 * Features: Navbar, Dark Mode, Particles, Typing, Scroll Animations,
 *           Blog Filter, Reading Progress, TOC, Lightbox,
 *           Stats Counter, Skills Bars, Contact Validation, Newsletter,
 *           Back to Top, Ticker, Ripple Effects, Mobile Menu.
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────
     UTILITY HELPERS
  ───────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ─────────────────────────────────────────────────
     1. DARK MODE TOGGLE
  ───────────────────────────────────────────────── */
  function initDarkMode() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');

    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    // Handle all toggle buttons (navbar + mobile)
    on(document, 'click', function (e) {
      const btn = e.target.closest('.dark-mode-btn');
      if (!btn) return;
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ─────────────────────────────────────────────────
     2. STICKY NAVBAR — transparency on scroll
  ───────────────────────────────────────────────── */
  function initNavbar() {
    const header = $('.site-header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }

    onScroll(); // run on load
    on(window, 'scroll', onScroll, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     3. HAMBURGER / MOBILE OVERLAY
  ───────────────────────────────────────────────── */
  function initMobileMenu() {
    const hamburger = $('.hamburger');
    const overlay = $('.mobile-overlay');
    if (!hamburger || !overlay) return;

    function toggle() {
      const open = hamburger.classList.toggle('open');
      overlay.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    on(hamburger, 'click', toggle);

    // Close on link click
    $$('a', overlay).forEach(a => on(a, 'click', () => {
      hamburger.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));

    // Close on Escape
    on(document, 'keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) toggle();
    });
  }

  /* ─────────────────────────────────────────────────
     4. CATEGORIES DROPDOWN
  ───────────────────────────────────────────────── */
  function initDropdown() {
    $$('.nav-dropdown').forEach(dd => {
      const link = dd.querySelector('a');
      let timeout;

      on(dd, 'mouseenter', () => {
        clearTimeout(timeout);
        dd.classList.add('open');
      });

      on(dd, 'mouseleave', () => {
        timeout = setTimeout(() => dd.classList.remove('open'), 150);
      });

      // Touch toggle
      on(link, 'click', e => {
        if (window.innerWidth > 768) {
          // Allow click-through on desktop (handled by hover)
          return;
        }
        e.preventDefault();
        dd.classList.toggle('open');
      });
    });

    // Close dropdown on outside click
    on(document, 'click', e => {
      if (!e.target.closest('.nav-dropdown')) {
        $$('.nav-dropdown').forEach(dd => dd.classList.remove('open'));
      }
    });
  }

  /* ─────────────────────────────────────────────────
     5. PARTICLE CANVAS (Hero)
  ───────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 23, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 160, 23, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    let resizeTimer;
    on(window, 'resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animId);
        resize();
        createParticles();
        draw();
      }, 200);
    });
  }

  /* ─────────────────────────────────────────────────
     6. TYPING ANIMATION (Hero headline)
  ───────────────────────────────────────────────── */
  function initTyping() {
    const target = document.getElementById('typing-target');
    if (!target) return;

    const text = target.getAttribute('data-text') || target.textContent;
    target.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    target.parentNode.insertBefore(cursor, target.nextSibling);

    let i = 0;
    const speed = 45;

    function type() {
      if (i < text.length) {
        target.textContent += text[i++];
        setTimeout(type, speed + Math.random() * 30);
      } else {
        // Remove cursor after typing ends (or keep blinking)
        setTimeout(() => {
          cursor.style.animation = 'none';
          cursor.style.opacity = '0';
        }, 3000);

        // Fade in subheadline
        const lead = $('.hero-lead');
        if (lead) lead.style.animationPlayState = 'running';
      }
    }

    // Start after a brief delay
    setTimeout(type, 400);
  }

  /* ─────────────────────────────────────────────────
     7. SCROLL ANIMATIONS (Intersection Observer)
  ───────────────────────────────────────────────── */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Don't unobserve — keep for section-title underline
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    // Observe all animate-on-scroll elements
    $$('.animate-on-scroll').forEach(el => observer.observe(el));

    // Observe section titles for underline animation
    $$('.section-title').forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────────────
     8. HERO PARALLAX
  ───────────────────────────────────────────────── */
  function initParallax() {
    const hero = $('.hero');
    if (!hero) return;

    let ticking = false;
    on(window, 'scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const rate = scrolled * 0.3;
          hero.style.backgroundPositionY = `${rate}px`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     9. SPONSOR TICKER
  ───────────────────────────────────────────────── */
  function initTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    // Clone content for seamless loop
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;

    const totalWidth = track.scrollWidth / 2;
    track.style.animation = `ticker-scroll 30s linear infinite`;
  }

  /* ─────────────────────────────────────────────────
     10. BLOG FILTER
  ───────────────────────────────────────────────── */
  function initBlogFilter() {
    const filterBar = $('.blog-filter-bar');
    if (!filterBar) return;

    const cards = $$('.article-card');
    const btns = $$('.filter-btn');

    btns.forEach(btn => {
      on(btn, 'click', function () {
        const filter = this.dataset.filter;

        // Update active button
        btns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter cards with animation
        cards.forEach((card, i) => {
          const cat = card.dataset.category;
          const show = filter === 'all' || cat === filter;

          if (show) {
            card.style.display = '';
            card.style.animationDelay = `${(i % 6) * 60}ms`;
            card.classList.add('filtering-in');
            card.classList.remove('filtering-out');
            setTimeout(() => card.classList.remove('filtering-in'), 400);
          } else {
            card.classList.add('filtering-out');
            setTimeout(() => {
              card.style.display = 'none';
              card.classList.remove('filtering-out');
            }, 250);
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────────
     11. BLOG SEARCH
  ───────────────────────────────────────────────── */
  function initBlogSearch() {
    const searchInput = $('.blog-search input');
    if (!searchInput) return;

    const cards = $$('.article-card');

    on(searchInput, 'input', function () {
      const query = this.value.toLowerCase().trim();

      cards.forEach(card => {
        if (!card.style.display || card.style.display !== 'none') {
          const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
          const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';
          const match = !query || title.includes(query) || excerpt.includes(query);
          card.style.visibility = match ? 'visible' : 'hidden';
          card.style.opacity = match ? '1' : '0';
          card.style.pointerEvents = match ? '' : 'none';
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────
     12. READING PROGRESS BAR
  ───────────────────────────────────────────────── */
  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    on(window, 'scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${Math.min(pct, 100)}%`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     13. TABLE OF CONTENTS (article page)
  ───────────────────────────────────────────────── */
  function initTOC() {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;

    const headings = $$('.article-body h2, .article-body h3');
    if (headings.length === 0) return;

    headings.forEach((h, i) => {
      if (!h.id) h.id = `heading-${i}`;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      if (h.tagName === 'H3') li.style.paddingLeft = '16px';
      li.appendChild(a);
      tocList.appendChild(li);
    });

    // Highlight active heading on scroll
    const tocLinks = $$('a', tocList);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = tocList.querySelector(`a[href="#${id}"]`);
        if (link) {
          link.classList.toggle('active', entry.isIntersecting);
        }
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

    headings.forEach(h => observer.observe(h));

    // Mobile TOC toggle
    const tocToggle = document.getElementById('toc-toggle');
    const tocContent = document.getElementById('toc-content');
    if (tocToggle && tocContent) {
      on(tocToggle, 'click', () => {
        const open = tocContent.style.display === 'block';
        tocContent.style.display = open ? 'none' : 'block';
        tocToggle.textContent = open ? '▼ Table of Contents' : '▲ Table of Contents';
      });
    }
  }

  /* ─────────────────────────────────────────────────
     14. LIGHTBOX
  ───────────────────────────────────────────────── */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');

    // Delegate click on article body images
    on(document, 'click', e => {
      const img = e.target.closest('.article-body img');
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    on(lbClose, 'click', closeLightbox);
    on(lightbox, 'click', e => { if (e.target === lightbox) closeLightbox(); });
    on(document, 'keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ─────────────────────────────────────────────────
     15. BACK TO TOP
  ───────────────────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    on(window, 'scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────────
     16. STATS COUNTERS (about page)
  ───────────────────────────────────────────────── */
  function initCounters() {
    const counters = $$('.stat-count');
    if (counters.length === 0) return;

    function animateCount(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target.toLocaleString() + suffix;
      }

      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* ─────────────────────────────────────────────────
     17. SKILLS BARS ANIMATION
  ───────────────────────────────────────────────── */
  function initSkillBars() {
    const fills = $$('.skill-fill');
    if (fills.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(fill => observer.observe(fill));
  }

  /* ─────────────────────────────────────────────────
     18. NEWSLETTER FORM (all instances)
  ───────────────────────────────────────────────── */
  function initNewsletter() {
    $$('.newsletter-inline-form').forEach(form => {
      on(form, 'submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('.btn-subscribe');
        const successMsg = this.querySelector('.newsletter-success') ||
                           this.nextElementSibling;

        if (btn) {
          btn.classList.add('loading');
          btn.disabled = true;
        }

        // Simulate async
        setTimeout(() => {
          if (btn) {
            btn.classList.remove('loading');
            btn.disabled = false;
          }
          // Show success
          const success = this.parentNode.querySelector('.newsletter-success');
          if (success) {
            this.style.display = 'none';
            success.classList.add('show');
          } else {
            // Fallback: change button text
            if (btn) btn.querySelector('.btn-text').textContent = '✓ Subscribed!';
          }
        }, 1500);
      });
    });

    // Sidebar forms
    $$('.newsletter-form').forEach(form => {
      on(form, 'submit', function (e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = '✓ Subscribed!';
          btn.disabled = true;
          setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────
     19. CONTACT FORM VALIDATION
  ───────────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    function validateField(field) {
      const group = field.closest('.form-group');
      if (!group) return true;
      const errMsg = group.querySelector('.form-error-msg');

      let valid = true;
      let message = '';

      if (field.required && !field.value.trim()) {
        valid = false;
        message = 'This field is required.';
      } else if (field.type === 'email' && field.value) {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(field.value)) {
          valid = false;
          message = 'Please enter a valid email address.';
        }
      } else if (field.tagName === 'SELECT' && !field.value) {
        valid = false;
        message = 'Please select a topic.';
      } else if (field.name === 'message' && field.value.trim().length < 10) {
        valid = false;
        message = 'Message must be at least 10 characters.';
      }

      group.classList.toggle('valid', valid && field.value.trim() !== '');
      group.classList.toggle('error', !valid);
      if (errMsg) errMsg.textContent = message;
      return valid;
    }

    // Live validation on blur
    $$('input, select, textarea', form).forEach(field => {
      on(field, 'blur', () => validateField(field));
      on(field, 'input', () => {
        if (field.closest('.form-group')?.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    on(form, 'submit', function (e) {
      e.preventDefault();
      const fields = $$('input, select, textarea', form);
      let allValid = true;
      fields.forEach(f => { if (!validateField(f)) allValid = false; });

      if (!allValid) return;

      const btn = form.querySelector('button[type="submit"]');
      const feedback = document.getElementById('form-feedback');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;display:inline-block;"></span> Sending…';
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'Send Message →';
        }
        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.innerHTML = '✓ Message sent! We\'ll get back to you within 1–2 business days.';
        }
        form.reset();
        $$('.form-group', form).forEach(g => g.classList.remove('valid', 'error'));
      }, 1800);
    });
  }

  /* ─────────────────────────────────────────────────
     20. RIPPLE EFFECT ON BUTTONS
  ───────────────────────────────────────────────── */
  function initRipple() {
    on(document, 'click', function (e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  /* ─────────────────────────────────────────────────
     21. LOAD MORE BUTTON (blog page - visual only)
  ───────────────────────────────────────────────── */
  function initLoadMore() {
    const btn = document.getElementById('load-more-btn');
    if (!btn) return;

    on(btn, 'click', function () {
      this.textContent = 'Loading…';
      this.disabled = true;
      setTimeout(() => {
        this.textContent = 'No more articles';
        // Keep disabled
      }, 1200);
    });
  }

  /* ─────────────────────────────────────────────────
     22. STAGGER CARDS (apply stagger classes)
  ───────────────────────────────────────────────── */
  function initStaggerCards() {
    $$('.articles-grid, .tools-grid, .team-grid, .values-grid, .related-grid, .stats-row')
      .forEach(grid => {
        const children = [...grid.children];
        children.forEach((child, i) => {
          child.classList.add('animate-on-scroll');
          if (i > 0) child.classList.add(`stagger-${Math.min(i, 6)}`);
        });
      });
  }

  /* ─────────────────────────────────────────────────
     23. COPY SHARE LINK
  ───────────────────────────────────────────────── */
  function initShareCopy() {
    const copyBtns = $$('.sfb-copy, .share-copy-btn');
    copyBtns.forEach(btn => {
      on(btn, 'click', async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(window.location.href);
          const orig = btn.innerHTML;
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
          btn.style.background = '#10b981';
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
          }, 2000);
        } catch (err) {
          console.warn('Copy failed:', err);
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────
     24. ACTIVE NAV LINK
  ───────────────────────────────────────────────── */
  function initActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a, .mobile-nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && (href === page || (page === '' && href === 'index.html'))) {
        a.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────────────
     25. CATEGORY BAR QUERY PARAM FILTER
  ───────────────────────────────────────────────── */
  function initCatQueryFilter() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    if (!cat) return;

    const filterBtn = $(`.filter-btn[data-filter="${cat}"]`);
    if (filterBtn) {
      setTimeout(() => filterBtn.click(), 100);
    }
  }

  /* ─────────────────────────────────────────────────
     INIT — run everything
  ───────────────────────────────────────────────── */
  function init() {
    initDarkMode();
    initNavbar();
    initMobileMenu();
    initDropdown();
    initTicker();
    initScrollAnimations();
    initBackToTop();
    initRipple();
    initActiveNav();

    // Page-specific
    const page = window.location.pathname.split('/').pop() || 'index.html';

    if (page === 'index.html' || page === '') {
      initParticles();
      initTyping();
      initParallax();
    }

    if (page === 'blog.html') {
      initBlogFilter();
      initBlogSearch();
      initLoadMore();
      initCatQueryFilter();
    }

    if (page === 'article.html') {
      initReadingProgress();
      initTOC();
      initLightbox();
      initShareCopy();
    }

    if (page === 'about.html') {
      initCounters();
      initSkillBars();
    }

    if (page === 'contact.html') {
      initContactForm();
    }

    initNewsletter();
    initStaggerCards();

    // Re-run scroll animations (after stagger classes added)
    setTimeout(initScrollAnimations, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
