import { useAuth } from "../auth";

/**
 * The signed-in user. Reads from AuthProvider, so it never fetches on its own
 * and every caller shares the same object.
 */
export default function useUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}
