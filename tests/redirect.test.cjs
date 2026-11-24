const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const site = process.env.SITE_DIR || path.join(__dirname, '..', '_site');

function redirect(page, hash) {
  const html = fs.readFileSync(path.join(site, page), 'utf8');
  const script = html.match(/<script\b([^>]*)>([\s\S]*?)<\/script>/);
  const src = script[1].match(/src="([^"]+)"/);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  const code = src ? fs.readFileSync(path.join(site, src[1]), 'utf8') : script[2];
  let destination;
  vm.runInNewContext(code, {
    URL,
    document: { querySelector: () => ({ href: canonical }) },
    location: { href: 'https://lujiez.github.io/' + page + hash, hash, replace: url => { destination = String(url); } }
  });
  return new URL(destination, 'https://lujiez.github.io').href;
}

test('About aliases always resolve to the existing about section', () => {
  for (const hash of ['', '#about', '#old-heading']) {
    assert.equal(redirect('about/index.html', hash), 'https://lujiez.github.io/#about');
  }
});

test('Project aliases retain incoming fragments when no target fragment is specified', () => {
  for (const page of ['projects.html', 'projects/index.html', 'projects/projects.html']) {
    assert.equal(redirect(page, '#also-h'), 'https://lujiez.github.io/work/#also-h');
  }
});
