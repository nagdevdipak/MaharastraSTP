import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardImg } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ServiceDetails = () => {
  const { id } = useParams();

  const [service, setService] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Service/service/${id}`)
      .then((res) => {
        console.log(res.data);

        // If API returns { data: {...} }
        setService(res.data.data);

        // Otherwise use:
        // setService(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!service) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <Card className="m-4">
      <CardImg
        variant="top"
        src={`http://localhost:5000/uploads/${service.image}`}
      />

      <CardBody>
        <h3>{service.name}</h3>

        <p>{service.service_type}</p>

        <p>{service.description}</p>

        <p>
          ₹
          {service.details?.price_per_night ||
            service.details?.price_per_person}
        </p>

        <p>⭐ {service.ratings}</p>
      </CardBody>
    </Card>
  );
};

export default ServiceDetails;