/* Run against the Jekyll development server; see README for browser setup. */
const fs = require('node:fs');
const path = require('node:path');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = (process.env.BASE_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');
const output = process.env.OUTPUT_DIR || path.resolve(__dirname, '../test-results');
const engine = process.env.BROWSER || 'chromium';
const widths = (process.env.WIDTHS || '1440,1100,1024,768,720,390,320').split(',').map(Number);
const routes = [
  '/', '/work/', '/archive/', '/cv', '/contact', '/work/marbury/',
  '/work/service-account-keys/', '/projects/barchart.html',
  '/projects/3dprinting.html', '/404.html',
];
const quote = 'KEEP YOUR HEAD IN THE CLOUD.';
const report = {
  base, engine, capturedAt: new Date().toISOString(), checks: [], matrix: [],
  console: [], failedRequests: [], ignoredAborts: [], badResponses: [],
  interactions: {}, noJS: [], redirects: [], links: [], mainText: {},
};
fs.mkdirSync(output, { recursive: true });
const slug = route => route === '/' ? 'home' : route.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
const settle = (page, ms = 300) => page.waitForTimeout(ms);

function check(name, passed, detail) {
  report.checks.push({ name, passed: Boolean(passed), detail });
  if (!passed) console.error(`FAIL: ${name}: ${JSON.stringify(detail)}`);
}

function observe(page, label) {
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) {
      report.console.push({ label, type: message.type(), text: message.text(), url: page.url() });
    }
  });
  page.on('pageerror', error => report.console.push({ label, type: 'pageerror', text: error.message, url: page.url() }));
  page.on('requestfailed', request => {
    const failure = { label, url: request.url(), reason: request.failure()?.errorText };
    // Leaving a page cancels pending video/PDF loads normally.
    const aborted = /ERR_ABORTED|NS_BINDING_ABORTED|cancelled|canceled/i.test(failure.reason || '');
    (aborted ? report.ignoredAborts : report.failedRequests).push(failure);
  });
  page.on('response', response => {
    if (response.status() >= 400) report.badResponses.push({ label, url: response.url(), status: response.status() });
  });
}

async function readMain(page) {
  return page.locator('main').evaluate(main => {
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const text = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement.closest('script, style, [data-ledger-tools]')) text.push(node.textContent);
    }
    return text.join(' ').replace(/\s+/g, ' ').trim();
  });
}

async function screenshot(page, name, fullPage = false) {
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage });
}

async function layoutMatrix(browser) {
  for (const width of widths) {
    // Static motion gives deterministic screenshots and reveals all content.
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    observe(page, `layout-${width}`);
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'load' });
      await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 });
      // Lazy images can legitimately still be pending at the window load event.
      for (const image of await page.locator('img[loading="lazy"]').all()) await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.images].every(image => image.complete), null, { timeout: 15000 });
      await page.locator('.masthead').scrollIntoViewIfNeeded();
      const state = await page.evaluate(() => ({
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        viewport: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        missingImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
        ledgerTextWidths: [...document.querySelectorAll('.ledger-text')].map(element => element.getBoundingClientRect().width),
        csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content,
        inlineScripts: [...document.scripts].filter(script => !script.src && script.textContent.trim()).length,
        eventAttributes: [...document.querySelectorAll('*')].flatMap(element => [...element.attributes].filter(attribute => /^on/i.test(attribute.name)).map(attribute => attribute.name)),
      }));
      report.matrix.push({ route, width, status: response.status(), ...state });
      check(`${route} at ${width}: page loads with one heading`, response.ok() && state.h1Count === 1, state.h1Count);
      check(`${route} at ${width}: no horizontal overflow`, state.scrollWidth <= width + 1, state.scrollWidth);
      check(`${route} at ${width}: images load`, state.missingImages.length === 0, state.missingImages);
      if (route === '/archive/') {
        check(`archive at ${width}: all 12 descriptions stay readable`, state.ledgerTextWidths.length === 12 && state.ledgerTextWidths.every(value => value >= 200), state.ledgerTextWidths);
      }
      check(`${route} at ${width}: scripts comply with CSP`, /(?:^|;)\s*script-src 'self'\s*(?:;|$)/.test(state.csp || '') && !state.inlineScripts && !state.eventAttributes.length, { csp: state.csp, inlineScripts: state.inlineScripts, eventAttributes: state.eventAttributes });
      report.mainText[route] = await readMain(page);
      await screenshot(page, `${slug(route)}-${width}`, true);
      console.log(`Layout ${route} at ${width}`);
    }
    await context.close();
  }
}

async function filtersAndStrip(page) {
  await page.goto(base + '/archive/');
  report.interactions.filters = [];
  for (const [group, expected] of [['All', 12], ['Work', 5], ['Projects', 5], ['Milestones', 2], ['All', 12]]) {
    await page.locator(`[data-filter="${group}"]`).click();
    const state = await page.evaluate(() => ({
      count: document.querySelector('[data-ledger-count]').textContent,
      pressed: [...document.querySelectorAll('[data-filter]')].filter(element => element.getAttribute('aria-pressed') === 'true').map(element => element.dataset.filter),
      visible: [...document.querySelectorAll('[data-group]')].filter(element => !element.hidden).map(element => element.dataset.group),
    }));
    report.interactions.filters.push({ group, ...state });
    check(`archive ${group}: count, selection, and visible groups agree`, state.count === `Showing ${expected} of 12` && state.pressed.join() === group && state.visible.length === expected && (group === 'All' || state.visible.every(value => value === group)), state);
  }
  await page.goto(base + '/');
  const strip = page.locator('[data-strip]');
  await strip.scrollIntoViewIfNeeded();
  const position = () => strip.evaluate(element => element.scrollLeft);
  const state = { initial: await position() };
  await page.locator('[data-strip-next]').click(); await settle(page, 700); state.next = await position();
  await page.locator('[data-strip-prev]').click(); await settle(page, 700); state.prev = await position();
  await strip.focus();
  await page.keyboard.press('ArrowRight'); await settle(page, 700); state.right = await position();
  await page.keyboard.press('ArrowLeft'); await settle(page, 700); state.left = await position();
  const box = await strip.boundingBox();
  await page.mouse.move(box.x + 700, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 250, box.y + 80, { steps: 12 });
  await page.mouse.up(); await settle(page, 700);
  state.drag = await position(); state.urlAfterDrag = page.url();
  report.interactions.strip = state;
  check('strip arrows, keyboard, and drag work without following a link', state.next > state.initial && state.prev < state.next && state.right > state.prev && state.left < state.right && state.drag > state.left && state.urlAfterDrag === base + '/', state);
}

async function navigationAndSound(page) {
  const supported = await page.evaluate(() => 'PageRevealEvent' in window);
  report.interactions.pageTransitionSupported = supported;
  const sound = page.locator('[data-sound-toggle]');
  if (supported) {
    check('sound toggle is available with page transitions', await sound.isVisible());
    if (await sound.getAttribute('aria-pressed') === 'true') await sound.click();
    check('sound toggles off', await sound.getAttribute('aria-pressed') === 'false');
  }
  await page.locator('.nav a[href="/work/"]').click();
  await page.waitForURL(base + '/work/');
  await settle(page, 200);
  const forward = await page.evaluate(() => ({
    pathname: location.pathname,
    mask: getComputedStyle(document.documentElement).getPropertyValue('--burn-front').startsWith('url('),
    burning: document.getAnimations().some(animation => animation.animationName === 'burn'),
    sound: document.querySelector('[data-sound-toggle]')?.getAttribute('aria-pressed'),
  }));
  report.interactions.forward = forward;
  if (supported && engine === 'chromium') check('forward navigation keeps the page-burn transition', forward.mask && forward.burning, forward);
  if (supported) check('muting survives navigation', forward.sound === 'false', forward);
  await screenshot(page, 'page-burn-forward'); await settle(page, 2200);
  await page.goBack(); await settle(page, 200);
  report.interactions.back = { url: page.url() };
  check('browser Back returns to the front page', page.url() === base + '/', page.url());
  await screenshot(page, 'page-burn-back'); await settle(page, 2200);
  await page.goForward(); await settle(page, 2200);
  check('browser Forward returns to Work', page.url() === base + '/work/', page.url());
}

async function videoAndMotion(page) {
  await page.goto(base + '/projects/barchart.html');
  const video = page.locator('video');
  const togglePlayback = async () => {
    // WebKit toggles native playback by clicking its video surface. Chromium and
    // Firefox expose Space on the focused video; WebKit does not.
    if (engine === 'webkit') await video.click();
    else { await video.focus(); await page.keyboard.press('Space'); }
  };
  const state = () => video.evaluate(element => ({ paused: element.paused, time: element.currentTime, readyState: element.readyState, muted: element.muted, controls: element.controls }));
  await video.scrollIntoViewIfNeeded(); await settle(page, 900);
  const result = { onscreen: await state() };
  check('demo video plays muted with native controls on screen', !result.onscreen.paused && result.onscreen.muted && result.onscreen.controls, result.onscreen);
  await togglePlayback(); await settle(page);
  result.manualPause = await state();
  check('native video control can pause playback', result.manualPause.paused, result.manualPause);
  await page.locator('.masthead').scrollIntoViewIfNeeded(); await settle(page);
  await video.scrollIntoViewIfNeeded(); await settle(page, 700);
  result.returnAfterPause = await state();
  check('an intentional pause survives leaving and returning to the viewport', result.returnAfterPause.paused, result.returnAfterPause);
  if (result.returnAfterPause.paused) { await togglePlayback(); await settle(page); }
  result.manualResume = await state();
  check('native video control can resume playback', !result.manualResume.paused, result.manualResume);
  await page.locator('.masthead').scrollIntoViewIfNeeded(); await settle(page);
  result.offscreen = await state();
  check('video pauses off screen', result.offscreen.paused, result.offscreen);
  await video.scrollIntoViewIfNeeded(); await settle(page, 700);
  result.returnAfterAutoPause = await state();
  check('automatic viewport pause resumes when video returns', !result.returnAfterAutoPause.paused, result.returnAfterAutoPause);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await settle(page);
  result.liveReducedMotion = await state();
  check('enabling reduced motion pauses the running video', result.liveReducedMotion.paused, result.liveReducedMotion);
  await page.goto(base + '/projects/barchart.html');
  await video.scrollIntoViewIfNeeded(); await settle(page, 700);
  result.initialReducedMotion = await state();
  check('initial reduced motion disables video autoplay', result.initialReducedMotion.paused && result.initialReducedMotion.time === 0, result.initialReducedMotion);
  await togglePlayback(); await settle(page);
  result.manualPlayReducedMotion = await state();
  check('reduced motion still permits explicit video playback', !result.manualPlayReducedMotion.paused, result.manualPlayReducedMotion);
  report.interactions.video = result;

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base + '/'); await settle(page, 600);
  const before = await page.locator('[data-typed]').textContent();
  await page.emulateMedia({ reducedMotion: 'reduce' }); await settle(page);
  const after = await page.locator('[data-typed]').textContent();
  const rainA = await page.locator('.rain').evaluate(canvas => canvas.toDataURL());
  await settle(page, 350);
  const rainB = await page.locator('.rain').evaluate(canvas => canvas.toDataURL());
  const later = await page.locator('[data-typed]').textContent();
  const live = { before, after, later, rainStopped: rainA === rainB, soundVisible: await page.locator('[data-sound-toggle]').isVisible() };
  report.interactions.liveMotion = live;
  check('live reduced motion shows a stable full tagline and stops rain', before !== quote && after === quote && later === quote && live.rainStopped, live);
  check('live reduced motion hides the sound toggle', !live.soundVisible, live);
  await page.reload();
  check('initial reduced motion has the complete tagline and hidden sound', await page.locator('[data-typed]').textContent() === quote && !await page.locator('[data-sound-toggle]').isVisible());
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await settle(page, 500);
  check('turning motion back on restarts the tagline', await page.locator('[data-typed]').textContent() !== quote);
}

async function focusAndTooltips(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base + '/');
  // WebKit follows macOS's links-with-Option-Tab keyboard navigation convention.
  const tabKey = engine === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(tabKey);
  const focus = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), outline: getComputedStyle(document.activeElement).outlineStyle }));
  check('first keyboard stop is a visibly focused skip link', focus.text === 'Skip to the stories' && focus.outline !== 'none', focus);
  await page.keyboard.press('Enter'); await page.keyboard.press(tabKey);
  check('skip link advances keyboard navigation into main content', await page.evaluate(() => Boolean(document.activeElement.closest('main'))));
  report.interactions.tooltips = [];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/');
    const icons = page.locator('.colophon-icons > a');
    for (let i = 0; i < await icons.count(); i++) {
      const icon = icons.nth(i);
      await icon.scrollIntoViewIfNeeded(); await icon.hover(); await settle(page, 250);
      const tip = await icon.evaluate(element => {
        const tooltip = element.querySelector('.tip');
        const bounds = tooltip.getBoundingClientRect();
        return { viewport: innerWidth, name: tooltip.textContent, left: bounds.left, right: bounds.right, opacity: getComputedStyle(tooltip).opacity };
      });
      report.interactions.tooltips.push(tip);
      check(`tooltip ${tip.name} at ${width} is visible within viewport`, tip.opacity === '1' && tip.left >= 0 && tip.right <= width, tip);
      if (i === 0) await screenshot(page, `footer-tooltip-${width}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
}

async function linksAndRedirects(page, context) {
  const links = new Set();
  for (const route of routes) {
    await page.goto(base + route);
    if (!report.mainText[route]) report.mainText[route] = await readMain(page);
    for (const href of await page.locator('a[href]').evaluateAll(elements => elements.map(element => element.getAttribute('href')))) {
      if (href.startsWith('/') && !href.startsWith('//')) links.add(href);
    }
  }
  for (const href of links) {
    const response = await context.request.get(base + href.split('#')[0]);
    report.links.push({ href, status: response.status() });
    check(`internal link resolves: ${href}`, response.ok(), response.status());
  }
  for (const [route, target] of [['/about/', '/#about'], ['/projects/', '/work/'], ['/projects.html', '/work/'], ['/projects/projects.html', '/work/']]) {
    await page.goto(base + route); await page.waitForURL(base + target);
    const state = { route, final: page.url(), fragmentExists: target.includes('#') ? await page.locator('#about').count() === 1 : true };
    report.redirects.push(state);
    check(`legacy redirect ${route} preserves its destination`, state.final === base + target && state.fragmentExists, state);
  }
}

async function noJavaScript(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, reducedMotion: 'reduce' });
  const page = await context.newPage(); observe(page, 'no-JS');
  for (const route of routes) {
    await page.goto(base + route);
    const text = await readMain(page);
    const state = {
      route, mainTextParity: text === report.mainText[route], mainTextLength: text.length,
      ledgerRows: await page.locator('[data-group]:visible').count(),
      toolsVisible: await page.locator('[data-ledger-tools]:visible').count(),
      soundVisible: await page.locator('[data-sound-toggle]:visible').count(),
      stripControlsVisible: await page.locator('[data-strip-controls]:visible').count(),
    };
    report.noJS.push(state);
    check(`${route} without JS retains all main content`, state.mainTextParity, state);
    check(`${route} without JS hides unavailable controls`, !state.toolsVisible && !state.soundVisible && !state.stripControlsVisible, state);
    if (route === '/archive/') check('without JS all 12 archive rows are visible', state.ledgerRows === 12, state);
    if (['/', '/archive/', '/projects/barchart.html'].includes(route)) await screenshot(page, `${slug(route)}-no-js`, true);
  }
  await context.close();
}

async function run() {
  if (!['chromium', 'firefox', 'webkit'].includes(engine)) throw new Error(`Unknown BROWSER: ${engine}`);
  const options = { headless: true };
  if (process.env.BROWSER_CHANNEL) options.channel = process.env.BROWSER_CHANNEL;
  const browser = await playwright[engine].launch(options);
  try {
    await layoutMatrix(browser);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage(); observe(page, 'interactions');
    await filtersAndStrip(page);
    await navigationAndSound(page);
    await videoAndMotion(page);
    await focusAndTooltips(page);
    await linksAndRedirects(page, context);
    await context.close();
    await noJavaScript(browser);
    check('no browser warnings, page errors, or CSP violations', report.console.length === 0, report.console);
    check('no unexpected failed browser requests', report.failedRequests.length === 0, report.failedRequests);
    check('no HTTP errors', report.badResponses.length === 0, report.badResponses);
  } finally {
    await browser.close();
  }
}

run().catch(error => {
  check('browser audit completes', false, error.stack || error.message);
}).finally(() => {
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  const failures = report.checks.filter(item => !item.passed).length;
  console.log(`${report.checks.length - failures}/${report.checks.length} checks passed; evidence: ${output}`);
  if (failures) process.exitCode = 1;
});
