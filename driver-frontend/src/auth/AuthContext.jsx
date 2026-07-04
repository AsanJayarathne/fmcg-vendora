import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('vendora_driver_token');
    const role  = localStorage.getItem('vendora_driver_role');
    const fullName = localStorage.getItem('vendora_driver_name');
    const profileId = localStorage.getItem('vendora_driver_profile_id');
    return token ? { token, role, fullName, profileId } : null;
  });

  function login(data) {
    // data = { token, role, full_name, email, profile_id, ... }
    localStorage.setItem('vendora_driver_token',      data.token);
    localStorage.setItem('vendora_driver_role',       data.role);
    localStorage.setItem('vendora_driver_name',       data.full_name);
    localStorage.setItem('vendora_driver_profile_id',  data.profile_id ?? '');
    setAuth({ token: data.token, role: data.role, fullName: data.full_name, profileId: data.profile_id });
  }

  function logout() {
    localStorage.removeItem('vendora_driver_token');
    localStorage.removeItem('vendora_driver_role');
    localStorage.removeItem('vendora_driver_name');
    localStorage.removeItem('vendora_driver_profile_id');
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
