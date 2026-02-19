import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apifetch } from "../api/client";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  _count?: {
    followers: number;
    following: number;
    article: number;
  }
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  /** Call after login/signup to refresh user data */
  refresh: () => Promise<void>;
  /** Call after profile update to patch user data locally without a refetch */
  patch: (updates: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  refresh: async () => { },
  patch: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await apifetch("/user/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Single fetch on app mount — shared across all consumers
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchMe();
  }, [fetchMe]);

  const patch = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, patch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
