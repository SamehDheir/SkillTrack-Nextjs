"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { api } from "../lib/api";
import Cookies from "js-cookie";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("access_token", res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    Cookies.remove("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
