import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('vendora_token');
    const role  = localStorage.getItem('vendora_role');
    const profileId = localStorage.getItem('vendora_profile_id');
    return token ? { token, role, profileId } : null;
  });

  function login(data) {
    // data = { token, role, profile_id, full_name, ... }
    localStorage.setItem('vendora_token',      data.token);
    localStorage.setItem('vendora_role',       data.role);
    localStorage.setItem('vendora_profile_id', data.profile_id ?? '');
    setAuth({ token: data.token, role: data.role, profileId: data.profile_id });
  }

  function logout() {
    localStorage.removeItem('vendora_token');
    localStorage.removeItem('vendora_role');
    localStorage.removeItem('vendora_profile_id');
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
