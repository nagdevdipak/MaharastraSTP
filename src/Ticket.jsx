import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

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

  const [data, setData] = useState({});

useEffect(() => {
  const fetchTicket = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/visitor/getVisitor"
      );
console.log("response",res.data)
      const visitors = res.data.data;

      const currentVisitorName =
        localStorage.getItem("visitor");

      // find current visitor
      const currentVisitor = visitors.find(
        (item) =>
          item.full_name === currentVisitorName
      );

      setData(currentVisitor);

      console.log("Current Visitor", currentVisitor);

    } catch (err) {
      console.error(err);
    }
  };

  fetchTicket();
}, []);

  const checkCurrentVisitor = data.visitor?.full_name == localStorage.getItem("visitorName")

  const downloadTicket = async () => {
    const canvas = await html2canvas(ticketRef.current);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);

    pdf.save("ticket.pdf");
  };

  return (
    <>
      <Container
        fluid
        className="justify-content-center mt-5 p-4 shadow"
        ref={ticketRef}
        style={{
          width: "500px",
          borderRadius: "15px",
          background: "#fff"
        }}
      >
        <Row>
          <Col md={4} className="text-center">
            {/* QR Code */}
        
  <QRCodeCanvas
    value={JSON.stringify(data)}
    size={150}
  />

          </Col>

          <Col md={8}>
            <Row className="mb-2">
              <Col>
                <strong>Visitor Name</strong>
              </Col>

              <Col>{data?.full_name}</Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <strong>Location</strong>
              </Col>

              <Col>{data?.location?.name}</Col>
            </Row>

            <Row className="mb-2">
              <Col>
                <strong>Group Size</strong>
              </Col>

              <Col>{data?.group_size}</Col>
            </Row>
<Row className="mb-2">
  <Col>
    <strong>Date</strong>
  </Col>

  <Col>
    {new Date(data?.createdAt).toLocaleDateString()}
  </Col>
</Row>

<Row className="mb-3">
  <Col>
    <strong>Time</strong>
  </Col>

  <Col>
    {new Date(data?.createdAt).toLocaleTimeString()}
  </Col>
</Row>

            <Row>
              <Col>
                <strong>Entry Type</strong>
              </Col>

              <Col>{data?.entry_type}</Col>
            </Row>

            <p
              className="text-center text-muted mt-2"
              style={{ fontSize: "12px" }}
            >
              Show this QR at entry
            </p>
          </Col>
        </Row>

        {/* Download Button */}
        <div className="text-center mt-3 w-100">
          <Button onClick={downloadTicket} variant="success">
            Download Ticket
          </Button>
        </div>
      </Container>

      <div className="text-center mt-3">
        <h4>Thank you for visiting</h4>
        <p>Your feedback helps us improve</p>
      </div>
    </>
  );
};
export default Ticket;