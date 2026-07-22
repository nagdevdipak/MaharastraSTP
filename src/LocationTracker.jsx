import { useEffect, useRef } from "react";
import axios from "axios";
import { useLocationContext } from "../src/Context/LocationContext";

function LocationTracker() {
  const { updateLocation } = useLocationContext();

  const API = "http://localhost:5000";
  const locationFound = useRef(false);

  // Haversine Distance (km)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        if (locationFound.current) return;

        const { latitude, longitude, accuracy } = position.coords;

        console.log("GPS Accuracy:", accuracy);

        // Wait until GPS becomes accurate
        if (accuracy > 150) return;

        try {
          const res = await axios.get(`${API}/api/locations/findAll`);
          const locations = res.data.data;

          if (!locations || locations.length === 0) {
            console.log("No tourist locations found.");
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

          // User is outside every tourist location
          if (!matchedLocation || minDistance > MAX_DISTANCE) {
            return;
          }

          locationFound.current = true;

          console.log("Matched Location:", matchedLocation);

          // Update Context (also saves to localStorage)
          updateLocation(matchedLocation);

          navigator.geolocation.clearWatch(watchId);
        } catch (err) {
          console.error("LocationTracker Error:", err);
        }
      },
      (err) => {
        console.error("Geolocation Error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [updateLocation]);

  return null;
}

export default LocationTracker;