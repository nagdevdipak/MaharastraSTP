import axios from 'axios';
import { div } from 'framer-motion/client';
import React, { useEffect, useState } from 'react'
import { Button, Container, FormControl, FormLabel } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
const FeedbackForm = () => {
  const { locationId } = useParams();
const [overallRating, setOverallRating] = useState(0);

const [serviceRatings, setServiceRatings] = useState([]);

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

useEffect(() => {
  const visitor = JSON.parse(localStorage.getItem("currentVisitor"));
  const location = JSON.parse(localStorage.getItem("currentLocation"));

  if (visitor) setCurrentVisitor(visitor);
  if (location) setCurrentLocation(location);
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
if (!currentVisitor || !currentLocation) {
  alert("Visitor or Location not found.");
  return;
}

    try {
     const payload = {

    visitorId: currentVisitor._id,

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
        "http://localhost:5000/api/feedback/createfeedback",
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

useEffect(() => {
  if (!currentLocation) return;

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/services/location/${currentLocation._id}`
      );

      const data = res.data.data.map((service) => ({
        serviceId: service._id,
        name: service.name,
        service_type: service.service_type,
        rating: 0,
        comments: "",
      }));

      setServiceRatings(data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchServices();
}, [currentLocation]);

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
    <>
      <Container className='mt-5'>
        <form onSubmit={handleSubmit}>

          <h2 className="text-center mb-4">Feedback Form</h2>
          <div className="mb-3">
            <strong>Visitor:</strong>{" "}
            <small>{currentVisitor?.full_name || "Guest"}</small>
          </div>

          <div className="mb-4">
    <h5>Overall Rating</h5>

  {renderStars(overallRating, setOverallRating)}
</div>

       <h4>Service Ratings</h4>

{
    serviceRatings.map((service,index)=>(
        <div key={service.serviceId}
            className="border rounded p-3 mb-3">

            <h6>
                {service.name}
                ({service.service_type})
            </h6>

            {renderStars(
                
                service.rating,
                (value)=>handleServiceRating(index,value)
            )}

            <FormControl
                className="mt-2"
                placeholder="Comments"
                value={service.comments}
                onChange={(e)=>{

                    const updated=[...serviceRatings];

                    updated[index].comments=e.target.value;

                    setServiceRatings(updated);

                }}
            />
        </div>
    ))
}

<h4>Facilities</h4>

{
[
"cleanliness",
"parking",
"washroom",
"safety",
"accessibility"
].map(item=>(

<div key={item} className="mb-3">

<h6>{item}</h6>

{renderStars(
facilities[item],
(value)=>handleFacilityRating(item,value)
)}

</div>

))
}
<Button variant='success' type='submit'> submit</Button>
        </form>
      </Container>

    </>
  )
}

export default FeedbackForm