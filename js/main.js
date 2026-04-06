/* ============================================================
   AITradeHub — main.js
   Features: mobile nav, smooth scroll, blog category filter
============================================================ */

(function () {
  'use strict';

  /* ── Mobile Navigation ────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute(
        'aria-expanded',
        hamburger.classList.contains('open')
      );
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Smooth Scroll for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90; // account for sticky header
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Blog Category Filter ─────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card[data-category]');

  if (filterBtns.length && articleCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        articleCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn .35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Newsletter Form (client-side feedback) ───────────── */
  document.querySelectorAll('.newsletter-form, .newsletter-inline-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button, .btn');
      if (!input || !input.value) return;

      const original = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#10b981';
      btn.style.borderColor = '#10b981';
      input.value = '';

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 3000);
    });
  });

  /* ── Active nav highlight ─────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── CSS keyframe injection for filter animation ──────── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

})();
