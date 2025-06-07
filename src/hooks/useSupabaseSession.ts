import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import type { Session } from "@supabase/supabase-js";

/**
 * Custom hook that gives you the current Supabase session
 * and a loading flag while it’s initializing.
 */
export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1) Get the existing session (if any)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setLoading(false);
    });

    // 2) Subscribe to any future changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMounted) return;
      setSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
