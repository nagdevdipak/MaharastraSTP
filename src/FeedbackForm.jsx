import axios from 'axios';
import { div } from 'framer-motion/client';
import React, { useEffect, useState } from 'react'
import { Button, Container, FormControl, FormLabel ,Badge,Card,} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./assets/Stylesheet.css"
const FeedbackForm = () => {

  const { state } = useLocation();

const selectedServices = state?.usedServices || [];
const selectedLocation = state?.location;
console.log("Navigation State:", state);
  const { locationId } = useParams();
const [overallRating, setOverallRating] = useState(0);

const [serviceRatings, setServiceRatings] = useState(() =>
  selectedServices.map(service => ({
    serviceId: service._id,
    name: service.name,
    service_type: service.service_type,
    rating: 0,
    comments: ""
  }))
);

const [facilities, setFacilities] = useState({
  cleanliness: 0,
  parking: 0,
  washroom: 0,
  safety: 0,
  accessibility: 0,
});

const [comment, setComment] = useState("");
const [currentVisitor,setCurrentVisitor] = useState(null)
const [currentLocation, setCurrentLocation] = useState(null);


const API = "http://localhost:5000"
useEffect(() => {
  const visitor = JSON.parse(localStorage.getItem("currentVisitor"));

  if (visitor) {
    setCurrentVisitor(visitor);
  }

  if (selectedLocation) {
    setCurrentLocation(selectedLocation);
  } else {
    const location = JSON.parse(localStorage.getItem("currentLocation"));
    if (location) {
      setCurrentLocation(location);
    }
  }
}, [selectedLocation]);


  const handleSubmit = async (e) => {
    e.preventDefault();
if (!currentVisitor || !currentLocation) {
  alert("Visitor or Location not found.");
  return;
}

    try {
const payload = {
    visitorId: currentVisitor._id,

    location: currentLocation._id,

    overall_rating: overallRating,

    serviceFeedback: serviceRatings
      .filter(service => service.rating > 0)
      .map(service => ({
          serviceId: service.serviceId,
          service_type: service.service_type,
          rating: service.rating,
          comments: service.comments,
      })),

    facilities,

    overallComment: comment
};

      console.log("Payload:", payload);

      await axios.post(
        `${API}/api/feedback/createfeedback`,
        payload
      );

      alert(
        `Mr ${currentVisitor.full_name}, your feedback has been submitted ✅`
      );

    setOverallRating(0);

setServiceRatings([]);

setFacilities({
  cleanliness: 0,
  parking: 0,
  washroom: 0,
  safety: 0,
  accessibility: 0,
});

setComment("");

      localStorage.removeItem("currentVisitor");
      localStorage.removeItem("currentLocation");
      localStorage.removeItem("visitor");
      localStorage.removeItem("visitorId");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

// useEffect(() => {
//   if (!currentLocation) return;

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get(
//         `${API}/api/visitor-service/${currentLocation._id}`
//       );

//      const data = res.data.data.map(item=>({

// serviceId:item.serviceId._id,

// name:item.serviceId.name,

// service_type:item.serviceId.service_type,

// rating:0,

// comments:""

// }));

// setServiceRatings(data);

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   fetchServices();
// }, [currentLocation]);

const handleServiceRating = (index, rating) => {
  const updated = [...serviceRatings];
  updated[index].rating = rating;
  setServiceRatings(updated);
};

const handleFacilityRating = (field, rating) => {
  setFacilities(prev => ({
    ...prev,
    [field]: rating
  }));
};

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("currentVisitor");
      localStorage.removeItem("currentLocation");
    }, 30 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);


  // render clickable stars
const renderStars = (currentRating, onRate) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      style={{
        cursor: "pointer",
        fontSize: "22px"
      }}
      onClick={() => onRate(star)}
    >
      {star <= currentRating ? "⭐" : "☆"}
    </span>
  ));
};


return (
  <Container
    className="d-flex justify-content-center align-items-center py-5"
    style={{ minHeight: "100vh" }}
  >
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ width: "100%", maxWidth: "900px" }}
    >
      <Card className="feedback-card shadow-lg border-0">

        <Card.Header className="feedback-header text-center">
          <h2 className="fw-bold mb-1">Tour Feedback</h2>
          <p className="mb-0 text-light">
            We'd love to hear about your experience.
          </p>
        </Card.Header>

        <Card.Body className="p-4">

          <div className="visitor-box mb-4">
            <strong>Visitor</strong>
            <Badge bg="success" className="ms-2 px-3 py-2">
              {currentVisitor?.full_name || "Guest"}
            </Badge>
          </div>

          {/* Overall Rating */}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rating-section mb-4"
          >
            <h5 className="mb-3">Overall Experience</h5>

            {renderStars(overallRating, setOverallRating)}
          </motion.div>

          {/* Services */}

          <h4 className="mb-4 fw-bold">Service Ratings</h4>

          {serviceRatings.map((service, index) => (
            <motion.div
              key={service.serviceId}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 35px rgba(0,0,0,.15)"
              }}
              transition={{ duration: .2 }}
            >
              <Card className="service-card mb-4 border-0 shadow-sm">

                <Card.Body>

                  <div className="d-flex justify-content-between">

                    <h5>{service.name}</h5>

                    <Badge bg="primary">
                      {service.service_type}
                    </Badge>

                  </div>

                  <div className="my-3">

                    {renderStars(
                      service.rating,
                      (value) =>
                        handleServiceRating(index, value)
                    )}

                  </div>

                  <FormControl
                    as="textarea"
                    rows={3}
                    placeholder="Share your experience..."
                    value={service.comments}
                    onChange={(e) => {
                      const updated = [...serviceRatings];
                      updated[index].comments = e.target.value;
                      setServiceRatings(updated);
                    }}
                  />

                </Card.Body>

              </Card>
            </motion.div>
          ))}

          {/* Facilities */}

          <h4 className="fw-bold mt-5 mb-4">
            Facilities
          </h4>

          <div className="row">

            {[
              "cleanliness",
              "parking",
              "washroom",
              "safety",
              "accessibility"
            ].map((item) => (
              <div
                className="col-lg-6 mb-3"
                key={item}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="facility-card"
                >
                  <h6 className="text-capitalize">
                    {item}
                  </h6>

                  {renderStars(
                    facilities[item],
                    (value) =>
                      handleFacilityRating(item, value)
                  )}

                </motion.div>
              </div>
            ))}

          </div>

          <div className="text-center mt-5">

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: .95 }}
            >
             <Button
    onClick={handleSubmit}
    size="lg"
    className="submit-btn px-5"
>
    Submit Feedback
</Button>
            </motion.div>

          </div>

        </Card.Body>

      </Card>
    </motion.div>
  </Container>
);
}

export default FeedbackForm