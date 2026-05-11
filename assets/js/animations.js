/**
 * animations.js — NIBEDULA TECH
 * 1. IntersectionObserver para animar elementos con [data-animate].
 * 2. Hero: partículas 3D + canvas de nodos con profundidad + parallax de ratón.
 * Todo respeta prefers-reduced-motion.
 */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. INTERSECTION OBSERVER — [data-animate]
  ============================================================ */

  const animEls    = document.querySelectorAll('[data-animate]');
  const staggerEls = document.querySelectorAll('[data-stagger]');

  if (prefersReduced) {
    animEls.forEach(el => el.classList.add('is-visible'));
    staggerEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    animEls.forEach(el => observer.observe(el));
    staggerEls.forEach(el => observer.observe(el));
  }

  /* ============================================================
     2. HERO PARALLAX — mouse tilt on illustration
  ============================================================ */

  if (!prefersReduced) {
    const heroVisual = document.querySelector('.hero__visual');
    let tX = 0, tY = 0, cX = 0, cY = 0;

    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      tX = ((e.clientY - cy) / cy) * -5;
      tY = ((e.clientX - cx) / cx) *  5;
    }, { passive: true });

    (function lerpTilt() {
      cX += (tX - cX) * 0.05;
      cY += (tY - cY) * 0.05;
      if (heroVisual) {
        heroVisual.style.transform =
          `perspective(1000px) rotateX(${cX}deg) rotateY(${cY}deg)`;
      }
      requestAnimationFrame(lerpTilt);
    })();
  }

  /* ============================================================
     3. ESTILOS .nt-particle — inyectados siempre (hero + CTAs)
  ============================================================ */

  /* ============================================================
     2B. TILT 3D - tarjetas y paneles con [data-tilt]
  ============================================================ */

  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    const tiltSelector = [
      '[data-tilt]',
      '.feature-card',
      '.usecase-item',
      '.service-usecases__aside',
      '.proceso__step-card',
      '.problema-card',
      '.qs-pillar',
    ].join(',');

    document.querySelectorAll(tiltSelector).forEach((el) => {
      let rafId = null;

      function setTilt(event) {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rx = (y * -6).toFixed(2);
        const ry = (x * 7).toFixed(2);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
      }

      function resetTilt() {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = '';
      }

      el.addEventListener('pointermove', setTilt, { passive: true });
      el.addEventListener('pointerleave', resetTilt, { passive: true });
      el.addEventListener('blur', resetTilt, true);
    });
  }

  if (prefersReduced) return;

  const particleStyle = document.createElement('style');
  particleStyle.textContent = `
    .nt-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      animation: nt-float linear infinite;
      will-change: transform;
    }
    @keyframes nt-float {
      0%   { transform: translateY(0)     translateX(0)     scale(1); }
      25%  { transform: translateY(-40px) translateX(22px)  scale(1.18); }
      60%  { transform: translateY(-20px) translateX(-16px) scale(0.88); }
      100% { transform: translateY(0)     translateX(0)     scale(1); }
    }
  `;
  document.head.appendChild(particleStyle);

  /* ============================================================
     5. PAGE HERO PARTICLES — nosotros, contacto, cta-final
  ============================================================ */

  document.querySelectorAll('.page-hero__particles').forEach(function (ph) {
    const phCount   = window.innerWidth < 640 ? 8 : 16;
    const PH_COLORS = ['13,100,112', '0,212,170', '26,138,154', '122,232,214'];

    for (let i = 0; i < phCount; i++) {
      const el    = document.createElement('div');
      el.className = 'nt-particle';
      const size  = Math.random() * 2.8 + 0.8;
      const color = PH_COLORS[Math.floor(Math.random() * PH_COLORS.length)];
      const op    = (Math.random() * 0.30 + 0.12).toFixed(2);
      const dur   = (Math.random() * 14 + 8).toFixed(1);
      const delay = -(Math.random() * parseFloat(dur)).toFixed(1);

      el.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${(Math.random() * 100).toFixed(1)}%`,
        `top:${(Math.random() * 100).toFixed(1)}%`,
        `background:rgba(${color},${op})`,
        `box-shadow:0 0 ${(size * 3).toFixed(0)}px rgba(${color},${(parseFloat(op) * 0.7).toFixed(2)})`,
        `animation-duration:${dur}s`,
        `animation-delay:${delay}s`,
      ].join(';');
      ph.appendChild(el);
    }

    const phCv = document.createElement('canvas');
    phCv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.22;';
    ph.appendChild(phCv);

    const phCtx  = phCv.getContext('2d');
    let phNodes  = [];
    let phAnimId = null;
    const PH_MD  = 110;

    function phResize() {
      phCv.width  = ph.offsetWidth;
      phCv.height = ph.offsetHeight;
      const cnt = Math.min(Math.floor((phCv.width * phCv.height) / 48000), 14);
      phNodes = Array.from({ length: cnt }, () => ({
        x: Math.random() * phCv.width,  y: Math.random() * phCv.height,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.5,
      }));
    }

    function phTick() {
      phCtx.clearRect(0, 0, phCv.width, phCv.height);
      phNodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > phCv.width)  n.vx *= -1;
        if (n.y < 0 || n.y > phCv.height) n.vy *= -1;
      });
      for (let i = 0; i < phNodes.length; i++) {
        for (let j = i + 1; j < phNodes.length; j++) {
          const dx = phNodes[i].x - phNodes[j].x;
          const dy = phNodes[i].y - phNodes[j].y;
          const d  = Math.hypot(dx, dy);
          if (d >= PH_MD) continue;
          phCtx.beginPath();
          phCtx.strokeStyle = `rgba(0,212,170,${(1 - d / PH_MD).toFixed(2)})`;
          phCtx.lineWidth   = 0.5;
          phCtx.moveTo(phNodes[i].x, phNodes[i].y);
          phCtx.lineTo(phNodes[j].x, phNodes[j].y);
          phCtx.stroke();
        }
      }
      phNodes.forEach(n => {
        phCtx.beginPath();
        phCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        phCtx.fillStyle = 'rgba(0,212,170,0.75)';
        phCtx.fill();
      });
      phAnimId = requestAnimationFrame(phTick);
    }

    phResize();
    phTick();

    let phTimer;
    window.addEventListener('resize', () => {
      clearTimeout(phTimer);
      phTimer = setTimeout(phResize, 150);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(phAnimId); } else { phTick(); }
    });
  });

  /* ============================================================
     4. HERO — solo en index.html (partículas CSS + canvas 3D)
  ============================================================ */

  const container = document.getElementById('hero-particles');
  if (!container) return;

  const COLORS = ['13,100,112', '0,212,170', '26,138,154', '122,232,214', '0,180,140'];
  const COUNT  = window.innerWidth < 640 ? 14 : 28;

  for (let i = 0; i < COUNT; i++) {
    const el      = document.createElement('div');
    el.className  = 'nt-particle';
    const size    = Math.random() * 4 + 1;
    const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
    const opacity = (Math.random() * 0.35 + 0.1).toFixed(2);
    const dur     = (Math.random() * 14 + 8).toFixed(1);
    const delay   = -(Math.random() * parseFloat(dur)).toFixed(1);
    const glow    = (size * 4).toFixed(0);

    el.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `top:${(Math.random() * 100).toFixed(1)}%`,
      `background:rgba(${color},${opacity})`,
      `box-shadow:0 0 ${glow}px rgba(${color},${(parseFloat(opacity) * 0.7).toFixed(2)})`,
      `animation-duration:${dur}s`,
      `animation-delay:${delay}s`,
    ].join(';');

    container.appendChild(el);
  }

  /* ============================================================
     4. CANVAS — nodos conectados con profundidad 3D simulada
  ============================================================ */

  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:absolute', 'inset:0', 'width:100%', 'height:100%',
    'pointer-events:none', 'opacity:0.18',
  ].join(';');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let nodes  = [];
  let animId = null;
  let angle  = 0;
  const MAX_DIST = 150;
  const FOV      = 700;

  function resize() {
    canvas.width  = container.offsetWidth;
    canvas.height = container.offsetHeight;
    buildNodes();
  }

  function buildNodes() {
    const area  = canvas.width * canvas.height;
    const count = Math.min(Math.floor(area / 32000), 22);
    nodes = Array.from({ length: count }, () => ({
      x:  (Math.random() - 0.5) * canvas.width  * 0.9,
      y:  (Math.random() - 0.5) * canvas.height * 0.9,
      z:  (Math.random() - 0.5) * 350,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      vz: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.8 + 0.6,
    }));
  }

  function project(x, y, z) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const rx   = x * cosA - z * sinA;
    const ry   = y;
    const rz   = x * sinA + z * cosA;
    const scale = FOV / (FOV + rz + 180);
    return {
      sx: rx * scale + canvas.width  / 2,
      sy: ry * scale + canvas.height / 2,
      scale,
      rz,
    };
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angle += 0.0018;

    const projected = nodes.map(n => {
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      const hw = canvas.width  * 0.5;
      const hh = canvas.height * 0.5;
      const hz = 200;
      if (n.x < -hw || n.x > hw) n.vx *= -1;
      if (n.y < -hh || n.y > hh) n.vy *= -1;
      if (n.z < -hz || n.z > hz) n.vz *= -1;
      return project(n.x, n.y, n.z);
    });

    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx   = projected[i].sx - projected[j].sx;
        const dy   = projected[i].sy - projected[j].sy;
        const dist = Math.hypot(dx, dy);
        if (dist >= MAX_DIST) continue;
        const alpha = (1 - dist / MAX_DIST).toFixed(2);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,212,170,${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(projected[i].sx, projected[i].sy);
        ctx.lineTo(projected[j].sx, projected[j].sy);
        ctx.stroke();
      }
    }

    projected.forEach((p, i) => {
      const r = nodes[i].r * p.scale * 1.8;
      const brightness = Math.min(1, 0.5 + p.scale * 0.7);
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,170,${brightness.toFixed(2)})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(tick);
  }

  resize();
  tick();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animId); } else { tick(); }
  });

})();
