// src/Context/LocationContext.jsx

import { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    const saved = localStorage.getItem("currentLocation");
    return saved ? JSON.parse(saved) : null;
  });

  const updateLocation = (location) => {
    setCurrentLocation(location);
    localStorage.setItem(
      "currentLocation",
      JSON.stringify(location)
    );
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        updateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () =>
  useContext(LocationContext);