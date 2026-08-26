import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase-front.js";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);
const auth = getAuth(app);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const data = await apiRequest(`/api/users/${firebaseUser.uid}`);
          setRole(data?.role || "Customer");
          
          localStorage.setItem("venueflowUser", JSON.stringify(data || firebaseUser));
        } catch (error) {
          console.error("Failed to fetch user role from backend, checking storage fallback:", error);
          const savedUser = localStorage.getItem("venueflowUser");
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              setRole(parsed.role || "Customer");
            } catch (e) {
              setRole("Customer");
            }
          } else {
            setRole("Customer");
          }
        }
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem("venueflowUser");
        localStorage.removeItem("venueflowToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    localStorage.removeItem("venueflowUser");
    localStorage.removeItem("venueflowToken");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};