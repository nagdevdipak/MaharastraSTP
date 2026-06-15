// import React, { useEffect, useRef, useState } from "react";

// const LocationTracker = () => {
//   const mapRef = useRef(null);
//   const searchInputRef = useRef(null);

//   const [map, setMap] = useState(null);
//   const [marker, setMarker] = useState(null);

//   const [locationData, setLocationData] = useState({
//     latitude: "",
//     longitude: "",
//     address: "",
//   });

//   // Load Google Map
//   useEffect(() => {
//     if (!window.google) return;

//     // Default Location
//     const defaultCenter = {
//       lat: 18.5204,
//       lng: 73.8567, // Pune
//     };

//     const googleMap = new window.google.maps.Map(mapRef.current, {
//       center: defaultCenter,
//       zoom: 12,
//     });

//     setMap(googleMap);

//     // Marker
//     const googleMarker = new window.google.maps.Marker({
//       position: defaultCenter,
//       map: googleMap,
//       draggable: true,
//     });

//     setMarker(googleMarker);

//     // Click on map
//     googleMap.addListener("click", (event) => {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();

//       updateLocation(lat, lng, googleMap, googleMarker);
//     });

//     // Drag marker
//     googleMarker.addListener("dragend", (event) => {
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();

//       updateLocation(lat, lng, googleMap, googleMarker);
//     });

//     // Search Box
//     const autocomplete = new window.google.maps.places.Autocomplete(
//       searchInputRef.current
//     );

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();

//       if (!place.geometry) return;

//       const lat = place.geometry.location.lat();
//       const lng = place.geometry.location.lng();

//       updateLocation(lat, lng, googleMap, googleMarker);

//       googleMap.panTo({ lat, lng });
//       googleMap.setZoom(15);
//     });

//     // Current Location
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;

//         updateLocation(lat, lng, googleMap, googleMarker);

//         googleMap.panTo({ lat, lng });
//       },
//       (err) => {
//         console.error("Geolocation Error:", err);
//       }
//     );
//   }, []);

//   // Update location
//   const updateLocation = (lat, lng, googleMap, googleMarker) => {
//     const position = { lat, lng };

//     googleMarker.setPosition(position);

//     const geocoder = new window.google.maps.Geocoder();

//     geocoder.geocode({ location: position }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         setLocationData({
//           latitude: lat,
//           longitude: lng,
//           address: results[0].formatted_address,
//         });
//       }
//     });
//   };

//   return (
//     <div style={{ width: "100%", padding: "20px" }}>
//       <h2>Select Location</h2>

//       {/* Search Input */}
//       <input
//         ref={searchInputRef}
//         type="text"
//         placeholder="Search location"
//         style={{
//           width: "100%",
//           padding: "10px",
//           marginBottom: "10px",
//           border: "1px solid #ccc",
//           borderRadius: "5px",
//         }}
//       />

//       {/* Google Map */}
//       <div
//         ref={mapRef}
//         style={{
//           width: "100%",
//           height: "500px",
//           borderRadius: "10px",
//         }}
//       />

//       {/* Location Details */}
//       <div style={{ marginTop: "20px" }}>
//         <h4>Selected Location</h4>

//         <p>
//           <strong>Latitude:</strong> {locationData.latitude}
//         </p>

//         <p>
//           <strong>Longitude:</strong> {locationData.longitude}
//         </p>

//         <p>
//           <strong>Address:</strong> {locationData.address}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LocationTracker;



import React, {
  useEffect,
  useMemo,
  useState
} from "react";

function LocationTracker() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  // -----------------------------------
  // Fake Search API
  // -----------------------------------

  const fetchSearchResults = async (searchText) => {

    console.log("API CALL:", searchText);

    // Fake Data
    const data = Array.from(
      { length: 10 },
      (_, i) => `${searchText} Result ${i + 1}`
    );

    setResults(data);
  };

  // -----------------------------------
  // Debounce Function
  // -----------------------------------

  function debounce(fn, delay) {

    let timer;

    return (...args) => {

      clearTimeout(timer);

      timer = setTimeout(() => {
        fn(...args);
      }, delay);

    };
  }

  // -----------------------------------
  // Debounced Search
  // -----------------------------------

  const debouncedSearch = useMemo(() =>
    debounce(fetchSearchResults, 500),
    []
  );

  // -----------------------------------
  // Handle Input
  // -----------------------------------

  const handleChange = (e) => {

    const value = e.target.value;

    setQuery(value);

    debouncedSearch(value);
  };

  // -----------------------------------
  // Throttle Function
  // -----------------------------------

  function throttle(fn, limit) {

    let flag = true;

    return (...args) => {

      if (!flag) return;

      fn(...args);

      flag = false;

      setTimeout(() => {
        flag = true;
      }, limit);

    };
  }

  // -----------------------------------
  // Load More Data
  // -----------------------------------

  const loadMore = () => {

    console.log("Loading More Data...");

    const moreData = Array.from(
      { length: 5 },
      (_, i) => `Page ${page} Item ${i + 1}`
    );

    setResults((prev) => [...prev, ...moreData]);

    setPage((prev) => prev + 1);
  };

  // -----------------------------------
  // Throttled Scroll
  // -----------------------------------

  const throttledScroll = useMemo(() =>
    throttle(() => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        loadMore();
      }

    }, 1000),
    [page]
  );

  // -----------------------------------
  // Scroll Event
  // -----------------------------------

  useEffect(() => {

    window.addEventListener(
      "scroll",
      throttledScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        throttledScroll
      );
    };

  }, [throttledScroll]);

  return (

    <div style={{ padding: "20px" }}>

      <h2>Search Engine</h2>

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        style={{
          padding: "10px",
          width: "300px"
        }}
      />

      {/* RESULTS */}
      <div style={{ marginTop: "20px" }}>

        {
          results.map((item, index) => (

            <div
              key={index}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                marginBottom: "10px"
              }}
            >
              {item}
            </div>

          ))
        }

      </div>

    </div>
  );
}


export default LocationTracker;