const API_KEY = 'AIzaSyAZ25gcNU4PpYAm2_41lho9iVgXB2fIyyE'; // <-- Pega tu API Key aquí

const origen = 'Fuerte Bulnes 1720, San Ramón, Región Metropolitana, Chile';
const destino = 'Lo Barnechea, Región Metropolitana, Chile';

async function obtenerRuta() {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}&mode=driving&key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status !== 'OK') {
        throw new Error(`Error en directions: ${data.status}`);
      }
  
      const ruta = data.routes[0];
      const leg = ruta.legs[0];
  
      const output = {
        geocoder_status: data.status,
        origin: {
          name: leg.start_address,
          lat: leg.start_location.lat,
          lon: leg.start_location.lng
        },
        destination: {
          name: leg.end_address,
          lat: leg.end_location.lat,
          lon: leg.end_location.lng
        },
        route: {
          km: +(leg.distance.value / 1000).toFixed(2),
          street: ruta.summary || "Ruta principal",
          type: "Driving",
          duration: leg.duration.text,
          linkMap: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}&travelmode=driving`
        },
      };
  
      console.log(JSON.stringify(output, null, 2));
  
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  obtenerRuta();