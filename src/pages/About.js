import React from "react";

export default function About() {
  return (
    <section className="page">
      <div className="card">
        <h2>About CredentialChain</h2>
        <p>
          CredentialChain is a blockchain-backed credential verification system that stores file
          pointers on IPFS and records cryptographic file hashes on Ethereum (testnet).
          Documents can be uploaded by authorized issuers and verified by anyone with the original file.
        </p>
        <ul>
          <li>IPFS for decentralized file storage (Pinata gateway)</li>
          <li>Ethereum (Sepolia) for immutable verification</li>
          <li>QR-backed PDF certificate for convenient verification</li>
        </ul>
      </div>
    </section>
  );
}
