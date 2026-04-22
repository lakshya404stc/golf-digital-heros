import { createContext, useContext, useState } from "react";
import { getSession, clearSession } from "../lib/store";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const refresh = () => setSession(getSession());
  const logout = () => { clearSession(); setSession(null); };

  return <AuthCtx.Provider value={{ session, refresh, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);