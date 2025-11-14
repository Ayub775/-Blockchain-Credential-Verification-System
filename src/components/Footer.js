import React from "react";
import "../styles.css";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>CredChain</h2>
          <p>
            Empowering academic and government institutions with
            blockchain-based credential verification.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/verify">Verify</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/join">Join Us</a></li>
          </ul>
        </div>

        <div className="footer-socials">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="#" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="#" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CredChain | All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
