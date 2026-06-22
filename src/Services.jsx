import React, { useState,useEffect } from 'react'
import { CardBody,Card,Row,Col, CardImg, CardText, CardTitle, Container,Button ,Badge} from 'react-bootstrap'
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput'
import { useLocation } from 'react-router-dom'
import "./index.css"
import "./assets/Style.css"
  import { motion } from "framer-motion";
import { QRCodeCanvas } from 'qrcode.react'
import axios from 'axios'
  QRCodeCanvas
useLocation
const Services = () => {


      const { state } = useLocation();
    const cities =["Nashik","Pune","Raigad"]
const selectedCity = state?.city || "Nashik";
const selectedLocationFromNav = state?.location || "all";

const normalize = (str) => str?.trim().toLowerCase();

const [filter, setFilter] = useState(selectedCity);
const [location, setLocation] = useState(selectedLocationFromNav);
const [activeTab, setActiveTab] = useState("stay");
const [stayData, setStayData] = useState({});
const [foodData, setFoodData] = useState({});

const fetchStayservices = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/stay/getGroupedStay");
    setStayData(res.data.data);
  } catch (err) {
    console.error(err);
  }
};

const fetchfoodServices = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/foodservice/getGroupFoodByLocation");
    setFoodData(res.data.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchStayservices();
  fetchfoodServices();
}, []);

const data = activeTab === "stay" ? stayData : foodData;

const cityData = data?.[filter] || {};
const locations = Object.keys(cityData);
// const locations = stay[filter] ? Object.keys(stay[filter]) : []
const selectedServices =
  cityData
    ? location === "all"
      ? Object.values(cityData).flat()
      : cityData[location] || Object.values(cityData).flat()
    : [];

// const selectedFood =
//   activeTab[filter]
//     ? location === "all"
//       ? Object.values(activeTab[filter]).flat()
//       : activeTab[filter][location] ||
//         Object.values(activeTab[filter]).flat()
//     : [];

  console.log("CITY:", filter);
console.log("LOCATION:", location);
console.log("DATA:", data);
console.log("CITY DATA:", data?.[filter]);
  const renderStars = (rating) => {
  const totalStars = parseInt(rating) || 0
  return "⭐".repeat(totalStars)
}
  return (
    <div>
      {/* <h2>Services Data Ready ✅</h2> */}
      <Container style={{paddingTop:"7em"}} className='overflow-hidden'>
<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>

</div>
     <div className="glass-buttons">
  <Button variant='success' onClick={() => setActiveTab("stay")}>
    stay
  </Button>{" "}

  <Button variant='success' onClick={() => setActiveTab("food")}>
    food
  </Button>
</div>

  

<Container>

  {/* ✅ STAY SERVICES */}
  {activeTab === "stay" && (
    <>
      <h4 className='mb-4'>Stay Services</h4>

      {selectedServices.map((item, index) => (

       <motion.div
  key={index}

  initial={{
    opacity: 0,
    y: 60
  }}

  whileInView={{
    opacity: 1,
    y: 0
  }}

  viewport={{
    once: false,
    amount: 0.2
  }}

  whileHover={{
    y: -6
  }}

  transition={{
    type: "spring",
    stiffness: 120,
    damping: 18,
    mass: 0.6
  }}

  style={{
    willChange: "transform"
  }}
>

          <Card
            className='tour-card mb-4'
          >

            <Row className='g-0 align-items-center'>

              {/* IMAGE */}
              <Col md={4}>

                <div className='img-wrapper'>

                  <CardImg
                    src={item.img}
                    className='tour-img'
                  />

                </div>

              </Col>

              {/* CONTENT */}
              <Col md={8}>

                <CardBody className='p-4'>

                  <div className='d-flex justify-content-between align-items-start flex-wrap gap-3'>

                    {/* LEFT */}
                    <div className='text-start'>

                      <CardTitle className='fw-bold fs-5 mb-2'>
                        {item.name}
                      </CardTitle>

                      <CardText className='mb-1 text-muted'>
                        {item.type}
                      </CardText>

                      <CardText className='mb-0 text-muted'>
                        {item.address}
                      </CardText>

                    </div>

                   {/* RIGHT */}
<div className='text-end d-flex flex-column align-items-center'>

  <p className='mb-2'>
    Ratings: {renderStars(item.rating)}
  </p>

  {/* QR CODE */}

  <QRCodeCanvas
    id={`stay-qr-${index}`}
    value={JSON.stringify({
      serviceName: item.name,
      type: item.type,
           address:`https://www.google.com/maps/search/?api=1&query=${item.address}`,

      city: filter,
      location: location
    })}
    size={110}
    includeMargin={true}
  />

  <small className='text-muted mt-2'>
    Scan Service Info
  </small>

  {/* DOWNLOAD BUTTON */}

  <Button
    variant='outline-dark'
    size='sm'
    className='mt-2'
    onClick={() => {
      const canvas = document.getElementById(`stay-qr-${index}`);

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");

      downloadLink.href = pngUrl;

      downloadLink.download = `${item.name}-qr.png`;

      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
    }}
  >
    Download QR
  </Button>

  <Button
    variant='success'
    className='mt-2'
  >
    See Details
  </Button>

</div>

                  </div>

                </CardBody>

              </Col>

            </Row>

          </Card>

        </motion.div>

      ))}
    </>
  )}

  {/* ✅ FOOD SERVICES */}
  {activeTab === "food" && (
    <>
      <h4 className='mb-4'>Food Services</h4>

      {selectedServices.map((item, index) => (

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -5,
            scale: 1.01
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.3,
            delay: index * 0.1
          }}
        >

          <Card
            className='tour-card mb-4'
          >

            <Row className='g-0 align-items-center'>

              {/* IMAGE */}
              <Col md={4}>

                <div className='img-wrapper'>

                  <CardImg
                    src={item.img}
                    className='tour-img'
                  />

                </div>

              </Col>

              {/* CONTENT */}
              <Col md={8}>

                <CardBody className='p-4'>

                  <div className='d-flex justify-content-between align-items-start flex-wrap gap-3'>

                    {/* LEFT */}
                    <div className='text-start'>

                      <CardTitle className='fw-bold fs-5 mb-2'>
                        {item.name}
                      </CardTitle>

                      <CardText className='mb-1 text-muted'>
                        {item.type}
                      </CardText>

                      <CardText className='mb-0 text-muted'>
                        {item.address}
                      </CardText>

                    </div>

                    {/* RIGHT */}
              {/* RIGHT */}
<div className='text-end d-flex flex-column align-items-center'>

  <p className='mb-2'>
    Ratings: {renderStars(item.rating)}
  </p>

  {/* QR CODE */}

  <QRCodeCanvas
    id={`food-qr-${index}`}
    value={JSON.stringify({
      serviceName: item.name,
      type: item.type,
     address:`https://www.google.com/maps/search/?api=1&query=${item.address}`,
      city: filter,
      location: location
    })}
    size={110}
    includeMargin={true}
  />

  <small className='text-muted mt-2'>
    Scan Service Info
  </small>

  {/* DOWNLOAD BUTTON */}

  <Button
    variant='outline-dark'
    size='sm'
    className='mt-2'
    onClick={() => {
      const canvas = document.getElementById(`food-qr-${index}`);

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");

      downloadLink.href = pngUrl;

      downloadLink.download = `${item.name}-qr.png`;

      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
    }}
  >
    Download QR
  </Button>

  <Button
    variant='success'
    className='mt-2'
  >
    See Details
  </Button>

</div>
                  </div>

                </CardBody>

              </Col>

            </Row>

          </Card>

        </motion.div>

      ))}
    </>
  )}

</Container>

      </Container>
    </div>
  )
}

export default Services