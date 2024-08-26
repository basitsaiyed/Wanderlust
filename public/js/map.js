mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates,
    zoom: 9
});

// Create a DOM element for the custom marker
const el = document.createElement('div');
el.className = 'custom-marker';

// Add the Font Awesome house icon initially
el.innerHTML = '<i class="fa-solid fa-house"></i>';

// Add the custom marker to the map
const marker = new mapboxgl.Marker(el)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.title}</h4> <p>Exact location will be provided after booking</p>`))
    .addTo(map);

// Handle hover effect to change icon
el.addEventListener('mouseover', () => {
    el.classList.add('hover-icon');
});

el.addEventListener('mouseout', () => {
    el.classList.remove('hover-icon');
});
