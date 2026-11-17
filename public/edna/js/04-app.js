document.querySelectorAll('.jump button').forEach(b => b.addEventListener('click', () => { at = screens.indexOf(b.dataset.jump); window.scrollTo({ top: 0 }); render(); }));
loadSettings(); applySettings(); render();
