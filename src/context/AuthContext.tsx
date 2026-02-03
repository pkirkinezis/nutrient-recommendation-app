import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from "firebase/auth";
import { enableIndexedDbPersistence } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../config/firebase";

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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ensurePersistence = async (): Promise<void> => {
  if (!db) return;
  try {
    await enableIndexedDbPersistence(db);
  } catch {
    // Ignore persistence errors (multiple tabs / unsupported browsers).
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured || !auth) {
      setStatus("ready");
      return;
    }
    void ensurePersistence();
    setStatus("loading");
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setStatus("ready");
    });
    return unsubscribe;
  }, [configured]);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
    if (!auth) return;
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    }
  }, []);

  const registerWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
    if (!auth) return;
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register.");
    }
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<void> => {
    if (!auth || !googleProvider) return;
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google.");
    }
  }, []);

  const signOutUser = useCallback(async (): Promise<void> => {
    if (!auth) return;
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out.");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      error,
      isConfigured: configured,
      signInWithEmail,
      registerWithEmail,
      signInWithGoogle,
      signOutUser,
    }),
    [user, status, error, configured, signInWithEmail, registerWithEmail, signInWithGoogle, signOutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
