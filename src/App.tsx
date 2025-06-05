import { useEffect } from "react";
import { supabase } from "./services/supabaseClient";
import { useAuthStore } from "./store/authStore";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/**
 * AuthListener handles:
 * 1. Initial fetch of the current user on mount
 * 2. Listening for any auth state changes (sign-in, sign-out)
 *    and mapping Supabase User → AppUser before storing.
 */
function AuthListener() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    // 1) On mount, attempt to load any existing session
    fetchUser().catch((err) => {
      console.error("Failed to fetch current user:", err.message);
    });

    // 2) Subscribe to auth state changes; call fetchUser() on any change
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        // If there is a session.user, re-fetch and update the store
        fetchUser().catch((err) => {
          console.error(
            "Failed to update user after auth change:",
            err.message
          );
        });
      } else {
        // If user signed out, clear the store
        useAuthStore.setState({ user: null });
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUser]);

  return null;
}

function App() {
  return (
    <>
      {/* Mount the AuthListener at the root so it runs on every route */}
      <AuthListener />
      <h1>Hello World</h1>
    </>
  );
}

export default App;
