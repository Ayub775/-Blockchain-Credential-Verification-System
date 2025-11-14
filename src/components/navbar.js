import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location]);

  // Close when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-left">
        <h2>CredChain</h2>
      </div>

      {/* Hamburger Icon */}
      <div
        className={`hamburger ${mobileOpen ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setMobileOpen(!mobileOpen);
          setMenuOpen(false);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-right ${mobileOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/verify">Verify</Link>
        <Link to="/about">About</Link>
        <Link to="/issued">Issued</Link>
         <Link to="/qr-verifier">QR Verifier</Link>
        <Link to="/join">Join Us</Link>
        {/* Dropdown */}
        <div
          className={`menu-dropdown ${menuOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <button className="menu-btn">Menu </button>
          <div className="dropdown-content">
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
