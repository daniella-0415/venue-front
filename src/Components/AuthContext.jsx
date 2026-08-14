import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase.js";

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
          const response = await fetch(`http://localhost:3000/api/users/${firebaseUser.uid}`);
          
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
          } else {
            // DEVELOPMENT WORKAROUND: Fallback role configuration if user profile doesn't exist yet
            setRole("Customer");
          }
        } catch (error) {
          console.error("Failed to fetch user role, using development fallback:", error);
          setRole("Customer");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
