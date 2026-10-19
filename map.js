// Interactive trip map. Pins come from the trip cards' data-lat/data-lng,
// so adding a card with coordinates adds it to the map too.
(function () {
  var mapEl = document.getElementById('trip-map');
  if (!mapEl || typeof L === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = Array.prototype.slice.call(document.querySelectorAll('.card[data-lat]'));

  mapEl.innerHTML = '';
  var map = L.map(mapEl, {
    scrollWheelZoom: false, // don't hijack page scrolling; enabled once the map is clicked
    worldCopyJump: true,
    minZoom: 2,
    zoomSnap: 0.5
  });

  // OpenStreetMap's standard tiles: free for low-traffic sites, no API key, attribution required
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.on('click', function () { map.scrollWheelZoom.enable(); });
  mapEl.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });

  var pin = L.divIcon({
    className: 'map-pin',
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12]
  });

  function text(el, selector) {
    var node = el.querySelector(selector);
    return node ? node.textContent.trim() : '';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  var markers = cards.map(function (card) {
    var latlng = [parseFloat(card.dataset.lat), parseFloat(card.dataset.lng)];
    var name = text(card, 'h3');
    var rows = card.querySelectorAll('.redemption dt');
    var details = Array.prototype.map.call(rows, function (dt) {
      return '<dt>' + escapeHtml(dt.textContent) + '</dt><dd>' + escapeHtml(dt.nextElementSibling.textContent) + '</dd>';
    }).join('');

    var marker = L.marker(latlng, { icon: pin, title: name, alt: name, keyboard: true })
      .addTo(map)
      .bindPopup(
        '<div class="map-popup"><h3>' + escapeHtml(name) + '</h3>' +
        '<p>' + escapeHtml(text(card, '.card-body p')) + '</p>' +
        '<dl>' + details + '</dl></div>',
        { maxWidth: 260 }
      );

    // "Show on map" button on each trip card
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'map-link';
    button.textContent = 'Show on map';
    button.addEventListener('click', function () {
      document.getElementById('map').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      if (reduceMotion) {
        map.setView(latlng, 5);
        marker.openPopup();
      } else {
        map.flyTo(latlng, 5, { duration: 1.2 });
        map.once('moveend', function () { marker.openPopup(); });
      }
    });
    card.querySelector('.card-body').appendChild(button);

    return marker;
  });

  var bounds = L.featureGroup(markers).getBounds();
  function fitAll() { map.fitBounds(bounds, { padding: [40, 40], maxZoom: 4 }); }
  fitAll();

  // Small "show all trips" control to zoom back out
  var ResetControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function () {
      var btn = L.DomUtil.create('button', 'map-reset');
      btn.type = 'button';
      btn.textContent = 'All trips';
      L.DomEvent.disableClickPropagation(btn);
      L.DomEvent.on(btn, 'click', function () { map.closePopup(); fitAll(); });
      return btn;
    }
  });
  map.addControl(new ResetControl());
})();
