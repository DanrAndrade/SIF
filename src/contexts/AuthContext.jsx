import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('chocosul_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = (email) => {
    const mockUser = { name: "Cliente", email };
    setUser(mockUser);
    localStorage.setItem('chocosul_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chocosul_user');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_mode');
    // BASE_URL respeita a subpasta em produção ('/sif-novo-h7k2x9/') e '/' em dev
    window.location.href = import.meta.env.BASE_URL + 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
