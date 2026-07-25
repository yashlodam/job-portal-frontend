const { default: axios } = require("axios")

const BASE_URL = "http://localhost:8080/profile"


export const getProfile = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/get/${id}`);

    console.log("Profile fetched successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const updateProfile = async (profile) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}/update`,
      profile,
    
    );

    console.log("Profile updated successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};