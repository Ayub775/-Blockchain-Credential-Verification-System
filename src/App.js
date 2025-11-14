import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import About from "./pages/About";
import Issued from "./pages/Issued";
// import Join from "./pages/Join";
// import QrVerifier from "./pages/QrVerifier";
import "./styles.css";
import Footer from "./components/Footer"; 

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/about" element={<About />} />
          <Route path="/Issued" element={<Issued />} />
          {/* <Route path="/join" element={<Join />} /> */}
          {/* <Route path="/qr-verifier" element={<QrVerifier />} /> */}
        </Routes>
      </main>
      {/*Gradient transiton Divider*/ }
      <div className="verify-footer-transition"></div>
      <Footer />
    </>
  );
}

export default App;
