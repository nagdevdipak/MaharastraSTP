import React, { useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./assets/NavbarAnimation.css"
const Navigation = () => {
useEffect(() => {
  let lastScrollTop = 0;
  const navbar = document.getElementById("navbar");

  const handleScroll = () => {
    const currentScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop;

    if (currentScroll > 100) {
      navbar.classList.add("fixed-nav");
    } else {
      navbar.classList.remove("fixed-nav");
    }

    if (currentScroll < lastScrollTop) {
      navbar.classList.add("show-nav");
    } else {
      navbar.classList.remove("show-nav");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
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

       <Navbar expand="lg" className="main-nav">
         <Container>
             <img src="logo.png" width={70} height={60} alt="" />
          

           
          
           <Navbar.Collapse>
             <Nav className="ms-auto">
               <Nav.Link as={Link} to="/">Home</Nav.Link>
               <Nav.Link as={Link} to="/places">Package</Nav.Link>
         <Nav.Link as={Link} to="/services">Services</Nav.Link>
             </Nav>
           </Navbar.Collapse>
         </Container>
       </Navbar>
    </div>
  );
};

export default Navigation;