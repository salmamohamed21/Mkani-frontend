import axios from "axios";
import axiosClient from "./axiosClient";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true; // ✅ مهم جدًا لتفعيل الكوكيز

export const loginUser = async (email, password) => {
  const res = await axiosClient.post('/api/auth/login/', { email, password });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await axiosClient.post('/api/auth/register/', data);
  return res.data;
};

export const registerUserWithFiles = async (formData) => {
  const res = await axiosClient.post('/api/accounts/register/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const passwordReset = async (email) => {
  const res = await axiosClient.post('/api/auth/password-reset/', { email });
  return res.data;
};

export const googleLogin = async (id_token) => {
  const res = await axiosClient.post('/api/auth/google-login/', { id_token });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosClient.post('/api/auth/logout/');
  return res.data;
};

// ✅ استخدم endpoint الصحيح
export const getProfile = () => axiosClient.get("/api/auth/profile/");

export const AuthAPI = {
  register: (data) => axiosClient.post("/api/auth/register/", data),
  login: (data) => axiosClient.post("/api/auth/login/", data),
  googleLogin: (data) => axiosClient.post("/api/auth/google-login/", { id_token: data }),
  logout: () => axiosClient.post("/api/auth/logout/"),
  resetPassword: (data) => axiosClient.post("/api/auth/password-reset/", data),
  resetPasswordConfirm: (data) => axiosClient.post("/api/auth/password-reset-confirm/", data),
  changePassword: (data) => axiosClient.post("/api/auth/password-change/", data),
  getProfile: () => axiosClient.get("/api/auth/profile/"),
  updateProfile: (data) => axiosClient.put("/api/auth/profile/update/", data),
  getRoles: () => axiosClient.get("/api/auth/profile/roles/"),
  addRole: (data) => axiosClient.post("/api/auth/profile/add-role/", data),
};

export const updateProfile = (data) => AuthAPI.updateProfile(data);
export const getResidentProfileData = () => axiosClient.get("/api/auth/profile/resident-data/");
export const getTechnicianProfileData = () => axiosClient.get("/api/auth/profile/technician-data/");
export const getUnionHeadProfileData = () => axiosClient.get("/api/auth/profile/union-head-data/");

export const searchByNationalId = async (nationalId) => {
  const res = await axiosClient.get(`/api/accounts/search-by-national-id/${nationalId}/`);
  return res.data;
};

export const searchByPhoneNumber = async (phoneNumber) => {
  const res = await axiosClient.get(`/api/accounts/search-by-phone-number/${phoneNumber}/`);
  return res.data;
};


export const addResidentApartment = async (formData) => {
  const res = await axiosClient.post('/api/accounts/residents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
