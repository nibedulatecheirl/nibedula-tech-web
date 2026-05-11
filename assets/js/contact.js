/**
 * contact.js — NIBEDULA TECH
 * Maneja el formulario de contacto (contacto.html).
 * Construye el mensaje de WhatsApp con los datos del formulario.
 * Validación inline con feedback visual accesible.
 */
(function () {
  'use strict';

  // Número de WhatsApp centralizado — actualizar aquí afecta toda la web
  // Formato: código de país + número sin espacios ni guiones
  const WA_NUMBER = '51934069534';

  // --- Formulario de contacto ---
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = form.querySelector('[type="submit"]');
  const successBox = document.getElementById('form-success');
  const errorBox   = document.getElementById('form-error');

  // Ocultar/mostrar mensajes de estado
  function showAlert(el, duration) {
    if (!el) return;
    el.removeAttribute('hidden');
    el.focus();
    setTimeout(() => el.setAttribute('hidden', ''), duration || 6000);
  }

  // Reglas de validación por atributos del campo
  function isFieldValid(input) {
    const val  = input.value.trim();
    const type = input.type;

    if (input.required && !val) return false;

    if (type === 'email' && val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    if (input.name === 'phone' && val) {
      return /^[\d\s+\-() ]{7,15}$/.test(val);
    }

    return true;
  }

  // Marcar estado de error en el grupo del campo
  function setFieldState(input, hasError) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.toggle('has-error', hasError);
    group.classList.toggle('is-valid', !hasError && input.value.trim() !== '');

    const errorMsg = group.querySelector('.field-error');
    if (errorMsg) {
      errorMsg.hidden = !hasError;
    }

    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  // Validar en blur
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => {
      setFieldState(input, !isFieldValid(input));
    });

    // Limpiar error mientras el usuario escribe
    input.addEventListener('input', () => {
      if (input.closest('.form-group')?.classList.contains('has-error')) {
        setFieldState(input, !isFieldValid(input));
      }
    });
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();

    let allValid = true;

    form.querySelectorAll('input, textarea, select').forEach(input => {
      const valid = isFieldValid(input);
      setFieldState(input, !valid);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      // Focus en el primer campo inválido
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // Construir mensaje de WhatsApp desde los campos del formulario
    const name    = (form.querySelector('[name="name"]')?.value    || '').trim();
    const company = (form.querySelector('[name="company"]')?.value || '').trim();
    const service = (form.querySelector('[name="service"]')?.value || '').trim();
    const message = (form.querySelector('[name="message"]')?.value || '').trim();

    const lines = [
      `Hola, me comunico desde la web de NIBEDULA TECH.`,
      ``,
      `Nombre: ${name}`,
      company ? `Empresa: ${company}` : null,
      service ? `Servicio de interés: ${service}` : null,
      ``,
      message,
    ].filter(l => l !== null).join('\n');

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    showAlert(successBox);
    form.reset();

    // Limpiar clases de validación
    form.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-error', 'is-valid');
    });
    form.querySelectorAll('[aria-invalid]').forEach(i => {
      i.removeAttribute('aria-invalid');
    });
  });

})();
