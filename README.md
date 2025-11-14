CredChain – Blockchain Credential Verification System

CredChain is a decentralised document issuance and verification system built using Blockchain, Smart Contracts (Solidity), IPFS, and React.js.
It provides a tamper-proof, transparent, and secure method for issuing and verifying academic or government documents.

Why CredChain?

Traditional document verification is slow, insecure, and prone to forgery.
CredChain solves this by storing document hashes on blockchain and storing files on IPFS, ensuring:

✔ No tampering
✔ No centralised dependency
✔ Instant verification
✔ Trustless verification (no need to "trust" the issuer)

Demo Screenshots
/screenshots/home.png
/screenshots/upload.png
/screenshots/issued.png
/screenshots/verify.png
/screenshots/qr-verifier.png
🎯 Key Features
🔗 1. Blockchain-Based Document Issuance

Documents are issued via a verified institution wallet.

SHA-256 file hash stored permanently on the Ethereum blockchain.

Immutable, cannot be changed or deleted.

🧾 2. IPFS Storage (Pinata)

Original document stored on IPFS.

Only the CID is stored on-chain (lightweight & secure).

Users can view/download via the IPFS gateway.

✔️ 3. Instant Document Verification

Verify using:

Aadhaar/Unique ID

Document Name

File hash

QR Code

Returns: issuer, timestamp, IPFS CID, and authenticity status.

🧪 4. QR Code Features

Each issued document receives a unique QR code.

Anyone can scan → instantly verify authenticity.

🎨 5. Smooth UI/UX

Built with React.js

AOS animations

Fully responsive layout

🧠 How It Works
1️⃣ Document Upload

User uploads a PDF/image → file goes to Pinata → IPFS CID generated.

2️⃣ File Hashing

A SHA-256 hash of the document is created inside the browser.

3️⃣ Blockchain Recording

Smart contract stores:

Aadhaar/Student ID

Document Name

IPFS CID

File Hash

Timestamp

Issuer Wallet Address

4️⃣ Verification

When the verifier checks a document:

Fetches the stored record

Matches file hash & metadata

Shows authentic/invalid status

🏗️ Tech Stack
Frontend

React.js

AOS (Animate on Scroll)

QRCode.react

Tailwind / CSS

Blockchain

Solidity

Ethereum (Sepolia Testnet)

Ethers.js

MetaMask

Storage

IPFS

Pinata Gateway

📜 Smart Contract (Solidity)

Main functions:

function issueDocument(
    string memory studentID,
    string memory docName,
    string memory ipfsCID,
    string memory fileHash
) public onlyOwner;

function getDocuments(string memory studentID) 
    public view returns (Document[] memory);

function verifyDocument(
    string memory studentID,
    string memory fileHash
) public view returns (bool, uint256);

🛠️ Setup Instructions (Developer Guide)
1. Clone Repository
git clone https://github.com/your-username/credchain.git
cd credchain

2. Install Dependencies
npm install

3. Add Required API Keys

Create a .env file:

REACT_APP_PINATA_JWT=your_pinata_jwt
REACT_APP_ALCHEMY_RPC=your_alchemy_rpc

4. Run the App
npm start

🧑‍🤝‍🧑 Team – Project Contributors
👨‍💻 Mohamad Ayub Ansari

Frontend Developer | Smart Contract Engineer

👨‍💻 Vikash Chaudhary

Backend Developer | Blockchain Integration

👨‍💻 Aman Raj

UI/UX Designer | System Architecture

🌍 Use Cases

Universities issuing digital degrees

Government documents & ID verification

Organisations verifying certificates

Background verification systems

Online exam boards & results

🏆 What Makes CredChain Unique?
⭐ 1. Fully Decentralized

No central server → no single point of failure.

⭐ 2. Strong Anti-Forgery

Hash mismatch = fake document detected instantly.

⭐ 3. QR-Based Verification

Offline verification becomes possible.

⭐ 4. Publicly Verifiable

Anyone can verify using a blockchain explorer.

📄 License

This project is licensed under the MIT License.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
