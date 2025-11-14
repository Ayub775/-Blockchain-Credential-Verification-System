import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ethers } from "ethers";
import "../styles.css";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [aadhaar, setAadhaar] = useState("");
  const [docName, setDocName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [txDetails, setTxDetails] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // ✅ Upload file to Pinata via IPFS
  const uploadToIpfs = async (file) => {
    try {
      if (!aadhaar || !docName) {
        alert("Please enter both Aadhaar ID and Document Name before uploading.");
        return;
      }

      setIsUploading(true);
      setUploadStatus("⏳ Uploading to IPFS via Pinata...");

      const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
      const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

      if (!PINATA_JWT) throw new Error("Missing Pinata JWT. Check your .env file.");

      const formData = new FormData();
      formData.append("file", file, file.name);

      // Optional metadata
      formData.append(
        "pinataMetadata",
        JSON.stringify({
          name: file.name,
          keyvalues: { uploadedBy: "Ayub", category: "Student Document" },
        })
      );

      const response = await fetch(PINATA_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Pinata upload failed (${response.status}): ${errText}`);
      }

      const data = await response.json();
      if (!data.IpfsHash) throw new Error("Invalid IPFS hash returned from Pinata.");

      const ipfsData = {
        name: file.name,
        cid: data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
      };

      setUploadedFile(ipfsData);
      setUploadStatus("✅ File uploaded successfully to IPFS!");
      alert(`✅ ${file.name} uploaded successfully!\nCID: ${data.IpfsHash}`);

      // 🧩 Generate SHA-256 file hash
      const fileHash = await generateFileHash(file);

      // ✅ Store on blockchain
      await registerOnBlockchain(aadhaar, docName, data.IpfsHash, fileHash);
    } catch (error) {
      console.error("❌ IPFS Upload Error:", error);
      setUploadStatus("❌ Upload failed. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  // 🧠 Generate SHA-256 hash of file
  const generateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // ✅ Detect organization based on keywords
  const detectOrganization = (docName) => {
    const lower = docName.toLowerCase();
    if (lower.includes("mzu") || lower.includes("mizoram")) return "Mizoram University";
    if (lower.includes("cbse")) return "Central Board of Secondary Education";
    if (lower.includes("amu")) return "Aligarh Muslim University";
    if (lower.includes("jamia")) return "Jamia Millia Islamia";
    if (lower.includes("btech") || lower.includes("engineering")) return "AICTE / Technical Board";
    if (lower.includes("result") || lower.includes("marksheet")) return "State Education Board";
    return "Unknown Organization";
  };

  // ✅ Store document details on blockchain and locally
  const registerOnBlockchain = async (studentID, docName, ipfsCID, fileHash) => {
    try {
      setUploadStatus("🧩 Recording document on blockchain...");

      if (!window.ethereum) throw new Error("MetaMask not detected!");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.issueDocument(studentID, docName, ipfsCID, fileHash);
      const receipt = await tx.wait();

      const block = await provider.getBlock(receipt.blockNumber);
      const timestamp = new Date(block.timestamp * 1000).toLocaleString();

      // ✅ Store transaction details
      const txInfo = {
        txHash: receipt.transactionHash || "N/A",
        blockNumber: receipt.blockNumber || "N/A",
        time: timestamp,
        ipfsCID,
        fileHash,
      };

      setTxDetails(txInfo);
      setUploadStatus("✅ Document recorded successfully on blockchain!");

      // ✅ Save document in localStorage
      const newDoc = {
        aadhaar: studentID,
        docName,
        ipfsCID,
        fileHash,
        txHash: receipt.transactionHash || "N/A",
        blockNumber: receipt.blockNumber || "N/A",
        time: timestamp,
        organization: detectOrganization(docName),
      };

      const existingDocs = JSON.parse(localStorage.getItem("issuedDocs") || "[]");
      localStorage.setItem("issuedDocs", JSON.stringify([newDoc, ...existingDocs]));
    } catch (err) {
      console.error("❌ Blockchain Error:", err);
      alert("❌ Failed to record document on blockchain. See console for details.");
      setUploadStatus("❌ Blockchain recording failed.");
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadToIpfs(file);
      e.target.value = "";
    }
  };

  return (
    <div className="home-container">
      <div className="watermark"></div>

      {/* ---------- HERO SECTION ---------- */}
      <div className="hero-section" data-aos="fade-up">
        <h1>
          Blockchain Credential <span>Verification System</span>
        </h1>
        <p>
          Securely issue, verify, and manage academic or government credentials
          on blockchain — ensuring transparency, authenticity, and trust.
        </p>

        {/* Input Fields */}
        <div className="input-section" data-aos="fade-up" data-aos-delay="150">
          <input
            type="text"
            placeholder="Enter Aadhaar / Unique ID"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Enter Document Name (e.g., 10th Certificate)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* Upload & View Buttons */}
        <div className="cta-buttons" data-aos="zoom-in" data-aos-delay="200">
          <button
            className="btn-primary"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span> Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </button>

          <button
            className="btn-outline"
            onClick={() => navigate("/issued")}
            disabled={isUploading}
          >
            View Uploaded Documents
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Upload Status */}
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

        {/* Uploaded File Preview */}
        {uploadedFile && (
          <div className="upload-preview" data-aos="fade-up" data-aos-delay="300">
            <p>📄 <strong>{uploadedFile.name}</strong> uploaded successfully.</p>
            <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
              View on IPFS →
            </a>
          </div>
        )}

        {/* ✅ Blockchain Transaction Details */}
        {txDetails && (
          <div className="tx-details" data-aos="fade-up" data-aos-delay="400">
            <h3>✅ Blockchain Confirmation</h3>
            <p><strong>Transaction Hash:</strong>{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${txDetails?.txHash || "#"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txDetails?.txHash
                  ? `${txDetails.txHash.slice(0, 10)}...${txDetails.txHash.slice(-8)}`
                  : "N/A"}
              </a>
            </p>
            <p><strong>Block Number:</strong> {txDetails?.blockNumber || "N/A"}</p>
            <p><strong>Timestamp:</strong> {txDetails?.time || "N/A"}</p>
            <p><strong>IPFS CID:</strong>{" "}
              <a
                href={`https://gateway.pinata.cloud/ipfs/${txDetails?.ipfsCID || ""}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {txDetails?.ipfsCID || "N/A"}
              </a>
            </p>
            <p><strong>File Hash:</strong>{" "}
              {txDetails?.fileHash
                ? `${txDetails.fileHash.slice(0, 25)}...`
                : "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* ---------- FEATURES SECTION ---------- */}
      <section className="features-section" data-aos="fade-up" data-aos-delay="300">
        <h2>Our Blockchain Capabilities</h2>
        <p>
          Explore how our decentralized verification system ensures trust,
          transparency, and authenticity across academic, corporate, and
          government sectors.
        </p>

        <div className="features-container">
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="400">
            <h3>🔗 Document Verification</h3>
            <p>
              Verify academic and professional documents with tamper-proof
              blockchain records — ensuring authenticity and trust.
            </p>
            <a href="#">Learn More →</a>
          </div>

          <div className="feature-card" data-aos="zoom-in" data-aos-delay="500">
            <h3>🧠 Smart Issuance</h3>
            <p>
              Institutions can issue certificates and IDs directly to the
              blockchain, securely linked to each recipient’s identity.
            </p>
            <a href="#">Learn More →</a>
          </div>

          <div className="feature-card" data-aos="zoom-in" data-aos-delay="600">
            <h3>💼 Digital Identity</h3>
            <p>
              Each student or professional receives a unique blockchain-backed
              ID, simplifying background checks and credential sharing.
            </p>
            <a href="#">Learn More →</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
