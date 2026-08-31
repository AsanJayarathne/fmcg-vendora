import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const INITIAL_REG_FORM = {
  firstName: "",
  lastName: "",
  shopName: "",
  nic: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  shopAddress: "",
  addressLine2: "",
  businessReg: "",
  city: "",
  shopPhone: "",
  regionId: "",
  latitude: "",
  longitude: "",
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('vendora_retailer_token');
    const role  = localStorage.getItem('vendora_retailer_role');
    const fullName = localStorage.getItem('vendora_retailer_name');
    const profileId = localStorage.getItem('vendora_retailer_profile_id');
    const avatarUrl = localStorage.getItem('vendora_retailer_avatar');
    return token ? { token, role, fullName, profileId, avatarUrl } : null;
  });

  const [regForm, setRegForm] = useState(INITIAL_REG_FORM);

  function login(data) {
    localStorage.setItem('vendora_retailer_token',      data.token);
    localStorage.setItem('vendora_retailer_role',       data.role);
    localStorage.setItem('vendora_retailer_name',       data.full_name);
    localStorage.setItem('vendora_retailer_profile_id',  data.profile_id ?? '');
    localStorage.setItem('vendora_retailer_avatar',      data.avatar_url ?? '');
    setAuth({
      token: data.token,
      role: data.role,
      fullName: data.full_name,
      profileId: data.profile_id,
      avatarUrl: data.avatar_url ?? ''
    });
  }

  function updateAvatarUrl(avatarUrl) {
    localStorage.setItem('vendora_retailer_avatar', avatarUrl ?? '');
    setAuth(prev => prev ? { ...prev, avatarUrl } : null);
  }

  function logout() {
    localStorage.removeItem('vendora_retailer_token');
    localStorage.removeItem('vendora_retailer_role');
    localStorage.removeItem('vendora_retailer_name');
    localStorage.removeItem('vendora_retailer_profile_id');
    localStorage.removeItem('vendora_retailer_avatar');
    setAuth(null);
  }

  function resetRegForm() {
    setRegForm(INITIAL_REG_FORM);
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateAvatarUrl, regForm, setRegForm, resetRegForm }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
