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
  Row,
  Col,
  Dropdown,
  Badge
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

const [locations, setLocations] = useState({});
const [city, setCity] = useState("");
const [filter, setFilter] = useState("all");
const [showAll, setShowAll] = useState(false);

const FetchLocationInfo = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/locations/findGroupLocation");

    const data = res.data.data;
 console.table(data)
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

  // =========================================
  // JSX
  // =========================================

  return (

    <Container
      fluid
      className="places-page overflow-hidden"
      style={{ paddingTop: "7em" }}
    >

      {/* FILTER CARD */}

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

          {/* CITY DROPDOWN */}

          <Col lg={4}>

            <Dropdown className="mt-3 mt-lg-0" drop="start">

              <Dropdown.Toggle variant="success">

                {city.toUpperCase()}

              </Dropdown.Toggle>
<Dropdown.Menu>
  {cities.map((cityName) => (
    <Dropdown.Item
      key={cityName}
    
      onClick={() => {
        setCity(cityName);
        setFilter("all");
        setShowAll(false);
      }}
    >
      {cityName.toUpperCase()}
    </Dropdown.Item>
  ))}
</Dropdown.Menu>

            </Dropdown>

          </Col>

        </Row>

      </Card>

      {/* PLACES */}

   <div className="d-flex flex-column gap-4">
  {visiblePlaces.map((item, index) => {
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

              <CardText className="text-muted mb-3">
                {item.desc}
              </CardText>

              <div className="d-flex flex-wrap gap-4 mb-4 text-start">
                <div className="fw-semibold ">
                  {/* <FaRupeeSign className="text-success me-2" /> */}
                  <h4 >longitude</h4>
                  {item.longitude}
                </div>

                <div className="fw-semibold ">
                  {/* <FaClock className="text-success me-2" /> */}
                  <h4>latitude</h4>
                  {item.latitude}
                </div>
              </div>

              {item.stay?.length > 0 && (
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
              )}

              <div className="mt-auto text-start">
                <Button
                  variant="success"
                  className="rounded-pill px-4"
                  onClick={() =>
                    navigate("/services", {
                      state: {
                        location: item.name,
                        city: city,
                      },
                    })
                  }
                >
                  Explore Services
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

    </Container>

  );

};

export default Places;