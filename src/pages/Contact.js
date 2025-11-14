import React, { useState } from "react";

export default function Contact() {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setSent("Thanks — your message is noted. (This is a demo form)");
    setMsg("");
  };

  return (
    <section className="page">
      <div className="card">
        <h2>Contact</h2>
        <form onSubmit={submit}>
          <input placeholder="Your email" required />
          <textarea placeholder="Message" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <div className="actions">
            <button type="submit">Send</button>
          </div>
        </form>
        <p className="status">{sent}</p>
      </div>
    </section>
  );
}
