import React, { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardTitle,
  CardBody
} from 'react-bootstrap'

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
import EntrancePage from './EntrancePage';

const Home = () => {

  const navigate = useNavigate()

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  /*
    ===============================
    PARALLAX CONTROLS
    ===============================
  */

  const { scrollY } = useScroll();

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

    Dams:[
      "Koyna Dam","Bhandardara Dam","Jayakwadi dam"
    ]
  };

  const handlenavigation = (path) => {
    navigate(path);
  };
  

  return (
    <div
       style={{
    overflowX: "hidden",
    paddingTop: "86px"
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

          {/* GLASS CARD */}
          <motion.div
            style={{
              y: glassCardY,
              backdropFilter: "blur(15px)",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "25px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.3)"
            }}
            initial={{
              opacity: 0,
              y: 80
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1
            }}
          >
            <Row className="align-items-end text-white">

              {/* LEFT */}
              <Col md={6}>
                <Row>

                  <Col sm={6}>
                    <label>Check In</label>

                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      className="form-control bg-transparent text-white border-0 border-bottom"
                      placeholderText="Check in"
                      minDate={new Date()}
                    />
                  </Col>

                  <Col sm={6}>
                    <label>Check Out</label>

                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      className="form-control bg-transparent text-white border-0 border-bottom"
                      placeholderText="Check out"
                      minDate={checkIn || new Date()}
                    />
                  </Col>

                </Row>

                <motion.div
                  whileHover={{
                    scale: 1.05
                  }}
                >
                  <Button
                    variant='success'
                    className="w-100 mt-3 rounded-pill"
                    size="lg"
                  >
                    Search Availability
                  </Button>
                </motion.div>
              </Col>

              {/* RIGHT */}
              <Col
                md={6}
                className="text-center mt-4 mt-md-0"
              >
                <div className="d-flex justify-content-center gap-3">

                  {["Child", "Adult", "Senior"].map((item, i) => (

                    <motion.div
                      key={i}
                      whileHover={{
                        scale: 1.1,
                        y: -5
                      }}
                    >
                      <Button
                        variant="outline-light"
                        className="rounded-pill px-4"
                      >
                        {item}
                      </Button>
                    </motion.div>

                  ))}

                </div>
              </Col>

            </Row>
          </motion.div>
        </Container>
      </section>

{/*Entry qr section*/}
{/* <Container>
  <EntrancePage/>
</Container> */}
      {/* ================================================= */}
      {/* CARDS SECTION */}
      {/* ================================================= */}

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

      <section id='about'>

        <Container className="py-5">

          <Row className="align-items-center">

            {/* LEFT */}
            <Col md={6}>

              <motion.div
                initial={{
                  opacity: 0,
                  x: -100
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  duration: 0.8
                }}
              >

                <h2 className="fw-bold mb-4">
                  Who We Are
                </h2>

                <p>
                  Maharashtra Travel is a modern tourism
                  platform established in 2025 with a mission
                  to promote local tourism and empower
                  small businesses across Maharashtra.
                </p>

                <p>
                  We connect travelers with local vendors
                  including hotels, guides, transport
                  services and food providers.
                </p>

              </motion.div>

            </Col>

            {/* RIGHT */}
            <Col
              md={6}
              style={{
                overflow: "hidden",
                borderRadius: "20px"
              }}
            >

              <motion.img
                src='/Maharashtra-Monsoon.avif'
                className="img-fluid rounded shadow-lg"
                
              />

            </Col>

          </Row>

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

                <p style={{wordBreak:"break-word"}}>
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

    </div>
  )
}

export default Home