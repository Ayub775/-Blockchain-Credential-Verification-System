import React, { useState } from "react";
import {QrScanner} from "react-qr-scanner";
import AOS from "aos";
import "aos/dist/aos.css";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import "../styles.css";

function QrVerifier() {
  const [scanResult, setScanResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      const url = data.text || data;
      setScanResult(url);
      setVerificationResult(null);
      setError(null);
      await verifyDocumentOnBlockchain(url);
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
    setError("⚠️ Unable to access camera or scan QR code.");
  };

  // ✅ Verifies directly from Blockchain
  const verifyDocumentOnBlockchain = async (ipfsUrl) => {
    try {
      setVerifying(true);
      setError(null);

      if (!window.ethereum) throw new Error("MetaMask not detected! Please install MetaMask.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Extract the CID (IPFS hash) from the scanned link
      const cid = ipfsUrl.split("/ipfs/")[1]?.trim();
      if (!cid) throw new Error("Invalid QR data. Not a valid IPFS link.");

      console.log("🔍 Searching blockchain for CID:", cid);

      // Search the blockchain for the matching IPFS CID
      let found = null;
      const studentIDs = ["AYUB123", "TEST001", "MZU2025", "123456789012"]; // could be improved with index contract later

      for (const id of studentIDs) {
        const docs = await contract.getDocuments(id);
        const match = docs.find((d) => d.ipfsCID === cid);
        if (match) {
          found = { id, ...match };
          break;
        }
      }

      if (found) {
        setVerificationResult({
          status: "✅ Document Verified",
          studentID: found.id,
          docName: found.docName,
          issuer: found.issuer,
          issuedOn: new Date(Number(found.issuedOn) * 1000).toLocaleString(),
          ipfsCID: found.ipfsCID,
        });
      } else {
        setVerificationResult({
          status: "❌ Not Found",
          message: "No document record found for this CID on blockchain.",
        });
      }
    } catch (err) {
      console.error("Blockchain Verification Error:", err);
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="verify-section">
      <h1 data-aos="fade-up">
        Scan & <span>Verify Document</span>
      </h1>

      <div className="scanner-container" data-aos="zoom-in">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "320px", borderRadius: "12px" }}
        />
      </div>

      {verifying && (
        <div className="progress-area" data-aos="fade-in">
          <div className="blockchain-loader"></div>
          <p className="progress-text">Verifying document on blockchain...</p>
        </div>
      )}

      {verificationResult && (
        <div className="verify-result" data-aos="fade-up">
          <h3>{verificationResult.status}</h3>
          {verificationResult.status === "✅ Document Verified" ? (
            <>
              <p><strong>Document:</strong> {verificationResult.docName}</p>
              <p><strong>Student ID:</strong> {verificationResult.studentID}</p>
              <p><strong>Issuer:</strong> {verificationResult.issuer}</p>
              <p><strong>Issued On:</strong> {verificationResult.issuedOn}</p>
              <p>
                <strong>IPFS CID:</strong>{" "}
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${verificationResult.ipfsCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {verificationResult.ipfsCID}
                </a>
              </p>
            </>
          ) : (
            <p>{verificationResult.message}</p>
          )}
        </div>
      )}

      {error && (
        <div className="error-box" data-aos="fade-up">
          <p style={{ color: "tomato" }}>⚠️ {error}</p>
        </div>
      )}

      {scanResult && !verificationResult && !verifying && (
        <p className="scan-info" data-aos="fade-up">
          Scanned QR: <a href={scanResult}>{scanResult}</a>
        </p>
      )}
    </div>
  );
}

export default QrVerifier;
