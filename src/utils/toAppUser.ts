import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { AppUser } from "../types";

/**
 * Map a Supabase User → our AppUser
 */
export async function toAppUser(supabaseUser: SupabaseUser): Promise<AppUser> {
  type UserMetadata = { displayName?: string };
  const userMetadata = supabaseUser.user_metadata as UserMetadata | undefined;
  const displayName = userMetadata?.displayName || supabaseUser.email || "";
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || "",
    displayName,
  };
}
