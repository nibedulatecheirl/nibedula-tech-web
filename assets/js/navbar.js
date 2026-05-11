/**
 * navbar.js — NIBEDULA TECH
 * Maneja el menú móvil (hamburguesa), dropdowns de escritorio y accesibilidad.
 */
(function () {
  'use strict';

  const toggle = document.getElementById('navbar-toggle');
  const menu   = document.getElementById('navbar-menu');

  if (!toggle || !menu) return;

  const MOBILE_BP = 768; // px

  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  // --- Abrir / cerrar menú móvil ---
  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Cerrar al hacer click fuera del menú
  document.addEventListener('click', e => {
    if (isMobile() && menu.classList.contains('is-open')) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Cerrar al navegar a un link del menú móvil
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isMobile()) closeMenu();
    });
  });

  // Cerrar menú y dropdowns con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeAllDropdowns();
    }
  });

  // Resetear al redimensionar a desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) closeMenu();
  }, { passive: true });

  // --- Dropdowns (escritorio y móvil) ---
  const dropdownItems = document.querySelectorAll('.navbar__item--dropdown');

  function closeAllDropdowns() {
    dropdownItems.forEach(item => {
      item.classList.remove('is-open');
      const trigger = item.querySelector('.navbar__dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.navbar__dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = item.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar__item--dropdown')) {
      closeAllDropdowns();
    }
  });

  // Cerrar dropdown al salir por teclado (Tab fuera del item)
  dropdownItems.forEach(item => {
    item.addEventListener('focusout', e => {
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove('is-open');
        const trigger = item.querySelector('.navbar__dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

})();
