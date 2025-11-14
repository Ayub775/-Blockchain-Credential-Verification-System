import React, { useState } from "react";
import "../styles.css";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both fields!");
      return;
    }

    if (isSignup) {
      alert(`Account created successfully for: ${email}`);
    } else {
      alert(`Logged in successfully as: ${email}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" data-aos="fade-up">
        <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>
        <p>
          {isSignup
            ? "Sign up to start managing and verifying your blockchain credentials."
            : "Login with your email to securely access CredChain."}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isSignup ? "Already have an account?" : "New to CredChain?"}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? " Login here" : " Create one"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
