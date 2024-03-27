console.log('hello');

const mapboxAccessToken = 'pk.eyJ1IjoieGlhb2Zhbi05OCIsImEiOiJjbG1tYTUyeDYwZ3Z0MnJsMXp5bzlhbmhuIn0.o4NFKmmhKwaWErRm16MjHA'; // Replace this with your Mapbox access token

// initialize map
const map = L.map('map').setView([39.952583, -75.165222], 12);

L.tileLayer('https://api.mapbox.com/styles/v1/xiaofan-98/cltnsajw4028d01qe473s5rio/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>'
}).addTo(map);
