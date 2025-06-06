import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuthStore();

  // Initiate States
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Clear local error
    setLocalError(null);

    // Check if information is filled in
    if (!displayName.trim()) {
      setLocalError("DisplayName is required");
      return;
    }
    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }
    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    try {
      await signUp(email.trim(), password, displayName.trim());
      navigate("/"); // Redirect to dashboard after successful signup
    } catch (err: unknown) {
      let message = "Failed to sign up.";
      if (err instanceof Error) {
        message = err.message;
      }
      setLocalError(message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>

      {(localError || error) && (
        <div style={{ color: "red" }}>{localError || error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName">Display Name</label>
          <br />
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
