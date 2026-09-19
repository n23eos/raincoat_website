const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function environment({ narrow = false, reduced = false } = {}) {
  function events(object = {}) {
    const handlers = {};
    return Object.assign(object, {
      addEventListener(name, callback) { handlers[name] = callback; },
      emit(name) { if (handlers[name]) handlers[name](); }
    });
  }
  const media = {
    '(prefers-reduced-motion: reduce)': events({ matches: reduced }),
    '(min-width: 901px)': events({ matches: !narrow })
  };
  const video = events({
    paused: true, dataset: { src: 'assets/hero-loop.mp4' },
    getAttribute(name) { return this[name] || null; },
    removeAttribute(name) { delete this[name]; },
    load() {},
    pause() { this.paused = true; this.emit('pause'); },
    play() { this.paused = false; this.emit('play'); return Promise.resolve(); }
  });
  const button = events({ setAttribute(name, value) { this[name] = value; } });
  const document = events({
    hidden: false,
    querySelectorAll() { return []; },
    querySelector(selector) { return selector === '[data-hero-video]' ? video : button; }
  });
  vm.runInNewContext(fs.readFileSync('assets/hiring.js', 'utf8'), {
    window: { matchMedia: (query) => media[query] }, document
  });
  return { media, video, button, document };
}

test('hero video autoplays and the toggle pauses and resumes it', () => {
  const { video, button } = environment();
  assert.equal(video.src, 'assets/hero-loop.mp4');
  assert.equal(video.paused, false);
  assert.equal(button.hidden, false);
  button.emit('click');
  assert.equal(video.paused, true);
  assert.equal(button['aria-pressed'], 'false');
  button.emit('click');
  assert.equal(video.paused, false);
  assert.equal(button['aria-pressed'], 'true');
});

test('a video paused by the visitor stays paused after tab visibility changes', () => {
  const { video, button, document } = environment();
  button.emit('click');
  document.hidden = true;
  document.emit('visibilitychange');
  document.hidden = false;
  document.emit('visibilitychange');
  assert.equal(video.paused, true);
});

test('mobile and reduced-motion visits leave the hero static', () => {
  for (const options of [{ narrow: true }, { reduced: true }]) {
    const { video, button } = environment(options);
    assert.equal(video.src, undefined);
    assert.equal(video.paused, true);
    assert.equal(button.hidden, true);
  }
});

test('enabling reduced motion unloads video and prevents visibility resume', () => {
  const { media, video, button, document } = environment();
  button.emit('click');
  const preference = media['(prefers-reduced-motion: reduce)'];
  preference.matches = true;
  preference.emit('change');
  document.emit('visibilitychange');
  assert.equal(video.src, undefined);
  assert.equal(video.paused, true);
  assert.equal(button.hidden, true);
});
