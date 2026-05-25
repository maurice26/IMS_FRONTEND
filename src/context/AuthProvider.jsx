import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const normalizeUser = (data) => {
  if (!data) return null;
  return {
    ...data,
    role: data.role
      ? data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase()
      : data.role,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(normalizeUser(savedUser)); // ✅ normalize on load
  }, []);

  const login = (data) => {
    const normalized = normalizeUser(data);         // ✅ normalize on login
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};