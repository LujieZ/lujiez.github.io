const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function page({ storageBlocked = false, AudioContext, reduced = false } = {}) {
  const events = new Map(), frames = new Map(), intervals = new Map(), timers = new Map();
  let id = 0, preference = 'on';
  function listen(event, callback) {
    const previous = events.get(event);
    events.set(event, (...args) => { previous?.(...args); callback(...args); });
  }
  const media = { matches: reduced, addEventListener: (_, callback) => listen('motion', callback) };
  const button = {
    hidden: true, attrs: {}, tip: {},
    setAttribute(name, value) { this.attrs[name] = value; },
    querySelector() { return this.tip; },
    addEventListener(_, callback) { this.click = callback; },
    remove() { this.hidden = true; }
  };
  const typed = { textContent: 'Keep your head in the cloud.' };
  const canvas = {
    getBoundingClientRect: () => ({ width: 500, height: 200 }),
    getContext: () => ({ setTransform() {}, clearRect() {}, fillRect() {} })
  };
  const context = {
    console, Promise, Math,
    PageRevealEvent: function () {}, AudioContext,
    matchMedia: () => media,
    getComputedStyle: () => ({ getPropertyValue: () => '#000' }),
    localStorage: {
      getItem() { if (storageBlocked) throw Error('Storage blocked'); return preference; },
      setItem(_, value) { if (storageBlocked) throw Error('Storage blocked'); preference = value; }
    },
    document: {
      hidden: false,
      documentElement: { style: { setProperty() {} } },
      querySelector: selector => ({ '.rain': canvas, '[data-typed]': typed, '[data-sound-toggle]': button }[selector] || null),
      querySelectorAll: () => [],
      addEventListener: listen
    },
    addEventListener: listen,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    setInterval: callback => { intervals.set(++id, callback); return id; },
    clearInterval: key => intervals.delete(key),
    setTimeout: (callback, ms) => { timers.set(++id, { callback, ms }); return id; },
    clearTimeout: key => timers.delete(key)
  };
  context.window = context;
  vm.createContext(context);
  const burn = fs.readFileSync(path.join(__dirname, '../assets/js/page-burn.js'), 'utf8');
  vm.runInContext(burn, context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/chronicle.js'), 'utf8'), context);
  events.get('DOMContentLoaded')?.();
  return { context, button, typed, frames, intervals, timers, events, media };
}

test('changing to reduced motion stops rain and restores the complete tagline immediately', () => {
  const p = page();
  assert.equal(p.frames.size, 1);
  assert.equal(p.intervals.size, 1);
  p.media.matches = true;
  p.events.get('motion')?.();
  assert.equal(p.frames.size, 0);
  assert.equal(p.intervals.size, 0);
  assert.equal(p.typed.textContent, 'Keep your head in the cloud.');
});

test('sound can be muted for this page when storage is blocked', () => {
  const p = page({ storageBlocked: true });
  assert.equal(p.button.attrs['aria-pressed'], 'false', 'new documents stay quiet when a mute preference cannot be saved');
  if (p.button.attrs['aria-pressed'] === 'false') p.button.click();
  p.button.click();
  assert.equal(p.button.attrs['aria-pressed'], 'false');
});

test('motion preferences can be switched both ways without duplicate timers', () => {
  const p = page({ reduced: true });
  assert.equal(p.frames.size, 0);
  assert.equal(p.intervals.size, 0);
  assert.equal(p.button.hidden, true);
  p.media.matches = false;
  p.events.get('motion')();
  assert.equal(p.frames.size, 1);
  assert.equal(p.intervals.size, 1);
  assert.equal(p.button.hidden, false);
  p.media.matches = true;
  p.events.get('motion')();
  assert.equal(p.frames.size, 0);
  assert.equal(p.intervals.size, 0);
  assert.equal(p.button.hidden, true);
});

test('a restored page uses the sound preference saved on another page', () => {
  const p = page();
  p.context.localStorage.setItem('chronicle-sound', 'off');
  p.events.get('pagereveal')({ viewTransition: null });
  assert.equal(p.button.attrs['aria-pressed'], 'false');
});

test('unavailable audio hardware does not break the sound control', () => {
  const p = page({ AudioContext: function () { throw Error('No audio device'); } });
  p.button.click();
  assert.doesNotThrow(() => p.button.click());
});

test('rejected audio resume is handled and releases its context', async () => {
  let closed = 0;
  const p = page({ AudioContext: function () {
    this.state = 'suspended';
    this.resume = () => Promise.reject(Error('Audio blocked'));
    this.close = () => { closed++; this.state = 'closed'; return Promise.resolve(); };
  } });
  p.button.click();
  p.button.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(closed, 1);
});

test('muting while audio resume is pending prevents late playback', async () => {
  let resume, closed = 0, buffers = 0;
  const p = page({ AudioContext: function () {
    this.state = 'suspended';
    this.resume = () => new Promise(resolve => { resume = resolve; });
    this.close = () => { closed++; this.state = 'closed'; return Promise.resolve(); };
    this.createBuffer = () => { buffers++; throw Error('Should not play'); };
  } });
  p.button.click();
  p.button.click();
  await Promise.resolve();
  p.button.click();
  resume();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(closed, 1);
  assert.equal(buffers, 0);
});
