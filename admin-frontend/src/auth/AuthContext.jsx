import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('vendora_admin_token');
    const role  = localStorage.getItem('vendora_admin_role');
    const fullName = localStorage.getItem('vendora_admin_name');
    return token ? { token, role, fullName } : null;
  });

  function login(data) {
    // data = { token, role, full_name, email, ... }
    localStorage.setItem('vendora_admin_token', data.token);
    localStorage.setItem('vendora_admin_role',  data.role);
    localStorage.setItem('vendora_admin_name',  data.full_name);
    setAuth({ token: data.token, role: data.role, fullName: data.full_name });
  }

  function logout() {
    localStorage.removeItem('vendora_admin_token');
    localStorage.removeItem('vendora_admin_role');
    localStorage.removeItem('vendora_admin_name');
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
