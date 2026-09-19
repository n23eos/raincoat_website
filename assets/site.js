(function () {
  'use strict';

  var mobileQuery = window.matchMedia('(max-width: 1040px)');
  var labels = {
    ru: {
      menu: 'Меню', open: 'Открыть меню', close: 'Закрыть меню',
      cases: 'Кейсы', teams: 'Для команд', blog: 'Блог', contacts: 'Контакты'
    },
    en: {
      menu: 'Menu', open: 'Open menu', close: 'Close menu',
      cases: 'Cases', teams: 'For teams', blog: 'Blog', contacts: 'Contact'
    }
  };

  function language() {
    return window.i18n && window.i18n.lang === 'en' ? 'en' : 'ru';
  }

  function setFocusable(links, enabled) {
    if ('inert' in links) links.inert = !enabled;
    links.setAttribute('aria-hidden', enabled ? 'false' : 'true');
  }

  function enhance(nav, index) {
    if (nav.classList.contains('site-nav--enhanced')) return;

    var links = nav.querySelector('.nav-links');
    var languageSwitch = nav.querySelector('.lang-switch');
    if (!links || !languageSwitch) return;

    if (!links.id) links.id = 'site-nav-links-' + (index + 1);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-toggle';
    button.setAttribute('aria-controls', links.id);
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span class="nav-toggle-icon" aria-hidden="true"></span>' +
      '<span class="nav-toggle-label"></span>';
    nav.insertBefore(button, languageSwitch);
    nav.classList.add('site-nav--enhanced');

    function isOpen() {
      return button.getAttribute('aria-expanded') === 'true';
    }

    function paintLabel() {
      var text = labels[language()];
      button.querySelector('.nav-toggle-label').textContent = text.menu;
      button.setAttribute('aria-label', isOpen() ? text.close : text.open);
      nav.querySelectorAll('[data-site-i18n]').forEach(function (element) {
        var key = element.getAttribute('data-site-i18n');
        if (text[key]) element.textContent = text[key];
      });
    }

    function setOpen(open, returnFocus) {
      nav.classList.toggle('nav-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (mobileQuery.matches) setFocusable(links, open);
      else {
        if ('inert' in links) links.inert = false;
        links.removeAttribute('aria-hidden');
      }
      paintLabel();
      if (returnFocus) button.focus();
    }

    function syncBreakpoint() {
      setOpen(false, false);
    }

    button.addEventListener('click', function () {
      setOpen(!isOpen(), false);
    });

    links.addEventListener('click', function (event) {
      if (event.target.closest('a') && mobileQuery.matches) setOpen(false, false);
    });

    document.addEventListener('click', function (event) {
      if (mobileQuery.matches && isOpen() && !nav.contains(event.target)) {
        setOpen(false, false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileQuery.matches && isOpen()) {
        setOpen(false, true);
      }
    });

    document.addEventListener('langchange', paintLabel);
    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', syncBreakpoint);
    } else {
      mobileQuery.addListener(syncBreakpoint);
    }

    setOpen(false, false);
  }

  function refresh() {
    document.querySelectorAll('.site-nav').forEach(enhance);
  }

  window.SiteNavigation = { refresh: refresh };
  refresh();
})();
