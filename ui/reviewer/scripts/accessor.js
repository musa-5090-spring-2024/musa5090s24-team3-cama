//console.log("hello");

const mapboxAccessToken =
  "pk.eyJ1IjoieGlhb2Zhbi05OCIsImEiOiJjbG1tYTUyeDYwZ3Z0MnJsMXp5bzlhbmhuIn0.o4NFKmmhKwaWErRm16MjHA"; // Replace this with your Mapbox access token

// initialize map
const map = L.map("map").setView([39.952583, -75.165222], 12);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/xiaofan-98/cltnsajw4028d01qe473s5rio/tiles/{z}/{x}/{y}?access_token=" +
    mapboxAccessToken,
  {
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    attribution:
      'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a>',
  }
).addTo(map);

var allPercChanges = [];

var vectorTileStyling = {
  property_tile_info: (properties, zoom) => {
    // console.log("hello");
    var current_value = properties.current_assessed_value;
    var tax_year_value = properties.tax_year_assessed_value;
    var perc_change = ((current_value - tax_year_value) / tax_year_value) * 100;

    // Initialize a Set to store perc_change values
    if (!vectorTileStyling.uniquePercChanges) {
      vectorTileStyling.uniquePercChanges = new Set();
    }

    // Add perc_change value to the array
    allPercChanges.push(perc_change);

    //console.log(perc_change);

    // Define color breaks
    var colorFill;
    if (perc_change < 0.01) {
      colorFill = "#88e8ff"; // Assign red color for perc_change < 0.01
    } else if (perc_change < 0.1) {
      colorFill = "#51a9ff"; // Assign orange color for 0.01 <= perc_change < 0.1
    } else if (perc_change < 1) {
      colorFill = "#1c67ff"; // Assign yellow color for 0.1 <= perc_change < 1
    } else {
      colorFill = "#0000ff"; // Assign green color for perc_change >= 1
    }

    // Log the fillColor being applied along with perc_change
    //console.log("perc_change:", perc_change, "FillColor:", colorFill);

    // Return the style object
    return {
      fill: true,
      fillColor: colorFill,
      fillOpacity: 0.8, // Adjust opacity as needed
      stroke: true,
      color: "#e2e2e2", // Add border color
      weight: 0.5, // Add border width
      opacity: 1,
    };
  },
};

const url =
  "https://storage.googleapis.com/musa5090s24_team3_public/tiles/properties/{z}/{x}/{y}.pbf";

var mapboxVectorTileOptions = {
  rendererFactory: L.canvas.tile,
  bounds: [
    [40.13623451097302, -75.2886199951172],
    [39.87957627231338, -74.95971679687501],
  ],
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/about/maps/">MapBox</a>',
  vectorTileLayerStyles: vectorTileStyling,
  //	token: 'pk.eyJ1IjoiaXZhbnNhbmNoZXoiLCJhIjoiY2l6ZTJmd3FnMDA0dzMzbzFtaW10cXh2MSJ9.VsWCS9-EAX4_4W1K-nXnsA'
};

var vectorGrid = L.vectorGrid.protobuf(url, mapboxVectorTileOptions).addTo(map);

map.vectorGrid = vectorGrid;
