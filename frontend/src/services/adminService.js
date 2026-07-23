import api from "./api";

export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post("/admin/register", adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await api.get("/admin/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};