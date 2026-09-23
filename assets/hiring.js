(function () {
  'use strict';
  function paintResume() {
    var lang = window.i18n && window.i18n.lang === 'en' ? 'en' : 'ru';
    document.querySelectorAll('[data-resume]').forEach(function (link) {
      link.href = 'assets/resume/raincoat-resume-' + lang + '.pdf';
      link.setAttribute('hreflang', lang);
    });
  }
  paintResume();
  document.addEventListener('langchange', paintResume);

  var video = document.querySelector('[data-hero-video]');
  var toggle = document.querySelector('[data-motion-toggle]');
  if (!video || !toggle) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 901px)');
  var requestedPlayback = true;
  function label() {
    var en = window.i18n && window.i18n.lang === 'en';
    toggle.textContent = video.paused ? (en ? 'Play rain' : 'Включить дождь') : (en ? 'Pause rain' : 'Остановить дождь');
    toggle.setAttribute('aria-pressed', video.paused ? 'false' : 'true');
  }
  function play() {
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.play().catch(label);
  }
  function environment() {
    var allowed = desktop.matches && !reduce.matches;
    toggle.hidden = !allowed;
    if (!allowed) {
      video.pause();
      if (video.getAttribute('src')) { video.removeAttribute('src'); video.load(); }
      requestedPlayback = false;
    } else {
      if (requestedPlayback) play(); else label();
    }
  }
  toggle.addEventListener('click', function () {
    requestedPlayback = video.paused;
    if (requestedPlayback) play(); else video.pause();
    label();
  });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  document.addEventListener('langchange', label);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) video.pause();
    else if (requestedPlayback && desktop.matches && !reduce.matches) play();
  });
  reduce.addEventListener('change', environment);
  desktop.addEventListener('change', environment);
  environment();
})();
