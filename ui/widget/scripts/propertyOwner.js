console.log('hello');

// Initialize the map
var mymap = L.map('map').setView([51.505, -0.09], 13);

// Add the base tile layer (in this case, OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(mymap);

// Add a marker to the map
L.marker([51.5, -0.09]).addTo(mymap)
    .bindPopup('A sample marker!').openPopup();