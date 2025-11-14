import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct import
import "../styles.css";

function Issued() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const storedDocs = JSON.parse(localStorage.getItem("issuedDocs") || "[]");
    const enrichedDocs = storedDocs.map((doc) => ({
      ...doc,
      organization: detectOrganization(doc.docName),
    }));
    const sortedDocs = sortDocuments(enrichedDocs, "newest");
    setDocuments(sortedDocs);
    setFilteredDocs(sortedDocs);
  }, []);

  // 🏫 Auto-detect organization based on docName keywords
  const detectOrganization = (docName) => {
    const lowerName = docName.toLowerCase();
    if (lowerName.includes("mizoram")) return "Mizoram University";
    if (lowerName.includes("cbse")) return "Central Board of Secondary Education";
    if (lowerName.includes("jamia")) return "Jamia Millia Islamia";
    if (lowerName.includes("amu")) return "Aligarh Muslim University";
    if (lowerName.includes("aicte")) return "AICTE / Technical Board";
    if (lowerName.includes("board")) return "State Education Board";
    return "Unknown Organization";
  };

  // 🏫 Organization Logos
  const getOrganizationLogo = (org) => {
    const logos = {
      "Mizoram University": "/logos/mzu_logo.png",
      "Central Board of Secondary Education": "/logos/cbse_logo.png",
      "Aligarh Muslim University": "/logos/amu_logo.png",
      "Jamia Millia Islamia": "/logos/jamia_logo.png",
      "AICTE / Technical Board": "/logos/aicte_logo.png",
      "State Education Board": "/logos/stateboard_logo.png",
      "Unknown Organization": "/logos/default_logo.png",
    };
    return logos[org] || logos["Unknown Organization"];
  };

  // 🔍 Search Function
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = documents.filter(
      (doc) =>
        doc.docName.toLowerCase().includes(query.toLowerCase()) ||
        doc.aadhaar.toLowerCase().includes(query.toLowerCase()) ||
        doc.organization.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDocs(filtered);
  };

  // 🔄 Sort Function
  const sortDocuments = (docs, order) => {
    return [...docs].sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return order === "newest" ? timeB - timeA : timeA - timeB;
    });
  };

  const handleSort = (order) => {
    setSortOrder(order);
    const sorted = sortDocuments(filteredDocs, order);
    setFilteredDocs(sorted);
  };

  // 💾 Download JSON Proof
  const handleDownloadProof = (doc) => {
    const proof = {
      Aadhaar: doc.aadhaar,
      Document_Name: doc.docName,
      Organization: doc.organization,
      IPFS_CID: doc.ipfsCID,
      File_Hash: doc.fileHash,
      Transaction_Hash: doc.txHash,
      Block_Number: doc.blockNumber,
      Timestamp: doc.time,
      IPFS_Link: `https://gateway.pinata.cloud/ipfs/${doc.ipfsCID}`,
      Blockchain_Link: `https://sepolia.etherscan.io/tx/${doc.txHash}`,
    };

    const blob = new Blob([JSON.stringify(proof, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.docName.replace(/\s+/g, "_")}_proof.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="issued-container">
      <h1>📜 Issued Credentials</h1>

      {/* 🔍 Search + Sort Controls */}
      <div className="issued-controls">
        <input
          type="text"
          placeholder="Search by Aadhaar, Document, or Organization..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-bar"
        />

        <select
          className="sort-dropdown"
          value={sortOrder}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* 📄 Document Cards */}
      {filteredDocs.length === 0 ? (
        <p className="no-docs">No matching documents found.</p>
      ) : (
        <div className="issued-grid">
          {filteredDocs.map((doc, index) => (
            <div className="issued-card" key={index} data-aos="fade-up">
              {/* 🏫 Organization Header */}
              <div className="org-header">
                <img
                  src={getOrganizationLogo(doc.organization)}
                  alt="Org Logo"
                  className="org-logo"
                />
                <div className="org-info">
                  <h3>{doc.organization}</h3>
                  <p className="org-subtext">{doc.docName}</p>
                </div>
              </div>

              {/* 📄 Document Info */}
              <div className="doc-details">
                <p><strong>Aadhaar ID:</strong> {doc.aadhaar}</p>
                <p><strong>Block:</strong> {doc.blockNumber}</p>
                <p><strong>Issued:</strong> {doc.time}</p>

                <a
                  href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Document on IPFS →
                </a>

                <a
                  href={`https://sepolia.etherscan.io/tx/${doc.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Blockchain Record →
                </a>

                <p className="file-hash">
                  <strong>File Hash:</strong> {doc.fileHash?.slice(0, 35)}...
                </p>
              </div>

              {/* 🧾 QR Code + Download Proof */}
              <div className="proof-section">
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${doc.ipfsCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <QRCodeCanvas
                    value={`https://gateway.pinata.cloud/ipfs/${doc.ipfsCID}`}
                    size={100}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="H"
                    includeMargin={true}
                  />
                </a>
                <button
                  className="download-btn"
                  onClick={() => handleDownloadProof(doc)}
                >
                  ⬇ Download Proof (.json)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Issued;
