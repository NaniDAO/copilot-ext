import React, { useState } from "react";

function PasswordModal({ onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter your wallet password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordModal;
