import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const NavBar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err: unknown) {
      let message = "Failed to log out.";
      if (err instanceof Error) {
        message = err.message;
      }
      console.error("Logout failed:", message);
    }
  };

  return (
    <nav className="navbar shadow-xl">
      <div className="navbar-start">
        <Link to="/">ExpenseTracker</Link>
      </div>
      {user && (
        <>
          <div className="navbar-center">
            <Link className="link" to="/transactions">
              Transactions
            </Link>
          </div>
          <div className="navbar-end gap-4">
            <p>Welcome {user.displayName}</p>
            <button onClick={handleLogout} className="btn btn-accent">
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
