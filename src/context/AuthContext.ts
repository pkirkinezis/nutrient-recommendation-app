import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

type AuthStatus = "idle" | "loading" | "ready" | "error";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export type { AuthContextValue, AuthStatus };
