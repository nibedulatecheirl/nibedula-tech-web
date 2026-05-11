/**
 * faq.js — NIBEDULA TECH
 * Maneja el acordeón FAQ con <details>/<summary>.
 * Solo un ítem puede estar abierto a la vez.
 * Animación de apertura/cierre con max-height.
 * Respeta prefers-reduced-motion.
 */
(function () {
  'use strict';

  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 260; // ms, debe coincidir con la transición CSS

  // Inyectar transición si no hay movimiento reducido
  if (!prefersReduced) {
    const style = document.createElement('style');
    style.textContent = `
      .faq__answer {
        overflow: hidden;
        transition: max-height ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);
  }

  function collapseItem(item) {
    if (!item.open) return;
    const answer = item.querySelector('.faq__answer');

    if (prefersReduced || !answer) {
      item.removeAttribute('open');
      return;
    }

    // Fijar height actual antes de animar a 0
    answer.style.maxHeight = answer.scrollHeight + 'px';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        answer.style.maxHeight = '0';
      });
    });

    setTimeout(() => {
      item.removeAttribute('open');
      answer.style.maxHeight = '';
    }, DURATION);
  }

  function expandItem(item) {
    const answer = item.querySelector('.faq__answer');
    item.setAttribute('open', '');

    if (prefersReduced || !answer) return;

    const height = answer.scrollHeight;
    answer.style.maxHeight = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        answer.style.maxHeight = height + 'px';
      });
    });

    // Limpiar max-height inline cuando termine la animación
    answer.addEventListener('transitionend', () => {
      if (item.open) answer.style.maxHeight = '';
    }, { once: true });
  }

  items.forEach(item => {
    const summary = item.querySelector('.faq__question');
    if (!summary) return;

    summary.addEventListener('click', e => {
      e.preventDefault();

      const isOpen = item.open;

      // Cerrar todos los demás
      items.forEach(other => {
        if (other !== item) collapseItem(other);
      });

      // Alternar el actual
      if (isOpen) {
        collapseItem(item);
      } else {
        expandItem(item);
      }
    });

    // Soporte teclado: Enter y Space ya son nativos en <summary>,
    // pero aseguramos comportamiento correcto
    summary.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        summary.click();
      }
    });
  });

})();
