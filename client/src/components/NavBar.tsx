import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import {
  faMountain,
  faSkiingNordic,
  faBan,
  faKey,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
      <Navbar.Brand href="/">
        <FaIcon icon={faMountain} className="mr-2"></FaIcon>
        BackcountryBook
      </Navbar.Brand>
      <Navbar.Toggle
        className="mb-2"
        aria-controls="basic-navbar-nav"
        style={{ outline: "none" }}
      />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link
            className="btn btn-outline-primary mr-2"
            onClick={() => console.log("ny tur")}
          >
            <FaIcon icon={faPlus} className="mr-2"></FaIcon>Add trip
          </Nav.Link>
          <Nav.Link href="/summits">
            <FaIcon icon={faMountain} className="mr-2"></FaIcon>
            Peaks
          </Nav.Link>
          <Nav.Link href="/profile">
            <FaIcon icon={faSkiingNordic} className="mr-2"></FaIcon>
            Profile
          </Nav.Link>
          <Nav.Link onClick={() => console.log("log in")}>
            <FaIcon icon={faKey} className="mr-2"></FaIcon>
            Log in
          </Nav.Link>
          <Nav.Link onClick={() => console.log("log out")}>
            <FaIcon icon={faBan} className="mr-2"></FaIcon>
            Log out
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
