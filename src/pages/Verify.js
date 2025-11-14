import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ethers } from "ethers";
import "../styles.css";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

function Verify() {
  const [aadhaar, setAadhaar] = useState("");
  const [docName, setDocName] = useState("");
  const [result, setResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const canvasRef = useRef(null);

  // ✅ Background animation
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ✅ Safe provider getter with Sepolia network check
  const getProviderAndContract = async () => {
    let provider;

    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      // Prompt MetaMask to switch if needed
      if (network.chainId !== 11155111n) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // 11155111 hex for Sepolia
        });
      }
    } else if (process.env.REACT_APP_ALCHEMY_RPC) {
      provider = new ethers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_RPC);
    } else {
      throw new Error(
        "No provider available. Install MetaMask or add REACT_APP_ALCHEMY_RPC in .env"
      );
    }

    // ✅ Confirm contract is deployed on that address
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === "0x") {
      throw new Error(
        `No contract found at ${CONTRACT_ADDRESS}. Check your address or network (Sepolia).`
      );
    }

    const signer = window.ethereum ? await provider.getSigner() : provider;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return { provider, contract };
  };

  // ✅ Handle verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setResult(null);

    try {
      const { contract } = await getProviderAndContract();
      const docs = await contract.getDocuments(aadhaar.trim());

      if (!docs.length) {
        setResult({ status: " No records found for this Aadhaar/ID." });
        setVerifying(false);
        return;
      }

      const matchedDoc = docs.find(
        (d) => d.docName.toLowerCase() === docName.toLowerCase()
      );

      if (matchedDoc) {
        setResult({
          status: "✅ Verified",
          owner: aadhaar,
          document: matchedDoc.docName,
          ipfsHash: matchedDoc.ipfsCID,
          issuer: matchedDoc.issuer,
          issuedOn: new Date(Number(matchedDoc.issuedOn) * 1000).toLocaleString(),
        });
      } else {
        setResult({
          status: "Record Not Found",
          message:
            "No document matching this name found under the provided Aadhaar ID.",
        });
      }
    } catch (err) {
      console.error(err);
      setResult({ status: "Error", message: err.message });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="verify-section">
      <canvas ref={canvasRef} className="verify-bg"></canvas>

      <div className="verify-card" data-aos="fade-up">
        <h1>
          Verify a <span>Credential</span>
        </h1>
        <p>
          Enter Aadhaar/Unique ID and the document name to check authenticity on
          blockchain.
        </p>

        <form className="verify-form" onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter Aadhaar / Unique ID"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Document Name (e.g. 10th Certificate)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            {verifying ? "Verifying..." : "Verify Document"}
          </button>
        </form>

        {verifying && (
          <div className="progress-area">
            <div className="blockchain-loader"></div>
            <p className="progress-text">Verifying on blockchain...</p>
          </div>
        )}

        {result && (
          <div className="verify-result" data-aos="fade-up">
            <h3>{result.status}</h3>
            {result.status === " Verified" ? (
              <>
                <p><strong>Document:</strong> {result.document}</p>
                <p><strong>Issuer:</strong> {result.issuer}</p>
                <p><strong>IPFS CID:</strong> {result.ipfsHash}</p>
                <p><strong>Issued On:</strong> {result.issuedOn}</p>
              </>
            ) : (
              <p>{result.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;
