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
Badge
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigation } from "react-router-dom";
import "./assets/Style.css";
import { useLocation } from "react-router-dom";
const Places = () => {

  const navigate = useNavigate();
const { state } = useLocation();

// const navigationCurrentLocation = state?.currentLocation;
const navigationCurrentLocation =
  state?.currentLocation ||
  JSON.parse(localStorage.getItem("currentLocation"));
const [nearestLocations, setNearestLocations] = useState([]);


  const [locations, setLocations] = useState([])
  
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

  // const API ="https://tourismdbexpress.onrender.com";
const API ="http://localhost:5000"
useEffect(() => {
  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        `${API}/api/locations/findGroupLocation`
      );
console.log("nearest locations",res.data);
      setLocations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchLocations();
}, []);

if (!navigationCurrentLocation) {
  return (
    <Container className="pt-5 text-center">
      <h4>Current location not available.</h4>
      <Button onClick={() => navigate("/")}>
        Go Back
      </Button>
    </Container>
  );
}
const findNearestLocations = () => {
  if (!navigationCurrentLocation) return;

  const allLocations = Object.values(locations).flat();

  const nearby = allLocations
    // Remove the current location
    .filter(loc => loc._id !== navigationCurrentLocation._id)

    // Calculate distance from current location
    .map(loc => ({
      ...loc,
      distance: getDistance(
        Number(navigationCurrentLocation.latitude),
        Number(navigationCurrentLocation.longitude),
        Number(loc.latitude),
        Number(loc.longitude)
      )
    }))

    // Sort nearest first
    .sort((a, b) => a.distance - b.distance);

  // Show only the nearest location
  if (nearby.length > 0) {
    setNearestLocations([nearby[0]]);
  } else {
    setNearestLocations([]);
  }
};

  //route
  const openRouteMap = async (destinationLat, destinationLng) => {
    try {
  
      const url = `https://www.google.com/maps/dir/?api=1&origin=${navigationCurrentLocation.latitude},${navigationCurrentLocation.longitude}&destination=${destinationLat},${destinationLng}&travelmode=driving`;

  window.open(url, "_blank");
    } catch (err) {
      console.error(err);

      // Fallback if user denies location permission
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;

      window.open(url, "_blank");
    }
  };

useEffect(() => {
  if (
    navigationCurrentLocation &&
    Object.keys(locations).length > 0
  ) {
    findNearestLocations();
  }
}, [locations, navigationCurrentLocation]);

  return (

  <Container
  fluid
  className="places-page"
  style={{ paddingTop: "7em" }}
>
  <h3 className="mb-4">Nearest Tourist Places</h3>

  {nearestLocations.length === 0 ? (
    <p className="text-center">No nearby locations found.</p>
  ) : (
    nearestLocations.map((loc) => (
      <Card
        key={loc._id}
        className="mb-3 shadow-sm"
      >
        <Row className="g-0 align-items-center">
          {/* Image */}
          <Col md={4}>
            <CardImg
              src={`${API}/uploads/${loc.Img}`}
              style={{
                height: "220px",
                objectFit: "cover",
              }}
            />
          </Col>

          {/* Details */}
          <Col md={8}>
            <CardBody>
              <CardTitle>{loc.name}</CardTitle>

              <CardText>{loc.desc}</CardText>

              <Badge bg="success" className="mb-3">
                {loc.distance.toFixed(2)} km away
              </Badge>

              <div>
                <Button
                  variant="success"
                  onClick={() =>
                    openRouteMap(
                      loc.latitude,
                      loc.longitude
                    )
                  }
                >
                  Route Map
                </Button>
              </div>
            </CardBody>
          </Col>
        </Row>
      </Card>
    ))
  )}
</Container>

  );

};

export default Places;