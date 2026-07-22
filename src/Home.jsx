import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardTitle,
  CardBody,
  CardImg, Modal
} from 'react-bootstrap'
import GenerateQR from './GenerateQR';
import LocationTracker from './LocationTracker';
import {
  FaUserPlus,
  FaCompass,
  FaCommentDots,
  FaConciergeBell
} from "react-icons/fa";

import './App.css'
import './assets/Style.css'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useNavigate } from 'react-router-dom';

import {
  motion,
  useScroll,
  useTransform
} from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import axios from 'axios';
import { useLocationContext } from "../src/Context/LocationContext";

const picturCards = [
  { id: 1, title: "Hills", img: "anjener-hills.jpg" },
  { id: 2, title: "Temples", img: "trimbakeshwar.webp" },
  { id: 3, title: "Dams", img: "KoynaDam.avif" },
  { id: 4, title: "Forts", img: "Pune_Sinhagad_Fort_Main.jpg" },
];
const Home = () => {

  const navigate = useNavigate()
  const { scrollY } = useScroll();


const { currentLocation } = useLocationContext();

  // background movement
  const heroBgY = useTransform(
    scrollY,
    [0, 800],
    [0, 250]
  );

  // hero text movement
  const heroTextY = useTransform(
    scrollY,
    [0, 800],
    [0, 400]
  );

  // floating card effect
  const glassCardY = useTransform(
    scrollY,
    [0, 800],
    [0, 150]
  );

  // about image
  const aboutImageY = useTransform(
    scrollY,
    [400, 1600],
    [100, -120]
  );

  // cards section
  const cardsY = useTransform(
    scrollY,
    [200, 1200],
    [80, -60]
  );

  const cards = [
    {
      title: "Registration",
      path: "/registration",
      icon: (
        <FaUserPlus
          size={40}
          className="text-success mb-3"
        />
      )
    },
    {
      title: "Exploration",
      path: "/places",
      icon: (
        <FaCompass
          size={40}
          className="text-success mb-3"
        />
      )
    },
    {
      title: "Feedback",
      path: "/feedback",
      icon: (
        <FaCommentDots
          size={40}
          className="text-success mb-3"
        />
      )
    },
    {
      title: "Services",
      path: "/services",
      icon: (
        <FaConciergeBell
          size={40}
          className="text-success mb-3"
        />
      )
    }
  ];

  const places = {
    spiritual: [
      "Trimbakeshwar",
      "Shirdi",
      "Panchvati",
      "Pandharpur",
      "Vani"
    ],

    historical: [
      "Pandavleni",
      "Ajanta Ellora",
      "Shivneri Fort",
      "Rajgad Fort",
      "Sinhagad Fort"
    ],

    hillstation: [
      "Mahabaleshwar",
      "Anjineri",
      "Matheran",
      "Lonavala"
    ],

    Dams: [
      "Koyna Dam", "Bhandardara Dam", "Jayakwadi dam"
    ]
  };


const handlenavigation = (path) => {
  if (path === "/services") {
    if (!currentLocation) {
      alert("Current location not found.");
      return;
    }

    navigate("/services", {
      state: {
        currentLocation:currentLocation,
      },
    });

    return;
  }

  if (path === "/places") {
    navigate("/places",{
      state: {
        currentLocation:currentLocation,
      },
    });
    return;
  }

  navigate(path);
};



  const [showQR, setShowQR] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // console.log(showQR)
  useEffect(() => {
    const registered = localStorage.getItem("currentVisitor");

    console.log("Home currentVisitor:", registered);
    setShowQR(!registered);
  }, []);



  useEffect(() => {
    console.log(
      "HOME:",
      localStorage.getItem("currentVisitor")
    );
  }, []);



  return (


    <div
      style={{
        overflowX: "hidden",
        paddingTop: "8px",
        filter: showQR ? "blur(8px)" : "none",
        pointerEvents: showQR ? "none" : "auto",
        transition: "0.3s"
      }}
    >

      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden"
        }}
      >

        {/* PARALLAX BACKGROUND */}
        <motion.div
          style={{
            y: heroBgY,
            position: "absolute",
            inset: 0,
            backgroundImage:
              `url(https://res.cloudinary.com/dyiffrkzh/image/upload/c_fill,f_auto,w_1600/v1725690054/banbanjara/un9ud3y41f3kw4noi5fl.jpg)`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1
          }}
        />

        {/* DARK OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))",

            zIndex: 2
          }}
        />

        {/* FLOATING CLOUDS */}
        <motion.div
          animate={{
            x: [0, 50, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity
          }}
          style={{
            position: "absolute",
            top: "80px",
            left: "10%",
            width: "200px",
            height: "80px",
            background: "rgba(255,255,255,0.15)",
            filter: "blur(20px)",
            borderRadius: "50%",
            zIndex: 3
          }}
        />

        <Container
          className="h-100 d-flex flex-column justify-content-center"
          style={{
            position: "relative",
            zIndex: 4
          }}
        >

          {/* HERO TEXT */}
          <motion.div
            style={{
              y: heroTextY
            }}
            initial={{
              opacity: 0,
              y: -50
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1
            }}
            className="text-white mb-5"
          >
            <h1 className="fw-bold display-2">
              Explore Maharashtra 🇮🇳
            </h1>

            <p className="lead fs-3">
              Discover destinations, culture &
              unforgettable journeys.
            </p>
          </motion.div>


        </Container>
      </section>



      <Container className="mt-5">

        <motion.div
          style={{
            y: cardsY
          }}
        >
          <Row>

            {cards.map((card, i) => (

              <Col sm={3} key={i}>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    y: -10
                  }}
                  initial={{
                    opacity: 0,
                    y: 50
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: i * 0.2
                  }}
                >

                  <Card
                    onClick={() => handlenavigation(card.path)}
                    className="text-center p-3 shadow-sm h-100 border-0"
                    style={{
                      cursor: "pointer",
                      borderRadius: "20px"
                    }}
                  >
                    <CardBody>
                      {card.icon}
                      <CardTitle>
                        {card.title}
                      </CardTitle>
                    </CardBody>
                  </Card>

                </motion.div>

              </Col>

            ))}

          </Row>
        </motion.div>

      </Container>

      {/* ================================================= */}
      {/* ABOUT SECTION */}
      {/* ================================================= */}

      <section id='about' className='mt-5'>
        <Container className='mb-3 mt-3'>
          <h3>Gallary</h3>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            spaceBetween={20}
            loop={true}
            speed={800}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
          >
            {picturCards.map((card) => (
              <SwiperSlide key={card.id}>
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                  <h2>{card.tittle}</h2>
                  <CardImg
                    src={card.img} alt='img'
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  {/* <img src="anjener-hills.jpg" /> */}


                  <CardBody>
                    <h5 className="text-center">{card.title}</h5>
                  </CardBody>

                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>


      </section>

      {/* ================================================= */}
      {/* WHY CHOOSE US */}
      {/* ================================================= */}

      <Container className="py-5">

        <motion.div
          initial={{
            opacity: 0
          }}
          whileInView={{
            opacity: 1
          }}
          transition={{
            duration: 1
          }}
        >

          <h2 className="text-center fw-bold mb-5">
            Why Choose Us?
          </h2>

          <Row className="text-center">

            {[
              {
                title: "🏨 Local Vendors",
                text: "Support local businesses."
              },
              {
                title: "💰 Affordable Packages",
                text: "Budget-friendly travel."
              },
              {
                title: "📍 Smart Booking",
                text: "Dynamic booking system."
              },
              {
                title: "🕒 24/7 Support",
                text: "Always available."
              }
            ].map((item, i) => (

              <Col md={3} key={i}>

                <motion.div
                  whileHover={{
                    y: -10,
                    scale: 1.03
                  }}
                >

                  <Card className="p-4 shadow-sm h-100 border-0 rounded-4">

                    <h5>{item.title}</h5>

                    <p>
                      {item.text}
                    </p>

                  </Card>

                </motion.div>

              </Col>

            ))}

          </Row>

        </motion.div>

      </Container>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <section id="contact">

        <Container
          fluid
          className="py-5 px-4 text-white"
          style={{
            background:
              "linear-gradient(to right,#166534,#14532d)"
          }}
        >

          <div className="text-center mb-5">

            <h2 className="fw-bold display-6">
              Company Details
            </h2>

            <p className="text-light">
              Explore Maharashtra tourism destinations
              and services
            </p>

          </div>

          <Row className="g-4">

            <Col lg={3} md={6}>

              <motion.div
                whileHover={{
                  y: -8
                }}
                className="bg-dark bg-opacity-25 p-4 rounded-4 shadow h-100"
              >

                <h4 className="fw-bold mb-4 text-warning">
                  Contact Info
                </h4>

                <p>
                  📍 Nashik, Maharashtra
                </p>

                <p>
                  📅 Established: 2025
                </p>

                <p style={{ wordBreak: "break-word" }}>
                  📧 support@maharashtratourism.com
                </p>

                <p>
                  📞 +91 9876543210
                </p>

              </motion.div>

            </Col>

            <Col lg={9} md={6}>

              <Row className="g-4">

                {Object.entries(places).map(
                  ([category, list], i) => (

                    <Col lg={3} sm={6} key={i}>

                      <motion.div
                        whileHover={{
                          scale: 1.03
                        }}
                        className="bg-dark bg-opacity-25 p-4 rounded-4 shadow h-100"
                      >

                        <h5 className="text-warning fw-bold text-capitalize mb-3 border-bottom pb-2">
                          {category}
                        </h5>

                        <ul className="list-unstyled">

                          {list.map((place, idx) => (

                            <li
                              key={idx}
                              className="mb-2"
                            >
                              ➜ {place}
                            </li>

                          ))}

                        </ul>

                      </motion.div>

                    </Col>

                  )
                )}

              </Row>

            </Col>

          </Row>

        </Container>

      </section>
<Modal
  show={showQR}
  backdrop="static"
  keyboard={false}
  centered
  size="lg"
>
  <Modal.Header closeButton={false}>
    <Modal.Title>Scan QR to Continue</Modal.Title>
  </Modal.Header>

  <Modal.Body className="text-center p-4">
    <div className="w-100">
   <GenerateQR
    location={currentLocation}
    onLocationFound={(loc) => {
        setCurrentLocation(loc);
        localStorage.setItem(
            "currentLocation",
            JSON.stringify(loc)
        );
    }}
/>
    </div>

    <p className="mt-3">
      Scan this QR code to complete your registration.
    </p>
  </Modal.Body>
</Modal>
<LocationTracker
    onLocationFound={location}
/>
    </div>


  )
}

export default Home