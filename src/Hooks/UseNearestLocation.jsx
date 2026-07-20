import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://tourismdbexpress.onrender.com";

export default function useNearestLocation() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    const fetchNearestLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          )
        );

        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const res = await axios.get(
          `${API}/api/locations/findAll`
        );

        const locations = res.data.data;

        if (!Array.isArray(locations) || locations.length === 0) {
          setLoading(false);
          return;
        }

        let nearest = locations[0];
        let minDistance = Infinity;

        locations.forEach((loc) => {
          const dist = getDistance(
            userLat,
            userLng,
            Number(loc.latitude),
            Number(loc.longitude)
          );

          if (dist < minDistance) {
            minDistance = dist;
            nearest = {
              ...loc,
              distance: dist,
            };
          }
        });

        setNearestLocation(nearest);

        localStorage.setItem(
          "currentLocation",
          JSON.stringify(nearest)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearestLocation();
  }, []);

  return {
    nearestLocation,
    loading,
  };
}