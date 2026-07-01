import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Container
} from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Ticket = () => {
  const ticketRef = useRef();

  const [visitor, setVisitor] = useState(null);
 const [currentplace,setCurrentplace] = useState(JSON.parse(localStorage.getItem("currentLocation")))
  useEffect(() => {
    const storedVisitor =  localStorage.getItem("currentVisitor");
 console.log("current visitor",storedVisitor)
    if (storedVisitor) {
      setVisitor(JSON.parse(storedVisitor));
    }
  }, []);

const location_Name = currentplace?.name
  const downloadTicket = async () => {
    const canvas = await html2canvas(ticketRef.current);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);

    pdf.save("ticket.pdf");
  };

  if (!visitor) {
    return (
      <div className="text-center mt-5">
        <h4>No Visitor Ticket Found</h4>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <Container
        fluid
        ref={ticketRef}
        className="p-4 mt-5 d-grid place-items-center shadow"
        style={{
          width: "500px",
          borderRadius: "15px",
          background: "#fff"
        }}
      >
        <Row>
          <Col md={4} className="text-center">
            <QRCodeCanvas
              value={JSON.stringify({
                id: visitor?._id,
                name: visitor?.full_name,
                location: visitor.location?._id,
                createdAt: visitor?.createdAt
              })}
              size={150}
            />
          </Col>

          <Col md={8}>
            <Row className="mb-2">
              <Col>
                <strong>Visitor Name</strong>
              </Col>

              <Col>{visitor.full_name}</Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <strong>Location</strong>
              </Col>

              <Col>{location_Name}</Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <strong>Group Size</strong>
              </Col>

              <Col>{visitor.group_size}</Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <strong>Date</strong>
              </Col>

              <Col>
                {visitor.createdAt &&
                  new Date(
                    visitor.createdAt
                  ).toLocaleDateString("en-IN")}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <strong>Time</strong>
              </Col>

              <Col>
                {visitor.createdAt &&
                  new Date(
                    visitor.createdAt
                  ).toLocaleTimeString("en-IN")}
              </Col>
            </Row>

            <Row>
              <Col>
                <strong>Entry Type</strong>
              </Col>

              <Col>{visitor.entry_type}</Col>
            </Row>

            <p
              className="text-center text-muted mt-3"
              style={{ fontSize: "12px" }}
            >
              Show this QR at entry
            </p>
          </Col>
        </Row>

        <div className="text-center mt-3">
          <Button
            variant="success"
            onClick={downloadTicket}
          >
            Download Ticket
          </Button>
        </div>
      </Container>

      <div className="text-center mt-3">
        <h4>Thank you for visiting</h4>
        <p>Your feedback helps us improve.</p>
      </div>
    </div>
  );
};

export default Ticket;