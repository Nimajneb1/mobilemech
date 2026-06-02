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


document.querySelectorAll('[data-quote-form]').forEach((form) => {
  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.parentElement.querySelector('[data-form-status]');
  const originalButtonHtml = submitButton ? submitButton.innerHTML : '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    if (status) {
      status.textContent = '';
      status.classList.remove('is-error');
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Form submission failed');

      const selectedService = form.querySelector('select[name="service"]')?.value || '';
      const conversion = selectedService.toLowerCase().includes('diagnostic') ? 'diagnostic' : 'service';
      window.location.assign(`thank-you.html?conversion=${encodeURIComponent(conversion)}`);
    } catch (error) {
      if (status) {
        status.textContent = 'Your request could not be sent. Please try again or call 020 4110 4094.';
        status.classList.add('is-error');
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHtml;
      }
    }
  });
});
