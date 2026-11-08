(() => {
  'use strict';

  /* ==========================================================================
     1. AMBIENT LUMINA CANVAS IN HERO-SHELL
     ========================================================================== */
  function initLuminaCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 300);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let t = Math.random() * 100;

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#f3f4f8');
      baseGrad.addColorStop(0.5, '#f8f6f2');
      baseGrad.addColorStop(1, '#fafafa');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      const ribbons = [
        { color: 'rgba(214, 226, 248, 0.55)', amp: 48, freq: 0.0022, speed: 0.4, yOffset: height * 0.28 },
        { color: 'rgba(238, 224, 212, 0.48)', amp: 56, freq: 0.0018, speed: -0.32, yOffset: height * 0.42 },
        { color: 'rgba(216, 238, 230, 0.42)', amp: 38, freq: 0.0026, speed: 0.25, yOffset: height * 0.20 }
      ];

      ribbons.forEach((r, idx) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= width; x += 24) {
          const y =
            r.yOffset +
            Math.sin(x * r.freq + t * r.speed + idx) * r.amp +
            Math.cos(x * r.freq * 0.6 - t * r.speed * 0.8) * (r.amp * 0.45);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, 0);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, height * 0.85);
        grad.addColorStop(0, r.color);
        grad.addColorStop(1, 'rgba(250, 250, 250, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      if (!reducedMotion) {
        t += 0.012;
        rafId = requestAnimationFrame(drawFrame);
      }
    }

    drawFrame();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }

  initLuminaCanvas('hero-canvas');

  /* ==========================================================================
     PILL HOVER CARDS (delayed close so the pointer can travel pill -> card)
     ========================================================================== */
  const previewPills = document.querySelectorAll('.pill--preview');
  const canHover = () => window.innerWidth > 640;

  function closeAll(except) {
    previewPills.forEach((p) => {
      if (p !== except) p.classList.remove('is-open');
    });
  }

  previewPills.forEach((pill) => {
    let closeTimer = null;
    const open = () => {
      if (!canHover()) return;
      clearTimeout(closeTimer);
      closeAll(pill);
      pill.classList.add('is-open');
    };
    const close = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => pill.classList.remove('is-open'), 180);
    };

    pill.addEventListener('mouseenter', open);
    pill.addEventListener('mouseleave', close);
    pill.addEventListener('focusin', open);
    pill.addEventListener('focusout', (e) => {
      if (!pill.contains(e.relatedTarget)) close();
    });
    pill.addEventListener('click', (e) => {
      if (e.target.closest('.pill-card')) return;
      pill.classList.contains('is-open') ? pill.classList.remove('is-open') : open();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.pill--preview')) closeAll();
  });

  /* ==========================================================================
     2. CONTACT MODAL & CLIPBOARD COPY
     ========================================================================== */
  const contactModal = document.getElementById('contact-modal');
  const navContactBtn = document.getElementById('nav-contact-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const emailCopyContainer = document.getElementById('email-copy-container');
  const emailAddress = 'syamilhedison@gmail.com';

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (_) {}
    document.body.removeChild(ta);
  }

  function openContactModal() {
    if (!contactModal) return;
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('is-open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (navContactBtn) navContactBtn.addEventListener('click', openContactModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeContactModal);
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && contactModal.classList.contains('is-open')) {
      closeContactModal();
    }
  });

  if (emailCopyContainer) {
    const originalHTML = emailCopyContainer.innerHTML;
    let copyTimer = null;

    emailCopyContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('#copy-email-btn');
      if (!btn) return;
      await copyTextToClipboard(emailAddress);
      clearTimeout(copyTimer);
      emailCopyContainer.innerHTML = `
        <span class="modal-email-copied" role="status">
          Copied ✓
        </span>
      `;
      copyTimer = setTimeout(() => {
        emailCopyContainer.innerHTML = originalHTML;
      }, 2000);
    });
  }
})();
