const toggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}
document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
const quoteForm = document.querySelector('[data-quote-form]');
if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const body = [
      'Hi Mobile Mech,', '', 'I would like to request a quote.', '',
      `Name: ${data.get('name') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Service: ${data.get('service') || ''}`,
      `Vehicle: ${data.get('vehicle') || ''}`,
      `Location: ${data.get('location') || ''}`, '',
      'Details:', data.get('details') || ''
    ].join('\n');
    const subject = encodeURIComponent(`Quote request: ${data.get('service') || 'Mobile mechanic service'}`);
    window.location.href = `mailto:nzmobilemech@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  });
}
