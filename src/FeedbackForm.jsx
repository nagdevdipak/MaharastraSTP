import axios from 'axios';
import { div } from 'framer-motion/client';
import React, { useEffect, useState } from 'react'
import { Button, Container, FormControl, FormLabel } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
const FeedbackForm = () => {
    const {locationId} = useParams();

    const [currentVisitor, setCurrentVisitor] = useState(null);

useEffect(() => {
  const visitor = localStorage.getItem("currentVisitor");

  if (visitor) {
    setCurrentVisitor(JSON.parse(visitor));
  } else {
    console.log("No current visitor found");
  }
}, []);

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!currentVisitor) {
    alert("Visitor information not found.");
    return;
  }

  try {
    const payload = {
      user: localStorage.getItem("visitorId"),
      location: currentVisitor.location,
      rating: ratings[0].rating,
      food_rating: ratings[1].rating,
      cleanliness_rating: ratings[2].rating,
      facilities_rating: ratings[3].rating,
      experience_rating: ratings[4].rating,
      comments: comment,
    };

    console.log(payload);

    await axios.post(
      "http://localhost:5000/api/feedback/createfeedback",
      payload
    );

    alert(
      `Mr ${currentVisitor.full_name}, your feedback is submitted ✅`
    );

    setRatings(initialRatings);
    setComment("");

    // Remove visitor only after successful submission
    localStorage.removeItem("currentVisitor");
    localStorage.removeItem("visitor");
    localStorage.removeItem("visitorId");
    localStorage.removeItem("location");

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Something went wrong");
  }
};

  console.log(JSON.parse(localStorage.getItem("currentVisitor")));

const user = localStorage.getItem("visitor")
    const initialRatings = [
        { title: "overall Ratings", rating: 0 },
        { title: "food Quality", rating: 0 },
        { title: "cleanliness", rating: 0 },
        { title: "Facilities", rating: 0 },
        { title: "overall experience", rating: 0 }
    ]

    const [ratings, setRatings] = useState(initialRatings)
    const [comment, setComment] = useState("")

 
    // handle star click
    const handleRating = (index, value) => {
        const updated = [...ratings]
        updated[index].rating = value
        setRatings(updated)
    }

    // render clickable stars
    const renderStars = (index, currentRating) => {
        return [1,2,3,4,5].map((star) => (
            <span
                key={star}
                style={{ cursor: "pointer", fontSize: "17px" }}
                onClick={() => handleRating(index, star)}
            >
                {star <= currentRating ? "⭐" : "☆"}
            </span>
        ))
    }


    return (
        <>
  <Container className='mt-5'>
 <form onSubmit={handleSubmit}>
           
            <h2 className="text-center mb-4">Feedback Form</h2>
 <div className="mb-3">
  <strong>Visitor:</strong>{" "}
  <small>{currentVisitor?.full_name || "Guest"}</small>
</div>
            {
                ratings.map((rat, index) => (
                
                    <div 
                        className="ratings border rounded px-4 py-3 w-75 mb-3 mx-auto text-start" 
                        key={index}
                    >
                        <p className="mb-1 fw-bold">{rat.title}</p>

                        <div>
                            {renderStars(index, rat.rating)}
                        </div>
                    </div>
                ))
            }

            <div className="d-flex flex-column align-items-center">
                <FormLabel>
                    Comments <small>(optional)</small>
                </FormLabel>

                <FormControl 
                    as="textarea" 
                    rows={4} 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-75 mb-3"
                />

                <Button type="submit" disabled={ratings[0].rating === 0}>Submit feedback</Button>
            </div>
        </form>
  </Container>
       
              </>
    )
}

export default FeedbackForm