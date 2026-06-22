import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Row, Col, Card } from "react-bootstrap";
import "./assets/NavbarAnimation.css"
const EntrancePage = () => {
  const [locations, setLocations] = useState([]);

  const baseUrl = "http://localhost:3000/registration"; // FIX THIS

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/locations/findAll"
        );
        setLocations(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    const container = document.querySelector(".carousel-wrapper");
    if (container) {
      container.scrollBy({ left: 280, behavior: "smooth" });
    }
  }, 3000);

  return () => clearInterval(interval);
}, []);

  return (
    <div>
      <h2 className="mb-4">Entrance QR Codes</h2>


  <div className="carousel-wrapper ">

    {locations.map((item, index) => (
      <div className="carousel2d" key={index}>

        <div className="card-inner">
          <h6>{item.name}</h6>

          <QRCodeCanvas
            value={`${baseUrl}?locationId=${item._id}`}
            size={120}
          />
        </div>

      </div>
    ))}

  </div>
</div>

  );
};

export default EntrancePage;