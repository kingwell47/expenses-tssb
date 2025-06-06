import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";
import type { AppUser } from "../types";
import { toAppUser } from "../utils/toAppUser";

/**
 * Sign up a new user with email and password.
 * @param email – User’s email address
 * @param password – User’s chosen password
 * @param displayName – User’s display name
 * @returns The created User object
 * @throws Error if sign-up fails
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AppUser> {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
    },
  });

  if (error || !user) throw new Error(error?.message || "Sign-up failed");

  return toAppUser(user);
}

/**
 * Sign in an existing user with email and password.
 * @param email – User’s email address
 * @param password – User’s password
 * @returns The Session object (contains access_token, user, etc.)
 * @throws Error if sign-in fails
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AppUser> {
  const {
    data: { session },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Sign-in failed: ${error.message}`);
  }
  if (!session) {
    throw new Error("Sign-in failed: no session returned");
  }

  return toAppUser(session.user);
}

/**
 * Sign out the currently authenticated user.
 * @returns void
 * @throws Error if sign-out fails
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Sign-out failed: ${error.message}`);
  }
}

/**
 * Fetch the currently authenticated user (if any).
 * @returns The User object, or null if not signed in
 * @throws Error if the request to getUser fails
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there’s no session, Supabase may set “Auth session missing!”.
  // Treat that as “no user” rather than an exception.
  if (error && error.message !== "Auth session missing!") {
    throw new Error(error.message);
  }

  if (!user) {
    return null;
  }
  return toAppUser(user);
}

/**
 * Fetch the current session (access_token, refresh_token, etc.).
 * @returns The Session object, or null if not signed in
 * @throws Error if the request to getSession fails
 */
export async function getCurrentSession(): Promise<Session | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Error fetching session: ${error.message}`);
  }
  return session;
}
