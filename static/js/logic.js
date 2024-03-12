//URL set up for earthquake data
let queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// call or fetch the  earthquake data using D3.js
d3.json(queryURL)
.then(data => {
        const { map, earthquakeLayer } = createMap();
        createMarkers(data, earthquakeLayer);
        createLegend(map); 
    })
    .catch(error => {
        console.error('Error fetching earthquake data:', error);
    });

// creat the map function
function createMap() {
    const map = L.map('map').setView([51.759550, 108.37820], 3);
    // adding base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //overlay layer for data
    const earthquakeLayer = L.layerGroup().addTo(map);

    // Control layer for map layers
    const baseLayer = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
    };

    const overlayLayers = {
        "Earthquakes": earthquakeLayer
};

// Add layer control to the map
    L.control.layers(baseLayer, overlayLayers).addTo(map);
    return { map, earthquakeLayer };
}

//Function for color base on dept
function getColor(depth, magnitude) {
    let depthColor;
    if (depth > 10 && depth <= 20 ) {
        depthColor = "yellow";
    } else if (depth > 20 &&  depth <= 30) {
        depthColor = "green";
    } else if (depth > 30 && depth <= 40) {
        depthColor = "orange";
    } else if (depth > 40 && depth <= 50) {
        depthColor = "blue";
    } else if (depth < 50 && depth <= 90) {
        depthColor = "red";
    } else {
        depthColor = "black";
    }
    return depthColor;
}

    
// create markers & popup
function createMarkers(earthquakeData, earthquakeLayer) {
    earthquakeData.features.forEach(feature => {
        const coordinates = [feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]];
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        const marker = L.circleMarker(coordinates, {
            radius: Math.sqrt(magnitude) * 5,
            fillColor: getColor(depth),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
        marker.bindPopup(`<h3>${feature.properties.place}</h3><p>Magnitude: ${magnitude}<br> Depth: ${depth} km</p>`);

        marker.addTo(earthquakeLayer);
    });    
    }
    
//create Legend
function createLegend(map) {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const depthLabels = ['0-10', '10-20', '20-30', '30-40', '40-50', '50+'];
        const depthColors = ["yellow", "green", "orange", "blue", "red", "black"];

        let legendContent = '<b>Depth Legend (km)</b><br>';

        for (let i = 0; i < depthLabels.length; i++) {
            legendContent +=
                '<i style="background:' + depthColors[i] + '"></i>' +
                depthLabels[i] + ' km<br>';
        }

        div.innerHTML = legendContent;
        return div;
    };

    legend.addTo(map);
}

    

    

