(() => {
  const dialog = document.getElementById('paper-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = document.getElementById('paper-lightbox-image');
  const title = document.getElementById('paper-lightbox-title');
  let trigger;
  document.querySelectorAll('.paper-image').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      image.src = link.href;
      image.alt = link.dataset.caption;
      title.textContent = link.dataset.caption;
      dialog.showModal();
    });
  });
  document.getElementById('close-paper-lightbox').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => trigger?.focus({preventScroll:true}));
})();
