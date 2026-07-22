import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./assets/NavbarAnimation.css"
const Navigation = () => {
useEffect(() => {
  let lastScrollTop = 0;
  const navbar = document.getElementById("navbar");

  const handleScroll = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    if (currentScroll > lastScrollTop) {
      navbar.classList.add("hide-nav");
    } else {
      navbar.classList.remove("hide-nav");
    }

    lastScrollTop = currentScroll;
  };

  window.addEventListener("scroll", handleScroll);

  return () =>
    window.removeEventListener("scroll", handleScroll);
}, []);

  return (

    <div id="navbar" className="navigation-wrapper show">
      <Navbar bg="dark" className="top-nav py-1">
        <Container>
          <Nav className="ms-auto d-flex flex-row gap-4">
            <Nav.Item className="text-white">
              📞 0123-456-789
            </Nav.Item>

            <Nav.Item className="text-white">
              ✉️ maharastratourism@gmail.com
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
<Navbar
  expand="lg"
  bg="success"
  className="main-nav shadow-sm"
  sticky="top"
>
  <Container>

    <Navbar.Brand as={Link} to="/">
      <img
        src="logo-removebg-preview.png"
        width={70}
        height={60}
        alt="Logo"
      />
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="navbar-nav" />

    <Navbar.Collapse id="navbar-nav">
      <Nav className="ms-auto">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/places">Locations</Nav.Link>
        <Nav.Link as={Link} to="/services">Services</Nav.Link>
        <Nav.Link as={Link} to="/ticket">Ticket</Nav.Link>
      </Nav>
    </Navbar.Collapse>

  </Container>
</Navbar>
    </div>
  );
};

export default Navigation;