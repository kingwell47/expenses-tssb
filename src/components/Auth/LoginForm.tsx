import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

// TODO: Forgot password function

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading, error } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError("Email is required.");
      return;
    }
    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    try {
      await signIn(email.trim(), password);
      navigate("/"); // redirect after successful login
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
      <h2>Log In</h2>

      {(localError || error) && (
        <div style={{ color: "red" }}>{localError || error}</div>
      )}

      <form onSubmit={handleSubmit}>
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
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
