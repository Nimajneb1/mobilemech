const toggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
  }));
}
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
const params = new URLSearchParams(window.location.search);
const requestedService = params.get('service');
document.querySelectorAll('select[name="service"]').forEach((select) => {
  if (!requestedService) return;
  const options = Array.from(select.options);
  const match = options.find((option) => option.text.toLowerCase() === requestedService.toLowerCase());
  if (match) select.value = match.value;
});
