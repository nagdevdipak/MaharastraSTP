import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Button,
  Container,
  Row, Form,
  Col,
  Dropdown,
  Badge,
  Modal,
  ModalBody
} from "react-bootstrap";

import {
  FaClock,
  FaRupeeSign,
  FaDownload
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import "./assets/Style.css";

const Places = () => {

  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestLocations, setNearestLocations] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const [locations, setLocations] = useState([])
   const [city, setCity] = useState("");
   const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  // const [citySearch, setCitySearch] = useState(city);
const [weather, setWeather] = useState(null);

  const FetchLocationInfo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations/findGroupLocation");

      const data = res.data.data;
      console.log(data)
      setLocations(data);

      const firstCity = Object.keys(data)[0];
      setCity(firstCity || "");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    FetchLocationInfo();
  }, []);

  const cities = Object.keys(locations);

  const selectedPlaces = city ? locations[city] || [] : [];

  const types = [
    "all",
    ...new Set(selectedPlaces.map((item) => item.type).filter(Boolean)),
  ];

  const filteredPlaces =
    filter === "all"
      ? selectedPlaces
      : selectedPlaces.filter(
        (item) => item.type?.toLowerCase() === filter.toLowerCase()
      );

  const visiblePlaces = showAll
    ? filteredPlaces
    : filteredPlaces.slice(0, 2);

  //QR code
  const downloadQR = (index, name) => {

    const canvas = document.getElementById(`qr-${index}`);

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");

    downloadLink.href = pngUrl;

    downloadLink.download = `${name}-QR.png`;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

  };

  navigator.permissions.query({ name: "geolocation" })
    .then((result) => {
      console.log(result.state);

      if (result.state === "granted") {
        console.log("Location allowed");
      }

      if (result.state === "prompt") {
        console.log("Permission not decided");
      }

      if (result.state === "denied") {
        console.log("Location blocked");
      }
    });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Please allow location access.");
          break;

        case error.POSITION_UNAVAILABLE:
          alert("Location information unavailable.");
          break;

        case error.TIMEOUT:
          alert("Location request timed out.");
          break;

        default:
          alert("Unknown error occurred.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );

  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => reject(err)
      );
    });

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };




  const findNearestLocations = async () => {
    try {
      const userLocation = await getUserLocation();

      // Convert grouped object into single array
      const allLocations = Object.values(locations).flat();

      const locationsWithDistance = allLocations.map((loc) => ({
        ...loc,
        distance: getDistance(
          userLocation.lat,
          userLocation.lng,
          Number(loc.latitude),
          Number(loc.longitude)
        ),
      }));


      const sortedLocations = locationsWithDistance
        .filter((loc) => loc.distance <= 50)
        .sort((a, b) => a.distance - b.distance);

      if (sortedLocations.length > 0) {
        // Current place card
        setCurrentLocation(sortedLocations[0]);
getWeather(
  sortedLocations[0].latitude,
  sortedLocations[0].longitude
);
        // Nearby places for modal
        setNearestLocations(sortedLocations.slice(1));

        // Optional: store in localStorage
        localStorage.setItem(
          "currentLocation",
          JSON.stringify(sortedLocations[0])
        );
      }
    } catch (err) {
      console.error(err);

      alert("Unable to get your current location.");
    }
  };

  const currentplaceCard = localStorage.getItem("currentLocation")
  console.log("current place", currentplaceCard)
  //route
  const openRouteMap = async (destinationLat, destinationLng) => {
    try {
      const userLocation = await getUserLocation();

      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;

      window.open(url, "_blank");
    } catch (err) {
      console.error(err);

      // Fallback if user denies location permission
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;

      window.open(url, "_blank");
    }
  };
  useEffect(() => {
    if (Object.keys(locations).length > 0) {
      findNearestLocations();
    }
  }, [locations]);

  const getCityByLocation = (locationName) => {
  const cityKey = Object.keys(locations).find((city) =>
    locations[city].some(
      (loc) =>
        loc.name.trim().toLowerCase() ===
        locationName.trim().toLowerCase()
    )
  );

  return cityKey;
};
const getWeather = async (lat, lon) => {
  try {
    const apiKey = "8b245d9465dfcf15b95504f0456555d7";

    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    console.log("Weather Response:", res.data);

    setWeather(res.data);
  } catch (err) {
    console.log("Weather Error:", err.response?.data || err.message);
  }
};
// async function getWeather(city) {

//     if (!city) return;

//  const apiKey = "8b245d9465dfcf15b95504f0456555d7";

//     const url =
//         `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//     try {

//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.cod != 200) {

//             alert("City not found");

//             return;
//         }

//         // Weather Background
//         changeBackground(data.weather[0].main);

//         // Update UI
//         document.getElementById("cityName").textContent =
//             data.name;

//         document.getElementById("temp").textContent =
//             `${Math.round(data.main.temp)}°C`;

//         document.getElementById("description").textContent =
//             data.weather[0].description;

//         document.getElementById("humidity").textContent =
//             `${data.main.humidity}%`;

//         document.getElementById("wind").textContent =
//             `${data.wind.speed} km/h`;

//         document.getElementById("icon").src =
//             `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

//     }

//     catch (error) {
//     console.error(error);
//     alert(error.message);
// }

// }
  const renderStars = (rating = 0) =>
    "⭐".repeat(rating);
  return (

    <Container
      fluid
      className="places-page overflow-hidden"
      style={{ paddingTop: "7em" }}
    >

      {/* FILTER CARD */}
{/* 
      <Card className="border-0 shadow-lg rounded-4 p-3 mb-4">

        <Row className="align-items-center">

          <Col lg={8}>

            <div className="d-flex flex-wrap gap-2">


              {types.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "success" : "outline-success"}
                  className="rounded-pill px-4"
                  onClick={() => {
                    setFilter(type);
                    setShowAll(false);
                  }}
                >
                  {type.toUpperCase()}
                </Button>
              ))}

            </div>

          </Col>

       

          <Col lg={4}>
            <div className="mt-3 mt-lg-0 position-relative">
              <Form.Control
                type="search"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                list="city-options"
              />

              <datalist id="city-options">
                {cities.map((cityName) => (
                  <option key={cityName} value={cityName.toUpperCase()} />
                ))}
              </datalist>

              <Button
                variant="success"
                className="mt-2"
                onClick={() => {
                  const matchedCity = cities.find(
                    (cityName) => cityName.toLowerCase() === citySearch.toLowerCase()
                  );

                  if (matchedCity) {
                    setCity(matchedCity);

                    // Reset type selection
                    setFilter("all");
                    setShowAll(false);
                  }
                }}
              >
                Search
              </Button>
            </div>

          </Col>

        </Row>

      </Card> */}

      {/* PLACES */}

      <div className="d-flex flex-column gap-4">
        {currentLocation && [currentLocation].map((item, index) => {
          const qrValue = `https://www.google.com/maps?q=${item.latitude},${item.longitude},${item.name}`;

          return (
            <Card
              key={index}
              className="place-card border-0 shadow-sm rounded-4 overflow-hidden"
            >
              <Row className="g-0">
                {/* IMAGE */}
                <Col lg={4} md={5}>
                  <CardImg
                    src={`http://localhost:5000/uploads/${item.Img}`}
                    alt={item.name}
                    className="place-img"
                  />
                </Col>

                {/* DETAILS */}
                <Col lg={6} md={7}>
                  <CardBody className="p-4 h-100 d-flex flex-column">
                    <CardTitle className="fw-bold fs-3 mb-2">
                      {item.name}
                    </CardTitle>
                    <Row>
                      <Col sm={6}>{weather && (
  <div className="border rounded ">
    <div className="d-flex flex-row justify-content-center align-items-center text-center">
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather"
      />

      <div className="ms-3">
        <h4>{Math.round(weather.main.temp)}°C</h4>

        <div className="text-capitalize">
          {weather.weather[0].description}
        </div>

        <small>
          Humidity: {weather.main.humidity}% <br />
          Wind: {weather.wind.speed} km/h
        </small>
      </div>
    </div>
  </div>
)}</Col>
                      <Col sm={6}>
                      <div d-flex jusift-content-center align-items-center item-center>
                        <p><b>lon :</b>{item.longitude.toFixed(2)}</p>
                        <p><b>lat</b>{item.latitude.toFixed(2)}</p>
                        <p><b>Type :</b>{item.type}</p>
                      </div>
                      </Col>

                    </Row>

                    {/* <div className="d-flex flex-wrap gap-4 mb-4 text-start">
                      <div className="fw-semibold ">
                      
                        <h4 >longitude</h4>
                        {item.longitude}
                      </div>

                      <div className="fw-semibold ">
              
                        <h4>latitude</h4>
                        {item.latitude}
                      </div>
                    </div> */}

                    {/* {item.stay?.length > 0 && (
                      <div className="mb-3">

                        <div className="d-flex flex-wrap gap-2">
                          {item.stay.map((stay, i) => (
                            <Badge
                              key={i}
                              bg="light"
                              text="dark"
                              className="px-3 py-2 border"
                            >
                              {stay.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.food?.length > 0 && (
                      <div className="mb-4">

                        <div className="d-flex flex-wrap gap-2">
                          {item.food.map((food, i) => (
                            <Badge
                              key={i}
                              bg="warning"
                              text="dark"
                              className="px-3 py-2"
                            >
                              {food.famousDish}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}

                    <div className="mt-auto text-start">
                   <Button
  variant="success"
  className="rounded-pill px-4"
  onClick={() => {
    const currentCity = getCityByLocation(item.name);

    console.log("Location:", item.name);
    console.log("Matched City:", currentCity);
console.log(item);
    navigate("/services", {
      state: {
        location: item.name,
        city: currentCity,
      },
    });
  }}
>
  Explore Services
</Button>

                      <Button
                        variant="success"
                        className="rounded-pill ms-2 px-4"
                        onClick={async () => {
                          if (!currentLocation) {
                            await findNearestLocations();
                          }
                          setShowModal(true);
                        }}
                      >
                        Find Nearby Places
                      </Button>
                    </div>
                  </CardBody>
                </Col>

                {/* QR */}
                <Col lg={2} md={12}>
                  <div className="qr-box h-100 d-flex flex-column align-items-center justify-content-center p-4">
                    <QRCodeCanvas
                      id={`qr-${index}`}
                      value={qrValue}
                      size={130}
                      includeMargin={true}
                    />

                    <p className="small text-muted text-center mt-2 mb-3">
                      Scan To Open Location
                    </p>

                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="rounded-pill"
                      onClick={() => downloadQR(index, item.name)}
                    >
                      <FaDownload className="me-2" />
                      Download QR
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          );
        })}
      </div>

      {filteredPlaces.length > 2 && (
        <div className="text-center mt-5">
          <Button
            variant="dark"
            className="rounded-pill px-5 py-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "Show More"}
          </Button>
        </div>
      )}

      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nearest Tourist Places</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Row>
            {nearestLocations.map((loc) => (
              <Row key={loc._id} className="mb-3">
                <Col sm={6}> <CardImg
                    variant="top"
                    src={`http://localhost:5000/uploads/${loc.Img}`}
                    style={{ height: "200px", objectFit: "cover" }}
                  /></Col>
                <Col sm={6}>
                  <CardBody>
                    <CardTitle>{loc.name}</CardTitle>

                    <CardText>{loc.desc}</CardText>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Badge bg="success">
                        {loc.distance.toFixed(2)} km away
                      </Badge>

                      <Button
                        variant="success"
                        onClick={() =>
                          openRouteMap(loc.latitude, loc.longitude)
                        }
                      >
                        Route Map
                      </Button>
                    </div>
                  </CardBody></Col>
                
              </Row>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

  );

};

export default Places;