import axios from "axios";
import { nav } from "framer-motion/m";
import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  Card
} from "react-bootstrap";
import { data, useNavigate } from "react-router-dom"
import './index.css'
import './assets/Style.css'
import { useLocation } from "react-router-dom";

const VisitorRegistrationForm = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const qrLocationId = params.get("locationId");

  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  // ✅ Form State

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    locationName: "",
    locationId: ""
  });


  const [formData, setFormData] = useState({
    _id: "",
    full_name: "",
    email: "",
    otp: "",
    mobile: "",
    entry_type: "QR",
    group_size: 1,
    age_group: "",
    gender: "",
    purpose_of_visit: "",
    travel_mode: "",
    location: ""
  });



  // ✅ Handle Input
  const handleChange = (e) => {

    if (e.target.name === "location") {
      const selected = locations.find(loc => loc._id === e.target.value);

      setFormData({
        ...formData,
        location: selected._id,
        location_Name:selected.name,
        latitude: selected.latitude,
        longitude: selected.longitude
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }

  };

  // ✅ Send OTP
  const sendOTP = async () => {
    await axios.post(
      "http://localhost:5000/api/visitor/sendOTP",
      { email: formData.email }
    );
    alert("OTP Sent");
  };
  // console.log("Sending OTP:", otp);
  // ✅ Verify OTP
  const verifyOTP = async () => {
    try {
      console.log("Sending:", {
        email: formData.email,
        otp: otp
      });

      const res = await axios.post(
        "http://localhost:5000/api/visitor/verifyOtp",
        {
          email: formData.email,
          otp: otp   // ✅ THIS WAS MISSING
        }
      );

      alert(res.data.message);

      if (res.data.message.includes("success")) {
        setIsVerified(true);
      }

    } catch (err) {
      console.error("VERIFY ERROR:", err.response?.data);
      alert(err.response?.data?.message || "OTP failed");
    }
  };

  useEffect(() => {
    if (!qrLocationId || locations.length === 0) return;

    const matched = locations.find(l => l._id === qrLocationId);

    if (matched) {
      setFormData(prev => ({
        ...prev,
        location: matched._id,
        location_Name :matched.name,
        latitude: matched.latitude,
        longitude: matched.longitude
      }));
    }
  }, [qrLocationId, locations]);

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
  // ✅ Final Save
  const registerVisitor = async (e) => {
    e.preventDefault();

    try {
      // 1. Get user GPS
      const pos = await getUserLocation();

      const userLat = pos.lat;
      const userLng = pos.lng;

      // 2. Compare with selected location
      const distance = getDistance(
        userLat,
        userLng,
        formData.latitude,
        formData.longitude
      );

      console.log("Distance:", distance);

      // 3. Set radius (example 0.5 km)
      if (distance > 0.5) {
        alert("❌ You are not at the correct location");
        return;
      }

      // 4. If OK → register
      const res = await axios.post(
        "http://localhost:5000/api/visitor/register",
        formData
      );
    const visitor = res.data.data;
//  console.log("current location",res.data.data.location?.name)



localStorage.setItem(
  "currentVisitor",
  JSON.stringify({
    _id: visitor._id,
    full_name: visitor.full_name,
    email: visitor.email,
    mobile: visitor.mobile,
    location:visitor.location._id,
    group_size: visitor.group_size,
    entry_type: visitor.entry_type,
    createdAt: visitor.createdAt,
  })
);


console.log(
  "AFTER SET:",
  localStorage.getItem("currentVisitor")
);

navigate("/")
    } catch (err) {
      console.error(err);
      alert("Location verification failed");
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/locations/findAll")
      .then(res => {
        console.log("LOCATIONS API:", res.data);
  
        // ✅ IMPORTANT FIX
        setLocations(res.data.data);
      })
      .catch(err => console.error(err));
  }, []);
 const cl =  locations.find(l => l._id === formData.location)?.name || ""
  console.log("current",cl)

  
  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      let nearestLocation = null;
      let minDistance = Infinity;

      locations.forEach((loc) => {
        const distance = getDistance(
          lat,
          lng,
          Number(loc.latitude),
          Number(loc.longitude)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestLocation = loc;
        }
      });

      if (nearestLocation) {
        setUserLocation({
          latitude: lat,
          longitude: lng,
          locationName: nearestLocation.name,
          locationId: nearestLocation._id
        });

        // Save the location id in formData
        setFormData((prev) => ({
          ...prev,
          location: nearestLocation._id,
          latitude: nearestLocation.latitude,
          longitude: nearestLocation.longitude
        }));
      }
    });
  };

  useEffect(() => {
    if (locations.length > 0) {
      fetchCurrentLocation();
      
    }
  }, [locations]);

   console.log(
  "Stored visitor:",
  JSON.parse(localStorage.getItem("currentVisitor"))
);

    console.log("formData.location:", formData.location);
console.log("locations:", locations);

const currentLocation = locations.find(
  (loc) => loc._id === formData.location
);



if (currentLocation) {
  localStorage.setItem(
    "currentLocation",
    JSON.stringify(currentLocation)
  );

  console.log(
    "Stored Current Location:",
    JSON.parse(localStorage.getItem("currentLocation"))
  );
}

  return (
    <Container
      fluid
      className="registration-form min-vh-100 mt-5 d-flex align-items-center justify-content-center py-5"
      style={{
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)"
      }}
    >
      <Card
        className="shadow-lg border-0 rounded-4 p-4 mt-5"
        style={{
          width: "100%",
          maxWidth: "850px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)"
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">
            Visitor Registration
          </h2>

          <p className="text-muted">
            Fill all details to continue
          </p>
        </div>

        <Form onSubmit={registerVisitor}>

          {/* PERSONAL DETAILS */}
          <h5 className="fw-semibold mb-3 text-success">
            Personal Details
          </h5>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>

                <Form.Control
                  type="text"
                  name="full_name"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="rounded-3 py-2"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>

                <Form.Control
                  type="text"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="rounded-3 py-2"
                />
              </Form.Group>
            </Col>
          </Row>



          {/* ENTRY TYPE */}
          <h5 className="fw-semibold mt-3 mb-3 text-success">
            Entry Details
          </h5>

          <Row className="mb-3">
            <Col md={6}>
              <div className="d-flex gap-4 mt-2">

                <Form.Check
                  type="radio"
                  label="QR Entry"
                  name="entry_type"
                  value="QR"
                  checked={formData.entry_type === "QR"}
                  onChange={handleChange}
                />

                <Form.Check
                  type="radio"
                  label="Manual Entry"
                  name="entry_type"
                  value="Manual"
                  checked={formData.entry_type === "Manual"}
                  onChange={handleChange}
                />
              </div>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Group Size</Form.Label>

                <Form.Control
                  type="number"
                  name="group_size"
                  value={formData.group_size}
                  onChange={handleChange}
                  className="rounded-3 py-2"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* VISITOR DETAILS */}
          <h5 className="fw-semibold mt-3 mb-3 text-success">
            Visitor Information
          </h5>

          <Row>
            <Col md={6}>
              <Form.Select
                name="age_group"
                value={formData.age_group}
                onChange={handleChange}
                className="rounded-3 py-2 mb-3"
              >
                <option value="">
                  Select Age Group
                </option>

                <option value="child">
                  Child
                </option>

                <option value="adult">
                  Adult
                </option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="rounded-3 py-2 mb-3"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>
              </Form.Select>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Select
                name="purpose_of_visit"
                value={formData.purpose_of_visit}
                onChange={handleChange}
                className="rounded-3 py-2 mb-3"
              >
                <option value="">
                  Purpose of Visit
                </option>

                <option value="tourism">
                  Tourism
                </option>

                <option value="religious">
                  Religious
                </option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Select
                name="travel_mode"
                value={formData.travel_mode}
                onChange={handleChange}
                className="rounded-3 py-2 mb-3"
              >
                <option value="">
                  Travel Mode
                </option>

                <option value="car">
                  Car
                </option>

                <option value="bus">
                  Bus
                </option>
              </Form.Select>
            </Col>
          </Row>

          {/* LOCATION */}
          {/* <Form.Select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="rounded-3 py-2 mb-4"
        >
          <option value="">
            Select Location
          </option>

          {Array.isArray(locations) &&
            locations.map((loc) => (
              <option
                key={loc._id}
                value={loc._id}
              >
                {loc.name}
              </option>
            ))}
        </Form.Select> */}

          <Form.Control
            value={
              locations.find(l => l._id === formData.location)?.name || ""
            }
            readOnly
          />

          {/* EMAIL + OTP */}
          <h5 className="fw-semibold mt-3 mb-3 text-success">
            Email Verification
          </h5>

          <Row className="align-items-end">
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>

                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-3 py-2"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Button
                className="w-100 rounded-3 py-2 fw-semibold bg-warning"
                variant="primary"
                onClick={sendOTP}
              >
                Send OTP
              </Button>
            </Col>
          </Row>

          <Row className="align-items-end">
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>OTP</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="rounded-3 py-2"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Button
                variant={isVerified ? "success" : "dark"}
                className="w-100 rounded-3 py-2 fw-semibold bg-success"
                onClick={verifyOTP}
              >
                {isVerified ? "Verified" : "Verify OTP"}
              </Button>
            </Col>
          </Row>

          <Card className="p-3 mb-3 bg-light">
            <h6 className="fw-bold text-success">
              Your Current Location
            </h6>

            <p className="mb-1">
              <strong>Latitude:</strong>{" "}
              {userLocation.latitude ?? "Fetching..."}
            </p>

            <p className="mb-1">
              <strong>Longitude:</strong>{" "}
              {userLocation.longitude ?? "Fetching..."}
            </p>

            <p className="mb-0">
              <strong>Current Location Name:</strong>{" "}
              {userLocation.locationName || "Finding..."}
            </p>
          </Card>
          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-4">

            <Button
              variant="outline-dark"
              className="px-4 rounded-3 "
              onClick={() => navigate("/")}
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={!isVerified}
              className="px-5 rounded-3 fw-semibold bg-success"
            >
              Continue
            </Button>
          </div>

        </Form>
      </Card>
    </Container>
  );
};

export default VisitorRegistrationForm;