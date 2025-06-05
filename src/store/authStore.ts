import { create } from "zustand";
import type { AppUser } from "../types";
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as supabaseSignOut,
  getCurrentUser,
} from "../services/authService";

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;

  /** Sign in an existing user with email & password */
  signIn: (email: string, password: string) => Promise<void>;
  /**
   * Sign up a new user with email, password, and displayName.
   * After successful sign-up, `user` in state includes `user_metadata.displayName`.
   */
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Fetch (or re-fetch) the currently authenticated user, updating `user` in state */
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const appUser = await signInWithEmail(email, password);
      set({ user: appUser, loading: false });
    } catch (err: unknown) {
      let message = "SignIn failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
      throw err;
    }
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const user = await signUpWithEmail(email, password, displayName);
      set({ user, loading: false });
    } catch (err: unknown) {
      let message = "SignUp failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await supabaseSignOut();
      set({ user: null, loading: false });
    } catch (err: unknown) {
      let message = "SignOut failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
      throw err;
    }
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false });
    } catch (err: unknown) {
      let message = "FetchUser failed. Please try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
      throw err;
    }
  },
}));
