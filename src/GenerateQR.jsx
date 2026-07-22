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
import { useLocationContext } from "../src/Context/LocationContext";

function GenerateQR({ location }){
const API = "http://localhost:5000"
const currentLocation = location || useLocationContext().currentLocation;
    if (!location) {
        return <p>Finding current tourist location...</p>;
    }

    const url =

    `${window.location.origin}/registration` +
    `?locationId=${location._id}` +
    `&lat=${location.latitude}` +
    `&lng=${location.longitude}` +
    `&name=${encodeURIComponent(location.name)}`;

     

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