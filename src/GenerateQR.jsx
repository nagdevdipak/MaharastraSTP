import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import {
  Card,
  CardImg,
  Row,
  Col
} from "react-bootstrap";
import { useRef } from "react";

// const API = "http://localhost:5000"
function GenerateQR({ location, onLocationFound }) {
 const [currentLocation, setCurrentLocation] = useState(location || null);

 const API = "https://tourismdbexpress.onrender.com";
 
const locationFound = useRef(false);
  // Haversine Distance
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  

    // Get GPS
  useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(
    
    async (position) => {
       if (location) {
    setCurrentLocation(location);
    return;
  }
      const { latitude, longitude, accuracy } = position.coords;

      console.log("Accuracy:", accuracy);

      // Wait until GPS becomes accurate
      if (accuracy > 150) return;
if (locationFound.current) return;
      try {
        const res = await axios.get(`${API}/api/locations/findAll`);
        const locations = res.data.data;
if (!locations || locations.length === 0) {
  console.log("No locations found.");
  return;
}
     const MAX_DISTANCE = 0.2; // 200 meters

let matchedLocation = null;
let minDistance = Infinity;

locations.forEach((loc) => {
  const distance = getDistance(
    latitude,
    longitude,
    Number(loc.latitude),
    Number(loc.longitude)
  );

  console.log(
    `${loc.name}: ${(distance * 1000).toFixed(2)} meters`
  );

  if (distance < minDistance) {
    minDistance = distance;
    matchedLocation = loc;
  }
});

// User is not inside any tourist location
if (!matchedLocation || minDistance > MAX_DISTANCE) {
    setLoading(false);
    return;
}

locationFound.current = true;

if (!locations || locations.length === 0) {
  console.log("No locations found.");
  return;
}
setCurrentLocation(matchedLocation);

localStorage.setItem(
  "currentLocation",
  JSON.stringify(matchedLocation)
);

onLocationFound?.(matchedLocation);

navigator.geolocation.clearWatch(watchId);

      } catch (err) {
        console.error(err);
      }
    },
    (err) => console.error(err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, [API,onLocationFound]);


if (!currentLocation) {
  return <p>Finding current tourist location...</p>;
}

  const url =
    `${window.location.origin}/registration` +
    `?locationId=${currentLocation._id}` +
    `&lat=${currentLocation.latitude}` +
    `&lng=${currentLocation.longitude}` +
    `&name=${encodeURIComponent(currentLocation.name)}`;

  console.log("QR URL:", url);

return (
  <Card  className="d-flex justify-content-center">

    <Row >

      {/* LEFT */}

      <Col md={6} className="text-center">

        <QRCodeCanvas
          value={url}
          size={180}
          includeMargin
        />

        <p className="fw-bold mt-3">
          Scan to Register
        </p>

      </Col>

      {/* RIGHT */}

      <Col md={6}>

   <CardImg
          src={`${API}/uploads/${currentLocation.Img}`}
          style={{
            height: 180,
            objectFit: "cover",
            borderRadius: 12
          }}
        />

        <h3 className="mt-3">
          {currentLocation.name}
        </h3>

    
      </Col>

    </Row>

  </Card>
);
}

export default GenerateQR;