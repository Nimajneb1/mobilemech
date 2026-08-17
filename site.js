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

const serviceMapNode = document.querySelector('#auckland-service-map');
if (serviceMapNode) {
  const mapStatus = document.querySelector('[data-map-status]');
  const regionButtons = Array.from(document.querySelectorAll('[data-map-region]'));
  const regionLayers = new Map();
  let serviceMap;

  const setActiveRegion = (name) => {
    regionButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.mapRegion === name);
    });
  };

  const openRegion = (name) => {
    const layer = regionLayers.get(name);
    if (!layer) return;
    const feature = layer.feature;
    const { label_lat: labelLat, label_lng: labelLng } = feature.properties;
    layer.openPopup([labelLat, labelLng]);
    serviceMap.panTo([labelLat, labelLng], { animate: true });
    setActiveRegion(name);
  };

  if (typeof window.L === 'undefined') {
    if (mapStatus) mapStatus.textContent = 'The service-area map could not load. Use the area list to continue to booking.';
    regionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        window.location.href = `booking.html?region=${encodeURIComponent(button.dataset.mapRegion)}`;
      });
    });
  } else {
    serviceMap = L.map(serviceMapNode, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(serviceMap);

    fetch(serviceMapNode.dataset.geojson)
      .then((response) => {
        if (!response.ok) throw new Error('Service-area data could not be loaded');
        return response.json();
      })
      .then((geojson) => {
        const serviceAreas = L.geoJSON(geojson, {
          style: (feature) => ({
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillColor: feature.properties.colour,
            fillOpacity: .62
          }),
          onEachFeature: (feature, layer) => {
            const { name, suburbs, label_lat: labelLat, label_lng: labelLng } = feature.properties;
            const bookingUrl = `booking.html?region=${encodeURIComponent(name)}`;
            layer.bindPopup(`<div class="coverage-popup"><strong>${name}</strong><p>${suburbs}</p><a class="btn btn-primary" href="${bookingUrl}">Book in ${name}</a></div>`, {
              closeButton: true,
              offset: [0, -4]
            });
            layer.bindTooltip(name, {
              permanent: true,
              direction: 'center',
              className: 'coverage-label'
            }).openTooltip([labelLat, labelLng]);
            layer.on({
              mouseover: () => layer.setStyle({ weight: 3, fillOpacity: .78 }),
              mouseout: () => layer.setStyle({ weight: 2, fillOpacity: .62 }),
              click: () => {
                setActiveRegion(name);
                if (mapStatus) mapStatus.textContent = `${name} selected. Use the booking button in the map popup.`;
              },
              popupclose: () => setActiveRegion('')
            });
            regionLayers.set(name, layer);
          }
        }).addTo(serviceMap);

        serviceMap.fitBounds(serviceAreas.getBounds(), { padding: [20, 20] });
        regionButtons.forEach((button) => {
          button.addEventListener('click', () => openRegion(button.dataset.mapRegion));
        });
        window.addEventListener('resize', () => serviceMap.invalidateSize());
      })
      .catch(() => {
        serviceMap.setView([-36.92, 174.76], 9);
        if (mapStatus) mapStatus.textContent = 'The service-area outlines could not load. You can still use the area list to book.';
        regionButtons.forEach((button) => {
          button.addEventListener('click', () => {
            window.location.href = `booking.html?region=${encodeURIComponent(button.dataset.mapRegion)}`;
          });
        });
      });
  }
}

const requestedRegion = params.get('region');
if (requestedRegion) {
  document.querySelectorAll('input[name="location"]').forEach((input) => {
    if (!input.value) input.value = requestedRegion;
  });
}
