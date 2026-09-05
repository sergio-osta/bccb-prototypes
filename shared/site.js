/* BCCB prototypes — shared behaviour
   1. Dynamic copyright year
   2. Scroll-reveal with a safety net (cards never stay hidden after a fast scroll)
   3. Mobile navigation toggle
   4. Prototype switcher (single source of truth for the variant list)
   5. Demo contact form feedback
*/
(function () {
  'use strict';

  /* 1. Year --------------------------------------------------------------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });

  /* 2. Reveal ------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll('.protocol-card, .protocol-item, .reveal')
  );
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(el, delay) {
    if (el.classList.contains('visible')) return;
    if (reduceMotion || !delay) { el.classList.add('visible'); return; }
    setTimeout(function () { el.classList.add('visible'); }, delay);
  }

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        // Reveal when in view, or when already scrolled past (e.g. anchor jump).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          show(entry.target, Math.min(batch, 5) * 80);
          batch += 1;
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    // Safety net: anything above the fold gets revealed regardless.
    var sweep = function () {
      var vh = window.innerHeight;
      revealEls.forEach(function (el) {
        if (!el.classList.contains('visible') && el.getBoundingClientRect().top < vh) {
          el.classList.add('visible');
          io.unobserve(el);
        }
      });
    };
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    window.addEventListener('load', sweep);
  }

  /* 3. Mobile nav --------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* 4. Prototype switcher ------------------------------------------------- */
  var VARIANTS = [
    { slug: 'variant-1', label: 'Variante 1 — Corporate Trust' },
    { slug: 'variant-2', label: 'Variante 2 — Editorial' },
    { slug: 'variant-3', label: 'Variante 3 — Premium Modern' },
    { slug: 'variant-4', label: 'Variante 4 — Narrativa' }
  ];
  var path = window.location.pathname;
  var sw = document.createElement('div');
  sw.className = 'switcher';
  sw.innerHTML =
    '<button class="switcher-toggle" type="button" aria-label="Cambiar prototipo" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' +
      '</svg>' +
    '</button>' +
    '<div class="switcher-menu" role="menu">' +
      VARIANTS.map(function (v) {
        var active = path.indexOf('/' + v.slug + '/') !== -1 || path.indexOf('/' + v.slug) === path.length - v.slug.length - 1;
        return '<a href="../' + v.slug + '/" role="menuitem"' + (active ? ' class="active" aria-current="page"' : '') +
               '><span class="dot"></span>' + v.label + '</a>';
      }).join('') +
      '<a href="../" role="menuitem" class="all"><span class="dot"></span>Ver todas las variantes</a>' +
    '</div>';
  document.body.appendChild(sw);
  var swToggle = sw.querySelector('.switcher-toggle');
  var swMenu = sw.querySelector('.switcher-menu');
  swToggle.addEventListener('click', function () {
    var open = swMenu.classList.toggle('open');
    swToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function (e) {
    if (!sw.contains(e.target)) {
      swMenu.classList.remove('open');
      swToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* 5. Demo form ---------------------------------------------------------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (note) {
        note.hidden = false;
        note.textContent = 'Prototipo: en la versión final este formulario se enviará a bccb@bccb.es.';
      }
    });
  });
})();
