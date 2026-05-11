/**
 * main.js — NIBEDULA TECH
 * Punto de entrada: año del footer, scroll del header, smooth scroll de anchors.
 * Se carga con defer; los demás módulos se cargan después.
 */
(function () {
  'use strict';

  // --- Footer year ---
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Navbar: clase is-scrolled al hacer scroll ---
  const header = document.getElementById('site-header');
  if (header) {
    let ticking = false;

    function updateHeader() {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader(); // estado inicial
  }

  // --- Smooth scroll para links de ancla ---
  // Compensa la altura del navbar fijo
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
