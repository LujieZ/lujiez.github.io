/* The Lujie Chronicle: small page behaviours, no dependencies.
   - ink-dot rain behind the masthead
   - typewriter tagline
   - archive strip: drag with the mouse, arrow keys, and ← / → buttons
   - archive page filters, and muted demo videos that play while on screen
   Everything respects prefers-reduced-motion. */
(function () {
  'use strict';
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var still = motion.matches;
  var behavior = still ? 'auto' : 'smooth';
  var updateRain = function () {}, updateType = function () {}, updateVideos = function () {};
  motion.addEventListener('change', function () {
    still = motion.matches;
    behavior = still ? 'auto' : 'smooth';
    updateRain();
    updateType();
    updateVideos();
  });

  /* ---------- Ink-dot rain ---------- */
  var canvas = document.querySelector('.rain');
  var ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (ctx) {
    var color = getComputedStyle(document.documentElement).getPropertyValue('--dot').trim() || 'rgba(42,33,25,0.32)';
    var drops = [], box = null, raf = 0, inView = true;
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
    var loop = function () { draw(); raf = requestAnimationFrame(loop); };
    updateRain = function () {
      cancelAnimationFrame(raf); raf = 0;
      if (still) draw();
      else if (inView && !document.hidden) raf = requestAnimationFrame(loop);
    };
    updateRain();
    /* Stop drawing while the masthead or tab is off screen. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        updateRain();
      }).observe(canvas);
    }
    document.addEventListener('visibilitychange', updateRain);
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { size(); if (still) draw(); }, 150); });
  }

  /* ---------- Typewriter tagline ---------- */
  var typed = document.querySelector('[data-typed]');
  if (typed) {
    var quote = typed.textContent, n = 0, hold = 0, typing = 0;
    var type = function () {
      if (n >= quote.length) {
        hold += 1;
        if (hold > 60) { hold = 0; n = 0; typed.textContent = ''; }
        return;
      }
      n += 1;
      typed.textContent = quote.slice(0, n);
    };
    updateType = function () {
      clearInterval(typing);
      if (still) typed.textContent = quote;
      else { n = 0; hold = 0; typed.textContent = ''; typing = setInterval(type, 120); }
    };
    updateType();
  }

  /* ---------- Archive strip ---------- */
  var strip = document.querySelector('[data-strip]');
  if (strip) {
    var controls = document.querySelector('[data-strip-controls]');
    if (controls) controls.hidden = false;
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
  if (videos.length && 'IntersectionObserver' in window) {
    var visibleVideos = new Set(), userPaused = new Set(), automaticPause = new Set();
    updateVideos = function () {
      videos.forEach(function (v) {
        if (!still && !document.hidden && visibleVideos.has(v)) {
          if (!userPaused.has(v)) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) {
          automaticPause.add(v);
          v.pause();
        }
      });
    };
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= 0.4) visibleVideos.add(e.target);
        else visibleVideos.delete(e.target);
      });
      updateVideos();
    }, { threshold: 0.4 });
    videos.forEach(function (v) {
      v.addEventListener('pause', function () {
        if (!automaticPause.delete(v)) userPaused.add(v);
      });
      v.addEventListener('play', function () { userPaused.delete(v); });
      vio.observe(v);
    });
    document.addEventListener('visibilitychange', updateVideos);
  }

})();
