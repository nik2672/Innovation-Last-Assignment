// MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography, Box } from '@mui/material'; // Import Typography and Box

const customIcon = new L.Icon({   
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function MapComponent({ postcode }) {
  const [coords, setCoords] = useState({ lat: -37.8136, lng: 144.9631 }); // Default to Melbourne CBD

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${postcode},Australia&key=c561a3eedffe482fa6d33d8553b0d864`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry;
          setCoords({ lat: location.lat, lng: location.lng });
        } else {
          console.error('No results found for this postcode.');
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    if (postcode) {
      fetchCoordinates();
    }
  }, [postcode]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Postcode Location
      </Typography>
      <MapContainer center={[coords.lat, coords.lng]} zoom={10} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"//we kept teh copy wright information and contirbutions because out map kept breaking
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[coords.lat, coords.lng]} icon={customIcon} />
      </MapContainer>
    </Box>
  );
}

export default MapComponent;
