'use strict';

(function () {
  // Theme toggle
  var themeToggle = document.getElementById('theme-toggle');
  var storedTheme = localStorage.getItem('tv-theme');
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tv-theme', next);
    });
  }

  // Mobile menu
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mainNav = document.getElementById('main-nav');

  if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', function () {
      var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('open');
    });
  }

  // Homepage search
  var searchInput = document.getElementById('tool-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase().trim();
      var cards = document.querySelectorAll('.tool-card');
      cards.forEach(function (card) {
        var title = card.getAttribute('data-title') || '';
        if (!query || title.indexOf(query) !== -1) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // FAQ toggles
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', function () {
        item.classList.toggle('open');
      });
    }
  });
})();
