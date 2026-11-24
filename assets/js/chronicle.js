/* The Lujie Chronicle: small page behaviours, no dependencies.
   - ink-dot rain behind the masthead
   - typewriter tagline
   - archive strip: drag with the mouse, arrow keys, and ← / → buttons
   - archive page filters, and muted demo videos that play while on screen
   Everything respects prefers-reduced-motion. */
(function () {
  'use strict';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var behavior = still ? 'auto' : 'smooth';

  /* ---------- Ink-dot rain ---------- */
  var canvas = document.querySelector('.rain');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var color = getComputedStyle(document.documentElement).getPropertyValue('--dot').trim() || 'rgba(42,33,25,0.32)';
    var drops = [], box = null, raf = 0;
    var size = function () {
      box = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(box.width * dpr));
      canvas.height = Math.max(1, Math.round(box.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = [];
      for (var x = 0; x < box.width; x += 3) drops.push({ x: x, y: Math.random() * box.height });
    };
    var draw = function () {
      ctx.clearRect(0, 0, box.width, box.height);
      ctx.fillStyle = color;
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        d.y += Math.random() * 1.4;
        if (d.y > box.height) d.y = 0;
        ctx.fillRect(d.x, d.y, 1.2, 1.2);
      }
    };
    size();
    if (still) {
      draw();
    } else {
      var loop = function () { draw(); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      /* stop drawing while the masthead is off screen */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { if (!raf) raf = requestAnimationFrame(loop); }
          else { cancelAnimationFrame(raf); raf = 0; }
        }).observe(canvas);
      }
    }
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { size(); if (still) draw(); }, 150); });
  }

  /* ---------- Typewriter tagline ---------- */
  var typed = document.querySelector('[data-typed]');
  if (typed && !still) {
    var quote = typed.textContent, n = 0, hold = 0;
    typed.textContent = '';
    setInterval(function () {
      if (n >= quote.length) {
        hold += 1;
        if (hold > 60) { hold = 0; n = 0; typed.textContent = ''; }
        return;
      }
      n += 1;
      typed.textContent = quote.slice(0, n);
    }, 120);
  }

  /* ---------- Archive strip ---------- */
  var strip = document.querySelector('[data-strip]');
  if (strip) {
    var down = false, moved = false, sx = 0, sl = 0;
    var scrollable = function () { return strip.scrollWidth > strip.clientWidth + 1; };
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || !scrollable()) return;
      down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft;
      strip.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      strip.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      strip.classList.remove('is-dragging');
    });
    /* a drag should not also follow the link under the pointer */
    strip.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    strip.addEventListener('dragstart', function (e) { e.preventDefault(); });
    strip.addEventListener('keydown', function (e) {
      if (!scrollable()) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); strip.scrollBy({ left: 260, behavior: behavior }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); strip.scrollBy({ left: -260, behavior: behavior }); }
    });
    var prev = document.querySelector('[data-strip-prev]');
    var next = document.querySelector('[data-strip-next]');
    if (prev) prev.addEventListener('click', function () { strip.scrollBy({ left: -520, behavior: behavior }); });
    if (next) next.addEventListener('click', function () { strip.scrollBy({ left: 520, behavior: behavior }); });
  }
  /* ---------- Archive filters ---------- */
  var ledger = document.querySelector('[data-ledger]');
  if (ledger) {
    var tools = ledger.querySelector('[data-ledger-tools]');
    var rows = ledger.querySelectorAll('[data-group]');
    var count = ledger.querySelector('[data-ledger-count]');
    var chips = ledger.querySelectorAll('[data-filter]');
    tools.hidden = false;   /* without JS every entry shows and the buttons stay hidden */
    var apply = function (group) {
      var shown = 0;
      rows.forEach(function (r) {
        var on = group === 'All' || r.getAttribute('data-group') === group;
        r.hidden = !on;
        if (on) shown += 1;
      });
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === group)); });
      count.textContent = 'Showing ' + shown + ' of ' + rows.length;
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () { apply(c.getAttribute('data-filter')); });
    });
  }

  /* ---------- Muted demo videos ---------- */
  /* They play on their own only while on screen, and never with reduced motion. */
  var videos = document.querySelectorAll('video[data-autoplay]');
  if (videos.length && !still && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.4 });
    videos.forEach(function (v) { vio.observe(v); });
  }
})();
