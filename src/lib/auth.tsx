import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSessionId, readDb, setSessionId, signIn as storeSignIn, signUp as storeSignUp } from "./store";
import type { Profile } from "./types";

type AuthContextValue = {
  user: Profile | null;
  role: Profile["role"] | null;
  refresh: () => void;
  signIn: (email: string, password: string) => Profile;
  signUp: Parameters<typeof storeSignUp>[0] extends infer T ? (input: T) => Profile : never;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const refresh = () => {
    const id = getSessionId();
    setUser(id ? readDb().profiles.find((profile) => profile.id === id) ?? null : null);
  };
  useEffect(() => {
    refresh();
    window.addEventListener("barber-db-updated", refresh);
    return () => window.removeEventListener("barber-db-updated", refresh);
  }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user,
    role: user?.role ?? null,
    refresh,
    signIn(email, password) {
      const profile = storeSignIn(email, password);
      setUser(profile);
      return profile;
    },
    signUp(input) {
      const profile = storeSignUp(input);
      setUser(profile);
      return profile;
    },
    signOut() {
      setSessionId(null);
      setUser(null);
    }
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro de AuthProvider");
  return context;
}

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
}

export function RequireAdmin() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Outlet /> : <Navigate to="/app" replace />;
}
