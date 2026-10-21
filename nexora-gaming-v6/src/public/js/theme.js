(() => {
  'use strict';

  try {
    const savedTheme = localStorage.getItem('nexora-theme-v6') || localStorage.getItem('nexora-theme-v5');
    const dark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? '#07111f' : '#d8f8fb';
  } catch (_error) {
    document.documentElement.dataset.theme = 'light';
  }
})();