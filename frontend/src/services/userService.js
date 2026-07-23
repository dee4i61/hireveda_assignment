import api from "./api";

// Create a new user — supports image upload via FormData
export const createUser = async (userData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(userData));

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    const response = await api.post("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user — supports image upload via FormData
export const updateUser = async (id, userData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(userData));

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    const response = await api.put(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};